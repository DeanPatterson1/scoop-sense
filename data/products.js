// Scoop Sense product data.
// SCHEMA — every product object must have EXACTLY these fields:
//   id             string  unique, lowercase kebab-case slug
//   name           string  product name as printed on the tub
//   brand          string  brand name
//   stimFree       boolean true only when caffeineMg is 0
//   badges         array of strings — exactly ONE stim badge, plus 0–2 extras.
//                  Stim badge is derived from caffeineMg:
//                    0        -> "Stim-Free"
//                    1–149    -> "Low Stim"
//                    150–249  -> "Moderate Stim"
//                    250+     -> "High Stim"
//                  Allowed extras: "Fully Disclosed Label", "Proprietary Blend",
//                  "Budget Pick", "Beginner Friendly"
//   caffeineMg     number  mg caffeine per full serving (0 if stim-free)
//   keyIngredients array of 2–4 objects: { name: string, dose: string (with unit,
//                  e.g. "8 g" or "350 mg"), clinicalNote: string (plain-English,
//                  structure/function language only — never disease claims) }
//   cautions       array of 1–3 short factual strings (rendered as amber chips)
//   servings       number  servings per container at the full labeled serving
//   priceRange     string  "$" | "$$" | "$$$"  (rough cost per serving tier;
//                  we never display dollar prices — they go stale)
//   flavorsNote    string  one sentence about flavors/sweetener
//   affiliateUrl   string  Amazon search URL, format:
//                  https://www.amazon.com/s?k=<words+joined+by+plus>&tag=YOURTAG-20
//   blurb          string  1–2 sentence honest summary, friendly tone
//   accentColor    string  OPTIONAL — hex color used for the CSS-generated tub
//                  visual on cards. Stylized brand-family color, NOT official
//                  brand artwork. Omit to fall back to the site green.
//
// Figures come from manufacturer labels as of mid-2026. Formulas change —
// ALWAYS verify against the current label before trusting or updating a number.

const FEATURED_IDS = ["legion-pulse", "c4-original", "legion-pulse-stim-free"];

const PRODUCTS = [
  {
    id: "legion-pulse",
    name: "Pulse",
    brand: "Legion",
    accentColor: "#4E9FD4",
    stimFree: false,
    badges: ["High Stim", "Fully Disclosed Label"],
    caffeineMg: 350,
    keyIngredients: [
      { name: "Citrulline Malate", dose: "8 g", clinicalNote: "Within the 6–8 g range used in most citrulline studies." },
      { name: "Beta-Alanine", dose: "3.6 g", clinicalNote: "In the 3.2–6.4 g/day range used in beta-alanine research — expect tingles." },
      { name: "L-Theanine", dose: "350 mg", clinicalNote: "Paired 1:1 with caffeine, a combination studied for smoother focus." }
    ],
    cautions: [
      "High caffeine: 350 mg is roughly four small cups of coffee",
      "Beta-alanine tingles (harmless skin prickling) are likely at this dose",
      "Doses assume the full two-scoop serving"
    ],
    servings: 21,
    priceRange: "$$$",
    flavorsNote: "Wide flavor range; naturally sweetened with stevia, so expect a less candy-like taste.",
    affiliateUrl: "https://www.amazon.com/s?k=legion+pulse+pre+workout&tag=YOURTAG-20",
    blurb: "A fully disclosed, high-stim formula that publishes every dose on the label. Strong choice if you tolerate caffeine well and want no mystery blends."
  },
  {
    id: "transparent-labs-bulk",
    name: "BULK",
    brand: "Transparent Labs",
    accentColor: "#35C9B4",
    stimFree: false,
    badges: ["Moderate Stim", "Fully Disclosed Label"],
    caffeineMg: 200,
    keyIngredients: [
      { name: "Citrulline Malate", dose: "8 g", clinicalNote: "Within the 6–8 g range used in most citrulline studies." },
      { name: "Beta-Alanine", dose: "4 g", clinicalNote: "At the higher end of studied daily amounts — tingles very likely." },
      { name: "Betaine Anhydrous", dose: "2.5 g", clinicalNote: "Matches the 2.5 g amount used in most betaine studies." }
    ],
    cautions: [
      "Beta-alanine tingles likely at 4 g",
      "200 mg caffeine is still about two cups of coffee — time it away from bedtime"
    ],
    servings: 30,
    priceRange: "$$$",
    flavorsNote: "Fruit-forward flavors; stevia-sweetened with no artificial dyes.",
    affiliateUrl: "https://www.amazon.com/s?k=transparent+labs+bulk+pre+workout&tag=YOURTAG-20",
    blurb: "Middle-of-the-road caffeine with a fully open label. A sensible pick if 300 mg formulas feel like too much."
  },
  {
    id: "gorilla-mode",
    name: "Gorilla Mode",
    brand: "Gorilla Mind",
    accentColor: "#9B7FDB",
    stimFree: false,
    badges: ["High Stim", "Fully Disclosed Label"],
    caffeineMg: 350,
    keyIngredients: [
      { name: "L-Citrulline", dose: "9 g", clinicalNote: "Above the 6–8 g range used in most citrulline studies." },
      { name: "Creatine Monohydrate", dose: "5 g", clinicalNote: "The standard 3–5 g daily amount used in creatine research." },
      { name: "Glycerol (GlycerPump)", dose: "3 g", clinicalNote: "Studied for cell hydration; makes the powder clump if the tub sits open." }
    ],
    cautions: [
      "High caffeine at the full two-scoop serving (350 mg)",
      "All doses assume two scoops — one scoop is half of everything",
      "Prone to clumping in humidity because of glycerol"
    ],
    servings: 20,
    priceRange: "$$",
    flavorsNote: "Big flavor menu; artificially sweetened.",
    affiliateUrl: "https://www.amazon.com/s?k=gorilla+mode+pre+workout&tag=YOURTAG-20",
    blurb: "One of the heaviest fully disclosed formulas around. The two-scoop fine print matters: a single scoop is a very different product."
  },
  {
    id: "c4-original",
    name: "C4 Original",
    brand: "Cellucor",
    accentColor: "#F27E4A",
    stimFree: false,
    badges: ["Moderate Stim", "Proprietary Blend", "Budget Pick"],
    caffeineMg: 150,
    keyIngredients: [
      { name: "Beta-Alanine", dose: "1.6 g", clinicalNote: "Half the 3.2 g/day amount most beta-alanine studies use." },
      { name: "Creatine Nitrate", dose: "1 g", clinicalNote: "Well below the 3–5 g standard used in creatine research." },
      { name: "Explosive Energy Blend", dose: "371 mg", clinicalNote: "Proprietary blend — the individual amounts inside are not disclosed." }
    ],
    cautions: [
      "Proprietary blend hides individual ingredient doses",
      "Key ingredients sit under studied doses — gentler, but less backed"
    ],
    servings: 30,
    priceRange: "$",
    flavorsNote: "Classic candy-style flavors; artificially sweetened; sold almost everywhere.",
    affiliateUrl: "https://www.amazon.com/s?k=c4+original+pre+workout&tag=YOURTAG-20",
    blurb: "The gateway pre-workout: cheap, mild, and everywhere. Fine as a starter — just know the label keeps some doses to itself."
  },
  {
    id: "total-war",
    name: "Total War",
    brand: "RedCon1",
    accentColor: "#E05252",
    stimFree: false,
    badges: ["High Stim"],
    caffeineMg: 320,
    keyIngredients: [
      { name: "Citrulline Malate", dose: "6 g", clinicalNote: "At the low end of the 6–8 g studied range." },
      { name: "Beta-Alanine", dose: "3.2 g", clinicalNote: "The standard studied dose — tingles expected." },
      { name: "Caffeine (two forms)", dose: "320 mg", clinicalNote: "Combines fast caffeine anhydrous with a slower extended-release form." }
    ],
    cautions: [
      "Very high stimulant load with multiple caffeine forms",
      "Not a good first pre-workout if you're new or caffeine-sensitive"
    ],
    servings: 30,
    priceRange: "$$",
    flavorsNote: "Sweet, strong flavors; artificially sweetened.",
    affiliateUrl: "https://www.amazon.com/s?k=redcon1+total+war+pre+workout&tag=YOURTAG-20",
    blurb: "A stimulant-forward formula built for people who already know their caffeine tolerance. Respect the label on this one."
  },
  {
    id: "on-gold-standard-pre",
    name: "Gold Standard Pre-Workout",
    brand: "Optimum Nutrition",
    accentColor: "#D9A82F",
    stimFree: false,
    badges: ["Moderate Stim", "Beginner Friendly"],
    caffeineMg: 175,
    keyIngredients: [
      { name: "Citrulline Malate", dose: "1.5 g", clinicalNote: "Well below the 6–8 g range used in most citrulline studies." },
      { name: "Beta-Alanine", dose: "1.5 g", clinicalNote: "Under the 3.2 g/day amount used in beta-alanine research." },
      { name: "Creatine Monohydrate", dose: "3 g", clinicalNote: "At the low end of the standard 3–5 g range." }
    ],
    cautions: [
      "Pump ingredients are well under studied doses",
      "Moderate caffeine still adds up if you also drink coffee"
    ],
    servings: 30,
    priceRange: "$$",
    flavorsNote: "Mild, familiar flavors from a long-established brand.",
    affiliateUrl: "https://www.amazon.com/s?k=optimum+nutrition+gold+standard+pre+workout&tag=YOURTAG-20",
    blurb: "A gentle, predictable formula from a household-name brand. Underdosed by research standards, which is exactly why beginners find it easy to live with."
  },
  {
    id: "ghost-legend",
    name: "Legend",
    brand: "Ghost",
    accentColor: "#8FA3BF",
    stimFree: false,
    badges: ["High Stim", "Fully Disclosed Label"],
    caffeineMg: 250,
    keyIngredients: [
      { name: "L-Citrulline", dose: "4 g", clinicalNote: "Below the 6–8 g range used in most citrulline studies." },
      { name: "Beta-Alanine", dose: "3.2 g", clinicalNote: "The standard studied dose — tingles expected." }
    ],
    cautions: [
      "250 mg caffeine — skip your afternoon coffee",
      "Beta-alanine tingles expected"
    ],
    servings: 25,
    priceRange: "$$",
    flavorsNote: "Known for rotating licensed candy-collab flavors.",
    affiliateUrl: "https://www.amazon.com/s?k=ghost+legend+pre+workout&tag=YOURTAG-20",
    blurb: "Open label, fun flavors, solid caffeine hit. Pump doses run lighter than the heavyweights, which some people prefer."
  },
  {
    id: "alani-nu-pre-workout",
    name: "Pre-Workout",
    brand: "Alani Nu",
    accentColor: "#E88098",
    stimFree: false,
    badges: ["Moderate Stim", "Fully Disclosed Label", "Beginner Friendly"],
    caffeineMg: 200,
    keyIngredients: [
      { name: "L-Citrulline", dose: "6 g", clinicalNote: "At the low end of the 6–8 g range used in most citrulline studies." },
      { name: "Beta-Alanine", dose: "1.6 g", clinicalNote: "Half the 3.2 g/day amount most beta-alanine studies use." },
      { name: "L-Tyrosine", dose: "500 mg", clinicalNote: "Under the amounts used in most tyrosine research on focus during stress." }
    ],
    cautions: [
      "200 mg caffeine — count the coffee you've already had that day",
      "Beta-alanine sits at half the studied amount, so effects are modest",
      "Mild tingles still happen for some people at 1.6 g"
    ],
    servings: 30,
    priceRange: "$$",
    flavorsNote: "Dessert- and candy-style flavors that rotate often; artificially sweetened.",
    affiliateUrl: "https://www.amazon.com/s?k=alani+nu+pre+workout&tag=YOURTAG-20",
    blurb: "An open-label formula with a comfortable caffeine level and a lot of flavor variety. Doses run light, which suits people easing into pre-workout."
  },
  {
    id: "ryse-godzilla",
    name: "Godzilla",
    brand: "RYSE Supplements",
    accentColor: "#7B8AD9",
    stimFree: false,
    badges: ["High Stim", "Fully Disclosed Label"],
    caffeineMg: 388,
    keyIngredients: [
      { name: "L-Citrulline", dose: "9 g", clinicalNote: "Above the 6–8 g range used in most citrulline studies." },
      { name: "Beta-Alanine", dose: "3.2 g", clinicalNote: "The standard studied dose — tingles expected." },
      { name: "Caffeine (two forms)", dose: "388 mg", clinicalNote: "Caffeine anhydrous plus di-caffeine malate, which releases more slowly." }
    ],
    cautions: [
      "Close to 400 mg caffeine in one serving — the FDA's daily reference amount for healthy adults",
      "Not a sensible starting point for anyone still learning their caffeine tolerance",
      "Beta-alanine tingles expected"
    ],
    servings: 30,
    priceRange: "$$$",
    flavorsNote: "Licensed candy and cereal collaboration flavors; artificially sweetened.",
    affiliateUrl: "https://www.amazon.com/s?k=ryse+godzilla+pre+workout&tag=YOURTAG-20",
    blurb: "One of the most stimulant-heavy mainstream formulas, with an open label to match. The caffeine figure alone puts it out of range for a lot of people."
  },
  {
    id: "bucked-up",
    name: "Bucked Up",
    brand: "Bucked Up",
    accentColor: "#7FB53E",
    stimFree: false,
    badges: ["Moderate Stim", "Fully Disclosed Label"],
    caffeineMg: 200,
    keyIngredients: [
      { name: "Citrulline Malate", dose: "6 g", clinicalNote: "At the low end of the 6–8 g studied range." },
      { name: "Beta-Alanine", dose: "2 g", clinicalNote: "Under the 3.2 g/day amount used in beta-alanine research." },
      { name: "Alpha-GPC", dose: "200 mg", clinicalNote: "A choline compound studied for focus during exercise." },
      { name: "Deer Antler Velvet Extract", dose: "50 mg", clinicalNote: "A signature ingredient with very little human research behind it." }
    ],
    cautions: [
      "Deer antler velvet extract is a brand signature, not a well-studied dose",
      "Beta-alanine is under the studied amount, though tingles still happen"
    ],
    servings: 30,
    priceRange: "$$",
    flavorsNote: "Long, frequently rotating flavor lineup; artificially sweetened.",
    affiliateUrl: "https://www.amazon.com/s?k=bucked+up+pre+workout&tag=YOURTAG-20",
    blurb: "An open label with moderate caffeine and a couple of ingredients that are more brand identity than research. Easy to drink, middle of the road on numbers."
  },
  {
    id: "beyond-raw-lit",
    name: "LIT",
    brand: "Beyond Raw",
    accentColor: "#4FA8CE",
    stimFree: false,
    badges: ["High Stim"],
    caffeineMg: 250,
    keyIngredients: [
      { name: "Beta-Alanine (CarnoSyn)", dose: "3.2 g", clinicalNote: "The standard studied dose — tingles expected." },
      { name: "Nitrosigine", dose: "1.5 g", clinicalNote: "The 1.5 g amount used in this ingredient's own published research." },
      { name: "Caffeine (two forms)", dose: "250 mg", clinicalNote: "Caffeine anhydrous plus a caffeine-pterostilbene form marketed for a longer curve." }
    ],
    cautions: [
      "250 mg caffeine — plan the rest of your day's caffeine around it",
      "Beta-alanine tingles expected at 3.2 g",
      "Sold as powder and as ready-to-drink cans with different panels — check the one you buy"
    ],
    servings: 30,
    priceRange: "$$",
    flavorsNote: "Bright candy flavors; artificially sweetened; easy to find in retail stores.",
    affiliateUrl: "https://www.amazon.com/s?k=beyond+raw+lit+pre+workout&tag=YOURTAG-20",
    blurb: "A retail-shelf mainstay with a full beta-alanine dose and a firm caffeine hit. Pump support leans on Nitrosigine rather than a large citrulline load."
  },
  {
    id: "kaged-pre-kaged",
    name: "Pre-Kaged",
    brand: "Kaged",
    accentColor: "#3DBD8F",
    stimFree: false,
    badges: ["High Stim", "Fully Disclosed Label"],
    caffeineMg: 274,
    keyIngredients: [
      { name: "L-Citrulline", dose: "6.5 g", clinicalNote: "Within the 6–8 g range used in most citrulline studies." },
      { name: "Beta-Alanine", dose: "1.6 g", clinicalNote: "Half the 3.2 g/day amount most beta-alanine studies use." },
      { name: "Creatine HCl", dose: "1.5 g", clinicalNote: "Below the 3–5 g standard used in creatine research." },
      { name: "Caffeine from Organic Coffee Bean", dose: "274 mg", clinicalNote: "Plant-sourced caffeine; the body handles it the same as caffeine anhydrous." }
    ],
    cautions: [
      "274 mg caffeine puts this firmly in the strong tier",
      "Creatine is dosed under the studied amount, so it doesn't replace a daily creatine serving",
      "20 servings per tub means it runs out faster than most"
    ],
    servings: 20,
    priceRange: "$$$",
    flavorsNote: "Naturally flavored and stevia-sweetened, with no artificial colors.",
    affiliateUrl: "https://www.amazon.com/s?k=pre+kaged+pre+workout&tag=YOURTAG-20",
    blurb: "A fully disclosed formula built around plant-sourced caffeine and clean labeling. The 20-serving tub makes the cost per scoop higher than most."
  },
  {
    id: "pre-jym",
    name: "Pre JYM",
    brand: "JYM Supplement Science",
    accentColor: "#C08A57",
    stimFree: false,
    badges: ["High Stim", "Fully Disclosed Label"],
    caffeineMg: 300,
    keyIngredients: [
      { name: "Citrulline Malate", dose: "6 g", clinicalNote: "At the low end of the 6–8 g studied range." },
      { name: "Beta-Alanine", dose: "2 g", clinicalNote: "Under the 3.2 g/day amount used in beta-alanine research." },
      { name: "Creatine HCl", dose: "2 g", clinicalNote: "Below the 3–5 g standard used in creatine research." },
      { name: "Betaine", dose: "1.5 g", clinicalNote: "Under the 2.5 g amount used in most betaine studies." }
    ],
    cautions: [
      "300 mg caffeine is a full day's coffee for many people",
      "Beta-alanine tingles are common even at 2 g",
      "Large scoop that needs plenty of water to mix cleanly"
    ],
    servings: 20,
    priceRange: "$$$",
    flavorsNote: "Straightforward fruit flavors; artificially sweetened.",
    affiliateUrl: "https://www.amazon.com/s?k=pre+jym+pre+workout&tag=YOURTAG-20",
    blurb: "A long-running open-label formula that spreads a lot of ingredients across one scoop. Individual doses sit in the moderate range rather than the extremes."
  },
  {
    id: "legion-pulse-stim-free",
    name: "Pulse Stim-Free",
    brand: "Legion",
    accentColor: "#4E9FD4",
    stimFree: true,
    badges: ["Stim-Free", "Fully Disclosed Label"],
    caffeineMg: 0,
    keyIngredients: [
      { name: "Citrulline Malate", dose: "8 g", clinicalNote: "Within the 6–8 g range used in most citrulline studies." },
      { name: "Beta-Alanine", dose: "3.6 g", clinicalNote: "In the studied range — tingles happen even without caffeine." },
      { name: "Alpha-GPC", dose: "300 mg", clinicalNote: "A choline compound studied for focus during exercise." }
    ],
    cautions: [
      "Beta-alanine tingles still apply — they're not from caffeine",
      "Stim-free doesn't mean effect-free; read each ingredient"
    ],
    servings: 21,
    priceRange: "$$$",
    flavorsNote: "Same stevia-sweetened flavor family as regular Pulse.",
    affiliateUrl: "https://www.amazon.com/s?k=legion+pulse+stim+free+pre+workout&tag=YOURTAG-20",
    blurb: "Full pump-and-focus doses with zero caffeine. Built for evening training or anyone who's done with jitters."
  },
  {
    id: "transparent-labs-stim-free",
    name: "Stim-Free",
    brand: "Transparent Labs",
    accentColor: "#35C9B4",
    stimFree: true,
    badges: ["Stim-Free", "Fully Disclosed Label"],
    caffeineMg: 0,
    keyIngredients: [
      { name: "Citrulline Malate", dose: "8 g", clinicalNote: "Within the 6–8 g range used in most citrulline studies." },
      { name: "Beta-Alanine", dose: "4 g", clinicalNote: "At the higher end of studied daily amounts — tingles very likely." },
      { name: "Betaine Anhydrous", dose: "2.5 g", clinicalNote: "Matches the 2.5 g amount used in most betaine studies." }
    ],
    cautions: [
      "Beta-alanine tingles likely at 4 g"
    ],
    servings: 30,
    priceRange: "$$$",
    flavorsNote: "Stevia-sweetened, no artificial dyes.",
    affiliateUrl: "https://www.amazon.com/s?k=transparent+labs+stim+free+pre+workout&tag=YOURTAG-20",
    blurb: "BULK's caffeine-free sibling: same open label, same pump doses, nothing to keep you up at night."
  },
  {
    id: "gorilla-mode-nitric",
    name: "Gorilla Mode Nitric",
    brand: "Gorilla Mind",
    accentColor: "#9B7FDB",
    stimFree: true,
    badges: ["Stim-Free", "Fully Disclosed Label"],
    caffeineMg: 0,
    keyIngredients: [
      { name: "L-Citrulline", dose: "9 g", clinicalNote: "Above the 6–8 g range used in most citrulline studies." },
      { name: "Glycerol (GlycerPump)", dose: "3 g", clinicalNote: "Studied for cell hydration; it's also what makes the powder clump." },
      { name: "Agmatine Sulfate", dose: "1.5 g", clinicalNote: "Common in pump formulas, with limited human research behind it." }
    ],
    cautions: [
      "All doses assume the full two-scoop serving",
      "Glycerol draws in moisture — the powder clumps if the tub sits open",
      "Caffeine-free, but the ingredient list is still active — read it"
    ],
    servings: 20,
    priceRange: "$$",
    flavorsNote: "Shares the flavor lineup of the stimulant version; artificially sweetened.",
    affiliateUrl: "https://www.amazon.com/s?k=gorilla+mode+nitric+pre+workout&tag=YOURTAG-20",
    blurb: "The caffeine-free counterpart to Gorilla Mode, keeping the heavy citrulline and glycerol doses. Suits late sessions or people who bring their own coffee."
  }
];
