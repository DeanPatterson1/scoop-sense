# Scoop Sense multi-category expansion — design

**Date:** 2026-07-28
**Status:** Approved (user), pending spec review
**Scope:** Expand from pre-workout-only to five categories: pre-workout, creatine, protein powder, EAA/BCAA, electrolytes/hydration. ~10 label-verified products per new category (~40 new products).

## Goals

- Each new category gets its own SEO landing page ranking for "best <category>" style queries.
- One shared renderer; adding a future category is a config entry + data, not new code.
- Site stays vanilla HTML/CSS/JS, no build step for pages, shippable after each category lands.
- All existing legal/trust rules apply unchanged (FTC disclosure, FDA footer, structure/function language only, no dollar prices, `rel="sponsored nofollow noopener"`).

## Architecture decision

**Config-driven categories** (chosen over per-page duplication and over a template generator):

- `js/categories.js` — new file, loaded before `app.js` on every page that renders products. Exposes `CATEGORY_CONFIG`: slug → `{ label, plural, page, stimBadges, tileFacts, compareCols }`. **Pre-workout is itself a config entry** — the currently hard-coded tile facts and compare columns migrate into it, so the renderer has no special case and a future category is genuinely config + data only.
- `js/app.js` — reads config. A category page declares itself via `<body data-category="creatine">`; app locks the dataset to that category (filtering AND compare-table rows) and renders toolbar, grid, and compare table from config. `hub.html` (no `data-category`) stays the all-products database with the existing category dropdown. `compare.html` declares `data-category="pre-workout"` so its table stays pre-workout-only once other categories land in the data.
- **Toolbar filter rule:** search, brand, sort, and clear-all appear on every browse page. The caffeine select and stim-free toggle appear only where the config's `stimBadges` flag is true (pre-workout, eaa, electrolytes) — they are meaningless on creatine/protein shelves.
- `data/products.js` stays the single source of truth for all categories (~80 products is still small for a static site; the all-products hub needs the full dataset anyway).

## Pages & navigation

New pages: `creatine.html`, `protein.html`, `eaa.html`, `electrolytes.html`. Each is a full category hub: own `<title>`/meta description/H1, short editorial intro, toolbar (search, sort, category-relevant filters), tile grid, and an embedded compare table section at `#compare` with category-specific columns.

`compare.html` remains pre-workout-only ("Compare pre-workouts") via `data-category="pre-workout"`. `hub.html` remains the all-products database.

**Saved shortlist (`saved.html`):** saves cross categories (localStorage is sitewide), so the saved table becomes mixed-category-safe: universal rows (Category, Servings, Price tier, Links) always render; metric rows render for each category present among saved products, with an em-dash where a row does not apply to a product. No hard-coded pre-workout-only rows remain.

Discovery (all crawlable): homepage category cards, a category chip row on `hub.html` above the grid, and four new links in the footer "Browse" column. Header nav shape unchanged.

## Data model

New optional `metrics` object per product; keys by category:

| Category | `metrics` keys |
| --- | --- |
| creatine | `creatineG`, `form` ("monohydrate" / "HCl" / "blend") |
| protein | `proteinG`, `servingG` (drives protein-% column), `source`, `sweetener` |
| eaa | `eaaG`, `bcaaG`, `leucineG` |
| electrolytes | `sodiumMg`, `potassiumMg`, `magnesiumMg`, `sugarG` |

`caffeineMg` stays universal (some EAA/hydration products carry caffeine). **Stim badge rule changes in the schema itself:** pre-workout entries keep exactly one stim badge as today; entries in other categories carry a stim badge **only when caffeinated** (`caffeineMg > 0`) and omit it otherwise — the `data/products.js` schema comment is updated to say so. Tile stim tags render from `caffeineMg` per the config `stimBadges` flag (pre-workout: always; other flagged categories: only when caffeinated), so protein/creatine tiles never show a meaningless "Stim-Free" chip. The allowed badge extras gain "Third-Party Tested" (only for label-verified NSF Certified for Sport / Informed Sport / Informed Choice marks). All other schema fields (keyIngredients, cautions, servings, priceRange, flavorsNote, affiliateUrl, blurb, labelVerified, sources, images) apply to every category unchanged.

## Homepage

Hero copy widens from "pre-workout" to sports supplements generally, same voice. New category cards section below the hero: five cards (product count + one line on what we check per category). Methodology section gains one sentence on per-category metrics. "Places to start" picks stay pre-workout for now. Hard-coded counts in copy ("All 38 products", "Sixteen labels logged") are corrected at edit time and reworded where a stale number would mislead.

## Product detail pages

`scripts/build-product-pages.js` becomes category-aware: facts-panel rows generated from `metrics` per category config; stim rows only where relevant. New product pages land in the same `products/` folder. Existing 38 pre-workout pages untouched until regenerated.

## Copy / legal touchups

`disclosure.html` and `disclaimer.html` reword "pre-workout" to "supplements" where scope demands; caffeine guidance stays. README file map updated. FDA footer already generic — unchanged.

## Research workstream

40 new products need label-verified data — the dominant cost, run as per-category research passes (parallel agents with web verification). Every entry gets `labelVerified` (month checked) and `sources`. Anything unverifiable stays off the site.

## Rollout order

1. Config system + creatine end-to-end (pilot: page, data, detail pages, homepage card).
2. Protein, EAA, electrolytes fill the same rails.
Site remains shippable after each step.

## SEO plumbing

A static `sitemap.xml` is generated (root pages + all product pages) by the page generator, and `robots.txt`'s placeholder Sitemap line is activated. Regenerated whenever product pages are rebuilt.

## Testing

Per category page: filters, sort, hash deep links, mobile drawer reflow, compare-table horizontal scroll. Legal checklist re-run per category launch: disclosure line above products, sponsored/nofollow on every affiliate anchor, no dollar prices, FDA footer present.
