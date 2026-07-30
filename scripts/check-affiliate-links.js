// Scoop Sense — affiliate link checker.
//
//   node scripts/check-affiliate-links.js [--all]
//
// Opens every direct product link in data/products.js and reads the listing's
// own <title>, then reports anything that does not look like the product the
// catalog says it is.
//
// This exists because the expensive failure here is silent. A dead ASIN at
// least 404s and someone notices; an ASIN that resolves to the WRONG product
// looks perfectly healthy from the outside while sending every reader who
// trusts the page to a tub they did not ask for. Researcher confidence is not
// evidence — the listing title is, so this fetches it independently of
// whoever supplied the ASIN.
//
// Amazon listings also rot on their own: products are discontinued, brands
// relist under a new ASIN, sellers lose the buy box. Search URLs never did
// this, which is the one thing they had going for them, so a direct-link
// catalog needs re-checking on a schedule. Quarterly, alongside the label
// re-verification, is reasonable.
//
// By default only /dp/ links are checked. --all also reports which products
// are still on a search URL. --slice A:B checks that index range of the
// direct-link list, so a long run can be split across shell timeouts.
//
// Results print AS THEY ARE FOUND. The first version buffered everything for
// a summary at the end, and a shell timeout killed a nine-minute run with the
// whole report still in memory — the run had happened and the answer was
// lost. Progressive output means a killed run still leaves everything it
// checked on disk.

"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const ALL = process.argv.includes("--all");

const PRODUCTS = new Function(
  fs.readFileSync(path.join(ROOT, "data", "products.js"), "utf8") + "\nreturn PRODUCTS;"
)();

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36";

// Words that carry no identifying weight, so their presence in a title proves
// nothing about whether it is the right product.
const STOP = new Set([
  "the", "and", "for", "with", "powder", "supplement", "supplements", "nutrition",
  "sports", "sport", "protein", "pre", "post", "workout", "pre-workout", "preworkout",
  "amazon", "com", "health", "household", "servings", "serving", "free", "plus"
]);

function tokens(s) {
  return (s.toLowerCase().match(/[a-z0-9]+/g) || []).filter((w) => w.length > 2 && !STOP.has(w));
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchOnce(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": UA, "Accept-Language": "en-US,en;q=0.9" },
    redirect: "follow"
  });
  const html = await res.text();
  const m = /<title[^>]*>([\s\S]*?)<\/title>/i.exec(html);
  const title = m
    ? m[1].replace(/&amp;/g, "&").replace(/&#\d+;/g, "").replace(/\s+/g, " ").trim()
    : "";
  return { status: res.status, title, captcha: /api-services-support@amazon\.com|Robot Check/i.test(html) };
}

// Amazon starts serving its bot check after roughly a minute of steady
// requests. Left unhandled that reads as "25 broken links" and sends someone
// chasing links that were never broken, so a blocked response is treated as
// "ask again later", not as a verdict.
async function titleOf(url) {
  for (let attempt = 0; ; attempt++) {
    const r = await fetchOnce(url);
    if (!r.captcha || attempt === 2) return r;
    await sleep(20000 * (attempt + 1));
  }
}

(async () => {
  let direct = PRODUCTS.filter((p) => /\/dp\//.test(p.affiliateUrl || ""));
  const search = PRODUCTS.filter((p) => /\/s\?k=/.test(p.affiliateUrl || ""));

  const sliceArg = /^(\d+):(\d+)$/.exec(process.argv[process.argv.indexOf("--slice") + 1] || "");
  if (process.argv.includes("--slice") && sliceArg) {
    direct = direct.slice(Number(sliceArg[1]), Number(sliceArg[2]));
  }

  console.log(`${direct.length} direct links to check, ${search.length} still on search URLs.\n`);

  const problems = [];
  const review = [];
  let ok = 0;

  const flagProblem = (id, asin, why) => {
    problems.push([id, asin, why]);
    console.log(`  PROBLEM ${id} (${asin}): ${why}`);
  };

  // Sequential and paced on purpose. Amazon throttles a burst, and a throttled
  // response would read as a broken link and send someone chasing a link that
  // is fine. The whole catalog takes a few minutes; that is the price of the
  // answer being trustworthy.
  let first = true;
  for (const p of direct) {
    if (!first) await sleep(1500);
    first = false;
    const asin = /\/dp\/([A-Z0-9]{10})/.exec(p.affiliateUrl)[1];
    let r;
    try {
      r = await titleOf(p.affiliateUrl);
    } catch (e) {
      flagProblem(p.id, asin, "fetch failed: " + e.message);
      continue;
    }

    if (r.captcha) { flagProblem(p.id, asin, "blocked by Amazon bot check — recheck by hand"); continue; }
    if (r.status !== 200) { flagProblem(p.id, asin, `HTTP ${r.status}`); continue; }
    if (!r.title || /^Amazon\.com$/i.test(r.title)) { flagProblem(p.id, asin, "no product title — listing may be gone"); continue; }

    const t = r.title.toLowerCase();
    const brandHit = tokens(p.brand).some((w) => t.includes(w));
    const nameHits = tokens(p.name).filter((w) => t.includes(w)).length;

    const nameWords = tokens(p.name);
    if (!brandHit && nameWords.length && nameHits === nameWords.length) {
      // Some brands sell under a line name the listing title uses instead of
      // the company's — Cellucor's listings say "C4", not "Cellucor". The full
      // product name matching is enough to say this is the right tub, but it is
      // still worth a human glance rather than silence.
      review.push([p.id, asin, `titled by product line, not "${p.brand}": ${r.title.slice(0, 80)}`]);
      ok++;
    } else if (!brandHit) {
      flagProblem(p.id, asin, `title does not mention ${p.brand}: ${r.title.slice(0, 90)}`);
    } else if (nameWords.length && nameHits === 0) {
      flagProblem(p.id, asin, `title matches the brand but not "${p.name}": ${r.title.slice(0, 90)}`);
    } else {
      ok++;
    }
  }

  console.log(`\n${ok} link(s) resolve to a listing naming the right brand and product.`);
  if (review.length) {
    console.log(`${review.length} fine but titled by product line, worth a glance:`);
    for (const [id, asin, why] of review) console.log(`  ${id} (${asin}): ${why}`);
  }
  if (problems.length) console.log(`${problems.length} PROBLEM line(s) above need a look.`);

  if (ALL && search.length) {
    console.log(`\nStill on an Amazon search URL:`);
    for (const p of search) console.log(`  ${p.id}`);
  }

  process.exit(problems.length ? 1 : 0);
})();
