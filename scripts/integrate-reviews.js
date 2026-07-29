// Scoop Sense — review-data integrator.
//
// Validates researched review JSON and merges a `reviews` object into the
// matching products in data/products.js. Run with the directory holding the
// JSON files:
//
//   node scripts/integrate-reviews.js <json-dir> [--dry]
//
// Input shape, per file (an array):
//   [{ "id": "c4-original",
//      "seller": { "rating": 4.6, "count": 12043,
//                  "source": { "url": "...", "label": "..." },
//                  "checked": "July 2026" },
//      "community": { "takeaway": "...",
//                     "points": [{ "label": "...", "tone": "mixed", "note": "..." }],
//                     "sources": [{ "url": "...", "label": "...", "quote": "..." }] } }]
//
// Honesty rules enforced here, because this is the file that decides what the
// site is willing to publish about other people's opinions:
//   - No Amazon ratings. The Associates terms do not permit displaying their
//     ratings data, and the site links to Amazon as an affiliate.
//   - Quotes are capped and must be verbatim; the researcher is responsible
//     for that, this script caps the length and rejects the obvious tells.
//   - No disease-claim language and no dollar figures, same as product copy.
//   - seller or community may be null. Null means "we found nothing real",
//     which the page states plainly. Padding it would be inventing reviews.
//
// Refuses to write anything if any entry fails validation. Safe to re-run:
// a product that already carries reviews is skipped.

"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const DATA = path.join(ROOT, "data", "products.js");

const dir = process.argv[2];
const DRY = process.argv.includes("--dry");
if (!dir) {
  console.error("usage: node scripts/integrate-reviews.js <json-dir> [--dry]");
  process.exit(1);
}

const src0 = fs.readFileSync(DATA, "utf8");
const { PRODUCTS } = new Function(src0 + "\nreturn { PRODUCTS, FEATURED_IDS };")();
const byId = new Map(PRODUCTS.map((p) => [p.id, p]));

const TONES = ["positive", "mixed", "negative"];
const CLAIM_RE = /\b(treat|cure|prevent|diagnos)/i;
const QUOTE_MAX = 200;

const errors = [];
const entries = [];

for (const f of fs.readdirSync(dir).filter((n) => n.endsWith(".json"))) {
  let rows;
  try { rows = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")); }
  catch (e) { errors.push(`${f}: parse error — ${e.message}`); continue; }
  if (!Array.isArray(rows)) { errors.push(`${f}: not an array`); continue; }

  for (const r of rows) {
    const tag = `${f}/${r && r.id}`;
    if (!r || !r.id) { errors.push(`${tag}: entry has no id`); continue; }
    if (!byId.has(r.id)) { errors.push(`${tag}: unknown product id`); continue; }
    if (byId.get(r.id).reviews) { console.log(`skip (already has reviews): ${r.id}`); continue; }
    if (!r.seller && !r.community) { console.log(`skip (nothing found): ${r.id}`); continue; }

    if (r.seller) {
      const s = r.seller;
      if (typeof s.rating !== "number" || s.rating < 0 || s.rating > 5) errors.push(`${tag}: rating out of range`);
      if (!Number.isInteger(s.count) || s.count < 1) errors.push(`${tag}: count must be a positive integer`);
      if (!s.source || !/^https:\/\//.test(s.source.url || "")) errors.push(`${tag}: seller source url missing or not https`);
      if (!s.source || !s.source.label) errors.push(`${tag}: seller source label missing`);
      if (/amazon\./i.test((s.source && s.source.url) || "")) errors.push(`${tag}: Amazon ratings may not be displayed — use the brand's own page`);
      if (!s.checked) errors.push(`${tag}: seller.checked (month + year) missing`);
    }

    if (r.community) {
      const c = r.community;
      if (!c.takeaway) errors.push(`${tag}: community.takeaway missing`);
      if (!Array.isArray(c.points) || c.points.length < 2 || c.points.length > 4) errors.push(`${tag}: community.points must hold 2–4 entries`);
      else for (const pt of c.points) {
        if (!pt.label || !pt.note) errors.push(`${tag}: a point is missing label or note`);
        if (TONES.indexOf(pt.tone) === -1) errors.push(`${tag}: bad tone "${pt.tone}"`);
      }
      if (!Array.isArray(c.sources) || c.sources.length < 1 || c.sources.length > 4) errors.push(`${tag}: community.sources must hold 1–4 entries`);
      else for (const s of c.sources) {
        if (!/^https?:\/\//.test(s.url || "")) errors.push(`${tag}: source url missing or malformed`);
        if (!s.label) errors.push(`${tag}: source label missing`);
        if (s.quote && s.quote.length > QUOTE_MAX) errors.push(`${tag}: quote longer than ${QUOTE_MAX} characters`);
        // A "quote" that reads like our own prose is a paraphrase, not a quote.
        if (s.quote && /^(users|people|reviewers|many)\b/i.test(s.quote.trim())) {
          errors.push(`${tag}: quote looks paraphrased ("${s.quote.slice(0, 40)}…") — quotes must be verbatim`);
        }
      }
      // The brand's own site is marketing, not community.
      const host = (u) => { try { return new URL(u).hostname.replace(/^www\./, ""); } catch (e) { return ""; } };
      const brandSlug = byId.get(r.id).brand.toLowerCase().replace(/[^a-z0-9]/g, "");
      for (const s of c.sources || []) {
        if (brandSlug && host(s.url).replace(/[^a-z0-9]/g, "").indexOf(brandSlug) !== -1) {
          errors.push(`${tag}: ${host(s.url)} is the brand's own site — that is marketing, not community`);
        }
      }
    }

    const text = JSON.stringify(r);
    if (CLAIM_RE.test(text)) errors.push(`${tag}: disease-claim language — review manually`);
    if (/\$\d/.test(text)) errors.push(`${tag}: dollar amount in copy`);

    entries.push(r);
  }
}

if (errors.length) {
  console.error("VALIDATION FAILED:\n" + errors.map((e) => "  - " + e).join("\n"));
  process.exit(1);
}
if (!entries.length) { console.log("Nothing new to integrate."); process.exit(0); }

/* ---- merge ---------------------------------------------------------------
   Textual insertion after each entry's labelVerified line, so the file's
   comments and hand-formatting survive. Both key styles exist in the file. */

let src = src0;
let merged = 0;

for (const r of entries) {
  const idRe = new RegExp('"?id"?\\s*:\\s*"' + r.id + '"');
  const m = idRe.exec(src);
  if (!m) { console.error("could not locate " + r.id); process.exit(1); }

  const nextRe = /\n\s*"?id"?\s*:\s*"/g;
  nextRe.lastIndex = m.index + m[0].length;
  const next = nextRe.exec(src);
  const end = next ? next.index : src.length;

  const anchorRe = /"?labelVerified"?\s*:/g;
  anchorRe.lastIndex = m.index;
  const anchor = anchorRe.exec(src);
  if (!anchor || anchor.index > end) { console.error("no anchor for " + r.id); process.exit(1); }
  const lineEnd = src.indexOf("\n", anchor.index);

  const quoted = /"labelVerified"/.test(src.slice(anchor.index, anchor.index + 20));
  const pad = (/\n(\s*)"?labelVerified/.exec(src.slice(Math.max(0, anchor.index - 40), anchor.index + 20)) || [, "    "])[1];
  const key = (k) => (quoted ? `"${k}"` : k);

  const payload = { seller: r.seller || null, community: r.community || null };
  const body = JSON.stringify(payload, null, 2)
    .split("\n")
    .map((line, i) => (i === 0 ? line : pad + line))
    .join("\n");

  const block = `\n${pad}${key("reviews")}: ${body},`;
  src = src.slice(0, lineEnd) + block + src.slice(lineEnd);
  merged++;
}

if (!DRY) {
  fs.writeFileSync(DATA, src, "utf8");
  const check = new Function(fs.readFileSync(DATA, "utf8") + "\nreturn PRODUCTS;")();
  console.log(`data/products.js still parses — ${check.length} products.`);
}

console.log(`${DRY ? "DRY RUN — would merge" : "Merged"} reviews for ${merged} products.`);
console.log("Next: node scripts/build-product-pages.js");
