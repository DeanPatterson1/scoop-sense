// Scoop Sense — product-image integrator.
//
// Takes the researched image JSON (one file per category), downloads each
// product's lead image into images/products/, and writes the imageUrl,
// imageBg, and images fields into that product's entry in
// data/products.js. Run with the directory holding the JSON files:
//
//   node scripts/integrate-images.js <json-dir> [--dry]
//
// Input shape, per file (an array):
//   [{ "id": "thorne-creatine",
//      "images": ["https://…front.png", "https://…back.jpg"],
//      "source": "https://www.thorne.com/products/…" }]
//
// Rules baked in (do not remove):
//   - Only URLs the researcher actually verified belong in the JSON. This
//     script re-checks that each one downloads and is a real image, and drops
//     the ones that do not; it never invents or repairs a URL.
//   - imageBg is only a first guess here, taken from the file's alpha
//     channel. A PNG can carry an alpha channel and still be entirely opaque,
//     so re-measure the corner pixels in a browser and correct imageBg to the
//     real colour before shipping (see README, "Product imagery").
//   - Products that already carry an imageUrl are left alone, so the script is
//     safe to re-run.
//
// Edits are textual insertions after each entry's labelVerified line, which
// keeps the file's comments and hand-formatting intact.

"use strict";

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const ROOT = path.join(__dirname, "..");
const DATA = path.join(ROOT, "data", "products.js");
const IMG_DIR = path.join(ROOT, "images", "products");

const dir = process.argv[2];
const DRY = process.argv.includes("--dry");
if (!dir) {
  console.error("usage: node scripts/integrate-images.js <json-dir> [--dry]");
  process.exit(1);
}

/* ---- load the research -------------------------------------------------- */

const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));
if (!files.length) { console.error("no .json files in " + dir); process.exit(1); }

const entries = [];
for (const f of files) {
  const rows = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"));
  if (!Array.isArray(rows)) { console.error(f + ": expected an array"); process.exit(1); }
  for (const r of rows) {
    if (!r.id) { console.error(f + ": an entry has no id"); process.exit(1); }
    entries.push(r);
  }
}

const dataSrc0 = fs.readFileSync(DATA, "utf8");
const { PRODUCTS } = new Function(dataSrc0 + "\nreturn { PRODUCTS, FEATURED_IDS };")();
const known = new Set(PRODUCTS.map((p) => p.id));

/* ---- helpers ------------------------------------------------------------ */

function extOf(url) {
  if (/\.png(\?|$)/i.test(url)) return "png";
  if (/\.webp(\?|$)/i.test(url)) return "webp";
  if (/\.jpe?g(\?|$)/i.test(url)) return "jpg";
  return "jpg";
}

function download(url, dest) {
  execFileSync("curl", [
    "-sL", "--max-time", "45",
    "-H", "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    "-o", dest, url
  ], { stdio: "ignore" });
  if (!fs.existsSync(dest)) throw new Error("no file written");
  const size = fs.statSync(dest).size;
  if (size < 2000) { fs.unlinkSync(dest); throw new Error("suspiciously small (" + size + " bytes)"); }
  const head = fs.readFileSync(dest).slice(0, 12);
  const png = head.slice(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  const jpg = head[0] === 0xff && head[1] === 0xd8;
  const webp = head.slice(0, 4).toString() === "RIFF" && head.slice(8, 12).toString() === "WEBP";
  if (!png && !jpg && !webp) { fs.unlinkSync(dest); throw new Error("not a PNG/JPEG/WebP"); }
  return size;
}

// PNG colour types 4 and 6 carry an alpha channel; type 3 may carry tRNS.
// Everything else — including every JPEG — is opaque.
function hasAlpha(file) {
  const buf = fs.readFileSync(file);
  const isPng = buf.slice(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  if (!isPng) return false;
  const colorType = buf[25];
  if (colorType === 4 || colorType === 6) return true;
  return buf.includes(Buffer.from("tRNS"));
}

/* ---- integrate ---------------------------------------------------------- */

let src = dataSrc0;
const report = [];

for (const e of entries) {
  const urls = Array.isArray(e.images) ? e.images.filter(Boolean) : [];
  if (!known.has(e.id)) { report.push([e.id, "not a known product id — skipped"]); continue; }
  if (!urls.length) { report.push([e.id, "no images supplied"]); continue; }

  // Two hand-written styles coexist in data/products.js: the original entries
  // use bare keys (id: "x"), the ones appended by integrate-research.js use
  // JSON-quoted keys ("id": "x"). Match either.
  const idRe = new RegExp(`"?id"?\\s*:\\s*"${e.id}"`);
  const idMatch = idRe.exec(src);
  if (!idMatch) { report.push([e.id, "id not found in data/products.js"]); continue; }
  const idAt = idMatch.index;

  const nextIdRe = /\n\s*"?id"?\s*:\s*"/g;
  nextIdRe.lastIndex = idAt + idMatch[0].length;
  const nextId = nextIdRe.exec(src);
  const blockEnd = nextId ? nextId.index : src.length;

  const block0 = src.slice(idAt, blockEnd);
  if (/"?imageUrl"?\s*:/.test(block0)) {
    report.push([e.id, "already has an image — skipped"]);
    continue;
  }

  const anchorRe = /"?labelVerified"?\s*:/g;
  anchorRe.lastIndex = idAt;
  const anchorMatch = anchorRe.exec(src);
  if (!anchorMatch || anchorMatch.index > blockEnd) {
    report.push([e.id, "no labelVerified line to anchor to"]);
    continue;
  }
  const lineEnd = src.indexOf("\n", anchorMatch.index);
  if (lineEnd === -1 || lineEnd > blockEnd) {
    report.push([e.id, "labelVerified line runs past the entry"]);
    continue;
  }
  // Match the surrounding style so the file stays readable either way.
  const quoted = /"labelVerified"/.test(src.slice(anchorMatch.index, anchorMatch.index + 20));
  const indent = /\n(\s*)"?labelVerified/.exec(src.slice(Math.max(0, anchorMatch.index - 40), anchorMatch.index + 20));
  const pad = indent ? indent[1] : "    ";
  const key = (k) => (quoted ? `"${k}"` : k);

  let local = null;
  let opaque = false;
  let note = "";

  if (DRY) {
    note = `would download ${urls[0].slice(0, 60)}…`;
  } else {
    for (const url of urls) {
      const dest = path.join(IMG_DIR, `${e.id}.${extOf(url)}`);
      try {
        const size = download(url, dest);
        local = `images/products/${e.id}.${extOf(url)}`;
        opaque = !hasAlpha(dest);
        note = `${Math.round(size / 1024)} KB, ${opaque ? "opaque — verify imageBg" : "transparent"}`;
        break;
      } catch (err) {
        note = "lead image failed: " + err.message;
      }
    }
  }

  // Falling back to the retailer URL keeps the product illustrated even when
  // the download is blocked; the page already sends no referrer.
  const imageUrl = local || urls[0];
  if (!local && !DRY) note += " — hotlinking instead";

  const block =
    `\n${pad}${key("imageUrl")}: ${JSON.stringify(imageUrl)},` +
    (opaque ? `\n${pad}${key("imageBg")}: "255,255,255",` : "") +
    `\n${pad}${key("images")}: [\n` +
    urls.map((u) => `${pad}  ${JSON.stringify(u)}`).join(",\n") +
    `\n${pad}],`;

  src = src.slice(0, lineEnd) + block + src.slice(lineEnd);
  report.push([e.id, note]);
}

if (!DRY) {
  fs.writeFileSync(DATA, src, "utf8");
  // Fail loudly rather than leave a corrupted data file behind.
  new Function(fs.readFileSync(DATA, "utf8") + "\nreturn PRODUCTS;")();
}

console.log(report.map((r) => r[0].padEnd(44) + r[1]).join("\n"));
console.log("\n" + (DRY ? "DRY RUN — nothing written" : `data/products.js updated (${report.length} entries processed)`));
console.log("Next: node scripts/build-product-pages.js");
