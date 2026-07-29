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
//   imageBg        string  OPTIONAL — "R,G,B" of the lead image's own
//                  background, present only when that image is a photo shot on
//                  a solid sweep rather than a transparent render. The tile and
//                  product page fill the art area with it, so the photograph
//                  meets the card edges instead of sitting on the dark stage as
//                  a pasted rectangle. MEASURED, never guessed: the corner
//                  pixels are read in a real browser, because a PNG can carry
//                  an alpha channel and still be entirely opaque.
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
  }
,

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
    "imageUrl": "images/products/on-micronized-creatine.png",
    "images": [
      "https://www.optimumnutrition.com/cdn/shop/files/on-1153060_Image_01.png?v=1769135392&width=2048",
      "https://www.optimumnutrition.com/cdn/shop/files/US_CREATINE_240SV_UNFLAV_FOP.png?v=1784673185"
    ],
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
    "imageUrl": "images/products/thorne-creatine.png",
    "images": [
      "https://d1vo8zfysxy97v.cloudfront.net/media/product/sf903__ve8382489c6ce9fb7f28cdddef00e6f1ece146591.png",
      "https://d1vo8zfysxy97v.cloudfront.net/media/product/sf903__vb5ca0e34dbdc8dc4000b29c8ba0bb48387eb2496.jpg",
      "https://d1vo8zfysxy97v.cloudfront.net/media/product/sf903__v67f933512454449d24c5c855f503305e97e11c01.jpg"
    ],
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
    "imageUrl": "images/products/nutricost-creatine-monohydrate.jpg",
    "imageBg": "255,255,255",
    "images": [
      "https://cdn.shopify.com/s/files/1/0222/4128/0074/files/NTC_CreatineMonohydrate_Unflavored_500G_Front_SQUARE_98526928-e1cc-4ff6-9918-430654760159.jpg?v=1760650358",
      "https://cdn.shopify.com/s/files/1/0222/4128/0074/files/NTC_CreatineMonohydrate_Unflavored_500G_SFP_SQUARE_72b4208e-51d7-42f8-8147-d2502f9c3035.jpg?v=1760650358",
      "https://cdn.shopify.com/s/files/1/0222/4128/0074/products/nutricost-creatine-monohydrate-powder-601968.jpg?v=1760650358"
    ],
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
    "imageUrl": "images/products/transparent-labs-creatine-hmb.png",
    "images": [
      "https://cdn.shopify.com/s/files/1/0866/7664/files/TL_CreatineHMB_30S_U_1_2.png?v=1745537479",
      "https://cdn.shopify.com/s/files/1/0866/7664/files/TL-227_CreatineHMB_60S_SL_1_5_FRONT.png?v=1781272810"
    ],
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
    "imageUrl": "images/products/kaged-creatine-hcl.png",
    "images": [
      "https://cdn.shopify.com/s/files/1/1110/3248/files/CREATINEHCLUNFLAVOREDFRONT.png?v=1774384723",
      "https://cdn.shopify.com/s/files/1/1110/3248/files/CREATINEHCLNORMALFRONT.png?v=1774384752",
      "https://cdn.shopify.com/s/files/1/1110/3248/files/CREATINEHCLFRUITPUNCHFRONT.png?v=1774384752"
    ],
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
    "name": "Creatine HCl",
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
    "imageUrl": "images/products/con-cret-creatine-hcl.webp",
    "imageBg": "255,255,255",
    "images": [
      "https://cdn.shopify.com/s/files/1/0267/4576/6070/files/100Unflavored.webp?v=1784816901",
      "https://cdn.shopify.com/s/files/1/0267/4576/6070/files/64Unflavored.webp?v=1784816901"
    ],
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
    "imageUrl": "images/products/jacked-factory-creatine-monohydrate.png",
    "images": [
      "https://cdn.shopify.com/s/files/1/2704/4962/files/Creatine_30_-_Front.png?v=1768247360",
      "https://cdn.shopify.com/s/files/1/2704/4962/files/creatine-mono-product-01.jpg?v=1768315321",
      "https://cdn.shopify.com/s/files/1/2704/4962/files/JF_Creatine_200_Front.png?v=1770125863"
    ],
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
    "imageUrl": "images/products/muscletech-cell-tech.jpg",
    "imageBg": "245,245,245",
    "images": [
      "https://cdn.shopify.com/s/files/1/1214/7132/files/celltech-citrus-3lb_aa616c64-0d61-4104-a07a-e8b6cc84ad27.jpg?v=1753299077",
      "https://cdn.shopify.com/s/files/1/1214/7132/files/celltech-fruitpunch-3lb_682798d8-2c20-4c66-8883-92ec542a9751.jpg?v=1754063797",
      "https://cdn.shopify.com/s/files/1/1214/7132/files/celltech-fruitpunch-6lb_887f541a-63a0-47c6-99e4-944098a18181.jpg?v=1753299062"
    ],
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
    "imageUrl": "images/products/now-sports-creatine-monohydrate.png",
    "images": [
      "https://www.nowfoods.com/sites/default/files/2023-10/2030_mainimage.png",
      "https://www.nowfoods.com/sites/default/files/2023-10/2030_nowproductlabels.png",
      "https://www.nowfoods.com/sites/default/files/2023-10/2030_nowproductlabels2.png"
    ],
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
    "imageUrl": "images/products/transparent-labs-intra.png",
    "images": [
      "https://www.transparentlabs.com/cdn/shop/files/TL_INTRA_30_BR_1_2.png?v=1746463908",
      "https://www.transparentlabs.com/cdn/shop/files/TL_INTRA_30_SL_1_2.png?v=1746463908"
    ],
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
    "imageUrl": "images/products/momentous-vital-aminos.png",
    "images": [
      "https://www.livemomentous.com/cdn/shop/files/Vital-Aminos_HERO.png?v=1778100483"
    ],
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
    "imageUrl": "images/products/thorne-amino-complex.png",
    "images": [
      "https://d1vo8zfysxy97v.cloudfront.net/media/product/sp641__v5d864686891ec733704f50f55b51dbb6f3c911a5.png",
      "https://d1vo8zfysxy97v.cloudfront.net/media/product/sp641__v53f677a27e0fa152e77753edb45149613e71b6e2.jpg"
    ],
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
    "imageUrl": "images/products/dymatize-all9-amino.png",
    "images": [
      "https://dymatize-nutrition.myshopify.com/cdn/shop/products/all9amino_juicy_watermelon.png?v=1585311958",
      "https://dymatize-nutrition.myshopify.com/cdn/shop/products/all9amino_fruit_fusion_rush.png?v=1585311972"
    ],
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
    "imageUrl": "images/products/jacked-factory-eaa-surge.png",
    "images": [
      "https://www.jackedfactory.com/cdn/shop/files/eaa-surge-20-pineapple-front_0bad065a-f89e-40ac-81dc-05f732d48bb0.png?v=1755280613&width=1200",
      "https://www.jackedfactory.com/cdn/shop/files/JF_D2C_EAA_20_01.png?v=1774449809&width=4000"
    ],
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
    "imageUrl": "images/products/nutricost-eaa.jpg",
    "imageBg": "255,255,255",
    "images": [
      "https://nutricost.com/cdn/shop/files/NTC_EAA_BlueRaspberry_30SERV_20OZ_Front_Square_1800x1800.jpg?v=1738964098",
      "https://nutricost.com/cdn/shop/files/NTC_EAA_POG_30SERV_20OZ_Front_Square_1800x1800.jpg?v=1770138766"
    ],
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
    "name": "Original BCAA",
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
    "imageUrl": "images/products/xtend-original-bcaa.png",
    "imageBg": "241,241,241",
    "images": [
      "https://cellucor.com/cdn/shop/files/XTEND_1144_Digital_Relabel_FlowThrough_Assets_PDPs_OnGreyBackground-XTEND-OG30-BRI.png?v=1771552623",
      "https://cellucor.com/cdn/shop/files/XTEND_1144_Digital_Relabel_FlowThrough_Assets_PDPs_OnGreyBackground-XTEND-OG30-FI-Label.png?v=1776889586"
    ],
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
    "imageUrl": "images/products/musclepharm-bcaa-312.jpg",
    "imageBg": "255,255,255",
    "images": [
      "https://musclepharm.com/cdn/shop/files/BCAA_Fruit_Punch.jpg?v=1754064987&width=1800",
      "https://musclepharm.com/cdn/shop/files/BCAA_Blue_Rasp.jpg?v=1754064987&width=1800"
    ],
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
    "imageUrl": "images/products/optimum-nutrition-amino-energy.png",
    "images": [
      "https://www.optimumnutrition.com/cdn/shop/files/on-1122241_Image_01.png?v=1761656281&width=2000",
      "https://www.optimumnutrition.com/cdn/shop/files/on-1122232_Image_01.png?v=1761656281&width=2000"
    ],
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
    "name": "Electrolyte Drink Mix",
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
    "imageUrl": "images/products/lmnt-drink-mix.webp",
    "imageBg": "255,255,255",
    "images": [
      "https://res.cloudinary.com/drinklmnt/image/upload/f_auto,q_auto/v1759900501/lmnt-citrus-salt-30ct-box_ux0v3u.webp",
      "https://res.cloudinary.com/drinklmnt/image/upload/f_auto,q_auto/v1759900501/lmnt-citrus-salt-open-box-dark_uczoih.webp",
      "https://res.cloudinary.com/drinklmnt/image/upload/f_auto,q_auto/v1759900502/lmnt-citrus-salt-pump-satiety_upwzxr.webp"
    ],
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
    "imageUrl": "images/products/liquid-iv-hydration-multiplier.jpg",
    "imageBg": "243,239,230",
    "images": [
      "https://cdn.shopify.com/s/files/1/1338/1013/files/HMO_PFC_16ct_PDP.jpg?v=1762182360",
      "https://cdn.shopify.com/s/files/1/1338/1013/files/HMO_LL_16ct_PDP_5d06a7d4-5650-432a-9c54-78fc806aa73b.jpg?v=1762182393",
      "https://cdn.shopify.com/s/files/1/1338/1013/files/Web_-_PDP_Images_-_Static_-_New_HM_Mango_-_Product_Only_-_Pouch_on_Beige_Background_-_2880x2880_8c6ae7c0-f5f9-4b2a-997a-37686529ac9e.png?v=1762182430",
      "https://cdn.shopify.com/s/files/1/1338/1013/files/HMO_CC_VP_16ct_PDP.jpg?v=1762182365"
    ],
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
    "name": "Sport",
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
    "imageUrl": "images/products/nuun-sport.png",
    "images": [
      "https://nuunlife.com/cdn/shop/files/Nuun_Tube_Upright_withTabs_Strawberry_lemonade_web.png?v=1744037007&width=800",
      "https://nuunlife.com/cdn/shop/files/B018NZJ9YQ.PT02.jpg?v=1780507230&width=800",
      "https://nuunlife.com/cdn/shop/files/B018NZJ9YQ.PT04.png?v=1780507263&width=800"
    ],
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
    "name": "ORS Electrolyte Powder",
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
    "imageUrl": "images/products/dripdrop-ors.png",
    "images": [
      "https://dripdrop.com/cdn/shop/files/Pouch_30ct_Front16ozSticks_ZSPWatermelon.png?crop=center&height=1200&v=1783954560&width=1200",
      "https://dripdrop.com/cdn/shop/files/Bold_Variety_-_32ct_-_Transparent.png?crop=center&height=1200&v=1763672888&width=1200",
      "https://dripdrop.com/cdn/shop/files/DripDrop_Pouch_Image_V2_Vizit_Watermelon_-_32ct.png?crop=center&height=1200&v=1763766377&width=1200"
    ],
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
    "imageUrl": "images/products/gatorlyte-rapid-rehydration.png",
    "images": [
      "https://www.datocms-assets.com/101859/1776960107-gatorlyte_powder_orange_sachet_pdp-hero_desktop_2026_3708x2780.png?auto=format&fit=max&w=3840",
      "https://www.datocms-assets.com/101859/1776959992-gatorlyte_powder_orange_carton_pdpwhatyouget_desktop_2026_1812x2720.png?auto=format&fit=max&w=3840",
      "https://www.datocms-assets.com/101859/1776959958-gatorlyte_orange_pdp_lifestyle_desktop_3708x2780.png?auto=format&fit=max&w=3840"
    ],
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
    "imageUrl": "images/products/transparent-labs-hydrate.png",
    "images": [
      "https://www.transparentlabs.com/cdn/shop/files/TL_Hydrate_40S_PM_1_3.png?v=1745607400&width=1946",
      "https://www.transparentlabs.com/cdn/shop/files/peachmango40.jpg?v=1780945564&width=1946"
    ],
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
    "name": "Replenisher Electrolyte Mix",
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
    "imageUrl": "images/products/ultima-replenisher.jpg",
    "imageBg": "209,226,236",
    "images": [
      "https://www.ultimareplenisher.com/cdn/shop/files/Variety_Stickpacks.jpg?v=1743096987&width=1600",
      "https://www.ultimareplenisher.com/cdn/shop/files/Original_Flavor_Stickpacks.jpg?v=1743096625&width=1600"
    ],
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
    "imageUrl": "images/products/skratch-hydration-sport-mix.jpg",
    "imageBg": "252,182,0",
    "images": [
      "https://www.skratchlabs.com/cdn/shop/files/hydration_sport_drink_mix_mango_front_of_bag_400mg_of_sodium.jpg?v=1774390853&width=800",
      "https://www.skratchlabs.com/cdn/shop/files/WebsitePDPGalleryRefresh_SDM_LL_440g_01.jpg?v=1765569821&width=800",
      "https://www.skratchlabs.com/cdn/shop/files/400mg_sodium_per_serving_variety_pack.jpg?v=1778354803&width=800"
    ],
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
    "imageUrl": "images/products/tailwind-endurance-fuel.png",
    "images": [
      "https://tailwindnutrition.com/cdn/shop/files/TW_End_Family_Dauwaltermelon_2000x2000_d24ecffc-2a48-4feb-80f2-6d49cc1e4f4a_1500x.png?v=1779229566",
      "https://tailwindnutrition.com/cdn/shop/files/TW_End_Family_Lemon_2000x2000_2f3edef0-6e55-43b7-b349-0ddad82064b7_1500x.png?v=1779229565",
      "https://tailwindnutrition.com/cdn/shop/files/TW_End_Family_Naked_2000x2000_10286890-1c72-4953-a0ae-fcfd276d1da7_1500x.png?v=1779229565"
    ],
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
    "imageUrl": "images/products/redmond-re-lyte-hydration.jpg",
    "imageBg": "255,255,255",
    "images": [
      "https://living.redmond.com/cdn/shop/files/Re-lyteHydrationJars_NewLabel_AllFamily_Whitebackground_1024x1024.jpg?v=1717079208",
      "https://living.redmond.com/cdn/shop/files/Grape_For_web_Front_7af57f43-2abb-4a05-8fb0-b4dab9212cb9.jpg?v=1770922504&width=1024",
      "https://living.redmond.com/cdn/shop/files/Re-Lyte_Hydration_60-servings_jar_Lemon_Lime_Front_-_AMZ.jpg?v=1784269649&width=1024"
    ],
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
    "imageUrl": "images/products/on-gold-standard-whey.png",
    "images": [
      "https://www.optimumnutrition.com/cdn/shop/files/GSW_DRC_2lb_FOP.png?v=1776170438&width=2500",
      "https://www.optimumnutrition.com/cdn/shop/files/GSW_DRC_5lb_FOP.png?v=1776173227&width=2500",
      "https://www.optimumnutrition.com/cdn/shop/files/US_GSW_5LB_DELSTRAW_FOP.png?v=1784666447&width=2500",
      "https://www.optimumnutrition.com/cdn/shop/files/US_GSW_5LB_BANANA_Main_Image.png?v=1777475395&width=2500"
    ],
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
    "imageUrl": "images/products/dymatize-iso100.png",
    "images": [
      "https://dymatize.imgix.net/production/products/DYMA_ISO100_MCC_20srv.png",
      "https://dymatize.imgix.net/production/products/dym0001-8_ISO100_20s_PCThumbnail_540x678_GormetVanilla.jpg",
      "https://dymatize.imgix.net/production/products/dym0001-8_ISO100_20s_PCThumbnail_540x678_GormetChocolate.jpg",
      "https://dymatize.imgix.net/production/products/iso_salted_thumb.png"
    ],
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
    "imageUrl": "images/products/transparent-labs-grass-fed-whey-isolate.png",
    "images": [
      "https://www.transparentlabs.com/cdn/shop/files/01_chocolate.png?v=1778514112&width=1920",
      "https://www.transparentlabs.com/cdn/shop/files/01_vanilla.png?v=1778514138&width=1920",
      "https://www.transparentlabs.com/cdn/shop/files/02_unflav.png?v=1778514249&width=1920",
      "https://www.transparentlabs.com/cdn/shop/files/01_strawberry.png?v=1778514276&width=1920"
    ],
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
    "imageUrl": "images/products/ascent-native-fuel-whey.png",
    "imageBg": "7,6,5",
    "images": [
      "https://www.ascentprotein.com/cdn/shop/products/whey-van-2lb-main.png?v=1695075692&width=1200",
      "https://www.ascentprotein.com/cdn/shop/products/whey-van-4lb-main.png?v=1695075692&width=1200",
      "https://www.ascentprotein.com/cdn/shop/products/whey-cpb-2lb-main.png?v=1693322324&width=1200"
    ],
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
    "imageUrl": "images/products/on-gold-standard-casein.png",
    "images": [
      "https://www.optimumnutrition.com/cdn/shop/files/Casein_Van_4lb_FOP.png?v=1776366533&width=2500",
      "https://www.optimumnutrition.com/cdn/shop/files/US_GS_Casein_4lb_Chocolate_FOP.png?v=1780494368&width=2500",
      "https://www.optimumnutrition.com/cdn/shop/files/on-1116316_Image_01_62f70313-b8a4-4c2c-ab3f-1049763310bd.png?v=1761914250&width=2000"
    ],
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
    "imageUrl": "images/products/orgain-organic-protein.webp",
    "images": [
      "https://orgain.com/cdn/shop/files/851770003179-v13-Orgain-ProteinPowder-2.03lb-Chocolate-20240311-Front-HIRES-web_1200px.webp",
      "https://orgain.com/cdn/shop/files/851770003919-v8-Orgain-ProteinPowder-1.02lb-Label-Chocolate-20240311-Front-HIRES-web_1200px.webp"
    ],
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
    "imageUrl": "images/products/vega-sport-premium-protein.png",
    "images": [
      "https://myvega.com/cdn/shop/files/Vega_Performance_Protein_Recovery_Vanilla_4lb_1.png?width=1200",
      "https://myvega.com/cdn/shop/files/Vega_Performance_Protein_Recovery_Chocolate_4lb_1.png?width=1200",
      "https://myvega.com/cdn/shop/files/Vega_Performance_Protein_Recovery_Vanilla_29oz.png?width=1200"
    ],
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
    "imageUrl": "images/products/now-sports-whey-protein-isolate.png",
    "images": [
      "https://www.nowfoods.com/sites/default/files/2025-11/2172_v13.png"
    ],
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
    "imageUrl": "images/products/nutricost-whey-protein-concentrate.jpg",
    "imageBg": "255,255,255",
    "images": [
      "https://nutricost.com/cdn/shop/files/NTC_WPC_Chocolate_2LB_2750CC_Front_Square_906cc793-3c2c-497a-ac90-c8265275b423.jpg?width=1200",
      "https://nutricost.com/cdn/shop/files/NTC_WPC_Vanilla_2LB_2750CC_Front_Square_b1e55d34-9c12-4401-9bcb-1f5c29ef1de9.jpg?width=1200",
      "https://nutricost.com/cdn/shop/files/NTC_WPC_Unflavored_2LB_2750CC_Front_Square.jpg?width=1200"
    ],
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

  /* ---- creatine (label-verified July 2026) ---- */

  {
    "id": "cellucor-cor-performance-creatine",
    "name": "COR-Performance Creatine Monohydrate",
    "brand": "Cellucor",
    "category": "creatine",
    "stimFree": true,
    "badges": [
      "Fully Disclosed Label",
      "Budget Pick"
    ],
    "caffeineMg": 0,
    "keyIngredients": [
      {
        "name": "Creatine Monohydrate",
        "dose": "5 g",
        "clinicalNote": "Studied for supporting the body's ATP energy recycling during short, high-intensity efforts, and for supporting strength and power output when paired with resistance training."
      }
    ],
    "cautions": [
      "Draws water into muscle — drink more water",
      "Loading phases are optional; 3–5 g daily reaches saturation in about 4 weeks",
      "Talk to your doctor if you have kidney conditions"
    ],
    "servings": 72,
    "priceRange": "$",
    "flavorsNote": "Sold unflavored as a single-ingredient scoop, plus Blue Raspberry, Fruit Punch, and Watermelon flavored versions.",
    "affiliateUrl": "https://www.amazon.com/s?k=cellucor+cor+performance+creatine&tag=YOURTAG-20",
    "blurb": "A single-ingredient 5 g monohydrate scoop with no fillers in the unflavored version; the 72-serving tub is one of the larger counts among mass-market creatines.",
    "labelVerified": "July 2026",
    "imageUrl": "images/products/cellucor-cor-performance-creatine.jpg",
    "imageBg": "229,224,218",
    "images": [
      "https://cellucor.com/cdn/shop/files/CELL-Creatine-72serv-UNFLAVORED-hero.jpg?v=1777823684",
      "https://cellucor.com/cdn/shop/files/CELL-Creatine-72serv-UNFLAVORED-nutritonal.jpg?v=1777823684",
      "https://cellucor.com/cdn/shop/files/CELL_2358_UnflavoredCreatine_PDPs_WarmGrey_Claims.jpg?v=1777870273"
    ],
    "metrics": {
      "creatineG": 5,
      "form": "monohydrate"
    },
    "sources": [
      {
        "url": "https://cellucor.com/products/creatine-monohydrate-powder",
        "label": "Cellucor — official product page"
      }
    ]
  },

  {
    "id": "on-creatine-2500-caps",
    "name": "Creatine 2500 Capsules",
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
        "name": "Creatine Monohydrate (Creapure)",
        "dose": "2.5 g",
        "clinicalNote": "Creapure-brand creatine monohydrate studied for supporting ATP energy recycling and strength output during short, high-intensity training; capsules trade dose-per-serving for no-mixing convenience."
      }
    ],
    "cautions": [
      "Capsules use a gelatin shell — not suitable for vegetarians or vegans",
      "Draws water into muscle — drink more water",
      "Talk to your doctor if you have kidney conditions"
    ],
    "servings": 100,
    "priceRange": "$$",
    "flavorsNote": "Unflavored capsule format — nothing to mix or taste.",
    "affiliateUrl": "https://www.amazon.com/s?k=optimum+nutrition+creatine+2500+caps&tag=YOURTAG-20",
    "blurb": "Delivers 2.5 g of Creapure creatine monohydrate per two-capsule serving for people who'd rather swallow capsules than mix a scoop; matching the standard 5 g research dose takes four capsules.",
    "labelVerified": "July 2026",
    "imageUrl": "images/products/on-creatine-2500-caps.png",
    "images": [
      "https://www.optimumnutrition.com/cdn/shop/files/US_CREATINE_CAPS_50SV_FOP.png",
      "https://www.optimumnutrition.com/cdn/shop/files/US_ON_CREATINE_200_CAPS.png",
      "https://www.optimumnutrition.com/cdn/shop/files/US_Creatine_100caps_50srv_NFP.jpg"
    ],
    "metrics": {
      "creatineG": 2.5,
      "form": "monohydrate"
    },
    "sources": [
      {
        "url": "https://www.optimumnutrition.com/en-us/products/creatine-monohydrate-micronized-capsules",
        "label": "Optimum Nutrition — official product page"
      }
    ]
  },

  {
    "id": "muscletech-platinum-100-creatine",
    "name": "Platinum 100% Creatine",
    "brand": "MuscleTech",
    "category": "creatine",
    "stimFree": true,
    "badges": [
      "Fully Disclosed Label"
    ],
    "caffeineMg": 0,
    "keyIngredients": [
      {
        "name": "Micronized Creatine Monohydrate",
        "dose": "5 g",
        "clinicalNote": "HPLC-tested creatine monohydrate studied for supporting ATP regeneration and strength/power output during short, high-intensity training bouts."
      }
    ],
    "cautions": [
      "Draws water into muscle — drink more water",
      "Loading phases are optional; 3–5 g daily reaches saturation in about 4 weeks",
      "Talk to your doctor if you have kidney conditions"
    ],
    "servings": 90,
    "priceRange": "$",
    "flavorsNote": "Unflavored is the single-ingredient version; Grape and Red Berry flavors add sodium, citric acid, and stevia-based sweetening.",
    "affiliateUrl": "https://www.amazon.com/s?k=muscletech+platinum+100+creatine&tag=YOURTAG-20",
    "blurb": "90 servings of HPLC-tested monohydrate at 5 g per scoop in the unflavored version, with no other ingredients listed on the panel.",
    "labelVerified": "July 2026",
    "imageUrl": "images/products/muscletech-platinum-100-creatine.jpg",
    "imageBg": "244,244,244",
    "images": [
      "https://www.muscletech.com/cdn/shop/files/MuscleTech-100Creatine-Unflavored-2000x2000-01a-V2.jpg?v=1766074513&width=2000",
      "https://www.muscletech.com/cdn/shop/files/MuscleTech-100Creatine-Unflavored-2000x2000-10_font.jpg?v=1766074513&width=2000",
      "https://www.muscletech.com/cdn/shop/files/MuscleTech-100Creatine-Unflavored-2000x2000-02-V2_font.jpg?v=1766074513&width=2000"
    ],
    "metrics": {
      "creatineG": 5,
      "form": "monohydrate"
    },
    "sources": [
      {
        "url": "https://www.muscletech.com/products/platinum-100-creatine",
        "label": "MuscleTech — official product page"
      }
    ]
  },

  {
    "id": "six-star-creatine-x3",
    "name": "Creatine X3",
    "brand": "Six Star",
    "category": "creatine",
    "stimFree": true,
    "badges": [
      "Proprietary Blend"
    ],
    "caffeineMg": 0,
    "keyIngredients": [
      {
        "name": "Creatine Monohydrate",
        "dose": "3 g",
        "clinicalNote": "Studied for supporting ATP energy recycling and strength/power output during short, high-intensity effort; this label's dose sits below the 5 g typically used in that research."
      },
      {
        "name": "Amino Plus Blend (L-arginine, glycine, L-methionine, L-carnosine, alpha lipoic acid)",
        "dose": "169 mg",
        "clinicalNote": "A combined-weight blend of five amino-acid-related compounds; the label discloses the total but not how much of each ingredient it contains."
      }
    ],
    "cautions": [
      "Delivers 3 g of creatine per serving, below the 5 g dose used in most creatine research",
      "The Amino Plus Blend's individual ingredient amounts are not disclosed on the label",
      "Talk to your doctor if you have kidney conditions"
    ],
    "servings": 20,
    "priceRange": "$",
    "flavorsNote": "Sold as coated caplets — no mixing or flavor to manage.",
    "affiliateUrl": "https://www.amazon.com/s?k=six+star+creatine+x3+caplets&tag=YOURTAG-20",
    "blurb": "A caplet format dosing 3 g of creatine monohydrate per 3-caplet serving alongside a 169 mg proprietary amino blend whose individual ingredient amounts aren't broken out on the label.",
    "labelVerified": "July 2026",
    "imageUrl": "images/products/six-star-creatine-x3.jpg",
    "imageBg": "200,196,195",
    "images": [
      "https://www.sixstarpro.com/cdn/shop/files/ss-creatine-x3-pill-front.jpg",
      "https://www.sixstarpro.com/cdn/shop/files/ss-creatine-x3-pill-right.jpg",
      "https://www.sixstarpro.com/cdn/shop/files/ss-creatine-x3-pill-left.jpg"
    ],
    "metrics": {
      "creatineG": 3,
      "form": "monohydrate"
    },
    "sources": [
      {
        "url": "https://www.sixstarpro.com/products/creatine-x3-pill",
        "label": "Six Star — official product page"
      }
    ]
  },

  {
    "id": "bsn-creatine-dna",
    "name": "Creatine DNA",
    "brand": "BSN",
    "category": "creatine",
    "stimFree": true,
    "badges": [
      "Fully Disclosed Label"
    ],
    "caffeineMg": 0,
    "keyIngredients": [
      {
        "name": "Micronized Creatine Monohydrate",
        "dose": "5 g",
        "clinicalNote": "Studied for supporting ATP energy recycling and strength/power output during short, high-intensity training when paired with resistance work."
      }
    ],
    "cautions": [
      "Draws water into muscle — drink more water",
      "Loading phases are optional; 3–5 g daily reaches saturation in about 4 weeks",
      "Talk to your doctor if you have kidney conditions"
    ],
    "servings": 60,
    "priceRange": "$$",
    "flavorsNote": "Unflavored powder with no listed sweeteners; mixes into water or a shake.",
    "affiliateUrl": "https://www.amazon.com/s?k=bsn+creatine+dna&tag=YOURTAG-20",
    "blurb": "A plain 5 g micronized monohydrate scoop with no other listed ingredients, sold in a 60-serving unflavored tub.",
    "labelVerified": "July 2026",
    "metrics": {
      "creatineG": 5,
      "form": "monohydrate"
    },
    "sources": [
      {
        "url": "https://www.amazon.com/BSN-Micronized-Monohydrate-Unflavored-Supply-60/dp/B00QEMY4T6",
        "label": "Amazon listing"
      },
      {
        "url": "https://www.netnutri.com/bsn-creatine-dna-unflavored-309g",
        "label": "NetNutri listing"
      }
    ]
  },

  {
    "id": "allmax-creatine-monohydrate",
    "name": "Creatine Monohydrate",
    "brand": "Allmax",
    "category": "creatine",
    "stimFree": true,
    "badges": [
      "Fully Disclosed Label"
    ],
    "caffeineMg": 0,
    "keyIngredients": [
      {
        "name": "CreaSyn Creatine Monohydrate",
        "dose": "5 g",
        "clinicalNote": "HPLC-verified 99.9%-purity creatine monohydrate studied for supporting ATP energy recycling and strength/power output during short, high-intensity effort."
      }
    ],
    "cautions": [
      "Draws water into muscle — drink more water",
      "Loading phases are optional; 3–5 g daily reaches saturation in about 4 weeks",
      "Talk to your doctor if you have kidney conditions"
    ],
    "servings": 200,
    "priceRange": "$",
    "flavorsNote": "Sold unflavored across 100 g, 400 g, and 1000 g sizes; a separately flavored version also exists.",
    "affiliateUrl": "https://www.amazon.com/s?k=allmax+creatine+monohydrate&tag=YOURTAG-20",
    "blurb": "5 g of CreaSyn creatine monohydrate per scoop, verified to 99.9% purity by HPLC testing; the 1000 g size runs 200 servings, among the largest counts in the category.",
    "labelVerified": "July 2026",
    "imageUrl": "images/products/allmax-creatine-monohydrate.webp",
    "imageBg": "251,251,251",
    "images": [
      "https://www.allmaxnutrition.com/cdn/shop/files/allmax-creatine-unflavored-400g_1.webp",
      "https://www.allmaxnutrition.com/cdn/shop/files/allmax-creatine-unflavored-100g_1.webp",
      "https://www.allmaxnutrition.com/cdn/shop/files/allmax-creatine-unflavored-1000g_1.webp"
    ],
    "metrics": {
      "creatineG": 5,
      "form": "monohydrate"
    },
    "sources": [
      {
        "url": "https://www.allmaxnutrition.com/products/allmax-creatine-monohydrate-powder",
        "label": "Allmax — official product page"
      }
    ]
  },

  {
    "id": "force-factor-creatine-monohydrate",
    "name": "Creatine Monohydrate",
    "brand": "Force Factor",
    "category": "creatine",
    "stimFree": true,
    "badges": [
      "Fully Disclosed Label"
    ],
    "caffeineMg": 0,
    "keyIngredients": [
      {
        "name": "Micronized Creatine Monohydrate",
        "dose": "5 g",
        "clinicalNote": "Studied for supporting ATP energy recycling and strength/power output during short, high-intensity training when paired with resistance work."
      }
    ],
    "cautions": [
      "Draws water into muscle — drink more water",
      "Loading phases are optional; 3–5 g daily reaches saturation in about 4 weeks",
      "Talk to your doctor if you have kidney conditions"
    ],
    "servings": 60,
    "priceRange": "$$",
    "flavorsNote": "Unflavored powder; the brand states no artificial colors, flavors, sweeteners, or preservatives.",
    "affiliateUrl": "https://www.amazon.com/s?k=force+factor+creatine+monohydrate&tag=YOURTAG-20",
    "blurb": "5 g of micronized monohydrate per scoop with no other ingredients listed on the panel; the brand states the tub is free of gelatin and added sugar.",
    "labelVerified": "July 2026",
    "imageUrl": "images/products/force-factor-creatine-monohydrate.png",
    "images": [
      "https://forcefactor.com/cdn/shop/files/Force_Factor_Essentials_Creatine_Monohydrate_Powder_5g_Tub_60sv_117x117.png?v=1736549266",
      "https://cdn.shopify.com/s/files/1/0278/7776/9321/files/05_SFPwebsite_700x.jpg?v=1689865918"
    ],
    "metrics": {
      "creatineG": 5,
      "form": "monohydrate"
    },
    "sources": [
      {
        "url": "https://forcefactor.com/products/creatine-monohydrate",
        "label": "Force Factor — official product page"
      }
    ]
  },

  {
    "id": "dymatize-creatine-micronized",
    "name": "Creatine Micronized",
    "brand": "Dymatize",
    "category": "creatine",
    "stimFree": true,
    "badges": [
      "Fully Disclosed Label"
    ],
    "caffeineMg": 0,
    "keyIngredients": [
      {
        "name": "Creatine Monohydrate (Creapure)",
        "dose": "5 g",
        "clinicalNote": "Creapure-brand creatine monohydrate studied for supporting ATP energy recycling and strength/power output during short, high-intensity training."
      },
      {
        "name": "Micronized processing",
        "dose": "5 g",
        "clinicalNote": "Milled to roughly 180 microns to improve dispersion in liquid; the creatine itself is unchanged by the process."
      }
    ],
    "cautions": [
      "Draws water into muscle — drink more water",
      "Loading phases are optional; 3–5 g daily reaches saturation in about 4 weeks",
      "Talk to your doctor if you have kidney conditions"
    ],
    "servings": 60,
    "priceRange": "$$",
    "flavorsNote": "Sold unflavored; dissolves into water or a shake with no added sweeteners.",
    "affiliateUrl": "https://www.amazon.com/s?k=dymatize+creatine+micronized&tag=YOURTAG-20",
    "blurb": "5 g of Creapure-brand monohydrate micronized to roughly 180 microns for easier mixing, with no other ingredients listed on the panel.",
    "labelVerified": "July 2026",
    "metrics": {
      "creatineG": 5,
      "form": "monohydrate"
    },
    "sources": [
      {
        "url": "https://dymatize.com/products/creatine-monohydrate",
        "label": "Dymatize — official product page"
      }
    ]
  },

  {
    "id": "rule-one-r1-creatine",
    "name": "R1 Creatine",
    "brand": "Rule One",
    "category": "creatine",
    "stimFree": true,
    "badges": [
      "Fully Disclosed Label",
      "Budget Pick"
    ],
    "caffeineMg": 0,
    "keyIngredients": [
      {
        "name": "Micronized Creatine Monohydrate",
        "dose": "5 g",
        "clinicalNote": "Studied for supporting ATP energy recycling and strength/power output during short, high-intensity training when paired with resistance work."
      }
    ],
    "cautions": [
      "Draws water into muscle — drink more water",
      "Loading phases are optional; 3–5 g daily reaches saturation in about 4 weeks",
      "Talk to your doctor if you have kidney conditions"
    ],
    "servings": 130,
    "priceRange": "$",
    "flavorsNote": "Unflavored is the plain version; Blue Raspberry and Fruit Punch flavored options are also sold.",
    "affiliateUrl": "https://www.amazon.com/s?k=rule+one+r1+creatine+monohydrate&tag=YOURTAG-20",
    "blurb": "5 g of micronized monohydrate per scoop with no fillers, sugars, or gums listed; the 650 g size runs 130 servings, a low cost per serving for the category.",
    "labelVerified": "July 2026",
    "imageUrl": "images/products/rule-one-r1-creatine.png",
    "images": [
      "https://www.ruleoneproteins.com/cdn/shop/files/Creatine_130s_Unflavored0001.png",
      "https://www.ruleoneproteins.com/cdn/shop/files/Creatine_30s_Blue-Raspberry0001.png"
    ],
    "metrics": {
      "creatineG": 5,
      "form": "monohydrate"
    },
    "sources": [
      {
        "url": "https://www.ruleoneproteins.com/products/r1-creatine",
        "label": "Rule One — official product page"
      }
    ]
  },

  {
    "id": "universal-nutrition-creatine",
    "name": "Creatine Powder",
    "brand": "Universal Nutrition",
    "category": "creatine",
    "stimFree": true,
    "badges": [
      "Fully Disclosed Label",
      "Budget Pick"
    ],
    "caffeineMg": 0,
    "keyIngredients": [
      {
        "name": "Creatine Monohydrate (Creapure)",
        "dose": "5 g",
        "clinicalNote": "Creapure-brand creatine monohydrate studied for supporting ATP energy recycling in muscle and nerve tissue during high-intensity effort."
      }
    ],
    "cautions": [
      "Draws water into muscle — drink more water",
      "Loading phases are optional; 3–5 g daily reaches saturation in about 4 weeks",
      "Talk to your doctor if you have kidney conditions"
    ],
    "servings": 100,
    "priceRange": "$",
    "flavorsNote": "Sold unflavored; a separate flavored version in Fruit Punch and Blue Raspberry also exists.",
    "affiliateUrl": "https://www.amazon.com/s?k=universal+nutrition+creatine+powder&tag=YOURTAG-20",
    "blurb": "A single-ingredient 5 g Creapure monohydrate teaspoon serving with no other listed ingredients; the 500 g tub holds 100 servings, confirmed directly against the manufacturer's label on file with the NIH's supplement label database.",
    "labelVerified": "July 2026",
    "metrics": {
      "creatineG": 5,
      "form": "monohydrate"
    },
    "sources": [
      {
        "url": "https://api.ods.od.nih.gov/dsld/s3/pdf/37648.pdf",
        "label": "NIH Dietary Supplement Label Database — manufacturer label (500 g)"
      },
      {
        "url": "https://www.kroger.com/p/universal-nutrition-creatine-powder/0003944204702",
        "label": "Kroger listing"
      }
    ]
  },

  {
    "id": "momentous-creatine-monohydrate",
    "name": "Creatine Monohydrate",
    "brand": "Momentous",
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
        "clinicalNote": "One of the most-studied ergogenic ingredients; associated with supporting muscle strength, power output, and the body's ATP-based energy recycling during short, high-intensity effort."
      }
    ],
    "cautions": [
      "Draws water into muscle cells — increase daily water intake",
      "Loading is optional; 3–5 g daily reaches muscle saturation in about 3–4 weeks",
      "Talk to a doctor before use if you have a kidney condition"
    ],
    "servings": 90,
    "priceRange": "$$",
    "flavorsNote": "Sold unflavored in the 90-serving tub; Watermelon and Lemon flavored 60-serving versions are also offered.",
    "affiliateUrl": "https://www.amazon.com/s?k=momentous+creatine+monohydrate&tag=YOURTAG-20",
    "blurb": "Carries both NSF Certified for Sport and Informed Sport marks plus added screening for microplastics and PFAS, made in a pharmaceutical facility with tighter heavy-metal limits than the industry standard.",
    "labelVerified": "July 2026",
    "imageUrl": "images/products/momentous-creatine-monohydrate.png",
    "images": [
      "https://www.livemomentous.com/cdn/shop/files/f8715c729d402ed4a92537f004f161bd028c2e8d.png?v=1781125657&width=1440",
      "https://www.livemomentous.com/cdn/shop/files/New_Creatine_60serv_Lemon_8f992091-37a9-4aa2-88e2-d6d0960b3ec5.png?v=1784225459&width=1440",
      "https://www.livemomentous.com/cdn/shop/files/NewCreatine_60serv_Watermelon.png?v=1784225511&width=1440"
    ],
    "metrics": {
      "creatineG": 5,
      "form": "monohydrate"
    },
    "sources": [
      {
        "url": "https://www.livemomentous.com/products/creatine-monohydrate",
        "label": "Momentous — official product page"
      },
      {
        "url": "https://www.amazon.com/Momentous-Creatine-Creapure-Performance-Monohydrate/dp/B085Z9P87K",
        "label": "Amazon listing cross-check (90 servings, NSF Certified for Sport)"
      }
    ]
  },

  {
    "id": "bpn-creatine-monohydrate",
    "name": "Creatine Monohydrate",
    "brand": "Bare Performance Nutrition (BPN)",
    "category": "creatine",
    "stimFree": true,
    "badges": [
      "Third-Party Tested",
      "Fully Disclosed Label"
    ],
    "caffeineMg": 0,
    "keyIngredients": [
      {
        "name": "Creapure Creatine Monohydrate",
        "dose": "5 g",
        "clinicalNote": "Creapure is a German-manufactured creatine monohydrate held to tight purity specs; monohydrate is widely studied for supporting muscle strength, power, and ATP regeneration during short, high-intensity work."
      }
    ],
    "cautions": [
      "Draws water into muscle cells — increase daily water intake",
      "Talk to a doctor before use if you have a kidney condition"
    ],
    "servings": 60,
    "priceRange": "$$$",
    "flavorsNote": "Sold unflavored only, with no sweeteners or fillers.",
    "affiliateUrl": "https://www.amazon.com/s?k=bpn+bare+performance+nutrition+creatine+monohydrate&tag=YOURTAG-20",
    "blurb": "Single-ingredient Creapure monohydrate with NSF Certified for Sport testing on every batch, aimed at athletes who need label-accuracy assurance.",
    "labelVerified": "July 2026",
    "imageUrl": "images/products/bpn-creatine-monohydrate.jpg",
    "imageBg": "230,230,230",
    "images": [
      "https://www.bareperformancenutrition.com/cdn/shop/files/BPNCREA-5.jpg?v=1728563526&width=1200",
      "https://www.bareperformancenutrition.com/cdn/shop/files/BPNCREA30SV-2.jpg?v=1749806840&width=1200"
    ],
    "metrics": {
      "creatineG": 5,
      "form": "monohydrate"
    },
    "sources": [
      {
        "url": "https://www.bareperformancenutrition.com/products/creatine-monohydrate",
        "label": "Bare Performance Nutrition — official product page"
      }
    ]
  },

  {
    "id": "xwerks-lift",
    "name": "Lift",
    "brand": "Xwerks",
    "category": "creatine",
    "stimFree": true,
    "badges": [
      "Fully Disclosed Label"
    ],
    "caffeineMg": 0,
    "keyIngredients": [
      {
        "name": "Micronized Creatine Monohydrate",
        "dose": "5 g",
        "clinicalNote": "Micronization shrinks particle size for easier mixing; monohydrate itself is widely studied for supporting muscle strength, power output, and high-intensity training capacity."
      }
    ],
    "cautions": [
      "Draws water into muscle cells — increase daily water intake",
      "Talk to a doctor before use if you have a kidney condition"
    ],
    "servings": 80,
    "priceRange": "$$$",
    "flavorsNote": "Sold unflavored only, with zero calories, sugar, or added fillers.",
    "affiliateUrl": "https://www.amazon.com/s?k=xwerks+lift+creatine+monohydrate&tag=YOURTAG-20",
    "blurb": "Single-ingredient micronized monohydrate at the full 5 g clinical dose with no flavoring or fillers; no sport-specific banned-substance certification is listed on the label.",
    "labelVerified": "July 2026",
    "imageUrl": "images/products/xwerks-lift.png",
    "imageBg": "227,229,228",
    "images": [
      "https://xwerks.com/cdn/shop/files/lift-2026.png",
      "https://xwerks.com/cdn/shop/files/X_Lift_2.jpg",
      "https://xwerks.com/cdn/shop/files/X_Lift_3.jpg"
    ],
    "metrics": {
      "creatineG": 5,
      "form": "monohydrate"
    },
    "sources": [
      {
        "url": "https://xwerks.com/products/xwerks-lift",
        "label": "Xwerks — official product page"
      }
    ]
  },

  {
    "id": "onnit-creatine-monohydrate",
    "name": "Creatine Monohydrate",
    "brand": "Onnit",
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
        "clinicalNote": "Plain monohydrate with no added flavors or fillers; widely studied for supporting muscle strength, power output, and the body's ATP energy system during short, high-intensity effort."
      }
    ],
    "cautions": [
      "Draws water into muscle cells — increase daily water intake",
      "Talk to a doctor before use if you have a kidney condition"
    ],
    "servings": 90,
    "priceRange": "$$",
    "flavorsNote": "Sold unflavored in 30-, 60-, and 90-serving tub sizes.",
    "affiliateUrl": "https://www.amazon.com/s?k=onnit+creatine+monohydrate&tag=YOURTAG-20",
    "blurb": "Single-ingredient monohydrate that is IGEN Non-GMO tested, but does not carry an NSF Certified for Sport or Informed Sport mark.",
    "labelVerified": "July 2026",
    "imageUrl": "images/products/onnit-creatine-monohydrate.png",
    "imageBg": "252,252,254",
    "images": [
      "https://www.onnit.com/cdn/shop/files/creatine-both-size-pdp.png?v=1777080469&width=1024",
      "https://www.onnit.com/cdn/shop/files/creatine-90-gym-pdp.png?v=1765924233&width=1800",
      "https://www.onnit.com/cdn/shop/files/05-Hero-Creatine.png?v=1766002606&width=873"
    ],
    "metrics": {
      "creatineG": 5,
      "form": "monohydrate"
    },
    "sources": [
      {
        "url": "https://www.onnit.com/products/creatine-unflavored-90-serving-tub",
        "label": "Onnit — official product page"
      }
    ]
  },

  {
    "id": "first-phorm-micronized-creatine",
    "name": "Micronized Creatine Monohydrate",
    "brand": "1st Phorm",
    "category": "creatine",
    "stimFree": true,
    "badges": [
      "Third-Party Tested",
      "Fully Disclosed Label"
    ],
    "caffeineMg": 0,
    "keyIngredients": [
      {
        "name": "Micronized Creatine Monohydrate",
        "dose": "5 g",
        "clinicalNote": "Micronized for solubility; monohydrate is widely studied for supporting muscle strength, power output, and ATP regeneration during short, high-intensity training."
      }
    ],
    "cautions": [
      "Draws water into muscle cells — increase daily water intake",
      "Talk to a doctor before use if you have a kidney condition"
    ],
    "servings": 100,
    "priceRange": "$$",
    "flavorsNote": "Sold unflavored, meant to be mixed into cold water or juice.",
    "affiliateUrl": "https://www.amazon.com/s?k=1st+phorm+micronized+creatine&tag=YOURTAG-20",
    "blurb": "NSF Certified for Sport micronized monohydrate with no other active ingredients, sold in bulk 100-serving tubs.",
    "labelVerified": "July 2026",
    "imageUrl": "images/products/first-phorm-micronized-creatine.png",
    "images": [
      "https://1stphorm.com/cdn/shop/files/creatine-100-serving.png?v=1762198442",
      "https://1stphorm.com/cdn/shop/files/creatine-50-serving.png?v=1744913869",
      "https://1stphorm.com/cdn/shop/files/Creatine-Lifestyle_1800x1800.jpg?v=1744913869"
    ],
    "metrics": {
      "creatineG": 5,
      "form": "monohydrate"
    },
    "sources": [
      {
        "url": "https://1stphorm.com/products/micronized-creatine-monohydrate",
        "label": "1st Phorm — official product page"
      },
      {
        "url": "https://www.nsfsport.com/certified-products/listing-detail.php?id=1601206",
        "label": "NSF Certified for Sport listing — 1st Phorm Micronized Creatine Monohydrate"
      }
    ]
  },

  {
    "id": "gnarly-nutrition-creatine",
    "name": "Creatine Monohydrate",
    "brand": "Gnarly Nutrition",
    "category": "creatine",
    "stimFree": true,
    "badges": [
      "Third-Party Tested",
      "Fully Disclosed Label"
    ],
    "caffeineMg": 0,
    "keyIngredients": [
      {
        "name": "Creapure Creatine Monohydrate",
        "dose": "5 g",
        "clinicalNote": "Vegan-sourced Creapure monohydrate; widely studied for supporting muscle strength, power output, and recovery capacity around training."
      }
    ],
    "cautions": [
      "Draws water into muscle cells — increase daily water intake",
      "Talk to a doctor before use if you have a kidney condition"
    ],
    "servings": 90,
    "priceRange": "$$$",
    "flavorsNote": "Sold unflavored only.",
    "affiliateUrl": "https://www.amazon.com/s?k=gnarly+nutrition+creatine&tag=YOURTAG-20",
    "blurb": "Carries both NSF Content Certified and NSF Certified for Sport marks, the latter screening for over 270 substances banned by pro and Olympic sport bodies.",
    "labelVerified": "July 2026",
    "imageUrl": "images/products/gnarly-nutrition-creatine.webp",
    "imageBg": "229,229,229",
    "images": [
      "https://gognarly.com/cdn/shop/files/GN-CRBG-UN_D2-WEB.webp",
      "https://gognarly.com/cdn/shop/files/GN-CRBG-UN_D3-WEB.webp",
      "https://gognarly.com/cdn/shop/files/Creatine_NFP.jpg"
    ],
    "metrics": {
      "creatineG": 5,
      "form": "monohydrate"
    },
    "sources": [
      {
        "url": "https://gognarly.com/products/creatine-powder",
        "label": "Gnarly Nutrition — official product page"
      },
      {
        "url": "https://www.nsfsport.com/certified-products/listing-detail.php?id=1394351",
        "label": "NSF Certified for Sport listing — Gnarly Creatine"
      }
    ]
  },

  {
    "id": "naked-nutrition-naked-creatine",
    "name": "Creatine Monohydrate Powder",
    "brand": "Naked Nutrition",
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
        "clinicalNote": "Single-ingredient monohydrate with no fillers; widely studied for supporting muscle strength, power output, and the body's ATP energy system during short, high-intensity effort."
      }
    ],
    "cautions": [
      "Draws water into muscle cells — increase daily water intake",
      "Talk to a doctor before use if you have a kidney condition"
    ],
    "servings": 200,
    "priceRange": "$",
    "flavorsNote": "Sold unflavored; a naturally flavored Strawberry version is also offered.",
    "affiliateUrl": "https://www.amazon.com/s?k=naked+nutrition+naked+creatine&tag=YOURTAG-20",
    "blurb": "Bulk single-ingredient monohydrate at one of the lower costs per serving in the category; not NSF Certified for Sport or Informed Sport tested.",
    "labelVerified": "July 2026",
    "imageUrl": "images/products/naked-nutrition-naked-creatine.jpg",
    "imageBg": "233,233,233",
    "images": [
      "https://nakednutrition.com/cdn/shop/files/Creatine-1KG-Unflavored-MainImage.jpg?v=1766596249&width=1200",
      "https://nakednutrition.com/cdn/shop/files/creatine-monohydrate-powder-unflavored-2.2lb_95da58cf-9aeb-4c77-a4af-77c7c5972260.jpg?v=1783215302&width=1200"
    ],
    "metrics": {
      "creatineG": 5,
      "form": "monohydrate"
    },
    "sources": [
      {
        "url": "https://nakednutrition.com/products/creatine-monohydrate-powder",
        "label": "Naked Nutrition — official product page"
      }
    ]
  },

  {
    "id": "create-creatine-monohydrate-gummies",
    "name": "Creatine Monohydrate Gummies",
    "brand": "Create",
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
        "dose": "4.5 g (3 gummies)",
        "clinicalNote": "Delivered in a pectin-based gummy rather than powder; creatine monohydrate is widely studied for supporting muscle strength and power output when taken consistently."
      }
    ],
    "cautions": [
      "Draws water into muscle cells — increase daily water intake",
      "Each serving contains about 3 g of sugar from the gummy base",
      "Talk to a doctor before use if you have a kidney condition"
    ],
    "servings": 30,
    "priceRange": "$$",
    "flavorsNote": "Available in Orange, Blue Raspberry, Watermelon, Sour Green Apple, Sour Peach, Sour Cherry, and a Variety Pack.",
    "affiliateUrl": "https://www.amazon.com/s?k=create+creatine+monohydrate+gummies&tag=YOURTAG-20",
    "blurb": "NSF Certified for Sport gummy delivering 4.5 g of creatine monohydrate per 3-gummy serving, slightly under the standard 5 g research dose, in a dairy-free pectin base.",
    "labelVerified": "July 2026",
    "imageUrl": "images/products/create-creatine-monohydrate-gummies.png",
    "images": [
      "https://cdn.shopify.com/s/files/1/1515/2714/files/create_creatinegummie_varietypack_ea152171-10c6-47b8-9cd8-92c0c03e5988_80x80.png?v=1780938665",
      "https://cdn.shopify.com/s/files/1/1515/2714/files/create_90-ct-orange-2_4480c993-7762-437b-bfa9-ad517fc9f2da_80x80.png?v=1777408323"
    ],
    "metrics": {
      "creatineG": 4.5,
      "form": "monohydrate"
    },
    "sources": [
      {
        "url": "https://thefeed.com/products/create-creatine-monohydrate-gummies",
        "label": "The Feed listing — Create Creatine Monohydrate Gummies (label detail)"
      },
      {
        "url": "https://trycreate.co/products/core-latest-product",
        "label": "Create — official product page"
      }
    ]
  },

  {
    "id": "sports-research-creatine-monohydrate",
    "name": "Creatine Monohydrate",
    "brand": "Sports Research",
    "category": "creatine",
    "stimFree": true,
    "badges": [
      "Third-Party Tested",
      "Fully Disclosed Label"
    ],
    "caffeineMg": 0,
    "keyIngredients": [
      {
        "name": "Micronized Creatine Monohydrate",
        "dose": "5 g",
        "clinicalNote": "Micronized for solubility; monohydrate is widely studied for supporting muscle strength, power output, and workout recovery capacity."
      }
    ],
    "cautions": [
      "Draws water into muscle cells — increase daily water intake",
      "Talk to a doctor before use if you have a kidney condition"
    ],
    "servings": 100,
    "priceRange": "$",
    "flavorsNote": "Sold unflavored.",
    "affiliateUrl": "https://www.amazon.com/s?k=sports+research+creatine+monohydrate&tag=YOURTAG-20",
    "blurb": "Informed Sport-certified micronized monohydrate with no other active ingredients, sold in bulk 100-serving sizes.",
    "labelVerified": "July 2026",
    "metrics": {
      "creatineG": 5,
      "form": "monohydrate"
    },
    "sources": [
      {
        "url": "https://www.amazon.com/Sports-Research-Creatine-Monohydrate-Performance/dp/B0CCJZVJYG",
        "label": "Amazon listing (Sports Research Creatine Monohydrate, 5 g, Informed Sport, 100 servings)"
      },
      {
        "url": "https://www.vitacost.com/sports-research-creatine-monohydrate-informed-sport-certified",
        "label": "Vitacost listing cross-check"
      }
    ]
  },

  {
    "id": "swolverine-kre-alkalyn",
    "name": "Kre-Alkalyn",
    "brand": "Swolverine",
    "category": "creatine",
    "stimFree": true,
    "badges": [
      "Fully Disclosed Label"
    ],
    "caffeineMg": 0,
    "keyIngredients": [
      {
        "name": "Kre-Alkalyn (pH-buffered creatine monohydrate)",
        "dose": "3 g",
        "clinicalNote": "A pH-buffered form of creatine monohydrate made with added sodium bicarbonate; formulated to be dosed lower than standard monohydrate while supporting the same muscle strength and power pathways."
      }
    ],
    "cautions": [
      "Dosed lower (3 g) than standard monohydrate — do not add extra loading doses without guidance",
      "Talk to a doctor before use if you have a kidney condition"
    ],
    "servings": 30,
    "priceRange": "$$$",
    "flavorsNote": "Sold unflavored.",
    "affiliateUrl": "https://www.amazon.com/s?k=swolverine+kre-alkalyn+creatine&tag=YOURTAG-20",
    "blurb": "pH-buffered Kre-Alkalyn creatine dosed at 3 g rather than the standard 5 g monohydrate serving; Swolverine states each batch is lab-tested but the label carries no NSF Certified for Sport or Informed Sport mark.",
    "labelVerified": "July 2026",
    "imageUrl": "images/products/swolverine-kre-alkalyn.png",
    "imageBg": "255,255,255",
    "images": [
      "https://swolverine.com/cdn/shop/files/Swolverine-kre-alkalyn-10216071820-51597217530136.png?v=1773973190&width=800",
      "https://swolverine.com/cdn/shop/files/Swolverine-kre-alkalyn-10216071820-51597217235224.png?v=1773973191&width=800",
      "https://swolverine.com/cdn/shop/files/Swolverine-kre-alkalyn-10216071820-51597221134616.png?v=1773973193&width=800"
    ],
    "metrics": {
      "creatineG": 3,
      "form": "monohydrate"
    },
    "sources": [
      {
        "url": "https://swolverine.com/products/kre-alkalyn",
        "label": "Swolverine — official product page"
      },
      {
        "url": "https://www.walmart.com/ip/Kre-Alkalyn-Advanced-pH-Corrected-Creatine-Monohydrate-Unflavored-60-Servings/2169095498",
        "label": "Walmart listing cross-check (3,000 mg Kre-Alkalyn per scoop)"
      }
    ]
  },

  {
    "id": "nutrabio-creatine-monohydrate-powder",
    "name": "Creatine Monohydrate Powder",
    "brand": "NutraBio",
    "category": "creatine",
    "stimFree": true,
    "badges": [
      "Fully Disclosed Label"
    ],
    "caffeineMg": 0,
    "keyIngredients": [
      {
        "name": "Creatine Monohydrate (PharmaPure)",
        "dose": "5 g",
        "clinicalNote": "Creatine monohydrate is studied for its role in regenerating ATP during short, high-intensity efforts, supporting muscle strength and power output."
      }
    ],
    "cautions": [
      "Mix with 8-16 oz of fluid and drink promptly after mixing.",
      "Creatine draws water into muscle tissue; maintain adequate daily hydration.",
      "Speak with a physician before use if you have a kidney condition."
    ],
    "servings": 60,
    "priceRange": "$$",
    "flavorsNote": "Sold unflavored or in Paradise Punch, Blue Razz, and Lemon Burst; the unflavored version lists no added ingredients.",
    "affiliateUrl": "https://www.amazon.com/s?k=nutrabio+creatine+monohydrate+powder&tag=YOURTAG-20",
    "blurb": "Single-ingredient PharmaPure creatine monohydrate that the brand tests to at least 99.98% purity per batch, with nothing else on the unflavored label.",
    "labelVerified": "July 2026",
    "imageUrl": "images/products/nutrabio-creatine-monohydrate-powder.png",
    "images": [
      "https://nutrabio.com/cdn/shop/files/23014_56618be1-4104-4b84-b81f-38b3294c6e27.png",
      "https://nutrabio.com/cdn/shop/files/third-party-tested_NB-web.png"
    ],
    "metrics": {
      "creatineG": 5,
      "form": "monohydrate"
    },
    "sources": [
      {
        "url": "https://nutrabio.com/products/creatine-monohydrate-powder",
        "label": "NutraBio — official product page"
      }
    ]
  },

  {
    "id": "bucked-up-creatine-monohydrate",
    "name": "Creatine Monohydrate",
    "brand": "Bucked Up",
    "category": "creatine",
    "stimFree": true,
    "badges": [
      "Fully Disclosed Label"
    ],
    "caffeineMg": 0,
    "keyIngredients": [
      {
        "name": "Creatine Monohydrate (Micronized)",
        "dose": "5 g",
        "clinicalNote": "Micronized for a finer particle size intended to help the powder dissolve more readily; creatine monohydrate is the most-studied form for supporting muscle strength and power."
      }
    ],
    "cautions": [
      "Mix one scoop with 8-12 oz of water or a beverage of choice.",
      "Not intended for use by anyone under 18 or by pregnant or nursing women.",
      "Consult a physician before use if you have a pre-existing kidney condition."
    ],
    "servings": 50,
    "priceRange": "$$",
    "flavorsNote": "Sold unflavored only, formulated to mix into any drink without altering taste.",
    "affiliateUrl": "https://www.amazon.com/s?k=bucked+up+creatine+monohydrate&tag=YOURTAG-20",
    "blurb": "A single-ingredient 5 g micronized monohydrate scoop from a brand better known for stimulant pre-workouts; the label lists nothing beyond the creatine itself.",
    "labelVerified": "July 2026",
    "metrics": {
      "creatineG": 5,
      "form": "monohydrate"
    },
    "sources": [
      {
        "url": "https://www.strongsupplementshop.com/creatine-monohydrate-by-bucked-up",
        "label": "Strong Supplement Shop — retailer listing with Supplement Facts panel"
      },
      {
        "url": "https://www.buckedup.com/creatine-monohydrate",
        "label": "Bucked Up — official product page"
      }
    ]
  },

  {
    "id": "alani-nu-creatine",
    "name": "Creatine",
    "brand": "Alani Nu",
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
        "clinicalNote": "Creatine monohydrate is well studied for supporting muscle strength, power output, and training volume when paired with resistance exercise."
      }
    ],
    "cautions": [
      "Mix one scoop into 8-12 fl oz of water or a flavored beverage.",
      "Creatine increases water retention in muscle tissue; drink enough fluids throughout the day.",
      "Not intended for those under 18 or for pregnant or nursing women."
    ],
    "servings": 30,
    "priceRange": "$$$",
    "flavorsNote": "Unflavored, formulated with no added sugar or artificial colors so it can be mixed into any drink.",
    "affiliateUrl": "https://www.amazon.com/s?k=alani+nu+creatine+unflavored&tag=YOURTAG-20",
    "blurb": "A lifestyle-brand tub that keeps the label to one ingredient — 5 g of creatine monohydrate per scoop, nothing else.",
    "labelVerified": "July 2026",
    "imageUrl": "images/products/alani-nu-creatine.png",
    "images": [
      "https://www.alaninu.com/cdn/shop/files/Stretch_AN-Website-PDP-Creatine-01_V1.png?v=1782229016&width=2000",
      "https://www.alaninu.com/cdn/shop/files/Stretch_AN-Website-PDP-Creatine-02_V1.png?v=1782229016&width=2000",
      "https://www.alaninu.com/cdn/shop/files/Stretch_AN-Website-PDP-Creatine-Feature-Image_V1.jpg?v=1782229017"
    ],
    "metrics": {
      "creatineG": 5,
      "form": "monohydrate"
    },
    "sources": [
      {
        "url": "https://www.alaninu.com/products/creatine",
        "label": "Alani Nu — official product page"
      }
    ]
  },

  {
    "id": "ghost-size",
    "name": "Size V3",
    "brand": "Ghost",
    "category": "creatine",
    "stimFree": true,
    "badges": [
      "Fully Disclosed Label"
    ],
    "caffeineMg": 0,
    "keyIngredients": [
      {
        "name": "Creapure Creatine Monohydrate",
        "dose": "5 g",
        "clinicalNote": "Creapure-branded creatine monohydrate is studied for supporting muscle strength, power, and lean mass when combined with resistance training."
      },
      {
        "name": "Betaine (Full Yield)",
        "dose": "2.5 g",
        "clinicalNote": "Betaine anhydrous has been studied for supporting muscular endurance and power output during training."
      },
      {
        "name": "PeakATP (ATP disodium)",
        "dose": "400 mg",
        "clinicalNote": "An adenosine triphosphate disodium ingredient studied for supporting muscular strength and power during resistance training."
      },
      {
        "name": "Epicatechin",
        "dose": "200 mg",
        "clinicalNote": "A flavonoid compound included at a dose reflecting early-stage research on muscle signaling; not established as essential to creatine's core effects."
      }
    ],
    "cautions": [
      "Combines several active ingredients beyond creatine — review the full label if sensitive to betaine or plant-based extracts.",
      "Mix one scoop with 8-10 oz of water or a beverage of choice; do not exceed 2 servings in 24 hours.",
      "Not intended for those under 18 or for pregnant or nursing women."
    ],
    "servings": 30,
    "priceRange": "$$$",
    "flavorsNote": "Available in Natty (no artificial flavors or dyes), Cherry Limeade, and WARHEADS Sour Watermelon.",
    "affiliateUrl": "https://www.amazon.com/s?k=ghost+size+creatine&tag=YOURTAG-20",
    "blurb": "A fully disclosed multi-ingredient muscle-builder built around 5 g of Creapure creatine monohydrate plus betaine, PeakATP, and epicatechin — every dose is printed on the label rather than folded into a blend.",
    "labelVerified": "July 2026",
    "imageUrl": "images/products/ghost-size.webp",
    "images": [
      "https://www.ghostlifestyle.com/cdn/shop/files/Size_Natty.webp",
      "https://www.ghostlifestyle.com/cdn/shop/files/GHOST_Size_V3_Natty_Back.png"
    ],
    "metrics": {
      "creatineG": 5,
      "form": "blend"
    },
    "sources": [
      {
        "url": "https://www.priceplow.com/ghost/size",
        "label": "PricePlow — label database with Supplement Facts panel"
      },
      {
        "url": "https://www.ghostlifestyle.com/products/ghost-size-v3-natty",
        "label": "Ghost Lifestyle — official product page"
      }
    ]
  },

  {
    "id": "kaged-creatine-monohydrate",
    "name": "Creatine Monohydrate",
    "brand": "Kaged",
    "category": "creatine",
    "stimFree": true,
    "badges": [
      "Fully Disclosed Label",
      "Third-Party Tested"
    ],
    "caffeineMg": 0,
    "keyIngredients": [
      {
        "name": "Creatine Monohydrate (Micronized)",
        "dose": "5 g",
        "clinicalNote": "Creatine monohydrate is one of the most-studied ingredients for supporting muscle strength, power, and training capacity."
      }
    ],
    "cautions": [
      "Mix one scoop into 8-10 oz of water, juice, or a beverage of choice.",
      "Drink adequate water throughout the day while supplementing with creatine.",
      "Consult a physician before use if you have a kidney condition."
    ],
    "servings": 100,
    "priceRange": "$$",
    "flavorsNote": "Sold unflavored; mixes into any beverage.",
    "affiliateUrl": "https://www.amazon.com/s?k=kaged+creatine+monohydrate&tag=YOURTAG-20",
    "blurb": "Every batch is verified by Informed Sport, giving this single-ingredient 5 g monohydrate scoop a label-backed third-party testing claim rather than just a marketing statement.",
    "labelVerified": "July 2026",
    "imageUrl": "images/products/kaged-creatine-monohydrate.png",
    "images": [
      "https://www.kaged.com/cdn/shop/files/CreatineMono-Front-UN.png",
      "https://www.kaged.com/cdn/shop/files/CreatineMonohydrateAMZ_CreatineMonohydrateSFP.jpg"
    ],
    "metrics": {
      "creatineG": 5,
      "form": "monohydrate"
    },
    "sources": [
      {
        "url": "https://www.kaged.com/products/creatine-monohydrate",
        "label": "Kaged — official product page"
      }
    ]
  },

  {
    "id": "nutricost-creatine-hcl",
    "name": "Creatine HCl Powder",
    "brand": "Nutricost",
    "category": "creatine",
    "stimFree": true,
    "badges": [
      "Fully Disclosed Label",
      "Budget Pick"
    ],
    "caffeineMg": 0,
    "keyIngredients": [
      {
        "name": "Creatine HCl (CON-CRET)",
        "dose": "750 mg",
        "clinicalNote": "Creatine hydrochloride is a more water-soluble salt form of creatine studied at lower gram doses than monohydrate for supporting muscle strength and power."
      }
    ],
    "cautions": [
      "Creatine HCl is dosed in milligrams, not grams — this is not a 1:1 swap for a 5 g monohydrate serving.",
      "Mix one scoop with 6-10 oz of water.",
      "Consult a physician before use if you have a kidney condition."
    ],
    "servings": 300,
    "priceRange": "$",
    "flavorsNote": "Sold unflavored.",
    "affiliateUrl": "https://www.amazon.com/s?k=nutricost+creatine+hcl&tag=YOURTAG-20",
    "blurb": "A budget-priced single-ingredient HCl powder dosed at 750 mg per serving — far below a typical 5 g monohydrate scoop, reflecting HCl's higher solubility per gram.",
    "labelVerified": "July 2026",
    "imageUrl": "images/products/nutricost-creatine-hcl.jpg",
    "imageBg": "255,255,255",
    "images": [
      "https://nutricost.com/cdn/shop/files/NTC_CreatineHCI_300G_16OZ_Front_Square.jpg?v=1770060305",
      "https://nutricost.com/cdn/shop/files/NTC_CreatineHCI_300G_16OZ_SFP_Square.jpg?v=1770060305"
    ],
    "metrics": {
      "creatineG": 0.75,
      "form": "HCl"
    },
    "sources": [
      {
        "url": "https://nutricost.com/products/nutricost-creatine-hcl-powder",
        "label": "Nutricost — official product page"
      }
    ]
  },

  {
    "id": "ryse-loaded-creatine",
    "name": "Loaded Creatine",
    "brand": "RYSE",
    "category": "creatine",
    "stimFree": true,
    "badges": [
      "Fully Disclosed Label"
    ],
    "caffeineMg": 0,
    "keyIngredients": [
      {
        "name": "Creatine Monohydrate",
        "dose": "4 g",
        "clinicalNote": "The primary, most-studied form of creatine in the blend, supporting muscle strength and power output."
      },
      {
        "name": "Creatine MagnaPower (Magnesium Creatine Chelate)",
        "dose": "1.5 g",
        "clinicalNote": "A patented magnesium-bound creatine form included alongside monohydrate and HCl in this three-form blend."
      },
      {
        "name": "Creatine HCl",
        "dose": "750 mg",
        "clinicalNote": "A more soluble creatine salt form dosed in milligrams rather than grams."
      },
      {
        "name": "Betaine Anhydrous",
        "dose": "2.5 g",
        "clinicalNote": "Betaine has been studied for supporting muscular endurance and power during training."
      }
    ],
    "cautions": [
      "Combines three creatine forms plus betaine and PeakATP — total active ingredient load is higher than a single-ingredient monohydrate scoop.",
      "Mix one scoop with 10-12 oz of water or a beverage of choice; do not exceed one serving in 24 hours.",
      "Consult a physician before use if you have a kidney condition."
    ],
    "servings": 30,
    "priceRange": "$$$",
    "flavorsNote": "Available unflavored and in flavors including Electric Lemonade and Baja Cooler, sweetened with sucralose and acesulfame potassium in flavored versions.",
    "affiliateUrl": "https://www.amazon.com/s?k=ryse+loaded+creatine&tag=YOURTAG-20",
    "blurb": "A fully disclosed three-form creatine blend — monohydrate, MagnaPower, and HCl — plus betaine and PeakATP, totaling roughly 6.25 g of labeled creatine per scoop.",
    "labelVerified": "July 2026",
    "imageUrl": "images/products/ryse-loaded-creatine.webp",
    "images": [
      "https://rysesupps.com/cdn/shop/files/u_1.webp",
      "https://rysesupps.com/cdn/shop/files/nfp-loadedcre-unflav.png"
    ],
    "metrics": {
      "creatineG": 6.25,
      "form": "blend"
    },
    "sources": [
      {
        "url": "https://rysesupps.com/products/loaded-creatine",
        "label": "RYSE — official product page"
      },
      {
        "url": "https://www.stack3d.com/2023/08/ryse-loaded-creatine/",
        "label": "Stack3d — label breakdown"
      }
    ]
  },

  {
    "id": "ancient-nutrition-creatine-collagen-electrolytes",
    "name": "Creatine + Collagen + Electrolytes (Lemon)",
    "brand": "Ancient Nutrition",
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
        "clinicalNote": "Creatine monohydrate is studied for supporting muscle strength and power output during resistance training."
      },
      {
        "name": "Hydration & Collagen Blend (fermented eggshell membrane collagen, sodium, potassium)",
        "dose": "2.19 g",
        "clinicalNote": "A combined blend of fermented eggshell membrane collagen and electrolytes; individual ingredient amounts within the blend are not broken out on the label."
      }
    ],
    "cautions": [
      "Contains 450 mg of sodium and 280 mg of potassium per scoop from the electrolyte blend — a consideration for anyone monitoring sodium intake.",
      "Contains egg; produced on equipment that also processes peanuts, tree nuts, milk, soy, and wheat.",
      "Mix one scoop in 6-8 oz of liquid."
    ],
    "servings": 30,
    "priceRange": "$$$",
    "flavorsNote": "Lemon flavor, sweetened with stevia leaf extract and organic monk fruit extract; a plain Creatine + Collagen version without electrolytes is also sold.",
    "affiliateUrl": "https://www.amazon.com/s?k=ancient+nutrition+creatine+collagen+electrolytes&tag=YOURTAG-20",
    "blurb": "Creatine monohydrate is disclosed on its own line at 5 g, but the collagen and electrolyte ingredients are combined into a single 2.19 g blend total without an individual breakdown.",
    "labelVerified": "July 2026",
    "imageUrl": "images/products/ancient-nutrition-creatine-collagen-electrolytes.jpg",
    "imageBg": "254,254,254",
    "images": [
      "https://www.professionalsupplementcenter.com/cdn/shop/files/creatine-collagen-electrolytes-ANN_main_1.jpg?v=1768932858&width=800",
      "https://www.professionalsupplementcenter.com/cdn/shop/files/creatine-collagen-electrolytes-ANN_Lemon_30_20Servings_main_1.jpg?v=1768932857&width=800"
    ],
    "metrics": {
      "creatineG": 5,
      "form": "blend"
    },
    "sources": [
      {
        "url": "https://www.professionalsupplementcenter.com/products/creatine-collagen-electrolytes-by-ancient-nutrition",
        "label": "Professional Supplement Center — retailer listing with Supplement Facts panel"
      },
      {
        "url": "https://ancientnutrition.com/products/creatine-collagen-electrolytes-powder-lemon",
        "label": "Ancient Nutrition — official product page"
      }
    ]
  },

  {
    "id": "optimum-nutrition-creatine-gummies",
    "name": "Creatine Monohydrate Gummies",
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
        "clinicalNote": "Creatine monohydrate is studied for supporting muscle strength, power, and training volume; this gummy format delivers the same compound as powder without mixing."
      }
    ],
    "cautions": [
      "Each serving (3 gummies) contains 2 g of sugar, unlike unsweetened powder formats.",
      "Take 3 gummies daily as a single serving; do not exceed the recommended amount.",
      "Not intended for those under 18 or for pregnant, nursing, or those trying to conceive."
    ],
    "servings": 25,
    "priceRange": "$$$",
    "flavorsNote": "Available in Pineapple, Blue Raspberry, and Mixed Berry, naturally flavored with no synthetic colors.",
    "affiliateUrl": "https://www.amazon.com/s?k=optimum+nutrition+creatine+gummies&tag=YOURTAG-20",
    "blurb": "A chewable alternative to scoop-and-mix creatine — 3 gummies deliver the same 5 g creatine monohydrate dose as a standard powder serving, at the cost of 2 g of added sugar.",
    "labelVerified": "July 2026",
    "imageUrl": "images/products/optimum-nutrition-creatine-gummies.png",
    "images": [
      "https://www.optimumnutrition.com/cdn/shop/files/ON_DTC_PDP_CreatineGum35srv_Pineapple_6079514_4000x4000_8b5d2b43-a73c-4a43-a36e-6ac60070cbce.png?v=1784577657&width=4000",
      "https://www.optimumnutrition.com/cdn/shop/files/US_Creatine_Gummies_25srv_75ct_Mixed_Berry_NFP.jpg?v=1784747944&width=1000",
      "https://www.optimumnutrition.com/cdn/shop/files/06_ON_CreatineGummies_Pineapple_B_4000x4000_35210b03-09df-4ba7-b314-7d14ef976156.png?v=1767736827&width=2000"
    ],
    "metrics": {
      "creatineG": 5,
      "form": "monohydrate"
    },
    "sources": [
      {
        "url": "https://www.optimumnutrition.com/en-us/products/creatine-monohydrate-gummies",
        "label": "Optimum Nutrition — official product page"
      }
    ]
  },

  /* ---- electrolytes (label-verified July 2026) ---- */

  {
    "id": "gatorade-endurance-formula-powder",
    "name": "Endurance Formula Powder",
    "brand": "Gatorade",
    "category": "electrolytes",
    "stimFree": true,
    "badges": [
      "Fully Disclosed Label"
    ],
    "caffeineMg": 0,
    "keyIngredients": [
      {
        "name": "Sodium",
        "dose": "300 mg",
        "clinicalNote": "Sodium is the primary electrolyte lost in sweat and supports fluid balance and normal nerve and muscle function."
      },
      {
        "name": "Potassium",
        "dose": "140 mg",
        "clinicalNote": "Potassium works alongside sodium to help maintain fluid balance inside and outside cells."
      }
    ],
    "cautions": [
      "Contains 13 g of sugar per serving from added sugar and fructose.",
      "Roughly double the sodium of standard Gatorade Thirst Quencher powder, formulated for longer training sessions with heavier sweat losses."
    ],
    "servings": 38,
    "priceRange": "$",
    "flavorsNote": "Sold in Lemon-Lime, Orange, Cherry, and Watermelon, sweetened with sugar and fructose rather than artificial sweeteners.",
    "affiliateUrl": "https://www.amazon.com/s?k=gatorade+endurance+formula+powder&tag=YOURTAG-20",
    "blurb": "Roughly double the sodium and triple the potassium of standard Gatorade powder, aimed at longer sessions with heavier sweat losses rather than casual sipping.",
    "labelVerified": "July 2026",
    "imageUrl": "images/products/gatorade-endurance-formula-powder.png",
    "images": [
      "https://www.datocms-assets.com/101859/1692392101-gatorade_endurance_formula_lemonlime_pdpwhat_desktop.png?auto=format&fit=max&w=3840",
      "https://www.datocms-assets.com/101859/1691723715-10052000322825_gatorade_endurance_formula_lemonlime_producttile_2680x3344.png?ar64=MTox&fit=crop&fp-z=1.4&auto=format&w=3840",
      "https://www.datocms-assets.com/101859/1691723618-10052000322801_gatorade_endurance_formula_orange_producttile_2680x3344.png?ar64=MTox&fit=crop&fp-z=1.4&auto=format&w=256"
    ],
    "metrics": {
      "sodiumMg": 300,
      "potassiumMg": 140,
      "magnesiumMg": null,
      "sugarG": 13
    },
    "sources": [
      {
        "url": "https://www.gatorade.com/powders/endurance-formula/lemon-lime-powder-32-oz-canister",
        "label": "Gatorade — official product page"
      },
      {
        "url": "https://world.openfoodfacts.org/product/0052000322828/endurance-formula-powder-lemon-lime-gatorade",
        "label": "Open Food Facts — label transcription"
      }
    ]
  },

  {
    "id": "pedialyte-electrolyte-powder",
    "name": "Electrolyte Powder Packs",
    "brand": "Pedialyte",
    "category": "electrolytes",
    "stimFree": true,
    "badges": [
      "Fully Disclosed Label"
    ],
    "caffeineMg": 0,
    "keyIngredients": [
      {
        "name": "Sodium",
        "dose": "260 mg",
        "clinicalNote": "Sodium supports normal fluid balance and is the electrolyte most concentrated in this formula."
      },
      {
        "name": "Potassium",
        "dose": "180 mg",
        "clinicalNote": "Potassium supports normal muscle and nerve function alongside sodium."
      },
      {
        "name": "Chloride",
        "dose": "290 mg",
        "clinicalNote": "Chloride pairs with sodium to help the body maintain normal fluid balance."
      }
    ],
    "cautions": [
      "Contains 6 g of added sugar per packet.",
      "Formulated for general and pediatric hydration support; check with a doctor before use in infants under 1 year."
    ],
    "servings": 8,
    "priceRange": "$$",
    "flavorsNote": "Variety pack includes Fruit Punch, Grape, Apple, and Strawberry, sweetened with dextrose plus sucralose and acesulfame potassium.",
    "affiliateUrl": "https://www.amazon.com/s?k=pedialyte+electrolyte+powder+packets&tag=YOURTAG-20",
    "blurb": "A lower-sodium, lower-potassium formulation than Pedialyte Sport, dosed for everyday hydration support rather than heavy-sweat athletic use.",
    "labelVerified": "July 2026",
    "imageUrl": "images/products/pedialyte-electrolyte-powder.png",
    "images": [
      "https://www.pedialyte.com/products/powder-packs/grape/_jcr_content/root/container/columncontrol/tab_item_no_1/image_copy_copy.coreimg.png/1756488181417/powder-packs-grape-317x319-v1.png",
      "https://www.pedialyte.com/products/powder-packs/grape/_jcr_content/root/container/columncontrol/tab_item_no_1/columncontrol_copy_c/tab_item_no_0/image_copy.coreimg.jpeg/1691150365823/pedialyte-pdp-classic-powderpacks-grape-110x110.jpeg"
    ],
    "metrics": {
      "sodiumMg": 260,
      "potassiumMg": 180,
      "magnesiumMg": null,
      "sugarG": 6
    },
    "sources": [
      {
        "url": "https://abbottstore.com/infant-and-child/pedialyte/pedialyte-powder-packs/pedialyte-powderpacks/pedialyte-powder-packs-variety-8-5g-stickpacks-8-pack-56090p8.html",
        "label": "Abbott Store — official Pedialyte retailer, Nutrition Facts"
      },
      {
        "url": "https://giantfood.com/groceries/health-beauty/digestive-health-nausea/electrolyte-solution/pedialyte-variety-pack-electrolyte-powder-packets-8-ct-24-oz-box.html",
        "label": "Giant Food — product listing with Nutrition Facts"
      }
    ]
  },

  {
    "id": "pedialyte-sport-powder-packs",
    "name": "Sport Powder Packs",
    "brand": "Pedialyte",
    "category": "electrolytes",
    "stimFree": true,
    "badges": [
      "Fully Disclosed Label"
    ],
    "caffeineMg": 0,
    "keyIngredients": [
      {
        "name": "Sodium",
        "dose": "650 mg",
        "clinicalNote": "Sodium is the electrolyte lost in the largest amount through sweat during exercise."
      },
      {
        "name": "Potassium",
        "dose": "600 mg",
        "clinicalNote": "Potassium supports normal muscle contraction and fluid balance alongside sodium."
      },
      {
        "name": "Magnesium",
        "dose": "55 mg",
        "clinicalNote": "Magnesium supports normal muscle and nerve function as part of the electrolyte balance."
      }
    ],
    "cautions": [
      "Contains 7 g of added sugar per packet.",
      "Sodium and chloride levels are higher than standard hydration drinks; not intended for sodium-restricted diets without medical guidance."
    ],
    "servings": 36,
    "priceRange": "$$",
    "flavorsNote": "Available in Fruit Punch, Lemon-Lime, and Berry Freeze, sweetened with dextrose plus sucralose and acesulfame potassium.",
    "affiliateUrl": "https://www.amazon.com/s?k=pedialyte+sport+powder+packs&tag=YOURTAG-20",
    "blurb": "Delivers roughly 2.5 times the sodium of Pedialyte's classic powder, positioning it for athletes with heavier sweat losses rather than everyday sipping.",
    "labelVerified": "July 2026",
    "imageUrl": "images/products/pedialyte-sport-powder-packs.png",
    "imageBg": "255,255,255",
    "images": [
      "https://www.pedialyte.com/products/sport-powder-packs/fruit-punch/_jcr_content/root/container/columncontrol/tab_item_no_1/image_copy_copy_copy.coreimg.png/1756489259316/pedialyte-sport-powder-pack-fruit-punch-317-x-320.png",
      "https://www.pedialyte.com/products/sport-powder-packs/lemon-lime/_jcr_content/root/container/columncontrol/tab_item_no_1/image_copy_copy_copy.coreimg.png/1756489770398/pedialyte-sport-powder-pack-lemon-lime-317-x-320.png",
      "https://www.pedialyte.com/products/sport-powder-packs/lemon-lime/_jcr_content/root/container/columncontrol/tab_item_no_1/columncontrol_copy_c/tab_item_no_0/image_copy.coreimg.jpeg/1691150034895/pedialyte-pdp-sport-powderpacks-lemonlime-110x110.jpeg"
    ],
    "metrics": {
      "sodiumMg": 650,
      "potassiumMg": 600,
      "magnesiumMg": 55,
      "sugarG": 7
    },
    "sources": [
      {
        "url": "https://abbottstore.com/infant-and-child/pedialyte/pedialyte-powder-packs/pedialyte-sport-powder/pedialyte-sport-fruit-punch-powder-packs-0-48-oz-stickpack-36-count-67848.html",
        "label": "Abbott Store — official Pedialyte retailer, Nutrition Facts"
      }
    ]
  },

  {
    "id": "propel-powder-packets",
    "name": "Powder Packets",
    "brand": "Propel",
    "category": "electrolytes",
    "stimFree": true,
    "badges": [
      "Fully Disclosed Label"
    ],
    "caffeineMg": 0,
    "keyIngredients": [
      {
        "name": "Sodium",
        "dose": "260 mg",
        "clinicalNote": "Sodium supports normal fluid balance and is the main electrolyte in this formula."
      },
      {
        "name": "Potassium",
        "dose": "80 mg",
        "clinicalNote": "Potassium supports normal muscle and nerve function alongside sodium."
      },
      {
        "name": "Vitamin C & E blend",
        "dose": "with B3, B5, B6, B12",
        "clinicalNote": "Added vitamins support normal energy metabolism; they are not electrolytes themselves."
      }
    ],
    "cautions": [
      "Zero sugar and zero calories; sweetened with acesulfame potassium and sucralose rather than a carbohydrate source.",
      "Lower sodium and potassium per serving than most dedicated electrolyte mixes in this category."
    ],
    "servings": 50,
    "priceRange": "$",
    "flavorsNote": "Available in Berry, Grape, Lemon, Kiwi-Strawberry, and Mango, all zero-sugar and sweetened with acesulfame potassium and sucralose.",
    "affiliateUrl": "https://www.amazon.com/s?k=propel+powder+packets+electrolyte&tag=YOURTAG-20",
    "blurb": "A zero-sugar, zero-calorie electrolyte mix built around added B-vitamins and vitamins C and E, with lower sodium and potassium than most competitors in this set.",
    "labelVerified": "July 2026",
    "imageUrl": "images/products/propel-powder-packets.png",
    "images": [
      "https://www.datocms-assets.com/101859/1776347345-propel_powder_berry_pdpwhatyouget_desktop_2026_1812x2720.png?auto=format&fit=max&w=3840",
      "https://www.datocms-assets.com/101859/1776281628-propel_powder_berry_sachet_producttile_2026_2680x3344.png?ar64=MTox&fit=crop&fp-z=1.4&auto=format&w=256"
    ],
    "metrics": {
      "sodiumMg": 260,
      "potassiumMg": 80,
      "magnesiumMg": null,
      "sugarG": 0
    },
    "sources": [
      {
        "url": "https://www.gatorade.com/powders/propel/berry-single-serve-sticks",
        "label": "Propel (Gatorade) — official product page"
      }
    ]
  },

  {
    "id": "bodyarmor-flash-iv-electrolyte-sticks",
    "name": "Flash I.V. Electrolyte Drink Mix Sticks",
    "brand": "BodyArmor",
    "category": "electrolytes",
    "stimFree": true,
    "badges": [
      "Fully Disclosed Label"
    ],
    "caffeineMg": 0,
    "keyIngredients": [
      {
        "name": "Sodium",
        "dose": "510 mg",
        "clinicalNote": "Sodium supports normal fluid balance and is a major electrolyte lost through sweat."
      },
      {
        "name": "Potassium",
        "dose": "700 mg",
        "clinicalNote": "Potassium supports normal muscle contraction and fluid balance alongside sodium."
      },
      {
        "name": "Magnesium",
        "dose": "65 mg",
        "clinicalNote": "Magnesium supports normal muscle and nerve function as part of electrolyte balance."
      },
      {
        "name": "Calcium",
        "dose": "80 mg",
        "clinicalNote": "Calcium plays a role in normal muscle contraction alongside the other electrolytes here."
      }
    ],
    "cautions": [
      "Zero grams of sugar; sweetened with stevia leaf extract, and formulated with coconut water powder.",
      "This Lemon Lime variety is caffeine-free, but the Blue Raspberry flavor in this line contains caffeine — check the label before buying."
    ],
    "servings": 6,
    "priceRange": "$$",
    "flavorsNote": "Available in Lemon Lime, Tropical Punch, Strawberry Kiwi, and Blue Raspberry; only Blue Raspberry contains caffeine.",
    "affiliateUrl": "https://www.amazon.com/s?k=bodyarmor+flash+iv+electrolyte+drink+mix+sticks&tag=YOURTAG-20",
    "blurb": "Carries the highest total electrolyte load in this lineup, led by 700 mg potassium and 510 mg sodium per stick, in a zero-sugar powder built around coconut water powder.",
    "labelVerified": "July 2026",
    "metrics": {
      "sodiumMg": 510,
      "potassiumMg": 700,
      "magnesiumMg": 65,
      "sugarG": 0
    },
    "sources": [
      {
        "url": "https://foodlion.com/groceries/beverages/drink-mixes-water-enhancers/more-drink-mixes/bodyarmor-flash-iv-lemon-lime-electrolyte-drink-mix-6-ct-15-oz-box.html",
        "label": "Food Lion — product listing with Nutrition Facts"
      }
    ]
  },

  {
    "id": "emergen-c-hydration-plus",
    "name": "Hydration+ Sports Drink Mix",
    "brand": "Emergen-C",
    "category": "electrolytes",
    "stimFree": true,
    "badges": [
      "Fully Disclosed Label"
    ],
    "caffeineMg": 0,
    "keyIngredients": [
      {
        "name": "Potassium",
        "dose": "400 mg",
        "clinicalNote": "Potassium supports normal muscle and nerve function and fluid balance."
      },
      {
        "name": "Sodium",
        "dose": "160 mg",
        "clinicalNote": "Sodium supports normal fluid balance and is lost through sweat during activity."
      },
      {
        "name": "Magnesium",
        "dose": "120 mg",
        "clinicalNote": "Magnesium supports normal muscle and nerve function as part of electrolyte balance."
      },
      {
        "name": "Vitamin C",
        "dose": "250 mg",
        "clinicalNote": "Vitamin C is an antioxidant that supports normal immune system function."
      }
    ],
    "cautions": [
      "Contains 5 g total sugars per packet, including 4 g added sugar.",
      "Also supplies 384 mg phosphorus and 100 mg calcium per packet — factor this in if you track total mineral intake."
    ],
    "servings": 18,
    "priceRange": "$$",
    "flavorsNote": "Sold in Orange Spritz and Raspberry Splash, sweetened with a small amount of added sugar plus stevia leaf extract.",
    "affiliateUrl": "https://www.amazon.com/s?k=emergen-c+hydration+plus+drink+mix&tag=YOURTAG-20",
    "blurb": "Leads this set on magnesium disclosure at 120 mg per packet, paired with a 250 mg vitamin C dose that's unusually high for a hydration mix.",
    "labelVerified": "July 2026",
    "imageUrl": "images/products/emergen-c-hydration-plus.png",
    "imageBg": "255,255,255",
    "images": [
      "https://i-cf65.ch-static.com/content/dam/cf-consumer-healthcare/bp-emergenc/en_US/products/hydration-category.png?auto=format"
    ],
    "metrics": {
      "sodiumMg": 160,
      "potassiumMg": 400,
      "magnesiumMg": 120,
      "sugarG": 5
    },
    "sources": [
      {
        "url": "https://www.emergenc.com/content/dam/cf-consumer-healthcare/bp-emergenc/en_US/src/pdfs/lbl-00000641-web-ready-emergen-c-hydration+orange-spritz-(ve.pdf",
        "label": "Emergen-C — official Nutrition Facts label PDF"
      }
    ]
  },

  {
    "id": "trioral-oral-rehydration-salts",
    "name": "Oral Rehydration Salts",
    "brand": "Trioral",
    "category": "electrolytes",
    "stimFree": true,
    "badges": [
      "Fully Disclosed Label"
    ],
    "caffeineMg": 0,
    "keyIngredients": [
      {
        "name": "Sodium",
        "dose": "1725 mg (75 mEq) per packet as mixed",
        "clinicalNote": "Sodium supports fluid balance and is the electrolyte this formula is built around replacing."
      },
      {
        "name": "Potassium",
        "dose": "782 mg (20 mEq) per packet as mixed",
        "clinicalNote": "Potassium supports normal muscle and nerve function alongside sodium."
      },
      {
        "name": "Glucose",
        "dose": "13.5 g per packet",
        "clinicalNote": "Glucose is included at a WHO-specified ratio to support intestinal absorption of sodium."
      }
    ],
    "cautions": [
      "Mix the full packet with exactly 1 liter of water and discard any unused solution after 24 hours.",
      "Delivers roughly 1,725 mg sodium and 782 mg potassium once reconstituted — meant to be sipped gradually across the day, not consumed as a single dose.",
      "Consult a healthcare provider before use for infants, or for kidney, heart, or other conditions affected by sodium and potassium intake."
    ],
    "servings": 50,
    "priceRange": "$$",
    "flavorsNote": "Unflavored powder with no artificial sweeteners, flavors, colors, or preservatives.",
    "affiliateUrl": "https://www.amazon.com/s?k=trioral+oral+rehydration+salts&tag=YOURTAG-20",
    "blurb": "An unflavored, WHO-formula oral rehydration powder with higher sodium and potassium per liter than typical sports drinks; each packet is designed to be sipped across a day rather than taken as one serving.",
    "labelVerified": "July 2026",
    "imageUrl": "images/products/trioral-oral-rehydration-salts.jpg",
    "imageBg": "204,204,204",
    "images": [
      "https://trioralors.com/wp-content/uploads/2023/01/teaser.jpg"
    ],
    "metrics": {
      "sodiumMg": 1725,
      "potassiumMg": 782,
      "magnesiumMg": null,
      "sugarG": 13.5
    },
    "sources": [
      {
        "url": "https://trioralors.com/",
        "label": "TRIORAL — official product site"
      },
      {
        "url": "https://cdn.ymaws.com/oley.org/resource/resmgr/ors_recipes/ORS_recipes_handout.pdf",
        "label": "The Oley Foundation — oral rehydration solution composition reference"
      }
    ]
  },

  {
    "id": "vitalyte-electrolyte-replacement",
    "name": "Electrolyte Replacement Drink Mix",
    "brand": "Vitalyte",
    "category": "electrolytes",
    "stimFree": true,
    "badges": [
      "Fully Disclosed Label"
    ],
    "caffeineMg": 0,
    "keyIngredients": [
      {
        "name": "Sodium",
        "dose": "135 mg",
        "clinicalNote": "Sodium supports normal fluid balance and is lost through sweat during exercise."
      },
      {
        "name": "Potassium",
        "dose": "193 mg",
        "clinicalNote": "Potassium supports normal muscle and nerve function alongside sodium."
      },
      {
        "name": "Magnesium",
        "dose": "3 mg",
        "clinicalNote": "Magnesium is present in a minor amount here compared with the sodium and potassium doses."
      }
    ],
    "cautions": [
      "Contains 21 g of added sugar per serving from glucose and fructose.",
      "Lower sodium and potassium per serving than several rival electrolyte mixes in this category."
    ],
    "servings": 40,
    "priceRange": "$",
    "flavorsNote": "Available in Orange, Lemon, Grape, Fruit Punch, and Cool Citrus, sweetened primarily with glucose and fructose rather than artificial sweeteners.",
    "affiliateUrl": "https://www.amazon.com/s?k=vitalyte+electrolyte+replacement+drink+mix&tag=YOURTAG-20",
    "blurb": "A glucose-and-fructose-sweetened mix with a sodium-to-potassium ratio the brand designs to echo blood plasma, though its 21 g sugar per serving is among the highest in this set.",
    "labelVerified": "July 2026",
    "imageUrl": "images/products/vitalyte-electrolyte-replacement.jpg",
    "imageBg": "253,239,230",
    "images": [
      "https://vitalyte.com/cdn/shop/files/webmain1.jpg",
      "https://vitalyte.com/cdn/shop/files/71TOF8t7MML._AC_SL1500.jpg"
    ],
    "metrics": {
      "sodiumMg": 135,
      "potassiumMg": 193,
      "magnesiumMg": 3,
      "sugarG": 21
    },
    "sources": [
      {
        "url": "https://www.hydrationdepot.com/vitalyte-natural-grape-5-gallon-electrolyte-replacement-stand-up-pouch.html",
        "label": "Hydration Depot — product listing with Nutrition Facts"
      },
      {
        "url": "https://vitalyte.com/blogs/news/electrolyte-drink-mix-the-complete-science-based-guide-from-50-years-of-athlete-testing",
        "label": "Vitalyte — official electrolyte content reference"
      }
    ]
  },

  {
    "id": "prime-hydration-plus-sticks",
    "name": "Hydration Zero Sugar Stick Packs",
    "brand": "Prime",
    "category": "electrolytes",
    "stimFree": true,
    "badges": [
      "Fully Disclosed Label"
    ],
    "caffeineMg": 0,
    "keyIngredients": [
      {
        "name": "Potassium",
        "dose": "700 mg",
        "clinicalNote": "Potassium supports normal muscle and nerve function and fluid balance."
      },
      {
        "name": "Magnesium",
        "dose": "124 mg",
        "clinicalNote": "Magnesium supports normal muscle and nerve function as part of electrolyte balance."
      },
      {
        "name": "Sodium",
        "dose": "40 mg",
        "clinicalNote": "Sodium supports normal fluid balance, though the dose here is modest compared with potassium."
      }
    ],
    "cautions": [
      "Only 40 mg sodium per stick — among the lowest in this category, so it may not fully replace sodium lost through heavy sweating.",
      "Contains coconut water concentrate; the label carries a tree nut allergen statement for coconut."
    ],
    "servings": 6,
    "priceRange": "$$",
    "flavorsNote": "Available in Tropical Punch, Ice Pop, Blue Raspberry, and Meta Moon, sweetened with sucralose and zero added sugar.",
    "affiliateUrl": "https://www.amazon.com/s?k=prime+hydration+stick+packs+electrolyte&tag=YOURTAG-20",
    "blurb": "Leans heavily on potassium and magnesium at 700 mg and 124 mg per stick, while sodium sits at just 40 mg — the inverse ratio of most electrolyte mixes in this category.",
    "labelVerified": "July 2026",
    "imageUrl": "images/products/prime-hydration-plus-sticks.png",
    "images": [
      "https://drinkprime.com/cdn/shop/files/PRIME_stick_16serve_gussted_US_BerryCitrus_0000_1000x.png?v=1779132448",
      "https://drinkprime.com/cdn/shop/files/PRIME_stick_16serve_gussted_US_OceanCherry_0000_1000x.png?v=1779132384"
    ],
    "metrics": {
      "sodiumMg": 40,
      "potassiumMg": 700,
      "magnesiumMg": 124,
      "sugarG": 2
    },
    "sources": [
      {
        "url": "https://www.heb.com/product-detail/prime-hydration-zero-added-sugar-stick-packs-tropical-punch/10247035",
        "label": "H-E-B — product listing with Nutrition Facts"
      }
    ]
  },

  {
    "id": "zipfizz-energy-drink-mix",
    "name": "Energy Drink Mix",
    "brand": "Zipfizz",
    "category": "electrolytes",
    "stimFree": false,
    "badges": [
      "Low Stim",
      "Fully Disclosed Label"
    ],
    "caffeineMg": 100,
    "keyIngredients": [
      {
        "name": "Potassium",
        "dose": "950 mg",
        "clinicalNote": "Potassium supports normal muscle and nerve function and fluid balance."
      },
      {
        "name": "Caffeine (green tea leaf extract + guarana)",
        "dose": "100 mg",
        "clinicalNote": "Caffeine is commonly used to support alertness and reduce perceived effort during activity."
      },
      {
        "name": "Magnesium",
        "dose": "100 mg",
        "clinicalNote": "Magnesium supports normal muscle and nerve function as part of electrolyte balance."
      },
      {
        "name": "Sodium",
        "dose": "70 mg",
        "clinicalNote": "Sodium supports normal fluid balance, though the dose here is modest compared with potassium."
      }
    ],
    "cautions": [
      "Contains 100 mg caffeine from green tea leaf extract and guarana, about the same as a cup of coffee.",
      "950 mg potassium per serving is the highest dose in this category; consult a doctor if you take potassium-sparing medication or have kidney disease.",
      "Sweetened with sucralose; zero sugar."
    ],
    "servings": 20,
    "priceRange": "$$",
    "flavorsNote": "Sold in 20+ flavors including Grape, Citrus, and Pink Lemonade, sweetened with sucralose rather than sugar.",
    "affiliateUrl": "https://www.amazon.com/s?k=zipfizz+energy+drink+mix+electrolyte&tag=YOURTAG-20",
    "blurb": "Functions more like an energy drink than a pure hydration mix, pairing 100 mg caffeine with the highest potassium dose, 950 mg, of any product in this set.",
    "labelVerified": "July 2026",
    "imageUrl": "images/products/zipfizz-energy-drink-mix.png",
    "imageBg": "255,114,1",
    "images": [
      "https://zipfizz.com/cdn/shop/files/Zipfizz_Energy_Powder_-_Hover_State.png?v=1765559704&width=1080",
      "https://zipfizz.com/cdn/shop/files/Product_Color_BG_Orange_Soda_0e12ae1b-adb5-4a10-b30f-c73649e693cd.png?v=1765559704&width=1080"
    ],
    "metrics": {
      "sodiumMg": 70,
      "potassiumMg": 950,
      "magnesiumMg": 100,
      "sugarG": 0
    },
    "sources": [
      {
        "url": "https://www.carbmanager.com/food-detail/md:8205a6e6e1690501f90a9e0a2d181916/zipfizz-orange-soda-healthy-energy-drink-mix",
        "label": "Carb Manager — label nutrition data"
      },
      {
        "url": "https://zipfizz.com/pages/faq",
        "label": "Zipfizz — official FAQ (caffeine and sugar content)"
      }
    ]
  },

  {
    "id": "precision-fuel-hydration-ph-1500",
    "name": "PH 1500 Electrolyte Drink Mix",
    "brand": "Precision Fuel & Hydration",
    "category": "electrolytes",
    "stimFree": true,
    "badges": [
      "Fully Disclosed Label",
      "Third-Party Tested"
    ],
    "caffeineMg": 0,
    "keyIngredients": [
      {
        "name": "Sodium",
        "dose": "750 mg",
        "clinicalNote": "Sodium is the main electrolyte lost in sweat and is studied for its role in fluid balance and hydration during exercise."
      },
      {
        "name": "Potassium",
        "dose": "125 mg",
        "clinicalNote": "Potassium works alongside sodium to support normal fluid balance and muscle function."
      },
      {
        "name": "Magnesium",
        "dose": "12 mg",
        "clinicalNote": "Magnesium contributes to normal muscle and nerve function and to electrolyte balance."
      }
    ],
    "cautions": [
      "750 mg sodium per packet is one of the higher single-serving doses on the market; not intended for general daily hydration outside heavy sweat loss.",
      "Contains 15 g of sugar per serving from cane sugar; factor into daily carbohydrate intake.",
      "Talk to your doctor before use if you manage blood pressure or kidney conditions."
    ],
    "servings": 8,
    "priceRange": "$$$",
    "flavorsNote": "Fruit-flavored powder sweetened with cane sugar; no artificial sweeteners.",
    "affiliateUrl": "https://www.amazon.com/s?k=precision+hydration+ph+1500+electrolyte&tag=YOURTAG-20",
    "blurb": "Each 16 oz packet delivers 750 mg sodium and 125 mg potassium, among the highest per-serving sodium doses of any consumer electrolyte mix, built for heavy or salty sweaters rather than everyday hydration.",
    "labelVerified": "July 2026",
    "imageUrl": "images/products/precision-fuel-hydration-ph-1500.png",
    "images": [
      "https://cdn.shopify.com/s/files/1/0334/2368/7725/products/PH-1500-Packets-1.png?v=1668599009&width=1000",
      "https://cdn.shopify.com/s/files/1/0334/2368/7725/products/2-1500_SachetFront.jpg?v=1668599009&width=1000"
    ],
    "metrics": {
      "sodiumMg": 750,
      "potassiumMg": 125,
      "magnesiumMg": 12,
      "sugarG": 15
    },
    "sources": [
      {
        "url": "https://www.precisionhydration.com/us/en/products/ph-1500-electrolyte-drink-mix/",
        "label": "Precision Fuel & Hydration — official product page (PH 1500 powder)"
      }
    ]
  },

  {
    "id": "precision-fuel-hydration-ph-1000",
    "name": "PH 1000 Electrolyte Tablets",
    "brand": "Precision Fuel & Hydration",
    "category": "electrolytes",
    "stimFree": true,
    "badges": [
      "Fully Disclosed Label",
      "Third-Party Tested"
    ],
    "caffeineMg": 0,
    "keyIngredients": [
      {
        "name": "Sodium",
        "dose": "500 mg",
        "clinicalNote": "Sodium is the main electrolyte lost in sweat and is studied for its role in fluid balance and hydration during exercise."
      },
      {
        "name": "Potassium",
        "dose": "130 mg",
        "clinicalNote": "Potassium works alongside sodium to support normal fluid balance and muscle function."
      },
      {
        "name": "Magnesium",
        "dose": "10 mg",
        "clinicalNote": "Magnesium contributes to normal muscle and nerve function and to electrolyte balance."
      }
    ],
    "cautions": [
      "500 mg sodium per tablet is a moderate-to-high dose; not intended for general daily hydration outside exercise without medical guidance.",
      "NSF Certified for Sport confirms label accuracy and screening for banned substances but does not remove all risk of interaction with medications."
    ],
    "servings": 10,
    "priceRange": "$$",
    "flavorsNote": "Mild citrus-flavored effervescent tablet, low-calorie with minimal added sugar.",
    "affiliateUrl": "https://www.amazon.com/s?k=precision+hydration+ph+1000+tablets&tag=YOURTAG-20",
    "blurb": "One tablet dissolved in 16 oz of water provides 500 mg sodium and 130 mg potassium, the mid-strength option in Precision's tablet lineup, and it carries an NSF Certified for Sport mark.",
    "labelVerified": "July 2026",
    "imageUrl": "images/products/precision-fuel-hydration-ph-1000.webp",
    "images": [
      "https://cdn.shopify.com/s/files/1/0334/2368/7725/files/singleOpen_IM_2026_4477deac-8566-4ea1-bef4-ac6663fb7be8.webp?v=1765279380&width=1000",
      "https://cdn.shopify.com/s/files/1/0334/2368/7725/products/2-TabletInBottle.jpg?v=1765279380&width=1000"
    ],
    "metrics": {
      "sodiumMg": 500,
      "potassiumMg": 130,
      "magnesiumMg": 10,
      "sugarG": 2
    },
    "sources": [
      {
        "url": "https://www.precisionhydration.com/us/en/products/ph-1000-low-calorie-electrolyte-supplement/",
        "label": "Precision Fuel & Hydration — official product page (PH 1000 tablets)"
      }
    ]
  },

  {
    "id": "sis-go-hydro-tablets",
    "name": "GO Hydro Tablets",
    "brand": "Science in Sport",
    "category": "electrolytes",
    "stimFree": true,
    "badges": [
      "Fully Disclosed Label",
      "Third-Party Tested"
    ],
    "caffeineMg": 0,
    "keyIngredients": [
      {
        "name": "Sodium",
        "dose": "350 mg",
        "clinicalNote": "Sodium is the main electrolyte lost in sweat and is studied for its role in fluid balance and hydration during exercise."
      },
      {
        "name": "Potassium",
        "dose": "300 mg",
        "clinicalNote": "Potassium works alongside sodium to support normal fluid balance and muscle function."
      },
      {
        "name": "Magnesium",
        "dose": "56 mg",
        "clinicalNote": "Magnesium contributes to normal muscle and nerve function and to electrolyte balance."
      }
    ],
    "cautions": [
      "Label instructions cap intake at 4 tablets per day; do not exceed.",
      "Also supplies 750 mg chloride per tablet, so total electrolyte load per serving is high compared with lighter hydration tablets."
    ],
    "servings": 20,
    "priceRange": "$$",
    "flavorsNote": "Effervescent tablets in lemon and berry flavors, sugar-free.",
    "affiliateUrl": "https://www.amazon.com/s?k=science+in+sport+go+hydro+tablets&tag=YOURTAG-20",
    "blurb": "One tablet dissolved in 500 ml water supplies 350 mg sodium plus 300 mg potassium and 750 mg chloride, a fuller electrolyte spread than most tablet-format competitors, and it's Informed Sport tested.",
    "labelVerified": "July 2026",
    "imageUrl": "images/products/sis-go-hydro-tablets.png",
    "images": [
      "https://www.scienceinsport.com/media/catalog/product/h/y/hydro_single_lemon.png?optimize=medium&fit=bounds&height=680&width=680&canvas=680:680",
      "https://www.scienceinsport.com/media/wysiwyg/Phoenix_-_HYDRO_Tablets_-_Block_2.jpg",
      "https://www.scienceinsport.com/media/wysiwyg/Phoenix_-_HYDRO_Tablets_-_Block_3.jpg"
    ],
    "metrics": {
      "sodiumMg": 350,
      "potassiumMg": 300,
      "magnesiumMg": 56,
      "sugarG": 0
    },
    "sources": [
      {
        "url": "https://www.scienceinsport.com/sis-hydro-tablets-pack",
        "label": "Science in Sport — official product page (GO Hydro Tablets)"
      }
    ]
  },

  {
    "id": "gu-energy-hydration-drink-tabs",
    "name": "Hydration Drink Tabs",
    "brand": "GU Energy",
    "category": "electrolytes",
    "stimFree": true,
    "badges": [
      "Fully Disclosed Label",
      "Third-Party Tested"
    ],
    "caffeineMg": 0,
    "keyIngredients": [
      {
        "name": "Sodium",
        "dose": "320 mg",
        "clinicalNote": "Sodium is the main electrolyte lost in sweat and is studied for its role in fluid balance and hydration during exercise."
      },
      {
        "name": "Potassium",
        "dose": "55 mg",
        "clinicalNote": "Potassium works alongside sodium to support normal fluid balance and muscle function."
      }
    ],
    "cautions": [
      "320 mg sodium per tab is a relatively high single-serving dose; account for it if combining with other sodium sources.",
      "Sweetened partly with xylitol; those sensitive to sugar alcohols may notice digestive effects.",
      "A Strawberry Hibiscus flavor in this line contains caffeine — check the flavor before choosing if avoiding stimulants."
    ],
    "servings": 12,
    "priceRange": "$$",
    "flavorsNote": "Six flavors including one caffeinated option; sweetened with stevia, xylitol, and a small amount of cane sugar.",
    "affiliateUrl": "https://www.amazon.com/s?k=gu+hydration+drink+tabs&tag=YOURTAG-20",
    "blurb": "One tab dissolved in 16 oz of water delivers 320 mg sodium and 55 mg potassium for about 10 calories; magnesium and calcium are not disclosed on this panel.",
    "labelVerified": "July 2026",
    "imageUrl": "images/products/gu-energy-hydration-drink-tabs.png",
    "images": [
      "https://guenergy.com/cdn/shop/files/tubes_4.png?v=1719248200",
      "https://guenergy.com/cdn/shop/files/tubes_3.png?v=1697580425",
      "https://guenergy.com/cdn/shop/files/tubes_2.png?v=1697580425"
    ],
    "metrics": {
      "sodiumMg": 320,
      "potassiumMg": 55,
      "magnesiumMg": null,
      "sugarG": 1
    },
    "sources": [
      {
        "url": "https://guenergy.com/products/hydration-drink-tabs",
        "label": "GU Energy — official product page"
      },
      {
        "url": "https://thefeed.com/products/gu-brew-hydration-tablets",
        "label": "The Feed — retailer listing showing full Supplement Facts panel"
      }
    ]
  },

  {
    "id": "nuun-endurance",
    "name": "Endurance",
    "brand": "Nuun",
    "category": "electrolytes",
    "stimFree": true,
    "badges": [
      "Fully Disclosed Label",
      "Third-Party Tested"
    ],
    "caffeineMg": 0,
    "keyIngredients": [
      {
        "name": "Sodium",
        "dose": "380 mg",
        "clinicalNote": "Sodium is the main electrolyte lost in sweat and is studied for its role in fluid balance and hydration during exercise."
      },
      {
        "name": "Potassium",
        "dose": "200 mg",
        "clinicalNote": "Potassium works alongside sodium to support normal fluid balance and muscle function."
      },
      {
        "name": "Magnesium",
        "dose": "20 mg",
        "clinicalNote": "Magnesium contributes to normal muscle and nerve function and to electrolyte balance."
      }
    ],
    "cautions": [
      "Contains 16 g carbohydrate (15 g sugar) per serving; factor into carbohydrate intake during long sessions.",
      "A caffeinated Strawberry Lemonade flavor (25 mg) exists in this line — confirm flavor before use if avoiding stimulants."
    ],
    "servings": 16,
    "priceRange": "$$",
    "flavorsNote": "Plant-based powder with dual carbohydrate sources, sold in Mixed Berry, Lemon Lime, Citrus Mango, and a caffeinated Strawberry Lemonade.",
    "affiliateUrl": "https://www.amazon.com/s?k=nuun+endurance+electrolyte+drink+mix&tag=YOURTAG-20",
    "blurb": "Distinct from Nuun Sport, this scoop-based mix pairs a higher electrolyte dose (380 mg sodium, 200 mg potassium) with 16 g of carbohydrate per serving, aimed at sessions past 90 minutes.",
    "labelVerified": "July 2026",
    "imageUrl": "images/products/nuun-endurance.png",
    "images": [
      "https://cdn.shopify.com/s/files/1/0014/3563/1652/files/3D_Canister-Front_Endurance_Citrus-Mango_r1v1_large.png?v=1552611748",
      "https://cdn.shopify.com/s/files/1/1515/2714/products/nuun-hydration-citrus-mango-16-serving-canister-nuun-endurance-14599688126527.jpg",
      "https://cdn.shopify.com/s/files/1/1515/2714/products/nuun-hydration-nuun-endurance-14599688290367_1200x1200.jpg"
    ],
    "metrics": {
      "sodiumMg": 380,
      "potassiumMg": 200,
      "magnesiumMg": 20,
      "sugarG": 15
    },
    "sources": [
      {
        "url": "https://thefeed.com/products/nuun-endurance",
        "label": "The Feed — retailer listing showing full Supplement Facts panel"
      },
      {
        "url": "https://nuunlife.com/blogs/news/introducing-nuun-endurance",
        "label": "Nuun — official product announcement"
      }
    ]
  },

  {
    "id": "saltstick-fastchews",
    "name": "FastChews",
    "brand": "SaltStick",
    "category": "electrolytes",
    "stimFree": true,
    "badges": [
      "Fully Disclosed Label",
      "Third-Party Tested"
    ],
    "caffeineMg": 0,
    "keyIngredients": [
      {
        "name": "Sodium",
        "dose": "100 mg",
        "clinicalNote": "Sodium is the main electrolyte lost in sweat and is studied for its role in fluid balance and hydration during exercise."
      },
      {
        "name": "Potassium",
        "dose": "30 mg",
        "clinicalNote": "Potassium works alongside sodium to support normal fluid balance and muscle function."
      },
      {
        "name": "Magnesium",
        "dose": "6 mg",
        "clinicalNote": "Magnesium contributes to normal muscle and nerve function and to electrolyte balance."
      }
    ],
    "cautions": [
      "The labeled serving is 2 chews; the product is meant for repeated small doses through a race, not one large bolus.",
      "Contains 2 g added sugar per 2-chew serving from dextrose."
    ],
    "servings": 30,
    "priceRange": "$",
    "flavorsNote": "Chewable tablets sweetened with dextrose and stevia leaf extract, in several fruit flavors.",
    "affiliateUrl": "https://www.amazon.com/s?k=saltstick+fastchews+electrolyte&tag=YOURTAG-20",
    "blurb": "The labeled serving of 2 chews provides 100 mg sodium and 30 mg potassium; built to be dosed repeatedly through exercise rather than mixed as a drink.",
    "labelVerified": "July 2026",
    "imageUrl": "images/products/saltstick-fastchews.png",
    "imageBg": "255,255,255",
    "images": [
      "https://aletenutrition.com/cdn/shop/files/SaltStick-FastChews-Lemon-Lime-60ct-Packet_Hero.png?v=1778523638&width=1946",
      "https://cdn.shopify.com/s/files/1/0510/6660/1644/files/SS_FC_60ct_BottleRenders_LemonLime_0426.png?v=1778627260"
    ],
    "metrics": {
      "sodiumMg": 100,
      "potassiumMg": 30,
      "magnesiumMg": 6,
      "sugarG": 2
    },
    "sources": [
      {
        "url": "https://aletenutrition.com/products/saltstick-fastchews-lemon-lime-1",
        "label": "Alete Nutrition — authorized SaltStick retailer, full Supplement Facts panel"
      }
    ]
  },

  {
    "id": "first-endurance-efs-drink-mix",
    "name": "EFS Drink Mix",
    "brand": "First Endurance",
    "category": "electrolytes",
    "stimFree": true,
    "badges": [
      "Fully Disclosed Label"
    ],
    "caffeineMg": 0,
    "keyIngredients": [
      {
        "name": "Sodium",
        "dose": "300 mg",
        "clinicalNote": "Sodium is the main electrolyte lost in sweat and is studied for its role in fluid balance and hydration during exercise."
      },
      {
        "name": "Potassium",
        "dose": "160 mg",
        "clinicalNote": "Potassium works alongside sodium to support normal fluid balance and muscle function."
      },
      {
        "name": "Magnesium",
        "dose": "150 mg",
        "clinicalNote": "Magnesium contributes to normal muscle and nerve function and to electrolyte balance."
      }
    ],
    "cautions": [
      "Contains 25 g of added sugar per serving as part of a 30 g carbohydrate energy drink; not a low-sugar hydration option.",
      "465 mg chloride plus 300 mg sodium per serving is a substantial electrolyte load suited for extended exercise rather than casual sipping."
    ],
    "servings": 30,
    "priceRange": "$$",
    "flavorsNote": "Powder in Orange Splash, Fruit Punch, and Sour Watermelon, sweetened with cane sugar and dextrose.",
    "affiliateUrl": "https://www.amazon.com/s?k=first+endurance+efs+drink+mix&tag=YOURTAG-20",
    "blurb": "One 35 g scoop mixed with water supplies 300 mg sodium, 160 mg potassium, and 150 mg magnesium alongside 30 g of carbohydrate (25 g added sugar), positioning it as a combined fuel-and-electrolyte drink rather than a low-sugar hydration mix.",
    "labelVerified": "July 2026",
    "imageUrl": "images/products/first-endurance-efs-drink-mix.jpg",
    "imageBg": "255,255,255",
    "images": [
      "https://cdn.shopify.com/s/files/1/0659/0182/2211/files/shopify-efs-fp-24.jpg?v=1715723179",
      "https://cdn.shopify.com/s/files/1/0659/0182/2211/products/efs-fp-tray.png?v=1715723179"
    ],
    "metrics": {
      "sodiumMg": 300,
      "potassiumMg": 160,
      "magnesiumMg": 150,
      "sugarG": 25
    },
    "sources": [
      {
        "url": "https://firstendurance.com/products/efs-drink",
        "label": "First Endurance — official product page"
      }
    ]
  },

  {
    "id": "hammer-nutrition-heed",
    "name": "HEED Sports Drink",
    "brand": "Hammer Nutrition",
    "category": "electrolytes",
    "stimFree": true,
    "badges": [
      "Fully Disclosed Label",
      "Budget Pick"
    ],
    "caffeineMg": 0,
    "keyIngredients": [
      {
        "name": "Sodium",
        "dose": "150 mg",
        "clinicalNote": "Sodium is the main electrolyte lost in sweat and is studied for its role in fluid balance and hydration during exercise."
      },
      {
        "name": "Potassium",
        "dose": "35 mg",
        "clinicalNote": "Potassium works alongside sodium to support normal fluid balance and muscle function."
      },
      {
        "name": "Magnesium",
        "dose": "31 mg",
        "clinicalNote": "Magnesium contributes to normal muscle and nerve function and to electrolyte balance."
      }
    ],
    "cautions": [
      "A Cherry Bomb flavor variant in this line contains 25 mg caffeine and 500 mg taurine — confirm flavor before use if avoiding stimulants.",
      "Sodium (150 mg) is lower than many endurance mixes; heavy or salty sweaters may need additional sodium from another source."
    ],
    "servings": 32,
    "priceRange": "$",
    "flavorsNote": "Powder in multiple fruit flavors; low-sugar formula relying mainly on complex carbohydrate (maltodextrin) for energy.",
    "affiliateUrl": "https://www.amazon.com/s?k=hammer+nutrition+heed+sports+drink&tag=YOURTAG-20",
    "blurb": "One 30 g scoop provides 150 mg sodium and 35 mg potassium with only 2 g of sugar, drawing most of its 28 g carbohydrate from complex carbohydrate rather than simple sugars.",
    "labelVerified": "July 2026",
    "imageUrl": "images/products/hammer-nutrition-heed.jpg",
    "imageBg": "255,255,255",
    "images": [
      "https://hammernutrition.com/cdn/shop/files/HCB70_25_1200x.progressive.jpg?v=1747863941",
      "https://hammernutrition.com/cdn/shop/files/HCB32_25_204x.progressive.jpg?v=1747863941"
    ],
    "metrics": {
      "sodiumMg": 150,
      "potassiumMg": 35,
      "magnesiumMg": 31,
      "sugarG": 2
    },
    "sources": [
      {
        "url": "https://hammernutrition.com/products/heed-sports-drink",
        "label": "Hammer Nutrition — official product page"
      }
    ]
  },

  {
    "id": "maurten-drink-mix-320",
    "name": "Drink Mix 320",
    "brand": "Maurten",
    "category": "electrolytes",
    "stimFree": true,
    "badges": [
      "Fully Disclosed Label"
    ],
    "caffeineMg": 0,
    "keyIngredients": [
      {
        "name": "Sodium",
        "dose": "245 mg",
        "clinicalNote": "Sodium is the main electrolyte lost in sweat and is studied for its role in fluid balance and hydration during exercise."
      },
      {
        "name": "Carbohydrate (maltodextrin + fructose)",
        "dose": "78 g",
        "clinicalNote": "A mixed glucose-fructose carbohydrate source is studied for supporting higher carbohydrate absorption rates during prolonged exercise than single-source formulas."
      }
    ],
    "cautions": [
      "A very high carbohydrate load (78 g) per serving is intended for race or training fueling, not general hydration; introduce gradually to assess GI tolerance.",
      "The label does not disclose potassium or magnesium; pair with another source if targeting full electrolyte replacement."
    ],
    "servings": 14,
    "priceRange": "$$$",
    "flavorsNote": "Neutral-forward flavor typical of hydrogel-technology drink mixes; each 83 g sachet is mixed with 500 ml water.",
    "affiliateUrl": "https://www.amazon.com/s?k=maurten+drink+mix+320&tag=YOURTAG-20",
    "blurb": "Each 83 g sachet mixed with 500 ml water (the label's own serving) is built primarily as a carbohydrate fuel — 78 g carbohydrate including 37 g sugar — using hydrogel-encapsulated maltodextrin and fructose; sodium is 245 mg and potassium/magnesium are not disclosed.",
    "labelVerified": "July 2026",
    "imageUrl": "images/products/maurten-drink-mix-320.png",
    "images": [
      "https://maurten.imgix.net/photos/Products/Entry-Card-Maurten-Drink-Mix-320-1.png?auto=compress%2Cformat&fit=max&q=80&w=120&s=f3d7495dec7fea87fba326ce887c16ac",
      "https://maurten.imgix.net/branding/Screenshot-2025-03-14-at-16.39.51.png?auto=compress%2Cformat&fit=max&q=80&w=1000&s=165f3bb0f1c61dc593dae9d44fba39ea"
    ],
    "metrics": {
      "sodiumMg": 245,
      "potassiumMg": null,
      "magnesiumMg": null,
      "sugarG": 37
    },
    "sources": [
      {
        "url": "https://www.maurten.com.au/products/drink-mix-320",
        "label": "Maurten Australia — official regional site, full nutrition panel"
      },
      {
        "url": "https://www.runningwarehouse.com/Maurten_Drink_Mix_320/descpage-MAU12.html",
        "label": "Running Warehouse — retailer listing showing Nutrition Facts panel"
      }
    ]
  },

  {
    "id": "amacx-hydro-tabs",
    "name": "Hydro Tabs",
    "brand": "Amacx",
    "category": "electrolytes",
    "stimFree": true,
    "badges": [
      "Fully Disclosed Label",
      "Third-Party Tested"
    ],
    "caffeineMg": 0,
    "keyIngredients": [
      {
        "name": "Sodium",
        "dose": "205 mg",
        "clinicalNote": "Sodium is the main electrolyte lost in sweat and is studied for its role in fluid balance and hydration during exercise."
      },
      {
        "name": "Potassium",
        "dose": "70 mg",
        "clinicalNote": "Potassium works alongside sodium to support normal fluid balance and muscle function."
      },
      {
        "name": "Magnesium",
        "dose": "56 mg",
        "clinicalNote": "Magnesium contributes to normal muscle and nerve function and to electrolyte balance."
      }
    ],
    "cautions": [
      "Label instructions cap intake at 3 tablets per day; do not exceed.",
      "Also supplies 28 mg vitamin C per tablet in addition to electrolytes."
    ],
    "servings": 20,
    "priceRange": "$$",
    "flavorsNote": "Effervescent, sugar-free tablets sweetened with sucralose, dissolved in 500-750 ml water.",
    "affiliateUrl": "https://www.amazon.com/s?k=amacx+hydro+tabs+electrolyte&tag=YOURTAG-20",
    "blurb": "One tablet dissolved in 500-750 ml water supplies 205 mg sodium, 70 mg potassium, and 56 mg magnesium with no sugar; Informed Sport certified.",
    "labelVerified": "July 2026",
    "imageUrl": "images/products/amacx-hydro-tabs.webp",
    "imageBg": "255,255,255",
    "images": [
      "https://amacx.com/cdn/shop/files/6e2a9831a8c7820ffbd216fab9193f846fd826c0_Hydro_Tabs_Lime___3_pack_Amacx_73203849__1_cf33a78e-0aee-4f60-bc51-1114b81bb594.webp?v=1783693090&width=800",
      "https://amacx.com/cdn/shop/files/7aeec5b3e7b075e12cc1a69f7860aea10bc89db0_Hydro_tabs_lime_visma_b13b4e1b-3081-45cf-a66c-dbc59c1029db.jpg?v=1783693091&width=800"
    ],
    "metrics": {
      "sodiumMg": 205,
      "potassiumMg": 70,
      "magnesiumMg": 56,
      "sugarG": 0
    },
    "sources": [
      {
        "url": "https://amacx.com/products/hydro-tabs-lime",
        "label": "Amacx — official product page"
      }
    ]
  },

  {
    "id": "key-nutrients-electrolyte-recovery-plus",
    "name": "Electrolyte Recovery Plus",
    "brand": "Key Nutrients",
    "category": "electrolytes",
    "stimFree": true,
    "badges": [
      "Fully Disclosed Label"
    ],
    "caffeineMg": 0,
    "keyIngredients": [
      {
        "name": "Sodium (sodium chloride)",
        "dose": "110 mg",
        "clinicalNote": "Sodium is the primary electrolyte lost in sweat and is studied for its role in fluid balance."
      },
      {
        "name": "Potassium (potassium aspartate)",
        "dose": "250 mg",
        "clinicalNote": "Potassium works alongside sodium to support normal muscle and nerve function."
      },
      {
        "name": "Magnesium (magnesium citrate)",
        "dose": "100 mg",
        "clinicalNote": "Provides 25% of the Daily Value; magnesium supports normal muscle relaxation and energy metabolism."
      },
      {
        "name": "Zinc (zinc citrate)",
        "dose": "2.9 mg",
        "clinicalNote": "Zinc contributes to normal immune function alongside the electrolyte blend."
      }
    ],
    "cautions": [
      "Only 110 mg sodium per packet — light for replacing heavy sweat losses compared with sodium-forward mixes",
      "Naturally sweetened with stevia leaf extract (Reb A); no sugar or calories",
      "Packet also supplies 20 vitamins and minerals beyond electrolytes — check total intake if you take a separate multivitamin"
    ],
    "servings": 20,
    "priceRange": "$",
    "flavorsNote": "Wide lineup including Lemonade, Blueberry Lemonade, Peach Mango, and Watermelon, all sweetened with stevia leaf extract and naturally flavored.",
    "affiliateUrl": "https://www.amazon.com/s?k=key+nutrients+electrolyte+recovery+plus&tag=YOURTAG-20",
    "blurb": "Vitamin-heavy formula: a light 110 mg sodium dose sits alongside 20 total vitamins and minerals, including 25% DV magnesium, on a fully itemized zero-calorie label.",
    "labelVerified": "July 2026",
    "metrics": {
      "sodiumMg": 110,
      "potassiumMg": 250,
      "magnesiumMg": 100,
      "sugarG": 0
    },
    "sources": [
      {
        "url": "https://keynutrients.com/products/electrolyte-recovery-plus",
        "label": "Key Nutrients — official product page and label image"
      }
    ]
  },

  {
    "id": "cure-hydration-electrolyte-mix",
    "name": "Hydrating Electrolyte Mix",
    "brand": "Cure",
    "category": "electrolytes",
    "stimFree": true,
    "badges": [
      "Fully Disclosed Label"
    ],
    "caffeineMg": 0,
    "keyIngredients": [
      {
        "name": "Sodium (pink Himalayan salt)",
        "dose": "240 mg",
        "clinicalNote": "Sodium is studied for its role in fluid retention and absorption, the basis of oral-rehydration formulas."
      },
      {
        "name": "Potassium",
        "dose": "310 mg",
        "clinicalNote": "Potassium supports fluid balance alongside sodium and contributes to normal muscle function."
      },
      {
        "name": "Coconut water powder + fruit juice powder",
        "dose": "4 g total sugars",
        "clinicalNote": "Carbohydrate paired with sodium reflects the WHO oral-rehydration-solution ratio studied for fluid absorption."
      }
    ],
    "cautions": [
      "4 g of sugar per packet from fruit and coconut water powder — labeled 'no added sugar' but not a zero-sugar mix",
      "240 mg sodium counts toward daily sodium intake if you're tracking it",
      "Magnesium is not listed on the Nutrition Facts panel"
    ],
    "servings": 14,
    "priceRange": "$$",
    "flavorsNote": "Grapefruit is one of several fruit-forward flavors (also Watermelon, Lemon, Pink Lemonade); sweetened only with real fruit and coconut water, no added sugar or artificial sweeteners.",
    "affiliateUrl": "https://www.amazon.com/s?k=cure+hydration+electrolyte+mix&tag=YOURTAG-20",
    "blurb": "Built to WHO oral-rehydration-solution ratios: 240 mg sodium and 310 mg potassium paired with 4 g of fruit-derived sugar rather than an added sweetener; magnesium isn't disclosed on the panel.",
    "labelVerified": "July 2026",
    "imageUrl": "images/products/cure-hydration-electrolyte-mix.jpg",
    "imageBg": "241,237,234",
    "images": [
      "https://www.curehydration.com/cdn/shop/files/Cure-Pouch-Packet-Grapefruit_c9b23260-236c-40c2-b5af-1e3cee28edd0_1000x.jpg",
      "https://www.curehydration.com/cdn/shop/files/Cure-Pouch-Classic-Variety-Front.jpg"
    ],
    "metrics": {
      "sodiumMg": 240,
      "potassiumMg": 310,
      "magnesiumMg": null,
      "sugarG": 4
    },
    "sources": [
      {
        "url": "https://www.curehydration.com/products/hydrating-electrolyte-mix-grapefruit",
        "label": "Cure — official product page (Grapefruit Nutrition Facts)"
      }
    ]
  },

  {
    "id": "hydrant-rapid-hydration-mix",
    "name": "Rapid Hydration Mix",
    "brand": "Hydrant",
    "category": "electrolytes",
    "stimFree": true,
    "badges": [
      "Fully Disclosed Label"
    ],
    "caffeineMg": 0,
    "keyIngredients": [
      {
        "name": "Sodium citrate",
        "dose": "260 mg",
        "clinicalNote": "Sodium activates water absorption in the gut, the mechanism behind WHO-style rehydration formulas."
      },
      {
        "name": "Potassium citrate",
        "dose": "200 mg",
        "clinicalNote": "Potassium supports normal nerve function and works with sodium to maintain fluid balance."
      },
      {
        "name": "Magnesium gluconate",
        "dose": "30 mg",
        "clinicalNote": "Magnesium supports over 300 normal enzymatic reactions in the body, including energy metabolism."
      },
      {
        "name": "Zinc gluconate",
        "dose": "2 mg",
        "clinicalNote": "Zinc contributes to normal immune function alongside the core electrolyte blend."
      }
    ],
    "cautions": [
      "4 g of cane sugar per stick in this Core Blend formula — Hydrant also sells a monk-fruit zero-sugar line if you want to avoid it",
      "260 mg sodium counts toward daily sodium intake",
      "Formulated for active sweat replacement, not an everyday sipping mix"
    ],
    "servings": 30,
    "priceRange": "$$",
    "flavorsNote": "Blood Orange, Lemon Lime, and Fruit Punch use a cane-sugar Core Blend; a separate Zero Sugar line swaps in monk fruit extract.",
    "affiliateUrl": "https://www.amazon.com/s?k=hydrant+rapid+hydration+mix&tag=YOURTAG-20",
    "blurb": "Mid-range sodium (260 mg) built on the WHO glucose-sodium cotransport ratio, with 4 g of cane sugar doing the absorption work rather than allulose or stevia.",
    "labelVerified": "July 2026",
    "imageUrl": "images/products/hydrant-rapid-hydration-mix.png",
    "images": [
      "https://www.drinkhydrant.com/cdn/shop/files/01-Hydration-Variety-Front-min.png",
      "https://www.drinkhydrant.com/cdn/shop/files/HYD_Bulk-Grapefruit_PDP_1080_1.png"
    ],
    "metrics": {
      "sodiumMg": 260,
      "potassiumMg": 200,
      "magnesiumMg": 30,
      "sugarG": 4
    },
    "sources": [
      {
        "url": "https://www.drinkhydrant.com/products/hydration-mix",
        "label": "Hydrant — official product page (Blood Orange ingredient panel)"
      }
    ]
  },

  {
    "id": "kaged-hydra-charge",
    "name": "Hydra-Charge",
    "brand": "Kaged",
    "category": "electrolytes",
    "stimFree": true,
    "badges": [
      "Fully Disclosed Label",
      "Third-Party Tested"
    ],
    "caffeineMg": 0,
    "keyIngredients": [
      {
        "name": "Sodium",
        "dose": "115 mg",
        "clinicalNote": "A moderate sodium dose studied for its role in fluid retention without pushing daily sodium too high."
      },
      {
        "name": "Potassium",
        "dose": "107 mg",
        "clinicalNote": "Potassium works alongside sodium to support normal muscle contraction and fluid balance."
      },
      {
        "name": "Magnesium (citrate)",
        "dose": "15 mg",
        "clinicalNote": "Magnesium contributes to normal energy metabolism and muscle function."
      },
      {
        "name": "Coconut water powder",
        "dose": "500 mg",
        "clinicalNote": "A whole-food source of additional potassium and trace minerals."
      }
    ],
    "cautions": [
      "Sweetened with steviol glycosides and sucralose — check the label if avoiding artificial sweeteners",
      "115 mg sodium is moderate; pair with added salt if replacing large sweat losses",
      "Contains 1,000 mg taurine per serving"
    ],
    "servings": 30,
    "priceRange": "$$",
    "flavorsNote": "Red Raspberry among a dozen flavors including Watermelon and Piña Colada; sweetened with steviol glycosides and sucralose.",
    "affiliateUrl": "https://www.amazon.com/s?k=kaged+hydra+charge+electrolyte&tag=YOURTAG-20",
    "blurb": "Informed Sport-certified electrolyte scoop with a moderate 115 mg sodium dose, coconut water powder, and an antioxidant blend layered on top of the base minerals.",
    "labelVerified": "July 2026",
    "imageUrl": "images/products/kaged-hydra-charge.png",
    "images": [
      "https://cdn.shopify.com/s/files/1/1110/3248/files/HydrationRedRaspberryFront.png?v=1774385176",
      "https://cdn.shopify.com/s/files/1/1110/3248/files/Hydration30servings-AMZ_HydrationSFPRR30srvLarge.jpg?v=1774385176"
    ],
    "metrics": {
      "sodiumMg": 115,
      "potassiumMg": 107,
      "magnesiumMg": 15,
      "sugarG": 0
    },
    "sources": [
      {
        "url": "https://www.kaged.com/products/hydra-charge-30sv",
        "label": "Kaged — official product page (30-serving Nutrition Facts)"
      }
    ]
  },

  {
    "id": "jocko-fuel-rapid-hydration-plus",
    "name": "Rapid Hydration+ Electrolyte Stick Packets",
    "brand": "Jocko Fuel",
    "category": "electrolytes",
    "stimFree": true,
    "badges": [
      "Fully Disclosed Label"
    ],
    "caffeineMg": 0,
    "keyIngredients": [
      {
        "name": "Sodium",
        "dose": "500 mg",
        "clinicalNote": "A sodium-forward dose studied for replacing what's lost during heavy sweating."
      },
      {
        "name": "Chloride",
        "dose": "740 mg",
        "clinicalNote": "Chloride works with sodium to help maintain normal fluid and acid-base balance."
      },
      {
        "name": "Potassium",
        "dose": "350 mg",
        "clinicalNote": "Potassium supports normal muscle contraction and fluid balance alongside sodium."
      },
      {
        "name": "Magnesium",
        "dose": "120 mg",
        "clinicalNote": "Magnesium contributes to normal muscle relaxation and energy metabolism."
      }
    ],
    "cautions": [
      "500 mg sodium per stick is high — significant if you're also salting food or using other electrolyte products the same day",
      "Sweetened with allulose and Reb-M monk fruit extract, not sugar",
      "Formulated for active sweat replacement, not everyday casual sipping"
    ],
    "servings": 12,
    "priceRange": "$$",
    "flavorsNote": "Strawberry, Blue Raspberry, Fruit Punch, Island Orange, and Lemon-Lime, all zero-sugar and sweetened with allulose and monk fruit extract.",
    "affiliateUrl": "https://www.amazon.com/s?k=jocko+fuel+rapid+hydration&tag=YOURTAG-20",
    "blurb": "One of the highest-sodium sticks in the category at 500 mg, plus 740 mg chloride and 120 mg magnesium — built for heavy sweat loss rather than light daily sipping.",
    "labelVerified": "July 2026",
    "imageUrl": "images/products/jocko-fuel-rapid-hydration-plus.jpg",
    "imageBg": "246,244,245",
    "images": [
      "https://cdn.shopify.com/s/files/1/0793/7802/2695/files/STRAW_12_1.jpg?v=1782151900",
      "https://cdn.shopify.com/s/files/1/0793/7802/2695/files/JF-Hydrate_-Flavor-chart.jpg?v=1782148362"
    ],
    "metrics": {
      "sodiumMg": 500,
      "potassiumMg": 350,
      "magnesiumMg": 120,
      "sugarG": 0
    },
    "sources": [
      {
        "url": "https://jockofuel.com/products/rapid-hydration",
        "label": "Jocko Fuel — official product page (Rapid Hydration+ 12-pack)"
      },
      {
        "url": "https://www.priceplow.com/jocko-fuel/rapid-hydration-electrolyte-stick-packets",
        "label": "PricePlow — Supplement Facts transcription"
      }
    ]
  },

  {
    "id": "lyteshow-electrolyte-concentrate",
    "name": "Electrolyte Concentrate",
    "brand": "LyteShow",
    "category": "electrolytes",
    "stimFree": true,
    "badges": [
      "Fully Disclosed Label"
    ],
    "caffeineMg": 0,
    "keyIngredients": [
      {
        "name": "Magnesium",
        "dose": "40 mg",
        "clinicalNote": "Magnesium contributes to normal muscle and energy metabolism and is often under-supplied in liquid electrolyte drops."
      },
      {
        "name": "Potassium (chloride)",
        "dose": "130 mg",
        "clinicalNote": "Potassium supports normal fluid balance and muscle function alongside sodium."
      },
      {
        "name": "Sodium (sea mineral concentrate)",
        "dose": "125 mg",
        "clinicalNote": "A lower sodium dose intended to be added to water throughout the day rather than replace one large sweat loss."
      },
      {
        "name": "Zinc (sulfate)",
        "dose": "2 mg",
        "clinicalNote": "Zinc contributes to normal immune function."
      }
    ],
    "cautions": [
      "Low-sodium formula (125 mg) — not designed to replace large single sweat losses on its own",
      "Liquid concentrate: measure the 3 mL (about 40-drop) dose rather than drinking it straight",
      "Contains zinc sulfate; account for this if you also take a separate zinc supplement"
    ],
    "servings": 40,
    "priceRange": "$$",
    "flavorsNote": "Unflavored with a subtle mineral taste; free of sweeteners, starch, and common allergens.",
    "affiliateUrl": "https://www.amazon.com/s?k=lyteshow+electrolyte+concentrate&tag=YOURTAG-20",
    "blurb": "A 3 mL drop dose (about 40 drops) rather than a mixed drink: lower sodium than most powders, but one of the few labels that discloses magnesium (40 mg) and zinc (2 mg) alongside sodium and potassium.",
    "labelVerified": "July 2026",
    "metrics": {
      "sodiumMg": 125,
      "potassiumMg": 130,
      "magnesiumMg": 40,
      "sugarG": 0
    },
    "sources": [
      {
        "url": "https://dsld.od.nih.gov/label/46571",
        "label": "NIH Dietary Supplement Label Database — LyteShow label transcription"
      },
      {
        "url": "https://www.lyteline.com/products/electrolyte-concentrate-lyteshow",
        "label": "LyteLine (LyteShow) — official product page"
      }
    ]
  },

  {
    "id": "dr-berg-electrolyte-powder",
    "name": "Electrolyte Powder",
    "brand": "Dr. Berg",
    "category": "electrolytes",
    "stimFree": true,
    "badges": [
      "Fully Disclosed Label"
    ],
    "caffeineMg": 0,
    "keyIngredients": [
      {
        "name": "Potassium (citrate)",
        "dose": "1000 mg",
        "clinicalNote": "A high potassium dose (21% DV) studied for its role in normal muscle contraction and fluid balance."
      },
      {
        "name": "Magnesium (citrate)",
        "dose": "120 mg",
        "clinicalNote": "Magnesium supports normal energy metabolism and muscle relaxation."
      },
      {
        "name": "Sodium (pink Himalayan salt)",
        "dose": "40 mg",
        "clinicalNote": "A light sodium dose relative to most electrolyte mixes."
      },
      {
        "name": "Chloride (pink Himalayan salt)",
        "dose": "60 mg",
        "clinicalNote": "Chloride works with sodium to help maintain normal fluid balance."
      }
    ],
    "cautions": [
      "Label warns to consult a physician before use if you have kidney disease, a low pulse rate, or high blood potassium",
      "1000 mg potassium (21% DV) is high — the brand recommends its separate Sports Hydration product if you need more sodium for heavy exercise",
      "Not intended for pregnant or nursing individuals or anyone under 18 without medical guidance"
    ],
    "servings": 50,
    "priceRange": "$",
    "flavorsNote": "Raspberry & Lemon among nine flavors; sweetened with stevia leaf extract, no added sugar or maltodextrin.",
    "affiliateUrl": "https://www.amazon.com/s?k=dr+berg+electrolyte+powder&tag=YOURTAG-20",
    "blurb": "Potassium-forward outlier: 1000 mg potassium against just 40 mg sodium, the inverse of most sports electrolyte mixes, with an on-label warning for kidney disease or high blood potassium.",
    "labelVerified": "July 2026",
    "imageUrl": "images/products/dr-berg-electrolyte-powder.png",
    "images": [
      "https://shop.drberg.com/cdn/shop/files/Electrolyte_Powder_Rasp_Lemon_50_2025_3D2_1000px.png",
      "https://shop.drberg.com/cdn/shop/files/Electrolyte_Powder_Lemonade_50_serv_Supplement_Panel_V5_17.12.24-01.jpg"
    ],
    "metrics": {
      "sodiumMg": 40,
      "potassiumMg": 1000,
      "magnesiumMg": 120,
      "sugarG": 0
    },
    "sources": [
      {
        "url": "https://shop.drberg.com/products/electrolyte-powder-with-1-000-mg",
        "label": "Dr. Berg — official product page and Supplement Facts panel"
      }
    ]
  },

  {
    "id": "ryse-hydration-sticks",
    "name": "Hydration Sticks",
    "brand": "RYSE",
    "category": "electrolytes",
    "stimFree": true,
    "badges": [
      "Fully Disclosed Label"
    ],
    "caffeineMg": 0,
    "keyIngredients": [
      {
        "name": "Sodium (citrate and pink Himalayan sea salt)",
        "dose": "320 mg",
        "clinicalNote": "A sodium-forward dose studied for replacing electrolytes lost during sweating."
      },
      {
        "name": "Potassium",
        "dose": "173 mg",
        "clinicalNote": "Potassium supports normal fluid balance and muscle function alongside sodium."
      },
      {
        "name": "Magnesium (citrate)",
        "dose": "74 mg",
        "clinicalNote": "Magnesium contributes to normal muscle and energy metabolism."
      },
      {
        "name": "Vitamin B12",
        "dose": "69 mcg",
        "clinicalNote": "Vitamin B12 supports normal energy-yielding metabolism."
      }
    ],
    "cautions": [
      "320 mg sodium per stick — significant if you're also salting food or stacking other electrolyte products",
      "Contains 1,000 mg taurine and 200 mg choline bitartrate beyond the core electrolytes",
      "69 mcg vitamin B12 is well above typical daily needs — check with a doctor if you take B12-affecting medication"
    ],
    "servings": 16,
    "priceRange": "$$",
    "flavorsNote": "Lemon Lime, Blue Raspberry, Pink Splash, and a licensed Kool-Aid Grape; the Supplement Facts panel shows no sugar line.",
    "affiliateUrl": "https://www.amazon.com/s?k=ryse+hydration+sticks&tag=YOURTAG-20",
    "blurb": "One of the higher-sodium sticks on the market at 320 mg, layered with a full B-vitamin, taurine, and choline stack that most electrolyte-only mixes leave out.",
    "labelVerified": "July 2026",
    "metrics": {
      "sodiumMg": 320,
      "potassiumMg": 173,
      "magnesiumMg": 74,
      "sugarG": 0
    },
    "sources": [
      {
        "url": "https://rysesupps.com/products/hydration-sticks",
        "label": "RYSE — official product page and Supplement Facts panel"
      }
    ]
  },

  {
    "id": "ghost-hydration",
    "name": "Hydration",
    "brand": "GHOST",
    "category": "electrolytes",
    "stimFree": true,
    "badges": [
      "Fully Disclosed Label"
    ],
    "caffeineMg": 0,
    "keyIngredients": [
      {
        "name": "Potassium (citrate)",
        "dose": "375 mg",
        "clinicalNote": "Potassium supports normal muscle contraction and fluid balance."
      },
      {
        "name": "Sodium (citrate)",
        "dose": "150 mg",
        "clinicalNote": "Sodium is studied for its role in fluid retention during sweating."
      },
      {
        "name": "Magnesium (citrate)",
        "dose": "83 mg",
        "clinicalNote": "Magnesium contributes to normal energy metabolism and muscle relaxation."
      },
      {
        "name": "Calcium (Aquamin, seaweed-derived)",
        "dose": "60 mg",
        "clinicalNote": "A whole-food seaweed-derived calcium source that also supplies trace ocean minerals."
      }
    ],
    "cautions": [
      "375 mg potassium (8% DV) — check with a doctor if you take potassium-sparing medication",
      "Contains 1,500 mg taurine and a Senactiv botanical blend beyond the core electrolytes",
      "Sweetened with rebaudioside M (a stevia leaf extract), not sugar"
    ],
    "servings": 40,
    "priceRange": "$$",
    "flavorsNote": "Iced Tea Lemonade among a wide flavor lineup; sweetened with rebaudioside M, zero sugar.",
    "affiliateUrl": "https://www.amazon.com/s?k=ghost+hydration+electrolyte+powder&tag=YOURTAG-20",
    "blurb": "Potassium-heavy scoop (375 mg) built around citrate-bound minerals, plus 1,500 mg taurine and a Senactiv botanical blend layered on top of the base electrolytes.",
    "labelVerified": "July 2026",
    "imageUrl": "images/products/ghost-hydration.webp",
    "images": [
      "https://www.ghostlifestyle.com/cdn/shop/files/HydrationIcedTeaLemonade.webp",
      "https://www.ghostlifestyle.com/cdn/shop/files/GHOST_Hydration_IcedTeaLemonade_SFP.png?v=1778616848"
    ],
    "metrics": {
      "sodiumMg": 150,
      "potassiumMg": 375,
      "magnesiumMg": 83,
      "sugarG": 0
    },
    "sources": [
      {
        "url": "https://www.ghostlifestyle.com/products/ghost-hydration-kiwi-strawberry",
        "label": "GHOST Lifestyle — official product page and Supplement Facts panel"
      }
    ]
  },

  /* ---- eaa (label-verified July 2026) ---- */

  {
    "id": "bsn-amino-x",
    "name": "Amino X",
    "brand": "BSN",
    "category": "eaa",
    "stimFree": true,
    "badges": [
      "Proprietary Blend"
    ],
    "caffeineMg": 0,
    "keyIngredients": [
      {
        "name": "Micronized BCAA/amino blend",
        "dose": "10 g",
        "clinicalNote": "Combines the branched-chain aminos with L-alanine, taurine, and citrulline in one blend; the label doesn't break out how much is BCAA versus the other three aminos."
      },
      {
        "name": "Vitamin D3",
        "dose": "12.5 mcg (63% DV)",
        "clinicalNote": "A fat-soluble vitamin involved in normal muscle function, added on top of the amino blend."
      }
    ],
    "cautions": [
      "The 10 g blend total is not broken into individual BCAA vs. other amino amounts",
      "Amino drinks supplement protein intake, not replace it"
    ],
    "servings": 30,
    "priceRange": "$$",
    "flavorsNote": "Wide fruit-flavor lineup (Blue Raspberry, Fruit Punch, Watermelon and more), zero sugar and caffeine-free.",
    "affiliateUrl": "https://www.amazon.com/s?k=bsn+amino+x&tag=YOURTAG-20",
    "blurb": "A long-running caffeine-free amino powder built around a 10 g blend of BCAAs plus alanine, taurine, and citrulline, though the individual amino split isn't disclosed on the label.",
    "labelVerified": "July 2026",
    "imageUrl": "images/products/bsn-amino-x.png",
    "images": [
      "https://www.gobsn.com/cdn/shop/files/bsn-1047896_Image_01.png?v=1761233898&width=800",
      "https://www.gobsn.com/cdn/shop/files/AMINOx_30sv_BlueRaz.jpg?v=1762989781&width=1000"
    ],
    "metrics": {
      "eaaG": null,
      "bcaaG": null,
      "leucineG": null
    },
    "sources": [
      {
        "url": "https://www.target.com/p/bsn-amino-x-muscle-recovery-endurance-powder-with-bcaas-10-grams-of-amino-acids-keto-friendly-caffeine-free-flavor-blue-raspberry-30-servings/-/A-1006339768",
        "label": "Target listing with Supplement Facts panel"
      },
      {
        "url": "https://www.gobsn.com/products/amino-x-bcaa",
        "label": "BSN — official product page"
      }
    ]
  },

  {
    "id": "evlution-nutrition-bcaa-energy",
    "name": "BCAA Energy",
    "brand": "Evlution Nutrition",
    "category": "eaa",
    "stimFree": false,
    "badges": [
      "Low Stim",
      "Fully Disclosed Label"
    ],
    "caffeineMg": 110,
    "keyIngredients": [
      {
        "name": "BCAA 2:1:1 blend",
        "dose": "5 g",
        "clinicalNote": "Branched-chain aminos studied for supporting muscle recovery, with 2.5 g of that total as leucine."
      },
      {
        "name": "Caffeine (green coffee and green tea extract)",
        "dose": "110 mg",
        "clinicalNote": "A natural-source caffeine dose studied for supporting alertness during training."
      },
      {
        "name": "Beta-alanine",
        "dose": "500 mg",
        "clinicalNote": "An amino acid studied for supporting muscular endurance; can cause a temporary tingling sensation."
      }
    ],
    "cautions": [
      "110 mg caffeine per two-scoop serving counts toward daily caffeine intake",
      "Beta-alanine tingling is a normal, harmless reaction some people notice",
      "Amino drinks supplement protein intake, not replace it"
    ],
    "servings": 30,
    "priceRange": "$$",
    "flavorsNote": "Wide flavor range including Blue Raz, Fruit Punch, Watermelon, and Rocket Pop, sweetened with sucralose.",
    "affiliateUrl": "https://www.amazon.com/s?k=evlution+nutrition+bcaa+energy&tag=YOURTAG-20",
    "blurb": "A fully dosed 5 g BCAA (2.5 g leucine) stacked with 110 mg of natural caffeine and 500 mg each of beta-alanine and taurine, positioning it as an energizing BCAA rather than a stim-free recovery drink.",
    "labelVerified": "July 2026",
    "imageUrl": "images/products/evlution-nutrition-bcaa-energy.jpg",
    "imageBg": "255,255,255",
    "images": [
      "https://www.evlnutrition.com/cdn/shop/files/BCAA_Energy_BR_SFP_-_2000x2000_a4f577cd-4773-45b9-83ee-b12ccedcafc7.jpg?v=1724270418",
      "https://www.evlnutrition.com/cdn/shop/files/BCAA_Energy_30_Servings_Watermelon_SFP.jpg?v=1665690877"
    ],
    "metrics": {
      "eaaG": null,
      "bcaaG": 5,
      "leucineG": 2.5
    },
    "sources": [
      {
        "url": "https://evlnutrition.com/products/bcaa-energy",
        "label": "Evlution Nutrition — official product page"
      },
      {
        "url": "https://www.priceplow.com/evlution-nutrition/bcaa-energy",
        "label": "PricePlow ingredient breakdown"
      }
    ]
  },

  {
    "id": "kaged-bcaa-211",
    "name": "BCAA 2:1:1",
    "brand": "Kaged",
    "category": "eaa",
    "stimFree": true,
    "badges": [
      "Third-Party Tested",
      "Fully Disclosed Label"
    ],
    "caffeineMg": 0,
    "keyIngredients": [
      {
        "name": "L-Leucine (fermented)",
        "dose": "2.5 g",
        "clinicalNote": "The BCAA most studied for triggering muscle protein synthesis after training."
      },
      {
        "name": "L-Isoleucine (fermented)",
        "dose": "1.25 g",
        "clinicalNote": "Works alongside leucine and valine in the branched-chain trio."
      },
      {
        "name": "L-Valine (fermented)",
        "dose": "1.25 g",
        "clinicalNote": "Completes the 2:1:1 BCAA ratio used in most recovery research."
      }
    ],
    "cautions": [
      "BCAA-only formula; the other six essential amino acids are not included",
      "Amino drinks supplement protein intake, not replace it"
    ],
    "servings": 72,
    "priceRange": "$$",
    "flavorsNote": "Unflavored, plant-fermented BCAAs with no added colors, meant for mixing into other drinks.",
    "affiliateUrl": "https://www.amazon.com/s?k=kaged+bcaa+2+1+1&tag=YOURTAG-20",
    "blurb": "Plant-fermented 5 g BCAA in the standard 2:1:1 ratio, Informed Sport tested, sold unflavored for stacking into any drink.",
    "labelVerified": "July 2026",
    "imageUrl": "images/products/kaged-bcaa-211.png",
    "images": [
      "https://www.kaged.com/cdn/shop/files/BCAAAFRONT_ac1a0751-087f-4bab-8697-c92f6ea75a7b.png",
      "https://www.kaged.com/cdn/shop/files/BCAA_BCAASFP.jpg"
    ],
    "metrics": {
      "eaaG": null,
      "bcaaG": 5,
      "leucineG": 2.5
    },
    "sources": [
      {
        "url": "https://kaged.com/products/bcaa-2-1-1",
        "label": "Kaged — official product page"
      }
    ]
  },

  {
    "id": "applied-nutrition-bcaa-amino-hydrate",
    "name": "BCAA Amino Hydrate",
    "brand": "Applied Nutrition",
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
        "dose": "3.6 g",
        "clinicalNote": "The essential amino acid most studied for triggering muscle protein synthesis after training."
      },
      {
        "name": "BCAA 2:1:1 blend (total)",
        "dose": "7.2 g",
        "clinicalNote": "The full branched-chain trio, combined here for supporting recovery and reducing training soreness."
      },
      {
        "name": "Electrolyte, L-glutamine and citrulline malate blend",
        "dose": "included, not individually itemized",
        "clinicalNote": "Sodium, potassium, and calcium for hydration alongside glutamine and citrulline for blood flow support."
      }
    ],
    "cautions": [
      "BCAA-only formula; the other six essential amino acids are not included",
      "Amino drinks supplement protein intake, not replace it"
    ],
    "servings": 32,
    "priceRange": "$$",
    "flavorsNote": "Seven flavors including Icy Blue Raz, Fruit Burst, and Green Apple; zero sugar and zero calories.",
    "affiliateUrl": "https://www.amazon.com/s?k=applied+nutrition+bcaa+amino+hydrate&tag=YOURTAG-20",
    "blurb": "A 7.2 g BCAA hydration formula with electrolytes and citrulline malate, Informed Sport certified, though it covers only three of the nine essential amino acids.",
    "labelVerified": "July 2026",
    "imageUrl": "images/products/applied-nutrition-bcaa-amino-hydrate.webp",
    "imageBg": "205,205,205",
    "images": [
      "https://appliednutrition.uk/cdn/shop/files/BCAA_Professional_450g_-_Icy_Blue_Raz_gifts.webp?v=1781657000",
      "https://appliednutrition.uk/cdn/shop/files/BCAA_Professional_450g_-_Fruit_Burst.webp?v=1781657000"
    ],
    "metrics": {
      "eaaG": null,
      "bcaaG": 7.2,
      "leucineG": 3.6
    },
    "sources": [
      {
        "url": "https://appliednutrition.uk/products/bcaa-amino-hydrate",
        "label": "Applied Nutrition — official product page"
      }
    ]
  },

  {
    "id": "optimum-nutrition-amino-energy-electrolytes",
    "name": "Amino Energy + Electrolytes",
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
        "name": "Amino blend",
        "dose": "5 g",
        "clinicalNote": "Proprietary mix including taurine, glutamine, arginine, leucine, beta-alanine, and citrulline; individual amounts aren't broken out."
      },
      {
        "name": "Caffeine (green tea and green coffee extract)",
        "dose": "100 mg",
        "clinicalNote": "Natural-source caffeine studied for supporting alertness during training."
      },
      {
        "name": "Electrolyte blend (sodium chloride, potassium chloride, magnesium oxide)",
        "dose": "440 mg",
        "clinicalNote": "Minerals lost through sweat, added to support hydration."
      }
    ],
    "cautions": [
      "Amino doses sit inside a proprietary blend, so individual amounts are not disclosed",
      "100 mg caffeine per stick pack counts toward daily caffeine intake",
      "Amino drinks supplement protein intake, not replace it"
    ],
    "servings": 7,
    "priceRange": "$$$",
    "flavorsNote": "Strawberry Burst and Tangerine Wave stick packs, sugar-free and aspartame-free.",
    "affiliateUrl": "https://www.amazon.com/s?k=optimum+nutrition+amino+energy+electrolytes&tag=YOURTAG-20",
    "blurb": "A stick-pack twist on ON's Amino Energy line, adding a 440 mg electrolyte blend to the same 100 mg caffeine and 5 g proprietary amino base in a lower-serving travel format.",
    "labelVerified": "July 2026",
    "imageUrl": "images/products/optimum-nutrition-amino-energy-electrolytes.png",
    "images": [
      "https://www.optimumnutrition.com/cdn/shop/files/on-1146760_Image_01.png?v=1755796114&width=2000",
      "https://www.optimumnutrition.com/cdn/shop/files/ONUS-amino-energy-electrolytes_Label_Strawberry-Burst_7-servings.png?v=1761393263&width=1000"
    ],
    "metrics": {
      "eaaG": null,
      "bcaaG": null,
      "leucineG": null
    },
    "sources": [
      {
        "url": "https://www.optimumnutrition.com/en-us/products/amino-energy-electrolytes-hydration-pre-workout-powder",
        "label": "Optimum Nutrition — official product page"
      }
    ]
  },

  {
    "id": "nutrabio-alpha-eaa",
    "name": "Alpha EAA",
    "brand": "NutraBio",
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
        "clinicalNote": "The essential amino acid most studied for triggering muscle protein synthesis after training."
      },
      {
        "name": "Full EAA spectrum",
        "dose": "8.2 g total",
        "clinicalNote": "All nine essential amino acids individually dosed, including 850 mg each of lysine and threonine."
      },
      {
        "name": "Taurine",
        "dose": "1.2 g",
        "clinicalNote": "Studied for supporting hydration and exercise performance."
      },
      {
        "name": "KSM-66 Ashwagandha",
        "dose": "300 mg",
        "clinicalNote": "An adaptogen studied for supporting the body's response to physical training stress."
      }
    ],
    "cautions": [
      "Also contains Alpha-GPC, choline, and huperzine A as a cognitive-support add-on, beyond a typical amino formula",
      "Amino drinks supplement protein intake, not replace it"
    ],
    "servings": 30,
    "priceRange": "$$$",
    "flavorsNote": "Multiple flavors; caffeine-free.",
    "affiliateUrl": "https://www.amazon.com/s?k=nutrabio+alpha+eaa&tag=YOURTAG-20",
    "blurb": "A fully itemized 8.2 g EAA panel (3 g leucine) layered with taurine, ashwagandha, and choline-based nootropics, from a brand that publishes every dose with no proprietary blends.",
    "labelVerified": "July 2026",
    "imageUrl": "images/products/nutrabio-alpha-eaa.png",
    "images": [
      "https://nutrabio.com/cdn/shop/files/26910_94a43607-317a-40d1-98e6-2a33fb90dc3e.png?v=1724448916&width=1946",
      "https://nutrabio.com/cdn/shop/products/26900.png?v=1707331471&width=1946"
    ],
    "metrics": {
      "eaaG": 8.2,
      "bcaaG": 6,
      "leucineG": 3
    },
    "sources": [
      {
        "url": "https://nutrabio.com/products/alpha-eaa",
        "label": "NutraBio — official product page"
      },
      {
        "url": "https://www.priceplow.com/nutrabio/alpha-eaa",
        "label": "PricePlow full ingredient panel"
      }
    ]
  },

  {
    "id": "alani-nu-bcaa",
    "name": "BCAA",
    "brand": "Alani Nu",
    "category": "eaa",
    "stimFree": true,
    "badges": [
      "Fully Disclosed Label"
    ],
    "caffeineMg": 0,
    "keyIngredients": [
      {
        "name": "BCAA 2:1:1 blend",
        "dose": "5 g",
        "clinicalNote": "Branched-chain aminos studied for supporting muscle recovery, with 2.5 g of that total as leucine."
      },
      {
        "name": "L-Glutamine",
        "dose": "500 mg",
        "clinicalNote": "The most abundant free amino acid in muscle tissue, commonly added to recovery formulas."
      },
      {
        "name": "Electrolytes (sodium, potassium)",
        "dose": "84 mg combined",
        "clinicalNote": "Minerals lost through sweat, added to support hydration."
      }
    ],
    "cautions": [
      "BCAA-only formula; the other six essential amino acids are not included",
      "Amino drinks supplement protein intake, not replace it"
    ],
    "servings": 30,
    "priceRange": "$$$",
    "flavorsNote": "Candy-inspired flavors like Sour Peach Rings and Hawaiian Shaved Ice, sweetened with sucralose.",
    "affiliateUrl": "https://www.amazon.com/s?k=alani+nu+bcaa&tag=YOURTAG-20",
    "blurb": "A fully dosed 5 g BCAA in the standard 2:1:1 ratio plus glutamine and a light electrolyte add, positioned as a caffeine-free, flavor-forward BCAA.",
    "labelVerified": "July 2026",
    "imageUrl": "images/products/alani-nu-bcaa.png",
    "images": [
      "https://www.alaninu.com/cdn/shop/files/Stretch_AN-Website-PDP-BCAA-SPR-01_V1.png?v=1782507258&width=2000",
      "https://www.alaninu.com/cdn/shop/files/Stretch_AN-Website-PDP-BCAA-SPR-02_V1.png?v=1782507258&width=2000"
    ],
    "metrics": {
      "eaaG": null,
      "bcaaG": 5,
      "leucineG": 2.5
    },
    "sources": [
      {
        "url": "https://www.alaninu.com/products/bcaa-sour-peach-rings",
        "label": "Alani Nu — official product page"
      }
    ]
  },

  {
    "id": "muscletech-amino-build",
    "name": "Amino Build",
    "brand": "MuscleTech",
    "category": "eaa",
    "stimFree": true,
    "badges": [
      "Fully Disclosed Label"
    ],
    "caffeineMg": 0,
    "keyIngredients": [
      {
        "name": "L-Leucine",
        "dose": "4 g",
        "clinicalNote": "Dosed at the level used in university research tied to strength gains after training."
      },
      {
        "name": "L-Isoleucine and L-Valine",
        "dose": "3 g combined",
        "clinicalNote": "The other two branched-chain aminos, rounding out a leucine-heavy 7 g BCAA total."
      },
      {
        "name": "Betaine anhydrous",
        "dose": "2.5 g",
        "clinicalNote": "Studied for supporting power output and lean mass gains during resistance training."
      },
      {
        "name": "Taurine",
        "dose": "1 g",
        "clinicalNote": "An amino acid studied for supporting hydration and exercise performance."
      }
    ],
    "cautions": [
      "Leucine-heavy 7 g BCAA blend skews away from the standard 2:1:1 ratio",
      "Amino drinks supplement protein intake, not replace it"
    ],
    "servings": 40,
    "priceRange": "$$",
    "flavorsNote": "Tropical Twist and Strawberry Watermelon flavors, caffeine-free.",
    "affiliateUrl": "https://www.amazon.com/s?k=muscletech+amino+build&tag=YOURTAG-20",
    "blurb": "A leucine-forward 7 g BCAA (4 g leucine) stacked with 2.5 g betaine and 1 g taurine, priced as an everyday recovery option rather than a full nine-amino EAA product.",
    "labelVerified": "July 2026",
    "imageUrl": "images/products/muscletech-amino-build.png",
    "images": [
      "https://www.muscletech.com/cdn/shop/files/mt-amino-build-tropical-twist.png?v=1742823143",
      "https://www.muscletech.com/cdn/shop/files/mt-amino-build-strawberry-watermelon.png?v=1742823147"
    ],
    "metrics": {
      "eaaG": null,
      "bcaaG": 7,
      "leucineG": 4
    },
    "sources": [
      {
        "url": "https://www.muscletech.com/products/amino-build",
        "label": "MuscleTech — official product page"
      }
    ]
  },

  {
    "id": "allmax-aminocore",
    "name": "Aminocore",
    "brand": "ALLMAX",
    "category": "eaa",
    "stimFree": true,
    "badges": [
      "Fully Disclosed Label"
    ],
    "caffeineMg": 0,
    "keyIngredients": [
      {
        "name": "L-Leucine",
        "dose": "3.68 g",
        "clinicalNote": "The BCAA most studied for triggering muscle protein synthesis, dosed here at 45% of the blend."
      },
      {
        "name": "L-Valine",
        "dose": "2.45 g",
        "clinicalNote": "One of the two remaining BCAAs, dosed at 30% of the blend."
      },
      {
        "name": "L-Isoleucine",
        "dose": "2.05 g",
        "clinicalNote": "Completes the leucine-heavy 9:6:5 BCAA ratio at 25% of the blend."
      },
      {
        "name": "B-vitamin complex (B6, B12, folate, niacin)",
        "dose": "included per serving",
        "clinicalNote": "Cofactors involved in normal amino acid metabolism."
      }
    ],
    "cautions": [
      "BCAA-only formula; the other six essential amino acids are not included",
      "Amino drinks supplement protein intake, not replace it"
    ],
    "servings": 30,
    "priceRange": "$$",
    "flavorsNote": "Eight flavor options including Fruit Punch, Watermelon, and Sweet Tea, formulated with InstaClear solubility technology.",
    "affiliateUrl": "https://www.amazon.com/s?k=allmax+aminocore&tag=YOURTAG-20",
    "blurb": "A leucine-dominant 8.18 g BCAA blend in a 9:6:5 ratio, fortified with B-vitamins, caffeine-free and built for repeat same-day dosing.",
    "labelVerified": "July 2026",
    "imageUrl": "images/products/allmax-aminocore.webp",
    "imageBg": "254,254,254",
    "images": [
      "https://www.allmaxnutrition.com/cdn/shop/files/1.1-Aminocore-BCAA-FruitPunch.webp?v=1782154376&width=1400",
      "https://www.allmaxnutrition.com/cdn/shop/files/1.1-Aminocore-BCAA-watermelon.webp?v=1782154409&width=1400"
    ],
    "metrics": {
      "eaaG": null,
      "bcaaG": 8.18,
      "leucineG": 3.68
    },
    "sources": [
      {
        "url": "https://allmaxnutrition.com/products/aminocore",
        "label": "ALLMAX — official product page"
      }
    ]
  },

  {
    "id": "nutricost-bcaa-powder",
    "name": "BCAA Powder",
    "brand": "Nutricost",
    "category": "eaa",
    "stimFree": true,
    "badges": [
      "Fully Disclosed Label",
      "Budget Pick"
    ],
    "caffeineMg": 0,
    "keyIngredients": [
      {
        "name": "L-Leucine",
        "dose": "3 g",
        "clinicalNote": "The essential amino acid most studied for triggering muscle protein synthesis after training."
      },
      {
        "name": "L-Isoleucine",
        "dose": "1.5 g",
        "clinicalNote": "Works alongside leucine and valine in the branched-chain trio."
      },
      {
        "name": "L-Valine",
        "dose": "1.5 g",
        "clinicalNote": "Completes the standard 2:1:1 BCAA ratio used in most recovery research."
      }
    ],
    "cautions": [
      "BCAA-only formula; the other six essential amino acids are not included",
      "Amino drinks supplement protein intake, not replace it"
    ],
    "servings": 30,
    "priceRange": "$",
    "flavorsNote": "Eleven flavor options plus unflavored, in container sizes from 30 to 150 servings.",
    "affiliateUrl": "https://www.amazon.com/s?k=nutricost+bcaa+powder&tag=YOURTAG-20",
    "blurb": "A straightforward 6 g BCAA in the standard 2:1:1 ratio at one of the lowest per-serving prices in the category.",
    "labelVerified": "July 2026",
    "imageUrl": "images/products/nutricost-bcaa-powder.jpg",
    "imageBg": "255,255,255",
    "images": [
      "https://nutricost.com/cdn/shop/files/NTCP_BCAA_Watermelon_30SERV_20OZ_Front1_Square.jpg?v=1760719437",
      "https://nutricost.com/cdn/shop/files/NTCP_BCAA_Watermelon_30SERV_20OZ_SFP_Square.jpg?v=1760719437"
    ],
    "metrics": {
      "eaaG": null,
      "bcaaG": 6,
      "leucineG": 3
    },
    "sources": [
      {
        "url": "https://nutricost.com/products/nutricost-bcaa-powder",
        "label": "Nutricost — official product page"
      },
      {
        "url": "https://www.priceplow.com/nutricost/bcaa",
        "label": "PricePlow ingredient breakdown"
      }
    ]
  },

  {
    "id": "nutrabio-base-aminos",
    "name": "Base Aminos",
    "brand": "NutraBio",
    "category": "eaa",
    "stimFree": true,
    "badges": [
      "Fully Disclosed Label"
    ],
    "caffeineMg": 0,
    "keyIngredients": [
      {
        "name": "EAA-BCAA Recovery Matrix",
        "dose": "10 g (incl. 6 g fermented BCAAs 2:1:1)",
        "clinicalNote": "A fully dosed, full-spectrum essential amino acid blend intended to support muscle recovery during and after training."
      },
      {
        "name": "Electrolyte Hydration Matrix",
        "dose": "2.8 g (sodium citrate, potassium citrate, magnesium malate, sodium chloride)",
        "clinicalNote": "Replenishes electrolytes lost through sweat to support normal hydration status during exercise."
      },
      {
        "name": "AstraGin",
        "dose": "50 mg",
        "clinicalNote": "An astragalus/notoginseng root extract studied for supporting nutrient absorption."
      }
    ],
    "cautions": [
      "Provides 250 mg sodium and 125 mg potassium per serving; account for this if monitoring electrolyte intake.",
      "Contains coconut-derived flavor components (tree nut note on label)."
    ],
    "servings": 30,
    "priceRange": "$$",
    "flavorsNote": "Sold in flavors such as Blackberry Lemonade and Grape Berry Crush, naturally and artificially flavored.",
    "affiliateUrl": "https://www.amazon.com/s?k=nutrabio+base+aminos&tag=YOURTAG-20",
    "blurb": "Combines a fully dosed 10 g EAA-BCAA matrix with a separate electrolyte blend on one panel, positioning it as a recovery-plus-hydration hybrid rather than a plain amino powder.",
    "labelVerified": "July 2026",
    "imageUrl": "images/products/nutrabio-base-aminos.png",
    "images": [
      "https://nutrabio.com/cdn/shop/files/80015_BottleRender.png?v=1771857958",
      "https://nutrabio.com/cdn/shop/files/80015_SupplementFactsPanel.png?v=1771857958"
    ],
    "metrics": {
      "eaaG": 10,
      "bcaaG": 6,
      "leucineG": 3
    },
    "sources": [
      {
        "url": "https://nutrabio.com/products/base-aminos",
        "label": "NutraBio — Base Aminos product page"
      }
    ]
  },

  {
    "id": "1st-phorm-eaa",
    "name": "Essential Amino Acids",
    "brand": "1st Phorm",
    "category": "eaa",
    "stimFree": true,
    "badges": [
      "Fully Disclosed Label",
      "Third-Party Tested"
    ],
    "caffeineMg": 0,
    "keyIngredients": [
      {
        "name": "BCAA Complex 2:1:1",
        "dose": "3 g (1,500 mg leucine, 750 mg isoleucine, 750 mg valine)",
        "clinicalNote": "A leucine-forward branched-chain ratio commonly used around training to support muscle protein synthesis."
      },
      {
        "name": "EAA Complex",
        "dose": "3.5 g (lysine, threonine, phenylalanine, histidine, methionine, tryptophan)",
        "clinicalNote": "Rounds out all nine essential amino acids the body cannot produce on its own."
      }
    ],
    "cautions": [
      "Processed on equipment that also handles milk, egg, fish, shellfish, tree nuts, peanuts, wheat, soy, and sesame.",
      "May contain trace amounts of milk, egg, soy, or wheat."
    ],
    "servings": 60,
    "priceRange": "$$",
    "flavorsNote": "Offered in Berry Blast, Blueberry Lemonade, Sour Green Apple, and Tropical Mango.",
    "affiliateUrl": "https://www.amazon.com/s?k=1st+phorm+essential+amino+acids&tag=YOURTAG-20",
    "blurb": "An NSF Certified for Sport EAA powder with a 60-serving count that spreads the amino dose thinner per scoop (6.5 g total) than most single-scoop EAA products.",
    "labelVerified": "July 2026",
    "imageUrl": "images/products/1st-phorm-eaa.png",
    "images": [
      "https://1stphorm.com/cdn/shop/files/eaa-tropical-mango.png?v=1764626022",
      "https://cdn.shopify.com/s/files/1/0072/7754/3493/files/eaa-berry-blast-SFP-04_25-allergy.png?v=1746047760"
    ],
    "metrics": {
      "eaaG": 6.5,
      "bcaaG": 3,
      "leucineG": 1.5
    },
    "sources": [
      {
        "url": "https://1stphorm.com/products/essential-amino-acids",
        "label": "1st Phorm — Essential Amino Acids product page"
      }
    ]
  },

  {
    "id": "ghost-intra",
    "name": "Intra",
    "brand": "Ghost",
    "category": "eaa",
    "stimFree": true,
    "badges": [
      "Fully Disclosed Label"
    ],
    "caffeineMg": 0,
    "keyIngredients": [
      {
        "name": "GHOST EAA (incl. GHOST BCAA 2:1:1)",
        "dose": "10 g total EAA / 6 g BCAA",
        "clinicalNote": "A fully itemized nine-amino profile with a leucine-forward BCAA ratio to support muscle recovery around training."
      },
      {
        "name": "KSM-66 Ashwagandha",
        "dose": "600 mg",
        "clinicalNote": "A standardized ashwagandha extract studied for supporting the body's normal stress response."
      },
      {
        "name": "Cognizin Citicoline",
        "dose": "250 mg",
        "clinicalNote": "A choline compound studied for supporting normal cognitive function."
      },
      {
        "name": "Electrolyte blend (sodium, potassium, chloride, calcium, magnesium)",
        "dose": "See panel",
        "clinicalNote": "Supports fluid and electrolyte balance during exercise."
      }
    ],
    "cautions": [
      "Contains 600 mg ashwagandha; consult a healthcare provider if pregnant, nursing, or taking thyroid medication.",
      "Sweetened with sucralose and acesulfame potassium; colored with beet root powder and beta carotene."
    ],
    "servings": 20,
    "priceRange": "$$",
    "flavorsNote": "Available in Orange Squeeze, Welch's Grape, Blue Raspberry, and Lemon Lime.",
    "affiliateUrl": "https://www.amazon.com/s?k=ghost+intra+eaa&tag=YOURTAG-20",
    "blurb": "A 10 g EAA formula that pairs the full amino profile with a dosed focus-and-hydration stack (ashwagandha, citicoline, electrolytes) rather than filler ingredients.",
    "labelVerified": "July 2026",
    "imageUrl": "images/products/ghost-intra.webp",
    "images": [
      "https://www.ghostlifestyle.com/cdn/shop/files/IntraOrangeSqueeze_grande.webp?v=1715709631",
      "https://www.ghostlifestyle.com/cdn/shop/files/GHOST_Intra_OrangeSqueeze_SFP.png?v=1715710016"
    ],
    "metrics": {
      "eaaG": 10,
      "bcaaG": 6,
      "leucineG": 3
    },
    "sources": [
      {
        "url": "https://www.ghostlifestyle.com/products/ghost-intra-orange-squeeze",
        "label": "Ghost — Intra Orange Squeeze product page"
      }
    ]
  },

  {
    "id": "redcon1-grunt-eaas",
    "name": "Grunt EAAs",
    "brand": "Redcon1",
    "category": "eaa",
    "stimFree": true,
    "badges": [
      "Fully Disclosed Label"
    ],
    "caffeineMg": 0,
    "keyIngredients": [
      {
        "name": "Essential amino acid blend",
        "dose": "6.9 g (incl. 6 g BCAAs at 2:1:1)",
        "clinicalNote": "Supplies all nine essential amino acids with a leucine-forward 2:1:1 BCAA ratio to support muscle recovery around training."
      }
    ],
    "cautions": [
      "Sweetened with sucralose; contains disodium phosphate.",
      "Discontinue use and consult a healthcare provider if any adverse reaction occurs."
    ],
    "servings": 30,
    "priceRange": "$$",
    "flavorsNote": "Sold in flavors such as Rocket Bomb and Tiger's Blood, naturally and artificially flavored.",
    "affiliateUrl": "https://www.amazon.com/s?k=redcon1+grunt+eaa&tag=YOURTAG-20",
    "blurb": "Redcon1's current EAA powder (the line that replaced the discontinued Breach BCAA); a straightforward nine-amino label with no nootropic or hydration add-ons.",
    "labelVerified": "July 2026",
    "imageUrl": "images/products/redcon1-grunt-eaas.png",
    "images": [
      "https://redcon1.com/cdn/shop/files/FRONT_TIGERS-BLOOD_FLVRS.png?v=1715181859",
      "https://redcon1.com/cdn/shop/files/SUPP-FACTS_GRUNT_ROCKET-BOMB.png?v=1715181859"
    ],
    "metrics": {
      "eaaG": 6.9,
      "bcaaG": 6,
      "leucineG": 3
    },
    "sources": [
      {
        "url": "https://redcon1.com/products/grunt-eaas",
        "label": "Redcon1 — Grunt EAAs product page"
      }
    ]
  },

  {
    "id": "transparent-labs-bcaa-glutamine",
    "name": "BCAA Glutamine",
    "brand": "Transparent Labs",
    "category": "eaa",
    "stimFree": true,
    "badges": [
      "Fully Disclosed Label",
      "Third-Party Tested"
    ],
    "caffeineMg": 0,
    "keyIngredients": [
      {
        "name": "Fermented Vegan BCAA 2:1:1",
        "dose": "8 g (4 g leucine, 2 g isoleucine, 2 g valine)",
        "clinicalNote": "A high-dose, leucine-forward branched-chain amino ratio to support muscle protein synthesis around training."
      },
      {
        "name": "L-Glutamine",
        "dose": "5 g",
        "clinicalNote": "A conditionally essential amino acid studied for its role in exercise recovery."
      },
      {
        "name": "Coconut water powder",
        "dose": "1 g",
        "clinicalNote": "Included to support hydration and electrolyte replenishment."
      },
      {
        "name": "Vitamin C",
        "dose": "1,500 mg",
        "clinicalNote": "An antioxidant vitamin included at a high per-serving dose."
      }
    ],
    "cautions": [
      "Delivers 1,500 mg vitamin C per serving (1,667% DV) — a high dose relative to a standard multivitamin.",
      "Contains coconut (tree nut) derived ingredients."
    ],
    "servings": 30,
    "priceRange": "$$",
    "flavorsNote": "Naturally sweetened with stevia; flavors include Strawberry Lemonade.",
    "affiliateUrl": "https://www.amazon.com/s?k=transparent+labs+bcaa+glutamine&tag=YOURTAG-20",
    "blurb": "An Informed Choice-certified BCAA formula (not a full EAA spectrum) built around an 8 g 2:1:1 ratio plus a 5 g glutamine dose well above what most BCAA products include.",
    "labelVerified": "July 2026",
    "imageUrl": "images/products/transparent-labs-bcaa-glutamine.jpg",
    "imageBg": "18,17,15",
    "images": [
      "https://www.transparentlabs.com/cdn/shop/files/BCAA-PDP-Hero.jpg?v=1781800579",
      "https://www.transparentlabs.com/cdn/shop/files/BCAA-SFP-StrawLemonade.jpg?v=1781800579"
    ],
    "metrics": {
      "eaaG": null,
      "bcaaG": 8,
      "leucineG": 4
    },
    "sources": [
      {
        "url": "https://www.transparentlabs.com/products/bcaa-powder",
        "label": "Transparent Labs — BCAA Glutamine product page"
      }
    ]
  },

  {
    "id": "kaged-in-kaged",
    "name": "Intra-Workout (In-Kaged)",
    "brand": "Kaged",
    "category": "eaa",
    "stimFree": false,
    "badges": [
      "Fully Disclosed Label",
      "Third-Party Tested",
      "Low Stim"
    ],
    "caffeineMg": 124,
    "keyIngredients": [
      {
        "name": "Muscle Fuel Matrix 2:1:1 (fermented BCAAs)",
        "dose": "5 g (2.5 g leucine, 1.25 g isoleucine, 1.25 g valine)",
        "clinicalNote": "A leucine-forward branched-chain amino ratio to support muscle protein synthesis during training."
      },
      {
        "name": "L-Citrulline (AminaTure)",
        "dose": "3 g",
        "clinicalNote": "An amino acid studied for supporting blood flow during exercise."
      },
      {
        "name": "Caffeine (as PurCaf, from organic green coffee bean)",
        "dose": "124 mg",
        "clinicalNote": "A natural caffeine source providing a moderate energy lift during training."
      },
      {
        "name": "Beta-Alanine (CarnoSyn)",
        "dose": "1.6 g",
        "clinicalNote": "An amino acid studied for supporting muscular endurance during higher-rep training."
      }
    ],
    "cautions": [
      "Contains 124 mg caffeine per serving from organic green coffee bean; not appropriate for those avoiding stimulants or sensitive to caffeine.",
      "Beta-alanine may cause a temporary tingling sensation (paresthesia).",
      "Contains coconut (tree nut) derived ingredients."
    ],
    "servings": 20,
    "priceRange": "$$",
    "flavorsNote": "Available in flavors such as Cherry Lemonade, naturally flavored.",
    "affiliateUrl": "https://www.amazon.com/s?k=kaged+in+kaged+intra+workout&tag=YOURTAG-20",
    "blurb": "A caffeinated intra-workout BCAA powder (not a full EAA spectrum) that also carries dosed citrulline and beta-alanine; Informed Sport tested every batch.",
    "labelVerified": "July 2026",
    "imageUrl": "images/products/kaged-in-kaged.png",
    "images": [
      "https://www.kaged.com/cdn/shop/files/IW-Front-CL.png?v=1774385694",
      "https://www.kaged.com/cdn/shop/files/Intra-WorkoutAMZ_IWSFPFP.jpg?v=1774385694"
    ],
    "metrics": {
      "eaaG": null,
      "bcaaG": 5,
      "leucineG": 2.5
    },
    "sources": [
      {
        "url": "https://www.kaged.com/products/in-kaged",
        "label": "Kaged — Intra-Workout (In-Kaged) product page"
      }
    ]
  },

  {
    "id": "ryse-bcaa-eaa",
    "name": "BCAA + EAA",
    "brand": "Ryse",
    "category": "eaa",
    "stimFree": true,
    "badges": [
      "Fully Disclosed Label"
    ],
    "caffeineMg": 0,
    "keyIngredients": [
      {
        "name": "BCAA Blend",
        "dose": "5 g (2.5 g leucine, 1.25 g isoleucine, 1.25 g valine)",
        "clinicalNote": "A leucine-forward branched-chain ratio to support muscle protein synthesis around training."
      },
      {
        "name": "EAA Blend",
        "dose": "3 g (lysine, phenylalanine, threonine, tryptophan, histidine, methionine)",
        "clinicalNote": "Rounds out the remaining essential amino acids alongside the BCAA blend."
      },
      {
        "name": "Organic coconut water powder (CocOganic)",
        "dose": "250 mg",
        "clinicalNote": "Included to support hydration during exercise."
      }
    ],
    "cautions": [
      "Contains coconut-derived ingredients (organic coconut water powder).",
      "Sweetened with sucralose."
    ],
    "servings": 30,
    "priceRange": "$$",
    "flavorsNote": "Sold in flavors including Cherry Lime and Strawberry Pineapple.",
    "affiliateUrl": "https://www.amazon.com/s?k=ryse+bcaa+eaa&tag=YOURTAG-20",
    "blurb": "Splits its 8 g total amino dose into a labeled 5 g BCAA blend plus a separate 3 g EAA blend, giving an itemized breakdown of all nine essential aminos.",
    "labelVerified": "July 2026",
    "imageUrl": "images/products/ryse-bcaa-eaa.png",
    "images": [
      "https://rysesupps.com/cdn/shop/files/ryse-web-prod-bcaa-1000x1000-cl-front_2d43687f-d3d0-486f-b715-a19e4ce4c58c.png?v=1652999215",
      "https://rysesupps.com/cdn/shop/files/nfp-bcaa-cherry.jpg?v=1666311640"
    ],
    "metrics": {
      "eaaG": 8,
      "bcaaG": 5,
      "leucineG": 2.5
    },
    "sources": [
      {
        "url": "https://rysesupps.com/products/bcaa-eaa",
        "label": "Ryse Supplements — BCAA + EAA product page"
      }
    ]
  },


  {
    "id": "xwerks-motion",
    "name": "Motion",
    "brand": "Xwerks",
    "category": "eaa",
    "stimFree": true,
    "badges": [
      "Fully Disclosed Label"
    ],
    "caffeineMg": 0,
    "keyIngredients": [
      {
        "name": "BCAA 2:1:1 blend",
        "dose": "3 g",
        "clinicalNote": "Branched-chain aminos layered into a carbohydrate base, studied for supporting muscle recovery during longer training sessions."
      },
      {
        "name": "Cluster Dextrin (Highly Branched Cyclic Dextrin)",
        "dose": "25 g carbohydrate",
        "clinicalNote": "A fast-clearing carb source studied for sustaining blood glucose and training endurance without the gut discomfort of simple sugars."
      },
      {
        "name": "Electrolyte blend (calcium, magnesium, sodium)",
        "dose": "149 mg combined",
        "clinicalNote": "Supports fluid balance alongside the carbohydrate and amino content during sweat loss."
      }
    ],
    "cautions": [
      "BCAA-only formula covers three of the nine essential amino acids, not the full set",
      "Contains 110 calories and 25 g of carbohydrate per serving, unlike zero-calorie amino mixes"
    ],
    "servings": 30,
    "priceRange": "$$$",
    "flavorsNote": "Raspberry Lemonade is the only flavor offered, sweetened with sucralose.",
    "affiliateUrl": "https://www.amazon.com/s?k=xwerks+motion+bcaa&tag=YOURTAG-20",
    "blurb": "Builds BCAAs into a 25 g Cluster Dextrin carbohydrate and electrolyte base rather than selling them as a standalone amino mix, at a premium per-tub price for a single flavor.",
    "labelVerified": "July 2026",
    "imageUrl": "images/products/xwerks-motion.png",
    "imageBg": "227,227,225",
    "images": [
      "https://cdn.shopify.com/s/files/1/0666/3683/files/motion-2026_6b3eea36-d807-414b-ab23-443e039d0be4.png?v=1771608586",
      "https://cdn.shopify.com/s/files/1/0666/3683/files/motion.jpg?v=1771608586"
    ],
    "metrics": {
      "eaaG": null,
      "bcaaG": 3,
      "leucineG": 1.5
    },
    "sources": [
      {
        "url": "https://xwerks.com/products/motion",
        "label": "Xwerks product page"
      }
    ]
  },

  {
    "id": "primeval-labs-eaa-max",
    "name": "EAA Max",
    "brand": "Primeval Labs",
    "category": "eaa",
    "stimFree": true,
    "badges": [
      "Fully Disclosed Label"
    ],
    "caffeineMg": 0,
    "keyIngredients": [
      {
        "name": "Branched Chain Amino Acids",
        "dose": "5 g",
        "clinicalNote": "2.5 g leucine plus isoleucine and valine, the trio most studied for stimulating muscle protein synthesis."
      },
      {
        "name": "Essential Amino Acids (lysine, threonine, phenylalanine, tryptophan, histidine, methionine)",
        "dose": "820 mg",
        "clinicalNote": "Rounds out the full nine-EAA profile alongside the BCAAs, supporting whole-body protein balance."
      },
      {
        "name": "Cluster Dextrin (Highly Branched Cyclic Dextrin) + D-Ribose",
        "dose": "2.5 g combined",
        "clinicalNote": "A small fast-digesting carbohydrate pairing studied for supporting training energy delivery."
      }
    ],
    "cautions": [
      "Contains tree nuts (coconut)",
      "Amino drinks supplement protein intake, not replace it"
    ],
    "servings": 30,
    "priceRange": "$$",
    "flavorsNote": "Ten flavors including Cherry Lemonade, Gummy Bear, and Tropical Lemonade, sweetened with sucralose.",
    "affiliateUrl": "https://www.amazon.com/s?k=primeval+labs+eaa+max&tag=YOURTAG-20",
    "blurb": "Fully itemized 5.82 g EAA panel — 5 g BCAA plus 820 mg of the other six essentials — with a small Cluster Dextrin and D-Ribose energy addition.",
    "labelVerified": "July 2026",
    "imageUrl": "images/products/primeval-labs-eaa-max.png",
    "images": [
      "https://primevallabs.com/cdn/shop/files/EAA_MAX_Jamaica_Front_698045f8-7a69-4838-9f9c-57b32c6502de.png?v=1760047745",
      "https://cdn.shopify.com/s/files/1/0082/8021/1553/files/EAAMAXSUPPLEMENTFACTSPANELS.png"
    ],
    "metrics": {
      "eaaG": 5.82,
      "bcaaG": 5,
      "leucineG": 2.5
    },
    "sources": [
      {
        "url": "https://primevallabs.com/products/eaa-max-essential-amino-acids",
        "label": "Primeval Labs product page"
      }
    ]
  },

  {
    "id": "steel-supplements-bcaa-eaa",
    "name": "BCAA+EAA",
    "brand": "Steel Supplements",
    "category": "eaa",
    "stimFree": true,
    "badges": [
      "Fully Disclosed Label"
    ],
    "caffeineMg": 0,
    "keyIngredients": [
      {
        "name": "Leucine, Isoleucine, Valine (BCAAs)",
        "dose": "5 g",
        "clinicalNote": "2.5 g leucine plus a 1:1 isoleucine-valine split, the branched-chain trio studied for muscle recovery."
      },
      {
        "name": "Six additional essential amino acids",
        "dose": "1.8 g",
        "clinicalNote": "Lysine, threonine, methionine, phenylalanine, tryptophan, and histidine dosed evenly to complete the nine-EAA set."
      },
      {
        "name": "B-vitamin and biotin blend",
        "dose": "includes 300 mcg biotin (1000% DV)",
        "clinicalNote": "High-dose B-vitamins commonly paired with amino formulas to support normal energy metabolism."
      }
    ],
    "cautions": [
      "Biotin is dosed at 1000% of the Daily Value, which can interfere with certain lab tests",
      "Amino drinks supplement protein intake, not replace it"
    ],
    "servings": 30,
    "priceRange": "$$$",
    "flavorsNote": "Fruit Punch, Watermelon, Kiwi Strawberry, and Bohemian Bliss, sweetened with sucralose and acesulfame potassium.",
    "affiliateUrl": "https://www.amazon.com/s?k=steel+supplements+bcaa+eaa&tag=YOURTAG-20",
    "blurb": "6.8 g of fully dosed EAAs per serving — 5 g BCAA plus 1.8 g of the other six — layered with a high-dose B-vitamin and biotin stack.",
    "labelVerified": "July 2026",
    "imageUrl": "images/products/steel-supplements-bcaa-eaa.png",
    "images": [
      "https://cdn.shopify.com/s/files/1/1876/4703/files/bcaas-eaas-fruit-punch-35512473911365.png?v=1731968338",
      "https://cdn.shopify.com/s/files/1/1876/4703/files/bcaas-eaas-35182429536325.png?v=1726234981"
    ],
    "metrics": {
      "eaaG": 6.8,
      "bcaaG": 5,
      "leucineG": 2.5
    },
    "sources": [
      {
        "url": "https://steelsupplements.com/products/bcaas-eaas",
        "label": "Steel Supplements product page"
      }
    ]
  },

  {
    "id": "genius-energized-bcaa",
    "name": "Energized BCAA",
    "brand": "Genius",
    "category": "eaa",
    "stimFree": false,
    "badges": [
      "Low Stim",
      "Fully Disclosed Label"
    ],
    "caffeineMg": 100,
    "keyIngredients": [
      {
        "name": "Vegan BCAAs (Leucine, Isoleucine, Valine)",
        "dose": "5 g",
        "clinicalNote": "Fermented, instantized branched-chain aminos in a 2:1:1 ratio studied for supporting muscle recovery."
      },
      {
        "name": "L-Glutamine",
        "dose": "3 g",
        "clinicalNote": "The most abundant free amino acid in muscle tissue, commonly added to recovery formulas."
      },
      {
        "name": "Citicoline (as Cognizin) + Rhodiola rosea extract",
        "dose": "250 mg + 200 mg",
        "clinicalNote": "Studied for supporting mental focus and reducing perceived fatigue during exercise."
      },
      {
        "name": "Caffeine (from Coffea arabica bean extract)",
        "dose": "100 mg",
        "clinicalNote": "A moderate dose studied for supporting alertness and perceived energy during training."
      }
    ],
    "cautions": [
      "Contains 100 mg caffeine per serving; avoid stacking with other stimulant products",
      "BCAA-only amino profile does not cover the full nine essential amino acids",
      "Manufactured in a facility that also processes milk, soy, wheat, egg, peanuts, tree nuts, fish, and shellfish"
    ],
    "servings": 21,
    "priceRange": "$$",
    "flavorsNote": "Grape Limeade and Power Orange, naturally flavored and sweetened.",
    "affiliateUrl": "https://www.amazon.com/s?k=genius+energized+bcaa&tag=YOURTAG-20",
    "blurb": "A caffeinated hybrid rather than a plain BCAA: 5 g of BCAAs plus glutamine, citrulline malate, taurine, and a 100 mg caffeine and nootropic stack in every scoop.",
    "labelVerified": "July 2026",
    "imageUrl": "images/products/genius-energized-bcaa.png",
    "images": [
      "https://cdn.shopify.com/s/files/1/0519/6280/6450/files/genius-bcaa-grappe-limeade_699dc4c4-984b-4871-84a0-100a9dea758a.png?v=1767885560",
      "https://cdn.shopify.com/s/files/1/0519/6280/6450/files/genius-bcaa-back.png?v=1767885560"
    ],
    "metrics": {
      "eaaG": null,
      "bcaaG": 5,
      "leucineG": 2.5
    },
    "sources": [
      {
        "url": "https://thegeniusbrand.com/products/genius-bcaa",
        "label": "The Genius Brand product page"
      }
    ]
  },

  {
    "id": "bpi-sports-best-eaa",
    "name": "Best EAA",
    "brand": "BPI Sports",
    "category": "eaa",
    "stimFree": true,
    "badges": [
      "Fully Disclosed Label"
    ],
    "caffeineMg": 0,
    "keyIngredients": [
      {
        "name": "BCAAs (Leucine, Isoleucine, Valine)",
        "dose": "7.2 g",
        "clinicalNote": "3.6 g leucine plus isoleucine and valine, an unusually branched-chain-heavy share of the total amino dose."
      },
      {
        "name": "Six additional essential amino acids",
        "dose": "2.8 g",
        "clinicalNote": "Lysine, threonine, phenylalanine, methionine, histidine, and tryptophan completing the nine-EAA profile."
      },
      {
        "name": "Coconut water powder",
        "dose": "200 mg",
        "clinicalNote": "A natural electrolyte source added to support hydration during training."
      }
    ],
    "cautions": [
      "Contains tree nuts (coconut)",
      "Amino drinks supplement protein intake, not replace it"
    ],
    "servings": 30,
    "priceRange": "$$",
    "flavorsNote": "Lemon Berry and Sour Power, naturally and artificially flavored with no artificial colors.",
    "affiliateUrl": "https://www.amazon.com/s?k=bpi+sports+best+eaa&tag=YOURTAG-20",
    "blurb": "10 g of fully itemized EAAs per serving with a BCAA-heavy 7.2 g share, plus a small coconut water electrolyte addition.",
    "labelVerified": "July 2026",
    "imageUrl": "images/products/bpi-sports-best-eaa.webp",
    "imageBg": "255,255,255",
    "images": [
      "https://cdn.shopify.com/s/files/1/0561/9761/1672/files/BESTEAA-30SERV-LEMONBERRY_fcc4da10-8a2c-4146-9da2-ecd2c6fa6f2a.webp?v=1730185363",
      "https://cdn.shopify.com/s/files/1/0561/9761/1672/files/BESTEAA-30SERV-SUPPFACTS.webp?v=1739305685"
    ],
    "metrics": {
      "eaaG": 10,
      "bcaaG": 7.2,
      "leucineG": 3.6
    },
    "sources": [
      {
        "url": "https://bpisports.com/products/best-eaa",
        "label": "BPI Sports product page"
      }
    ]
  },

  {
    "id": "evlution-nutrition-bcaa5000-powder",
    "name": "BCAA5000 Powder",
    "brand": "Evlution Nutrition",
    "category": "eaa",
    "stimFree": true,
    "badges": [
      "Fully Disclosed Label",
      "Budget Pick"
    ],
    "caffeineMg": 0,
    "keyIngredients": [
      {
        "name": "BCAA 2:1:1 blend (Leucine, Valine, Isoleucine)",
        "dose": "5 g",
        "clinicalNote": "2.5 g leucine in the standard 2:1:1 ratio, studied for supporting muscle recovery and lean mass maintenance."
      }
    ],
    "cautions": [
      "BCAA-only formula covers three of the nine essential amino acids, not the full set",
      "Amino drinks supplement protein intake, not replace it"
    ],
    "servings": 60,
    "priceRange": "$",
    "flavorsNote": "Verified on the Unflavored version, which lists no other ingredients; Cherry Limeade and Blue Raz flavored versions are sold in 30-serving tubs.",
    "affiliateUrl": "https://www.amazon.com/s?k=evlution+nutrition+bcaa5000&tag=YOURTAG-20",
    "blurb": "A bare-bones 5 g BCAA formula — the unflavored version lists no other ingredients at all — at one of the lowest per-serving costs in the category.",
    "labelVerified": "July 2026",
    "imageUrl": "images/products/evlution-nutrition-bcaa5000-powder.jpg",
    "imageBg": "255,255,255",
    "images": [
      "https://cdn.shopify.com/s/files/1/0877/6064/files/BCAA500060SERV-UF_2.jpg?v=1765384748",
      "https://cdn.shopify.com/s/files/1/0877/6064/files/BCAA500060SERV-UF_3.jpg?v=1765384748"
    ],
    "metrics": {
      "eaaG": null,
      "bcaaG": 5,
      "leucineG": 2.5
    },
    "sources": [
      {
        "url": "https://www.evlnutrition.com/products/bcaa5000-powder",
        "label": "Evlution Nutrition product page"
      }
    ]
  },
];
