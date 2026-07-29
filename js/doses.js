/* Scoop Sense — studied-dose reference ranges.
 *
 * Loaded AFTER data/products.js and BEFORE js/app.js on pages that render
 * dose context; also eval-loaded by scripts/build-product-pages.js. Defines
 * one global: STUDIED_DOSES.
 *
 * WHAT THIS IS. The site's whole claim is "we line the labeled dose up
 * against the amount used in published research." That comparison lived only
 * in prose. This file is the reference table behind it, so the comparison can
 * be drawn — one row per ingredient the catalog actually uses.
 *
 * RULES (do not relax):
 *   - Ranges describe the amounts commonly used in published human research.
 *     They are NOT recommendations, doses, or medical advice, and the copy
 *     that renders them must never say "should take" or name a condition.
 *   - Structure/function language only in every `note`.
 *   - An ingredient with no settled research dose gets `low: null` — it
 *     renders as a note with no bar. Never invent a range to fill a gap.
 *
 * Entry shape:
 *   match   string  case-insensitive regex, tested against the ingredient name
 *                   in data/products.js (also used for metrics keys, below)
 *   label   string  display name for the comparison line
 *   low     number  low end of the commonly studied per-day/per-dose amount,
 *                   in `unit`; null when research has not settled one
 *   high    number  high end; equals `low` when studies cluster on one amount
 *   unit    "mg" | "g"
 *   scaleTo number  where the drawn scale ends, in `unit` — chosen so a
 *                   typical label lands inside the bar, not off the end
 *   note    string  one sentence of research context, plain language
 */

var STUDIED_DOSES = {
  /* ---- ingredient-name matches (keyIngredients[].name) ------------------ */
  ingredients: [
    {
      match: "caffeine",
      label: "Caffeine",
      low: 200, high: 400, unit: "mg", scaleTo: 450,
      note: "Performance studies most often use 3–6 mg per kg of body weight, which works out to roughly 200–400 mg for most adults. The FDA cites 400 mg a day as an amount not generally associated with negative effects in healthy adults."
    },
    {
      match: "beta[- ]?alanine",
      label: "Beta-alanine",
      low: 3.2, high: 6.4, unit: "g", scaleTo: 7,
      note: "Studied as a daily loading protocol of 3.2–6.4 g taken for four weeks or longer. A single serving below that range still counts toward the daily total, but one scoop is not a studied dose on its own."
    },
    {
      match: "citrulline",
      label: "Citrulline",
      low: 6, high: 8, unit: "g", scaleTo: 10,
      note: "Studies use about 6 g of pure L-citrulline, or 8 g of citrulline malate — which is roughly 6 g of citrulline once the malate is subtracted."
    },
    {
      match: "creatine monohydrate|micronized creatine",
      label: "Creatine",
      low: 3, high: 5, unit: "g", scaleTo: 6,
      note: "Maintenance dosing in the research is 3–5 g a day of monohydrate, every day, not only on training days."
    },
    {
      match: "creatine hcl",
      label: "Creatine HCl",
      low: null, high: null, unit: "g", scaleTo: 6,
      note: "Creatine HCl has no established studied dose of its own. Brands serve it at a fraction of the monohydrate amount on a solubility argument that head-to-head research has not settled."
    },
    {
      match: "creatine nitrate",
      label: "Creatine nitrate",
      low: null, high: null, unit: "g", scaleTo: 6,
      note: "Creatine nitrate carries less creatine per gram than monohydrate and has no separately established studied dose, so the 3–5 g monohydrate figure does not transfer to it."
    },
    {
      match: "betaine",
      label: "Betaine",
      low: 2.5, high: 2.5, unit: "g", scaleTo: 3.5,
      note: "Nearly every betaine trial uses 2.5 g a day, usually split into two doses."
    },
    {
      match: "nitrosigine|arginine silicate",
      label: "Nitrosigine",
      low: 1.5, high: 1.5, unit: "g", scaleTo: 2,
      note: "The manufacturer's own published work uses 1.5 g, and formulas that include it generally match that amount."
    },
    {
      match: "alpha[- ]?gpc",
      label: "Alpha-GPC",
      low: 300, high: 600, unit: "mg", scaleTo: 700,
      note: "Studied at 300–600 mg before exercise; the evidence base is small compared with caffeine or creatine."
    },
    {
      match: "theanine",
      label: "L-theanine",
      low: 100, high: 200, unit: "mg", scaleTo: 250,
      note: "Studied at 100–200 mg, usually paired roughly 1:1 or 2:1 with caffeine."
    },
    {
      match: "tyrosine",
      label: "L-tyrosine",
      low: 2, high: 2, unit: "g", scaleTo: 3,
      note: "Trials that report an effect generally use 2 g or more, and often far more relative to body weight than a pre-workout scoop provides."
    },
    {
      match: "glycerol|hydroprime",
      label: "Glycerol",
      low: 2, high: 2, unit: "g", scaleTo: 3,
      note: "Hyperhydration work uses around 2 g of actual glycerol; branded powders are usually 65% glycerol by weight, so check which figure the label states."
    },
    {
      match: "taurine",
      label: "Taurine",
      low: 1, high: 2, unit: "g", scaleTo: 3,
      note: "Studied at 1–2 g before exercise, with mixed results across trials."
    },
    {
      match: "leucine",
      label: "Leucine",
      low: 2.5, high: 3, unit: "g", scaleTo: 4,
      note: "Muscle-protein-synthesis research clusters on 2.5–3 g of leucine per serving as the amount that reliably triggers the response."
    },
    {
      match: "l[- ]?arginine",
      label: "L-arginine",
      low: null, high: null, unit: "g", scaleTo: 6,
      note: "Plain L-arginine is poorly absorbed as an oral pump ingredient; citrulline raises blood arginine more reliably, which is why the research moved to it."
    }
  ],

  /* ---- metrics matches (product.metrics.<key>) -------------------------- */
  metrics: {
    creatineG: {
      label: "Creatine",
      low: 3, high: 5, unit: "g", scaleTo: 6,
      note: "Maintenance dosing in the research is 3–5 g a day of monohydrate. Forms other than monohydrate have no separately established dose."
    },
    proteinG: {
      label: "Protein",
      low: 20, high: 40, unit: "g", scaleTo: 50,
      note: "Per-meal doses studied for muscle protein synthesis run about 20–40 g of high-quality protein, with the upper half of that range favoured for larger athletes and older adults."
    },
    eaaG: {
      label: "Total EAAs",
      low: 6, high: 15, unit: "g", scaleTo: 20,
      note: "EAA studies use roughly 6–15 g containing 2.5–3 g of leucine. BCAAs alone supply only three of the nine essential amino acids."
    },
    leucineG: {
      label: "Leucine",
      low: 2.5, high: 3, unit: "g", scaleTo: 4,
      note: "2.5–3 g of leucine per serving is the amount research links to a full muscle-protein-synthesis response."
    },
    sodiumMg: {
      label: "Sodium",
      low: 300, high: 700, unit: "mg", scaleTo: 1200,
      note: "Sports-nutrition guidance puts 300–700 mg of sodium per litre of fluid in the range for sustained sweating. Higher-sodium mixes are built for heavy sweat losses, not for casual sipping."
    }
  }
};

if (typeof module !== "undefined" && module.exports) { module.exports = STUDIED_DOSES; }
