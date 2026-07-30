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
      note: "Performance studies most often use 3–6 mg per kg of body weight, which works out to roughly 200–400 mg for most adults. The FDA cites 400 mg a day as an amount not generally associated with negative effects in healthy adults.",
      /* `cite` is the paper the range came out of: author/year, a stable public
       * URL a reader can open, and the sentence in that source that states the
       * amount. Every one was fetched and read before it was written down. An
       * entry with no source we could open gets no `cite` — never cite from
       * memory, and never invent a citation to fill a gap. */
      cite: {
        label: "Guest et al., Journal of the International Society of Sports Nutrition 2021",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC7777221/",
        quote: "Caffeine has consistently been shown to improve exercise performance when consumed in doses of 3–6 mg/kg body mass."
      }
    },
    {
      match: "beta[- ]?alanine",
      label: "Beta-alanine",
      low: 3.2, high: 6.4, unit: "g", scaleTo: 7,
      note: "Studied as a daily loading protocol of 3.2–6.4 g taken for four weeks or longer. A single serving below that range still counts toward the daily total, but one scoop is not a studied dose on its own.",
      cite: {
        label: "Rezende et al., Frontiers in Physiology 2020",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC7456894/",
        quote: "It seems that substantial amounts of BA are required to increase MCarn, with most studies using doses of ~3.2–6.4 g·day−1, for periods ranging from 4 to 24 weeks."
      }
    },
    {
      match: "citrulline",
      label: "Citrulline",
      low: 6, high: 8, unit: "g", scaleTo: 10,
      // 8 g of 2:1 citrulline malate is two parts citrulline to one part
      // malate — 5.3 g, not the 6 g this note used to claim. Labels at a 1:1
      // ratio carry about 4 g. Stating it loosely was the same error the site
      // exists to point out on other people's labels.
      note: "Studies use about 6 g of pure L-citrulline, or 8 g of citrulline malate — which is about 5.3 g of citrulline at the usual 2:1 ratio, and closer to 4 g if the label is 1:1.",
      cite: {
        label: "Gough et al., European Journal of Applied Physiology 2021",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC8571142/",
        quote: "The most commonly employed dose of CM is a single acute 8 g dose"
      }
    },
    {
      match: "creatine monohydrate|micronized creatine",
      label: "Creatine",
      low: 3, high: 5, unit: "g", scaleTo: 6,
      note: "Maintenance dosing in the research is 3–5 g a day of monohydrate, every day, not only on training days.",
      cite: {
        label: "Kreider et al., Journal of the International Society of Sports Nutrition 2017",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5469049/",
        quote: "Once muscle creatine stores are fully saturated, creatine stores can generally be maintained by ingesting 3–5 g/day"
      }
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
      note: "Trials run from 1.25 g to 5 g a day; 2.5 g, usually split into two doses, is the amount most of them use.",
      cite: {
        label: "Lee et al., Journal of the International Society of Sports Nutrition 2010",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC2915951/",
        quote: "Betaine supplement (B) was given as 1.25 grams (g) of betaine (Danisco Inc., Ardsley, NY) in 300 mL of Gatorade© sports drink, taken twice daily"
      }
    },
    {
      match: "nitrosigine|arginine silicate",
      label: "Nitrosigine",
      low: 1.5, high: 1.5, unit: "g", scaleTo: 2,
      note: "The manufacturer's own published work uses 1.5 g, and formulas that include it generally match that amount.",
      cite: {
        label: "Kalman et al., Nutrients 2016",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5133120/",
        quote: "The active treatment contained 1500 mg of ASI (arginine, silicon, inositol and potassium)"
      }
    },
    {
      match: "alpha[- ]?gpc",
      label: "Alpha-GPC",
      low: 300, high: 600, unit: "mg", scaleTo: 700,
      note: "Studied at 300–600 mg before exercise, with most trials at about 600 mg; the evidence base is small compared with caffeine or creatine.",
      cite: {
        label: "Marcus et al., Journal of the International Society of Sports Nutrition 2017",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5629791/",
        quote: "The majority of studies use doses of around 600 mg in an acute fashion"
      }
    },
    {
      match: "theanine",
      label: "L-theanine",
      low: 100, high: 200, unit: "mg", scaleTo: 250,
      note: "Studied at 100–200 mg on its own, and often at less than that in the trials that pair it with caffeine, which is how pre-workouts use it.",
      cite: {
        label: "Payne et al., Nutrition Reviews 2025",
        url: "https://academic.oup.com/nutritionreviews/article/83/10/1873/8123998",
        quote: "In theanine-only, low-caffeine, or caffeine-free interventions, the median theanine dose was 200 mg (IQR, 100.45-212.5)."
      }
    },
    {
      match: "tyrosine",
      label: "L-tyrosine",
      low: 2, high: 2, unit: "g", scaleTo: 3,
      note: "Trials that report an effect generally use 2 g or more, and often far more relative to body weight than a pre-workout scoop provides.",
      cite: {
        label: "Colzato et al., Frontiers in Behavioral Neuroscience 2013",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC3863934/",
        quote: "In separate sessions participants were exposed to either an oral dose (powder) of 2.0 g of l-Tyrosine (TYR)"
      }
    },
    {
      match: "glycerol|hydroprime",
      label: "Glycerol",
      // No flat gram range, because the research does not use one: the
      // hyperhydration protocol is dosed per kilogram of body weight, and it
      // lands two orders of magnitude above what any pre-workout label
      // carries. The old entry read "hyperhydration work uses around 2 g",
      // which described the label, not the research — the one mistake this
      // file must never make. Rather than draw a bar against a number nobody
      // studied, say what the protocol actually is.
      low: null, high: null, unit: "g", scaleTo: 3,
      note: "Hyperhydration research doses glycerol by body weight — about 1.0–1.2 g per kg, roughly 70–84 g for a 70 kg athlete, taken with a litre or more of fluid before exercise. Pre-workout labels carry a few grams — the highest on file here is 4 g — which is far below any studied hyperhydration amount, and branded powders are usually 65% glycerol by weight, so check which figure the label states.",
      cite: {
        label: "van Rosendal et al., Sports Medicine 2010",
        url: "https://pubmed.ncbi.nlm.nih.gov/20092365/",
        quote: "endurance athletes intending to hyperhydrate with glycerol should ingest glycerol 1.2 g/kg BW in 26 mL/kg BW of fluid over a period of 60 minutes"
      }
    },
    {
      match: "taurine",
      label: "Taurine",
      // Widened to what the cited meta-analysis actually reports; the old
      // 1–2 g ceiling understated the trials by a factor of three.
      low: 1, high: 6, unit: "g", scaleTo: 7,
      note: "Trials run from 1 g to 6 g a day, given as single doses or for up to two weeks, with mixed results across studies.",
      cite: {
        label: "Waldron et al., Sports Medicine 2018",
        url: "https://pubmed.ncbi.nlm.nih.gov/29546641/",
        quote: "The doses of taurine ranged from 1 to 6 g/day and were provided in single doses and for up to 2 weeks among a range of subjects."
      }
    },
    {
      match: "leucine",
      label: "Leucine",
      // Same correction as metrics.leucineG below — see the note there.
      low: 0.7, high: 3, unit: "g", scaleTo: 4,
      note: "The ISSN position stand puts an acute protein dose at 700–3000 mg of leucine, and about 1–3 g per meal as the amount needed to stimulate protein translation.",
      cite: {
        label: "Jäger et al., Journal of the International Society of Sports Nutrition 2017",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5477153/",
        quote: "Acute protein doses should strive to contain 700–3000 mg of leucine and/or a higher relative leucine content"
      }
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
      note: "Maintenance dosing in the research is 3–5 g a day of monohydrate. Forms other than monohydrate have no separately established dose.",
      cite: {
        label: "Kreider et al., Journal of the International Society of Sports Nutrition 2017",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5469049/",
        quote: "Once muscle creatine stores are fully saturated, creatine stores can generally be maintained by ingesting 3–5 g/day"
      }
    },
    proteinG: {
      label: "Protein",
      low: 20, high: 40, unit: "g", scaleTo: 50,
      note: "Per-meal doses studied for muscle protein synthesis run about 20–40 g of high-quality protein, with the upper half of that range favoured for larger athletes and older adults.",
      cite: {
        label: "Jäger et al., Journal of the International Society of Sports Nutrition 2017",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5477153/",
        quote: "General recommendations are 0.25 g of a high-quality protein per kg of body weight, or an absolute dose of 20–40 g."
      }
    },
    eaaG: {
      label: "Total EAAs",
      // The 6 g floor was not in any source. The cited position stand reports
      // synthesis stimulated from 1.5 g and a ceiling where more stops helping,
      // so the bar now spans what the research spans — and a 4 g label stops
      // being marked short of an amount nobody published.
      low: 1.5, high: 15, unit: "g", scaleTo: 20,
      note: "Stimulation of muscle protein synthesis has been reported from as little as 1.5 g of EAAs, with the maximal useful single dose put at 15–18 g — more in one sitting adds nothing. BCAAs alone supply only three of the nine essential amino acids.",
      cite: {
        label: "Ferrando et al., Journal of the International Society of Sports Nutrition 2023",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC10561576/",
        quote: "Reasonable dosage of an EAA supplement does not exceed 15 g, meaning that even as much as three maximal doses per day is in line with normal daily consumption of EAAs…"
      }
    },
    leucineG: {
      label: "Leucine",
      // The 2.5 g "leucine threshold" is not in the cited position stand, which
      // gives 700–3000 mg per acute dose. A bar arguing with the source quoted
      // directly beneath it is the one thing this file cannot do.
      low: 0.7, high: 3, unit: "g", scaleTo: 4,
      note: "The ISSN position stand puts an acute protein dose at 700–3000 mg of leucine, and about 1–3 g per meal as the amount needed to stimulate protein translation. Higher-leucine servings sit at the top of that span rather than beyond it.",
      cite: {
        label: "Jäger et al., Journal of the International Society of Sports Nutrition 2017",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5477153/",
        quote: "Acute protein doses should strive to contain 700–3000 mg of leucine and/or a higher relative leucine content"
      }
    },
    sodiumMg: {
      label: "Sodium",
      low: 300, high: 700, unit: "mg", scaleTo: 1200,
      // Guidance bodies do not agree on one band, and the bar would imply they
      // do: the DGE puts the optimum at 400–1100 mg per litre, while position
      // statements written in mmol work out to roughly 230–805. The range kept
      // here sits inside both; the note says so rather than presenting one
      // body's number as settled. Per litre of fluid, not per hour of
      // sweating — two different figures that get quoted interchangeably.
      note: "Sports-nutrition guidance puts sodium somewhere between about 230 and 1100 mg per litre of fluid for sustained sweating, depending on which body is writing — 300–700 mg per litre sits inside every version of it. Higher-sodium mixes are built for heavy sweat losses, not for casual sipping.",
      cite: {
        label: "Mosler et al., German Journal of Sports Medicine 2020 (DGE position)",
        url: "https://www.germanjournalsportsmedicine.com/fileadmin/content/archiv2020/Heft_7-8-9/DtschZSportmed_Position_Stand_Mosler_Fluid_Replacement_in_Sports_2020-7-8-9.pdf",
        quote: "the optimal sports drink should contain 400-1100 mg / l sodium in addition to carbohydrates (4-8%)"
      }
    }
  }
};

if (typeof module !== "undefined" && module.exports) { module.exports = STUDIED_DOSES; }
