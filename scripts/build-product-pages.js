// Scoop Sense — static product-page generator.
//
// Reads data/products.js (the same file the browser loads) and writes one
// static HTML page per product into products/. Re-run after any data change:
//
//   node scripts/build-product-pages.js
//
// Honesty rules baked in (do not remove):
//   - No dollar prices, no cart, no fabricated reviews or star ratings.
//   - Product artwork is a generic stylized tub (brand color + monogram),
//     captioned as illustrative — never real packaging.

"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const OUT = path.join(ROOT, "products");
const VERSION = "20260728m"; // keep in sync with the ?v= on the other pages

/* ---- load data ---------------------------------------------------------- */

const dataSrc = fs.readFileSync(path.join(ROOT, "data", "products.js"), "utf8");
const { PRODUCTS } = new Function(dataSrc + "\nreturn { PRODUCTS, FEATURED_IDS };")();

const COUNT = PRODUCTS.length;
const MAX_CAF = Math.max(...PRODUCTS.map((p) => p.caffeineMg));

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

function hasBlend(p) {
  return p.badges.indexOf("Proprietary Blend") !== -1 || !!findIngredient(p, /blend/i);
}

function isDisclosed(p) {
  return p.badges.indexOf("Fully Disclosed Label") !== -1;
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

function tagsHTML(p) {
  const tags = [];
  const b = bucketOf(p);
  let cls = "sc-tag";
  if (b === "high") cls += " sc-tag-caution";
  if (b === "none") cls += " sc-tag-calm";
  tags.push(`<span class="${cls}" title="${esc(STIM_TIPS[b])}">${esc(stimLabelOf(p))}</span>`);
  if (hasBlend(p)) tags.push(`<span class="sc-tag sc-tag-caution" title="${esc(BLEND_TIP)}">Proprietary blend</span>`);
  else if (isDisclosed(p)) tags.push(`<span class="sc-tag" title="${esc(DISCLOSED_TIP)}">Label fully disclosed</span>`);
  return tags.join("");
}

// "$" | "$$" | "$$$" -> plain-English cost-per-serving tier, with the basis
// for the judgment exposed as a tooltip.
const PRICE_TIPS = {
  Budget: "Estimated cost per full serving sits in the lowest third of this database — roughly $1.10 or less at the time of the last label check.",
  "Mid-range": "Estimated cost per full serving sits in the middle third of this database — roughly $1.10–$1.90 at the time of the last label check.",
  Premium: "Estimated cost per full serving sits in the highest third of this database — roughly $1.90 or more at the time of the last label check."
};

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
  if (p.caffeineMg === 0) parts.push("People who train late in the day or want zero caffeine — the effects here come from the non-stimulant ingredients.");
  else if (p.caffeineMg < 150) parts.push("Caffeine-sensitive users, or coffee drinkers who only want a modest top-up.");
  else if (p.caffeineMg < 250) parts.push("Most regular gym-goers — the caffeine dose is in the range of about two cups of coffee.");
  else if (p.caffeineMg < 350) parts.push("Users with an established caffeine tolerance.");
  else parts.push("Experienced high-stimulant users only — not a sensible first pre-workout.");
  if (p.badges.indexOf("Budget Pick") !== -1) parts.push("A reasonable pick when cost per serving matters.");
  if (p.badges.indexOf("Beginner Friendly") !== -1) parts.push("Doses are mild enough to suit a first tub.");
  if (hasBlend(p)) parts.push("Skip it if you want every individual dose disclosed on the label.");
  return parts.map((s) => esc(s)).join(" ");
}

/* Generic stylized tub — deliberately NOT the real packaging. */
function tubSVG(p) {
  const accent = p.accentColor || "#4A4237";
  const mono = esc(monogramOf(p));
  return `<svg viewBox="0 0 200 240" role="img" aria-label="Stylized illustration of a supplement tub" xmlns="http://www.w3.org/2000/svg">
  <rect x="34" y="6" width="132" height="34" rx="10" fill="#0B0D10" stroke="#333A44"/>
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
function slidesOf(p) {
  const name = fullNameOf(p);
  const slides = [{ src: `../images/products/${p.id}.png`, alt: `${name} — product render` }];
  for (const u of p.images) slides.push({ src: u, alt: `${name} — retailer photo` });
  return slides;
}

function mediaHTML(p) {
  if (!p.images || !p.images.length) {
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
            <img id="sc-lightbox-img" src="" alt="" referrerpolicy="no-referrer">
          </div>`;
}

const GALLERY_SCRIPT = `<script>
(function () {
  var main = document.getElementById("sc-gallery-main");
  if (!main) return;
  var thumbs = Array.prototype.slice.call(document.querySelectorAll(".sc-gallery-thumb"));
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
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !box.hidden) closeBox(); });
})();
</script>
`;

function factsRowsHTML(p) {
  const rows = [
    `<tr><td>Caffeine</td><td class="sc-num">${p.caffeineMg === 0 ? "0 mg" : esc(p.caffeineMg) + " mg"}</td></tr>`
  ];
  for (const ing of p.keyIngredients) {
    if (/caffeine/i.test(ing.name)) continue;
    rows.push(`<tr><td>${esc(ing.name)}</td><td class="sc-num">${esc(ing.dose)}</td></tr>`);
  }
  rows.push(`<tr><td>Proprietary blend</td><td class="sc-num">${hasBlend(p) ? "Yes" : "No"}</td></tr>`);
  return rows.join("\n              ");
}

/* ---- generated, data-derived FAQ (no invented claims) ------------------- */

// Display name; avoids "Bucked Up Bucked Up" when brand === product name.
function fullNameOf(p) {
  return p.brand === p.name ? p.name : `${p.brand} ${p.name}`;
}

function faqFor(p) {
  const name = fullNameOf(p);
  const faqs = [];

  if (p.caffeineMg === 0) {
    faqs.push({
      q: `Is ${name} really caffeine-free?`,
      a: `The label lists 0 mg of caffeine. It is still an active formula — ingredients like ${p.keyIngredients.map((i) => i.name).slice(0, 2).join(" and ")} are dosed to have effects — so read the full label rather than treating stim-free as effect-free.`
    });
  } else {
    const cups = Math.round((p.caffeineMg / 95) * 10) / 10;
    faqs.push({
      q: `How much caffeine is in ${name}?`,
      a: `${p.caffeineMg} mg per full labeled serving — roughly ${cups} small cups of coffee. Within the Scoop Sense database (0–${MAX_CAF} mg per serving) that places it in the ${stimLabelOf(p).toLowerCase()} tier. The FDA cites about 400 mg per day as an amount generally not associated with negative effects in healthy adults, and coffee, tea, and energy drinks count toward the same total.`
    });
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

function relatedFor(p) {
  const others = PRODUCTS.filter((x) => x.id !== p.id);
  const sameBrand = others.filter((x) => x.brand === p.brand);
  const rest = others
    .filter((x) => x.brand !== p.brand)
    .sort((a, b) => Math.abs(a.caffeineMg - p.caffeineMg) - Math.abs(b.caffeineMg - p.caffeineMg));
  return sameBrand.concat(rest).slice(0, 3);
}

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

  const faqLD = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a }
    }))
  };

  const productLD = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    brand: { "@type": "Brand", name: p.brand },
    description: p.blurb,
    category: p.category === "creatine" ? "Creatine supplement" : "Pre-workout supplement"
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
  <meta name="twitter:card" content="summary">${ogImage}
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🥄</text></svg>">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700&family=Inter:ital,wght@0,400;0,600;0,700;1,400&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../css/styles.css?v=${VERSION}">
</head>
<body>

<a class="sc-skip" href="#main">Skip to content</a>

<header class="sc-header">
  <div class="sc-container sc-header-inner">
    <a class="sc-logo" href="../index.html">Scoop Sense<span>.</span></a>
    <nav class="sc-nav" aria-label="Main navigation">
      <a href="../hub.html" class="sc-active">Products</a>
      <a href="../compare.html">Compare</a>
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
        <a href="../hub.html">All supplements</a> <span aria-hidden="true">/</span> ${esc(name)}
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
            <div><dt>Caffeine</dt><dd>${p.caffeineMg === 0 ? "0 mg" : esc(p.caffeineMg) + " mg"}</dd></div>
            <div><dt>Citrulline</dt><dd>${cit ? esc(cit.dose) + (cit.form ? " <small>" + esc(cit.form) + "</small>" : "") : '<span class="sc-dim">—</span>'}</dd></div>
            <div><dt>Beta-alanine</dt><dd>${beta ? esc(beta) : '<span class="sc-dim">—</span>'}</dd></div>
            <div><dt>Servings</dt><dd>${esc(p.servings)}</dd></div>
            <div><dt>Price tier</dt><dd>${priceWordHTML(p)}</dd></div>
          </dl>

          <div class="sc-buybox">
            <p class="sc-buybox-tier">Price tier: <strong>${priceWordHTML(p)}</strong> <span>· relative cost per full serving across this database</span></p>
            <p class="sc-buybox-why">We don't list dollar prices — they change daily and go stale. Check the live price instead:</p>
            <a class="sc-btn sc-btn-primary sc-btn-lg" href="${esc(p.affiliateUrl)}" target="_blank" rel="sponsored nofollow noopener">View current price <span class="sc-ext" aria-hidden="true">&#8599;</span></a>
            <a class="sc-btn sc-btn-secondary" href="../compare.html">Compare all ${COUNT} formulas</a>
            <button type="button" class="sc-btn sc-btn-secondary sc-save-btn-pdp" data-save-id="${esc(p.id)}" aria-pressed="false"><span class="sc-save-icon" aria-hidden="true"></span> <span class="sc-save-text">Save to compare</span></button>
            <p class="sc-detail-note">Affiliate link — Scoop Sense may earn a commission at no additional cost to you.</p>
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

  <section class="sc-section">
    <div class="sc-container">
      <div class="sc-pdp-cols">
        <div class="sc-facts">
          <p class="sc-facts-title">Label data</p>
          <p class="sc-facts-sub">Per full serving · ${esc(p.servings)} servings per container · from the manufacturer's panel</p>
          <table class="sc-table">
            <tbody>
              ${factsRowsHTML(p)}
            </tbody>
          </table>
          ${p.sources && p.sources.length ? `<p class="sc-facts-source">Primary label source: <a href="${esc(p.sources[0].url)}" target="_blank" rel="noopener">${esc(p.sources[0].label)}</a> · verified ${esc(p.labelVerified)}</p>` : ""}
        </div>

        <div>
          <h2 class="sc-pdp-h2">Product details</h2>
          <div class="sc-faq">
            <details open>
              <summary>What is ${esc(name)}?</summary>
              <p>${esc(p.blurb)} It sits in the ${esc(stimLabelOf(p).toLowerCase())} tier of the Scoop Sense database, which spans 0–${MAX_CAF} mg of caffeine per serving. Everything on this page comes from the manufacturer's supplement facts panel as of ${esc(p.labelVerified)} — never from the marketing page.</p>
            </details>
            <details>
              <summary>Key ingredients &amp; studied doses</summary>
              <ul class="sc-notes-list">
                ${p.keyIngredients.map((i) => `<li><strong>${esc(i.name)} · ${esc(i.dose)}.</strong> ${esc(i.clinicalNote)}</li>`).join("\n                ")}
              </ul>
            </details>
            <details>
              <summary>Cautions</summary>
              <div class="sc-cautions"><ul>
                ${p.cautions.map((c) => `<li>${esc(c)}</li>`).join("\n                ")}
              </ul></div>
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

  <section class="sc-section">
    <div class="sc-container">
      <h2 class="sc-pdp-h2">Common questions about ${esc(name)}</h2>
      <div class="sc-faq">
        ${faqs.map((f) => `<details>
          <summary>${esc(f.q)}</summary>
          <p>${esc(f.a)}</p>
        </details>`).join("\n        ")}
      </div>
    </div>
  </section>

  <section class="sc-section">
    <div class="sc-container">
      <h2 class="sc-pdp-h2">Reviews</h2>
      <p class="sc-pdp-reviews-note">Scoop Sense doesn't collect user reviews, and we won't invent them. Our editorial read: <strong>${esc(p.blurb)}</strong></p>
      <a class="sc-btn sc-btn-secondary" href="${esc(p.affiliateUrl)}" target="_blank" rel="sponsored nofollow noopener">Read customer reviews on Amazon</a>
      <p class="sc-detail-note">Affiliate link — Scoop Sense may earn a commission at no additional cost to you.</p>
    </div>
  </section>

  <section class="sc-section">
    <div class="sc-container">
      <h2 class="sc-pdp-h2">Compare it against</h2>
      <div class="sc-related">
        ${related.map((r) => `<a class="sc-related-card" href="${esc(r.id)}.html"${r.accentColor ? ` style="--sc-p-accent:${esc(r.accentColor)}"` : ""}>
          <span class="sc-tile-brand">${esc(r.brand)}</span>
          <span class="sc-tile-name">${esc(r.name)}</span>
          <span class="sc-related-meta">${r.caffeineMg === 0 ? "Stim-free · 0 mg" : esc(r.caffeineMg) + " mg caffeine"} · ${esc(r.priceRange)}</span>
        </a>`).join("\n        ")}
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
          <li><a href="../compare.html">Compare formulas</a></li>
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
      <p>Labels last reviewed July 2026</p>
    </div>
  </div>
</footer>

<script type="application/ld+json">
${JSON.stringify(productLD, null, 2)}
</script>
<script type="application/ld+json">
${JSON.stringify(faqLD, null, 2)}
</script>
${p.images && p.images.length > 1 ? GALLERY_SCRIPT : ""}<script src="../js/app.js?v=${VERSION}"></script>
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
