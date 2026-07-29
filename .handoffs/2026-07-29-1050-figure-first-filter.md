---
date: 2026-07-29 10:50
topic: Figure-first filter — Simple / Advanced tabs on every browse page
status: paused
---

# Handoff: figure-first filter (Simple / Advanced)

## What we were doing
Replaced the browse-page filter. The old toolbar was a flat row of hard-coded selects (category, caffeine, brand, sort, stim-free checkbox) that only made sense for pre-workout. It is now a collapsible panel with two tabs that both start from one question — *which figure do you care about?* — built entirely from `CATEGORY_CONFIG`. All five browse pages share it. Everything is working and verified in a browser; **nothing is committed**.

## Done ✓
- **Two-pass build.** First pass shipped a per-figure grid with stacked multi-sorts and multi-target ranking. User said it wasn't simple. Second pass collapsed it to one chosen figure at a time — that is what is in the tree now. Do not reintroduce the grid.
- **Simple tab** — four labelled selects in one row: `Filter by` (figure) · `Amount` (range of it) · `Sort` (Name A–Z / High to low / Low to high) · `Price` (Budget / Mid-range / Premium).
- **Advanced tab** — same shape: `Filter by` · `Closest to` (typed number + unit) · `Match within` (Any / 10% / 25% / 50%) · `Price`. Orders by distance from the typed amount, closest first.
- **Figure list is config-derived** from each category's `compareCols` entries marked `sortable: true, num: true`. Category pages get a flat list; the all-products hub gets optgroups by supplement, with figures appearing in 2+ categories lifted into a shared "Any supplement" group.
- **Auto ranges** per figure, cut from the labels actually on file.
- Toolbar row is now one line: search · category · brand · "Filters & sort" (+ count badge) · Clear all.
- Removed: `sortOptions` from `js/categories.js` and `populateSorts()`, the stim-free checkbox, `#sc-caffeine`, `#sc-sort`, `.sc-check` CSS.
- README has a new "How the filter works" section; the file-map rows for `hub.html`, the category pages and `js/categories.js` were updated.
- Cache version bumped to **`20260729i`**; `node scripts/build-product-pages.js` re-run (187 pages).

## In-progress / not done
- [ ] **Nothing is committed.** 15 tracked files modified plus all 187 `products/*.html` (version bump only). Commit is the user's call.
- [ ] `.handoffs/` is still untracked.
- [ ] Carried over from the previous handoff and still true: `YOURTAG-20` affiliate placeholder in all 187 entries (blocked on the user joining Amazon Associates), reviews cover 39 of 187, 16 products have no imagery, not deployed.

## Key decisions (why, not just what)
- **One figure at a time, not a grid.** The first build gave every figure its own row with a range select and a sort toggle, and sorts stacked with rank badges. It was powerful and it was not simple — the user's words were "the simple isnt simple right now". The figure select is the whole simplification: it turns 6 rows of controls into 1.
- **Picking a figure filters to labels that list it.** Choosing Creatine on the all-products hub goes 187 → 39. Without this the hub returns every protein powder when you ask about creatine. A label that does not disclose the figure is excluded rather than treated as zero.
- **Figures come from `compareCols`, never a new config block.** Those columns already encode "the figures this category is chosen on". Deriving from them means the filter and the compare table cannot disagree, and a new category gets filters for free.
- **Shared "Any supplement" group** = figures appearing in more than one category (caffeine, servings). Without it caffeine ends up filed under Pre-workout on the hub, which is where a reader would never look for it on a protein page.
- **Figure and price are shared state across tabs; the tabs each render their own copy and mirror on change.** "Separate tabs kinda but same filter" was the user's framing.
- **Advanced distance is a plain absolute difference** now that only one figure is ever targeted. The first build normalised by each axis's spread because it averaged several targets — that machinery is gone, do not re-add it.
- **Toolbar drops `position: sticky` while the panel is open** (`.sc-toolbar.sc-open { position: static }`). A pinned element taller than a phone viewport can never be scrolled to its bottom.
- **Result count uses `scopePool().length`**, not `PRODUCTS.length` — "2 of 187" was a lie once a category was picked.

## Concrete identifiers (the stuff that will be lost to /clear)
- Cache version: **`20260729i`** — bump in the 10 root HTML files + `VERSION` in `scripts/build-product-pages.js`, then re-run the build.
- Local preview: `python -m http.server 8321 --bind 127.0.0.1` from project root. **A server is currently running on 8321 in the background.**
- Panel control ids: `sc-figure` / `sc-figure-adv`, `sc-range`, `sc-dir`, `sc-price` / `sc-price-adv`, `sc-target`, `sc-target-unit`, `sc-tolerance`, `sc-tab-simple`, `sc-tab-advanced`, `sc-panel-simple`, `sc-panel-advanced`, `sc-note-simple`, `sc-note-advanced`, `sc-filters-count`.
- `state` shape: `{ search, category, brand, mode, figure, bucket, dir, price, target, tolerance }`. `figure` is an axis key or `""`; `bucket` is `"all"` or a numeric index as a string; `dir` is `""` / `"desc"` / `"asc"`.
- Axis keys are the raw compare-column keys **including the unit suffix** — `m:creatineG:g`, not `m:creatineG`. `factSortValue()` splits on `:` and uses `parts[1]`, so both resolve, but the DOM carries the full key.
- Figures on the hub, in order: Caffeine, Servings (Any supplement) · Citrulline, Beta-alanine (Pre-workout) · Creatine · Protein, Protein % · EAAs, BCAAs, Leucine · Sodium, Potassium, Magnesium, Sugar.
- Verified numbers: Creatine + high-to-low + Budget = 12 results. Sodium closest to 500 mg within 10% = 6 results. Protein % high-to-low leads with Klean Athlete at 90%.

## Pitfalls already hit (do NOT retry these)
- **Nice-rounding each range cut by its own magnitude collapses them.** Citrulline's thirds were 3.93 and 6.97; both rounded to 5 and the figure silently lost all its ranges. Fix in `bucketsFor()`: round to a step derived from the *spread* (`niceRound((hi-lo)/6)`) and cut at real quantiles, not at even thirds of the span.
- **Re-rendering the whole panel on every change eats focus.** Typing in `Closest to` or changing the figure would drop the caret / blur the select. Only `renderFilterPanel()` on a category switch; everything else goes through `syncFigureUI()` and in-place updates.
- **Playwright's `goto` is a no-op when only the hash differs.** Two deep-link tests returned stale readings ("0 of 187") because the page never reloaded. Add a throwaway query (`hub.html?v=2#cat-pre-workout`) to force a real load.
- **`playwright-core` is not installed as a node module**; a headless sweep script fails with MODULE_NOT_FOUND. Use the Playwright MCP browser tools instead.
- Carried over: WebFetch cannot reach reddit.com; `r/preworkout` is banned; brand storefront ratings are JS-rendered.

## Lessons to keep
- **Driving the UI off `compareCols` was the right call twice over** — it survived a complete redesign of the panel without touching `js/categories.js`.
- **Exercising every control through one `browser_evaluate` call** (set each select, read the count and the top rows back) catches ordering bugs far faster than screenshots. Screenshots are still the only thing that catches layout.
- When the user says something is not simple, the fix is usually to remove a dimension, not to restyle it.

## Next session: start here
1. Ask whether to commit. Suggested message: `feat: figure-first filter — pick a figure, then narrow, sort, or aim at an amount`.
2. If more filter work is wanted, the obvious remaining gaps are: the brand list on the hub still shows every brand after a category is picked, and there is no URL state for a chosen figure (only `#cat-<slug>` deep links exist).
3. Any data change → `node scripts/build-product-pages.js`, then bump the cache version.

## Relevant files
- `js/app.js` — `state` at the top; "Filter figures" section (`scopePool`, `rawUnitOf`, `axisDefsFor`, `buildFigureGroups`, `bucketsFor`, `rebuildAxes`, `axisByKey`, `withinTolerance`); "Filter panel" section (`renderFilterPanel`, `syncFigureUI`, `refreshFilterCount`, `setMode`, `wireFilters`); `applyFilters` and `isRanked` above them.
- `js/categories.js` — `CATEGORY_CONFIG`; the `sortable: true, num: true` compare columns are the filter's source of truth.
- `css/styles.css` — sticky toolbar + `.sc-toolbar.sc-open`, `.sc-filters-count`, `.sc-tabs` / `.sc-tab`, `.sc-fields` / `.sc-field`, `.sc-numwrap` / `.sc-numunit`, `.sc-fnote`.
- `hub.html` — the toolbar markup all five browse pages now share; the panel is `<div class="sc-toolbar-filters" id="sc-filters" hidden></div>`.
- `README.md` — "How the filter works" section documents the two tabs and the figure model.
