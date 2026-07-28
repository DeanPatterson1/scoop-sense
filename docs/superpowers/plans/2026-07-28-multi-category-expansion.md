# Multi-Category Expansion Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand Scoop Sense from pre-workout-only to five categories (pre-workout, creatine, protein, EAA, electrolytes) with per-category SEO landing pages, driven by one shared config-driven renderer.

**Architecture:** A new `js/categories.js` exposes `CATEGORY_CONFIG` (per-category labels, copy, tile facts, compare columns, badge rules). `js/app.js` reads it; a category page declares itself with `<body data-category="creatine">`, which locks the dataset and renders grid + embedded compare table from config. `data/products.js` stays the single data file; new products carry a category-specific `metrics` object. `scripts/build-product-pages.js` becomes category-aware for detail pages.

**Tech Stack:** Vanilla HTML/CSS/JS, no build step for pages; Node only for the static product-page generator. No test framework exists in this repo — verification is `node scripts/build-product-pages.js` exit 0, `python -m http.server`, and browser walk-through of every changed page.

**Spec:** `docs/superpowers/specs/2026-07-28-multi-category-expansion-design.md`

---

## Chunk 1: Config + renderer

### Task 1: `js/categories.js` — CATEGORY_CONFIG

**Files:**
- Create: `js/categories.js`
- Modify: `hub.html`, `index.html`, `compare.html`, `saved.html` — add `<script src="js/categories.js?v=…">` between `data/products.js` and `js/app.js`

Config shape (complete file is written in this task):

```js
// js/categories.js — category registry. Loaded after data/products.js,
// before js/app.js. Adding a category = one entry here + data + one page.
var CATEGORY_CONFIG = {
  "pre-workout": {
    label: "Pre-workout",
    plural: "pre-workouts",
    page: "hub.html",            // canonical browse page for the category
    stimBadges: true,             // always show a stim tag on tiles
    // Tile fact rows: {label, key} where key resolves via factOf()
    tileFacts: [
      { label: "Caffeine", key: "caffeineMg" },
      { label: "Citrulline", key: "ing:citrulline" },
      { label: "Beta-alanine", key: "ing:beta-alanine" }
    ],
    // Compare columns beyond the Product column: {label, key, sortable, num}
    compareCols: [
      { label: "Caffeine", key: "caffeineMg", sortable: true, num: true },
      { label: "Citrulline", key: "ing:citrulline", sortable: true, num: true },
      { label: "Beta-alanine", key: "ing:beta-alanine", sortable: true, num: true },
      { label: "Blend", key: "blend" },
      { label: "Stim tier", key: "stim" },
      { label: "Servings", key: "servings", sortable: true, num: true },
      { label: "Price", key: "price" }
    ]
  },
  creatine: {
    label: "Creatine", plural: "creatine products", page: "creatine.html",
    stimBadges: false,
    tileFacts: [
      { label: "Creatine", key: "m:creatineG:g" },
      { label: "Form", key: "m:form" },
      { label: "Servings", key: "servings" }
    ],
    compareCols: [
      { label: "Creatine", key: "m:creatineG:g", sortable: true, num: true },
      { label: "Form", key: "m:form" },
      { label: "Blend", key: "blend" },
      { label: "Servings", key: "servings", sortable: true, num: true },
      { label: "Price", key: "price" }
    ]
  },
  protein: {
    label: "Protein", plural: "protein powders", page: "protein.html",
    stimBadges: false,
    tileFacts: [
      { label: "Protein", key: "m:proteinG:g" },
      { label: "Per scoop", key: "protPct" },
      { label: "Source", key: "m:source" }
    ],
    compareCols: [
      { label: "Protein", key: "m:proteinG:g", sortable: true, num: true },
      { label: "Protein %", key: "protPct", sortable: true, num: true },
      { label: "Source", key: "m:source" },
      { label: "Sweetener", key: "m:sweetener" },
      { label: "Servings", key: "servings", sortable: true, num: true },
      { label: "Price", key: "price" }
    ]
  },
  eaa: {
    label: "EAA / BCAA", plural: "amino formulas", page: "eaa.html",
    stimBadges: true,             // caffeinated aminos exist; tag only if caffeinated (see tagsHTML rule)
    tileFacts: [
      { label: "EAAs", key: "m:eaaG:g" },
      { label: "BCAAs", key: "m:bcaaG:g" },
      { label: "Leucine", key: "m:leucineG:g" }
    ],
    compareCols: [
      { label: "EAAs", key: "m:eaaG:g", sortable: true, num: true },
      { label: "BCAAs", key: "m:bcaaG:g", sortable: true, num: true },
      { label: "Leucine", key: "m:leucineG:g", sortable: true, num: true },
      { label: "Caffeine", key: "caffeineMg", sortable: true, num: true },
      { label: "Servings", key: "servings", sortable: true, num: true },
      { label: "Price", key: "price" }
    ]
  },
  electrolytes: {
    label: "Electrolytes", plural: "hydration mixes", page: "electrolytes.html",
    stimBadges: true,
    tileFacts: [
      { label: "Sodium", key: "m:sodiumMg:mg" },
      { label: "Potassium", key: "m:potassiumMg:mg" },
      { label: "Sugar", key: "m:sugarG:g" }
    ],
    compareCols: [
      { label: "Sodium", key: "m:sodiumMg:mg", sortable: true, num: true },
      { label: "Potassium", key: "m:potassiumMg:mg", sortable: true, num: true },
      { label: "Magnesium", key: "m:magnesiumMg:mg", sortable: true, num: true },
      { label: "Sugar", key: "m:sugarG:g", sortable: true, num: true },
      { label: "Servings", key: "servings", sortable: true, num: true },
      { label: "Price", key: "price" }
    ]
  }
};
```

Key grammar (one resolver in app.js): `caffeineMg` | `servings` | `blend` | `stim` | `price` | `protPct` (computed proteinG/servingG) | `ing:<regex-ish name>` (existing keyIngredients lookup) | `m:<metricsKey>[:unit]` (reads `p.metrics`, appends unit, em-dash when missing/null).

- [ ] Write `js/categories.js` exactly as above (full file, `"use strict"`, no IIFE needed — it defines one global like products.js).
- [ ] Add the script tag to `hub.html`, `index.html`, `compare.html`, `saved.html` (order: products.js → categories.js → app.js).
- [ ] Open `hub.html` via local server; confirm zero console errors and hub renders unchanged.
- [ ] Commit: `feat: category config registry`

### Task 2: app.js — config-driven facts, tags, category pages

**Files:**
- Modify: `js/app.js`

Changes (each is small; the file stays one IIFE):

1. **Page category lock.** At init: `var PAGE_CATEGORY = document.body.getAttribute("data-category") || null;` When set: `state.category = PAGE_CATEGORY` permanently; `applyFilters()` filters on it; **`renderCompare()` filters its row set on it too** (this is what keeps compare.html pre-workout-only once new data lands); the `#sc-category` select is not rendered on category pages (pages simply omit it); "Clear all" resets to PAGE_CATEGORY, not "all". `compare.html` gets `data-category="pre-workout"` on its `<body>` in Task 3.
2. **`factOf(p, key)` resolver** implementing the key grammar (returns HTML string; `—` dim span for missing). `m:` keys read `p.metrics && p.metrics[k]`; null/undefined → dash. `protPct` = `Math.round(100 * p.metrics.proteinG / p.metrics.servingG) + "%"` guarded.
3. **`factSortValue(p, key)`** numeric twin for sorting (missing → -1).
4. **`tagsHTML`** rule change: show stim tag when `cfg.stimBadges && (categoryOf(p) === "pre-workout" || p.caffeineMg > 0)` — pre-workout always tagged, other categories only when caffeinated. Blend/disclosed tags unchanged.
5. **`tileHTML`** renders `cfg.tileFacts` via `factOf` instead of hard-coded Caffeine/Citrulline/Beta-alanine rows (config for `categoryOf(p)`; fallback to pre-workout config).
6. **Compare table generalization.** `renderCompare()`/`wireCompare()` gain config-driven columns: on pages with `data-category`, app builds the `<thead>` from `cfg.compareCols` into `#sc-compare` and rows via `factOf`; `compare.html` keeps its static pre-workout thead (unchanged path — `compareValue` maps to `factSortValue`).
7. **Homepage preview/starts**: unchanged (pre-workout rows resolve via same helpers). **Saved page becomes mixed-category-safe:** universal rows always render (Category, Servings, Price tier, Stim tier only when any saved product is caffeinated or pre-workout, Blend, Links); then for each distinct category among saved products, render that config's `tileFacts` rows (label deduped), `factOf` dashes where a row doesn't apply. Delete the hard-coded Citrulline/Beta-alanine/Creatine rows.
8. **`injectCatalogLD`** name: "Pre-workout label database" → "Supplement label database"; on category pages use `cfg.label + " label database"`.
9. **`categoryLabelOf`** uses `CATEGORY_CONFIG[c].label` when present (fixes "Eaa" capitalization).

- [ ] Implement 1–9.
- [ ] Serve; hub + compare + saved + homepage all render identically to before (pre-workout config reproduces old hard-coded output).
- [ ] Commit: `feat: config-driven renderer (category pages, facts, compare)`

## Chunk 2: Pages + data

### Task 3: Category pages ×4

**Files:**
- Create: `creatine.html`, `protein.html`, `eaa.html`, `electrolytes.html`
- Modify: footer Browse `<ul>` in all root pages + generator footer

Each page = hub.html skeleton with: `<body data-category="<slug>">`; own title/meta/OG ("Best Creatine Compared — Scoop Sense" pattern: honest, no superlative invention — use "Creatine Supplements Compared — Scoop Sense"); H1 + intro copy (2–3 sentences, category-specific, editorial); disclosure line (same as hub); toolbar WITHOUT the category select (search, brand, sort, clear; caffeine select and stim-free checkbox only on pages whose config `stimBadges` is true — eaa, electrolytes); grid + count + empty; embedded compare section `<section id="compare">` with `<table id="sc-compare">` empty thead (app builds it); verify-note; footer.

Category intro copy (write in-page, category-accurate, structure/function safe):
- creatine: forms (monohydrate vs HCl), 3–5 g/day studied dose framing, what we log.
- protein: protein per serving vs scoop size (protein %), source, sweetener; "protein powders supplement food".
- eaa: EAA vs BCAA-only distinction, leucine dose, caffeinated intra drinks flagged.
- electrolytes: sodium-forward vs sugar-based ORS designs, what the mg figures mean.

Footer Browse column (all 5 root pages + saved + disclosure/disclaimer + generator template) becomes:
All products / Pre-workouts (hub.html) — wait: hub IS all products. Final list: `All products` (hub.html), `Creatine` (creatine.html), `Protein` (protein.html), `EAA / BCAA` (eaa.html), `Electrolytes` (electrolytes.html), `Compare pre-workouts` (compare.html), `How we evaluate labels`.

- [ ] Write the four pages.
- [ ] Update footers sitewide (root pages; generator footer done in Task 6).
- [ ] Add category chip row on hub above grid: five links (`hub.html` "All", four category pages) styled as `sc-tag`-like chips — new small CSS block `.sc-cat-chips` in styles.css.
- [ ] Serve; each page renders (empty grid until data lands) with correct columns; no console errors.
- [ ] Commit: `feat: category landing pages`

### Task 4: Homepage + copy

**Files:**
- Modify: `index.html`, `css/styles.css` (category cards block), `disclosure.html`, `disclaimer.html`, `README.md`

- [ ] Hero: CTA button "Browse all pre-workouts" → "Browse the database"; lead already generic. Hero panel sub "38 supplement labels on file" → computed-at-edit count; add "5 categories tracked" row.
- [ ] New section after hero: `.sc-cats` — five cards (label, count line, one-line what-we-check, link). Static HTML (counts updated at edit time — keep honest).
- [ ] Fix stale CTA band copy ("Sixteen labels logged") → category-wide line.
- [ ] Methodology: add one sentence: per-category metrics (creatine grams, protein per scoop, sodium) logged the same way.
- [ ] FAQ: add "What categories does Scoop Sense cover?" entry + matching FAQPage LD item.
- [ ] disclosure/disclaimer: "pre-workout" → "supplement" where it narrows scope; caffeine guidance untouched.
- [ ] README: file map + add-a-product rules gain `metrics` field + categories.js; badge rule wording updated (stim badge only for caffeinated non-pre categories).
- [ ] Commit: `feat: multi-category homepage + copy widening`

### Task 5: Data integration (after research agents return)

**Files:**
- Modify: `data/products.js`

- [ ] Validate each agent JSON (`node -e` parse + field check script in scratchpad): required fields present, ids unique across ALL products, caffeineMg number, badges legal (stim badge only when caffeinated for non-pre), priceRange in {$,$$,$$$}, metrics keys per category, sources nonempty, no dollar signs in any copy string, structure/function red-flag scan (treat|cure|prevent|diagnose).
- [ ] Append to PRODUCTS grouped by category with section comments; update schema header comment (metrics field + "Third-Party Tested" badge).
- [ ] Load hub locally: 78 products, category dropdown shows five entries.
- [ ] Commit: `feat: creatine, protein, EAA, electrolyte product data (label-verified)`

## Chunk 3: Detail pages + verification

### Task 6: Category-aware generator

**Files:**
- Modify: `scripts/build-product-pages.js`

- [ ] Port `CATEGORY_CONFIG` load: `new Function` eval categories.js alongside products.js (same pattern as data load).
- [ ] `sc-detail-stats` block: render from cfg.tileFacts + Servings + Price tier (drop hard-coded Citrulline/Beta-alanine for non-pre categories; pre-workout output byte-identical where possible).
- [ ] `factsRowsHTML`: prepend category metric rows (e.g. "Creatine (monohydrate) — 5 g"; "Sodium — 1000 mg") before keyIngredients; caffeine row only when `caffeineMg > 0 || category === "pre-workout"`.
- [ ] `whoForHTML`: caffeine-tier sentence only for pre-workout/caffeinated; add metric-derived lines per category (e.g. protein % ≥ 80 → "A lean-ratio pick when calories matter." — data-derived only).
- [ ] `faqFor`: caffeine FAQ only when relevant; add per-category FAQ (creatine: "Do I need to load?" structure/function-safe; protein: "How much protein per scoop?"; eaa: EAA vs BCAA; electrolytes: sodium framing) — all data-derived from metrics.
- [ ] `relatedFor`: same category first (same brand, then nearest primary metric), never cross-category.
- [ ] `productLD.category` map for all five; buybox secondary button links to the category's browse page ("See all <plural>").
- [ ] Breadcrumb + nav footer gain category links (footer Browse list matches Task 3).
- [ ] **Sitemap:** generator also writes `sitemap.xml` (root pages + category pages + every product page, absolute-path-relative URLs) and `robots.txt`'s placeholder Sitemap line is activated.
- [ ] Run `node scripts/build-product-pages.js` — exit 0, ~78 pages + sitemap; diff a pre-workout page against git HEAD (only footer Browse links change).
- [ ] Commit: `feat: category-aware product page generator + regenerated pages`

### Task 7: Verify + legal

- [ ] `python -m http.server` + browser walk: index, hub (chips, dropdown, filters), each category page (search, sort, embedded compare sorting, deep-link `#compare`), one product page per category, saved flow across categories, mobile width reflow.
- [ ] Legal sweep (grep-based): every `affiliateUrl` anchor has `rel="sponsored nofollow noopener"`; no `$` amounts in copy (`grep -E '\$[0-9]'` over html+data excluding priceRange tiers/PRICE_TIPS); FDA sentence in every page footer; disclosure line above products on all five browse pages; treat/cure/prevent/diagnose scan over data.
- [ ] Fresh-context verifier subagent reviews the diff.
- [ ] Fix findings; commit: `chore: expansion verification fixes`
