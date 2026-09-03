// Scoop Sense — static product-page generator.
//
// Reads data/products.js (the same file the browser loads) and writes one
// static HTML page per product into products/. Re-run after any data change:
//
//   node scripts/build-product-pages.js
//
// Honesty rules baked in (do not remove):
//   - No dollar prices, no cart, no fabricated reviews or star ratings.
//   - Product artwork is the brand's own photograph where one is on file,
//     captioned as retailer-supplied with a "packaging may vary, verify the
//     panel" note; products without a photograph fall back to a generic
//     stylized tub (brand colour + monogram). Never a mock-up of a real
//     label, and never artwork implying a figure the panel does not state.
//   - Every studied range drawn on a page comes from js/doses.js and carries
//     its own citation where one has been verified. A bar must never
//     contradict the source quoted beneath it.

"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const OUT = path.join(ROOT, "products");
const VERSION = "20260903c"; // the build rewrites every root page's ?v= to match (see the end of this file)

// Set this to the real origin at domain time (see README "Sitemap & domain").
// Absolute-URL metadata — canonical, og:url, BreadcrumbList — is emitted only
// once it is real: a canonical pointing at a placeholder host is worse than
// none at all.
const SITE_ORIGIN = "https://thescoopsense.com";
const HAS_ORIGIN = !/YOUR-DOMAIN/.test(SITE_ORIGIN);

// The absolute URL a repo file is actually reachable at. Cloudflare's asset
// server strips the extension and 307s to the bare path — `/creatine.html`
// answers `Location: /creatine`, and `/index.html` answers `Location: /`. So
// every absolute URL the site declares about itself has to be the extensionless
// form, or canonical, og:url, the breadcrumb trail and the sitemap all point at
// a redirect and Google resolves the target as canonical instead of the tag.
// The `href`s between pages keep the `.html` suffix: they work either way, and
// the site still has to open from the local filesystem and `serve.py`.
// A fragment is split off first: the pre-workout breadcrumb points at
// `hub.html#cat-pre-workout`, and a suffix rule anchored to end-of-string would
// leave that one URL on the redirecting form.
function publicUrl(file) {
  const [pathPart, hash = ""] = file.split("#");
  const bare = pathPart.replace(/(^|\/)index\.html$/, "$1").replace(/\.html$/, "");
  return `${SITE_ORIGIN}/${bare}${hash ? `#${hash}` : ""}`;
}

/* ---- load data ---------------------------------------------------------- */

const dataSrc = fs.readFileSync(path.join(ROOT, "data", "products.js"), "utf8");
const { PRODUCTS } = new Function(dataSrc + "\nreturn { PRODUCTS, FEATURED_IDS };")();

const catSrc = fs.readFileSync(path.join(ROOT, "js", "categories.js"), "utf8");
const CATEGORY_CONFIG = new Function(catSrc + "\nreturn CATEGORY_CONFIG;")();

// Products predate the category field; missing means pre-workout.
function categoryOf(p) {
  return p.category || "pre-workout";
}

function cfgOf(p) {
  return CATEGORY_CONFIG[categoryOf(p)] || CATEGORY_CONFIG["pre-workout"];
}

// Pre-workout has no landing page of its own, so its browse link is the hub
// scoped by deep link — not the unfiltered catalog every other category
// avoids landing on.
function categoryPageOf(p) {
  const cat = categoryOf(p);
  return cat === "pre-workout" ? "hub.html#cat-pre-workout" : cfgOf(p).page;
}

// "Compare" in the nav used to land every reader on the pre-workout table,
// whatever they were reading. Each category's table lives on its own page.
function compareHref(p) {
  return categoryOf(p) === "pre-workout" ? "compare.html" : cfgOf(p).page + "#compare";
}

const COUNT = PRODUCTS.length;
const preWorkouts = PRODUCTS.filter((p) => categoryOf(p) === "pre-workout");
const MAX_CAF = Math.max(...preWorkouts.map((p) => p.caffeineMg));

/* ---- helpers (mirror js/app.js) ----------------------------------------- */

function esc(v) {
  return String(v)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function bucketOf(p) {
  if (p.caffeineMg === 0) return "none";
  if (p.caffeineMg < 150) return "low";
  if (p.caffeineMg < 250) return "moderate";
  return "high";
}

/* Turns the caffeine figure into the comparison a reader actually wants to
 * make: performance studies dose caffeine per kilogram, so the same 400 mg is
 * a studied amount for one body and well past it for another. Stated as the
 * body weight the label's own dose corresponds to — no recommendation, and no
 * arithmetic left to the reader. Only worth saying from 200 mg up; below that
 * the implied range is lighter than any adult and reads as noise. */
function ageCaffeineNote(p) {
  if (!p.caffeineMg || p.caffeineMg < 200) return "";
  const heavy = Math.round(p.caffeineMg / 3);
  const light = Math.round(p.caffeineMg / 6);
  return ` Performance studies use roughly 3–6 mg of caffeine per kg of body weight, which puts ${p.caffeineMg} mg at the studied amount for a ${light}–${heavy} kg adult.`;
}

function stimLabelOf(p) {
  const b = bucketOf(p);
  return b === "none" ? "Stim-free" : b === "low" ? "Low stim" : b === "moderate" ? "Moderate stim" : "High stim";
}

function findIngredient(p, re) {
  return p.keyIngredients.find((i) => re.test(i.name)) || null;
}

function citrullineOf(p) {
  const ing = findIngredient(p, /citrulline/i);
  if (!ing) return null;
  return { dose: ing.dose, form: /malate/i.test(ing.name) ? "malate" : "" };
}

function betaAlanineOf(p) {
  const ing = findIngredient(p, /beta[- ]alanine/i);
  return ing ? ing.dose : null;
}

/* Three states, mirroring js/app.js — see the long note there.
 * proprietary: a pooled total standing in for the doses of distinct actives.
 * partial:     a protein blend whose total is the protein figure and whose
 *              source ratio is what is actually hidden.
 * none:        nothing pooled. */
function blendState(p) {
  if (p.badges.indexOf("Proprietary Blend") !== -1) return "proprietary";
  if (!findIngredient(p, /blend/i)) return "none";
  return categoryOf(p) === "pre-workout" ? "proprietary" : "partial";
}

function hasBlend(p) {
  return blendState(p) !== "none";
}

function isDisclosed(p) {
  return p.badges.indexOf("Fully Disclosed Label") !== -1 && blendState(p) === "none";
}

function monogramOf(p) {
  const w = (p.brand || "?").split(/\s+/);
  return (w[0].charAt(0) + (w[1] ? w[1].charAt(0) : "")).toUpperCase();
}

// Plain-English explanations surfaced as native tooltips on the tag chips.
const STIM_TIPS = {
  none: "0 mg caffeine per serving. Stim-free is not effect-free — the other ingredients are still active.",
  low: "Under 150 mg caffeine per full serving — less than two small cups of coffee.",
  moderate: "150–249 mg caffeine per full serving — roughly two small cups of coffee.",
  high: "250 mg or more caffeine per full serving. The FDA cites about 400 mg per day for healthy adults."
};
const DISCLOSED_TIP = "Every active ingredient and its dosage is individually listed on the label. No proprietary blends.";
const BLEND_TIP = "One or more combined blend totals hide the individual ingredient amounts inside.";
const PARTIAL_TIP = "The blend's total is on the label, but not the ratio between the sources inside it — so the total is known and the split is not.";

// Mirrors showsStimTag in js/app.js: pre-workouts always carry a stim tag,
// every other category only when actually caffeinated.
function showsStimTag(p) {
  return categoryOf(p) === "pre-workout" || p.caffeineMg > 0;
}

function tagsHTML(p) {
  const tags = [];
  const b = bucketOf(p);
  if (showsStimTag(p)) {
    let cls = "sc-tag";
    if (b === "high") cls += " sc-tag-caution";
    if (b === "none") cls += " sc-tag-calm";
    tags.push(`<span class="${cls}" title="${esc(STIM_TIPS[b])}">${esc(stimLabelOf(p))}</span>`);
  }
  const blend = blendState(p);
  if (blend === "proprietary") tags.push(`<span class="sc-tag sc-tag-caution" title="${esc(BLEND_TIP)}">Proprietary blend</span>`);
  else if (blend === "partial") tags.push(`<span class="sc-tag" title="${esc(PARTIAL_TIP)}">Blend ratio undisclosed</span>`);
  else if (isDisclosed(p)) tags.push(`<span class="sc-tag" title="${esc(DISCLOSED_TIP)}">Label fully disclosed</span>`);
  if (p.badges.indexOf("Third-Party Tested") !== -1) tags.push(`<span class="sc-tag sc-tag-calm" title="Certified by an independent banned-substance testing program (NSF Certified for Sport, Informed Sport, or Informed Choice), per the label or brand page.">Third-party tested</span>`);
  if (p.badges.indexOf("Beginner Friendly") !== -1) tags.push(`<span class="sc-tag" title="A reasonable first tub: moderate or no caffeine, a fully disclosed label, and nothing on the panel that surprises a new user.">Beginner friendly</span>`);
  if (p.badges.indexOf("Budget Pick") !== -1) tags.push(`<span class="sc-tag" title="Cost per full serving sits in the lowest third of this database while the label still discloses its doses.">Budget pick</span>`);
  // Mirrors isDairyFreeSource in js/app.js — derived from the panel's source
  // line, not a badge, and only ever on protein.
  if (isDairyFreeSource(p)) tags.push(`<span class="sc-tag sc-tag-calm" title="The protein source named on the panel carries no whey, casein, or milk. This reads the source line only — check the label's own allergen statement before buying.">Dairy-free source</span>`);
  return tags.join("");
}

/* Mirrors retailerOf in js/app.js. Derived from the link rather than stored,
 * so swapping one product to a brand-direct URL relabels its prose instead of
 * leaving the page naming Amazon. The optional `retailer` field overrides it
 * for a third-party seller that is neither Amazon nor the brand. */
function retailerOf(p) {
  if (p.retailer) return p.retailer;
  const m = /^https?:\/\/([^\/]+)/.exec(p.affiliateUrl || "");
  if (!m) return p.brand;
  return /(^|\.)amazon\./i.test(m[1]) ? "Amazon" : p.brand;
}

/* Whey, casein and milk are dairy; plants and hemp are not. A source line that
 * names nothing stays out — "unstated" is not "safe", and this is the one
 * figure a lactose-intolerant reader cannot afford a guess on. */
function isDairyFreeSource(p) {
  if (categoryOf(p) !== "protein") return false;
  const src = (p.metrics && p.metrics.source) || "";
  if (!src) return false;
  return !/whey|casein|milk|lactose/i.test(src);
}

/* Config fact-key resolver — mirrors factOf in js/app.js. */
const DASH = '<span class="sc-dim">—</span>';

// Mirrors doseCellHTML in js/app.js: the qualifier ("malate", "blend") goes
// left so the figures keep the right-aligned edge they are compared on.
function doseCellHTML(dose, extraQual) {
  if (!dose) return DASH;
  const m = /^\s*([\d.]+\s*(?:mg|g|%))\s*(.*)$/i.exec(dose);
  const figure = m ? m[1] : dose;
  const qual = [m && m[2] ? m[2] : "", extraQual || ""].filter(Boolean).join(" ");
  return esc(figure) + `<span class="sc-qual">${esc(qual)}</span>`;
}

function metricOf(p, key) {
  if (!p.metrics) return null;
  const v = p.metrics[key];
  return v === undefined || v === null || v === "" ? null : v;
}

function factOf(p, key) {
  if (key === "caffeineMg") return p.caffeineMg === 0 ? "0 mg" : esc(p.caffeineMg) + " mg";
  if (key === "servings") return esc(p.servings);
  if (key === "blend") {
    const s = blendState(p);
    return s === "proprietary" ? "Yes" : s === "partial" ? "Ratio only" : "No";
  }
  if (key === "stim") return esc(stimLabelOf(p));
  if (key === "price") return priceWordHTML(p);
  if (key === "protPct") {
    const pg = metricOf(p, "proteinG"), sg = metricOf(p, "servingG");
    return pg && sg ? Math.round((pg / sg) * 100) + "%" : DASH;
  }
  if (key.indexOf("ing:") === 0) {
    const pattern = key.slice(4);
    if (/citrulline/.test(pattern)) {
      const cit = citrullineOf(p);
      return cit ? doseCellHTML(cit.dose, cit.form) : DASH;
    }
    const ing = findIngredient(p, new RegExp(pattern, "i"));
    return ing ? doseCellHTML(ing.dose) : DASH;
  }
  if (key.indexOf("m:") === 0) {
    const parts = key.split(":");
    const v = metricOf(p, parts[1]);
    return v === null ? DASH : esc(v) + (parts[2] ? " " + parts[2] : "");
  }
  return DASH;
}

// "$" | "$$" | "$$$" -> plain-English cost-per-serving tier, with the basis
// for the judgment exposed as a tooltip.
// Mirrors js/app.js — the tiers are a hand-assigned within-category judgement,
// not a computed third of the database, which is what this used to claim.
const PRICE_BASIS = " Judged against the other products in the same category when the label was checked. We rank the tier rather than print a dollar figure, because prices move faster than we can re-check them — so use it to sort, not to budget.";
const PRICE_TIPS = {
  Budget: "Among the cheaper options per full serving." + PRICE_BASIS,
  "Mid-range": "Around the middle of the category on cost per full serving." + PRICE_BASIS,
  Premium: "Among the more expensive options per full serving." + PRICE_BASIS
};

/* The one figure worth seeing on a sibling card, per category.
 *
 * Every card used to print caffeine. On the 39 electrolytes — 38 of which are
 * caffeine-free — that meant the only data slot on the only comparison widget
 * on the page was spent saying "0 mg" thirty-eight times. */
function relatedMetaOf(p) {
  const cat = categoryOf(p);
  const g = (key, unit, word) => {
    const v = metricOf(p, key);
    return v === null || v === undefined ? null : `${v} ${unit} ${word}`;
  };
  let s = null;
  if (cat === "creatine") s = g("creatineG", "g", "creatine");
  else if (cat === "protein") s = g("proteinG", "g", "protein");
  else if (cat === "eaa") s = g("eaaG", "g", "EAAs") || g("bcaaG", "g", "BCAAs");
  else if (cat === "electrolytes") s = g("sodiumMg", "mg", "sodium");
  if (s) return esc(s);
  return p.caffeineMg === 0 ? "Stim-free · 0 mg" : `${esc(p.caffeineMg)} mg caffeine`;
}

function priceWordOf(p) {
  return p.priceRange === "$" ? "Budget" : p.priceRange === "$$" ? "Mid-range" : "Premium";
}

function priceWordHTML(p) {
  const w = priceWordOf(p);
  return `<span title="${esc(PRICE_TIPS[w])}">${w}</span>`;
}

// First gallery image that looks like the supplement-facts panel, for the
// "View supplement facts" link. Falls back to the primary label source.
function factsLinkOf(p) {
  const img = (p.images || []).find((u) => /sfp|supplement[-_]?facts|facts|label|panel/i.test(u));
  if (img) return { url: img, what: "supplement facts image" };
  if (p.sources && p.sources.length) return { url: p.sources[0].url, what: "label source" };
  return null;
}

// Data-derived suitability line — built only from label figures and badges,
// never invented claims.
function whoForHTML(p) {
  const parts = [];
  const cat = categoryOf(p);

  if (cat === "pre-workout") {
    if (p.caffeineMg === 0) parts.push("People who train late in the day or want zero caffeine — the effects here come from the non-stimulant ingredients.");
    else if (p.caffeineMg < 150) parts.push("Caffeine-sensitive users, or coffee drinkers who only want a modest top-up.");
    else if (p.caffeineMg < 250) parts.push("Most regular gym-goers — the caffeine dose is in the range of about two cups of coffee.");
    else if (p.caffeineMg < 350) parts.push("Users with an established caffeine tolerance.");
    else parts.push("Experienced high-stimulant users only — not a sensible first pre-workout.");
  } else if (cat === "creatine") {
    const form = metricOf(p, "form");
    if (form === "monohydrate") parts.push("Anyone who wants the form with the deepest research base — most creatine studies use 3–5 g of monohydrate daily.");
    else if (form === "HCl") parts.push("People who prefer a smaller powder dose; note that HCl has a thinner research base than monohydrate.");
    else parts.push("People who want creatine bundled with other ingredients — check what each addition does before paying for it.");
  } else if (cat === "protein") {
    const pg = metricOf(p, "proteinG"), sg = metricOf(p, "servingG");
    if (pg && sg && pg / sg >= 0.8) parts.push("A lean-ratio pick — at least 80% of each scoop is protein, which suits anyone counting calories closely.");
    else parts.push("A standard-ratio powder — fine as a food supplement when total daily protein is what matters.");
    const src = metricOf(p, "source") || "";
    if (/plant|pea|soy|rice/i.test(src)) parts.push("Suits anyone avoiding dairy.");
  } else if (cat === "eaa") {
    if (metricOf(p, "eaaG")) parts.push("People who want the full essential amino spectrum around training.");
    else parts.push("A BCAA-only formula — three of the nine essential amino acids, which suits taste-driven intra-workout sipping more than protein replacement.");
    if (p.caffeineMg > 0) parts.push("The added caffeine makes it double as a light pre-workout — count it toward your daily total.");
  } else if (cat === "electrolytes") {
    // A single cut at 500 mg called a 40 mg serving "moderate". Three bands,
    // and the low-carb line only where the product is actually low-carb —
    // it was being attached to an 11 g sugar mix.
    const na = metricOf(p, "sodiumMg") || 0;
    const sugar = metricOf(p, "sugarG") || 0;
    if (na >= 700) parts.push("Heavy sweaters and long or hot sessions — this is a sodium-forward mix.");
    else if (na >= 250) parts.push("Everyday training and moderate sweat losses — a middling sodium load.");
    else parts.push("Flavour and light top-ups rather than replacing a real sweat loss — the sodium here is well under the amount hydration research works with.");
    if (na >= 700 && sugar <= 1) parts.push("The lack of sugar also suits low-carb and keto diets, where sodium needs run higher.");
    if (sugar >= 7) parts.push("The sugar is part of the design, aiding fluid uptake the way oral rehydration research uses glucose — skip it if you want zero sugar.");
  }

  if (p.badges.indexOf("Budget Pick") !== -1) parts.push("A reasonable pick when cost per serving matters.");
  // Not "doses are mild": the badge is about an unsurprising label, and it
  // was claiming mildness for Dymatize All9, the joint-highest EAA dose here.
  if (p.badges.indexOf("Beginner Friendly") !== -1) parts.push("A sensible first tub — nothing on the panel that catches a new user out.");
  if (hasBlend(p)) parts.push("Skip it if you want every individual dose disclosed on the label.");
  return parts.map((s) => esc(s)).join(" ");
}

/* Generic stylized tub — deliberately NOT the real packaging. */
function tubSVG(p) {
  const accent = p.accentColor || "#3A424D";
  const mono = esc(monogramOf(p));
  return `<svg viewBox="0 0 200 240" role="img" aria-label="Stylized illustration of a supplement tub" xmlns="http://www.w3.org/2000/svg">
  <rect x="34" y="6" width="132" height="44" rx="8" fill="#232830" stroke="#333A44"/>
  <rect x="24" y="44" width="152" height="186" rx="14" fill="#191D23" stroke="#333A44"/>
  <rect x="38" y="78" width="124" height="118" rx="6" fill="#F2EDE3"/>
  <rect x="38" y="78" width="124" height="14" rx="6" fill="${esc(accent)}"/>
  <text x="100" y="150" text-anchor="middle" font-family="Barlow Condensed, Arial Narrow, sans-serif" font-size="44" font-weight="700" fill="#17140F" letter-spacing="2">${mono}</text>
  <rect x="56" y="166" width="88" height="3" fill="#17140F" opacity="0.75"/>
  <rect x="56" y="176" width="88" height="2" fill="#17140F" opacity="0.3"/>
  <rect x="56" y="184" width="62" height="2" fill="#17140F" opacity="0.3"/>
</svg>`;
}

/* Media column: retailer-supplied imagery when we have verified URLs on file,
   otherwise the generic stylized tub. The first slide is our locally stored
   background-removed render (same art as the hub card); the rest are hotlinked
   from the retailer's own CDN — never re-hosted. Clicking the main image (or
   the zoom control) opens a full-screen lightbox. */
// The locally stored image leads the gallery when there is one — whatever its
// extension, which is why this follows imageUrl rather than assuming .png.
// Products with no local file fall through to the retailer URLs; a hard-coded
// path opened the gallery on a 404.
function slidesOf(p) {
  const name = fullNameOf(p);
  const slides = [];
  const local = p.imageUrl && !/^https?:/i.test(p.imageUrl) ? p.imageUrl : null;
  if (local && fs.existsSync(path.join(ROOT, local))) {
    slides.push({ src: `../${local}`, alt: `${name} — product image` });
  } else if (local) {
    console.warn(`warn: ${p.id}: imageUrl "${local}" not found on disk — gallery falls back to retailer photos`);
  }
  // `images` is optional: a product can carry a locally stored lead shot and no
  // retailer gallery at all. Reading it unguarded turned that into a crash, and
  // gating the media column on it showed such a product its photograph on the
  // grid tile and the monogram tub on its own page.
  for (const u of p.images || []) {
    if (local && u === p.imageUrl) continue; // don't show the same shot twice
    slides.push({ src: u, alt: `${name} — retailer photo` });
  }
  return slides;
}

function mediaHTML(p) {
  if (!slidesOf(p).length) {
    return `<figure class="sc-pdp-media">${tubSVG(p)}</figure>
          <p class="sc-pdp-caption">Illustrative artwork — not the actual packaging. Always check the real label on the tub you buy.</p>`;
  }
  const slides = slidesOf(p);
  const thumbs = slides.length > 1
    ? `\n          <div class="sc-gallery-thumbs">
            ${slides.map((s, i) => `<button type="button" class="sc-gallery-thumb" data-src="${esc(s.src)}" data-alt="${esc(s.alt)}" aria-current="${i === 0 ? "true" : "false"}" aria-label="Show image ${i + 1} of ${slides.length}"><img src="${esc(s.src)}" alt="" loading="lazy" referrerpolicy="no-referrer"></button>`).join("\n            ")}
          </div>`
    : "";
  return `<figure class="sc-pdp-media sc-pdp-media-photo">
            <img id="sc-gallery-main" src="${esc(slides[0].src)}" alt="${esc(slides[0].alt)}" referrerpolicy="no-referrer">
            <button type="button" class="sc-zoom-btn" id="sc-zoom-btn" aria-label="Zoom image">&#10530;<span> Zoom</span></button>
          </figure>${thumbs}
          <p class="sc-pdp-caption">Product imagery supplied by the retailer. Packaging may vary — verify the Supplement Facts panel on the container you receive.</p>
          <div class="sc-lightbox" id="sc-lightbox" hidden role="dialog" aria-modal="true" aria-label="Enlarged product image">
            <button type="button" class="sc-lightbox-close" id="sc-lightbox-close" aria-label="Close enlarged image">&times;</button>
            <!-- No src until the lightbox opens: src="" resolves to the page
                 itself, costing a request and registering as a broken image. -->
            <img id="sc-lightbox-img" alt="" referrerpolicy="no-referrer">
          </div>`;
}

/* Emitted whenever a photograph is on the page — not, as it was, only when the
   product carries more than one *retailer* image. The two counts are different:
   the thumbnail strip is built from `slidesOf`, which leads with the locally
   stored shot, so a product with one local image and one retailer image has two
   thumbnails and used to get no script to work them. Worse, this script also
   wires the zoom button and the lightbox, which every photographed product
   renders — so 21 pages showed a Zoom button that did nothing at all when
   clicked. The script guards its own pieces, so handing it a page with no
   thumbnails costs nothing. */
const GALLERY_SCRIPT = `<script>
(function () {
  var main = document.getElementById("sc-gallery-main");
  if (!main) return;
  var thumbs = Array.prototype.slice.call(document.querySelectorAll(".sc-gallery-thumb"));

  /* Gallery images are hotlinked from the manufacturer's own site — 570 URLs
     across the catalog, on hosts nobody here controls. They rot: an Amacx
     Shopify file started returning 404 and the thumbnail became a broken-image
     box on a live page, silently, because nothing was watching. A thumbnail
     whose picture will not load has nothing to offer, so it takes itself out
     of the strip rather than advertising the breakage. Both paths are needed:
     an image can fail before this script parses, in which case no error event
     is ever coming and only the completed-but-empty check catches it. */
  function dropThumb(b) {
    b.hidden = true;
  }
  thumbs.forEach(function (b) {
    var img = b.querySelector("img");
    if (!img) return;
    if (img.complete && img.naturalWidth === 0) dropThumb(b);
    img.addEventListener("error", function () { dropThumb(b); });
  });

  thumbs.forEach(function (b) {
    b.addEventListener("click", function () {
      main.src = b.getAttribute("data-src");
      main.alt = b.getAttribute("data-alt");
      thumbs.forEach(function (x) { x.setAttribute("aria-current", "false"); });
      b.setAttribute("aria-current", "true");
    });
  });

  var box = document.getElementById("sc-lightbox");
  var boxImg = document.getElementById("sc-lightbox-img");
  var closeBtn = document.getElementById("sc-lightbox-close");
  var zoomBtn = document.getElementById("sc-zoom-btn");
  if (!box) return;
  function openBox() {
    boxImg.src = main.src;
    boxImg.alt = main.alt;
    box.hidden = false;
    document.body.style.overflow = "hidden";
    closeBtn.focus();
  }
  function closeBox() {
    box.hidden = true;
    document.body.style.overflow = "";
    if (zoomBtn) zoomBtn.focus();
  }
  main.addEventListener("click", openBox);
  if (zoomBtn) zoomBtn.addEventListener("click", openBox);
  closeBtn.addEventListener("click", closeBox);
  box.addEventListener("click", function (e) { if (e.target === box) closeBox(); });
  document.addEventListener("keydown", function (e) {
    if (box.hidden) return;
    if (e.key === "Escape") { closeBox(); return; }
    // aria-modal alone does not stop Tab: without this the keyboard walks out
    // of the overlay into the page it is covering. Close is the only stop.
    if (e.key === "Tab") { e.preventDefault(); closeBtn.focus(); }
  });
})();
</script>
`;

// Category metric rows shown at the top of the label-data panel; the row set
// comes from the category's compare columns (minus derived/duplicate cells).
const METRIC_FACT_ROWS = {
  creatine: [["Creatine per serving", "m:creatineG:g"], ["Form", "m:form"]],
  protein: [["Protein per serving", "m:proteinG:g"], ["Serving size", "m:servingG:g"], ["Protein per scoop", "protPct"], ["Calories", "m:calories"], ["Total carbohydrate", "m:carbsG:g"], ["Total fat", "m:fatG:g"], ["Source", "m:source"], ["Sweetener", "m:sweetener"]],
  eaa: [["Total EAAs", "m:eaaG:g"], ["BCAAs", "m:bcaaG:g"], ["Leucine", "m:leucineG:g"]],
  electrolytes: [["Sodium", "m:sodiumMg:mg"], ["Potassium", "m:potassiumMg:mg"], ["Magnesium", "m:magnesiumMg:mg"], ["Sugar", "m:sugarG:g"]]
};

// Ingredient name is the row header, so a screen reader reading cell by cell
// still pairs "Caffeine" with "200 mg" instead of reading two loose values.
function factsRowsHTML(p) {
  const rows = [];
  // Several electrolyte labels list sodium and potassium as key ingredients
  // as well as metrics, which printed each of them twice — it read as a data
  // error and undercut the figures beside it.
  const printed = new Set();
  const row = (label, value) => {
    const k = String(label).trim().toLowerCase();
    if (printed.has(k)) return;
    printed.add(k);
    rows.push(`<tr><th scope="row">${label}</th><td class="sc-num">${value}</td></tr>`);
  };

  /* Calories, total carbohydrate and total fat are mandatory lines on a US
   * Supplement Facts panel, so they are on the back of every tub here. When
   * one is missing from this table it means we have not transcribed it yet —
   * not that the label withheld it — and the row says so rather than quietly
   * disappearing, which read as though the figure did not exist. */
  const PANEL_MANDATORY = new Set(["Calories", "Total carbohydrate", "Total fat"]);
  const NOT_RECORDED = '<span class="sc-dim" title="This line is required on a Supplement Facts panel, so it is printed on the tub — we have not transcribed it into the database yet.">Not recorded</span>';

  for (const [label, key] of METRIC_FACT_ROWS[categoryOf(p)] || []) {
    const v = factOf(p, key);
    if (v !== DASH) row(esc(label), v);
    else if (PANEL_MANDATORY.has(label)) row(esc(label), NOT_RECORDED);
  }
  if (categoryOf(p) === "pre-workout" || p.caffeineMg > 0) {
    row("Caffeine", p.caffeineMg === 0 ? "0 mg" : esc(p.caffeineMg) + " mg");
  }
  for (const ing of p.keyIngredients) {
    if (/caffeine/i.test(ing.name)) continue;
    row(esc(ing.name), esc(ing.dose));
  }
  const blend = blendState(p);
  row("Proprietary blend", blend === "proprietary" ? "Yes"
    : blend === "partial" ? "Total only — source ratio undisclosed" : "No");
  return rows.join("\n              ");
}

/* ---- studied-dose comparison ------------------------------------------- */

// The site's whole claim is that it lines a labeled dose up against the
// amount used in published research. That comparison was buried in an
// accordion; these bars put it on the page. Only ingredients with a settled
// research range get a bar — the rest get the note and no drawn scale.
const DOSES = new Function(
  fs.readFileSync(path.join(ROOT, "js", "doses.js"), "utf8") + "\nreturn STUDIED_DOSES;"
)();

// Thousands separators are part of how a label prints a dose. Reading "3,000
// mg" with a comma-blind [\d.]+ matched the "000" and charted the ingredient
// at 0 mg, and "1,500 mg" would have charted as 500 — wrong by a factor of
// three with nothing on the page to show it.
function parseDoseMg(dose) {
  const m = /([\d.,]+)\s*(mg|g)\b/i.exec(dose || "");
  if (!m) return null;
  const n = parseFloat(m[1].replace(/,/g, ""));
  if (!isFinite(n)) return null;
  return m[2].toLowerCase() === "g" ? n * 1000 : n;
}

function toUnit(mg, unit) {
  return unit === "g" ? mg / 1000 : mg;
}

function fmtAmount(n, unit) {
  return (Math.round(n * 100) / 100) + " " + unit;
}

/* A studied-dose bar only means anything when the figure in `dose` is that one
 * ingredient's amount. Plenty of labels here put a single weight against a
 * group instead — Bloom's "Performance Blend (L-Citrulline Malate,
 * L-Citrulline, Beta Alanine, Beet Root Extract)" at 4.68 g — and matching a
 * studied range against the ingredient *name* charted the sum as one of its
 * parts, then awarded "At or above the studied amount" to a figure the panel
 * never states. That is precisely the error this site exists to point out on
 * other people's labels, and it contradicted the clinicalNote printed on the
 * same row.
 *
 * Sourcing prose is not a group. "Caffeine (as PurCaf, from organic green
 * coffee bean)" carries a comma inside its parenthetical and is a fully
 * disclosed 124 mg, so a bare comma test would suppress a real figure. */
const GROUP_NOUN = /\bblend\b|\bmatrix\b|\bcomplex\b|\bproprietary\b|\bBCAAs?\b|\bEAAs?\b|amino acid|full[- ]spectrum/i;

function isPooledIngredient(ing) {
  if (/not individually/i.test(ing.dose || "")) return true;
  if (GROUP_NOUN.test(ing.name || "")) return true;
  const m = /\(([^)]*)\)/.exec(ing.name || "");
  if (!m) return false;

  const parts = m[1].split(",").map((s) => s.trim()).filter(Boolean);
  if (parts.length > 1 && !parts.some((s) => /^(as|from|incl)\b/i.test(s))) return true;

  /* "Velox (L-Citrulline + L-Arginine)" puts two different studied ingredients
   * under one 2.4 g weight and never says "blend". Two *forms of the same*
   * active is not a group — "Caffeine (Anhydrous + Di-Caffeine Malate)" is
   * still all caffeine, and its total is genuinely that ingredient's dose — so
   * the test is whether the parenthetical names more than one distinct entry. */
  const labels = new Set();
  for (const part of m[1].split(/[+,]/)) {
    const hit = DOSES.ingredients.find((e) => new RegExp(e.match, "i").test(part));
    if (hit) labels.add(hit.label);
  }
  return labels.size > 1;
}

/* "Published research" with nothing to open is an assertion, not a source.
 * Where doses.js carries a verified citation, the reader gets the paper and
 * the sentence the range came from. Entries without one say nothing here
 * rather than borrowing another row's authority. */
function citeHTML(entry) {
  return entry.cite
    ? `<p class="sc-dose-cite">Source: <a href="${esc(entry.cite.url)}" target="_blank" rel="noopener">${esc(entry.cite.label)}</a> — “${esc(entry.cite.quote)}”</p>`
    : "";
}

/* The row for an ingredient whose amount the label pools into a group total.
 * No bar and no verdict, because there is no amount to place — but the studied
 * range is still stated in words, so the reader learns both what the research
 * says and that this label gives them no way to check against it. */
function pooledDoseRowHTML(entry, ing) {
  const range = entry.low === null || entry.high === null
    ? ""
    : ` Studied amounts run ${fmtAmount(entry.low, entry.unit)} to ${fmtAmount(entry.high, entry.unit)}.`;
  const note = `This label does not state ${entry.label.toLowerCase()} on its own — it sits inside “${ing.name}”, disclosed only as a combined ${ing.dose}. A combined total is not a dose of anything named inside it, so there is nothing here to compare against the research.${range}`;

  return `<li class="sc-dose-row">
        <p class="sc-dose-head"><span class="sc-dose-name">${esc(entry.label)}</span><span class="sc-dose-amount sc-dim">undisclosed</span></p>
        <p class="sc-dose-note">${esc(note)}</p>
        ${citeHTML(entry)}
      </li>`;
}

// One comparison row: the labeled amount, the studied band drawn behind it,
// and a marker where this product actually lands.
function doseRowHTML(entry, amount) {
  const hasRange = entry.low !== null && entry.high !== null;
  const scale = entry.scaleTo;
  const pct = (v) => Math.max(0, Math.min(100, (v / scale) * 100));

  const verdict = !hasRange
    ? ""
    : amount === null
      ? ""
      : amount >= entry.low
        ? `<span class="sc-dose-verdict sc-dose-at">At or above the studied amount</span>`
        : `<span class="sc-dose-verdict sc-dose-under">${Math.round((amount / entry.low) * 100)}% of the low end of the studied range</span>`;

  const bar = !hasRange
    ? ""
    : `<div class="sc-dose-bar" role="img" aria-label="${esc(
        `${entry.label}: this label has ${amount === null ? "no disclosed amount" : fmtAmount(amount, entry.unit)}; studied amounts run ${fmtAmount(entry.low, entry.unit)} to ${fmtAmount(entry.high, entry.unit)}`
      )}">
          <span class="sc-dose-band" style="left:${pct(entry.low).toFixed(1)}%;width:${(pct(entry.high) - pct(entry.low)).toFixed(1)}%"></span>
          ${amount === null ? "" : `<span class="sc-dose-mark" style="left:${pct(amount).toFixed(1)}%"></span>`}
        </div>
        <p class="sc-dose-scale"><span>0</span><span>studied range ${fmtAmount(entry.low, entry.unit)}${entry.low === entry.high ? "" : "–" + fmtAmount(entry.high, entry.unit)}</span><span>${fmtAmount(scale, entry.unit)}</span></p>`;

  const cite = citeHTML(entry);

  return `<li class="sc-dose-row">
        <p class="sc-dose-head"><span class="sc-dose-name">${esc(entry.label)}</span><span class="sc-dose-amount">${amount === null ? "not disclosed" : esc(fmtAmount(amount, entry.unit))}</span></p>
        ${verdict}
        ${bar}
        <p class="sc-dose-note">${esc(entry.note)}</p>
        ${cite}
      </li>`;
}

// Ingredient rows first (pre-workouts), then the category's own metric rows.
function doseComparisonHTML(p) {
  const rows = [];
  const seen = new Set();

  /* Labels this product discloses as a real metric of its own. Those are the
   * metrics loop's business below, and must not be declared "undisclosed" from
   * inside a group total — Dymatize Elite's "BCAAs (2:1:1 ratio, incl. 2.7 g
   * leucine)" pools the trio but states the leucine. */
  const metricLabels = new Set();
  if (p.metrics) {
    for (const key of Object.keys(DOSES.metrics)) {
      if (metricOf(p, key) !== null) metricLabels.add(DOSES.metrics[key].label);
    }
  }

  for (const ing of p.keyIngredients) {
    if (isPooledIngredient(ing)) {
      /* A row for every studied ingredient named inside the total, not just
       * the first one matched. Bloom's blend names citrulline and beta-alanine;
       * matching only the first meant the other silently vanished from the
       * page while the first was charted at the blend's whole weight. */
      for (const e of DOSES.ingredients) {
        // Caffeine is transcribed as its own figure and gets its own row
        // below. Never mark it undisclosed on the strength of a blend name.
        if (e.label === "Caffeine" || seen.has(e.label) || metricLabels.has(e.label)) continue;
        if (!new RegExp(e.match, "i").test(ing.name)) continue;
        seen.add(e.label);
        rows.push(pooledDoseRowHTML(e, ing));
      }
      continue;
    }
    const entry = DOSES.ingredients.find((e) => new RegExp(e.match, "i").test(ing.name));
    if (!entry || seen.has(entry.label)) continue;
    seen.add(entry.label);
    const mg = parseDoseMg(ing.dose);
    rows.push(doseRowHTML(entry, mg === null ? null : toUnit(mg, entry.unit)));
  }

  if (p.metrics) {
    for (const key of Object.keys(DOSES.metrics)) {
      let entry = DOSES.metrics[key];
      if (seen.has(entry.label)) continue;
      const v = metricOf(p, key);
      if (v === null || typeof v !== "number") continue;
      // The 3–5 g figure is monohydrate research. HCl and blends are dosed on
      // a different argument, so they get the note without a drawn range.
      if (key === "creatineG" && metricOf(p, "form") !== "monohydrate") {
        entry = Object.assign({}, entry, {
          low: null, high: null,
          note: "The 3–5 g studied range is monohydrate research. This label uses another form, which has no separately established studied dose — the amounts are not interchangeable."
        });
      }

      // The sodium range is per litre of fluid. A per-serving figure only
      // becomes comparable once the label says what to mix it into, so it is
      // converted where the volume is known and left unplaced where it is
      // not. Marking a 500 mg stick against a per-litre band understated
      // every concentrated mix on the site.
      let value = v;
      if (key === "sodiumMg") {
        const ml = metricOf(p, "servingMl");
        if (ml) {
          value = Math.round(v / (ml / 1000));
          entry = Object.assign({}, entry, {
            label: "Sodium per litre",
            scaleTo: 2000,
            note: `${v} mg per serving mixed into ${ml} ml is about ${value} mg per litre. ` + entry.note
          });
        } else {
          entry = Object.assign({}, entry, {
            low: null, high: null,
            note: "The studied range is 300–700 mg of sodium per litre of fluid, and this label does not state the volume to mix a serving into — so its concentration, which is what the range measures, cannot be worked out from the panel. Check the mixing instructions on the pack."
          });
        }
      }

      seen.add(entry.label);
      rows.push(doseRowHTML(entry, value));
    }
  }

  if (p.caffeineMg > 0 && !seen.has("Caffeine")) {
    const entry = DOSES.ingredients.find((e) => e.label === "Caffeine");
    rows.push(doseRowHTML(entry, p.caffeineMg));
  }

  if (!rows.length) return "";

  return `
  <section class="sc-section" id="studied-doses">
    <div class="sc-container">
      <div class="sc-section-head">
        <h2 class="sc-pdp-h2">This label against the research</h2>
        <a class="sc-action-link" href="../index.html#methodology">How we evaluate labels</a>
      </div>
      <p class="sc-dose-intro">Each bar shows the amount commonly used in published human research, and where this label's dose falls against it. Research amounts are context, not a recommendation — they are not doses, and nothing here is medical advice. The bars compare what the label <em>states</em>; we do not laboratory-test the product to confirm it.</p>
      <ul class="sc-dose-list">
        ${rows.join("\n        ")}
      </ul>
      ${hasBlend(p) ? `<p class="sc-dose-blendnote">One or more amounts on this label sit inside a proprietary blend, so the individual doses behind the blend total cannot be compared at all.</p>` : ""}
    </div>
  </section>`;
}

/* ---- what other people say ---------------------------------------------- */

// Two signals, kept visibly apart: the number on the seller's own page, and
// what independent users report in public threads. Scoop Sense writes neither
// and collects no reviews of its own — every figure and quote is sourced,
// dated, and linked back. A product with nothing verifiable renders nothing.
function reviewsHTML(p) {
  const r = p.reviews;
  if (!r || (!r.seller && !r.community)) return "";

  const stars = (rating) => {
    const full = Math.round(rating * 2) / 2;
    let out = "";
    for (let i = 1; i <= 5; i++) {
      out += i <= full ? "★" : (i - 0.5 === full ? "◐" : "☆");
    }
    return out;
  };

  const sellerBlock = r.seller
    ? `<div class="sc-reviews-seller">
            <p class="sc-facts-title">On the seller's page</p>
            <p class="sc-seller-score"><span class="sc-seller-stars" aria-hidden="true">${stars(r.seller.rating)}</span>
              <span class="sc-seller-num">${esc(r.seller.rating)}<span class="sc-seller-outof"> / 5</span></span></p>
            <p class="sc-seller-count">${esc(Number(r.seller.count).toLocaleString("en-US"))} ratings</p>
            <p class="sc-seller-note">The brand's own storefront, read ${esc(r.seller.checked)}. A seller's rating is collected and moderated by the seller — treat it as a marketing figure, not an independent one.</p>
            <p class="sc-facts-source"><a href="${esc(r.seller.source.url)}" target="_blank" rel="noopener">${esc(r.seller.source.label)}</a> <span class="sc-ext" aria-hidden="true">&#8599;</span></p>
          </div>`
    : `<div class="sc-reviews-seller sc-reviews-empty">
            <p class="sc-facts-title">On the seller's page</p>
            <p class="sc-seller-note">This seller publishes no rating we could read.</p>
          </div>`;

  const communityBlock = r.community
    ? `<div>
            <h3 class="sc-details-heading">What people actually report</h3>
            <p class="sc-community-take">${esc(r.community.takeaway)}</p>
            <ul class="sc-community-points">
              ${r.community.points.map((pt) => `<li>
                <span class="sc-tone sc-tone-${esc(pt.tone)}">${esc(pt.tone)}</span>
                <strong>${esc(pt.label)}.</strong> ${esc(pt.note)}
              </li>`).join("\n              ")}
            </ul>
            <p class="sc-community-srclabel">Read the threads yourself</p>
            <ul class="sc-community-sources">
              ${r.community.sources.map((s) => `<li>
                ${s.quote ? `<blockquote>&ldquo;${esc(s.quote)}&rdquo;</blockquote>` : ""}
                <a href="${esc(s.url)}" target="_blank" rel="noopener nofollow">${esc(s.label)}</a> <span class="sc-ext" aria-hidden="true">&#8599;</span>
              </li>`).join("\n              ")}
            </ul>
          </div>`
    : `<div>
            <h3 class="sc-details-heading">What people actually report</h3>
            <p class="sc-community-take">We could not find enough genuine independent discussion of this product to summarise. Rather than pad this out, we have left it empty.</p>
          </div>`;

  return `
  <section class="sc-section" id="reviews">
    <div class="sc-container">
      <div class="sc-section-head">
        <h2 class="sc-pdp-h2">What other people say</h2>
        <a class="sc-action-link" href="../disclosure.html#reviews-policy">Why we don't rate products</a>
      </div>
      <p class="sc-dose-intro">Two different things, side by side: the rating the seller publishes on its own store, and what independent users write in public threads. Scoop Sense writes neither and collects no reviews of its own. Neither is evidence that a product works — they describe what people experienced and expected, not what the research shows.</p>
      <div class="sc-reviews-grid">
        ${sellerBlock}
        ${communityBlock}
      </div>
    </div>
  </section>`;
}

/* ---- generated, data-derived FAQ (no invented claims) ------------------- */

// Display name; avoids "Bucked Up Bucked Up" when brand === product name.
function fullNameOf(p) {
  return p.brand === p.name ? p.name : `${p.brand} ${p.name}`;
}

function faqFor(p) {
  const name = fullNameOf(p);
  const faqs = [];
  const cat = categoryOf(p);

  if (cat === "pre-workout" && p.caffeineMg === 0) {
    faqs.push({
      q: `Is ${name} really caffeine-free?`,
      a: `The label lists 0 mg of caffeine. It is still an active formula — ingredients like ${p.keyIngredients.map((i) => i.name).slice(0, 2).join(" and ")} are dosed to have effects — so read the full label rather than treating stim-free as effect-free.`
    });
  } else if (p.caffeineMg > 0) {
    const cups = Math.round((p.caffeineMg / 95) * 10) / 10;
    const tier = cat === "pre-workout"
      ? ` Within the Scoop Sense pre-workout database (0–${MAX_CAF} mg per serving) that places it in the ${stimLabelOf(p).toLowerCase()} tier.`
      : "";
    faqs.push({
      q: `How much caffeine is in ${name}?`,
      a: `${p.caffeineMg} mg per full labeled serving — roughly ${cups} small cups of coffee.${tier} The FDA cites about 400 mg per day as an amount generally not associated with negative effects in healthy adults, and coffee, tea, and energy drinks count toward the same total.`
    });
  }

  if (cat === "creatine") {
    const g = metricOf(p, "creatineG");
    const form = metricOf(p, "form");
    // The saturation figure is 3-5 g/day of monohydrate from the research —
    // it is not this label's number. Interpolating the label's own dose into
    // that sentence claimed a 0.75 g HCl serving saturates muscle, which no
    // research shows and which contradicted the analysis higher up the page.
    if (g) {
      const monohydrate = form === "monohydrate";
      const atStudiedDose = monohydrate && g >= 3;
      let a;
      if (atStudiedDose) {
        a = `Loading is optional. Research shows a steady 3–5 g of creatine monohydrate daily reaches muscle saturation in about three to four weeks; a loading week of around 20 g per day just gets there faster. This label's ${g} g serving sits in that studied range.`;
      } else if (monohydrate) {
        a = `Loading is optional, but note the serving size first. The saturation research uses 3–5 g of creatine monohydrate daily and this label serves ${g} g, so reaching the studied intake means taking more than one serving.`;
      } else {
        a = `The loading question does not transfer to this form. Saturation timelines come from research on 3–5 g of creatine monohydrate daily; ${form ? `${form} ` : "this form "}has no established studied dose of its own, so there is no figure to load toward. Treat the label's ${g} g as the brand's recommendation rather than a researched one.`;
      }
      faqs.push({ q: `Do I need a loading phase with ${name}?`, a });
    }
  } else if (cat === "protein") {
    const pg = metricOf(p, "proteinG"), sg = metricOf(p, "servingG");
    if (pg && sg) {
      faqs.push({
        q: `How much of a ${name} scoop is actually protein?`,
        a: `${pg} g of protein from a ${sg} g serving — about ${Math.round((pg / sg) * 100)}%. The rest is flavoring, fats, carbs, and whatever else the label lists. A higher percentage means less filler per scoop.`
      });
    }
  } else if (cat === "eaa") {
    const eaaG = metricOf(p, "eaaG"), bcaaG = metricOf(p, "bcaaG");
    faqs.push({
      q: `Is ${name} an EAA or a BCAA product?`,
      a: eaaG
        ? `A full-spectrum EAA product: ${eaaG} g of essential amino acids per serving${bcaaG ? `, of which ${bcaaG} g are the three BCAAs` : ""}. Research on muscle protein synthesis centers on the full nine essential aminos rather than BCAAs alone.`
        : `BCAA-only: it supplies the three branched-chain aminos${bcaaG ? ` (${bcaaG} g per serving)` : ""} but not the other six essential amino acids that full-EAA formulas include.`
    });
  } else if (cat === "electrolytes") {
    const na = metricOf(p, "sodiumMg"), sugar = metricOf(p, "sugarG");
    if (na !== null) {
      faqs.push({
        q: `How much sodium is in ${name}?`,
        a: `${na} mg per serving${sugar ? `, alongside ${sugar} g of sugar` : ", with no sugar"}. Sodium is the main electrolyte lost in sweat, but needs vary widely with sweat rate and diet — and daily sodium from food counts toward the same total.`
      });
    }
  }

  const beta = betaAlanineOf(p);
  if (beta) {
    faqs.push({
      q: `Why does ${name} make my skin tingle?`,
      a: `The ${beta} of beta-alanine. The prickling (paresthesia) in the face, neck, and hands is generally considered harmless, is dose-dependent, and fades on its own — typically within about an hour. Most beta-alanine studies use 3.2 g per day.`
    });
  }

  if (hasBlend(p)) {
    const blend = findIngredient(p, /blend/i);
    faqs.push({
      q: `What does the proprietary blend in ${name} hide?`,
      a: `${blend ? `The ${blend.name} lists ${blend.dose} as a combined total.` : "The blend lists one combined total."} A blend total tells you the sum of its ingredients, not the individual doses inside it — which is why blend entries can't be checked against studied amounts.`
    });
  } else if (isDisclosed(p)) {
    faqs.push({
      q: `Does ${name} disclose every dose?`,
      a: `Yes — the label lists an individual amount for each ingredient, with no proprietary blends. That is what the "label fully disclosed" tag on Scoop Sense means, and it is what lets each dose be compared against the amounts used in published research.`
    });
  }

  if (p.cautions.some((c) => /scoop/i.test(c))) {
    faqs.push({
      q: `Do the numbers for ${name} assume one scoop or two?`,
      a: `All figures on this page are per full labeled serving. ${p.cautions.find((c) => /scoop/i.test(c))}.`
    });
  }

  return faqs.slice(0, 4);
}

/* ---- related products ---------------------------------------------------- */

// Same category only — a creatine page never recommends a pre-workout.
// "Nearest" is measured on the category's lead metric: caffeine for a
// pre-workout, but creatine, protein, sodium or EAA grams elsewhere — where
// caffeine is 0 across the board and sorting on it just returned catalog order.
const LEAD_METRIC = { creatine: "creatineG", protein: "proteinG", electrolytes: "sodiumMg", eaa: "eaaG" };
function leadValue(p) {
  const key = LEAD_METRIC[categoryOf(p)];
  const v = key ? Number(p.metrics && p.metrics[key]) : p.caffeineMg;
  return Number.isFinite(v) ? v : 0;
}
function relatedFor(p) {
  const others = PRODUCTS.filter((x) => x.id !== p.id && categoryOf(x) === categoryOf(p));
  const sameBrand = others.filter((x) => x.brand === p.brand);
  const mine = leadValue(p);
  const rest = others
    .filter((x) => x.brand !== p.brand)
    .sort((a, b) => Math.abs(leadValue(a) - mine) - Math.abs(leadValue(b) - mine));
  return sameBrand.concat(rest).slice(0, 3);
}

/* ---- "labels verified" window ------------------------------------------
 *
 * Three pieces of site copy date the catalog: the homepage's "Labels last
 * checked" row, each category page's "Labels verified …" line, and the footer
 * on every page. They were hand-maintained, which meant a batch researched in
 * a new month silently left the whole site claiming the old one. The window
 * is the earliest and latest labelVerified month actually on file, so the
 * claim is always one the data can support. */
const MONTHS = ["January", "February", "March", "April", "May", "June", "July",
  "August", "September", "October", "November", "December"];

function monthKey(s) {
  const m = /^([A-Za-z]+)\s+(\d{4})$/.exec(String(s || "").trim());
  if (!m) return null;
  const i = MONTHS.indexOf(m[1]);
  return i === -1 ? null : Number(m[2]) * 12 + i;
}

const verifiedMonths = [...new Set(PRODUCTS.map((p) => p.labelVerified).filter((v) => monthKey(v)))]
  .sort((a, b) => monthKey(a) - monthKey(b));
const labelWindow = verifiedMonths.length
  ? (verifiedMonths.length === 1
      ? verifiedMonths[0]
      // Same year on both ends: "July–September 2026", not the year twice.
      : verifiedMonths[0].replace(/ (\d{4})$/, (_, y) =>
          verifiedMonths[verifiedMonths.length - 1].endsWith(y) ? "" : " " + y)
        + "\u2013" + verifiedMonths[verifiedMonths.length - 1])
  : null;

/* ---- page template ------------------------------------------------------- */

function pageHTML(p) {
  const name = fullNameOf(p);
  const title = `${name} — Label Breakdown | Scoop Sense`;
  const desc = p.blurb;
  const cit = citrullineOf(p);
  const beta = betaAlanineOf(p);
  const faqs = faqFor(p);
  const related = relatedFor(p);
  const accent = p.accentColor ? ` style="--sc-p-accent:${esc(p.accentColor)}"` : "";

  /* The studied-dose section returns "" for a product with nothing to chart,
     so the phone bar cannot link to it blind. The label panel is the fallback
     because it is the one section every product page has. */
  const doseSection = doseComparisonHTML(p);
  const breakdownHref = doseSection ? "#studied-doses" : "#label-data";
  const pageUrl = publicUrl(`products/${p.id}.html`);

  const canonicalTags = HAS_ORIGIN
    ? `\n  <meta property="og:url" content="${esc(pageUrl)}">\n  <link rel="canonical" href="${esc(pageUrl)}">`
    : "";

  // Mirrors the visible .sc-crumbs trail above the product title.
  const breadcrumbLD = HAS_ORIGIN
    ? {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "All supplements", item: publicUrl("hub.html") },
          { "@type": "ListItem", position: 2, name: cfgOf(p).label, item: publicUrl(categoryPageOf(p)) },
          { "@type": "ListItem", position: 3, name: fullNameOf(p), item: pageUrl }
        ]
      }
    : null;

  const faqLD = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a }
    }))
  };

  const LD_CATEGORY = {
    "pre-workout": "Pre-workout supplement",
    creatine: "Creatine supplement",
    protein: "Protein powder",
    eaa: "Amino acid supplement",
    electrolytes: "Electrolyte supplement"
  };

  const productLD = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    brand: { "@type": "Brand", name: p.brand },
    description: p.blurb,
    category: LD_CATEGORY[categoryOf(p)] || "Dietary supplement"
  };
  if (p.images && p.images.length) productLD.image = p.images;
  const ogImage = p.images && p.images.length
    ? `\n  <meta property="og:image" content="${esc(p.images[0])}">`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(desc)}">
  <meta name="theme-color" content="#0F1114">
  <meta property="og:site_name" content="Scoop Sense">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(desc)}">
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${esc(desc)}">${ogImage}${canonicalTags}
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🥄</text></svg>">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700&family=Inter:ital,wght@0,400;0,600;0,700;1,400&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../css/styles.css?v=${VERSION}">
</head>
<body class="sc-pdp-page">

<a class="sc-skip" href="#main">Skip to content</a>

<header class="sc-header">
  <div class="sc-container sc-header-inner">
    <a class="sc-logo" href="../index.html">Scoop Sense<span>.</span></a>
    <nav class="sc-nav" aria-label="Main navigation">
      <a href="../hub.html" class="sc-active">Products</a>
      <a href="../${compareHref(p)}">Compare</a>
      <a href="../saved.html">Saved <span class="sc-saved-count"></span></a>
      <a href="../index.html#methodology">Methodology</a>
      <a href="../disclaimer.html">Health &amp; Safety</a>
      <a href="../disclosure.html">About</a>
    </nav>
  </div>
</header>

<main id="main">

  <section class="sc-pdp"${accent}>
    <div class="sc-container">
      <nav class="sc-crumbs" aria-label="Breadcrumb">
        <a href="../hub.html">All supplements</a> <span aria-hidden="true">/</span> <a href="../${esc(categoryPageOf(p))}">${esc(cfgOf(p).label)}</a> <span aria-hidden="true">/</span> ${esc(name)}
      </nav>

      <div class="sc-pdp-grid">
        <div class="sc-pdp-media-col">
          ${mediaHTML(p)}
        </div>

        <div>
          <p class="sc-eyebrow">${esc(p.brand)}</p>
          <h1 class="sc-pdp-title">${esc(p.name)}</h1>
          <p class="sc-detail-tags">${tagsHTML(p)}</p>
          ${bucketOf(p) === "high" ? `<p class="sc-safety-cue"><a href="../disclaimer.html">High stimulant content · Read safety guidance</a></p>` : ""}
          <p class="sc-analysis-tag">Our analysis — editorial take, not from the label</p>
          <p class="sc-lead sc-pdp-lead">${esc(p.blurb)}</p>

          <dl class="sc-detail-stats">
            ${cfgOf(p).tileFacts.map((f) => `<div><dt>${esc(f.label)}</dt><dd>${factOf(p, f.key)}</dd></div>`).join("\n            ")}
            <div><dt>Servings</dt><dd>${esc(p.servings)}</dd></div>
          </dl>

          <div class="sc-buybox">
            <p class="sc-buybox-tier">Price tier: <strong>${priceWordHTML(p)}</strong> <span>· relative cost per full serving across this database</span></p>
            <p class="sc-buybox-why">We don't list dollar prices — they change daily and go stale. Check the live price instead:</p>
            <a class="sc-btn sc-btn-primary sc-btn-lg" href="${esc(p.affiliateUrl)}" target="_blank" rel="sponsored nofollow noopener">View current price at ${esc(retailerOf(p))} <span class="sc-ext" aria-hidden="true">&#8599;</span></a>
            ${categoryOf(p) === "pre-workout"
              ? `<a class="sc-btn sc-btn-secondary" href="../compare.html">Compare all ${preWorkouts.length} pre-workouts</a>`
              : `<a class="sc-btn sc-btn-secondary" href="../${esc(cfgOf(p).page)}#compare">Compare all ${esc(cfgOf(p).plural)}</a>`}
            <button type="button" class="sc-btn sc-btn-secondary sc-save-btn-pdp" data-save-id="${esc(p.id)}" aria-pressed="false"><span class="sc-save-icon" aria-hidden="true"></span> <span class="sc-save-text">Save to compare</span></button>
            <p class="sc-buybox-reviews">Scoop Sense doesn't collect user reviews and won't invent them. <a href="${esc(p.affiliateUrl)}" target="_blank" rel="sponsored nofollow noopener">${
              /* Only Amazon is promised to carry reviews, because only there do
                 we know they exist. A brand store may have none, and the link
                 label must not claim otherwise. */
              retailerOf(p) === "Amazon"
                ? "Read customer reviews on Amazon"
                : `See the ${esc(retailerOf(p))} listing`
            } <span class="sc-ext" aria-hidden="true">&#8599;</span></a></p>
            <p class="sc-detail-note">Affiliate links — Scoop Sense may earn a commission at no additional cost to you.</p>
          </div>

          <p class="sc-pdp-flavors">${esc(p.flavorsNote)}</p>
          <p class="sc-detail-verified">${(() => {
            const f = factsLinkOf(p);
            return f
              ? `Label verified: ${esc(p.labelVerified)} · <a href="${esc(f.url)}" target="_blank" rel="noopener">View ${esc(f.what)}</a> <span class="sc-ext" aria-hidden="true">&#8599;</span>`
              : `Label verified: ${esc(p.labelVerified)}`;
          })()}</p>
        </div>
      </div>
    </div>
  </section>

  <section class="sc-section" id="label-data">
    <div class="sc-container">
      <div class="sc-pdp-cols">
        <div class="sc-facts">
          <p class="sc-facts-title">Label data</p>
          <p class="sc-facts-sub">Per full serving · ${esc(p.servings)} servings per container · from the manufacturer's panel</p>
          <table class="sc-table">
            <caption class="sc-vh">Supplement facts for ${esc(name)}, per full serving</caption>
            <tbody>
              ${factsRowsHTML(p)}
            </tbody>
          </table>
          ${p.sources && p.sources.length ? `<p class="sc-facts-source">Primary label source: <a href="${esc(p.sources[0].url)}" target="_blank" rel="noopener">${esc(p.sources[0].label)}</a> · verified ${esc(p.labelVerified)}</p>` : ""}

          <!-- Cautions belong beside the figures that produce them, not one
               click away inside an accordion. -->
          <div class="sc-cautions">
            <p class="sc-details-heading">Cautions</p>
            <ul>
              ${p.cautions.map((c) => `<li>${esc(c)}</li>`).join("\n              ")}
            </ul>
            <!-- Standing, and deliberately here rather than only on the safety
                 page: a reader checking a 400 mg label for a teenager was
                 given the number and left to find the age line three clicks
                 away. Kept out of p.cautions — that list is what this label
                 produces, this sentence is true of every product on file. -->
            <p class="sc-cautions-more">Formulated for healthy adults — not intended for anyone under 18.${ageCaffeineNote(p)} <a href="../disclaimer.html">Full health &amp; safety notes</a></p>
          </div>
        </div>

        <div>
          <h2 class="sc-pdp-h2">Product details</h2>
          <div class="sc-faq">
            <details open>
              <summary>Where this label sits</summary>
              <p>${categoryOf(p) === "pre-workout"
                ? `${esc(name)} sits in the ${esc(stimLabelOf(p).toLowerCase())} tier of the Scoop Sense pre-workout database, which spans 0–${MAX_CAF} mg of caffeine per serving. `
                : `${esc(name)} is one of the ${esc(cfgOf(p).plural)} in the Scoop Sense database. `}${
                  hasBlend(p)
                    ? `The label uses at least one proprietary blend, so a blend total stands in place of the individual amounts inside it. `
                    : isDisclosed(p)
                      ? `Every active ingredient on the panel is listed with its own dose — nothing is hidden inside a blend total. `
                      : ""
                }It runs ${esc(p.servings)} servings per container at the full labeled serving. Everything on this page comes from the manufacturer's supplement facts panel as of ${esc(p.labelVerified)} — never from the marketing page.</p>
            </details>
            <details>
              <summary>Key ingredients &amp; studied doses</summary>
              <ul class="sc-notes-list">
                ${p.keyIngredients.map((i) => `<li><strong>${esc(i.name)} · ${esc(i.dose)}.</strong> ${esc(i.clinicalNote)}</li>`).join("\n                ")}
              </ul>
            </details>
            <details>
              <summary>Flavors &amp; sweetener</summary>
              <p>${esc(p.flavorsNote)}</p>
            </details>
            <details>
              <summary>Who it's best for</summary>
              <p>${whoForHTML(p)} <span class="sc-dim">Derived from the label figures above — not medical advice.</span></p>
            </details>
            <details>
              <summary>How we log this label</summary>
              <p>Every entry is built the same way: we read the current supplement facts panel, log each disclosed dose, compare it against the amounts used in published research, flag proprietary blends, and state the cautions plainly. <a href="../index.html#methodology">The full methodology</a> explains each step.</p>
            </details>
          </div>
        </div>
      </div>
    </div>
  </section>

${doseSection}
${reviewsHTML(p)}

  <section class="sc-section">
    <div class="sc-container">
      <div class="sc-pdp-tail">
        <div>
          <h2 class="sc-pdp-h2">Common questions about ${esc(name)}</h2>
          <div class="sc-faq">
            ${faqs.map((f) => `<details>
              <summary>${esc(f.q)}</summary>
              <p>${esc(f.a)}</p>
            </details>`).join("\n            ")}
          </div>
        </div>
        <div>
          <h2 class="sc-pdp-h2">Compare it against</h2>
          <div class="sc-related">
            ${related.map((r) => `<a class="sc-related-card" href="${esc(r.id)}.html">
              <span class="sc-tile-brand">${esc(r.brand)}</span>
              <span class="sc-tile-name">${esc(r.name)}</span>
              <span class="sc-related-meta">${relatedMetaOf(r)} · ${esc(priceWordOf(r))}</span>
            </a>`).join("\n            ")}
          </div>
          <p class="sc-related-more"><a href="../${esc(categoryPageOf(p))}">All ${esc(cfgOf(p).plural)} on file</a></p>
        </div>
      </div>
    </div>
  </section>

</main>

<footer class="sc-footer">
  <div class="sc-container">
    <div class="sc-footer-grid">
      <div>
        <p class="sc-footer-logo">Scoop Sense</p>
        <p>An independent supplement label database. Caffeine figures, ingredient doses, and cautions come from manufacturer labels, compared against amounts used in published research.</p>
      </div>
      <nav aria-label="Browse">
        <p class="sc-footer-head">Browse</p>
        <ul>
          <li><a href="../hub.html">All products</a></li>
          <li><a href="../creatine.html">Creatine</a></li>
          <li><a href="../protein.html">Protein</a></li>
          <li><a href="../eaa.html">EAA / BCAA</a></li>
          <li><a href="../electrolytes.html">Electrolytes</a></li>
          <li><a href="../${compareHref(p)}">Compare ${esc(cfgOf(p).plural)}</a></li>
          <li><a href="../index.html#methodology">How we evaluate labels</a></li>
        </ul>
      </nav>
      <nav aria-label="Reference">
        <p class="sc-footer-head">Reference</p>
        <ul>
          <li><a href="../disclaimer.html">Health &amp; safety</a></li>
          <li><a href="../disclosure.html">About &amp; disclosure</a></li>
          <li><a href="../disclosure.html#contact">Contact &amp; corrections</a></li>
        </ul>
      </nav>
      <div class="sc-footer-legal">
        <p class="sc-footer-head">Disclosure</p>
        <p>Some product links are affiliate links. Scoop Sense may earn a commission at no additional cost to you.</p>
        <p>These statements have not been evaluated by the Food and Drug Administration. These products are not intended to diagnose, treat, cure, or prevent any disease.</p>
      </div>
    </div>
    <div class="sc-footer-bottom">
      <p>&copy; 2026 Scoop Sense</p>
      <p>Labels last reviewed ${labelWindow || "July 2026"}</p>
    </div>
  </div>
</footer>

<!-- Phone-only action bar. The page's job is the label breakdown and the
     breakdown is 3.6 screens down, while the affiliate link sat 1.8 screens
     down with nothing to bring it back — a reader who wanted either had to go
     hunting. The bar carries both, with the breakdown as the filled control
     and the retailer link beside it: the same order of priority the page
     itself keeps, held where a thumb can reach it. -->
<div class="sc-pdp-bar">
  <p class="sc-pdp-bar-tier"><span>Price tier</span><strong>${esc(priceWordOf(p))}</strong></p>
  <a class="sc-pdp-bar-read" href="${breakdownHref}">Label breakdown</a>
  <a class="sc-pdp-bar-buy" href="${esc(p.affiliateUrl)}" target="_blank" rel="sponsored nofollow noopener">${esc(retailerOf(p))} <span class="sc-ext" aria-hidden="true">&#8599;</span></a>
</div>

<script type="application/ld+json">
${JSON.stringify(productLD, null, 2)}
</script>
<script type="application/ld+json">
${JSON.stringify(faqLD, null, 2)}
</script>
${breadcrumbLD ? `<script type="application/ld+json">\n${JSON.stringify(breadcrumbLD, null, 2)}\n</script>\n` : ""}${slidesOf(p).length ? GALLERY_SCRIPT : ""}<script src="../js/app.js?v=${VERSION}"></script>
</body>
</html>
`;
}

/* ---- build --------------------------------------------------------------- */

fs.mkdirSync(OUT, { recursive: true });
let count = 0;
for (const p of PRODUCTS) {
  fs.writeFileSync(path.join(OUT, `${p.id}.html`), pageHTML(p));
  count++;
}
console.log(`Built ${count} product pages in products/`);

/* ---- per-category data slices -------------------------------------------- */

// data/products.js stays the single source of truth, but a category landing
// page has no use for the other four categories — and the full file is the
// heaviest thing on the site. Each page loads only its own slice, generated
// here so the two can never disagree.
const SLICE_DIR = path.join(ROOT, "data", "by-category");
if (!fs.existsSync(SLICE_DIR)) fs.mkdirSync(SLICE_DIR, { recursive: true });

for (const slug of Object.keys(CATEGORY_CONFIG)) {
  const slice = PRODUCTS.filter((p) => categoryOf(p) === slug);
  const body =
    `// GENERATED by scripts/build-product-pages.js — do not edit.\n` +
    `// The ${slug} slice of data/products.js, loaded by that category's page\n` +
    `// in place of the full catalog. Edit data/products.js and re-run the build.\n\n` +
    `var PRODUCTS = ${JSON.stringify(slice, null, 2)};\n`;
  fs.writeFileSync(path.join(SLICE_DIR, `${slug}.js`), body);
}
console.log(`Wrote ${Object.keys(CATEGORY_CONFIG).length} category data slices in data/by-category/`);

/* ---- static catalog markup ----------------------------------------------- */

/* The hub, the five category pages and the compare table used to arrive empty
 * and fill themselves in from js/app.js. That is fine for a reader with
 * JavaScript and useless to everyone else: a crawler fetching creatine.html got
 * the heading, the filters, and then "No products match the current filters."
 * Worse, it meant nothing on the site statically linked to the 187 product
 * pages — they existed, they were in the sitemap, and no page pointed at them.
 *
 * So the same renderers now run here at build time and their output is written
 * into the files. js/app.js still owns the markup; this only asks it for the
 * strings. On load the browser re-renders as it always did, and because the
 * tile count matches what it draws first, nothing moves.
 */

function loadRenderer() {
  const read = (...p) => fs.readFileSync(path.join(ROOT, ...p), "utf8");
  // app.js reads globals the browser sets up by loading these first, and it
  // touches document.body the moment it is evaluated.
  const doc = {
    body: { getAttribute: () => null },
    addEventListener() {},
    getElementById: () => null,
    querySelector: () => null,
    querySelectorAll: () => []
  };
  const mod = { exports: {} };
  const build = new Function(
    "module", "document", "window",
    [read("data", "products.js"), read("js", "categories.js"),
     read("js", "doses.js"), read("js", "app.js"), "return module.exports;"].join("\n")
  );
  return build(mod, doc, {});
}

// Markers make the injection idempotent. Without them a rebuild would either
// append a second copy of the catalog or need a regex to find the container's
// matching close tag, which is not something to attempt on markup that nests.
function fill(html, openTag, name, content) {
  const between = new RegExp(`(<!--sc:${name}-->)[\\s\\S]*?(<!--/sc:${name}-->)`);
  if (between.test(html)) return html.replace(between, `$1${content}$2`);
  const at = html.indexOf(openTag);
  if (at === -1) throw new Error(`${name}: could not find ${openTag}`);
  const cut = at + openTag.length;
  return html.slice(0, cut) + `<!--sc:${name}-->${content}<!--/sc:${name}-->` + html.slice(cut);
}

const staticMarkup = loadRenderer();
const GRID = '<div class="sc-products" id="sc-products">';
const TBODY = '<tbody id="sc-compare-body">';
const THEAD = "<thead>";

const PAGES = [
  { file: "index.html", category: null, parts: ["preview", "starts"] },
  { file: "hub.html", category: null, parts: ["tiles"] },
  { file: "creatine.html", category: "creatine", parts: ["tiles", "compare"] },
  { file: "protein.html", category: "protein", parts: ["tiles", "compare"] },
  { file: "eaa.html", category: "eaa", parts: ["tiles", "compare"] },
  { file: "electrolytes.html", category: "electrolytes", parts: ["tiles", "compare"] },
  { file: "compare.html", category: "pre-workout", parts: ["compare"] }
];

let staticPages = 0;
for (const page of PAGES) {
  const m = staticMarkup(page.category);
  const file = path.join(ROOT, page.file);
  let html = fs.readFileSync(file, "utf8");

  if (page.parts.includes("tiles")) html = fill(html, GRID, "tiles", m.tiles);
  if (page.parts.includes("compare")) {
    html = fill(html, THEAD, "comparehead", m.compareHead);
    html = fill(html, TBODY, "comparerows", m.compareRows);
  }
  if (page.parts.includes("preview")) html = fill(html, '<tbody id="sc-preview-body">', "preview", m.preview);
  if (page.parts.includes("starts")) html = fill(html, '<div class="sc-starts" id="sc-starts">', "starts", m.starts);

  fs.writeFileSync(file, html, "utf8");
  staticPages++;
}
console.log(`Wrote catalog markup into ${staticPages} pages`);

/* ---- sitemap ------------------------------------------------------------- */

// saved.html is absent on purpose: it renders whatever the reader has saved
// locally, so there is nothing there for a crawler to index.
const ROOT_PAGES = [
  "index.html", "hub.html", "creatine.html", "protein.html", "eaa.html",
  "electrolytes.html", "compare.html", "disclosure.html", "disclaimer.html"
];

const urls = ROOT_PAGES.map(publicUrl)
  .concat(PRODUCTS.map((p) => publicUrl(`products/${p.id}.html`)));

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${u}</loc></url>`).join("\n")}
</urlset>
`;
fs.writeFileSync(path.join(ROOT, "sitemap.xml"), sitemap);
console.log(`Wrote sitemap.xml (${urls.length} URLs)`);

/* ---- homepage hero figures ---------------------------------------------- */

/* js/app.js writes the hero panel's figures at runtime from PRODUCTS, and
 * index.html carries hardcoded fallbacks for the moment before the script
 * runs — which is also what a crawler or a link-preview scraper that does not
 * execute JavaScript reads.
 *
 * Those fallbacks were maintained by hand and went stale: the homepage of a
 * 187-product database advertised "78 supplement labels on file", because the
 * number was last touched when there were two categories. Deriving them from
 * the same source as the runtime values is the only way they cannot drift
 * again. cafRange is deliberately left alone — app.js builds that array with
 * its own filter, and a figure this file guessed at would be the same class of
 * mistake. */
const heroStats = {
  total: String(PRODUCTS.length),
  totalLabels: `${PRODUCTS.length} supplement labels on file`,
  categories: String(Object.keys(CATEGORY_CONFIG).length),
  disclosed: `${PRODUCTS.filter(isDisclosed).length} of ${PRODUCTS.length}`,
  blends: `${PRODUCTS.filter(hasBlend).length} of ${PRODUCTS.length}`,
  preCount: String(PRODUCTS.filter((p) => categoryOf(p) === "pre-workout").length)
};

const indexPath = path.join(ROOT, "index.html");
let indexHTML = fs.readFileSync(indexPath, "utf8");
const stale = [];
for (const [key, value] of Object.entries(heroStats)) {
  indexHTML = indexHTML.replace(
    new RegExp(`(data-stat="${key}">)([^<]*)`, "g"),
    (_, open, was) => {
      if (was !== value) stale.push(`${key}: "${was}" -> "${value}"`);
      return open + value;
    }
  );
}

// The label panel's shelf rows carry per-category counts under the same
// no-hand-maintenance rule: js/app.js recounts them at runtime, and this
// keeps the static fallback a crawler reads from drifting.
for (const slug of Object.keys(CATEGORY_CONFIG)) {
  const n = PRODUCTS.filter((p) => categoryOf(p) === slug).length;
  const value = `${n} ${n === 1 ? "label" : "labels"}`;
  indexHTML = indexHTML.replace(
    new RegExp(`(data-cat-count="${slug}">)([^<]*)`, "g"),
    (_, open, was) => {
      if (was !== value) stale.push(`${slug}: "${was}" -> "${value}"`);
      return open + value;
    }
  );
}
fs.writeFileSync(indexPath, indexHTML);
console.log(
  stale.length
    ? `Updated ${stale.length} stale hero figure(s) in index.html\n  ${stale.join("\n  ")}`
    : "Hero figures in index.html already current"
);

/* The same pass keeps every root page's cache-bust token equal to VERSION.
 * Product pages are regenerated with it above; the hand-written pages were
 * bumped by hand, and skipped a bump after a data change, so a returning
 * browser kept its stale app.js and the old catalog. */
const pages = fs.readdirSync(ROOT).filter((f) => f.endsWith(".html"));
const touched = [];
for (const f of pages) {
  const fp = path.join(ROOT, f);
  const before = fs.readFileSync(fp, "utf8");
  let after = before.replace(/(\.(?:css|js))\?v=[A-Za-z0-9_.-]+/g, `$1?v=${VERSION}`);
  if (labelWindow) {
    after = after
      .replace(/Labels last reviewed [^<]*/g, `Labels last reviewed ${labelWindow}`)
      .replace(/Labels verified [^<]*?\./g, `Labels verified ${labelWindow}.`)
      .replace(/(<dt>Labels last checked<\/dt><dd>)[^<]*/g, (_, open) => open + labelWindow);
  }
  if (after !== before) { fs.writeFileSync(fp, after); touched.push(f); }
}
console.log(touched.length
  ? `Re-dated / re-versioned ${touched.length} root page(s) (v=${VERSION}${labelWindow ? `, "${labelWindow}"` : ""}): ${touched.join(", ")}`
  : `Root pages already read v=${VERSION}${labelWindow ? ` and "${labelWindow}"` : ""}`);
