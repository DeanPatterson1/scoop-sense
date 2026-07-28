# SCOOP SENSE — PRODUCT PAGE BUILD SPEC (v1)

Two builders, parallel, no questions. **Builder A owns `data/products.js` only. Builder B owns `product.html` (new), `js/product.js` (new), `js/app.js`, `hub.html`, `index.html`, `css/styles.css`.** All paths relative to `C:/Users/deand/Projects/Pre_workout/`. Builder B must code defensively against the OLD data shape (new fields optional, guarded) since both run in parallel.

---

## 1. SCHEMA V2 — `data/products.js`

Keep every existing field name and meaning unchanged (`id, name, brand, stimFree, badges, caffeineMg, keyIngredients, cautions, servings, priceRange, flavorsNote, affiliateUrl, blurb, accentColor`). Add these OPTIONAL fields (absent on the 13 non-researched products; `product.js` must guard every one):

```
fullPanel        array of { name, doseLabel, clinicalRange, assessment }
                 assessment ∈ "at studied range" | "above studied range" |
                              "below studied range" | "not enough research"
scoopNote        string — what serving basis the numbers assume
halfServingNote  string — what one scoop means, where relevant
flavors          array of strings (current flavor lineup)
sweeteners       array of strings
dyes             array of strings
certifications   array of strings
labelWarnings    array of strings — manufacturer's own label warnings, condensed
priceNote        string — dollar figures + check date (INTERNAL)
reformulationNote string
sources          array of { url, label }
lastChecked      string "YYYY-MM-DD"
images           array of strings (photo URLs) — [] for now; when non-empty,
                 product.js uses these instead of generated slides, no code change
```

**Rendered by product.js:** `fullPanel`, `scoopNote`, `halfServingNote`, `flavors`, `sweeteners`, `certifications`, `labelWarnings` (inside Sources collapsible), `reformulationNote` (inside Sources collapsible), `sources`, `lastChecked`, `images`.
**Stored but NOT rendered (future-proofing):** `dyes`, `priceNote` (site never displays dollar prices — they go stale).

Builder A: update the schema comment block at the top of `products.js` to document the above (mark optional fields OPTIONAL, note the render/future split). `FEATURED_IDS` unchanged.

---

## 2. DATA CONTENT — Builder A pastes these three entries verbatim

Replace the existing `gorilla-mode`, `c4-original`, and `legion-pulse` objects with the objects below. **The other 13 products stay byte-for-byte unchanged.**

```js
{
    id: "gorilla-mode",
    name: "Gorilla Mode",
    brand: "Gorilla Mind",
    accentColor: "#9B7FDB",
    stimFree: false,
    badges: ["High Stim", "Fully Disclosed Label"],
    caffeineMg: 400,
    keyIngredients: [
      { name: "L-Citrulline", dose: "10 g", clinicalNote: "Above the 6–8 g range used in most citrulline studies — and it's pure citrulline, not malate." },
      { name: "Creatine Monohydrate", dose: "5 g", clinicalNote: "The standard 3–5 g daily amount used in creatine research." },
      { name: "Betaine Anhydrous", dose: "4 g", clinicalNote: "Above the 2.5 g/day used in nearly all betaine strength studies." },
      { name: "HydroPrime Glycerol (65%)", dose: "4 g", clinicalNote: "Yields about 2.6 g glycerol, typical pre-workout hyperhydration dosing; also why the powder clumps." }
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
    scoopNote: "All doses shown are the FULL two-scoop maximum dose (about 40.6 g), which is how Gorilla Mind markets the product. The printed label serving is one scoop at 40 servings per tub; every one-scoop value is exactly half. The label caps use at two scoops per 24 hours.",
    halfServingNote: "At one scoop the tub yields 40 servings and half of every dose — including 200 mg caffeine.",
    fullPanel: [
      { name: "Niacin (as Niacinamide)", doseLabel: "32 mg (200% DV)", clinicalRange: "RDA is 14–16 mg/day", assessment: "not enough research" },
      { name: "Vitamin B6 (as P5P)", doseLabel: "20 mg (1176% DV)", clinicalRange: "RDA is 1.3–1.7 mg/day; upper limit 100 mg/day", assessment: "not enough research" },
      { name: "Vitamin B12 (as Methylcobalamin)", doseLabel: "250 mcg (10417% DV)", clinicalRange: "RDA is 2.4 mcg/day", assessment: "not enough research" },
      { name: "Magnesium (as Bisglycinate)", doseLabel: "50 mg (12% DV)", clinicalRange: "Performance and sleep studies use 200–450 mg elemental", assessment: "below studied range" },
      { name: "Sodium", doseLabel: "380 mg (17% DV)", clinicalRange: "Pre-exercise sodium-loading studies use 1,000–3,600 mg", assessment: "below studied range" },
      { name: "Potassium (as Potassium Chloride)", doseLabel: "380 mg (8% DV)", clinicalRange: "Sports rehydration formulas typically supply 150–500 mg", assessment: "not enough research" },
      { name: "L-Citrulline", doseLabel: "10 g", clinicalRange: "6–8 g of pure L-citrulline in most pump and endurance studies", assessment: "above studied range" },
      { name: "Creatine Monohydrate", doseLabel: "5 g", clinicalRange: "3–5 g/day maintenance in the overwhelming majority of creatine trials", assessment: "at studied range" },
      { name: "L-Tyrosine", doseLabel: "5 g", clinicalRange: "Cognition-under-stress studies dose roughly 7–12 g for a 75 kg adult", assessment: "below studied range" },
      { name: "Betaine Anhydrous", doseLabel: "4 g", clinicalRange: "2.5 g/day in nearly all strength and power trials", assessment: "above studied range" },
      { name: "HydroPrime Glycerol Powder (65%)", doseLabel: "4 g (≈2.6 g glycerol)", clinicalRange: "About 2–4 g of 65% glycerol powder is typical supplement dosing", assessment: "at studied range" },
      { name: "Malic Acid", doseLabel: "3 g", clinicalRange: "No established standalone performance dose", assessment: "not enough research" },
      { name: "Pink Himalayan Sea Salt", doseLabel: "1 g", clinicalRange: "No specific studied dose; feeds the sodium row", assessment: "not enough research" },
      { name: "Alpha-GPC 50%", doseLabel: "800 mg (≈400 mg alpha-GPC)", clinicalRange: "300–600 mg of actual alpha-GPC in power and cognition studies", assessment: "at studied range" },
      { name: "Caffeine Anhydrous", doseLabel: "400 mg", clinicalRange: "3–6 mg/kg (about 200–450 mg for most adults); 400 mg/day is the FDA's general reference ceiling", assessment: "at studied range" },
      { name: "Huperzine A", doseLabel: "200 mcg", clinicalRange: "50–200 mcg per dose in cognitive studies", assessment: "at studied range" }
    ],
    flavors: ["Fruit Punch", "Blackberry Lemonade", "Orange Ice Dream", "Cherry Blackout", "White Gummy Bear", "Rocket Frost", "Tiger's Blood", "Mouthwatering Watermelon", "Orange Rush", "Blue Raspberry", "Rainbow Sherbet", "Cotton Candy Grape", "Pink Lemonade", "Red Gummy Fish"],
    sweeteners: ["Sucralose", "Acesulfame Potassium"],
    dyes: [],
    certifications: ["Third-party batch tested by Dyad Labs, with certificates of analysis published on gorillamind.com"],
    labelWarnings: [
      "Do not exceed 2 scoops in any 24-hour period.",
      "Not intended for persons under 18.",
      "Do not use if pregnant or nursing.",
      "Consult a physician before use if you have any medical condition or take medication.",
      "Do not combine with other caffeinated products or stimulants.",
      "Discontinue use at least 2 weeks prior to surgery.",
      "Carries a California Proposition 65 warning."
    ],
    priceNote: "Checked 2026-07-27: about $59.99 per 812 g tub at the brand site and Amazon — roughly $3.00 per two-scoop dose, $1.50 per single scoop.",
    reformulationNote: "Reformulated March 2024 (\"Gorilla Mode 2.0\"): caffeine went 350 to 400 mg, citrulline 9 to 10 g, betaine 2.5 to 4 g, tyrosine 1.5 to 5 g; GlycerPump was replaced by HydroPrime; eria jarensis, kanna, agmatine and BioPerine were removed; electrolytes and B-vitamins were added. Old-formula panels (350 mg caffeine, GlycerPump) still circulate at some retailers — check for HydroPrime and 4 g betaine to confirm you're reading the current label.",
    sources: [
      { url: "https://gorillamind.com/products/gorilla-mode", label: "Gorilla Mind — official product page" },
      { url: "https://www.muscleandstrength.com/store/gorilla-mode.html", label: "Muscle & Strength — supplement facts transcription" },
      { url: "https://www.priceplow.com/gorilla-mind/gorilla-mode-pre-workout", label: "PricePlow — independent dose cross-check" },
      { url: "https://www.stack3d.com/2024/03/gorilla-mode-2024.html", label: "Stack3d — 2024 reformulation coverage" },
      { url: "https://barbend.com/gorilla-mode-pre-workout-review/", label: "BarBend — third-party review" }
    ],
    lastChecked: "2026-07-27",
    images: []
  },
```

```js
{
    id: "c4-original",
    name: "C4 Original",
    brand: "Cellucor",
    accentColor: "#F27E4A",
    stimFree: false,
    badges: ["Moderate Stim", "Fully Disclosed Label", "Budget Pick"],
    caffeineMg: 200,
    keyIngredients: [
      { name: "CarnoSyn Beta-Alanine", dose: "2 g", clinicalNote: "Below the 3.2–6.4 g/day range used in beta-alanine research — mild tingles still possible." },
      { name: "Velox (L-Citrulline + L-Arginine)", dose: "2.4 g", clinicalNote: "A fully disclosed 1.2 g / 1.2 g split — well under the 6–8 g used in citrulline studies." },
      { name: "Creatine Nitrate (NO3-T)", dose: "1 g", clinicalNote: "Well below the 3–5 g standard used in creatine research." }
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
    scoopNote: "All doses are per the printed single-scoop serving (about 9 g). Unlike the two-scoop heavyweights, no double-scoop protocol is marketed for this formula.",
    fullPanel: [
      { name: "Vitamin B6 (as P5P)", doseLabel: "3.4 mg (200% DV)", clinicalRange: "RDA is 1.3–1.7 mg/day", assessment: "not enough research" },
      { name: "Folate", doseLabel: "100 mcg DFE (25% DV)", clinicalRange: "RDA is 400 mcg DFE/day", assessment: "not enough research" },
      { name: "Vitamin B12 (as Methylcobalamin)", doseLabel: "6 mcg (250% DV)", clinicalRange: "RDA is 2.4 mcg/day", assessment: "not enough research" },
      { name: "Choline", doseLabel: "225 mg (41% DV)", clinicalRange: "Performance and cognition studies of supplemental choline generally use 1–2 g", assessment: "below studied range" },
      { name: "CarnoSyn Beta-Alanine", doseLabel: "2 g", clinicalRange: "3.2–6.4 g/day, taken daily to saturate muscle carnosine", assessment: "below studied range" },
      { name: "Velox (L-Citrulline + L-Arginine)", doseLabel: "2.4 g (1.2 g + 1.2 g)", clinicalRange: "Pure L-citrulline is studied at 6–8 g; L-arginine at 3–6 g", assessment: "below studied range" },
      { name: "Creatine Nitrate (NO3-T)", doseLabel: "1 g", clinicalRange: "Creatine is studied at 3–5 g/day maintenance (as monohydrate)", assessment: "below studied range" },
      { name: "PeptiPump Bioactive Lentil Peptides", doseLabel: "100 mg", clinicalRange: "No published independent human performance research", assessment: "not enough research" },
      { name: "Caffeine Anhydrous", doseLabel: "200 mg", clinicalRange: "3–6 mg/kg (about 200–450 mg for most adults)", assessment: "at studied range" },
      { name: "Toothed Clubmoss Extract", doseLabel: "5 mg (≈50 mcg huperzine A)", clinicalRange: "50–200 mcg huperzine A per dose in cognitive studies", assessment: "at studied range" }
    ],
    flavors: ["Icy Blue Razz", "Watermelon", "Rainbow Blast", "Jolly Rancher Green Apple", "Hawaiian Punch (Fruit Juicy Red)", "Popsicle (Cherry)"],
    sweeteners: ["Sucralose", "Acesulfame Potassium"],
    dyes: ["FD&C Red #40 on red flavors; colorant varies by flavor"],
    certifications: [],
    labelWarnings: [
      "Do not use this product continuously for more than 8 weeks.",
      "Do not combine with other caffeine- or stimulant-containing products."
    ],
    priceNote: "Checked 2026-07-27: $34.99 list at cellucor.com for 30 servings (about $1.17 per serving); seen at $29.99 at third-party retailers.",
    reformulationNote: "Reformulated February 2024 as part of the fifth-generation C4 line: caffeine 150 to 200 mg, beta-alanine 1.6 to 2 g, the undisclosed \"Explosive Energy Blend\" removed and replaced by the fully disclosed Velox citrulline/arginine blend, with PeptiPump and huperzine-bearing clubmoss added. Cellucor still hosts a legacy page for the old 150 mg formula and old stock still circulates.",
    sources: [
      { url: "https://cellucor.com/products/c4-original", label: "Cellucor — official product page" },
      { url: "https://nutricartel.com/products/c4-original-pre-workout", label: "NutriCartel — full supplement facts transcription" },
      { url: "https://blog.priceplow.com/supplement-news/c4-2024", label: "PricePlow — 2024 relaunch coverage" },
      { url: "https://blog.priceplow.com/supplement-news/c4-original-bubble-yum", label: "PricePlow — dose-by-dose cross-check" }
    ],
    lastChecked: "2026-07-27",
    images: []
  },
```

```js
{
    id: "legion-pulse",
    name: "Pulse",
    brand: "Legion",
    accentColor: "#4E9FD4",
    stimFree: false,
    badges: ["High Stim", "Fully Disclosed Label"],
    caffeineMg: 350,
    keyIngredients: [
      { name: "Citrulline Malate", dose: "8 g", clinicalNote: "At the top of the 6–8 g range used in most citrulline malate studies (about 5.3 g actual citrulline)." },
      { name: "Beta-Alanine", dose: "3.6 g", clinicalNote: "In the 3.2–6.4 g/day range used in beta-alanine research — expect tingles." },
      { name: "Betaine Anhydrous", dose: "2.5 g", clinicalNote: "Matches the 2.5 g amount used in most betaine studies." },
      { name: "L-Theanine", dose: "350 mg", clinicalNote: "Paired 1:1 with caffeine, a combination studied for smoother focus." }
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
    scoopNote: "All doses shown are per the full two-scoop serving (23.5 g). Legion's directions call for one scoop before normal training and two scoops only for intense sessions longer than 45 minutes.",
    halfServingNote: "At the one-scoop default the 20-serving bottle lasts 40 workouts and every dose is halved — 175 mg caffeine.",
    fullPanel: [
      { name: "L-Citrulline DL-Malate 2:1", doseLabel: "8 g", clinicalRange: "6–8 g citrulline malate in most performance studies", assessment: "at studied range" },
      { name: "Beta-Alanine", doseLabel: "3.6 g", clinicalRange: "3.2–6.4 g/day, taken daily to saturate muscle carnosine", assessment: "at studied range" },
      { name: "Betaine Anhydrous", doseLabel: "2.5 g", clinicalRange: "2.5 g/day is the standard dose in power and strength studies", assessment: "at studied range" },
      { name: "Caffeine Anhydrous", doseLabel: "350 mg", clinicalRange: "3–6 mg/kg (about 200–450 mg for most adults)", assessment: "at studied range" },
      { name: "L-Theanine", doseLabel: "350 mg", clinicalRange: "100–400 mg, commonly paired 1:1 with caffeine", assessment: "at studied range" },
      { name: "Alpha-GPC 50%", doseLabel: "300 mg (≈150 mg alpha-GPC)", clinicalRange: "300–600 mg of actual alpha-GPC in power and cognition studies", assessment: "below studied range" },
      { name: "Sodium", doseLabel: "400 mg (17% DV)", clinicalRange: "Electrolyte support; content varies by flavor", assessment: "not enough research" },
      { name: "Potassium", doseLabel: "440 mg (9% DV)", clinicalRange: "Electrolyte support; content varies by flavor", assessment: "not enough research" },
      { name: "Calcium", doseLabel: "27 mg (2% DV)", clinicalRange: "Largely from the anti-caking agent; incidental", assessment: "not enough research" }
    ],
    flavors: ["Fruit Punch", "Blue Raspberry", "Sour Mango", "Red Gummy Fish", "Strawberry Blast", "Cotton Candy", "Strawberry Kiwi", "Frosted Cranberry", "Peach Ring", "Pink Lemonade", "Grape", "Lemon Iced Tea", "Watermelon", "Strawberry Margarita", "Pina Colada", "Sour Candy", "Blueberry Lemonade", "Arctic Blast", "Green Apple", "Cherry Limeade", "Berries & Cream", "Lemon Lime", "Rainbow Sherbet", "Tropical Punch", "Blood Orange", "Mojito", "Pineapple Whip"],
    sweeteners: ["Erythritol", "Stevia Leaf Extract"],
    dyes: [],
    certifications: [
      "Labdoor certified per the manufacturer, with a current certificate of analysis published on the product page",
      "Manufactured in NSF-certified, FDA-inspected US facilities (facility-level, not product-level certification)"
    ],
    labelWarnings: [
      "Do not use if under 18, pregnant, or nursing.",
      "Contains 350 mg of caffeine per full two-scoop serving; do not combine with other caffeine or stimulant sources.",
      "First-time users should assess tolerance with a single scoop.",
      "Consult a physician before use if you have a medical condition or take prescription medication.",
      "Produced in a facility that also processes milk, eggs, fish, shellfish, tree nuts, peanuts, wheat and soybeans.",
      "Beta-alanine commonly causes harmless temporary skin tingling."
    ],
    priceNote: "Checked 2026-07-27: $49.99 list at legionathletics.com for the 20-serving bottle ($2.50 per two-scoop serving, about $1.25 per scoop); $34.99 on subscription.",
    reformulationNote: "The formula is unchanged, but the packaging is not: the current bottle is 20 servings at 23.5 g per two-scoop serving. Reviews citing 21 servings at 22.76 g describe the previous tub — the doses did not change.",
    sources: [
      { url: "https://legionathletics.com/products/supplements/pulse-pre-workout/", label: "Legion — official product page" },
      { url: "https://legionathletics.com/wp-content/uploads/2022/12/Image-2-pulse-Fruit-Punch-20S-ingredients-carousel-2.png", label: "Legion — supplement facts panel image (primary label source)" },
      { url: "https://www.samedaysupplements.com/legion-pulse-pre-workout.html", label: "SameDaySupplements — independent panel transcription" },
      { url: "https://www.garagegymreviews.com/legion-pulse", label: "Garage Gym Reviews — dose cross-check" },
      { url: "https://barbend.com/legion-pulse-pre-workout-review/", label: "BarBend — third-party review" }
    ],
    lastChecked: "2026-07-27",
    images: []
  },
```

Distillation rules applied (Builder A does not deviate): cautions are factual, structure/function language only, no medical advice; every dose cites its label basis (two-scoop vs one-scoop); no dollar prices outside `priceNote`.

---

## 3. `product.html` (new, Builder B) — exact file

Header, nav, footer copied byte-for-byte from `hub.html` (no `sc-active` class on any nav link). Body:

```html
<main>
  <section class="sc-hub-intro">
    <div class="sc-container sc-pdp-container">
      <p class="sc-disclosure-line">Heads up: the product links below are affiliate links. We may earn a commission if you buy — at no extra cost to you. <a href="disclosure.html">Details</a>.</p>
    </div>
  </section>
  <section class="sc-pdp-section">
    <div class="sc-container sc-pdp-container" id="sc-product-root"></div>
  </section>
</main>
```

`<title>Product — Scoop Sense</title>`, same favicon/meta pattern as hub. Before `</body>`: `<script src="data/products.js"></script><script src="js/product.js"></script>`.

`product.js` reads `new URLSearchParams(location.search).get("id")`, finds the product in `PRODUCTS`. Unknown/missing id renders into the mount:

```html
<div class="sc-empty" style="margin-top:32px">
  <h1 style="font-size:1.6rem">That tub isn't on file.</h1>
  <p>We don't have a product with that id. <a href="hub.html">Back to the hub</a>.</p>
</div>
```

On success set `document.title = p.name + " — " + p.brand + " — Scoop Sense"`.

---

## 4. `js/product.js` rendering spec

IIFE, `"use strict"`, no globals. **Duplicate the `esc()` helper verbatim from app.js** (same five replacements; app.js stays IIFE-private, no sharing). Every interpolated value — HTML and SVG alike — goes through `esc()` (the same charset is XML-safe for the SVG slides). Build buy hrefs as `esc(p.affiliateUrl)`; card link ids as `encodeURIComponent(p.id)` then `esc()`.

Render into `#sc-product-root`, root wrapper carries the accent:

```html
<a class="sc-link sc-pdp-back" href="hub.html">&larr; Back to results</a>
<nav class="sc-pdp-breadcrumb" aria-label="Breadcrumb">
  <a href="hub.html">Hub</a> / <span>{brand}</span> / <span aria-current="page">{name}</span>
</nav>
<div class="sc-pdp" style="--sc-accent:{accent}">
  <div class="sc-pdp-gallery"> …gallery (below)… </div>
  <div class="sc-pdp-info"> …info (below)… </div>
</div>
```

`.sc-pdp-back` click handler: `if (document.referrer.indexOf("hub.html") !== -1 && history.length > 1) { e.preventDefault(); history.back(); }` — restores hub filter/scroll state for free; falls through to a plain `hub.html` link otherwise.

**Gallery column:**

```html
<div class="sc-pdp-stage" tabindex="0" aria-label="Product image gallery. Use left and right arrow keys to change slides.">
  <button type="button" class="sc-pdp-arrow sc-pdp-arrow-prev" aria-label="Previous slide">&#8249;</button>
  <img src="{slides[0].src}" alt="{slides[0].alt}">
  <button type="button" class="sc-pdp-arrow sc-pdp-arrow-next" aria-label="Next slide">&#8250;</button>
</div>
<p class="sc-pdp-slide-label" aria-live="polite">Slide 1 of 3 — Tub</p>
<div class="sc-pdp-thumbs">
  <!-- one per slide -->
  <button type="button" class="sc-pdp-thumb" aria-label="Show slide {n}: {label}" aria-current="true|false"><img src="{slide.src}" alt=""></button>
</div>
```

State: `current` index; `goTo(i)` wraps with `(i + n) % n`, swaps the stage `img` src/alt (direct property assignment, not innerHTML), updates each thumb's `aria-current`, and sets the live label text `"Slide N of {n} — {label}"`. Wire: prev/next buttons; thumb clicks; one `keydown` listener on `.sc-pdp-gallery` — `ArrowLeft` prev, `ArrowRight` next, `preventDefault()` on both. Slides come from `buildSlides(p)` (section 5): generated info-slides normally, `p.images` verbatim when non-empty (labels "Photo 1..N") — zero other code changes.

**Info column, in this exact order** (conversion-first hierarchy; every optional block is `field ? render : ""`):

1. `<p class="sc-card-brand">{brand}</p>` and `<h1 class="sc-pdp-name">{name}</h1>` — reuse card brand styling.
2. All badges as chips (reuse `chipClassFor` logic duplicated locally: `Stim-Free` → `sc-chip sc-chip-stimfree`, `High Stim` → `sc-chip sc-chip-highstim`, else `sc-chip-neutral`), in a `.sc-pdp-chips` row.
3. Caffeine stat — identical markup to the card's `.sc-card-stat` block (including the stim-free variant).
4. `halfServingNote` if present, as `<p class="sc-pdp-halfnote">`.
5. **Primary buy CTA**: `<div class="sc-card-cta"><a class="sc-btn sc-btn-buy" href="{affiliateUrl}" target="_blank" rel="sponsored nofollow noopener">Check price on Amazon</a><p class="sc-affiliate-note">Affiliate link — we may earn a commission.</p></div>`
6. `<p class="sc-pdp-blurb">{blurb}</p>`
7. `scoopNote` if present, as callout `<p class="sc-pdp-scoopnote">{scoopNote}</p>`.
8. **Dose panel** under heading `<p class="sc-details-heading">Label breakdown</p>` (researched) or `Key ingredients` (basic):
   - If `p.fullPanel`: one `.sc-pdp-dose-row` per entry —
     ```html
     <div class="sc-pdp-dose-row">
       <div class="sc-pdp-dose-head"><span class="sc-pdp-dose-name">{name}</span><span class="sc-pdp-dose-amt">{doseLabel}</span></div>
       {bar}
       <p class="sc-pdp-dose-note">{clinicalRange}</p>
     </div>
     ```
     `{bar}` by assessment, reusing the homepage dose-bar classes: `above studied range` → `<div class="sc-bar"><div class="sc-bar-fill" style="width:100%"></div></div>`; `at studied range` → same, width 78%; `below studied range` → `sc-bar-fill sc-bar-fill-low`, width 35%; `not enough research` → no bar, instead `<span class="sc-chip sc-chip-neutral">Limited research</span>`. (The bar's built-in 75% tick marks the studied threshold.)
   - Else: the current details-panel ingredient list markup (`<ul class="sc-card-ingredients">` with `<li><strong>{name} — {dose}.</strong> <span class="sc-note">{clinicalNote}</span></li>`).
   - Directly under the panel, always: `<p class="sc-verify-note">Ingredient figures come from manufacturer labels and can change without notice. Always verify against the current label on the product you buy.</p>` (verbatim from hub).
9. **Worth knowing** — `<p class="sc-details-heading">Worth knowing</p>` + `.sc-card-cautions` div of `sc-chip sc-chip-caution` chips from `p.cautions` (same as today's details panel).
10. Meta rows (`.sc-pdp-meta`): servings/price line (`{servings} servings · {priceRange}`); flavors — if `p.flavors` render `Flavors: {flavors.join(", ")}` else `p.flavorsNote`; `Sweeteners: {sweeteners.join(", ")}` if present; `Certifications:` list if non-empty array.
11. **Sources & last checked** (researched only — render when `p.sources && p.sources.length`):
    ```html
    <details class="sc-pdp-sources">
      <summary>Sources &amp; last checked — {lastChecked}</summary>
      {reformulationNote ? <p class="sc-pdp-reform">{reformulationNote}</p> : ""}
      <ul> <li><a href="{url}" target="_blank" rel="noopener">{label}</a></li>… </ul>
      {labelWarnings ? heading "From the manufacturer's label" + <ul> of items : ""}
    </details>
    ```
    Source links are plain references — `rel="noopener"` only, NOT `sponsored nofollow` (they are not affiliate links). No placeholder for the 13 basic products — section simply absent.
12. **Bottom buy CTA** — same markup as item 5, wrapped in `.sc-pdp-cta-bottom`.

Desktop reachability: the gallery column is `position: sticky` (section 8); no floating bars, the repeated bottom CTA covers long pages on mobile.

---

## 5. Generated slides — exact SVG builders (in product.js)

```js
var DEFAULT_ACCENT = "#C6FF33";

function svgURI(svg) { return "data:image/svg+xml," + encodeURIComponent(svg); }

function wrapText(str, maxChars) {
  var words = String(str).split(" "), lines = [], line = "";
  for (var i = 0; i < words.length; i++) {
    var t = line ? line + " " + words[i] : words[i];
    if (t.length > maxChars && line) { lines.push(line); line = words[i]; }
    else { line = t; }
  }
  if (line) lines.push(line);
  return lines;
}

function tspans(lines, x, lineH) {
  return lines.map(function (ln, i) {
    return '<tspan x="' + x + '" dy="' + (i === 0 ? 0 : lineH) + '">' + esc(ln) + "</tspan>";
  }).join("");
}
```

**Slide 1 — tub render** (the card's `.sc-tub`, blown up):

```js
function tubSlide(p, accent) {
  var initial = esc(String(p.brand || "?").charAt(0).toUpperCase());
  return svgURI(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" font-family="Arial, Helvetica, sans-serif">' +
    '<defs><linearGradient id="b" x1="0" y1="0" x2="0" y2="1">' +
    '<stop offset="0" stop-color="#FFFFFF" stop-opacity="0.22"/>' +
    '<stop offset="0.4" stop-color="#FFFFFF" stop-opacity="0.05"/>' +
    '<stop offset="1" stop-color="#000000" stop-opacity="0.4"/></linearGradient></defs>' +
    '<rect width="800" height="800" fill="#0B0D0C"/>' +
    '<rect x="250" y="170" width="300" height="430" rx="14" fill="' + esc(accent) + '"/>' +
    '<rect x="250" y="170" width="300" height="430" rx="14" fill="url(#b)"/>' +
    '<rect x="250" y="170" width="300" height="64" rx="14" fill="#000000" opacity="0.45"/>' +
    '<circle cx="545" cy="595" r="46" fill="' + esc(accent) + '" stroke="#0B0D0C" stroke-width="8"/>' +
    '<circle cx="545" cy="595" r="34" fill="#FFFFFF" opacity="0.75"/>' +
    '<text x="400" y="475" text-anchor="middle" font-size="150" font-weight="800" fill="#FFFFFF">' + initial + '</text>' +
    '<text x="400" y="690" text-anchor="middle" font-size="24" letter-spacing="4" fill="#9A9C93">' + esc(String(p.brand).toUpperCase()) + '</text>' +
    '<text x="400" y="734" text-anchor="middle" font-size="40" font-weight="800" fill="#F4F1E8">' + esc(String(p.name).toUpperCase()) + '</text>' +
    '</svg>');
}
```

**Slide 2 — facts panel** (mono numbers, ruled rows; this is where zoom earns its keep). Rows = a synthetic caffeine row (`{ name: "Caffeine", dose: p.stimFree ? "0 mg" : p.caffeineMg + " mg", clinicalNote: "per labeled serving" }`) followed by `p.keyIngredients.slice(0, 4)`:

```js
function factsSlide(p, accent) {
  var rows = [{ name: "Caffeine", dose: p.stimFree ? "0 mg" : p.caffeineMg + " mg",
                clinicalNote: "per labeled serving" }].concat(p.keyIngredients.slice(0, 4));
  var y = 220, body = "";
  rows.forEach(function (ing) {
    var notes = wrapText(ing.clinicalNote, 60).slice(0, 2);
    body +=
      '<line x1="70" y1="' + (y - 36) + '" x2="730" y2="' + (y - 36) + '" stroke="#2A2D2A" stroke-width="2"/>' +
      '<text x="70" y="' + y + '" font-size="27" font-weight="700" fill="#F4F1E8">' + esc(ing.name) + '</text>' +
      '<text x="730" y="' + y + '" text-anchor="end" font-size="27" font-weight="700" font-family="Consolas, Menlo, monospace" fill="' + esc(accent) + '">' + esc(ing.dose) + '</text>' +
      '<text x="70" y="' + (y + 32) + '" font-size="19" fill="#9A9C93">' + tspans(notes, 70, 25) + '</text>';
    y += 32 + notes.length * 25 + 46;
  });
  return svgURI(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" font-family="Arial, Helvetica, sans-serif">' +
    '<rect width="800" height="800" fill="#16191A"/>' +
    '<rect x="40" y="40" width="720" height="720" fill="none" stroke="#2A2D2A" stroke-width="2"/>' +
    '<text x="70" y="112" font-size="36" font-weight="800" fill="#F4F1E8">KEY DOSES</text>' +
    '<text x="70" y="148" font-size="18" letter-spacing="3" fill="#9A9C93">' + esc(String(p.brand + " " + p.name).toUpperCase()) + ' — PER LABELED SERVING</text>' +
    body +
    '<text x="70" y="732" font-size="18" fill="#9A9C93">Figures from the manufacturer label — always verify against the current label.</text>' +
    '</svg>');
}
```

**Slide 3 — caution sheet** (hazard-tape bands, amber register, from `p.cautions`):

```js
function cautionSlide(p) {
  var y = 250, items = "";
  p.cautions.forEach(function (c) {
    var lines = wrapText(c, 50).slice(0, 3);
    items +=
      '<rect x="70" y="' + (y - 24) + '" width="8" height="' + (lines.length * 30 + 6) + '" fill="#FFB020"/>' +
      '<text x="100" y="' + y + '" font-size="24" fill="#F0C87A">' + tspans(lines, 100, 30) + '</text>';
    y += lines.length * 30 + 42;
  });
  return svgURI(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" font-family="Arial, Helvetica, sans-serif">' +
    '<defs><pattern id="hz" width="40" height="40" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">' +
    '<rect width="40" height="40" fill="#241012"/><rect width="20" height="40" fill="#FFB020" opacity="0.55"/></pattern></defs>' +
    '<rect width="800" height="800" fill="#241012"/>' +
    '<rect width="800" height="56" fill="url(#hz)"/>' +
    '<rect y="744" width="800" height="56" fill="url(#hz)"/>' +
    '<text x="70" y="146" font-size="40" font-weight="800" fill="#FFB020">READ BEFORE YOU SCOOP</text>' +
    '<text x="70" y="184" font-size="18" letter-spacing="3" fill="#F0C87A">' + esc(String(p.name).toUpperCase()) + ' — WORTH KNOWING</text>' +
    items +
    '<text x="70" y="712" font-size="18" fill="#F0C87A">Not medical advice. Talk to your doctor before starting any supplement.</text>' +
    '</svg>');
}

function buildSlides(p) {
  var accent = p.accentColor || DEFAULT_ACCENT;
  if (p.images && p.images.length) {
    return p.images.map(function (url, i) {
      return { src: url, alt: p.name + " — photo " + (i + 1), label: "Photo " + (i + 1) };
    });
  }
  return [
    { src: tubSlide(p, accent), alt: "Stylized tub render of " + p.name, label: "Tub" },
    { src: factsSlide(p, accent), alt: "Key doses panel for " + p.name, label: "Key doses" },
    { src: cautionSlide(p), alt: "Cautions for " + p.name, label: "Cautions" }
  ];
}
```

All font sizes ≥ 18px in an 800-unit viewBox — vector art, lossless at 2.2× zoom.

---

## 6. Hover zoom — exact mechanism

In-place scale (no lens pane): container clips, the SVG itself scales, transform-origin follows the cursor.

CSS:

```css
.sc-pdp-stage { position: relative; overflow: hidden; background: var(--sc-bg);
  border: 1px solid var(--sc-border); border-top: 2px solid var(--sc-accent, var(--sc-green)); }
.sc-pdp-stage img { display: block; width: 100%; height: auto;
  transition: transform 120ms ease-out; will-change: transform; }
@media (prefers-reduced-motion: reduce) {
  .sc-pdp-stage img { transition: none !important; transform: none !important; }
}
```

JS (called once after first render; `goTo` only swaps the img's src/alt so listeners persist):

```js
function wireZoom(stage, next) {
  var fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!fine) {           // touch: tap cycles slides; native pinch-zoom still works on the page
    stage.addEventListener("click", function (e) {
      if (e.target.closest(".sc-pdp-arrow")) return;
      next();
    });
    return;
  }
  if (reduced) return;   // zoom disabled entirely under reduced motion
  stage.addEventListener("mousemove", function (e) {
    var img = stage.querySelector("img");
    var r = stage.getBoundingClientRect();
    img.style.transformOrigin =
      ((e.clientX - r.left) / r.width * 100) + "% " +
      ((e.clientY - r.top) / r.height * 100) + "%";
    img.style.transform = "scale(2.2)";
  });
  stage.addEventListener("mouseleave", function () {
    var img = stage.querySelector("img");
    img.style.transform = "";
    img.style.transformOrigin = "";
  });
}
```

---

## 7. Card click-through (Builder B: `js/app.js` + `css/styles.css`)

The inline Details feature dies completely; the whole card links to the product page.

**app.js:** delete `wireCardToggles` and both call sites; delete `detailsId`, the toggle button, and the entire `.sc-card-details` block from `cardHTML`; delete the now-unused `ingredients`, `cautions`, `extraBadges` computations and `splitBadges` extras usage (keep the stim-chip split). Update the file-header comment. New card face (unchanged pieces omitted):

- Name becomes the stretched link — **nested anchors are invalid; the stretched link must NOT wrap the card**:
  `'<h3 class="sc-card-name"><a class="sc-card-link" href="product.html?id=' + esc(encodeURIComponent(p.id)) + '">' + esc(p.name) + '</a></h3>'`
- After the CTA block, replace the toggle with a passive hint row:
  `'<p class="sc-card-more">Full breakdown <span aria-hidden="true">&rarr;</span></p>'`
- Everything else (tub visual, brand, stim chip, stat, meta, buy CTA + affiliate note with `rel="sponsored nofollow noopener"`) stays identical. Featured cards on index automatically behave identically (shared `cardHTML`).

**CSS:** delete `.sc-details-toggle`, `.sc-toggle-chevron`, `.sc-card-details`, `.sc-card-details-inner` rules, the `.sc-card.sc-open` rules, and the details-only classes now unused by cards (`.sc-card-blurb`, `.sc-card-badges`, `.sc-details-heading`, `.sc-card-ingredients`, `.sc-note`, `.sc-card-cautions`, `.sc-card-flavors` — **keep the last five**, product.js reuses them). Remove `.sc-details-toggle:active` from the reduced-motion block. Add:

```css
.sc-card { position: relative; }
.sc-card-link { color: inherit; text-decoration: none; }
.sc-card-link::after { content: ""; position: absolute; inset: 0; z-index: 1; }
.sc-card-link:focus-visible { outline: none; }
.sc-card-link:focus-visible::after { outline: 2px solid var(--sc-green); outline-offset: -2px; }
.sc-card .sc-card-cta { position: relative; z-index: 2; }   /* buy link stays clickable above the stretched link */
.sc-card.sc-visible:hover, .sc-card.sc-visible:focus-within { border-color: var(--sc-accent, var(--sc-green)); }
.sc-card-more { display: flex; justify-content: center; gap: 8px; margin: 14px 0 0;
  padding: 10px 0 2px; border-top: 1px solid var(--sc-border);
  font-size: 0.78rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em;
  color: var(--sc-muted); }
.sc-card:hover .sc-card-more { color: var(--sc-green); }
```

Existing hover lift (translateY(-4px) + shadow) is kept as-is. `hub.html` and `index.html` need **no markup changes** — cards are JS-rendered; leave both files untouched apart from nothing.

---

## 8. New CSS — `sc-pdp-*` block (append as section 16 of styles.css)

```css
.sc-pdp-container { max-width: 1160px; }
.sc-pdp-section { padding: 24px 0 64px; }
.sc-pdp { display: grid; grid-template-columns: 1fr; gap: 32px; align-items: start; margin-top: 20px; }
.sc-pdp-back { display: inline-block; margin-top: 24px; font-size: 0.85rem; }
.sc-pdp-breadcrumb { font-family: var(--sc-font-mono); font-size: 0.75rem; letter-spacing: 0.08em;
  text-transform: uppercase; color: var(--sc-muted); margin-top: 8px; }
.sc-pdp-breadcrumb a { color: var(--sc-muted); }
.sc-pdp-breadcrumb a:hover { color: var(--sc-green); }
.sc-pdp-name { font-size: clamp(1.8rem, 4vw, 2.6rem); margin: 0 0 10px; }
.sc-pdp-chips { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 14px; }
.sc-pdp-blurb { color: var(--sc-muted); margin: 16px 0; }
.sc-pdp-halfnote { font-size: 0.88rem; color: var(--sc-muted); margin: 0 0 12px; }
.sc-pdp-scoopnote { background: var(--sc-surface); border: 1px solid var(--sc-border);
  border-left: 3px solid var(--sc-accent, var(--sc-green)); padding: 12px 14px;
  font-size: 0.88rem; color: var(--sc-muted); margin: 0 0 20px; }
.sc-pdp-dose-row { padding: 12px 0; border-bottom: 1px solid var(--sc-border); }
.sc-pdp-dose-head { display: flex; justify-content: space-between; gap: 12px; margin-bottom: 6px; }
.sc-pdp-dose-name { font-size: 0.9rem; font-weight: 600; }
.sc-pdp-dose-amt { font-family: var(--sc-font-mono); font-size: 0.9rem; color: var(--sc-accent, var(--sc-green)); white-space: nowrap; }
.sc-pdp-dose-note { font-size: 0.82rem; color: var(--sc-muted); margin: 6px 0 0; }
.sc-pdp-meta { margin: 20px 0; font-size: 0.9rem; color: var(--sc-muted); }
.sc-pdp-meta p { margin: 0 0 8px; }
.sc-pdp-sources { background: var(--sc-surface); border: 1px solid var(--sc-border); padding: 14px 16px; margin: 20px 0; }
.sc-pdp-sources summary { cursor: pointer; font-family: var(--sc-font-mono); font-size: 0.8rem;
  letter-spacing: 0.08em; text-transform: uppercase; color: var(--sc-muted); }
.sc-pdp-sources summary:hover { color: var(--sc-green); }
.sc-pdp-sources ul { margin: 12px 0; font-size: 0.85rem; }
.sc-pdp-reform { font-size: 0.85rem; color: var(--sc-muted); margin: 12px 0; }
.sc-pdp-cta-bottom { margin-top: 24px; }
/* gallery */
.sc-pdp-arrow { position: absolute; top: 50%; transform: translateY(-50%); z-index: 2;
  width: 40px; height: 52px; background: rgba(11, 13, 12, 0.72); color: var(--sc-ink);
  border: 1px solid var(--sc-border); font-size: 1.3rem; line-height: 1; cursor: pointer; }
.sc-pdp-arrow-prev { left: 0; }
.sc-pdp-arrow-next { right: 0; }
.sc-pdp-arrow:hover, .sc-pdp-arrow:focus-visible { color: var(--sc-green); border-color: var(--sc-green); }
.sc-pdp-slide-label { font-family: var(--sc-font-mono); font-size: 0.75rem; letter-spacing: 0.1em;
  text-transform: uppercase; color: var(--sc-muted); margin: 8px 0 0; }
.sc-pdp-thumbs { display: flex; gap: 10px; margin-top: 12px; }
.sc-pdp-thumb { width: 72px; padding: 0; border: 1px solid var(--sc-border); background: var(--sc-bg); cursor: pointer; }
.sc-pdp-thumb img { display: block; width: 100%; height: auto; }
.sc-pdp-thumb[aria-current="true"] { border-color: var(--sc-accent, var(--sc-green)); box-shadow: 0 0 0 1px var(--sc-accent, var(--sc-green)); }
@media (min-width: 960px) {
  .sc-pdp { grid-template-columns: 55fr 45fr; gap: 48px; }
  .sc-pdp-gallery { position: sticky; top: 24px; }
}
```

Plus the `.sc-pdp-stage` rules from section 6. Focus-visible on stage/arrows/thumbs is covered by the existing global `button:focus-visible` rule (the stage is a div — add `.sc-pdp-stage:focus-visible { outline: 2px solid var(--sc-green); outline-offset: 2px; }`). Reduced motion: the section-6 media query plus the existing global kill-switch cover everything; no scroll reveal is used on the product page.

---

## 9. Do-not-touch list (both builders)

- `disclosure.html`, `disclaimer.html` — no edits at all.
- Footer markup and all legal sentences (FTC affiliate line, FDA statement, verify-against-label line) — copy verbatim where required, never reword.
- Hub filter bar markup and all filter/sort/search logic in app.js (`state`, `bucketOf`, `applyFilters`, `wireFilters`, `renderHub`, `renderFeatured`, reveal observer).
- `FEATURED_IDS`, the 13 non-researched product entries, `affiliateUrl` values and the `rel="sponsored nofollow noopener"` + `target="_blank"` pattern on every buy link.
- Design tokens in `:root`.

Acceptance checks: `hub.html?` grid cards click through to `product.html?id=<id>` for all 16 ids; buy buttons on cards still open Amazon without navigating to the product page; `product.html?id=bogus` shows the not-on-file panel; the three researched pages show 400/200/350 mg, the full panel table with bars, scoop notes, and a Sources & last checked collapsible dated 2026-07-27; C4 shows no Proprietary Blend badge anywhere; keyboard arrows cycle slides; hover zoom follows the cursor on desktop and is inert under reduced motion and on touch (where tap advances slides).