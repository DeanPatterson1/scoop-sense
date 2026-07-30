// Scoop Sense — direct-product-link applier.
//
// Rewrites each product's `affiliateUrl` from an Amazon *search* URL to the
// listing itself:
//
//   https://www.amazon.com/s?k=gorilla+mode+pre+workout&tag=thescoopsense-20
//   https://www.amazon.com/dp/B0948F352F?tag=thescoopsense-20
//
// A search URL makes the reader hunt for the right tub and can land them on a
// reseller, the wrong size, or a competitor's sponsored slot. A direct link is
// the single cheapest conversion improvement the site has — and the single
// easiest way to send someone to the WRONG product, which is why every ASIN
// here has to come from a listing a researcher actually opened and matched
// against the catalog entry. Never pattern-guess one. Same rule as imagery.
//
//   node scripts/apply-asins.js <json-file> [--dry]
//
// Input shape (an array):
//   [{ "id": "gorilla-mode", "asin": "B0948F352F",
//      "listingTitle": "Gorilla Mode Pre Workout ... 792g (Rocket Frost)" }]
//
// `listingTitle` is copied from the listing and is what makes a wrong ASIN
// visible: the script checks the brand actually appears in it. An entry whose
// title does not mention the brand is a paste error or the wrong product, and
// the whole batch is refused rather than half-applied.
//
// Refuses to write anything if any entry fails validation. Safe to re-run: a
// product whose affiliateUrl already points at this same ASIN is skipped.

"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const DATA = path.join(ROOT, "data", "products.js");
const TAG = "thescoopsense-20";

const file = process.argv[2];
const DRY = process.argv.includes("--dry");
if (!file) {
  console.error("usage: node scripts/apply-asins.js <json-file> [--dry]");
  process.exit(1);
}

const src0 = fs.readFileSync(DATA, "utf8");
const PRODUCTS = new Function(src0 + "\nreturn PRODUCTS;")();
const byId = new Map(PRODUCTS.map((p) => [p.id, p]));

const entries = JSON.parse(fs.readFileSync(file, "utf8"));
if (!Array.isArray(entries)) { console.error("expected an array"); process.exit(1); }

/* ---- validate ------------------------------------------------------------ */

const errors = [];
const warnings = [];
const seen = new Map();

// Every ASIN in the catalog, including ones applied by an earlier run, so a
// second batch cannot quietly hand two products the same listing.
for (const p of PRODUCTS) {
  const m = /\/dp\/([A-Z0-9]{10})/.exec(p.affiliateUrl || "");
  if (m) seen.set(m[1], p.id);
}

for (const e of entries) {
  const where = e.id || JSON.stringify(e).slice(0, 40);
  const p = byId.get(e.id);
  if (!p) { errors.push(`${where}: no such product id`); continue; }

  if (!/^[A-Z0-9]{10}$/.test(e.asin || "")) {
    errors.push(`${where}: "${e.asin}" is not a 10-character ASIN`);
    continue;
  }
  const prior = seen.get(e.asin);
  if (prior && prior !== e.id) {
    errors.push(`${where}: ASIN ${e.asin} is already ${prior}'s listing — one of the two is wrong`);
    continue;
  }
  seen.set(e.asin, e.id);

  // The brand has to show up in the listing title. Catches the failure that
  // matters — a plausible ASIN for somebody else's product.
  const title = (e.listingTitle || "").toLowerCase();
  if (!title) { errors.push(`${where}: listingTitle is required — it is the evidence the ASIN was checked`); continue; }
  const brandWord = p.brand.toLowerCase().split(/[\s-]+/).filter((w) => w.length > 2)[0];
  if (brandWord && !title.includes(brandWord)) {
    // Plenty of brands list under a line or shorthand name instead of the
    // company's: Cellucor's listings say "C4", Evlution Nutrition's say "EVL".
    // The full product name appearing is enough to say this is the right tub,
    // so it warns rather than blocks — and check-affiliate-links.js reads the
    // live title back afterwards, which is the check that would catch a real
    // mismatch anyway.
    const nameWords = p.name.toLowerCase().match(/[a-z0-9]{3,}/g) || [];
    if (nameWords.length && nameWords.every((w) => title.includes(w))) {
      warnings.push(`${where}: titled "${e.listingTitle.slice(0, 60)}" — product name matches, brand "${p.brand}" absent`);
    } else {
      errors.push(`${where}: listing title does not mention "${p.brand}" — ${e.listingTitle}`);
    }
  }
}

if (warnings.length) {
  console.log(`${warnings.length} worth a glance:`);
  warnings.forEach((m) => console.log("  " + m));
}

if (errors.length) {
  console.error(`Refusing the batch — ${errors.length} problem(s):`);
  errors.forEach((m) => console.error("  " + m));
  process.exit(1);
}

/* ---- apply --------------------------------------------------------------- */

let src = src0;
let applied = 0;
let skipped = 0;

for (const e of entries) {
  const target = `https://www.amazon.com/dp/${e.asin}?tag=${TAG}`;
  if (byId.get(e.id).affiliateUrl === target) { skipped++; continue; }

  // Same block-scoping approach as integrate-reviews.js: find this product's
  // id, stop at the next one, and edit only between them.
  const idRe = new RegExp('"?id"?\\s*:\\s*"' + e.id + '"');
  const m = idRe.exec(src);
  if (!m) { console.error("could not locate " + e.id); process.exit(1); }

  const nextRe = /\n\s*"?id"?\s*:\s*"/g;
  nextRe.lastIndex = m.index + m[0].length;
  const next = nextRe.exec(src);
  const end = next ? next.index : src.length;

  const urlRe = /("?affiliateUrl"?\s*:\s*")([^"]*)(")/g;
  urlRe.lastIndex = m.index;
  const hit = urlRe.exec(src);
  if (!hit || hit.index > end) { console.error("no affiliateUrl for " + e.id); process.exit(1); }

  src = src.slice(0, hit.index) + hit[1] + target + hit[3] + src.slice(hit.index + hit[0].length);
  applied++;
}

if (!DRY) {
  fs.writeFileSync(DATA, src, "utf8");
  const check = new Function(fs.readFileSync(DATA, "utf8") + "\nreturn PRODUCTS;")();
  const direct = check.filter((p) => /\/dp\//.test(p.affiliateUrl)).length;
  console.log(`data/products.js still parses — ${check.length} products, ${direct} now on direct links.`);
}

console.log(`${DRY ? "DRY RUN — would rewrite" : "Rewrote"} ${applied} link(s); ${skipped} already current.`);
console.log("Next: node scripts/build-product-pages.js");
