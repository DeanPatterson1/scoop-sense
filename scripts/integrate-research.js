// Scoop Sense — research-data integrator.
//
// Validates the per-category research JSON files (creatine.json, protein.json,
// eaa.json, electrolytes.json) and appends their products to data/products.js.
// Run with the directory holding the JSON files:
//
//   node scripts/integrate-research.js <json-dir>
//
// Refuses to write anything if any entry fails validation. Safe to re-run:
// ids already present in data/products.js are skipped.

"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const DATA = path.join(ROOT, "data", "products.js");

const dir = process.argv[2];
if (!dir) { console.error("usage: node scripts/integrate-research.js <json-dir>"); process.exit(1); }

const dataSrc = fs.readFileSync(DATA, "utf8");
const { PRODUCTS } = new Function(dataSrc + "\nreturn { PRODUCTS, FEATURED_IDS };")();
const existingIds = new Set(PRODUCTS.map((p) => p.id));

const REQUIRED = ["id", "name", "brand", "category", "stimFree", "badges", "caffeineMg",
  "keyIngredients", "cautions", "servings", "priceRange", "flavorsNote", "affiliateUrl",
  "blurb", "labelVerified", "metrics", "sources"];

const METRIC_KEYS = {
  creatine: ["creatineG", "form"],
  protein: ["proteinG", "servingG", "source", "sweetener"],
  eaa: ["eaaG", "bcaaG", "leucineG"],
  electrolytes: ["sodiumMg", "potassiumMg", "magnesiumMg", "sugarG"]
};

const STIM_BADGES = ["Stim-Free", "Low Stim", "Moderate Stim", "High Stim"];
const EXTRAS = ["Fully Disclosed Label", "Proprietary Blend", "Budget Pick", "Beginner Friendly", "Third-Party Tested"];
const CLAIM_RE = /\b(treat|cure|prevent|diagnos)/i;

const errors = [];
const all = [];

for (const cat of Object.keys(METRIC_KEYS)) {
  const fp = path.join(dir, cat + ".json");
  if (!fs.existsSync(fp)) { console.log(`note: ${cat}.json not present — skipping that category`); continue; }
  let list;
  try { list = JSON.parse(fs.readFileSync(fp, "utf8")); }
  catch (e) { errors.push(`${cat}.json: parse error — ${e.message}`); continue; }
  if (!Array.isArray(list)) { errors.push(`${cat}.json: not an array`); continue; }

  for (const p of list) {
    const tag = `${cat}/${p && p.id}`;
    if (!p || typeof p !== "object") { errors.push(`${tag}: not an object`); continue; }

    for (const f of REQUIRED) if (p[f] === undefined) errors.push(`${tag}: missing field ${f}`);
    if (p.category !== cat) errors.push(`${tag}: category "${p.category}" != file ${cat}`);
    if (existingIds.has(p.id)) { console.log(`skip (already in database): ${tag}`); continue; }
    if (all.some((x) => x.id === p.id)) errors.push(`${tag}: duplicate id in research set`);

    if (typeof p.caffeineMg !== "number") errors.push(`${tag}: caffeineMg not a number`);
    if (p.stimFree !== (p.caffeineMg === 0)) errors.push(`${tag}: stimFree/caffeineMg mismatch`);
    if (!["$", "$$", "$$$"].includes(p.priceRange)) errors.push(`${tag}: bad priceRange`);
    if (typeof p.servings !== "number") errors.push(`${tag}: servings not a number`);

    const stims = (p.badges || []).filter((b) => STIM_BADGES.includes(b));
    const extras = (p.badges || []).filter((b) => !STIM_BADGES.includes(b));
    if (p.caffeineMg > 0 && stims.length !== 1) errors.push(`${tag}: caffeinated but ${stims.length} stim badges`);
    if (p.caffeineMg === 0 && stims.length > 0) errors.push(`${tag}: stim badge on stim-free non-pre product`);
    for (const b of extras) if (!EXTRAS.includes(b)) errors.push(`${tag}: unknown badge "${b}"`);
    if (extras.length > 2) errors.push(`${tag}: more than 2 extra badges`);

    if (!Array.isArray(p.keyIngredients) || p.keyIngredients.length < 1 || p.keyIngredients.length > 4)
      errors.push(`${tag}: keyIngredients count out of range`);
    if (!Array.isArray(p.cautions) || p.cautions.length < 1 || p.cautions.length > 3)
      errors.push(`${tag}: cautions count out of range`);
    if (!Array.isArray(p.sources) || p.sources.length < 1) errors.push(`${tag}: sources empty`);

    if (typeof p.affiliateUrl !== "string" || !p.affiliateUrl.startsWith("https://www.amazon.com/s?k=") || !p.affiliateUrl.includes("tag=YOURTAG-20"))
      errors.push(`${tag}: affiliateUrl not in standard search form`);

    if (!p.metrics || typeof p.metrics !== "object") errors.push(`${tag}: metrics missing`);
    else for (const k of METRIC_KEYS[cat]) if (!(k in p.metrics)) errors.push(`${tag}: metrics.${k} missing`);

    const text = JSON.stringify([p.blurb, p.cautions, p.flavorsNote, (p.keyIngredients || []).map((i) => i.clinicalNote)]);
    if (CLAIM_RE.test(text.replace(/not intended to diagnose, treat, cure, or prevent/gi, "")))
      errors.push(`${tag}: possible disease-claim language — review manually`);
    if (/\$\d/.test(text)) errors.push(`${tag}: dollar amount in copy`);

    all.push(p);
  }
}

if (errors.length) {
  console.error("VALIDATION FAILED:\n" + errors.map((e) => "  - " + e).join("\n"));
  process.exit(1);
}
if (!all.length) { console.log("Nothing new to integrate."); process.exit(0); }

// Serialize in the file's field order, grouped by category with a banner.
const ORDER = ["id", "name", "brand", "category", "stimFree", "badges", "caffeineMg",
  "keyIngredients", "cautions", "servings", "priceRange", "flavorsNote", "affiliateUrl",
  "blurb", "labelVerified", "metrics", "sources"];

function serialize(p) {
  const o = {};
  for (const k of ORDER) if (p[k] !== undefined) o[k] = p[k];
  return "  " + JSON.stringify(o, null, 2).split("\n").join("\n  ");
}

const byCat = {};
for (const p of all) (byCat[p.category] = byCat[p.category] || []).push(p);

let block = "";
for (const cat of Object.keys(byCat)) {
  block += `\n  /* ---- ${cat} (label-verified July 2026) ---- */\n\n`;
  block += byCat[cat].map(serialize).join(",\n\n") + ",\n";
}

// Insert before the closing "];" of the PRODUCTS array (its first occurrence).
const closeIdx = dataSrc.indexOf("\n];");
if (closeIdx === -1) { console.error("Could not find PRODUCTS array close"); process.exit(1); }
const head = dataSrc.slice(0, closeIdx);
// Don't double the comma if the last element already carries a trailing one.
const sep = /,\s*$/.test(head) ? "\n" : ",\n";
const out = head + sep + block + dataSrc.slice(closeIdx + 1);

fs.writeFileSync(DATA, out);
console.log(`Integrated ${all.length} products (${Object.keys(byCat).map((c) => c + ":" + byCat[c].length).join(", ")}).`);

// Re-eval to prove the file still parses.
const check = new Function(fs.readFileSync(DATA, "utf8") + "\nreturn PRODUCTS.length;")();
console.log(`data/products.js now holds ${check} products.`);
