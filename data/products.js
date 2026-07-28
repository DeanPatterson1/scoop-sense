// Scoop Sense product data.
// SCHEMA — every product object must have EXACTLY these fields:
//   id             string  unique, lowercase kebab-case slug
//   name           string  product name as printed on the tub
//   brand          string  brand name
//   category       string  lowercase category slug ("pre-workout", "creatine", ...);
//                  drives the hub category filter and page copy
//   stimFree       boolean true only when caffeineMg is 0
//   badges         array of strings. Stim badge rule BY CATEGORY:
//                    pre-workout      -> exactly ONE stim badge, always
//                    other categories -> ONE stim badge only when caffeineMg > 0
//                  Stim badge is derived from caffeineMg:
//                    0        -> "Stim-Free"
//                    1–149    -> "Low Stim"
//                    150–249  -> "Moderate Stim"
//                    250+     -> "High Stim"
//                  Plus 0–2 extras: "Fully Disclosed Label", "Proprietary Blend",
//                  "Budget Pick", "Beginner Friendly", "Third-Party Tested"
//                  ("Third-Party Tested" ONLY for a label-verified NSF Certified
//                  for Sport / Informed Sport / Informed Choice mark)
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
//   blurb          string  one concise editorial takeaway — specific, factual,
//                  no marketing language
//   labelVerified  string  month + year the label figures were last checked,
//                  e.g. "July 2026"
//   accentColor    string  OPTIONAL — hex color used as a subtle accent on the
//                  product tile and detail view. Stylized brand-family color,
//                  NOT official brand artwork. Omit for a neutral fallback.
//   imageUrl       string  OPTIONAL — official product image URL published by
//                  the seller (brand-site or listing CDN). Kept equal to
//                  images[0]. Hub tile and detail views render it instead of
//                  the monogram placeholder. Never invent packaging.
//   images         array of strings OPTIONAL — official seller product image
//                  URLs, hotlinked from the seller's own CDN, front-of-tub
//                  shot first. Every URL was checked (HTTP 200 + image
//                  content-type) when the entry was last verified.
//   sources        array of { url, label } OPTIONAL — the label sources
//                  actually used to research/verify the entry.
//   metrics        object — REQUIRED for every category except pre-workout;
//                  the category-specific figures that drive tiles, compare
//                  columns, and product-page facts rows (see js/categories.js):
//                    creatine     { creatineG, form: "monohydrate"|"HCl"|"blend" }
//                    protein      { proteinG, servingG, source, sweetener }
//                    eaa          { eaaG, bcaaG, leucineG }  (null = undisclosed)
//                    electrolytes { sodiumMg, potassiumMg, magnesiumMg, sugarG }
//
// Figures come from manufacturer labels as of mid-2026. Formulas change —
// ALWAYS verify against the current label before trusting or updating a number.

// Homepage "places to start" picks: an ultra-high-stim pick, a fully
// disclosed formula at studied doses, and a stim-free option.
const FEATURED_IDS = ["ryse-godzilla", "transparent-labs-bulk", "legion-pulse-stim-free"];

const PRODUCTS = [
  {
    id: "legion-pulse",
    name: "Pulse",
    brand: "Legion",
    category: "pre-workout",
    accentColor: "#4E9FD4",
    stimFree: false,
    badges: [
      "High Stim",
      "Fully Disclosed Label"
    ],
    caffeineMg: 350,
    keyIngredients: [
      {
        name: "Citrulline Malate",
        dose: "8 g",
        clinicalNote: "At the top of the 6–8 g range used in most citrulline malate studies (about 5.3 g actual citrulline)."
      },
      {
        name: "Beta-Alanine",
        dose: "3.6 g",
        clinicalNote: "In the 3.2–6.4 g/day range used in beta-alanine research — expect tingles."
      },
      {
        name: "Betaine Anhydrous",
        dose: "2.5 g",
        clinicalNote: "Matches the 2.5 g amount used in most betaine studies."
      },
      {
        name: "L-Theanine",
        dose: "350 mg",
        clinicalNote: "Paired 1:1 with caffeine, a combination studied for smoother focus."
      }
    ],
    cautions: [
      "350 mg caffeine is the FULL two-scoop dose — the label's own default for normal training is one scoop (175 mg)",
      "Beta-alanine tingles (harmless skin prickling) are likely at 3.6 g",
      "First-time users: the label says start with a single scoop"
    ],
    servings: 20,
    priceRange: "$$$",
    flavorsNote: "Huge naturally-sweetened flavor range (stevia and erythritol), so expect a less candy-like taste.",
    affiliateUrl: "https://www.amazon.com/s?k=legion+pulse+pre+workout&tag=YOURTAG-20",
    blurb: "A fully disclosed formula that publishes every dose — and a label with two speeds. The famous 350 mg caffeine figure is the two-scoop maximum; Legion's own default serving is one scoop.",
    labelVerified: "July 2026",
    imageUrl: "images/products/legion-pulse.png",
    images: [
      "https://legionathletics.com/wp-content/uploads/2025/09/Pulse-20S-STRW-BLAST-B-USA-1000x1000-Roman-Berezecky.png",
      "https://legionathletics.com/wp-content/uploads/2026/06/Pulse-Labdoor-2027-Combined-v2-Morgan-Walsh-scaled.png",
      "https://legionathletics.com/wp-content/uploads/2023/08/Image-1-Carousel-Pulse-20S-Fruit-Punch-Transp.png",
      "https://legionathletics.com/wp-content/uploads/2024/09/Pulse-20S-Cotton-Candy-Roman-Berezecky-2.png"
    ],
    sources: [
      {
        url: "https://legionathletics.com/products/supplements/pulse-pre-workout/",
        label: "Legion — official product page"
      },
      {
        url: "https://www.samedaysupplements.com/legion-pulse-pre-workout.html",
        label: "SameDaySupplements — independent panel transcription"
      },
      {
        url: "https://www.garagegymreviews.com/legion-pulse",
        label: "Garage Gym Reviews — dose cross-check"
      }
    ]
  },
  {
    id: "transparent-labs-bulk",
    name: "BULK",
    brand: "Transparent Labs",
    category: "pre-workout",
    accentColor: "#35C9B4",
    stimFree: false,
    badges: [
      "Moderate Stim",
      "Fully Disclosed Label"
    ],
    caffeineMg: 200,
    keyIngredients: [
      {
        name: "Citrulline Malate",
        dose: "8 g",
        clinicalNote: "Within the 6–8 g range used in most citrulline studies."
      },
      {
        name: "Beta-Alanine",
        dose: "4 g",
        clinicalNote: "At the higher end of studied daily amounts — tingles very likely."
      },
      {
        name: "Betaine Anhydrous",
        dose: "2.5 g",
        clinicalNote: "Matches the 2.5 g amount used in most betaine studies."
      }
    ],
    cautions: [
      "Beta-alanine tingles likely at 4 g",
      "200 mg caffeine is still about two cups of coffee — time it away from bedtime"
    ],
    servings: 30,
    priceRange: "$$$",
    flavorsNote: "Fruit-forward flavors; stevia-sweetened with no artificial dyes.",
    affiliateUrl: "https://www.amazon.com/s?k=transparent+labs+bulk+pre+workout&tag=YOURTAG-20",
    blurb: "Citrulline, beta-alanine, and betaine all at studied doses with a fully disclosed label; caffeine stays moderate at 200 mg.",
    labelVerified: "July 2026",
    imageUrl: "images/products/transparent-labs-bulk.png",
    images: [
      "https://cdn.shopify.com/s/files/1/0866/7664/files/TL_Bulk_30S_BR_1_1_1defd9cb-a9d2-4603-9509-7b02cd578d47.png?v=1745871768",
      "https://cdn.shopify.com/s/files/1/0866/7664/files/TL_Bulk_30S_SG_1_1_dad90210-bdfd-43fc-abba-40c5ed4dd32b.png?v=1761837660",
      "https://cdn.shopify.com/s/files/1/0866/7664/files/TL_Bulk_30S_SK_1_1_254fe6f6-75fc-46a3-b4e2-826a2689c68b.png?v=1761837660",
      "https://cdn.shopify.com/s/files/1/0866/7664/files/TL_Bulk_30S_W_1_1_b11f96eb-9f1f-4b24-90e3-bd7cb8f23756.png?v=1761837660",
      "https://cdn.shopify.com/s/files/1/0866/7664/files/Bulk_-_Peach_Mango_FRONT_1.png?v=1780674421"
    ]
  },
  {
    id: "gorilla-mode",
    name: "Gorilla Mode",
    brand: "Gorilla Mind",
    category: "pre-workout",
    accentColor: "#9B7FDB",
    stimFree: false,
    badges: [
      "High Stim",
      "Fully Disclosed Label"
    ],
    caffeineMg: 400,
    keyIngredients: [
      {
        name: "L-Citrulline",
        dose: "10 g",
        clinicalNote: "Above the 6–8 g range used in most citrulline studies — and it's pure citrulline, not malate."
      },
      {
        name: "Creatine Monohydrate",
        dose: "5 g",
        clinicalNote: "The standard 3–5 g daily amount used in creatine research."
      },
      {
        name: "Betaine Anhydrous",
        dose: "4 g",
        clinicalNote: "Above the 2.5 g/day used in nearly all betaine strength studies."
      },
      {
        name: "HydroPrime Glycerol (65%)",
        dose: "4 g",
        clinicalNote: "Yields about 2.6 g glycerol, typical pre-workout hyperhydration dosing; also why the powder clumps."
      }
    ],
    cautions: [
      "400 mg caffeine at the full two-scoop dose — that equals the FDA's ~400 mg daily reference for healthy adults, before any coffee",
      "Every number here assumes two scoops; the printed label serving is one scoop, which is exactly half of everything",
      "Glycerol draws in moisture — the powder clumps if the tub sits open"
    ],
    servings: 20,
    priceRange: "$$",
    flavorsNote: "Fourteen-flavor lineup; artificially sweetened (sucralose and ace-K) but naturally colored.",
    affiliateUrl: "https://www.amazon.com/s?k=gorilla+mode+pre+workout&tag=YOURTAG-20",
    blurb: "Reformulated in 2024 (\"Gorilla Mode 2.0\") into one of the heaviest fully disclosed formulas around — roughly 40 g of actives and 400 mg caffeine at the two-scoop maximum. The fine print matters: one scoop is a very different product.",
    labelVerified: "July 2026",
    imageUrl: "images/products/gorilla-mode.png",
    images: [
      "https://gorillamind.com/cdn/shop/files/GM_HERO_Mode_FruitPunch_working_020626_1_1.png?v=1782938669",
      "https://gorillamind.com/cdn/shop/files/GM_THUMBS_Mode_IngBreakdown_1500x1500_94541f42-302d-417f-bdbf-24287ae0f4e7.jpg?v=1771872254",
      "https://gorillamind.com/cdn/shop/files/GM_HERO_Mode_BlueRaspberry_1500x1500_23e6e7d5-1d7e-4bbf-802e-3d8ad8c24bf9.png?v=1772215014",
      "https://gorillamind.com/cdn/shop/files/GM_HERO_Mode_RainbowSherbet_working_020626_1.png?v=1772215014",
      "https://gorillamind.com/cdn/shop/files/GM_THUMBS_Mode_KeyCallouts_1500x1500_eecf1d31-ffea-4df1-a77f-d75ee89e37ba.jpg?v=1772215014"
    ],
    sources: [
      {
        url: "https://gorillamind.com/products/gorilla-mode",
        label: "Gorilla Mind — official product page"
      },
      {
        url: "https://www.muscleandstrength.com/store/gorilla-mode.html",
        label: "Muscle & Strength — supplement facts transcription"
      },
      {
        url: "https://www.priceplow.com/gorilla-mind/gorilla-mode-pre-workout",
        label: "PricePlow — independent dose cross-check"
      },
      {
        url: "https://www.stack3d.com/2024/03/gorilla-mode-2024.html",
        label: "Stack3d — 2024 reformulation coverage"
      }
    ]
  },
  {
    id: "c4-original",
    name: "C4 Original",
    brand: "Cellucor",
    category: "pre-workout",
    accentColor: "#F27E4A",
    stimFree: false,
    badges: [
      "Moderate Stim",
      "Fully Disclosed Label",
      "Budget Pick"
    ],
    caffeineMg: 200,
    keyIngredients: [
      {
        name: "CarnoSyn Beta-Alanine",
        dose: "2 g",
        clinicalNote: "Below the 3.2–6.4 g/day range used in beta-alanine research — mild tingles still possible."
      },
      {
        name: "Velox (L-Citrulline + L-Arginine)",
        dose: "2.4 g",
        clinicalNote: "A fully disclosed 1.2 g / 1.2 g split — well under the 6–8 g used in citrulline studies."
      },
      {
        name: "Creatine Nitrate (NO3-T)",
        dose: "1 g",
        clinicalNote: "Well below the 3–5 g standard used in creatine research."
      }
    ],
    cautions: [
      "Key doses sit under studied ranges — gentler, but less backed",
      "The label says not to use it continuously for more than 8 weeks",
      "Old 150 mg-caffeine stock still circulates — look for the Velox and PeptiPump rows to confirm the current label"
    ],
    servings: 30,
    priceRange: "$",
    flavorsNote: "Classic candy-style flavors plus licensed collabs; artificially sweetened and dyed; sold almost everywhere.",
    affiliateUrl: "https://www.amazon.com/s?k=c4+original+pre+workout&tag=YOURTAG-20",
    blurb: "The gateway pre-workout grew up: the 2024 fifth-generation formula raised caffeine to 200 mg, roughly doubled the scoop, and dropped the proprietary blend entirely. Still cheap, still everywhere — now with every dose on the label.",
    labelVerified: "July 2026",
    imageUrl: "images/products/c4-original.png",
    images: [
      "https://cellucor.com/cdn/shop/files/C4AN_1002_Brand_C4YellowLabel_Transition_C4Original_CoreFlavors_BasicPDPs-OG-IBR-Hero-Grey.png?v=1773235672",
      "https://cellucor.com/cdn/shop/files/C4AN_1002_Brand_C4YellowLabel_Transition_C4Original_CoreFlavors_BasicPDPs-OG-HWP-Hero-Grey.png?v=1773236184",
      "https://cellucor.com/cdn/shop/files/C4AN_1002_Brand_C4YellowLabel_Transition_C4Original_CoreFlavors_BasicPDPs-OG-WM-Hero-Grey.png?v=1776700711",
      "https://cellucor.com/cdn/shop/files/CELL_0224_P8_Digital_Ecomm_PDP_C4PWO_SoftLaunch_Feb2024-C4_Original_Hero-Rainbow-White_4fe126dd-9c89-42b4-baa1-bb5fb144175b.png?v=1776701176"
    ],
    sources: [
      {
        url: "https://cellucor.com/products/c4-original",
        label: "Cellucor — official product page"
      },
      {
        url: "https://nutricartel.com/products/c4-original-pre-workout",
        label: "NutriCartel — full supplement facts transcription"
      },
      {
        url: "https://blog.priceplow.com/supplement-news/c4-2024",
        label: "PricePlow — 2024 relaunch coverage"
      }
    ]
  },
  {
    id: "total-war",
    name: "Total War",
    brand: "RedCon1",
    category: "pre-workout",
    accentColor: "#E05252",
    stimFree: false,
    badges: [
      "High Stim"
    ],
    caffeineMg: 320,
    keyIngredients: [
      {
        name: "Citrulline Malate",
        dose: "6 g",
        clinicalNote: "At the low end of the 6–8 g studied range."
      },
      {
        name: "Beta-Alanine",
        dose: "3.2 g",
        clinicalNote: "The standard studied dose — tingles expected."
      },
      {
        name: "Caffeine (two forms)",
        dose: "320 mg",
        clinicalNote: "Combines fast caffeine anhydrous with a slower extended-release form."
      }
    ],
    cautions: [
      "Very high stimulant load with multiple caffeine forms",
      "Not a good first pre-workout if you're new or caffeine-sensitive"
    ],
    servings: 30,
    priceRange: "$$",
    flavorsNote: "Sweet, strong flavors; artificially sweetened.",
    affiliateUrl: "https://www.amazon.com/s?k=redcon1+total+war+pre+workout&tag=YOURTAG-20",
    blurb: "Two caffeine forms totaling 320 mg with beta-alanine at the standard studied dose; the formula leans on stimulants over pump ingredients.",
    labelVerified: "July 2026",
    imageUrl: "images/products/total-war.png",
    images: [
      "https://cdn.shopify.com/s/files/1/1304/0433/products/TW_BAJABOMB_30SERV_FLV-2023.png?v=1738267227",
      "https://cdn.shopify.com/s/files/1/1304/0433/files/BAJABOMB.jpg?v=1770325008",
      "https://cdn.shopify.com/s/files/1/1304/0433/files/4-Benefits_1.5x.png?v=1770325008"
    ]
  },
  {
    id: "on-gold-standard-pre",
    name: "Gold Standard Pre-Workout",
    brand: "Optimum Nutrition",
    category: "pre-workout",
    accentColor: "#D9A82F",
    stimFree: false,
    badges: [
      "Moderate Stim",
      "Beginner Friendly"
    ],
    caffeineMg: 175,
    keyIngredients: [
      {
        name: "Citrulline Malate",
        dose: "1.5 g",
        clinicalNote: "Well below the 6–8 g range used in most citrulline studies."
      },
      {
        name: "Beta-Alanine",
        dose: "1.5 g",
        clinicalNote: "Under the 3.2 g/day amount used in beta-alanine research."
      },
      {
        name: "Creatine Monohydrate",
        dose: "3 g",
        clinicalNote: "At the low end of the standard 3–5 g range."
      }
    ],
    cautions: [
      "Pump ingredients are well under studied doses",
      "Moderate caffeine still adds up if you also drink coffee"
    ],
    servings: 30,
    priceRange: "$$",
    flavorsNote: "Mild, familiar flavors from a long-established brand.",
    affiliateUrl: "https://www.amazon.com/s?k=optimum+nutrition+gold+standard+pre+workout&tag=YOURTAG-20",
    blurb: "Moderate 175 mg of caffeine with pump ingredients well below studied ranges; a predictable label from an established brand.",
    labelVerified: "July 2026",
    imageUrl: "images/products/on-gold-standard-pre.png",
    images: [
      "https://cdn.shopify.com/s/files/1/0794/9991/9627/files/on-1146471_Image_01.png?v=1755790955",
      "https://www.optimumnutrition.com/cdn/shop/files/ONUS-gold-standard-pre-workout-powder_Label_Blueberry-Lemonade_0-66lb_30-servings.jpg?v=1761316801&width=1000",
      "https://cdn.shopify.com/s/files/1/0794/9991/9627/files/on-1146473_Image_01.png?v=1755790955",
      "https://cdn.shopify.com/s/files/1/0794/9991/9627/files/on-1146465_Image_01.png?v=1755790955",
      "https://cdn.shopify.com/s/files/1/0794/9991/9627/files/on-1146468_Image_01.png?v=1755790955"
    ]
  },
  {
    id: "ghost-legend",
    name: "Legend",
    brand: "Ghost",
    category: "pre-workout",
    accentColor: "#8FA3BF",
    stimFree: false,
    badges: [
      "High Stim",
      "Fully Disclosed Label"
    ],
    caffeineMg: 250,
    keyIngredients: [
      {
        name: "L-Citrulline",
        dose: "4 g",
        clinicalNote: "Below the 6–8 g range used in most citrulline studies."
      },
      {
        name: "Beta-Alanine",
        dose: "3.2 g",
        clinicalNote: "The standard studied dose — tingles expected."
      }
    ],
    cautions: [
      "250 mg caffeine — skip your afternoon coffee",
      "Beta-alanine tingles expected"
    ],
    servings: 25,
    priceRange: "$$",
    flavorsNote: "Known for rotating licensed candy-collab flavors.",
    affiliateUrl: "https://www.amazon.com/s?k=ghost+legend+pre+workout&tag=YOURTAG-20",
    blurb: "Fully disclosed at 250 mg of caffeine; citrulline runs below the range most studies use.",
    labelVerified: "July 2026",
    imageUrl: "images/products/ghost-legend.png",
    images: [
      "https://cdn.shopify.com/s/files/1/2060/6331/files/LegendxWelchs.webp?v=1761234119",
      "https://cdn.shopify.com/s/files/1/2060/6331/files/LegendWelchsBack.webp?v=1761234119"
    ]
  },
  {
    id: "alani-nu-pre-workout",
    name: "Pre-Workout",
    brand: "Alani Nu",
    category: "pre-workout",
    accentColor: "#E88098",
    stimFree: false,
    badges: [
      "Moderate Stim",
      "Fully Disclosed Label",
      "Beginner Friendly"
    ],
    caffeineMg: 200,
    keyIngredients: [
      {
        name: "L-Citrulline",
        dose: "6 g",
        clinicalNote: "At the low end of the 6–8 g range used in most citrulline studies."
      },
      {
        name: "Beta-Alanine",
        dose: "1.6 g",
        clinicalNote: "Half the 3.2 g/day amount most beta-alanine studies use."
      },
      {
        name: "L-Tyrosine",
        dose: "500 mg",
        clinicalNote: "Under the amounts used in most tyrosine research on focus during stress."
      }
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
    blurb: "Disclosed label at 200 mg of caffeine; citrulline reaches the studied range while beta-alanine and tyrosine sit below it.",
    labelVerified: "July 2026",
    imageUrl: "images/products/alani-nu-pre-workout.png",
    images: [
      "https://cdn.shopify.com/s/files/1/0035/4654/6274/files/Stretch_AN-Website-30serv-PWO-PDP-GXL-01_V2.png?v=1782416587",
      "https://cdn.shopify.com/s/files/1/0035/4654/6274/files/Stretch_AN-Website-30serv-PWO-PDP-GXL-02_V2.png?v=1782416587",
      "https://cdn.shopify.com/s/files/1/0035/4654/6274/files/Stretch_AN-Website-30serv-PWO-PDP-GXL-04_V1.jpg?v=1782416586"
    ]
  },
  {
    id: "ryse-godzilla",
    name: "Godzilla",
    brand: "RYSE Supplements",
    category: "pre-workout",
    accentColor: "#7B8AD9",
    stimFree: false,
    badges: [
      "High Stim",
      "Fully Disclosed Label"
    ],
    caffeineMg: 400,
    keyIngredients: [
      {
        name: "L-Citrulline",
        dose: "9 g",
        clinicalNote: "Above the 6–8 g range used in most citrulline studies, with another 2 g of citrulline nitrate on top."
      },
      {
        name: "Beta-Alanine",
        dose: "6.4 g",
        clinicalNote: "Double the standard 3.2 g/day studied dose — strong tingles expected."
      },
      {
        name: "Creatine Monohydrate",
        dose: "5 g",
        clinicalNote: "The standard 3–5 g daily amount used in creatine research."
      },
      {
        name: "Caffeine (two forms)",
        dose: "400 mg",
        clinicalNote: "350 mg caffeine anhydrous plus 50 mg zümXR extended-release caffeine per two scoops."
      }
    ],
    cautions: [
      "400 mg caffeine at the full two-scoop serving — the FDA's daily reference amount for healthy adults, before any coffee",
      "All figures assume two scoops; the label also prints a one-scoop column at exactly half (200 mg caffeine, 40 servings)",
      "6.4 g beta-alanine — strong tingles expected"
    ],
    servings: 20,
    priceRange: "$$$",
    flavorsNote: "Licensed candy and cereal collaboration flavors; artificially sweetened.",
    affiliateUrl: "https://www.amazon.com/s?k=ryse+godzilla+pre+workout&tag=YOURTAG-20",
    blurb: "The current label reaches 400 mg of caffeine at two scoops (350 mg anhydrous plus 50 mg extended-release) with 9 g of citrulline and beta-alanine at double the studied dose; older 388 mg panels still circulate.",
    labelVerified: "July 2026",
    imageUrl: "images/products/ryse-godzilla.png",
    images: [
      "https://m.media-amazon.com/images/I/718qUjKuwAL._AC_SL1500_.jpg",
      "https://rysesupps.com/cdn/shop/files/sfp-godz-br.png?v=1708540057",
      "https://rysesupps.com/cdn/shop/files/RYSE_AMZ_GZPRE_BR_IMAGE.jpg?v=1747069052&width=800",
      "https://rysesupps.com/cdn/shop/files/RYSE_AMZ_GZPRE_BR_IMAGE_3.jpg?v=1747069052&width=800"
    ],
    sources: [
      {
        url: "https://rysesupps.com/products/godzilla-pre-workout",
        label: "RYSE — official product page"
      },
      {
        url: "https://rysesupps.com/cdn/shop/files/sfp-godz-br.png?v=1708540057",
        label: "RYSE — supplement facts panel image (primary label source)"
      },
      {
        url: "https://www.amazon.com/s?k=ryse+godzilla+pre+workout",
        label: "Amazon listing — 400 mg caffeine cross-check"
      }
    ]
  },
  {
    id: "bucked-up",
    name: "Bucked Up",
    brand: "Bucked Up",
    category: "pre-workout",
    accentColor: "#7FB53E",
    stimFree: false,
    badges: [
      "Moderate Stim",
      "Fully Disclosed Label"
    ],
    caffeineMg: 200,
    keyIngredients: [
      {
        name: "Citrulline Malate",
        dose: "6 g",
        clinicalNote: "At the low end of the 6–8 g studied range."
      },
      {
        name: "Beta-Alanine",
        dose: "2 g",
        clinicalNote: "Under the 3.2 g/day amount used in beta-alanine research."
      },
      {
        name: "Alpha-GPC",
        dose: "200 mg",
        clinicalNote: "A choline compound studied for focus during exercise."
      },
      {
        name: "Deer Antler Velvet Extract",
        dose: "50 mg",
        clinicalNote: "A signature ingredient with very little human research behind it."
      }
    ],
    cautions: [
      "Deer antler velvet extract is a brand signature, not a well-studied dose",
      "Beta-alanine is under the studied amount, though tingles still happen"
    ],
    servings: 30,
    priceRange: "$$",
    flavorsNote: "Long, frequently rotating flavor lineup; artificially sweetened.",
    affiliateUrl: "https://www.amazon.com/s?k=bucked+up+pre+workout&tag=YOURTAG-20",
    blurb: "Disclosed label at 200 mg of caffeine; deer antler velvet is a brand signature with little human research behind it.",
    labelVerified: "July 2026",
    imageUrl: "images/products/bucked-up.png",
    images: [
      "https://www.buckedup.com/cdn-cgi/image/width=1200,format=auto,quality=85/public/upload%2Fimg%2Fproducts%2F162-buckedup-pre-workout-rocket-pop-11oz.webp",
      "https://www.buckedup.com/cdn-cgi/image/width=1200,format=auto,quality=85/public/upload%2Fimg%2Fproducts%2Foptions%2Fvalues%2F562-WHO-BU-Pre-BlueRaz-30srv-25-04-00-01.webp",
      "https://www.buckedup.com/cdn-cgi/image/width=1200,format=auto,quality=85/public/upload%2Fimg%2Fproducts%2Foptions%2Fvalues%2F566-WHO-BU-Pre-Watermelon-30srv-25-04-00-01.webp"
    ]
  },
  {
    id: "beyond-raw-lit",
    name: "LIT",
    brand: "Beyond Raw",
    category: "pre-workout",
    accentColor: "#4FA8CE",
    stimFree: false,
    badges: [
      "High Stim"
    ],
    caffeineMg: 250,
    keyIngredients: [
      {
        name: "Beta-Alanine (CarnoSyn)",
        dose: "3.2 g",
        clinicalNote: "The standard studied dose — tingles expected."
      },
      {
        name: "Nitrosigine",
        dose: "1.5 g",
        clinicalNote: "The 1.5 g amount used in this ingredient's own published research."
      },
      {
        name: "Caffeine (two forms)",
        dose: "250 mg",
        clinicalNote: "Caffeine anhydrous plus a caffeine-pterostilbene form marketed for a longer curve."
      }
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
    blurb: "Beta-alanine at the full studied dose and Nitrosigine at its studied 1.5 g; pump support comes from Nitrosigine rather than citrulline.",
    labelVerified: "July 2026",
    imageUrl: "images/products/beyond-raw-lit.png",
    images: [
      "https://www.gnc.com/dw/image/v2/BBLB_PRD/on/demandware.static/-/Sites-master-catalog-gnc/default/dw0644caf1/hi-res/759031_Beyond_Raw_LIT_V2_Passion_Orange_Guava_Tub_Front.jpg?sw=1500&sh=1500&sm=fit",
      "https://www.gnc.com/dw/image/v2/BBLB_PRD/on/demandware.static/-/Sites-master-catalog-gnc/default/dw70bbc89d/hi-res/759031_EBC_Thumbnails_02_TikTok_BeyondRaw_LIT_V2_POG_SupplementFacts.jpg?sw=1500&sh=1500&sm=fit",
      "https://www.gnc.com/dw/image/v2/BBLB_PRD/on/demandware.static/-/Sites-master-catalog-gnc/default/dw613a4b75/hi-res/364503_Beyond_Raw_LIT_V2_Blue_Raspberry_Tub_Front.jpg?sw=1500&sh=1500&sm=fit",
      "https://www.gnc.com/dw/image/v2/BBLB_PRD/on/demandware.static/-/Sites-master-catalog-gnc/default/dw78e90ac4/hi-res/364504_Beyond_Raw_LIT_V2_Watermelon_Tub_Front.jpg?sw=1500&sh=1500&sm=fit"
    ]
  },
  {
    id: "kaged-pre-kaged",
    name: "Pre-Kaged",
    brand: "Kaged",
    category: "pre-workout",
    accentColor: "#3DBD8F",
    stimFree: false,
    badges: [
      "High Stim",
      "Fully Disclosed Label"
    ],
    caffeineMg: 274,
    keyIngredients: [
      {
        name: "L-Citrulline",
        dose: "6.5 g",
        clinicalNote: "Within the 6–8 g range used in most citrulline studies."
      },
      {
        name: "Beta-Alanine",
        dose: "1.6 g",
        clinicalNote: "Half the 3.2 g/day amount most beta-alanine studies use."
      },
      {
        name: "Creatine HCl",
        dose: "1.5 g",
        clinicalNote: "Below the 3–5 g standard used in creatine research."
      },
      {
        name: "Caffeine from Organic Coffee Bean",
        dose: "274 mg",
        clinicalNote: "Plant-sourced caffeine; the body handles it the same as caffeine anhydrous."
      }
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
    blurb: "Plant-sourced 274 mg of caffeine with citrulline in the studied range; creatine and beta-alanine sit below studied amounts.",
    labelVerified: "July 2026",
    imageUrl: "images/products/kaged-pre-kaged.png",
    images: [
      "https://www.kaged.com/cdn/shop/files/Preworkoutstrawberrylemonadefront_383553b6-4ffd-4f57-8253-9d5674e0ed96.png?v=1774411038&width=1600",
      "https://www.kaged.com/cdn/shop/files/SFP-PRKS.jpg?v=1664839489&width=1600",
      "https://www.kaged.com/cdn/shop/files/PW-Front-PL_bbfab450-4978-4244-8284-3e0ba60344d9.png?v=1774411038&width=1600",
      "https://www.kaged.com/cdn/shop/files/Pre-WorkoutAMZ_PWIngredients1.jpg?v=1774411038&width=4167"
    ]
  },
  {
    id: "pre-jym",
    name: "Pre JYM",
    brand: "JYM Supplement Science",
    category: "pre-workout",
    accentColor: "#C08A57",
    stimFree: false,
    badges: [
      "High Stim",
      "Fully Disclosed Label"
    ],
    caffeineMg: 300,
    keyIngredients: [
      {
        name: "Citrulline Malate",
        dose: "6 g",
        clinicalNote: "At the low end of the 6–8 g studied range."
      },
      {
        name: "Beta-Alanine",
        dose: "2 g",
        clinicalNote: "Under the 3.2 g/day amount used in beta-alanine research."
      },
      {
        name: "Creatine HCl",
        dose: "2 g",
        clinicalNote: "Below the 3–5 g standard used in creatine research."
      },
      {
        name: "Betaine",
        dose: "1.5 g",
        clinicalNote: "Under the 2.5 g amount used in most betaine studies."
      }
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
    blurb: "Spreads many ingredients across one 300 mg-caffeine scoop; most individual doses land below their studied ranges.",
    labelVerified: "July 2026",
    imageUrl: "images/products/pre-jym.png",
    images: [
      "https://jymsupplementscience.com/cdn/shop/files/PRE30FF400_26395_040126_V1.1_Front.png?v=1783976390&width=2136",
      "https://jymsupplementscience.com/cdn/shop/files/Pre-JYM-SFP.svg?v=1783467722",
      "https://jymsupplementscience.com/cdn/shop/files/PRE30FF400_26395_040126_V1.1_Right.png?v=1783976554&width=2134",
      "https://jymsupplementscience.com/cdn/shop/files/PRE30FF400_26395_040126_V1.1_Left.png?v=1783976576&width=2136"
    ]
  },
  {
    id: "legion-pulse-stim-free",
    name: "Pulse Stim-Free",
    brand: "Legion",
    category: "pre-workout",
    accentColor: "#4E9FD4",
    stimFree: true,
    badges: [
      "Stim-Free",
      "Fully Disclosed Label"
    ],
    caffeineMg: 0,
    keyIngredients: [
      {
        name: "Citrulline Malate",
        dose: "8 g",
        clinicalNote: "Within the 6–8 g range used in most citrulline studies."
      },
      {
        name: "Beta-Alanine",
        dose: "3.6 g",
        clinicalNote: "In the studied range — tingles happen even without caffeine."
      },
      {
        name: "Alpha-GPC",
        dose: "300 mg",
        clinicalNote: "A choline compound studied for focus during exercise."
      }
    ],
    cautions: [
      "Beta-alanine tingles still apply — they're not from caffeine",
      "Stim-free doesn't mean effect-free; read each ingredient"
    ],
    servings: 21,
    priceRange: "$$$",
    flavorsNote: "Same stevia-sweetened flavor family as regular Pulse.",
    affiliateUrl: "https://www.amazon.com/s?k=legion+pulse+stim+free+pre+workout&tag=YOURTAG-20",
    blurb: "The same citrulline and beta-alanine doses as Pulse with zero caffeine; suited to evening sessions.",
    labelVerified: "July 2026",
    imageUrl: "images/products/legion-pulse-stim-free.png",
    images: [
      "https://legionathletics.com/wp-content/uploads/2023/08/PulseSF-20S-Fruit-Punch-Transp.png",
      "https://legionathletics.com/wp-content/uploads/2019/08/product-ingredients-pulse-stim-free-fruit-punch-b.png",
      "https://legionathletics.com/wp-content/uploads/2020/11/PulseSF-Fruit-Punch-1000x1000-Directions.png",
      "https://legionathletics.com/wp-content/uploads/2020/06/New-Look-STQ-1000x1000-Pulse-SK.png"
    ]
  },
  {
    id: "transparent-labs-stim-free",
    name: "Stim-Free",
    brand: "Transparent Labs",
    category: "pre-workout",
    accentColor: "#35C9B4",
    stimFree: true,
    badges: [
      "Stim-Free",
      "Fully Disclosed Label"
    ],
    caffeineMg: 0,
    keyIngredients: [
      {
        name: "Citrulline Malate",
        dose: "8 g",
        clinicalNote: "Within the 6–8 g range used in most citrulline studies."
      },
      {
        name: "Beta-Alanine",
        dose: "4 g",
        clinicalNote: "At the higher end of studied daily amounts — tingles very likely."
      },
      {
        name: "Betaine Anhydrous",
        dose: "2.5 g",
        clinicalNote: "Matches the 2.5 g amount used in most betaine studies."
      }
    ],
    cautions: [
      "Beta-alanine tingles likely at 4 g"
    ],
    servings: 30,
    priceRange: "$$$",
    flavorsNote: "Stevia-sweetened, no artificial dyes.",
    affiliateUrl: "https://www.amazon.com/s?k=transparent+labs+stim+free+pre+workout&tag=YOURTAG-20",
    blurb: "BULK's formula without the caffeine; citrulline, beta-alanine, and betaine stay at studied doses.",
    labelVerified: "July 2026",
    imageUrl: "images/products/transparent-labs-stim-free.png",
    images: [
      "https://www.transparentlabs.com/cdn/shop/files/TL_Stim-Free_30_SL_1_0.png?v=1745878684&width=1946",
      "https://www.transparentlabs.com/cdn/shop/files/Strawberry_Lemonade_SFP.png?v=1758632295&width=1946"
    ]
  },
  {
    id: "gorilla-mode-nitric",
    name: "Gorilla Mode Nitric",
    brand: "Gorilla Mind",
    category: "pre-workout",
    accentColor: "#9B7FDB",
    stimFree: true,
    badges: [
      "Stim-Free",
      "Fully Disclosed Label"
    ],
    caffeineMg: 0,
    keyIngredients: [
      {
        name: "L-Citrulline",
        dose: "9 g",
        clinicalNote: "Above the 6–8 g range used in most citrulline studies."
      },
      {
        name: "Glycerol (GlycerPump)",
        dose: "3 g",
        clinicalNote: "Studied for cell hydration; it's also what makes the powder clump."
      },
      {
        name: "Agmatine Sulfate",
        dose: "1.5 g",
        clinicalNote: "Common in pump formulas, with limited human research behind it."
      }
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
    blurb: "Caffeine-free with 9 g of citrulline and 3 g of glycerol; doses assume the full two-scoop serving.",
    labelVerified: "July 2026",
    imageUrl: "images/products/gorilla-mode-nitric.png",
    images: [
      "https://gorillamind.com/cdn/shop/files/GM_HERO_Nitric_FruitPunch_working_020626_1_1.png?v=1782938971&width=1500",
      "https://gorillamind.com/cdn/shop/files/GM_THUMBS_NITRIC_KeyCallouts_1500x1500_719faea0-7d5e-4e16-ae64-785c22f74de6.jpg?v=1771872781&width=1500",
      "https://gorillamind.com/cdn/shop/files/GM_THUMBS_NITRIC_IngBreakdown_1500x1500_cb238dfa-5fdb-449b-8561-5ea9de056e1e.jpg?v=1771872781&width=1500",
      "https://gorillamind.com/cdn/shop/files/GM_HERO_Nitric_RainbowSherbet_working_020626_1.png?v=1772215029&width=1500"
    ]
  },
  {
    id: "wrecked-pre-workout",
    name: "Wrecked",
    brand: "Huge Supplements",
    category: "pre-workout",
    accentColor: "#3B6EA5",
    stimFree: false,
    badges: [
      "High Stim",
      "Fully Disclosed Label"
    ],
    caffeineMg: 375,
    keyIngredients: [
      {
        name: "L-Citrulline",
        dose: "10 g",
        clinicalNote: "At the top of (or above) the 6-8 g range typically used in citrulline pump research."
      },
      {
        name: "Beta-Alanine",
        dose: "6.4 g",
        clinicalNote: "Roughly double the ~3.2 g/day dose used in most beta-alanine endurance studies; expect a stronger tingling (paresthesia) response."
      },
      {
        name: "Caffeine (Anhydrous + Di-Caffeine Malate)",
        dose: "375 mg",
        clinicalNote: "300 mg caffeine anhydrous plus 100 mg di-caffeine malate (about 75% caffeine) totals 375 mg at the full 2-scoop dose, roughly 4 cups of coffee."
      },
      {
        name: "Alpha-GPC 50%",
        dose: "1 g",
        clinicalNote: "The label lists 1,000 mg of a 50% alpha-GPC grade, which yields roughly 500 mg of actual alpha-GPC - inside the 300-600 mg range used in most cognitive-focus studies."
      }
    ],
    cautions: [
      "Full labeled serving is 2 scoops; 1 scoop halves every number on this label, including caffeine (about 188 mg).",
      "375 mg caffeine at full dose is roughly 4 cups of coffee - brand itself recommends first-time users start with a half scoop.",
      "6.4 g beta-alanine will likely cause a tingling (paresthesia) sensation in the hands and face."
    ],
    servings: 20,
    priceRange: "$$$",
    flavorsNote: "Seven flavors including Blue Razz, Panther's Blood, Watermelon, and Bomb Popsicle.",
    affiliateUrl: "https://www.amazon.com/s?k=Wrecked+Pre-Workout+Huge+Supplements&tag=YOURTAG-20",
    blurb: "A 14-ingredient, 2-scoop-max formula stacking 375 mg of caffeine with citrulline, beta-alanine, and alpha-GPC at amounts inside commonly studied ranges - dosed and priced for experienced stimulant users, not beginners.",
    labelVerified: "July 2026",
    imageUrl: "images/products/wrecked-pre-workout.png",
    images: [
      "https://hugesupplements.com/cdn/shop/files/WreckedBlueRazz_1800x1800.png",
      "https://hugesupplements.com/cdn/shop/files/Wrecked_Supplement_Facts_New_Formula_1800x1800.png",
      "https://hugesupplements.com/cdn/shop/files/Wrecked_Panthers_Blood_1800x1800.png",
      "https://hugesupplements.com/cdn/shop/files/WreckedPre-WorkoutWatermelon_1800x1800.png",
      "https://hugesupplements.com/cdn/shop/files/WreckedRaspberryMojitoPre-Workout_1800x1800.png"
    ],
    sources: [
      {
        url: "https://hugesupplements.com/products/wrecked-pre-workout",
        label: "Huge Supplements - Wrecked product page (official)"
      },
      {
        url: "https://www.amazon.com/Huge-Supplements-Pre-Workout-L-Citrulline-Beta-Alanine/dp/B0CG99PJWR",
        label: "Amazon listing - current 375mg-caffeine formula label"
      },
      {
        url: "https://barbend.com/huge-supplements-wrecked-pre-workout-review/",
        label: "BarBend review - ingredient/serving cross-check"
      },
      {
        url: "https://www.stack3d.com/2024/11/huge-supplements-wrecked-2024/",
        label: "Stack3d - 2024 reformulation dose-by-dose breakdown (independent)"
      }
    ]
  },
  {
    id: "woke-af",
    name: "Woke AF",
    brand: "Bucked Up",
    category: "pre-workout",
    accentColor: "#CC4B2E",
    stimFree: false,
    badges: [
      "High Stim",
      "Fully Disclosed Label"
    ],
    caffeineMg: 333,
    keyIngredients: [
      {
        name: "Citrulline Malate (2:1)",
        dose: "6 g",
        clinicalNote: "A 2:1 blend, so about 4 g of it is actual citrulline - under the 6-8 g of citrulline used in most pump studies."
      },
      {
        name: "Beta-Alanine",
        dose: "3.2 g",
        clinicalNote: "Matches the ~3.2 g/day dose most commonly used in beta-alanine endurance research."
      },
      {
        name: "Caffeine Anhydrous",
        dose: "333 mg",
        clinicalNote: "About 3.5 cups of coffee in a single scoop; the label explicitly warns against exceeding one scoop."
      },
      {
        name: "Synephrine HCl",
        dose: "40 mg",
        clinicalNote: "Above the 6-27 mg range typically used in bitter-orange/synephrine thermogenic studies; combined with dendrobium and caffeine it adds meaningfully to overall stimulant load."
      }
    ],
    cautions: [
      "One-scoop-max product: label explicitly warns not to exceed a single scoop in a 24-hour period.",
      "Stacks three stimulants (caffeine, dendrobium, synephrine) alongside a full 333 mg caffeine dose; not recommended for beginners or stimulant-sensitive users.",
      "3.2 g beta-alanine causes a temporary skin-tingling (paresthesia) sensation."
    ],
    servings: 30,
    priceRange: "$$",
    flavorsNote: "Rotating flavor lineup (Rocket Pop, Miami, Blood Raz, Killa OJ and limited editions), sucralose-sweetened, zero sugar and zero calories.",
    affiliateUrl: "https://www.amazon.com/s?k=Woke+AF+Bucked+Up+Pre+Workout&tag=YOURTAG-20",
    blurb: "A tri-stimulant, one-scoop-max formula (caffeine, dendrobium, synephrine) that fully discloses every dose on the label - the stimulant load makes it a poor fit for anyone without an established caffeine tolerance.",
    labelVerified: "July 2026",
    imageUrl: "images/products/woke-af.png",
    images: [
      "https://www.buckedup.com/cdn-cgi/image/width=1200,format=auto,quality=85/public/upload%2Fimg%2Fproducts%2Foptions%2Fvalues%2F784-woke-af-pre-workout-rocket-pop-1.webp",
      "https://www.buckedup.com/cdn-cgi/image/width=1200,format=auto,quality=85/public/upload%2Fimg%2Fproducts%2Foptions%2Fvalues%2F784-1024110_WHO-WokeAF-RocketPop-30srv-SFP-Render-25_medium.08-00-noBG.webp",
      "https://www.buckedup.com/cdn-cgi/image/width=1200,format=auto,quality=85/public/upload%2Fimg%2Fproducts%2Foptions%2Fvalues%2F784-woke-af-pre-workout-rocket-pop-2.webp",
      "https://www.buckedup.com/cdn-cgi/image/width=1200,format=auto,quality=85/public/upload%2Fimg%2Fproducts%2Foptions%2Fvalues%2F784-woke-af-pre-workout-rocket-pop-3.webp"
    ],
    sources: [
      {
        url: "https://www.buckedup.com/woke-af-high-stimulant-pre-workout",
        label: "Bucked Up - Woke AF product page (official)"
      },
      {
        url: "https://supplementwarehouse.com/products/bucked-up-woke-af-30-servings",
        label: "Supplement Warehouse - label transcription"
      },
      {
        url: "https://www.bestpricenutrition.com/products/bucked-up-woke-af-30-servings",
        label: "Best Price Nutrition - servings/price cross-check"
      },
      {
        url: "https://www.dpsnutrition.net/i/29261/das-labs-woke-af-rocket-pop-30-servings.htm",
        label: "DPS Nutrition - independent full-panel transcription"
      }
    ]
  },
  {
    id: "mother-bucker",
    name: "Mother Bucker",
    brand: "Bucked Up",
    category: "pre-workout",
    accentColor: "#7A2436",
    stimFree: false,
    badges: [
      "High Stim",
      "Fully Disclosed Label"
    ],
    caffeineMg: 400,
    keyIngredients: [
      {
        name: "Beta-Alanine",
        dose: "6.4 g",
        clinicalNote: "Double the ~3.2 g/day dose used in most beta-alanine studies - expect a stronger tingling response."
      },
      {
        name: "L-Citrulline",
        dose: "4 g",
        clinicalNote: "Below the 6-8 g range used in most standalone citrulline studies, though paired here with 1.5 g Nitrosigine (arginine silicate) for additional pump support."
      },
      {
        name: "Caffeine (300 mg immediate-release + 100 mg extended-release)",
        dose: "400 mg",
        clinicalNote: "About 4 cups of coffee worth of caffeine, split between 300 mg caffeine anhydrous and 100 mg microencapsulated delayed-release caffeine."
      },
      {
        name: "Rauwolscine (Alpha-Yohimbine)",
        dose: "2 mg",
        clinicalNote: "A potent yohimbine-family alkaloid; 2 mg is a standard supplement-level dose and adds further to the overall stimulant load on top of the 400 mg of caffeine."
      }
    ],
    cautions: [
      "400 mg caffeine per scoop is about 4 cups of coffee; label states the formula is not newbie-friendly and warns against exceeding 1 serving in 24 hours.",
      "6.4 g beta-alanine will cause a tingling (paresthesia) sensation.",
      "Contains rauwolscine (alpha-yohimbine), a stimulant compound some people are sensitive to - avoid stacking with other stimulants."
    ],
    servings: 20,
    priceRange: "$$$",
    flavorsNote: "Flavors include Gym-Junkie Juice, Miami Musclehead, Mango Mystery, Rocket Pop, Strawberry Super Sets, and Tart Candy, sucralose-sweetened.",
    affiliateUrl: "https://www.amazon.com/s?k=Mother+Bucker+Bucked+Up+Pre+Workout&tag=YOURTAG-20",
    blurb: "A 400 mg-caffeine, double-dosed beta-alanine formula built for experienced stimulant users; the brand itself says it isn't newbie-friendly, and the added alpha-yohimbine raises the stimulant load further.",
    labelVerified: "July 2026",
    imageUrl: "images/products/mother-bucker.png",
    images: [
      "https://www.buckedup.com/cdn-cgi/image/width=1200,format=auto,quality=85/public/upload%2Fimg%2Fproducts%2Foptions%2Fvalues%2F7968-buckedup-mother-bucker-pre-workout-rocket-pop-1.webp",
      "https://www.buckedup.com/cdn-cgi/image/width=1200,format=auto,quality=85/public/upload%2Fimg%2Fproducts%2Foptions%2Fvalues%2F7968-BU-MotherBucker-SFP-RocketPop-2023.06-03-1200px.webp",
      "https://www.buckedup.com/cdn-cgi/image/width=1200,format=auto,quality=85/public/upload%2Fimg%2Fproducts%2Foptions%2Fvalues%2F7968-buckedup-mother-bucker-pre-workout-rocket-pop-2.webp",
      "https://www.buckedup.com/cdn-cgi/image/width=1200,format=auto,quality=85/public/upload%2Fimg%2Fproducts%2Foptions%2Fvalues%2F7968-buckedup-mother-bucker-pre-workout-rocket-pop-3.webp"
    ],
    sources: [
      {
        url: "https://www.buckedup.com/mother-bucker-pre-workout",
        label: "Bucked Up - Mother Bucker product page (official)"
      },
      {
        url: "https://muscleandstrength.com/store/mother-bucker.html",
        label: "Muscle & Strength - label transcription"
      },
      {
        url: "https://nutricartel.com/products/mother-bucker-pre-workout",
        label: "NutriCartel - ingredient/serving cross-check"
      },
      {
        url: "https://illpumpyouup.com/bucked-up-mother-bucker-high-stim-pre-workout/",
        label: "I'll Pump You Up - independent full-panel transcription"
      }
    ]
  },
  {
    id: "c4-ultimate",
    name: "C4 Ultimate",
    brand: "Cellucor",
    category: "pre-workout",
    accentColor: "#C99A2E",
    stimFree: false,
    badges: [
      "High Stim",
      "Fully Disclosed Label"
    ],
    caffeineMg: 300,
    keyIngredients: [
      {
        name: "Caffeine Anhydrous",
        dose: "300 mg",
        clinicalNote: "About 3 cups of coffee per 1-scoop serving."
      },
      {
        name: "TeaCrine + Dynamine",
        dose: "10 mg + 50 mg",
        clinicalNote: "Dynamine at 50 mg sits at the low end of the 50-100 mg commonly used, while TeaCrine at 10 mg is well below the 50-300 mg range studied for theacrine; both are marketed to smooth out the 300 mg of caffeine anhydrous."
      },
      {
        name: "Beta-Alanine (CarnoSyn)",
        dose: "3.2 g",
        clinicalNote: "Matches the ~3.2 g/day dose most commonly used in beta-alanine endurance studies."
      },
      {
        name: "Velox (L-Citrulline + L-Arginine)",
        dose: "6 g",
        clinicalNote: "The 6 g Velox blend splits roughly evenly between L-citrulline and L-arginine, so the citrulline portion lands near 3 g - below the 6-8 g of citrulline used in most pump research."
      }
    ],
    cautions: [
      "300 mg caffeine (about 3 cups of coffee) plus TeaCrine and Dynamine on top adds meaningfully to total stimulant load despite the 'smooth energy' marketing.",
      "3.2 g beta-alanine will cause a temporary tingling (paresthesia) sensation.",
      "Contains 1 mg Rauwolfia vomitoria extract (alpha-yohimbine), an additional stimulant compound not everyone tolerates well."
    ],
    servings: 20,
    priceRange: "$$$",
    flavorsNote: "Multiple flavors including Frozen Bombsicle, Icy Blue Razz, Hawaiian Punch, and Cherry Jolly Rancher, sweetened with sucralose and acesulfame potassium.",
    affiliateUrl: "https://www.amazon.com/s?k=C4+Ultimate+Cellucor+Pre+Workout&tag=YOURTAG-20",
    blurb: "Cellucor's flagship tri-stim formula pairs 300 mg caffeine with TeaCrine and Dynamine for a smoother energy curve, with beta-alanine at the commonly studied 3.2 g daily amount and a citrulline-arginine pump blend - priced like a premium product despite its mainstream retail availability.",
    labelVerified: "July 2026",
    imageUrl: "images/products/c4-ultimate.png",
    images: [
      "https://cellucor.com/cdn/shop/files/C4AN_1002_Brand_C4YellowLabel_Transition_C4Ultimate_CoreFlavors_BasicPDPs-Ultimate-FB-Hero-Grey.png",
      "https://cellucor.com/cdn/shop/files/C4_ultimate-nutrition-v3.png",
      "https://cellucor.com/cdn/shop/files/C4AN_1002_Brand_C4YellowLabel_Transition_C4Ultimate_CoreFlavors_BasicPDPs-Ultimate-HWP-Hero-Grey.png",
      "https://cellucor.com/cdn/shop/files/C4AN_1002_Brand_C4YellowLabel_Transition_C4Ultimate_CoreFlavors_BasicPDPs-Ultimate-IBR-Hero-Grey_grande.png",
      "https://cellucor.com/cdn/shop/files/CELL_2379_C4_Ultimate_JollyRancher_DTC_PDPs_June2025_Hero-V01.png"
    ],
    sources: [
      {
        url: "https://cellucor.com/products/c4-ultimate",
        label: "Cellucor - C4 Ultimate product page (official)"
      },
      {
        url: "https://fitnessinformant.com/news/cellucor-c4-ultimate-reformulation/",
        label: "Fitness Informant - full label transcription of current formula"
      },
      {
        url: "https://www.stack3d.com/2024/02/cellucor-generation-v-c4-ultimates/",
        label: "Stack3d - Generation V reformulation breakdown"
      },
      {
        url: "https://www.muscleandstrength.com/store/c4-ultimate.html",
        label: "Muscle & Strength - independent full-panel transcription"
      }
    ]
  },
  {
    id: "no-xplode",
    name: "N.O.-XPLODE",
    brand: "BSN",
    category: "pre-workout",
    accentColor: "#c1622c",
    stimFree: false,
    badges: [
      "High Stim",
      "Proprietary Blend"
    ],
    caffeineMg: 275,
    keyIngredients: [
      {
        name: "Caffeine",
        dose: "275 mg",
        clinicalNote: "Well above the ~200mg per-serving amount used in most acute caffeine-and-exercise-performance studies; a strong stimulant dose in a single scoop. BSN discloses this figure as a callout even though the caffeine itself sits inside the Thermic Energy blend."
      },
      {
        name: "Beta-Alanine",
        dose: "1.8 g",
        clinicalNote: "Below the 3.2g daily dose (often split) used in research on raising muscle carnosine, though it can still produce the tingling sensation associated with the ingredient. Disclosed as a callout from within the Endura Shot blend."
      },
      {
        name: "Shock Composite (proprietary blend)",
        dose: "290 mg",
        clinicalNote: "A focus-oriented blend (label lists DMAE bitartrate, L-phenylalanine, toothed clubmoss extract, and B-vitamins among its components); because it's a blend, the amount of each individual ingredient isn't disclosed."
      },
      {
        name: "N.O. Alpha Fusion (proprietary blend)",
        dose: "1 g",
        clinicalNote: "A pump-support blend built around citrulline malate plus botanical extracts (danshen, grape skin, hawthorn); the blend format hides how much citrulline it actually contains, so it can't be compared directly to citrulline research doses."
      }
    ],
    cautions: [
      "275mg caffeine in one scoop is roughly equivalent to 3 cups of brewed coffee.",
      "Five proprietary blends (Myogenic Matrix 5.1g, Endura Shot 2.9g, Thermic Energy 1.3g, N.O. Alpha Fusion 1g, Shock Composite 290mg) mean individual ingredient doses beyond the caffeine and beta-alanine callouts are not disclosed, including how much creatine is in the 5.1g Myogenic Matrix.",
      "1.8g beta-alanine may cause a temporary skin-tingling sensation (paresthesia)."
    ],
    servings: 30,
    priceRange: "$$",
    flavorsNote: "Available in classic candy-style flavors (Blue Raspberry, Fruit Punch, Grape, Green Apple, Watermelon) sweetened with sucralose; colorant and sweetener details vary slightly by flavor.",
    affiliateUrl: "https://www.amazon.com/s?k=BSN+N.O.-XPLODE+Pre+Workout&tag=YOURTAG-20",
    blurb: "A legacy 2004-era stim pre-workout still built around a strong 275mg caffeine dose, but the label is stacked with five proprietary blends, so buyers get the caffeine and beta-alanine numbers as callouts without the creatine, pump, or focus ingredient breakdown.",
    labelVerified: "July 2026",
    imageUrl: "images/products/no-xplode.png",
    images: [
      "https://www.gobsn.com/cdn/shop/files/US_N.O.-Xplode_16srv_BlueRaz_6077633-Front-2000x1825-6c4b2d7.png?v=1762884026",
      "https://www.gobsn.com/cdn/shop/files/US_N.O.-Xplode_16srv_BlueRaz_6077633-NFP.png?v=1763132960&width=1000",
      "https://www.gobsn.com/cdn/shop/files/N.O.-XPLODE_30sv_FruitPunch.jpg?v=1763132959&width=1000",
      "https://www.gobsn.com/cdn/shop/files/N.O.-XPLODE_60sv_Watermelon.jpg?v=1763132959&width=1000"
    ],
    sources: [
      {
        url: "https://www.gobsn.com/products/no-xplode-pre-workout",
        label: "BSN official product page"
      },
      {
        url: "https://www.muscleandstrength.com/store/no-xplode-2.html",
        label: "Muscle & Strength label transcription"
      },
      {
        url: "https://www.dpsnutrition.net/i/17294/bsn-no-xplode-blue-raz-new-formula-60-servings.htm",
        label: "DPS Nutrition full panel transcription (all five proprietary blends)"
      },
      {
        url: "https://barbend.com/bsn-no-xplode-pre-workout-review/",
        label: "Barbend review (2026)"
      }
    ]
  },
  {
    id: "musclepharm-assault",
    name: "Assault",
    brand: "MusclePharm",
    category: "pre-workout",
    accentColor: "#b23a3a",
    stimFree: false,
    badges: [
      "High Stim",
      "Budget Pick",
      "Fully Disclosed Label"
    ],
    caffeineMg: 250,
    keyIngredients: [
      {
        name: "Caffeine Anhydrous",
        dose: "250 mg",
        clinicalNote: "Comparable to about 2.5 cups of brewed coffee; within the range commonly used in acute exercise-performance caffeine studies."
      },
      {
        name: "Creatine Monohydrate",
        dose: "3 g",
        clinicalNote: "Matches the standard 3-5g daily maintenance dose used in creatine research."
      },
      {
        name: "Beta-Alanine (CarnoSyn)",
        dose: "1.75 g",
        clinicalNote: "Below the ~3.2g daily split-dose typically used in studies on raising muscle carnosine, though sourced as branded CarnoSyn."
      },
      {
        name: "Betaine Anhydrous",
        dose: "1.5 g",
        clinicalNote: "At the low end of the 1.25-2.5g range used in betaine and power-output research."
      }
    ],
    cautions: [
      "250mg caffeine per scoop is roughly 2.5 cups of coffee.",
      "1.75g beta-alanine may cause a temporary tingling sensation.",
      "The lower per-serving cost likely reflects lighter dosing on beta-alanine and betaine, plus no citrulline at all, versus premium-tier fully-dosed pre-workouts."
    ],
    servings: 30,
    priceRange: "$",
    flavorsNote: "Comes in fruit-candy flavors like Blue Raspberry, Fruit Punch, Watermelon, and Melon Hwachae, sweetened with sucralose and acesulfame potassium.",
    affiliateUrl: "https://www.amazon.com/s?k=MusclePharm+Assault+Pre+Workout&tag=YOURTAG-20",
    blurb: "A fully-disclosed, no-blend budget pre-workout at roughly a dollar a serving or less, pairing a moderate-high 250mg caffeine dose with 3g creatine in an 11.5g scoop, though its beta-alanine and betaine doses sit toward the lower end of what's typically studied.",
    labelVerified: "July 2026",
    imageUrl: "images/products/musclepharm-assault.png",
    images: [
      "https://musclepharm.com/cdn/shop/files/Assault_Fruit_Punch-hero.jpg?v=1770132738&width=1200",
      "https://musclepharm.com/cdn/shop/files/MP-Assault-AMZ-StackedTiles-FruitPunch-04-updated_e6ea778c-1383-47cf-bd58-952552b4c0f6.jpg?v=1770132738",
      "https://musclepharm.com/cdn/shop/files/MP-Assault-AMZ-StackedTiles-BlueRasp-02-updated_dac633f5-f17a-4439-9cf7-d727345936c3.jpg?v=1770132738",
      "https://musclepharm.com/cdn/shop/files/MP-Assault-AMZ-StackedTiles-Watermelon-02-updted_3e0c99ae-2b07-4382-b6e6-64dc2f6c27d5.jpg?v=1770132738"
    ],
    sources: [
      {
        url: "https://musclepharm.com/products/assault-1",
        label: "MusclePharm official product page"
      },
      {
        url: "https://www.muscleandstrength.com/store/musclepharm-assault-sport.html",
        label: "Muscle & Strength label transcription (11.5g scoop, 30 servings)"
      },
      {
        url: "https://barbend.com/musclepharm-assault-pre-workout-review/",
        label: "Barbend review (2026)"
      }
    ]
  },
  {
    id: "cbum-thavage",
    name: "Thavage",
    brand: "Raw Nutrition (CBUM Series)",
    category: "pre-workout",
    accentColor: "#b8952f",
    stimFree: false,
    badges: [
      "High Stim",
      "Fully Disclosed Label"
    ],
    caffeineMg: 305,
    keyIngredients: [
      {
        name: "Caffeine (260 mg anhydrous + 64 mg di-caffeine malate)",
        dose: "305 mg total",
        clinicalNote: "A high combined dose at the full two-scoop serving, well above the ~200mg used in most single-dose caffeine studies; the di-caffeine malate portion contributes roughly 45mg of the total and is marketed as a slower-releasing form."
      },
      {
        name: "L-Citrulline",
        dose: "6 g",
        clinicalNote: "Within the 6-8g range shown to support nitric-oxide-driven blood flow and pump in citrulline research."
      },
      {
        name: "Beta-Alanine",
        dose: "3.2 g",
        clinicalNote: "Matches the ~3.2g daily dose used in most beta-alanine muscle-carnosine loading studies."
      },
      {
        name: "Nitrosigine",
        dose: "1.5 g",
        clinicalNote: "Matches the 1.5g dose used in Nitrosigine's published pump and cognitive-performance research."
      }
    ],
    cautions: [
      "305mg caffeine is the full two-scoop (26.8g) dose; one scoop (13.4g) provides roughly half that for those titrating up.",
      "High combined stimulant load that also includes 100mg bitter orange extract (6% synephrine) on top of the caffeine; not recommended for caffeine-sensitive users.",
      "3.2g beta-alanine may cause a temporary tingling sensation."
    ],
    servings: 20,
    priceRange: "$$$",
    flavorsNote: "Offered in a large rotating flavor lineup (Dragon Fruit, Sour Watermelon, Lemonade, Cherry Lime Slush, Cotton Candy Grape, and more), sweetened with sucralose and acesulfame potassium rather than stevia.",
    affiliateUrl: "https://www.amazon.com/s?k=CBUM+Thavage+Pre+Workout&tag=YOURTAG-20",
    blurb: "Chris Bumstead's flagship pre-workout delivers a high 305mg caffeine dose at the full two-scoop serving alongside research-aligned doses of citrulline, beta-alanine, and Nitrosigine, with no proprietary blends, though the tub's 40 scoops only cover 20 full sessions.",
    labelVerified: "July 2026",
    imageUrl: "images/products/cbum-thavage.png",
    images: [
      "https://cdn.shopify.com/s/files/1/0932/3141/5614/files/thavage-dragon_fruit.webp?v=1767970668",
      "https://getrawnutrition.com/cdn/shop/files/Thav-DragonFruit-SFP.png?v=1745895577",
      "https://getrawnutrition.com/cdn/shop/files/RAWSignatureThavagePreWorkout-CottonCandyGrape.png?v=1780623259",
      "https://getrawnutrition.com/cdn/shop/files/RAWSignatureThavagePreWorkout-CherryLimeSlush-WhiteBottle.png?v=1778770803"
    ],
    sources: [
      {
        url: "https://getrawnutrition.com/products/cbum-series-thavage-pre-workout",
        label: "Raw Nutrition official product page"
      },
      {
        url: "https://www.bulldognutrition.com/products/cbum-thavage-pre-workout",
        label: "Retailer label transcription (305mg caffeine breakdown)"
      },
      {
        url: "https://www.getyokd.com/products/raw-nutrition-thavage-pre-workout",
        label: "Get Yok'd full panel transcription (260mg anhydrous + 64mg di-caffeine malate, 40 scoops / 20 full servings)"
      },
      {
        url: "https://barbend.com/cbum-thavage-pre-workout-review/",
        label: "Barbend review (2026)"
      },
      {
        url: "https://blog.priceplow.com/supplement-news/raw-nutrition-cbum-thavage-pre-workout",
        label: "PricePlow coverage"
      }
    ]
  },
  {
    id: "outlift-clinical",
    name: "Outlift Clinical",
    brand: "Nutrex Research",
    category: "pre-workout",
    accentColor: "#3f7fa6",
    stimFree: false,
    badges: [
      "High Stim",
      "Fully Disclosed Label"
    ],
    caffeineMg: 380,
    keyIngredients: [
      {
        name: "Caffeine (300 mg anhydrous + 80 mg InnovaTea natural caffeine)",
        dose: "380 mg total",
        clinicalNote: "One of the highest doses found in a mainstream pre-workout; well above the 200-300mg range used in most caffeine-and-performance studies, so it's worth accounting for other caffeine intake that day."
      },
      {
        name: "L-Citrulline",
        dose: "8 g",
        clinicalNote: "At the top of the 6-8g range shown to support pump and blood flow in citrulline research."
      },
      {
        name: "Beta-Alanine",
        dose: "3.2 g",
        clinicalNote: "Matches the ~3.2g daily dose used in most beta-alanine muscle-carnosine loading studies."
      },
      {
        name: "Creatine Monohydrate",
        dose: "3 g",
        clinicalNote: "Matches the standard 3-5g daily maintenance dose used in creatine research."
      }
    ],
    cautions: [
      "380mg caffeine per 28g scoop is roughly 4 cups of coffee in a single serving; among the highest stimulant doses of any mainstream pre-workout, and the label directs no more than one serving in 24 hours.",
      "3.2g beta-alanine may cause a temporary tingling sensation.",
      "Caffeine is split on the label between 300mg caffeine anhydrous and 80mg of a tea-derived (InnovaTea) source rather than coming from one ingredient."
    ],
    servings: 22,
    priceRange: "$$",
    flavorsNote: "Comes in tropical/fruit flavors like Miami Vice, Fruit Punch, and Blueberry Lemonade, sweetened with sucralose and acesulfame potassium.",
    affiliateUrl: "https://www.amazon.com/s?k=Nutrex+Outlift+Clinical+Pre+Workout&tag=YOURTAG-20",
    blurb: "One of the highest-caffeine mainstream pre-workouts at 380mg per 28g scoop, fully dosed and disclosed with 8g citrulline, 3.2g beta-alanine, and 3g creatine, but the stimulant load alone makes it a poor fit for anyone caffeine-sensitive.",
    labelVerified: "July 2026",
    imageUrl: "images/products/outlift-clinical.png",
    images: [
      "https://nutrex.com/cdn/shop/files/Outlift-Clinical-MV-FR_grande.png?v=1758820161",
      "https://cdn.shopify.com/s/files/1/0556/9750/6368/files/outlift-clinical-aplus-01.jpg",
      "https://cdn.shopify.com/s/files/1/0556/9750/6368/files/FRUIT-PUNCH-OUTLIFT.png",
      "https://cdn.shopify.com/s/files/1/0556/9750/6368/files/MIAMI-VICE-OUTLIFT.png"
    ],
    sources: [
      {
        url: "https://nutrex.com/products/outlift-pre-workout",
        label: "Nutrex official product page"
      },
      {
        url: "https://www.muscleandstrength.com/store/outlift-clinical.html",
        label: "Muscle & Strength label transcription"
      },
      {
        url: "https://www.bestpricenutrition.com/nutrex-research-outlift-clinical-22-servings/",
        label: "Best Price Nutrition panel transcription (28g scoop, 380mg total caffeine)"
      },
      {
        url: "https://www.stack3d.com/2024/04/nutrex-outlift-clinical/",
        label: "Stack3d coverage of the current reformulation"
      },
      {
        url: "https://barbend.com/nutrex-outlift-pre-workout-review/",
        label: "Barbend review (2026)"
      }
    ]
  },
  {
    id: "nutrabio-pre",
    name: "PRE",
    brand: "NutraBio",
    category: "pre-workout",
    accentColor: "#E08A3E",
    stimFree: false,
    badges: [
      "High Stim",
      "Fully Disclosed Label"
    ],
    caffeineMg: 350,
    keyIngredients: [
      {
        name: "L-Citrulline",
        dose: "10 g",
        clinicalNote: "Above the 6-8 g range used in most citrulline pump-and-endurance studies."
      },
      {
        name: "Beta-Alanine",
        dose: "3.2 g",
        clinicalNote: "Matches the roughly 3.2 g daily dose shown to reduce muscular fatigue in beta-alanine research."
      },
      {
        name: "Caffeine (Anhydrous + Infinergy di-caffeine malate)",
        dose: "350 mg",
        clinicalNote: "Total caffeine from a mix of fast-acting anhydrous and slower-releasing Infinergy di-caffeine malate; sits well above the roughly 200 mg used in most acute performance-caffeine studies."
      },
      {
        name: "Betaine Anhydrous",
        dose: "1.5 g",
        clinicalNote: "Below the 2.5 g daily betaine dose used in power-output research on its own, though the label's total betaine reaches about 2.5 g once the betaine nitrate is counted."
      }
    ],
    cautions: [
      "350 mg caffeine is roughly three to four cups of coffee in a single scoop; not a beginner dose.",
      "3.2 g beta-alanine commonly causes a harmless temporary skin-tingling sensation (paresthesia).",
      "The 2025 formula is a large roughly 30 g scoop that stacks nitrates, alpha-GPC and vincamine on top of the stimulants, so it introduces far more active ingredients at once than a simpler pre-workout."
    ],
    servings: 20,
    priceRange: "$$$",
    flavorsNote: "Sold in five candy-forward flavors (Blue Razz, Lemon Burst, Wild Watermelon, Paradise Punch, Orange Mango Tango); this stimulant version is artificially sweetened, while NutraBio's separate Natural PRE line uses stevia instead.",
    affiliateUrl: "https://www.amazon.com/s?k=NutraBio+PRE+Pre+Workout&tag=YOURTAG-20",
    blurb: "One of the few pre-workouts that discloses every ingredient at its exact dose rather than blends; the 2025 formula pairs 350 mg of caffeine with 10 g of citrulline, both at or above typical study doses.",
    labelVerified: "July 2026",
    imageUrl: "images/products/nutrabio-pre.png",
    images: [
      "https://nutrabio.com/cdn/shop/files/22004_4182bee2-1e49-45d3-a194-19e5ce41cca0.png",
      "https://nutrabio.com/cdn/shop/files/22004_1.png",
      "https://nutrabio.com/cdn/shop/files/22004_2.jpg"
    ],
    sources: [
      {
        url: "https://nutrabio.com/products/pre-workout",
        label: "NutraBio – official PRE product page"
      },
      {
        url: "https://nutrabio.com/cdn/shop/files/22004_1.png",
        label: "Official Supplement Facts panel photo (NutraBio CDN)"
      },
      {
        url: "https://supplementwarehouse.com/nutrabio-pre-workout-20-servings/",
        label: "Supplement Warehouse – NutraBio PRE listing (independent cross-check)"
      },
      {
        url: "https://stack3d.com/2025/02/nutrabio-2025-pre.html",
        label: "Stack3d – 2025 NutraBio PRE reformulation breakdown (independent cross-check)"
      }
    ]
  },
  {
    id: "axe-sledge-intake",
    name: "Intake",
    brand: "Axe & Sledge Supplements",
    category: "pre-workout",
    accentColor: "#C23B4D",
    stimFree: false,
    badges: [
      "High Stim",
      "Fully Disclosed Label"
    ],
    caffeineMg: 300,
    keyIngredients: [
      {
        name: "L-Citrulline",
        dose: "8 g",
        clinicalNote: "Squarely within the 6-8 g range shown to support pumps and reduce fatigue in citrulline research."
      },
      {
        name: "Beta-Alanine",
        dose: "3.2 g",
        clinicalNote: "Matches the roughly 3.2 g daily dose used in most beta-alanine endurance studies."
      },
      {
        name: "Caffeine (Anhydrous + ZümXR extended-release)",
        dose: "300 mg",
        clinicalNote: "250 mg fast-acting plus 50 mg extended-release; well above the roughly 200 mg used in most acute performance-caffeine studies."
      },
      {
        name: "Betaine Anhydrous",
        dose: "2.5 g",
        clinicalNote: "In line with the 2.5 g per day dose used in power-output research."
      }
    ],
    cautions: [
      "The label doses at both 1 scoop and 2 scoops; the 300 mg caffeine, 8 g citrulline, and 3.2 g beta-alanine figures above are the full 2-scoop serving the brand markets as one dose, so a single scoop halves every number and the same tub is sold as either 20 or 40 servings.",
      "300 mg caffeine is roughly three cups of coffee at the full 2-scoop dose; the brand itself tells new users to start with one scoop.",
      "3.2 g beta-alanine can cause a harmless tingling (paresthesia) sensation."
    ],
    servings: 20,
    priceRange: "$$$",
    flavorsNote: "Offered in six candy- and dessert-inspired flavors (Cluster Candies, Deadlifts & Gummy Bears, Sour Peach Rings, Fruit Kaboom, Melon Pop, Apple Pie Moonshine), sweetened with sucralose.",
    affiliateUrl: "https://www.amazon.com/s?k=Axe+Sledge+Intake+Pre+Workout&tag=YOURTAG-20",
    blurb: "Fully disclosed all-in-one formula dosed for both a 1-scoop and 2-scoop serving; at the full 2-scoop dose, caffeine (300 mg), citrulline (8 g), and beta-alanine (3.2 g) all land at or above typical research amounts.",
    labelVerified: "July 2026",
    imageUrl: "images/products/axe-sledge-intake.png",
    images: [
      "https://axeandsledge.com/cdn/shop/files/Intake_80af80da-6d54-43ff-a2d3-b4c07a866041.png",
      "https://axeandsledge.com/cdn/shop/files/Intake_SFP_Fruit_Kaboom_dcad3006-fd52-479d-ac4c-8aba8c618738_2048x2048.jpg",
      "https://axeandsledge.com/cdn/shop/files/Intake-4.jpg",
      "https://axeandsledge.com/cdn/shop/files/Intake-MP_29b8a4b3-a830-4b8f-bd7f-0d3fe0957a73.png"
    ],
    sources: [
      {
        url: "https://axeandsledge.com/products/intake-pre-workout",
        label: "Axe & Sledge – official Intake product page"
      },
      {
        url: "https://axeandsledge.com/cdn/shop/files/Intake_SFP_Fruit_Kaboom_dcad3006-fd52-479d-ac4c-8aba8c618738_2048x2048.jpg",
        label: "Official Supplement Facts panel photo (Axe & Sledge CDN)"
      },
      {
        url: "https://www.stack3d.com/2024/02/axe-and-sledge-intake-pre-workout.html",
        label: "Stack3d – Intake formula breakdown (independent cross-check)"
      },
      {
        url: "https://nutricartel.com/products/intake-pre-workout",
        label: "NutriCartel – Intake listing with per-serving doses (independent cross-check)"
      }
    ]
  },
  {
    id: "jnx-the-curse",
    name: "The Curse!",
    brand: "JNX Sports",
    category: "pre-workout",
    accentColor: "#2E86AB",
    stimFree: false,
    badges: [
      "Moderate Stim",
      "Budget Pick",
      "Proprietary Blend"
    ],
    caffeineMg: 155,
    keyIngredients: [
      {
        name: "Caffeine Anhydrous",
        dose: "155 mg",
        clinicalNote: "A moderate single-scoop dose, roughly one to two cups of coffee; on the lower end for a stimulant pre-workout."
      },
      {
        name: "Energizing Muscle Fuel Blend (Beta-Alanine, Creatine Monohydrate, Citric Acid)",
        dose: "3,000 mg (blend)",
        clinicalNote: "Proprietary blend; the individual beta-alanine and creatine amounts aren't disclosed, so neither can be confirmed against the roughly 3.2 g beta-alanine or 3-5 g creatine doses used in most research."
      },
      {
        name: "Amplifier Blend (L-Citrulline, L-Arginine Alpha-Ketoglutarate)",
        dose: "900 mg (blend)",
        clinicalNote: "Well under the 6-8 g of citrulline alone used in most pump research; the proprietary format hides how much of the 900 mg is citrulline versus arginine AKG."
      }
    ],
    cautions: [
      "Two proprietary blends (Energizing Muscle Fuel Blend and Amplifier Blend) hide the individual beta-alanine, creatine, citrulline, and arginine AKG amounts.",
      "All figures above are per single 5.1 g scoop; the label allows up to 3 scoops, which would triple the caffeine to about 465 mg.",
      "Beta-alanine (undisclosed dose within the blend) may cause a harmless tingling sensation if dosed near typical study levels."
    ],
    servings: 50,
    priceRange: "$",
    flavorsNote: "One of the largest flavor lineups in the category, with about 17 options (Blue Raspberry, Green Apple, Watermelon, Fruit Punch, Dark Grape, Pina Colada, Mango Chili and more), sweetened with sucralose and acesulfame potassium.",
    affiliateUrl: "https://www.amazon.com/s?k=JNX+Sports+The+Curse+Pre+Workout&tag=YOURTAG-20",
    blurb: "A long-running budget bestseller that still relies on two proprietary blends, so exact beta-alanine, creatine, and citrulline doses aren't disclosed; the 155 mg caffeine figure is directly confirmed on the label and sits at the low-moderate end for the category.",
    labelVerified: "July 2026",
    imageUrl: "images/products/jnx-the-curse.png",
    images: [
      "https://www.jnxsports.com/cdn/shop/files/JNX_Sports_The_Curse_Pre-workout_Blue_Raspberry_50_Serve_Bottle_Front_9ca480ca-8ec6-43e3-8af4-5ba8cac0310f_1200x1200_crop_center.png?v=1773957723",
      "https://www.jnxsports.com/cdn/shop/files/The_Curse_Pre-Workout.jpg",
      "https://www.jnxsports.com/cdn/shop/files/The_Curse_4d8316b4-f223-499f-9b0d-96a911307166_420x.jpg"
    ],
    sources: [
      {
        url: "https://www.jnxsports.com/products/the-curse-pre-workout",
        label: "JNX Sports – official The Curse! product page"
      },
      {
        url: "https://www.jnxsports.com/cdn/shop/files/The_Curse_Pre-Workout.jpg",
        label: "Official Supplement Facts panel photo (JNX Sports CDN)"
      },
      {
        url: "https://jackedgorilla.com/the-curse-pre-workout-review/",
        label: "Jacked Gorilla – The Curse! review with label breakdown (independent cross-check)"
      },
      {
        url: "https://www.allstarhealth.com/f/jnx_sports-the_curse_pre_workout.htm",
        label: "AllStarHealth – full Supplement Facts transcription (independent cross-check)"
      }
    ]
  },
  {
    id: "superhuman-pre",
    name: "SuperHuman Pre",
    brand: "Alpha Lion",
    category: "pre-workout",
    accentColor: "#caa14b",
    stimFree: false,
    badges: [
      "High Stim",
      "Fully Disclosed Label"
    ],
    caffeineMg: 311,
    keyIngredients: [
      {
        name: "L-Citrulline",
        dose: "4 g",
        clinicalNote: "A solid dose of straight (non-malate) L-citrulline; most pump studies use 6-8g of citrulline malate, which is roughly 3-4g of actual citrulline, so this lands in a comparable active range."
      },
      {
        name: "Beta-Alanine",
        dose: "3.2 g",
        clinicalNote: "Within the 3.2-6.4g/day range shown to raise muscle carnosine over time; commonly causes a harmless skin-tingling sensation at this dose."
      },
      {
        name: "Betaine Anhydrous",
        dose: "2.5 g",
        clinicalNote: "At the 2.5g dose used in most published betaine power-output research."
      },
      {
        name: "Taurine",
        dose: "1 g",
        clinicalNote: "A common supportive dose; most taurine research uses 1-6g, so this sits at the low end of that range."
      }
    ],
    cautions: [
      "The panel's footnote gives a total caffeine yield of 311mg per full 1-scoop (16.3g) serving from three sources: 275mg caffeine anhydrous, 30mg zumXR extended-release caffeine and 20mg zumXR delayed-release caffeine — roughly three cups of coffee.",
      "The same panel also lists a half-scoop column (8.2g, 42 servings per tub) at half of every dose shown here, so check which column a retailer is quoting.",
      "3.2g beta-alanine commonly causes a harmless tingling (paresthesia) sensation."
    ],
    servings: 21,
    priceRange: "$$$",
    flavorsNote: "Six flavors (Hulk Juice, Unicorn Juice, Orange Gainsicle, Miami Vice, Grapezilla, Lion's Blood) sweetened with sucralose and acesulfame potassium; the panel checked here lists FD&C Blue #1 and FD&C Yellow #5 for color.",
    affiliateUrl: "https://www.amazon.com/s?k=Alpha+Lion+SuperHuman+Pre+Workout&tag=YOURTAG-20",
    blurb: "A genuinely fully-disclosed label with a strong 4g citrulline and 3.2g beta-alanine dose. The three-part SXT caffeine system yields 311mg per scoop, but 275mg of that is plain caffeine anhydrous — only 50mg comes from the extended and delayed-release zumXR forms, so it is mostly one strong hit rather than a gentle sustained curve.",
    labelVerified: "July 2026",
    imageUrl: "images/products/superhuman-pre.png",
    images: [
      "https://www.alphalion.com/cdn/shop/files/sh-pre-hulk-juice-icon-bogo-offer.png",
      "https://www.alphalion.com/cdn/shop/files/SH-Pre_SupplementFacts_62a7395a-3a08-400c-8d15-cf7279af661c.png",
      "https://www.alphalion.com/cdn/shop/files/SH_PRE_-_HULK_JUICE_BACK.png"
    ],
    sources: [
      {
        url: "https://www.alphalion.com/products/superhuman-pre-workout",
        label: "Alpha Lion — official SuperHuman Pre product page and supplement facts panel"
      },
      {
        url: "https://www.priceplow.com/alpha-lion/superhuman",
        label: "PricePlow — Alpha Lion SuperHuman label analysis"
      },
      {
        url: "https://www.garagegymreviews.com/superhuman-pre-workout-review",
        label: "Garage Gym Reviews — SuperHuman Pre-Workout Review (2026)"
      }
    ]
  },
  {
    id: "mr-hyde-signature",
    name: "Mr. Hyde Signature V2",
    brand: "ProSupps",
    category: "pre-workout",
    accentColor: "#5468b8",
    stimFree: false,
    badges: [
      "Moderate Stim",
      "Fully Disclosed Label"
    ],
    caffeineMg: 200,
    keyIngredients: [
      {
        name: "L-Citrulline",
        dose: "3 g",
        clinicalNote: "Below the 6-8g citrulline malate range used in most pump-focused studies, but a moderate dose of straight L-citrulline."
      },
      {
        name: "Creatine Monohydrate",
        dose: "2.5 g",
        clinicalNote: "Close to the 3g/day maintenance dose used in creatine research; consistent daily use matters more than pre-workout timing for creatine's effects."
      },
      {
        name: "Beta-Alanine",
        dose: "2 g",
        clinicalNote: "At the low end of the 3.2-6.4g/day range shown to raise muscle carnosine, but still enough to cause tingling for many users."
      },
      {
        name: "Betaine Anhydrous",
        dose: "1 g",
        clinicalNote: "Below the 2.5g dose used in most published betaine power-output studies."
      }
    ],
    cautions: [
      "Every dose listed here is the 1-scoop (12.62g) column; the panel prints a second 2-scoop column that doubles everything, including 400mg of caffeine.",
      "200mg caffeine per 1-scoop serving is roughly two cups of coffee.",
      "2g beta-alanine may cause a harmless tingling (paresthesia) sensation."
    ],
    servings: 30,
    priceRange: "$",
    flavorsNote: "Four flavors (Blue Razz, Fruit Punch, Pixie Dust, Watermelon) sweetened with sucralose and acesulfame potassium; color comes from blue spirulina extract, beet root powder, or fruit and vegetable juice depending on flavor, not synthetic dyes.",
    affiliateUrl: "https://www.amazon.com/s?k=ProSupps+Mr+Hyde+Signature+Pre+Workout&tag=YOURTAG-20",
    blurb: "The V2 relaunch is a short, blend-free list — 3g citrulline, 2.5g creatine monohydrate, 2g beta-alanine, 1g betaine, 1g tyrosine and 200mg caffeine anhydrous in a 12.62g scoop. It is a cleaner and more moderate label than the older Nitrosigine/TeaCrine Mr. Hyde Signature that many retailers still list.",
    labelVerified: "July 2026",
    imageUrl: "images/products/mr-hyde-signature.png",
    images: [
      "https://prosupps.com/cdn/shop/files/Mr-Hyde-Signature-Variant-Blue-Razz_f895ed40-d6b2-41de-b098-c75500d06949.png",
      "https://prosupps.com/cdn/shop/files/mr-hyde-signature-30-serve-sfp.png",
      "https://prosupps.com/cdn/shop/files/Mr-Hyde-Signature-V2-Variant-Fruit-Punch_aa237825-613f-4e40-8f4e-bff05c192cd7.png"
    ],
    sources: [
      {
        url: "https://prosupps.com/products/mr-hyde-signature/",
        label: "ProSupps — official Mr. HYDE Signature product page (resolves to V2)"
      },
      {
        url: "https://prosupps.com/products/mr-hyde-signature-v2",
        label: "ProSupps — Mr. HYDE Signature V2 page, 12.62g scoop and 200mg caffeine"
      },
      {
        url: "https://www.amazon.com/PROSUPPS-Mr-Hyde-Pre-Workout-Powder-Creatine/dp/B0F4MJ6GSP",
        label: "Amazon — ProSupps Mr. Hyde Signature V2, Blue Razz, 30 servings"
      },
      {
        url: "https://www.amazon.com/ProSupps-Signature-Workout-Creatine-Caffeine/dp/B0FWNM21SL",
        label: "Amazon — ProSupps Mr. Hyde Signature V2, Watermelon, 30 servings"
      }
    ]
  },
  {
    id: "engn-shred",
    name: "ENGN Shred",
    brand: "Evlution Nutrition",
    category: "pre-workout",
    accentColor: "#c1503f",
    stimFree: false,
    badges: [
      "High Stim",
      "Proprietary Blend"
    ],
    caffeineMg: 260,
    keyIngredients: [
      {
        name: "Beta-Alanine",
        dose: "1.6 g",
        clinicalNote: "Below the 3.2g+ doses used in most carnosine-loading studies; likely to produce a milder tingling effect than a full dose."
      },
      {
        name: "L-Carnitine L-Tartrate",
        dose: "500 mg",
        clinicalNote: "Matches doses used in some exercise-recovery research, though oral carnitine's fat-oxidation evidence in trained individuals is mixed."
      },
      {
        name: "Yohimbe Extract",
        dose: "40 mg",
        clinicalNote: "Yohimbine content isn't standardized on this label; combined with the caffeine blend, this adds meaningfully to the overall stimulant load."
      },
      {
        name: "Red Pepper Fruit Extract (Capsimax)",
        dose: "25 mg",
        clinicalNote: "A standardized capsaicinoid dose in line with amounts used in thermogenic research."
      }
    ],
    cautions: [
      "The 260mg figure is the total weight of the 'ENGN Energizers' proprietary blend (natural caffeine from coffee bean plus green tea extract), not a pure-caffeine number — actual caffeine is somewhat under 260mg and is not broken out on the label.",
      "Contains 40mg yohimbe extract on top of the caffeine blend; sensitive users may feel a stronger stimulant response than the caffeine number alone suggests.",
      "1.6g beta-alanine may cause mild tingling (paresthesia); all doses are per 1 scoop (7.9g), 30 scoops per tub."
    ],
    servings: 30,
    priceRange: "$$",
    flavorsNote: "Four flavors (Cherry Limeade, Blue Raz, Pink Lemonade, Fruit Punch) sweetened with sucralose and acesulfame potassium and colored with FD&C dyes; the Cherry Limeade panel checked here lists FD&C Red 40.",
    affiliateUrl: "https://www.amazon.com/s?k=Evlution+Nutrition+ENGN+Shred+Pre+Workout&tag=YOURTAG-20",
    blurb: "A budget-leaning fat-loss stack (L-carnitine, Capsimax, yohimbe) built on a 260mg proprietary caffeine-and-green-tea energizer blend, so the exact caffeine dose isn't independently confirmable from the label alone.",
    labelVerified: "July 2026",
    imageUrl: "images/products/engn-shred.png",
    images: [
      "https://m.media-amazon.com/images/I/61p2J5qpraL._AC_SL1500_.jpg",
      "https://www.evlnutrition.com/cdn/shop/files/ENGN-SHRED-30SERV-CL_1.jpg",
      "https://www.evlnutrition.com/cdn/shop/files/SFP-ENGN-SHRED-30SERV-CL.jpg",
      "https://www.evlnutrition.com/cdn/shop/files/ENGN-SHRED-30SERV-BR_1_404df98a-7e67-4165-8625-e961750a737f.jpg"
    ],
    sources: [
      {
        url: "https://www.evlnutrition.com/products/engn-shred-pre-workout-engine-powder-30-serving",
        label: "Evlution Nutrition — official ENGN Shred product page and supplement facts panel"
      },
      {
        url: "https://barbend.com/evlution-nutritons-engn-shred-pre-workout-review/",
        label: "BarBend — Evlution Nutrition's ENGN Shred Pre-Workout Review"
      },
      {
        url: "https://www.priceplow.com/evlution-nutrition/engn-shred",
        label: "PricePlow — EVL ENGN Shred label and pricing"
      },
      {
        url: "https://www.stack3d.com/2017/01/engn-shred.html",
        label: "Stack3d — ENGN Shred ingredient breakdown (260mg energizer blend, 40mg yohimbe, 25mg Capsimax)"
      }
    ]
  },
  {
    id: "nutricost-pre-x-xtreme",
    name: "Pre-X Xtreme",
    brand: "Nutricost",
    category: "pre-workout",
    accentColor: "#3d7ea6",
    stimFree: false,
    badges: [
      "High Stim",
      "Fully Disclosed Label",
      "Budget Pick"
    ],
    caffeineMg: 300,
    keyIngredients: [
      {
        name: "L-Citrulline",
        dose: "4 g",
        clinicalNote: "A solid dose of straight L-citrulline, at or above amounts used in blood-flow and pump research."
      },
      {
        name: "Beta-Alanine",
        dose: "2 g",
        clinicalNote: "Below the 3.2-6.4g/day range used in carnosine-loading studies, but still likely to cause tingling in most users."
      },
      {
        name: "Nitrosigine",
        dose: "1.5 g",
        clinicalNote: "Matches the 1.5g dose used in Nitrosigine's published nitric-oxide and blood-flow research."
      },
      {
        name: "Taurine",
        dose: "2 g",
        clinicalNote: "A generous supportive dose within the 1-6g range used in taurine performance research."
      }
    ],
    cautions: [
      "300mg caffeine anhydrous per 1-scoop (17g) serving is roughly three cups of coffee, and the panel uses a single serving basis with no multi-scoop column.",
      "2g beta-alanine commonly causes a tingling (paresthesia) sensation.",
      "Label instructs users not to exceed one scoop in any 24-hour period and not to consume more than 400mg of caffeine from all sources in 24 hours."
    ],
    servings: 30,
    priceRange: "$",
    flavorsNote: "Five flavors (Blue Raspberry, Watermelon, Fruit Punch, Grape, Peach Mango) sweetened with sucralose; the Blue Raspberry panel checked here uses blue spirulina for color rather than a synthetic dye, and colorings vary by flavor.",
    affiliateUrl: "https://www.amazon.com/s?k=Nutricost+Pre-X+Xtreme+Pre+Workout&tag=YOURTAG-20",
    blurb: "A fully-disclosed, blend-free label with generous citrulline, taurine, and Nitrosigine doses plus a straightforward 300mg caffeine anhydrous kick, at one of the lowest costs per serving in this set.",
    labelVerified: "July 2026",
    imageUrl: "images/products/nutricost-pre-x-xtreme.png",
    images: [
      "https://nutricost.com/cdn/shop/files/NTC_PRE-X_BlueRaspberry_30SERV_25OZ_Front_Square.jpg",
      "https://nutricost.com/cdn/shop/files/NTC_PRE-X_BlueRaspberry_30SERV_25OZ_SFP_Square.jpg"
    ],
    sources: [
      {
        url: "https://nutricost.com/products/nutricost-pre-workout-complex-powder-30-servings",
        label: "Nutricost — official Pre-X Xtreme product page and supplement facts panel"
      },
      {
        url: "https://generationiron.com/nutricost-pre-x-extreme-review/",
        label: "Generation Iron — Nutricost Pre-X Xtreme Pre-Workout Review"
      },
      {
        url: "https://www.walmart.com/ip/Nutricost-Pre-X-Xtreme-Pre-Workout-Complex-Powder-Fruit-Punch-30-Servings-Vegetarian-Non-GMO-and-Gluten-Free/669639027",
        label: "Walmart — Nutricost Pre-X Xtreme 30-serving listing"
      },
      {
        url: "https://www.amazon.com/Nutricost-Pre-Workout-Complex-Powder-Raspberry/dp/B07XF23GK3",
        label: "Amazon — Nutricost Pre-X Xtreme Blue Raspberry, 30 servings"
      }
    ]
  },
  {
    id: "kaged-pre-kaged-stim-free",
    name: "Pre-Kaged Stim-Free",
    brand: "Kaged",
    category: "pre-workout",
    accentColor: "#2E6E7E",
    stimFree: true,
    badges: [
      "Stim-Free",
      "Fully Disclosed Label"
    ],
    caffeineMg: 0,
    keyIngredients: [
      {
        name: "L-Citrulline",
        dose: "6.5 g",
        clinicalNote: "Sits within the 6-8 g range used in most citrulline pump studies."
      },
      {
        name: "BetaPower Betaine Anhydrous",
        dose: "2.5 g",
        clinicalNote: "Matches the roughly 2.5 g/day dose used in betaine power-output research."
      },
      {
        name: "CarnoSyn Beta-Alanine",
        dose: "1.6 g",
        clinicalNote: "Below the ~3.2 g/day beta-alanine studies typically use for endurance benefits; a lighter single-scoop dose."
      },
      {
        name: "Creatine HCl",
        dose: "1.5 g",
        clinicalNote: "A soluble creatine salt; most creatine research uses 3-5 g of monohydrate, so gram-for-gram creatine content here is lower than a standard monohydrate serving."
      }
    ],
    cautions: [
      "Beta-alanine (1.6 g) may cause a harmless skin-tingling sensation.",
      "Creatine HCl dose is lower in absolute creatine content than a standard 5 g monohydrate serving.",
      "Informed-Sport certified and batch-tested for banned substances, relevant for tested athletes."
    ],
    servings: 20,
    priceRange: "$$$",
    flavorsNote: "Comes in Fruit Punch and Cherry Bomb, naturally flavored with no artificial colors.",
    affiliateUrl: "https://www.amazon.com/s?k=kaged+pre-kaged+stim-free+pre-workout&tag=YOURTAG-20",
    blurb: "Nearly the same pump and endurance dosing as the caffeinated Pre-Kaged, just without caffeine; Informed-Sport certification stands out for tested athletes, though the 1.6 g beta-alanine dose runs lighter than what most endurance research uses.",
    labelVerified: "July 2026",
    imageUrl: "images/products/kaged-pre-kaged-stim-free.png",
    images: [
      "https://www.kaged.com/cdn/shop/files/PWSF-Front-FP_d974f24a-c87b-4a3a-87e6-278f3048886d.png?v=1774411180&width=1200",
      "https://www.kaged.com/cdn/shop/files/PW-SF-Supplements-CherryBomb.jpg?v=1774411180&width=1600",
      "https://www.kaged.com/cdn/shop/files/PWSF-Front-CB_f818fefe-070c-4780-a3c5-e05ed0d0e6ff.png?v=1774411180&width=1200"
    ],
    sources: [
      {
        url: "https://www.kaged.com/products/pre-kaged-stim-free",
        label: "Kaged official product page"
      },
      {
        url: "https://blog.priceplow.com/supplement-news/kaged-muscle-stim-free-pre-kaged",
        label: "PricePlow: Kaged Muscle Stim-Free Pre-Kaged"
      },
      {
        url: "https://www.vitacost.com/kaged-pre-kaged-stim-free-pre-workout-informed-sport-certified-fruit-punch",
        label: "Vitacost retailer listing (label cross-check)"
      },
      {
        url: "https://torokhtiy.com/blogs/review/pre-kaged-stim-free-review",
        label: "Torokhtiy: Pre-Kaged Stim-Free review (independent 27.9 g single-scoop panel)"
      }
    ]
  },
  {
    id: "nutrabio-pre-stim-free",
    name: "Stim-Free PRE",
    brand: "NutraBio",
    category: "pre-workout",
    accentColor: "#A13D3D",
    stimFree: true,
    badges: [
      "Stim-Free",
      "Fully Disclosed Label"
    ],
    caffeineMg: 0,
    keyIngredients: [
      {
        name: "L-Citrulline",
        dose: "10 g",
        clinicalNote: "Above the 6-8 g range used in most citrulline pump studies."
      },
      {
        name: "Beta-Alanine",
        dose: "3.2 g",
        clinicalNote: "Matches the ~3.2 g/day dose used in beta-alanine endurance research; expect tingles."
      }
    ],
    cautions: [
      "Beta-alanine (3.2 g) is likely to cause a harmless skin-tingling sensation.",
      "Fully disclosed label with no proprietary blends; every dose is printed on the panel.",
      "The formula was revised recently, so older listings still circulate 8 g citrulline and 2.5 g beta-alanine figures from the previous label."
    ],
    servings: 20,
    priceRange: "$$$",
    flavorsNote: "Available in Blue Razz, Orange Mango Tango, Paradise Punch, Lemon Burst, and Wild Watermelon.",
    affiliateUrl: "https://www.amazon.com/s?k=nutrabio+stim-free+pre+workout&tag=YOURTAG-20",
    blurb: "A fully disclosed, no-proprietary-blend label built on a heavy 10 g citrulline dose and a full 3.2 g of beta-alanine, with no stimulants at all.",
    labelVerified: "July 2026",
    imageUrl: "images/products/nutrabio-pre-stim-free.png",
    images: [
      "https://nutrabio.com/cdn/shop/files/22008.png?v=1744637742&width=1200",
      "https://nutrabio.com/cdn/shop/files/22005.png?v=1744637742&width=1200"
    ],
    sources: [
      {
        url: "https://nutrabio.com/products/pre-workout-stimulant-free",
        label: "NutraBio official product page"
      },
      {
        url: "https://www.priceplow.com/nutrabio/pre-stim-free",
        label: "PricePlow: NutraBio PRE Stim-Free"
      },
      {
        url: "https://www.exaltednutritionzanesville.com/products/nutrabio-pre-stim-free",
        label: "Exalted Nutrition retailer listing (independent dose cross-check)"
      },
      {
        url: "https://nutricartel.com/products/nutrabio-stim-free-pre-workout",
        label: "NutriCartel retailer listing (flavor and serving cross-check)"
      }
    ]
  },
  {
    id: "genius-pre",
    name: "Genius Pre",
    brand: "The Genius Brand",
    category: "pre-workout",
    accentColor: "#4C8C6B",
    stimFree: true,
    badges: [
      "Stim-Free",
      "Fully Disclosed Label"
    ],
    caffeineMg: 0,
    keyIngredients: [
      {
        name: "Citrulline Malate",
        dose: "6 g",
        clinicalNote: "At the lower end of the 6-8 g range used in most citrulline pump studies, using the malate form rather than plain L-citrulline."
      },
      {
        name: "AlphaSize Alpha-GPC",
        dose: "600 mg",
        clinicalNote: "Within the 300-600 mg range used in cognitive and power-output research on alpha-GPC."
      },
      {
        name: "Theobromine",
        dose: "30 mg",
        clinicalNote: "A small fraction of the 100-250 mg doses studied for theobromine's mild vasodilatory and stimulant-like effects."
      }
    ],
    cautions: [
      "Theobromine (30 mg) is a mild stimulant chemically related to caffeine, so this isn't fully stimulant-free even though caffeine content is zero.",
      "Also contains beta-alanine and betaine, which can cause a harmless skin-tingling sensation; their gram doses are not consistently reported across sources, so they are omitted here.",
      "Citrulline malate (6 g) sits at the bottom of the typical research range rather than above it, so pump support is modest."
    ],
    servings: 20,
    priceRange: "$$$",
    flavorsNote: "Available in Grape Limeade, Sour Apple, Blue Raspberry, and Sour Cherry, with no artificial colors, flavors, or sweeteners.",
    affiliateUrl: "https://www.amazon.com/s?k=genius+pre+caffeine-free+pre-workout&tag=YOURTAG-20",
    blurb: "One of the few caffeine-free pre-workouts built around theobromine and Alpha-GPC instead of a caffeine analog; the 6 g citrulline malate dose sits at the bottom of the typical research range, so pump support is more modest than fully-dosed competitors.",
    labelVerified: "July 2026",
    imageUrl: "images/products/genius-pre.png",
    images: [
      "https://thegeniusbrand.com/cdn/shop/files/genius-pre-grappe-limade_57fb6db0-3d74-4e21-9ac7-494db5c62a53.png?v=1767885503&width=1200",
      "https://thegeniusbrand.com/cdn/shop/files/genius-pre-blue-rasperry_f9492372-3e08-4aa3-9752-57ce4614490b.png?v=1767885503&width=1200",
      "https://thegeniusbrand.com/cdn/shop/files/Genius_Pre_Workout_Supplement2.jpg?v=1767885503&width=1200",
      "https://thegeniusbrand.com/cdn/shop/files/Genius_Pre_Workout_Supplement3.jpg?v=1767885503&width=1200"
    ],
    sources: [
      {
        url: "https://thegeniusbrand.com/products/genius-pre",
        label: "The Genius Brand official product page"
      },
      {
        url: "https://www.garagegymreviews.com/genius-pre-workout-review",
        label: "Garage Gym Reviews: Genius Pre-Workout Review (2026)"
      },
      {
        url: "https://barbend.com/genius-pre-workout-review/",
        label: "BarBend: The Genius Brand's Preworkout Review"
      },
      {
        url: "https://www.adamkempfitness.com/genius-brand-supplement-review/",
        label: "Adam Kemp Fitness: Genius Brand review (independent dose cross-check)"
      }
    ]
  },
  {
    id: "bloom-high-energy-preworkout",
    name: "High Energy Pre-Workout",
    brand: "Bloom Nutrition",
    category: "pre-workout",
    accentColor: "#8f7fc7",
    stimFree: false,
    badges: [
      "Moderate Stim",
      "Proprietary Blend"
    ],
    caffeineMg: 220,
    keyIngredients: [
      {
        name: "Performance Blend (L-Citrulline Malate, L-Citrulline, Beta Alanine, Beet Root Extract)",
        dose: "4.68 g blend",
        clinicalNote: "This is a proprietary blend — the label discloses a combined 4.68g weight but not each ingredient's individual amount, so the citrulline and beta-alanine doses can't be compared to the amounts used in published pump or endurance studies."
      },
      {
        name: "Green Tea Leaf Extract (Caffeine)",
        dose: "220 mg caffeine",
        clinicalNote: "The only stimulant amount printed on the panel; roughly two cups of coffee worth of caffeine, sourced from green tea rather than synthetic anhydrous caffeine."
      },
      {
        name: "Clean Energy & Focus Blend (L-Tyrosine, L-Theanine, Rhodiola, Asian Ginseng, Huperzia serrata)",
        dose: "1.26 g blend (includes the 220 mg caffeine above)",
        clinicalNote: "Beyond the disclosed caffeine figure, the remainder of the 1.26g is split among five more ingredients with no individual doses listed, so their contribution can't be judged against research amounts."
      }
    ],
    cautions: [
      "220mg caffeine (about two cups of coffee) sits inside a 1.26g proprietary blend; the other blend ingredients (tyrosine, theanine, rhodiola, ginseng, huperzia) have no individual doses disclosed.",
      "The 4.68g Performance Blend contains an undisclosed beta-alanine amount, so tingling/flushing intensity is unpredictable.",
      "Sweetened with sucralose and acesulfame potassium, not sugar."
    ],
    servings: 30,
    priceRange: "$$",
    flavorsNote: "Available in flavors such as Sour Peach Ring, Raspberry Lemonade, Sour Gummy, and Bahama Mama, sweetened with sucralose and acesulfame potassium rather than sugar.",
    affiliateUrl: "https://www.amazon.com/s?k=Bloom+Nutrition+High+Energy+Pre+Workout&tag=YOURTAG-20",
    blurb: "Markets itself as a clean, women-founded pre-workout, but two proprietary blends mean 220mg is the only active-ingredient amount disclosed on the label — the citrulline, beta-alanine, and beet root amounts are folded into an undisclosed 4.68g blend.",
    labelVerified: "July 2026",
    imageUrl: "images/products/bloom-high-energy-preworkout.png",
    images: [
      "https://bloomnu.com/cdn/shop/files/HE_0004_30ct_HEPWO_SourPeachRing_Shopify_a9782b99-56ff-4b1b-a83b-998808a5262a.jpg",
      "https://bloomnu.com/cdn/shop/files/Web_SuppFacts_HEPWO_SourPeachRing.jpg",
      "https://bloomnu.com/cdn/shop/files/hepwo-spr-2.jpg",
      "https://bloomnu.com/cdn/shop/files/BloomHEPWO_SPR_shopify_03.png"
    ],
    sources: [
      {
        url: "https://bloomnu.com/products/preworkout",
        label: "Bloom Nutrition — High Energy Pre-Workout (official product page)"
      },
      {
        url: "https://bloomnu.com/cdn/shop/files/Web_SuppFacts_HEPWO_SourPeachRing.jpg",
        label: "Official Supplement Facts panel image (Sour Peach Ring, 1 scoop 8.3g, 30 servings)"
      },
      {
        url: "https://www.amazon.com/Bloom-Nutrition-Workout-Tyrosine-Caffeine/dp/B0C7KP8DKL",
        label: "Amazon listing cross-check (Sour Gummy, 30 servings)"
      },
      {
        url: "https://www.workoutsupplementsreview.com/bloom-high-energy-pre-workout-review-caffeine/",
        label: "Independent third-party label transcription (220mg caffeine, 4,675mg and 1,262.5mg blends)"
      }
    ]
  },
  {
    id: "naked-energy-preworkout",
    name: "Naked Energy",
    brand: "Naked Nutrition",
    category: "pre-workout",
    accentColor: "#c9a227",
    stimFree: false,
    badges: [
      "Moderate Stim",
      "Fully Disclosed Label"
    ],
    caffeineMg: 200,
    keyIngredients: [
      {
        name: "CarnoSyn Beta-Alanine",
        dose: "2 g per 2-scoop serving",
        clinicalNote: "Within the 2-6g range used in beta-alanine endurance studies; may produce a temporary tingling sensation at this dose."
      },
      {
        name: "Creatine Monohydrate",
        dose: "1 g per 2-scoop serving",
        clinicalNote: "Well below the standard 3-5g daily creatine dose used in strength research — more of a token addition than a loading or maintenance amount."
      },
      {
        name: "L-Arginine (as AjiPure)",
        dose: "1 g per 2-scoop serving",
        clinicalNote: "Arginine has lower oral bioavailability than citrulline for raising blood arginine levels; 1g is modest next to the multi-gram amounts used in blood-flow research."
      },
      {
        name: "Natural Caffeine (from unroasted coffee beans)",
        dose: "200 mg per 2-scoop serving",
        clinicalNote: "Roughly two cups of coffee worth of stimulant, fully disclosed as a standalone ingredient rather than folded into a blend."
      }
    ],
    cautions: [
      "The serving size is 2 scoops, not 1 — every dose here, including the 200mg caffeine (about two cups of coffee), assumes the full two-scoop serving; a single scoop delivers half of each amount.",
      "2g beta-alanine may cause a temporary tingling or flushing sensation.",
      "Creatine (1g) and arginine (1g) are both well below typical standalone dosing, so this shouldn't replace a dedicated creatine or pump product."
    ],
    servings: 50,
    priceRange: "$",
    flavorsNote: "Sold in three options — Unflavored, Fruit Punch, and Citrus — with the brand stating no artificial sweeteners, flavors, or colors in any version; the 50-serving count applies to the unflavored tub.",
    affiliateUrl: "https://www.amazon.com/s?k=Naked+Energy+Pre+Workout+Naked+Nutrition&tag=YOURTAG-20",
    blurb: "An NSF-certified, vegan pre-workout with a fully disclosed label — 200mg caffeine and 2g beta-alanine do most of the work, while the 1g each of creatine and arginine are token doses; note that every number is per 2-scoop serving.",
    labelVerified: "July 2026",
    imageUrl: "images/products/naked-energy-preworkout.png",
    images: [
      "https://nakednutrition.com/cdn/shop/files/ENERGY-1_3LB-Unflavored-MainImage.png",
      "https://nakednutrition.com/cdn/shop/files/ENERGY-1_3LB-Unflavored-Graphic.jpg",
      "https://nakednutrition.com/cdn/shop/files/vegan-unflavored-pre-workout-supplement.jpg"
    ],
    sources: [
      {
        url: "https://nakednutrition.com/products/pre-workout-powder",
        label: "Naked Nutrition — Naked Energy (official product page)"
      },
      {
        url: "https://nakednutrition.com/cdn/shop/files/ENERGY-1_3LB-Unflavored-Graphic.jpg",
        label: "Official product graphic (Unflavored, 50 servings, 2g beta-alanine / 1g creatine / 1g arginine)"
      },
      {
        url: "https://www.amazon.com/Naked-Energy-Friendly-Unflavored-Sweeteners/dp/B071ZDD3HL",
        label: "Amazon listing cross-check (NSF Certified, Unflavored, 50 servings)"
      },
      {
        url: "https://feastgood.com/naked-energy-review/",
        label: "FeastGood independent review confirming the 2-scoop serving size (100 scoops per 50-serving tub)"
      },
      {
        url: "https://www.garagegymreviews.com/equipment/naked-nutrition-naked-energy-pre-workout",
        label: "Garage Gym Reviews independent review (4.8g serving, three flavors: Unflavored, Fruit Punch, Citrus)"
      }
    ]
  },
  {
    id: "nutricost-pre-a",
    name: "Pre-Workout Complex",
    brand: "Nutricost",
    category: "pre-workout",
    accentColor: "#3a6ea5",
    stimFree: false,
    badges: [
      "Moderate Stim",
      "Fully Disclosed Label",
      "Budget Pick"
    ],
    caffeineMg: 200,
    keyIngredients: [
      {
        name: "L-Citrulline",
        dose: "4 g",
        clinicalNote: "Below the 6-8g of citrulline malate typically used in pump research, though this is straight L-citrulline rather than the malate form, which changes the gram-for-gram comparison."
      },
      {
        name: "Beta-Alanine",
        dose: "2 g",
        clinicalNote: "About half the 3.2-6.4g daily amount used in beta-alanine loading studies; still enough at this dose to produce the characteristic tingling."
      },
      {
        name: "Nitrosigine (Inositol-Stabilized Arginine Silicate)",
        dose: "750 mg",
        clinicalNote: "Half the 1,500mg daily amount used in most of Nitrosigine's published blood-flow research, though 750mg has appeared in some single-dose studies."
      },
      {
        name: "Caffeine Anhydrous",
        dose: "200 mg",
        clinicalNote: "Roughly two cups of coffee worth of stimulant."
      }
    ],
    cautions: [
      "200mg caffeine (about two cups of coffee) from a single 13g scoop; the label instructs not to exceed 1 scoop in any 24-hour period.",
      "2g beta-alanine may cause a temporary tingling or flushing sensation.",
      "Also stacks 100mg theobromine, 150mg DMAE bitartrate, 100mg Alpha GPC and 200mcg huperzine A alongside the caffeine — additional stimulant-adjacent and nootropic compounds beyond caffeine alone."
    ],
    servings: 60,
    priceRange: "$",
    flavorsNote: "Available in seven flavors — Blue Raspberry, Fruit Punch, Peach Mango, Strawberry Margarita, Watermelon Candy, Cotton Candy, and Strawberry Kiwi — sweetened with sucralose, in both 30-serving and 60-serving tubs.",
    affiliateUrl: "https://www.amazon.com/s?k=Nutricost+Pre+Workout+Complex&tag=YOURTAG-20",
    blurb: "A fully disclosed, no-proprietary-blend label at one of the lowest per-serving prices in the category — every dose from 4g citrulline to 200mg caffeine is printed in exact milligrams rather than hidden in a blend.",
    labelVerified: "July 2026",
    imageUrl: "images/products/nutricost-pre-a.png",
    images: [
      "https://nutricost.com/cdn/shop/files/NTC_PRE-APeachMango_60SERV_46OZ_Front_Square_1200x1200.jpg",
      "https://nutricost.com/cdn/shop/files/NTC_PRE-APeachMango_60SERV_46OZ_SFP_Square_1200x1200.jpg",
      "https://nutricost.com/cdn/shop/files/NTC_PRE-APeachMango_60SERV_46OZ_RecUse_Square_1200x1200.jpg"
    ],
    sources: [
      {
        url: "https://nutricost.com/products/pre-a",
        label: "Nutricost — Pre-Workout Complex (official product page, seven flavors, 30 and 60 serving sizes)"
      },
      {
        url: "https://nutricost.com/cdn/shop/files/NTC_PRE-APeachMango_60SERV_46OZ_SFP_Square_1200x1200.jpg",
        label: "Official Supplement Facts panel image (Peach Mango, 1 scoop 13g, 60 servings)"
      },
      {
        url: "https://www.amazon.com/Nutricost-Pre-Workout-Complex-Powder-Servings/dp/B0CNKV9TX2",
        label: "Amazon listing cross-check (Peach Mango, 60 servings)"
      },
      {
        url: "https://www.amazon.com/Nutricost-Pre-Workout-Complex-Servings-Raspberry/dp/B0CNKW7KFB",
        label: "Amazon listing cross-check, Blue Raspberry 60 servings (independent confirmation of 200mg caffeine)"
      }
    ]
  },
  {
    id: "pump-n-grow",
    name: "Pump-N-Grow",
    brand: "Anabolic Warfare",
    category: "pre-workout",
    accentColor: "#4a8f89",
    stimFree: true,
    badges: [
      "Stim-Free",
      "Fully Disclosed Label"
    ],
    caffeineMg: 0,
    keyIngredients: [
      {
        name: "L-Citrulline Malate 3:1",
        dose: "4 g",
        clinicalNote: "Below the 6-8g of citrulline malate typically used in nitric-oxide pump research, though still a meaningful non-stimulant pump dose on its own."
      },
      {
        name: "Betaine Anhydrous",
        dose: "2 g",
        clinicalNote: "Matches the 2.5g-per-day amount most often used in betaine performance research fairly closely; the largest single dose on this panel after citrulline."
      },
      {
        name: "Beta Alanine",
        dose: "1.5 g",
        clinicalNote: "Below the 3.2-6.4g daily loading protocol used in beta-alanine research; still enough to cause mild tingling in sensitive users."
      },
      {
        name: "Nitrosigine (Inositol-Stabilized Arginine Silicate)",
        dose: "500 mg",
        clinicalNote: "At the low end of Nitrosigine's published dosing; most of its vasodilation research uses 1,500mg per day."
      }
    ],
    cautions: [
      "Stimulant-free — 0mg caffeine, so it can be stacked with a separate stim product or used later in the day.",
      "1.5g beta-alanine may cause a mild tingling or flushing sensation.",
      "The panel lists six actives in total from a single 12.3g scoop; the two not shown above are 1g L-arginine pyroglutamate and 1g highly branched cyclic dextrin (Cluster Dextrin)."
    ],
    servings: 30,
    priceRange: "$$",
    flavorsNote: "Available in flavors such as Ballistic Berry Lemonade, Fruit Explosion, and Operation OJ, sweetened with sucralose.",
    affiliateUrl: "https://www.amazon.com/s?k=Anabolic+Warfare+Pump+N+Grow&tag=YOURTAG-20",
    blurb: "A caffeine-free pump specialist meant for stacking with a separate stimulant — the label fully discloses all six actives, led by 4g citrulline malate, 2g betaine, 1.5g beta-alanine, and 500mg Nitrosigine.",
    labelVerified: "July 2026",
    imageUrl: "images/products/pump-n-grow.png",
    images: [
      "https://cdn.shopify.com/s/files/1/0068/1925/0235/files/11.25x4.25_AWPUMPBBL_150.125.02_v1.2_Render.png",
      "https://cdn.shopify.com/s/files/1/0068/1925/0235/files/11.25x4.25_AWPUMPBBL_150.125.01_v1.2_SFP_7825a51b-371e-4ef0-b04d-23b5153e27b1.jpg",
      "https://cdn.shopify.com/s/files/1/0068/1925/0235/files/11.25x4.25_AWPUMPBBL_150.125.02_v1.2_Render_benefts.png"
    ],
    sources: [
      {
        url: "https://anabolicwarfare.defynedbrands.com/products/pump-n-grow",
        label: "Anabolic Warfare — Pump-N-Grow (official product page)"
      },
      {
        url: "https://cdn.shopify.com/s/files/1/0068/1925/0235/files/11.25x4.25_AWPUMPBBL_150.125.01_v1.2_SFP_7825a51b-371e-4ef0-b04d-23b5153e27b1.jpg",
        label: "Official Supplement Facts panel image (Ballistic Berry Lemonade, 1 scoop 12.3g, 30 servings, six actives)"
      },
      {
        url: "https://cdn.shopify.com/s/files/1/0068/1925/0235/files/11.25x4.25_AWPUMPFEX_150.032.03_v1.2_SFP.jpg",
        label: "Official Supplement Facts panel image, Fruit Explosion flavor (cross-check confirming identical formulation)"
      },
      {
        url: "https://www.amazon.com/Pump-N-Grow-Boosting-Supplement-Anabolic-Warfare/dp/B07SJWMLFK",
        label: "Amazon listing cross-check (Au Naturel, 30 servings)"
      },
      {
        url: "https://supp.co/products/anabolic-warfare-pump-n-grow-operation-oj-812575034850",
        label: "SuppCo independent label listing (Operation OJ, 30 servings) confirming all six ingredient doses"
      }
    ]
  },

  /* ---- creatine (label-verified July 2026) ---- */

  {
    "id": "on-micronized-creatine",
    "name": "Micronized Creatine Powder",
    "brand": "Optimum Nutrition",
    "category": "creatine",
    "stimFree": true,
    "badges": [
      "Fully Disclosed Label",
      "Beginner Friendly"
    ],
    "caffeineMg": 0,
    "keyIngredients": [
      {
        "name": "Creatine Monohydrate",
        "dose": "5 g",
        "clinicalNote": "One of the most-researched supplement ingredients, studied for supporting muscle strength, power output, and the body's ATP energy recycling during short, high-intensity efforts."
      },
      {
        "name": "Micronized processing",
        "dose": "5 g",
        "clinicalNote": "Micronization shrinks the particle size so the powder disperses more easily in liquid; the creatine itself is unchanged."
      }
    ],
    "cautions": [
      "Draws water into muscle — drink more water",
      "Loading phases are optional; 3–5 g daily reaches saturation in about 4 weeks",
      "Talk to your doctor if you have kidney conditions"
    ],
    "servings": 60,
    "priceRange": "$$",
    "flavorsNote": "Mostly sold unflavored; a Blueberry Lemonade flavored version also exists.",
    "affiliateUrl": "https://www.amazon.com/s?k=optimum+nutrition+micronized+creatine&tag=YOURTAG-20",
    "blurb": "The default single-ingredient monohydrate from the biggest name in the category, micronized for easier mixing and labeled banned-substance tested.",
    "labelVerified": "July 2026",
    "metrics": {
      "creatineG": 5,
      "form": "monohydrate"
    },
    "sources": [
      {
        "url": "https://www.optimumnutrition.com/en-us/products/creatine-monohydrate-micronized-powder",
        "label": "Optimum Nutrition product page"
      }
    ]
  },

  {
    "id": "thorne-creatine",
    "name": "Creatine",
    "brand": "Thorne",
    "category": "creatine",
    "stimFree": true,
    "badges": [
      "Third-Party Tested",
      "Fully Disclosed Label"
    ],
    "caffeineMg": 0,
    "keyIngredients": [
      {
        "name": "Creatine Monohydrate",
        "dose": "5 g",
        "clinicalNote": "Studied for supporting the regeneration of ATP, the energy currency used during short-duration, high-intensity activity, and for supporting cellular energy metabolism in muscle."
      },
      {
        "name": "Micronized creatine monohydrate",
        "dose": "5 g",
        "clinicalNote": "Micronized for improved dissolution in water; the label lists creatine monohydrate as the sole ingredient with no sweeteners or fillers."
      }
    ],
    "cautions": [
      "Draws water into muscle — drink more water",
      "Talk to your doctor if you have kidney conditions"
    ],
    "servings": 90,
    "priceRange": "$$",
    "flavorsNote": "Unflavored powder with no sweeteners; dissolves cleanly in water or a shake.",
    "affiliateUrl": "https://www.amazon.com/s?k=thorne+creatine&tag=YOURTAG-20",
    "blurb": "Plain 5 g monohydrate with NSF Certified for Sport screening, aimed at athletes subject to drug testing.",
    "labelVerified": "July 2026",
    "metrics": {
      "creatineG": 5,
      "form": "monohydrate"
    },
    "sources": [
      {
        "url": "https://store.mayoclinic.com/thorne-creatine-nsf-certified.html",
        "label": "Mayo Clinic Store listing"
      },
      {
        "url": "https://thefeed.com/products/thorne-creatine",
        "label": "The Feed listing"
      }
    ]
  },

  {
    "id": "nutricost-creatine-monohydrate",
    "name": "Creatine Monohydrate",
    "brand": "Nutricost",
    "category": "creatine",
    "stimFree": true,
    "badges": [
      "Budget Pick",
      "Fully Disclosed Label"
    ],
    "caffeineMg": 0,
    "keyIngredients": [
      {
        "name": "Creatine Monohydrate",
        "dose": "5 g",
        "clinicalNote": "Studied for supporting muscle strength and power alongside resistance training by helping recycle ATP during brief, intense efforts."
      },
      {
        "name": "Micronized powder",
        "dose": "5 g",
        "clinicalNote": "Micronized creatine monohydrate with no additives or fillers listed; brand states independent lab testing of finished product."
      }
    ],
    "cautions": [
      "Draws water into muscle — drink more water",
      "Loading phases are optional; 3–5 g daily reaches saturation in about 4 weeks",
      "Talk to your doctor if you have kidney conditions"
    ],
    "servings": 100,
    "priceRange": "$",
    "flavorsNote": "Unflavored plus a wide flavored range including Blue Raspberry, Fruit Punch, and Watermelon.",
    "affiliateUrl": "https://www.amazon.com/s?k=nutricost+creatine+monohydrate&tag=YOURTAG-20",
    "blurb": "5 g of micronized monohydrate at one of the lowest costs per serving in the category; the 500 g tub holds 100 servings.",
    "labelVerified": "July 2026",
    "metrics": {
      "creatineG": 5,
      "form": "monohydrate"
    },
    "sources": [
      {
        "url": "https://www.target.com/p/nutricost-creatine-monohydrate-powder-500-grams/-/A-89144833",
        "label": "Target listing"
      },
      {
        "url": "https://nutricost.com/products/nutricost-creatine-monohydrate-powder-500-grams",
        "label": "Nutricost product page"
      }
    ]
  },

  {
    "id": "transparent-labs-creatine-hmb",
    "name": "Creatine HMB",
    "brand": "Transparent Labs",
    "category": "creatine",
    "stimFree": true,
    "badges": [
      "Third-Party Tested",
      "Fully Disclosed Label"
    ],
    "caffeineMg": 0,
    "keyIngredients": [
      {
        "name": "Creatine Monohydrate",
        "dose": "5 g",
        "clinicalNote": "The most-studied creatine form, researched for supporting strength, power, and ATP recycling during high-intensity exercise."
      },
      {
        "name": "myHMB (beta-hydroxy beta-methylbutyrate)",
        "dose": "1.5 g",
        "clinicalNote": "A leucine metabolite studied for supporting retention of lean mass during hard training blocks."
      },
      {
        "name": "Vitamin D3",
        "dose": "12.5 mcg (500 IU)",
        "clinicalNote": "Studied for its role in normal muscle function and bone maintenance."
      },
      {
        "name": "BioPerine black pepper extract",
        "dose": "5 mg",
        "clinicalNote": "A standardized black pepper fruit extract studied for supporting absorption of co-ingested nutrients."
      }
    ],
    "cautions": [
      "Draws water into muscle — drink more water",
      "Contains vitamin D — count it toward your total daily intake across supplements",
      "Talk to your doctor if you have kidney conditions"
    ],
    "servings": 30,
    "priceRange": "$$$",
    "flavorsNote": "Thirteen options from Unflavored to Blue Raspberry and Peach Mango, with no artificial sweeteners, colors, or preservatives.",
    "affiliateUrl": "https://www.amazon.com/s?k=transparent+labs+creatine+hmb&tag=YOURTAG-20",
    "blurb": "Pairs a full 5 g of monohydrate with 1.5 g myHMB, vitamin D3, and BioPerine; Informed Choice certified, and priced well above plain monohydrate.",
    "labelVerified": "July 2026",
    "metrics": {
      "creatineG": 5,
      "form": "monohydrate"
    },
    "sources": [
      {
        "url": "https://www.transparentlabs.com/products/creatine-hmb",
        "label": "Transparent Labs product page"
      }
    ]
  },

  {
    "id": "kaged-creatine-hcl",
    "name": "Creatine HCl",
    "brand": "Kaged",
    "category": "creatine",
    "stimFree": true,
    "badges": [
      "Third-Party Tested"
    ],
    "caffeineMg": 0,
    "keyIngredients": [
      {
        "name": "Creatine HCl",
        "dose": "750 mg",
        "clinicalNote": "A hydrochloride salt of creatine studied for high water solubility, which is why the labeled serving is much smaller than a monohydrate scoop."
      },
      {
        "name": "Patented creatine hydrochloride form",
        "dose": "750 mg",
        "clinicalNote": "Creatine itself is studied for supporting ATP recycling during short, intense efforts; the HCl form delivers it in a roughly 1 g scoop."
      }
    ],
    "cautions": [
      "Most long-term saturation research was done on monohydrate, not HCl",
      "Draws water into muscle — drink more water",
      "Talk to your doctor if you have kidney conditions"
    ],
    "servings": 75,
    "priceRange": "$$",
    "flavorsNote": "Unflavored, Fruit Punch, and Lemon Lime; flavored versions use stevia and sucralose, and the plain powder is notably tart.",
    "affiliateUrl": "https://www.amazon.com/s?k=kaged+creatine+hcl&tag=YOURTAG-20",
    "blurb": "750 mg of creatine HCl per roughly 1 g scoop with every batch tested by Informed Sport; also sold in capsule form.",
    "labelVerified": "July 2026",
    "metrics": {
      "creatineG": 0.75,
      "form": "HCl"
    },
    "sources": [
      {
        "url": "https://www.kaged.com/products/creatine-hcl",
        "label": "Kaged product page"
      }
    ]
  },

  {
    "id": "con-cret-creatine-hcl",
    "name": "Con-Cret Creatine HCl",
    "brand": "Con-Cret",
    "category": "creatine",
    "stimFree": true,
    "badges": [
      "Fully Disclosed Label"
    ],
    "caffeineMg": 0,
    "keyIngredients": [
      {
        "name": "Creatine HCl",
        "dose": "750 mg",
        "clinicalNote": "The original concentrated creatine hydrochloride, studied for high solubility that allows sub-gram serving sizes."
      },
      {
        "name": "Single-ingredient formula",
        "dose": "750 mg",
        "clinicalNote": "Creatine is studied for supporting muscle strength and power during repeated high-intensity efforts; this label lists no blends or added performance ingredients."
      }
    ],
    "cautions": [
      "Label suggests scaling servings to body weight — read directions before dosing",
      "Most long-term saturation research was done on monohydrate, not HCl",
      "Talk to your doctor if you have kidney conditions"
    ],
    "servings": 64,
    "priceRange": "$$",
    "flavorsNote": "Unflavored powder plus flavors like Lemon Lime, Raspberry, and Pineapple; capsules are also available.",
    "affiliateUrl": "https://www.amazon.com/s?k=con+cret+creatine+hcl&tag=YOURTAG-20",
    "blurb": "The original 750 mg creatine HCl in 64 or 100-serving tubs, certified vegan, gluten-free, and kosher.",
    "labelVerified": "July 2026",
    "metrics": {
      "creatineG": 0.75,
      "form": "HCl"
    },
    "sources": [
      {
        "url": "https://con-cret.com/products.json?limit=50",
        "label": "CON-CRET brand site product data"
      }
    ]
  },

  {
    "id": "klean-athlete-klean-creatine",
    "name": "Klean Creatine",
    "brand": "Klean Athlete",
    "category": "creatine",
    "stimFree": true,
    "badges": [
      "Third-Party Tested",
      "Fully Disclosed Label"
    ],
    "caffeineMg": 0,
    "keyIngredients": [
      {
        "name": "Creatine Monohydrate",
        "dose": "5 g",
        "clinicalNote": "Studied for supporting muscle strength, performance, and recovery from strenuous exercise by aiding ATP re-synthesis."
      },
      {
        "name": "Single-ingredient formula",
        "dose": "5 g",
        "clinicalNote": "The label lists creatine monohydrate as the only ingredient; the product is gluten-free and vegan."
      }
    ],
    "cautions": [
      "Draws water into muscle — drink more water",
      "Loading phases are optional; 3–5 g daily reaches saturation in about 4 weeks",
      "Talk to your doctor if you have kidney conditions"
    ],
    "servings": 60,
    "priceRange": "$$$",
    "flavorsNote": "Unflavored single-ingredient powder.",
    "affiliateUrl": "https://www.amazon.com/s?k=klean+athlete+klean+creatine&tag=YOURTAG-20",
    "blurb": "Single-ingredient 5 g monohydrate carrying NSF Certified for Sport certification, priced at a premium for the tested-athlete market.",
    "labelVerified": "July 2026",
    "metrics": {
      "creatineG": 5,
      "form": "monohydrate"
    },
    "sources": [
      {
        "url": "https://thefeed.com/products/klean-creatine",
        "label": "The Feed listing"
      }
    ]
  },

  {
    "id": "jacked-factory-creatine-monohydrate",
    "name": "Creatine Monohydrate",
    "brand": "Jacked Factory",
    "category": "creatine",
    "stimFree": true,
    "badges": [
      "Fully Disclosed Label"
    ],
    "caffeineMg": 0,
    "keyIngredients": [
      {
        "name": "Creatine Monohydrate",
        "dose": "5 g",
        "clinicalNote": "Studied for supporting strength, power output, and ATP recycling during short, high-intensity training."
      },
      {
        "name": "Single-ingredient powder",
        "dose": "5 g",
        "clinicalNote": "The label lists 5,000 mg of pure creatine monohydrate per scoop with no other active ingredients."
      }
    ],
    "cautions": [
      "Draws water into muscle — drink more water",
      "Loading phases are optional; 3–5 g daily reaches saturation in about 4 weeks",
      "Talk to your doctor if you have kidney conditions"
    ],
    "servings": 85,
    "priceRange": "$",
    "flavorsNote": "Unflavored, with Blue Raspberry and Peach Mango options in the 85-serving size.",
    "affiliateUrl": "https://www.amazon.com/s?k=jacked+factory+creatine+monohydrate&tag=YOURTAG-20",
    "blurb": "Straight 5 g monohydrate sold in 30, 85, and 200-serving tubs at a low cost per serving.",
    "labelVerified": "July 2026",
    "metrics": {
      "creatineG": 5,
      "form": "monohydrate"
    },
    "sources": [
      {
        "url": "https://jackedfactory.com/products/creatine-monohydrate",
        "label": "Jacked Factory product page"
      }
    ]
  },

  {
    "id": "muscletech-cell-tech",
    "name": "Cell-Tech",
    "brand": "MuscleTech",
    "category": "creatine",
    "stimFree": true,
    "badges": [
      "Proprietary Blend"
    ],
    "caffeineMg": 0,
    "keyIngredients": [
      {
        "name": "Creatine Monohydrate",
        "dose": "5 g",
        "clinicalNote": "Studied for supporting muscle strength and power by aiding ATP re-synthesis during high-intensity efforts."
      },
      {
        "name": "Multi-Stage Carb Blend (maltodextrin, dextrose, and others)",
        "dose": "38 g carbs",
        "clinicalNote": "Fast-digesting carbohydrates studied for supporting post-exercise glycogen replenishment; the insulin response has been studied in relation to creatine uptake."
      },
      {
        "name": "Taurine",
        "dose": "1 g",
        "clinicalNote": "An amino acid studied in relation to cell hydration and exercise performance."
      },
      {
        "name": "Alpha Lipoic Acid",
        "dose": "100 mg",
        "clinicalNote": "A compound studied alongside carbohydrate for supporting nutrient uptake into muscle."
      }
    ],
    "cautions": [
      "38 g of carbohydrate per scoop — account for it in your daily intake",
      "Draws water into muscle — drink more water",
      "Talk to your doctor if you have kidney conditions"
    ],
    "servings": 27,
    "priceRange": "$$$",
    "flavorsNote": "Fruit Punch and Citrus Punch; a sweet, carbohydrate-heavy mix rather than a plain powder.",
    "affiliateUrl": "https://www.amazon.com/s?k=muscletech+cell+tech+creatine&tag=YOURTAG-20",
    "blurb": "A carb-and-creatine recovery formula: 5 g of monohydrate rides on a 38 g multi-stage carb blend plus taurine, alpha lipoic acid, and BCAAs, with a two-scoop option doubling everything.",
    "labelVerified": "July 2026",
    "metrics": {
      "creatineG": 5,
      "form": "blend"
    },
    "sources": [
      {
        "url": "https://www.muscletech.com/products/cell-tech",
        "label": "MuscleTech product page"
      }
    ]
  },

  {
    "id": "now-sports-creatine-monohydrate",
    "name": "Creatine Monohydrate",
    "brand": "NOW Sports",
    "category": "creatine",
    "stimFree": true,
    "badges": [
      "Third-Party Tested",
      "Budget Pick"
    ],
    "caffeineMg": 0,
    "keyIngredients": [
      {
        "name": "Creatine Monohydrate",
        "dose": "5 g",
        "clinicalNote": "Studied as a precursor in the body's ATP energy system, with research on supporting lean mass and performance during short bouts of intense exercise."
      },
      {
        "name": "Single-ingredient powder",
        "dose": "5 g",
        "clinicalNote": "The supplement facts panel lists creatine monohydrate 5 g (5,000 mg) with other ingredients listed as none."
      }
    ],
    "cautions": [
      "Draws water into muscle — drink more water",
      "Loading phases are optional; 3–5 g daily reaches saturation in about 4 weeks",
      "Talk to your doctor if you have kidney conditions"
    ],
    "servings": 200,
    "priceRange": "$",
    "flavorsNote": "Unflavored powder; mixes best in warm liquid.",
    "affiliateUrl": "https://www.amazon.com/s?k=now+sports+creatine+monohydrate&tag=YOURTAG-20",
    "blurb": "Informed Sport and Informed Choice certified 5 g monohydrate at commodity pricing, with about 200 servings in the large tub.",
    "labelVerified": "July 2026",
    "metrics": {
      "creatineG": 5,
      "form": "monohydrate"
    },
    "sources": [
      {
        "url": "https://www.nhc.com/products/creatine-monohydrate-powder-by-now-foods",
        "label": "Natural Healthy Concepts listing"
      },
      {
        "url": "https://supplementfirst.com/products/now-sports-creatine-monohydrate-powder",
        "label": "Supplement First listing"
      }
    ]
  },

  /* ---- eaa (label-verified July 2026) ---- */

  {
    "id": "transparent-labs-intra",
    "name": "Intra",
    "brand": "Transparent Labs",
    "category": "eaa",
    "stimFree": true,
    "badges": [
      "Third-Party Tested",
      "Fully Disclosed Label"
    ],
    "caffeineMg": 0,
    "keyIngredients": [
      {
        "name": "Amino9 EAA blend",
        "dose": "6.7 g",
        "clinicalNote": "Supplies all nine essential amino acids the body cannot make, studied for supporting muscle protein balance around training."
      },
      {
        "name": "Taurine",
        "dose": "2 g",
        "clinicalNote": "Amino acid studied for supporting hydration and endurance during longer sessions."
      },
      {
        "name": "BetaPure betaine anhydrous",
        "dose": "1.25 g",
        "clinicalNote": "Studied for supporting cellular hydration and power output."
      },
      {
        "name": "Coconut water powder",
        "dose": "1 g",
        "clinicalNote": "Natural potassium source that supports fluid balance alongside the 415 mg chelated electrolyte trio."
      }
    ],
    "cautions": [
      "Amino drinks supplement protein intake, not replace it",
      "Leucine, isoleucine, and valine amounts inside the Amino9 blend are not broken out individually"
    ],
    "servings": 30,
    "priceRange": "$$$",
    "flavorsNote": "Fruit flavors sweetened with stevia only, with no artificial sweeteners or colors.",
    "affiliateUrl": "https://www.amazon.com/s?k=transparent+labs+intra+workout&tag=YOURTAG-20",
    "blurb": "Stim-free intra-workout built on 6.7 g of the Amino9 EAA blend plus taurine and betaine, with Informed Choice certification listed on the brand page.",
    "labelVerified": "July 2026",
    "metrics": {
      "eaaG": 6.7,
      "bcaaG": null,
      "leucineG": null
    },
    "sources": [
      {
        "url": "https://www.transparentlabs.com/products/intra-workout",
        "label": "Transparent Labs product page"
      }
    ]
  },

  {
    "id": "momentous-vital-aminos",
    "name": "Vital Aminos",
    "brand": "Momentous",
    "category": "eaa",
    "stimFree": true,
    "badges": [
      "Third-Party Tested",
      "Fully Disclosed Label"
    ],
    "caffeineMg": 0,
    "keyIngredients": [
      {
        "name": "L-Leucine",
        "dose": "2.5 g",
        "clinicalNote": "The essential amino acid most studied for its role in triggering muscle protein synthesis after training."
      },
      {
        "name": "Full EAA spectrum",
        "dose": "5.6 g total",
        "clinicalNote": "All nine essential amino acids, individually dosed on the label, supporting whole-body protein balance."
      },
      {
        "name": "L-Arginine",
        "dose": "525 mg",
        "clinicalNote": "Conditionally essential amino acid involved in nitric oxide production and blood flow."
      }
    ],
    "cautions": [
      "Amino drinks supplement protein intake, not replace it",
      "Contains 40 calories per serving, unlike most zero-calorie amino mixes"
    ],
    "servings": 30,
    "priceRange": "$$$",
    "flavorsNote": "Tropical Punch flavor sweetened with stevia-derived Rebaudioside A and colored with beta-carotene and beet root.",
    "affiliateUrl": "https://www.amazon.com/s?k=momentous+vital+aminos&tag=YOURTAG-20",
    "blurb": "Fully itemized 13-amino panel with 2.5 g leucine and NSF Certified for Sport testing, priced at the premium end of the category.",
    "labelVerified": "July 2026",
    "metrics": {
      "eaaG": 5.6,
      "bcaaG": 3.75,
      "leucineG": 2.5
    },
    "sources": [
      {
        "url": "https://www.livemomentous.com/products/vital-amino",
        "label": "Momentous product page"
      }
    ]
  },

  {
    "id": "thorne-amino-complex",
    "name": "Amino Complex",
    "brand": "Thorne",
    "category": "eaa",
    "stimFree": true,
    "badges": [
      "Third-Party Tested",
      "Fully Disclosed Label"
    ],
    "caffeineMg": 0,
    "keyIngredients": [
      {
        "name": "L-Leucine",
        "dose": "1.25 g",
        "clinicalNote": "The essential amino acid most studied for switching on muscle protein synthesis."
      },
      {
        "name": "EAA spectrum",
        "dose": "3.8 g total",
        "clinicalNote": "All nine essential amino acids individually dosed, supporting protein balance in muscle."
      },
      {
        "name": "L-Lysine",
        "dose": "650 mg",
        "clinicalNote": "Essential amino acid the body uses in building muscle and connective tissue proteins."
      }
    ],
    "cautions": [
      "Doses per amino are lighter than most gym-brand EAA powders",
      "Amino drinks supplement protein intake, not replace it"
    ],
    "servings": 30,
    "priceRange": "$$$",
    "flavorsNote": "Lemon and Berry flavors sweetened with stevia (Rebaudioside A) and colored with fruit and vegetable juice.",
    "affiliateUrl": "https://www.amazon.com/s?k=thorne+amino+complex&tag=YOURTAG-20",
    "blurb": "Clinically oriented EAA profile with 3.8 g of EAAs and 1.25 g leucine per 7.6 g scoop, carrying NSF Certified for Sport status at a premium price.",
    "labelVerified": "July 2026",
    "metrics": {
      "eaaG": 3.8,
      "bcaaG": 2.5,
      "leucineG": 1.25
    },
    "sources": [
      {
        "url": "https://thefeed.com/products/thorne-amino-complex",
        "label": "The Feed product listing"
      },
      {
        "url": "https://www.professionalsupplementcenter.com/amino-complex-by-thorne-research",
        "label": "Professional Supplement Center listing"
      }
    ]
  },

  {
    "id": "ghost-amino-v2",
    "name": "Ghost Amino",
    "brand": "Ghost",
    "category": "eaa",
    "stimFree": true,
    "badges": [
      "Fully Disclosed Label"
    ],
    "caffeineMg": 0,
    "keyIngredients": [
      {
        "name": "BCAA 4:1:1 (leucine-forward)",
        "dose": "4.5 g",
        "clinicalNote": "Delivers 3 g leucine, the amino most tied to muscle protein synthesis signaling in research."
      },
      {
        "name": "Additional EAAs",
        "dose": "5.5 g",
        "clinicalNote": "The six non-BCAA essential amino acids, completing the full spectrum needed for protein balance."
      },
      {
        "name": "Taurine",
        "dose": "2 g",
        "clinicalNote": "Studied for supporting hydration and endurance during training."
      },
      {
        "name": "Raw coconut water powder",
        "dose": "1 g",
        "clinicalNote": "Natural potassium source supporting fluid balance, paired with Aquamin marine minerals."
      }
    ],
    "cautions": [
      "Full label doses are per two-scoop serving; one scoop delivers half",
      "Amino drinks supplement protein intake, not replace it"
    ],
    "servings": 40,
    "priceRange": "$$",
    "flavorsNote": "Licensed and fruit flavors such as Welch's Grape, Mango, and Blue Raspberry, sweetened with sucralose.",
    "affiliateUrl": "https://www.amazon.com/s?k=ghost+amino+v2&tag=YOURTAG-20",
    "blurb": "Full 10 g EAA dose with a 4:1:1 leucine-heavy BCAA core, but that dose takes two scoops, so the 40-scoop tub works out to 20 full servings.",
    "labelVerified": "July 2026",
    "metrics": {
      "eaaG": 10,
      "bcaaG": 4.5,
      "leucineG": 3
    },
    "sources": [
      {
        "url": "https://www.gymsupplements.co.uk/products/ghost-amino-v2-404g",
        "label": "Retailer listing with full supplement facts"
      }
    ]
  },

  {
    "id": "dymatize-all9-amino",
    "name": "All9 Amino",
    "brand": "Dymatize",
    "category": "eaa",
    "stimFree": true,
    "badges": [
      "Beginner Friendly"
    ],
    "caffeineMg": 0,
    "keyIngredients": [
      {
        "name": "Full-spectrum EAAs",
        "dose": "10 g",
        "clinicalNote": "All nine essential amino acids, supporting muscle protein synthesis and whole-body protein balance."
      },
      {
        "name": "BCAAs (leucine, isoleucine, valine)",
        "dose": "7.2 g",
        "clinicalNote": "An unusually large branched-chain share of the total, the trio most studied for muscle recovery."
      },
      {
        "name": "Coconut water fruit powder",
        "dose": "200 mg",
        "clinicalNote": "Small hydration-support addition alongside B vitamins and vitamin C."
      }
    ],
    "cautions": [
      "Individual amino doses beyond the two blend totals are not itemized on the web listings",
      "Amino drinks supplement protein intake, not replace it"
    ],
    "servings": 30,
    "priceRange": "$$",
    "flavorsNote": "Flavors include Juicy Watermelon and Jolly Green Apple, sweetened with sucralose, acesulfame potassium, and stevia.",
    "affiliateUrl": "https://www.amazon.com/s?k=dymatize+all9+amino&tag=YOURTAG-20",
    "blurb": "10 g of all nine EAAs with a BCAA-heavy 7.2 g share per serving; one retailer lists it as discontinued, though the brand storefront still sells five flavors.",
    "labelVerified": "July 2026",
    "metrics": {
      "eaaG": 10,
      "bcaaG": 7.2,
      "leucineG": null
    },
    "sources": [
      {
        "url": "https://dymatize-nutrition.myshopify.com/products/all-9-amino",
        "label": "Dymatize brand storefront"
      },
      {
        "url": "https://www.allstarhealth.com/f/dymatize_nutrition-all_9_amino.htm",
        "label": "AllStarHealth listing"
      }
    ]
  },

  {
    "id": "jacked-factory-eaa-surge",
    "name": "EAA Surge",
    "brand": "Jacked Factory",
    "category": "eaa",
    "stimFree": true,
    "badges": [],
    "caffeineMg": 0,
    "keyIngredients": [
      {
        "name": "Amino9 EAA blend",
        "dose": "6.7 g",
        "clinicalNote": "Clinically studied nine-EAA blend supporting muscle protein balance around training."
      },
      {
        "name": "L-Citrulline malate",
        "dose": "2 g",
        "clinicalNote": "Studied for supporting blood flow and training endurance."
      },
      {
        "name": "Taurine",
        "dose": "2 g",
        "clinicalNote": "Studied for supporting hydration and endurance during longer sessions."
      },
      {
        "name": "Coconut water powder blend",
        "dose": "500 mg",
        "clinicalNote": "Natural potassium source that supports fluid balance."
      }
    ],
    "cautions": [
      "Individual amino amounts inside the Amino9 blend are not disclosed",
      "Amino drinks supplement protein intake, not replace it"
    ],
    "servings": 20,
    "priceRange": "$$",
    "flavorsNote": "Fruit flavors such as Pineapple and Blackberry Lemonade, sweetened with sucralose and acesulfame potassium.",
    "affiliateUrl": "https://www.amazon.com/s?k=jacked+factory+eaa+surge&tag=YOURTAG-20",
    "blurb": "Stim-free intra with 6.7 g Amino9 EAAs plus 2 g each of citrulline malate and taurine; the blend total is disclosed but not each amino, and the tub is only 20 servings.",
    "labelVerified": "July 2026",
    "metrics": {
      "eaaG": 6.7,
      "bcaaG": null,
      "leucineG": null
    },
    "sources": [
      {
        "url": "https://www.muscleandstrength.com/store/eaa-surge.html",
        "label": "Muscle & Strength label listing"
      },
      {
        "url": "https://www.jackedfactory.com/products/eaa-surge",
        "label": "Jacked Factory product page"
      }
    ]
  },

  {
    "id": "nutricost-eaa",
    "name": "EAA Powder",
    "brand": "Nutricost",
    "category": "eaa",
    "stimFree": true,
    "badges": [
      "Budget Pick"
    ],
    "caffeineMg": 0,
    "keyIngredients": [
      {
        "name": "Essential amino acid blend (9 EAAs)",
        "dose": "8 g",
        "clinicalNote": "Provides all nine essential amino acids the body cannot synthesize, supporting whole-body protein balance."
      },
      {
        "name": "Instantized BCAAs (leucine, isoleucine, valine)",
        "dose": "2:1:1 ratio within the 8 g",
        "clinicalNote": "The branched-chain trio studied for its role in muscle protein synthesis and recovery."
      }
    ],
    "cautions": [
      "Per-amino milligram breakdown is printed on the tub but not shown on the brand's web listing",
      "Amino drinks supplement protein intake, not replace it"
    ],
    "servings": 30,
    "priceRange": "$",
    "flavorsNote": "Blue Raspberry, Fruit Punch, Peach Mango, POG, and Unflavored options.",
    "affiliateUrl": "https://www.amazon.com/s?k=nutricost+eaa+powder&tag=YOURTAG-20",
    "blurb": "8 g of all nine EAAs at one of the lowest per-serving costs in the category; batch testing is by ISO-accredited labs rather than a sport-certification program.",
    "labelVerified": "July 2026",
    "metrics": {
      "eaaG": 8,
      "bcaaG": null,
      "leucineG": null
    },
    "sources": [
      {
        "url": "https://nutricost.com/products/nutricost-eaa-powder",
        "label": "Nutricost product page"
      }
    ]
  },

  {
    "id": "xtend-original-bcaa",
    "name": "Xtend Original BCAA",
    "brand": "Xtend",
    "category": "eaa",
    "stimFree": true,
    "badges": [
      "Fully Disclosed Label"
    ],
    "caffeineMg": 0,
    "keyIngredients": [
      {
        "name": "BCAA 2:1:1 blend",
        "dose": "7 g",
        "clinicalNote": "The branched-chain trio studied for supporting muscle recovery and reducing post-training soreness."
      },
      {
        "name": "L-Leucine",
        "dose": "3.5 g",
        "clinicalNote": "The amino acid most directly tied to triggering muscle protein synthesis in research."
      },
      {
        "name": "L-Glutamine",
        "dose": "2.5 g",
        "clinicalNote": "The most abundant free amino acid in muscle tissue, commonly added to recovery formulas."
      },
      {
        "name": "Electrolyte blend",
        "dose": "1.17 g",
        "clinicalNote": "Sodium, potassium, and magnesium to support hydration during sweat loss."
      }
    ],
    "cautions": [
      "BCAA-only formulas lack six of the nine essential amino acids",
      "Amino drinks supplement protein intake, not replace it"
    ],
    "servings": 30,
    "priceRange": "$$",
    "flavorsNote": "Wide fruit-flavor range sweetened with sucralose and acesulfame potassium.",
    "affiliateUrl": "https://www.amazon.com/s?k=xtend+original+bcaa&tag=YOURTAG-20",
    "blurb": "Longtime intra-workout staple with a fully dosed 7 g BCAA panel plus glutamine and citrulline malate, though it covers only three of the nine essential amino acids.",
    "labelVerified": "July 2026",
    "metrics": {
      "eaaG": null,
      "bcaaG": 7,
      "leucineG": 3.5
    },
    "sources": [
      {
        "url": "https://tigerfitness.com/products/xtend-bcaa",
        "label": "Tiger Fitness label listing"
      }
    ]
  },

  {
    "id": "musclepharm-bcaa-312",
    "name": "BCAA 3:1:2",
    "brand": "MusclePharm",
    "category": "eaa",
    "stimFree": true,
    "badges": [
      "Fully Disclosed Label"
    ],
    "caffeineMg": 0,
    "keyIngredients": [
      {
        "name": "L-Leucine",
        "dose": "3 g",
        "clinicalNote": "The essential amino acid most studied for stimulating muscle protein synthesis."
      },
      {
        "name": "L-Valine",
        "dose": "2 g",
        "clinicalNote": "Branched-chain amino acid weighted above isoleucine in this formula's 3:1:2 ratio."
      },
      {
        "name": "L-Isoleucine",
        "dose": "1 g",
        "clinicalNote": "Branched-chain amino acid involved in muscle energy metabolism."
      }
    ],
    "cautions": [
      "BCAA-only formulas lack six of the nine essential amino acids",
      "Amino drinks supplement protein intake, not replace it"
    ],
    "servings": 30,
    "priceRange": "$",
    "flavorsNote": "Blue Raspberry and Fruit Punch flavors sweetened with sucralose.",
    "affiliateUrl": "https://www.amazon.com/s?k=musclepharm+bcaa+3+1+2&tag=YOURTAG-20",
    "blurb": "Budget classic BCAA using an unconventional 3:1:2 ratio that weights valine over isoleucine; like all BCAA-only formulas it omits the six other essential aminos.",
    "labelVerified": "July 2026",
    "metrics": {
      "eaaG": null,
      "bcaaG": 6,
      "leucineG": 3
    },
    "sources": [
      {
        "url": "https://tigerfitness.com/products/musclepharm-bcaa-3-1-2",
        "label": "Tiger Fitness label listing"
      }
    ]
  },

  {
    "id": "optimum-nutrition-amino-energy",
    "name": "Amino Energy",
    "brand": "Optimum Nutrition",
    "category": "eaa",
    "stimFree": false,
    "badges": [
      "Low Stim",
      "Proprietary Blend"
    ],
    "caffeineMg": 100,
    "keyIngredients": [
      {
        "name": "Micronized amino blend",
        "dose": "5 g",
        "clinicalNote": "Proprietary mix of essential aminos plus taurine, glutamine, arginine, and citrulline supporting protein balance and training."
      },
      {
        "name": "Caffeine (green tea and green coffee extracts)",
        "dose": "100 mg",
        "clinicalNote": "Studied for supporting alertness and perceived energy during training."
      }
    ],
    "cautions": [
      "Amino doses sit inside a proprietary blend, so individual amounts are not disclosed",
      "100 mg caffeine per two-scoop serving counts toward daily caffeine intake",
      "Amino drinks supplement protein intake, not replace it"
    ],
    "servings": 30,
    "priceRange": "$$",
    "flavorsNote": "Long flavor list spanning fruit and coffee-shop options, sweetened with sucralose.",
    "affiliateUrl": "https://www.amazon.com/s?k=optimum+nutrition+amino+energy&tag=YOURTAG-20",
    "blurb": "The one caffeinated pick here: 100 mg caffeine with a 5 g proprietary amino blend, making it closer to a light energy drink than a fully dosed EAA product.",
    "labelVerified": "July 2026",
    "metrics": {
      "eaaG": null,
      "bcaaG": null,
      "leucineG": null
    },
    "sources": [
      {
        "url": "https://www.muscleandstrength.com/store/amino-energy.html",
        "label": "Muscle & Strength label listing"
      }
    ]
  },

  /* ---- electrolytes (label-verified July 2026) ---- */

  {
    "id": "lmnt-drink-mix",
    "name": "LMNT Electrolyte Drink Mix",
    "brand": "LMNT",
    "category": "electrolytes",
    "stimFree": true,
    "badges": [
      "Fully Disclosed Label"
    ],
    "caffeineMg": 0,
    "keyIngredients": [
      {
        "name": "Sodium (from salt)",
        "dose": "1000 mg",
        "clinicalNote": "Sodium is the primary electrolyte lost in sweat and is studied for its role in fluid balance during prolonged sweating."
      },
      {
        "name": "Potassium (potassium chloride)",
        "dose": "200 mg",
        "clinicalNote": "Potassium contributes to normal muscle function and works alongside sodium in fluid balance."
      },
      {
        "name": "Magnesium (magnesium malate)",
        "dose": "60 mg",
        "clinicalNote": "Magnesium plays a role in normal muscle and nerve function."
      }
    ],
    "cautions": [
      "1000 mg sodium per serving — significant if you watch sodium intake",
      "Talk to your doctor if you take blood-pressure medication",
      "Formulated for sweat loss, not everyday casual sipping"
    ],
    "servings": 30,
    "priceRange": "$$$",
    "flavorsNote": "Salty-citrus lineup including Citrus Salt, Watermelon Salt, and Raw Unflavored, sweetened with stevia leaf extract.",
    "affiliateUrl": "https://www.amazon.com/s?k=lmnt+electrolyte+drink+mix&tag=YOURTAG-20",
    "blurb": "Sodium-forward design: 1000 mg sodium with zero sugar targets heavy sweat replacement rather than carb-based rehydration.",
    "labelVerified": "July 2026",
    "metrics": {
      "sodiumMg": 1000,
      "potassiumMg": 200,
      "magnesiumMg": 60,
      "sugarG": 0
    },
    "sources": [
      {
        "url": "https://drinklmnt.com/pages/ingredients",
        "label": "LMNT ingredients page (electrolyte amounts per stick)"
      },
      {
        "url": "https://drinklmnt.com/products/lmnt-recharge-electrolyte-drink",
        "label": "LMNT product page (30-stick box, flavors)"
      }
    ]
  },

  {
    "id": "liquid-iv-hydration-multiplier",
    "name": "Hydration Multiplier",
    "brand": "Liquid I.V.",
    "category": "electrolytes",
    "stimFree": true,
    "badges": [
      "Beginner Friendly"
    ],
    "caffeineMg": 0,
    "keyIngredients": [
      {
        "name": "Sodium",
        "dose": "500 mg",
        "clinicalNote": "Sodium is studied for its role in helping the body retain and distribute fluid during sweating."
      },
      {
        "name": "Potassium",
        "dose": "380 mg",
        "clinicalNote": "Potassium contributes to normal muscle function and fluid balance."
      },
      {
        "name": "Cane sugar + dextrose",
        "dose": "11 g",
        "clinicalNote": "Glucose paired with sodium is the classic oral-rehydration-solution approach studied for fluid absorption in the gut."
      }
    ],
    "cautions": [
      "11 g added sugar per stick — this is a sugar-based rehydration design, not a zero-sugar mix",
      "500 mg sodium per serving counts toward daily sodium",
      "Talk to your doctor if you manage blood pressure or blood sugar"
    ],
    "servings": 16,
    "priceRange": "$$$",
    "flavorsNote": "Large flavor range led by Lemon Lime and Passion Fruit, sweetened mainly with cane sugar and dextrose.",
    "affiliateUrl": "https://www.amazon.com/s?k=liquid+iv+hydration+multiplier&tag=YOURTAG-20",
    "blurb": "Sugar-based ORS-style stick: 11 g of sugars alongside 500 mg sodium, the glucose-plus-sodium pairing used in oral rehydration formulas.",
    "labelVerified": "July 2026",
    "metrics": {
      "sodiumMg": 500,
      "potassiumMg": 380,
      "magnesiumMg": 0,
      "sugarG": 11
    },
    "sources": [
      {
        "url": "https://www.myfooddiary.com/foods/7681582/liquid-iv-lemon-lime-hydration-multiplier",
        "label": "Nutrition panel for Lemon Lime Hydration Multiplier"
      },
      {
        "url": "https://www.liquid-iv.com/products/lemon-lime-hydration-multiplier",
        "label": "Liquid I.V. product page (16 sticks per pouch)"
      }
    ]
  },

  {
    "id": "nuun-sport",
    "name": "Nuun Sport",
    "brand": "Nuun",
    "category": "electrolytes",
    "stimFree": true,
    "badges": [
      "Beginner Friendly",
      "Budget Pick"
    ],
    "caffeineMg": 0,
    "keyIngredients": [
      {
        "name": "Sodium",
        "dose": "300 mg",
        "clinicalNote": "Sodium is the main electrolyte lost in sweat and is studied for its role in fluid balance."
      },
      {
        "name": "Potassium",
        "dose": "150 mg",
        "clinicalNote": "Potassium contributes to normal muscle function."
      },
      {
        "name": "Magnesium",
        "dose": "25 mg",
        "clinicalNote": "Magnesium plays a role in normal muscle and nerve function."
      }
    ],
    "cautions": [
      "300 mg sodium per tablet still counts toward daily sodium intake",
      "Talk to your doctor if you manage blood pressure or kidney conditions"
    ],
    "servings": 10,
    "priceRange": "$",
    "flavorsNote": "Ten light, fizzy flavors such as Lemon Lime and Tri-Berry, sweetened with stevia and about 1 g of sugar per tablet.",
    "affiliateUrl": "https://www.amazon.com/s?k=nuun+sport+electrolyte+tablets&tag=YOURTAG-20",
    "blurb": "Low-calorie dissolving-tablet format: 300 mg sodium and 1 g sugar per tablet suits lighter sessions and travel-friendly dosing.",
    "labelVerified": "July 2026",
    "metrics": {
      "sodiumMg": 300,
      "potassiumMg": 150,
      "magnesiumMg": 25,
      "sugarG": 1
    },
    "sources": [
      {
        "url": "https://nuunlife.com/products/nuun-sport",
        "label": "Nuun Sport product page (per-tablet facts, 10 tablets per tube)"
      }
    ]
  },

  {
    "id": "dripdrop-ors",
    "name": "DripDrop ORS Electrolyte Powder",
    "brand": "DripDrop",
    "category": "electrolytes",
    "stimFree": true,
    "badges": [],
    "caffeineMg": 0,
    "keyIngredients": [
      {
        "name": "Sodium (sodium citrate)",
        "dose": "330 mg",
        "clinicalNote": "Sodium is studied for its role in fluid retention and balance during sweat loss."
      },
      {
        "name": "Potassium (potassium citrate)",
        "dose": "185 mg",
        "clinicalNote": "Potassium contributes to normal muscle function and fluid balance."
      },
      {
        "name": "Magnesium (magnesium citrate)",
        "dose": "39 mg",
        "clinicalNote": "Magnesium plays a role in normal muscle function."
      },
      {
        "name": "Zinc",
        "dose": "1.5 mg",
        "clinicalNote": "Zinc contributes to normal immune function and is a common addition in oral rehydration formulas."
      }
    ],
    "cautions": [
      "7 g added sugar per stick is intentional to the ORS-style glucose-sodium design",
      "Talk to your doctor if you manage blood pressure or blood sugar"
    ],
    "servings": 16,
    "priceRange": "$$",
    "flavorsNote": "Sold in Bold and Juicy variety packs (Berry, Watermelon, Lemon, Orange, Fruit Punch and more), each stick carrying 7 g of sugar.",
    "affiliateUrl": "https://www.amazon.com/s?k=dripdrop+ors+electrolyte+powder&tag=YOURTAG-20",
    "blurb": "ORS-style ratio with less sugar than typical sports drinks: 7 g sugar with 330 mg sodium and added zinc per 10 g stick.",
    "labelVerified": "July 2026",
    "metrics": {
      "sodiumMg": 330,
      "potassiumMg": 185,
      "magnesiumMg": 39,
      "sugarG": 7
    },
    "sources": [
      {
        "url": "https://www.hydrationdepot.com/dripdrop-watermelon-electrolyte-powder-sticks-pack-of-100.html",
        "label": "Retailer listing with full nutrition panel per stick"
      },
      {
        "url": "https://dripdrop.com/products/bold-variety-pack-8-16",
        "label": "DripDrop product page (16-stick box)"
      }
    ]
  },

  {
    "id": "gatorlyte-rapid-rehydration",
    "name": "Gatorlyte Rapid Rehydration Electrolyte Beverage Powder",
    "brand": "Gatorade",
    "category": "electrolytes",
    "stimFree": true,
    "badges": [
      "Beginner Friendly"
    ],
    "caffeineMg": 0,
    "keyIngredients": [
      {
        "name": "Sodium",
        "dose": "490 mg",
        "clinicalNote": "Sodium is studied for its role in fluid balance during prolonged sweating."
      },
      {
        "name": "Potassium",
        "dose": "350 mg",
        "clinicalNote": "Potassium contributes to normal muscle function and fluid balance."
      },
      {
        "name": "Magnesium",
        "dose": "105 mg",
        "clinicalNote": "Magnesium plays a role in normal muscle and nerve function."
      }
    ],
    "cautions": [
      "10 g sugar and 490 mg sodium per stick",
      "Talk to your doctor if you take blood-pressure medication"
    ],
    "servings": 6,
    "priceRange": "$$$",
    "flavorsNote": "Flavors include Orange, Strawberry Kiwi, Cherry Lime, and Watermelon, sweetened with sugar at 10 g per stick.",
    "affiliateUrl": "https://www.amazon.com/s?k=gatorlyte+electrolyte+beverage+powder&tag=YOURTAG-20",
    "blurb": "Highest magnesium in this set at 105 mg, with a five-electrolyte blend and a mid-pack 490 mg sodium plus 10 g sugar per stick.",
    "labelVerified": "July 2026",
    "metrics": {
      "sodiumMg": 490,
      "potassiumMg": 350,
      "magnesiumMg": 105,
      "sugarG": 10
    },
    "sources": [
      {
        "url": "https://www.gatorade.com/powders/gatorlyte/orange-single-serve-sticks",
        "label": "Gatorade official Gatorlyte Orange stick page (electrolyte panel)"
      },
      {
        "url": "https://giantfoodstores.com/groceries/product/gatorade-gatorlyte-orange-electrolyte-beverage-powder-sticks-6-ct-3-1-oz-pkg/346804",
        "label": "Retailer listing confirming 6 sticks per box"
      }
    ]
  },

  {
    "id": "transparent-labs-hydrate",
    "name": "Hydrate",
    "brand": "Transparent Labs",
    "category": "electrolytes",
    "stimFree": true,
    "badges": [
      "Third-Party Tested",
      "Fully Disclosed Label"
    ],
    "caffeineMg": 0,
    "keyIngredients": [
      {
        "name": "Sodium",
        "dose": "500 mg",
        "clinicalNote": "Sodium is the primary electrolyte lost in sweat and is studied for its role in fluid balance."
      },
      {
        "name": "Taurine",
        "dose": "1000 mg",
        "clinicalNote": "Taurine is an amino acid studied in the context of cell hydration and muscle function."
      },
      {
        "name": "Organic coconut water powder",
        "dose": "500 mg",
        "clinicalNote": "Coconut water naturally supplies small amounts of potassium and other minerals."
      },
      {
        "name": "Potassium",
        "dose": "250 mg",
        "clinicalNote": "Potassium contributes to normal muscle function and fluid balance."
      }
    ],
    "cautions": [
      "500 mg sodium per serving counts toward daily sodium",
      "Talk to your doctor before use if you are pregnant, nursing, or take medication"
    ],
    "servings": 40,
    "priceRange": "$$",
    "flavorsNote": "Fourteen stevia-sweetened options from Peach Mango to Unflavored, all zero sugar.",
    "affiliateUrl": "https://www.amazon.com/s?k=transparent+labs+hydrate+electrolyte&tag=YOURTAG-20",
    "blurb": "Zero-sugar electrolyte blend that layers 1 g taurine and coconut water powder on a 500 mg sodium base; Informed Choice tested per the brand page.",
    "labelVerified": "July 2026",
    "metrics": {
      "sodiumMg": 500,
      "potassiumMg": 250,
      "magnesiumMg": 50,
      "sugarG": 0
    },
    "sources": [
      {
        "url": "https://www.transparentlabs.com/products/hydrate",
        "label": "Transparent Labs Hydrate product page (supplement facts, Informed Choice)"
      }
    ]
  },

  {
    "id": "ultima-replenisher",
    "name": "Ultima Replenisher Electrolyte Mix",
    "brand": "Ultima",
    "category": "electrolytes",
    "stimFree": true,
    "badges": [
      "Beginner Friendly"
    ],
    "caffeineMg": 0,
    "keyIngredients": [
      {
        "name": "Potassium",
        "dose": "250 mg",
        "clinicalNote": "Potassium contributes to normal muscle function and fluid balance."
      },
      {
        "name": "Magnesium (magnesium citrate)",
        "dose": "100 mg",
        "clinicalNote": "Magnesium plays a role in normal muscle and nerve function."
      },
      {
        "name": "Vitamin C",
        "dose": "100 mg",
        "clinicalNote": "Vitamin C contributes to normal immune function."
      },
      {
        "name": "Sodium",
        "dose": "55 mg",
        "clinicalNote": "Sodium is studied for its role in fluid balance, though this dose is far below sweat-replacement levels."
      }
    ],
    "cautions": [
      "Only 55 mg sodium per serving — light relative to products built for heavy sweat loss",
      "Talk to your doctor if you take medication affecting potassium or magnesium levels"
    ],
    "servings": 30,
    "priceRange": "$",
    "flavorsNote": "Wide zero-sugar flavor range (Grape, Orange, Raspberry, Watermelon and more) sweetened with organic stevia leaf extract.",
    "affiliateUrl": "https://www.amazon.com/s?k=ultima+replenisher+electrolyte+powder&tag=YOURTAG-20",
    "blurb": "Potassium- and magnesium-leaning profile with only 55 mg sodium — an everyday flavored-water mix rather than a sweat-replacement formula.",
    "labelVerified": "July 2026",
    "metrics": {
      "sodiumMg": 55,
      "potassiumMg": 250,
      "magnesiumMg": 100,
      "sugarG": 0
    },
    "sources": [
      {
        "url": "https://www.heb.com/product-detail/ultima-replenisher-raspberry-nbsp-electrolyte-hydration-powder/2067443",
        "label": "H-E-B listing with supplement facts panel"
      },
      {
        "url": "https://www.ultimareplenisher.com/products/grape-electrolyte-powder-drink",
        "label": "Ultima brand product page (supplement facts, sweetener)"
      }
    ]
  },

  {
    "id": "skratch-hydration-sport-mix",
    "name": "Hydration Sport Drink Mix",
    "brand": "Skratch Labs",
    "category": "electrolytes",
    "stimFree": true,
    "badges": [],
    "caffeineMg": 0,
    "keyIngredients": [
      {
        "name": "Cane sugar carbohydrates",
        "dose": "19 g",
        "clinicalNote": "Simple carbohydrates taken during long exercise are studied for maintaining energy availability and aiding fluid absorption."
      },
      {
        "name": "Sodium",
        "dose": "400 mg",
        "clinicalNote": "Sodium is studied for its role in replacing sweat losses during prolonged exercise."
      },
      {
        "name": "Magnesium",
        "dose": "50 mg",
        "clinicalNote": "Magnesium plays a role in normal muscle function."
      }
    ],
    "cautions": [
      "19 g sugar per serving — designed as workout fuel, not everyday hydration",
      "Talk to your doctor if you manage blood sugar"
    ],
    "servings": 20,
    "priceRange": "$$",
    "flavorsNote": "Real-fruit flavors like Lemon + Lime and Strawberry Lemonade, sweetened with cane sugar and no artificial sweeteners.",
    "affiliateUrl": "https://www.amazon.com/s?k=skratch+labs+hydration+sport+drink+mix&tag=YOURTAG-20",
    "blurb": "Endurance carb-mix profile: 19 g of sugar-based carbohydrate with 400 mg sodium, built for fueling plus fluid replacement on long efforts.",
    "labelVerified": "July 2026",
    "metrics": {
      "sodiumMg": 400,
      "potassiumMg": 50,
      "magnesiumMg": 50,
      "sugarG": 19
    },
    "sources": [
      {
        "url": "https://www.skratchlabs.com/products/hydration-sport-drink-mix",
        "label": "Skratch Labs product page (400 mg sodium, 19 g carbs, bag sizes)"
      },
      {
        "url": "https://thefeed.com/products/skratch-labs-exercise-hydration-mix",
        "label": "Retailer listing with full nutrition panel per scoop"
      }
    ]
  },

  {
    "id": "tailwind-endurance-fuel",
    "name": "Endurance Fuel",
    "brand": "Tailwind Nutrition",
    "category": "electrolytes",
    "stimFree": true,
    "badges": [],
    "caffeineMg": 0,
    "keyIngredients": [
      {
        "name": "Dextrose + sucrose",
        "dose": "25 g",
        "clinicalNote": "Glucose-based carbohydrates taken during endurance exercise are studied for sustaining energy output."
      },
      {
        "name": "Sodium",
        "dose": "303 mg",
        "clinicalNote": "Sodium is studied for its role in replacing sweat losses during prolonged exercise."
      },
      {
        "name": "Potassium",
        "dose": "88 mg",
        "clinicalNote": "Potassium contributes to normal muscle function."
      }
    ],
    "cautions": [
      "25 g sugar per scoop, and typical endurance use is 2-3 scoops per bottle",
      "Calorie-dense by design — talk to your doctor if you manage blood sugar"
    ],
    "servings": 30,
    "priceRange": "$$",
    "flavorsNote": "Light flavors such as Mandarin, Lemon, and unflavored Naked, with sweetness coming from its dextrose and sucrose fuel rather than added sweeteners.",
    "affiliateUrl": "https://www.amazon.com/s?k=tailwind+nutrition+endurance+fuel&tag=YOURTAG-20",
    "blurb": "All-in-one endurance fuel: 100 calories of dextrose and sucrose per scoop with modest electrolytes, meant to be scaled up per bottle on long efforts.",
    "labelVerified": "July 2026",
    "metrics": {
      "sodiumMg": 303,
      "potassiumMg": 88,
      "magnesiumMg": 14,
      "sugarG": 25
    },
    "sources": [
      {
        "url": "https://www.runningwarehouse.com/Tailwind_Nutrition_Endurance_Fuel_Drink_30-Serving/descpage-TWEFD30.html",
        "label": "Retailer listing with per-scoop nutrition panel (30-serving bag)"
      },
      {
        "url": "https://thefeed.com/products/tailwind-endurance-fuel",
        "label": "Retailer listing with stick-pack nutrition panel"
      }
    ]
  },

  {
    "id": "redmond-re-lyte-hydration",
    "name": "Re-Lyte Hydration",
    "brand": "Redmond",
    "category": "electrolytes",
    "stimFree": true,
    "badges": [
      "Budget Pick",
      "Fully Disclosed Label"
    ],
    "caffeineMg": 0,
    "keyIngredients": [
      {
        "name": "Sodium (from Real Salt)",
        "dose": "810 mg",
        "clinicalNote": "Sodium is the primary electrolyte lost in sweat and is studied for its role in fluid balance during prolonged sweating."
      },
      {
        "name": "Potassium",
        "dose": "400 mg",
        "clinicalNote": "Potassium contributes to normal muscle function and works with sodium in fluid balance."
      },
      {
        "name": "Magnesium",
        "dose": "50 mg",
        "clinicalNote": "Magnesium plays a role in normal muscle and nerve function."
      }
    ],
    "cautions": [
      "810 mg sodium per serving — significant if you watch sodium intake",
      "Talk to your doctor if you take blood-pressure medication",
      "Hydration mixes are formulated for sweat loss, not everyday sipping"
    ],
    "servings": 60,
    "priceRange": "$",
    "flavorsNote": "Flavored options like Lemon Lime plus an Unflavored version, sweetened with stevia leaf extract and zero sugar.",
    "affiliateUrl": "https://www.amazon.com/s?k=redmond+re-lyte+hydration+electrolyte+mix&tag=YOURTAG-20",
    "blurb": "Sodium-forward at 810 mg with 400 mg potassium and zero sugar; 60 servings per tub makes it one of the cheapest per-serving options in the high-sodium tier.",
    "labelVerified": "July 2026",
    "metrics": {
      "sodiumMg": 810,
      "potassiumMg": 400,
      "magnesiumMg": 50,
      "sugarG": 0
    },
    "sources": [
      {
        "url": "https://living.redmond.com/products/re-lyte-hydration",
        "label": "Redmond product page (supplement facts, 60 servings)"
      }
    ]
  },

  /* ---- protein (label-verified July 2026) ---- */

  {
    "id": "on-gold-standard-whey",
    "name": "Gold Standard 100% Whey",
    "brand": "Optimum Nutrition",
    "category": "protein",
    "stimFree": true,
    "badges": [
      "Beginner Friendly"
    ],
    "caffeineMg": 0,
    "keyIngredients": [
      {
        "name": "Whey protein blend (isolate-primary, with concentrate and hydrolyzed whey)",
        "dose": "24 g",
        "clinicalNote": "Complete dairy protein with a studied role in supporting muscle protein synthesis after resistance exercise."
      },
      {
        "name": "Naturally occurring BCAAs",
        "dose": "5.5 g",
        "clinicalNote": "Branched-chain amino acids occur naturally in whey and are involved in normal muscle-tissue maintenance."
      },
      {
        "name": "Naturally occurring EAAs",
        "dose": "11 g",
        "clinicalNote": "Essential amino acids the body cannot make itself; whey supplies all nine."
      }
    ],
    "cautions": [
      "Contains milk; lecithin may be soy-derived — not suitable for dairy allergy",
      "Sweetened with sucralose and acesulfame potassium — check the label if you avoid artificial sweeteners",
      "Protein powders supplement food, not replace it"
    ],
    "servings": 73,
    "priceRange": "$$",
    "flavorsNote": "15+ flavors; figures verified against the Banana Cream panel (31 g scoop) on the 5 lb tub — serving size shifts a gram or two by flavor, and the Double Rich Chocolate ingredient list shows sucralose plus acesulfame potassium.",
    "affiliateUrl": "https://www.amazon.com/s?k=optimum+nutrition+gold+standard+whey&tag=YOURTAG-20",
    "blurb": "The long-running benchmark whey blend: isolate listed first, 24 g protein in a 31 g scoop, and a 73-serving 5 lb tub that keeps per-serving cost in the middle of the pack.",
    "labelVerified": "July 2026",
    "metrics": {
      "proteinG": 24,
      "servingG": 31,
      "source": "whey blend",
      "sweetener": "sucralose + acesulfame K"
    },
    "sources": [
      {
        "url": "https://www.optimumnutrition.com/en-us/products/gold-standard-100-whey-protein-powder",
        "label": "Optimum Nutrition product page (Banana Cream panel)"
      },
      {
        "url": "https://www.dpsnutrition.net/i/4140/optimum-100-whey-double-rich-choc-5-lb.htm",
        "label": "DPS Nutrition listing (Double Rich Chocolate ingredients)"
      }
    ]
  },

  {
    "id": "dymatize-iso100",
    "name": "ISO100 Hydrolyzed",
    "brand": "Dymatize",
    "category": "protein",
    "stimFree": true,
    "badges": [],
    "caffeineMg": 0,
    "keyIngredients": [
      {
        "name": "Hydrolyzed whey protein isolate + whey protein isolate",
        "dose": "25 g",
        "clinicalNote": "Fast-digesting isolate forms of whey studied for supporting muscle protein synthesis around training."
      },
      {
        "name": "L-leucine (naturally occurring)",
        "dose": "2.6 g",
        "clinicalNote": "The amino acid most closely tied to switching on muscle protein synthesis in research settings."
      },
      {
        "name": "Naturally occurring BCAAs",
        "dose": "5.5 g",
        "clinicalNote": "Supplied by the whey itself rather than added separately."
      }
    ],
    "cautions": [
      "Contains milk and soy (lecithin) — not suitable for dairy allergy",
      "Sweetened with sucralose plus stevia — check the label if you're sensitive to sucralose",
      "Protein powders supplement food, not replace it"
    ],
    "servings": 42,
    "priceRange": "$$",
    "flavorsNote": "Figures verified against Gourmet Chocolate (32 g scoop, 3 lb tub); wide flavor range, all sweetened with sucralose and steviol glycosides.",
    "affiliateUrl": "https://www.amazon.com/s?k=dymatize+iso100+hydrolyzed+whey+isolate&tag=YOURTAG-20",
    "blurb": "A hydrolyzed whey isolate that hits 25 g protein in a 32 g scoop with about 1 g of carbs — one of the leanest macro profiles in the category, priced accordingly.",
    "labelVerified": "July 2026",
    "metrics": {
      "proteinG": 25,
      "servingG": 32,
      "source": "whey isolate",
      "sweetener": "sucralose + stevia"
    },
    "sources": [
      {
        "url": "https://dymatize.com/products/iso100-gourmet-chocolate",
        "label": "Dymatize product page (Gourmet Chocolate)"
      },
      {
        "url": "https://www.dpsnutrition.net/i/16568/dymatize-iso-100-whey-protein-isolate-gourmet.htm",
        "label": "DPS Nutrition listing (3 lb / 42 servings)"
      }
    ]
  },

  {
    "id": "transparent-labs-grass-fed-whey-isolate",
    "name": "100% Grass-Fed Whey Protein Isolate",
    "brand": "Transparent Labs",
    "category": "protein",
    "stimFree": true,
    "badges": [
      "Third-Party Tested",
      "Fully Disclosed Label"
    ],
    "caffeineMg": 0,
    "keyIngredients": [
      {
        "name": "Grass-fed whey protein isolate",
        "dose": "28 g",
        "clinicalNote": "Roughly 88% protein by scoop weight; whey isolate is well studied for supporting muscle protein synthesis after resistance exercise."
      },
      {
        "name": "Stevia leaf extract (flavored tubs only)",
        "dose": "amount not stated on label",
        "clinicalNote": "Plant-derived zero-calorie sweetener; the unflavored tub omits sweeteners entirely."
      }
    ],
    "cautions": [
      "Contains milk — not suitable for dairy allergy",
      "One of the pricier isolates per serving — compare cost per gram of protein",
      "Protein powders supplement food, not replace it"
    ],
    "servings": 30,
    "priceRange": "$$$",
    "flavorsNote": "Figures verified against the Unflavored tub (28 g protein per 32 g scoop, 30 servings); flavored versions use stevia and run a 34-36 g scoop depending on flavor.",
    "affiliateUrl": "https://www.amazon.com/s?k=transparent+labs+grass+fed+whey+protein+isolate&tag=YOURTAG-20",
    "blurb": "Short ingredient list, Informed Choice and Informed Protein certifications on the brand page, and published third-party test results — you pay a premium for the paperwork.",
    "labelVerified": "July 2026",
    "metrics": {
      "proteinG": 28,
      "servingG": 32,
      "source": "whey isolate",
      "sweetener": "unsweetened (stevia in flavored)"
    },
    "sources": [
      {
        "url": "https://www.transparentlabs.com/products/whey-protein-isolate",
        "label": "Transparent Labs product page"
      },
      {
        "url": "https://www.garagegymreviews.com/transparent-labs-protein-review",
        "label": "Garage Gym Reviews (flavored-scoop and sweetener check)"
      }
    ]
  },

  {
    "id": "ascent-native-fuel-whey",
    "name": "Native Fuel Whey",
    "brand": "Ascent",
    "category": "protein",
    "stimFree": true,
    "badges": [
      "Third-Party Tested"
    ],
    "caffeineMg": 0,
    "keyIngredients": [
      {
        "name": "Whey protein blend (native whey isolate, whey isolate, whey concentrate)",
        "dose": "25 g",
        "clinicalNote": "Native whey is filtered directly from milk rather than a cheese by-product; like all whey it is studied for post-exercise muscle protein synthesis support."
      },
      {
        "name": "Naturally occurring leucine",
        "dose": "2.6 g",
        "clinicalNote": "Leucine content is printed on the label; it is the key amino acid for triggering muscle protein synthesis in studies."
      },
      {
        "name": "Naturally occurring BCAAs",
        "dose": "5.5 g",
        "clinicalNote": "From the whey itself, not added free-form aminos."
      }
    ],
    "cautions": [
      "Contains milk — not suitable for dairy allergy",
      "Chocolate flavor is made with real cocoa, which carries trace caffeine",
      "Protein powders supplement food, not replace it"
    ],
    "servings": 27,
    "priceRange": "$$$",
    "flavorsNote": "Figures verified against Chocolate (33 g scoop, 2 lb bag); sweetened with stevia leaf extract and real cocoa — no artificial sweeteners.",
    "affiliateUrl": "https://www.amazon.com/s?k=ascent+native+fuel+whey+protein&tag=YOURTAG-20",
    "blurb": "Informed Sport certification is verified on the brand page, and the formula skips artificial sweeteners — a clean pick for tested athletes at a mid-premium price.",
    "labelVerified": "July 2026",
    "metrics": {
      "proteinG": 25,
      "servingG": 33,
      "source": "whey blend",
      "sweetener": "stevia"
    },
    "sources": [
      {
        "url": "https://www.ascentprotein.com/products/chocolate-protein-powder",
        "label": "Ascent product page (Chocolate)"
      }
    ]
  },

  {
    "id": "on-gold-standard-casein",
    "name": "Gold Standard 100% Casein",
    "brand": "Optimum Nutrition",
    "category": "protein",
    "stimFree": true,
    "badges": [],
    "caffeineMg": 0,
    "keyIngredients": [
      {
        "name": "Micellar casein",
        "dose": "24 g",
        "clinicalNote": "A slow-digesting milk protein studied for a prolonged amino-acid release, which is why it is commonly used between meals or before bed."
      },
      {
        "name": "Naturally occurring BCAAs",
        "dose": "≈5 g",
        "clinicalNote": "Label states nearly 5 g per serving, supplied by the casein itself."
      },
      {
        "name": "Aminogen (labeled digestive enzyme)",
        "dose": "amount not stated on label",
        "clinicalNote": "A protease enzyme added to assist normal protein digestion."
      }
    ],
    "cautions": [
      "Contains milk — not suitable for dairy allergy",
      "Ingredient list includes a gum blend (cellulose, xanthan, carrageenan) and sucralose — check the label if you're sensitive to either",
      "Protein powders supplement food, not replace it"
    ],
    "servings": 53,
    "priceRange": "$$$",
    "flavorsNote": "Figures verified against Creamy Vanilla (34 g scoop, 4 lb tub); four flavors, all sweetened with sucralose.",
    "affiliateUrl": "https://www.amazon.com/s?k=optimum+nutrition+gold+standard+casein&tag=YOURTAG-20",
    "blurb": "The most widely available micellar casein: 24 g slow-digesting protein per 34 g scoop, thicker in water than whey by design, at a noticeably higher cost per serving.",
    "labelVerified": "July 2026",
    "metrics": {
      "proteinG": 24,
      "servingG": 34,
      "source": "casein",
      "sweetener": "sucralose"
    },
    "sources": [
      {
        "url": "https://www.optimumnutrition.com/en-us/products/gold-standard-100-casein-protein-powder",
        "label": "Optimum Nutrition product page"
      },
      {
        "url": "https://www.dpsnutrition.net/i/561/optimum-100-casein-protein-van-4-lb.htm",
        "label": "DPS Nutrition listing (Creamy Vanilla panel)"
      }
    ]
  },

  {
    "id": "orgain-organic-protein",
    "name": "Organic Protein Plant Based Protein Powder",
    "brand": "Orgain",
    "category": "protein",
    "stimFree": true,
    "badges": [
      "Beginner Friendly"
    ],
    "caffeineMg": 0,
    "keyIngredients": [
      {
        "name": "Organic plant protein blend (pea, brown rice, mung bean, chia)",
        "dose": "21 g",
        "clinicalNote": "Blending legume and grain proteins rounds out the amino-acid profile so the mix supplies all nine essential amino acids."
      },
      {
        "name": "Prebiotic fiber",
        "dose": "6 g",
        "clinicalNote": "Labeled fiber content that also contributes to the thicker texture typical of plant powders."
      }
    ],
    "cautions": [
      "Chocolate flavors contain trace caffeine from organic cocoa (brand states under 1/14 of a cup of coffee)",
      "46 g two-scoop serving carries ~15 g carbs — different macro profile than a whey isolate",
      "Protein powders supplement food, not replace it"
    ],
    "servings": 20,
    "priceRange": "$$",
    "flavorsNote": "Figures verified against Creamy Chocolate Fudge (46 g two-scoop serving, 2.03 lb tub); sweetened with organic stevia (Reb A) — current formula contains no erythritol.",
    "affiliateUrl": "https://www.amazon.com/s?k=orgain+organic+protein+plant+based+powder&tag=YOURTAG-20",
    "blurb": "The grocery-store default for vegan protein: USDA Organic, 21 g protein from a four-source plant blend, and a reformulated sweetener system that dropped erythritol.",
    "labelVerified": "July 2026",
    "metrics": {
      "proteinG": 21,
      "servingG": 46,
      "source": "plant blend",
      "sweetener": "stevia"
    },
    "sources": [
      {
        "url": "https://orgain.com/products/organic-protein-plant-based-protein-powder",
        "label": "Orgain product page (Creamy Chocolate Fudge)"
      },
      {
        "url": "https://www.wholefoodsmarket.com/grocery/product/orgain-orgain-organic-vegan-protein-powder-creamy-chocolate-fudge-21g-plant-protein-6g-prebiotic-fiber-low-net-carb-no-lactose-ingredients-no-added-sugar-non-gmo-for-shakes-smoothies-2-03-lb-b00j074w94",
        "label": "Whole Foods Market listing (panel and ingredients)"
      }
    ]
  },

  {
    "id": "vega-sport-premium-protein",
    "name": "Sport Premium Protein",
    "brand": "Vega",
    "category": "protein",
    "stimFree": true,
    "badges": [
      "Third-Party Tested"
    ],
    "caffeineMg": 0,
    "keyIngredients": [
      {
        "name": "Plant protein blend (pea protein, pumpkin seed protein, organic sunflower seed protein)",
        "dose": "30 g",
        "clinicalNote": "A multi-source plant blend delivering a complete amino-acid profile to support muscle repair after training."
      },
      {
        "name": "Naturally occurring BCAAs",
        "dose": "5 g",
        "clinicalNote": "Branched-chain amino acids from the protein sources themselves."
      },
      {
        "name": "Tart cherry + probiotics (2 billion CFU)",
        "dose": "amounts as labeled",
        "clinicalNote": "Recovery-oriented extras printed on the label; the probiotic is a heat-stable Bacillus subtilis strain."
      }
    ],
    "cautions": [
      "44 g serving is large — mixes best in 10-12 oz of liquid",
      "Check the label if you're sensitive to stevia",
      "Protein powders supplement food, not replace it"
    ],
    "servings": 19,
    "priceRange": "$$$",
    "flavorsNote": "Figures verified against Chocolate (44 g scoop, 19-serving tub); stevia-sweetened, and newest packaging carries the 'Protein + Recovery' name on the same formula.",
    "affiliateUrl": "https://www.amazon.com/s?k=vega+sport+premium+protein&tag=YOURTAG-20",
    "blurb": "The highest per-serving protein of the plant picks at 30 g, with NSF Certified for Sport verification on the brand page — the vegan option for drug-tested athletes.",
    "labelVerified": "July 2026",
    "metrics": {
      "proteinG": 30,
      "servingG": 44,
      "source": "plant blend",
      "sweetener": "stevia"
    },
    "sources": [
      {
        "url": "https://myvega.com/products/vega-sport-protein",
        "label": "Vega product page (protein, servings, NSF Certified for Sport)"
      },
      {
        "url": "https://netnutri.com/vega-sport-performance-protein-chocolate-flavor-29-2-oz-828-g",
        "label": "NetNutri listing (Chocolate 44 g serving panel)"
      }
    ]
  },

  {
    "id": "garden-of-life-sport-grass-fed-whey",
    "name": "SPORT Certified Grass Fed Whey",
    "brand": "Garden of Life",
    "category": "protein",
    "stimFree": true,
    "badges": [
      "Third-Party Tested"
    ],
    "caffeineMg": 0,
    "keyIngredients": [
      {
        "name": "Grass-fed whey protein isolate with milk protein",
        "dose": "24 g",
        "clinicalNote": "Isolate-primary whey from Irish grass-fed herds; whey protein is studied for supporting post-exercise muscle repair."
      },
      {
        "name": "Naturally occurring BCAAs",
        "dose": "6 g",
        "clinicalNote": "Labeled branched-chain amino-acid content from the whey."
      },
      {
        "name": "Probiotics (Bifidobacterium lactis)",
        "dose": "amount as labeled",
        "clinicalNote": "An added probiotic strain listed on the panel."
      }
    ],
    "cautions": [
      "Contains milk — not suitable for dairy allergy",
      "Smaller 672 g tub means fewer servings per purchase than typical 2 lb whey tubs",
      "Protein powders supplement food, not replace it"
    ],
    "servings": 20,
    "priceRange": "$$$",
    "flavorsNote": "Figures verified against Chocolate (34.5 g scoop, 672 g tub); sweetened with organic stevia, no artificial sweeteners.",
    "affiliateUrl": "https://www.amazon.com/s?k=garden+of+life+sport+grass+fed+whey&tag=YOURTAG-20",
    "blurb": "Grass-fed Irish whey with both NSF Certified for Sport and Informed Choice listed on the brand's Sport line — the trade-off is a small tub and premium per-serving cost.",
    "labelVerified": "July 2026",
    "metrics": {
      "proteinG": 24,
      "servingG": 34.5,
      "source": "whey isolate blend",
      "sweetener": "stevia"
    },
    "sources": [
      {
        "url": "https://www.swansonvitamins.com/p/garden-of-life-sport-certified-grass-fed-whey-protein-chocolate-23-7-oz-672-grams-pwdr",
        "label": "Swanson listing (Chocolate panel)"
      },
      {
        "url": "https://www.gardenoflife.com/sport-certified-grass-fed-whey-chocolate",
        "label": "Garden of Life product page (certifications)"
      }
    ]
  },

  {
    "id": "now-sports-whey-protein-isolate",
    "name": "Whey Protein Isolate, Unflavored",
    "brand": "NOW Sports",
    "category": "protein",
    "stimFree": true,
    "badges": [
      "Fully Disclosed Label"
    ],
    "caffeineMg": 0,
    "keyIngredients": [
      {
        "name": "Whey protein isolate",
        "dose": "25 g",
        "clinicalNote": "Single-source isolate studied for supporting muscle protein synthesis; the entire ingredient list is two items."
      },
      {
        "name": "Sunflower lecithin",
        "dose": "<1%",
        "clinicalNote": "Added only for mixability — no soy lecithin used."
      }
    ],
    "cautions": [
      "Contains milk — not suitable for dairy allergy",
      "Unflavored and unsweetened — expect a plain dairy taste on its own",
      "Protein powders supplement food, not replace it"
    ],
    "servings": 81,
    "priceRange": "$$",
    "flavorsNote": "This SKU is unflavored and unsweetened (28 g scoop); NOW also sells stevia-sweetened creamy chocolate and vanilla versions with different panels.",
    "affiliateUrl": "https://www.amazon.com/s?k=now+sports+whey+protein+isolate+unflavored&tag=YOURTAG-20",
    "blurb": "A two-ingredient isolate — whey isolate plus sunflower lecithin — with 25 g protein in a 28 g scoop and 81 servings per 5 lb tub, ideal for smoothie mixers who don't want sweeteners.",
    "labelVerified": "July 2026",
    "metrics": {
      "proteinG": 25,
      "servingG": 28,
      "source": "whey isolate",
      "sweetener": "unsweetened"
    },
    "sources": [
      {
        "url": "https://www.swansonvitamins.com/p/now-foods-whey-protein-isolate-unflavored-5-lb-pwdr",
        "label": "Swanson listing (5 lb panel)"
      }
    ]
  },

  {
    "id": "nutricost-whey-protein-concentrate",
    "name": "Whey Protein Concentrate",
    "brand": "Nutricost",
    "category": "protein",
    "stimFree": true,
    "badges": [
      "Budget Pick"
    ],
    "caffeineMg": 0,
    "keyIngredients": [
      {
        "name": "Whey protein concentrate (instantized with sunflower lecithin)",
        "dose": "25 g",
        "clinicalNote": "Undenatured whey concentrate; whey protein is studied for supporting muscle protein synthesis after resistance exercise."
      },
      {
        "name": "Sucralose (flavored versions)",
        "dose": "amount not stated on label",
        "clinicalNote": "Zero-calorie sweetener used in vanilla and other flavored tubs; the unflavored tub has no sweetener."
      }
    ],
    "cautions": [
      "Contains milk — not suitable for dairy allergy",
      "Brand listing carries a California Prop 65 notice — read the label if that matters to you",
      "Check the label if you're sensitive to sucralose (flavored versions)"
    ],
    "servings": 63,
    "priceRange": "$",
    "flavorsNote": "Figures verified against Vanilla (36 g scoop, 5 lb bag, 63 servings); the unflavored tub uses a smaller 33 g scoop and skips sweeteners entirely.",
    "affiliateUrl": "https://www.amazon.com/s?k=nutricost+whey+protein+concentrate&tag=YOURTAG-20",
    "blurb": "The lowest cost per serving on this list: 25 g protein per scoop across a 63-serving 5 lb bag, with independent lab testing claimed by the brand (not an NSF or Informed Sport certification).",
    "labelVerified": "July 2026",
    "metrics": {
      "proteinG": 25,
      "servingG": 36,
      "source": "whey concentrate",
      "sweetener": "sucralose"
    },
    "sources": [
      {
        "url": "https://nutricost.com/products/nutricost-whey-protein-concentrate-powder-5-lbs",
        "label": "Nutricost product page (flavors, testing claims)"
      },
      {
        "url": "https://www.vitacost.com/nutricost-whey-protein-concentrate-powder",
        "label": "Vitacost listing (Vanilla 36 g / 25 g / 63 servings)"
      },
      {
        "url": "https://us.openfoodfacts.org/product/0810139572541/whey-protein-concentrate-nutricost",
        "label": "Open Food Facts label record (unflavored 33 g scoop)"
      }
    ]
  },
];
