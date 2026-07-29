---
date: 2026-07-28 12:30
topic: Scoop Sense multi-category expansion
status: paused
---

# Handoff: Scoop Sense multi-category expansion

## What we were doing
Expanded the site from pre-workout-only to 5 categories (pre-workout, creatine, protein, EAA/BCAA, electrolytes). User approved design, said "finish everything" — full build executed, verified, committed. Work is COMPLETE on main at `892e88c`; nothing in-flight.

## Done ✓
- 78 products in `data/products.js` (38 pre + 10 each new category), all new entries web-verified by parallel research agents with `sources` + `labelVerified: "July 2026"`
- `js/categories.js` — `CATEGORY_CONFIG` registry (label, plural, page, stimBadges, tileFacts, compareCols; key grammar `m:<metric>:unit`, `ing:<pattern>`, derived keys `blend/stim/price/protPct`)
- `js/app.js` config-driven: `<body data-category="slug">` locks a page's grid + compare rows + brand filter + count; `factOf`/`factSortValue` resolver; mixed-category saved table; `#cat-<slug>` hub deep link
- Category landing pages: `creatine.html`, `protein.html`, `eaa.html`, `electrolytes.html` (each has embedded `#compare` table); `compare.html` locked via `data-category="pre-workout"` with empty `<thead>` (app builds it)
- `scripts/build-product-pages.js` category-aware (metric facts rows, category FAQs, same-category related, per-category buybox button) + writes `sitemap.xml` (87 URLs)
- `scripts/integrate-research.js` — validates + appends research JSON; skips existing ids; safe re-run
- Homepage category cards + stats (78 / 49 disclosed / 6 blends — computed, accurate at commit), footer category links sitewide, README rewritten, disclosure/disclaimer copy widened
- Cache version bumped `20260728m` → `20260728n` everywhere
- Fresh-context verifier agent passed all 5 checks after one fix (7 doubled brand names stripped)
- Spec: `docs/superpowers/specs/2026-07-28-multi-category-expansion-design.md`; plan: `docs/superpowers/plans/2026-07-28-multi-category-expansion.md`
- Memory updated: `preworkout-hub-project.md` has expansion summary

## In-progress / not done (roadmap, nothing blocking)
- [ ] Replace `YOURTAG-20` affiliate placeholder after user joins Amazon Associates (one find-replace in `data/products.js`)
- [ ] Deploy (Netlify Drop or GitHub Pages per README)
- [ ] At domain time: set `SITE_ORIGIN` in `scripts/build-product-pages.js`, re-run, uncomment `Sitemap:` line in `robots.txt`
- [ ] Product images for 40 new products (tiles show monogram tub fallback; pre-workouts have local PNGs in `images/products/`)
- [ ] Homepage "places to start" picks still pre-workout-only (deliberate, spec'd)

## Key decisions (why, not just what)
- **Config-driven categories over per-page duplication** — one renderer; category 6 = config entry + data + one page
- **Single `data/products.js`** for all categories — all-products hub needs full set anyway; ~78 products still small
- **Stim badge rule changed in schema**: pre-workout always exactly one stim badge; other categories only when `caffeineMg > 0` (chip renders on caffeinated products regardless of category — e.g. Amino Energy "Low Stim")
- **`hasBlend` ingredient-name heuristic (`/blend/i`) is pre-workout-only**; other categories flag blend by "Proprietary Blend" badge only — else "whey protein blend" with disclosed 24 g got false dose-hiding caution chip
- **Product `name` field excludes brand** (convention) — `fullNameOf` joins them; violating it doubles the brand on generated pages
- **Research rule enforced**: unverifiable labels dropped, never guessed (BulkSupplements, Naked, MyProtein, Isopure, Legion Whey+ etc. excluded for this reason)
- **New badge extra "Third-Party Tested"** only for verified NSF Certified for Sport / Informed Sport / Informed Choice

## Concrete identifiers
- Cache-bust version: `20260728n` (bump on next CSS/JS/data change — user rule)
- Category slugs: `pre-workout`, `creatine`, `protein`, `eaa`, `electrolytes`
- Metrics keys: creatine `{creatineG, form}`; protein `{proteinG, servingG, source, sweetener}`; eaa `{eaaG, bcaaG, leucineG}` (null = label doesn't disclose); electrolytes `{sodiumMg, potassiumMg, magnesiumMg, sugarG}`
- Research JSONs (already integrated, kept in scratchpad of session fd31987a…): creatine.json, protein.json, eaa.json, electrolytes.json
- Local preview: `python -m http.server 8321` (a server from this session may still be running on 8321)
- Git: main at `892e88c`; stale branch `wip/product-pages` (quarantined old attempt — do not merge)

## Pitfalls already hit (do NOT retry these)
- `scripts/integrate-research.js` insertion once produced `,,` (array hole → phantom 79th undefined product). Fixed with trailing-comma guard — but if products.js count ever looks off by one, grep `,,`
- sed with `\n` patterns misses CRLF files (disclosure/disclaimer) — use Node regex with `\r?\n` for cross-file HTML edits
- Playwright `javascript:` URL navigation blocked — use `browser_evaluate` for localStorage
- Full-page screenshots show big blank stretches — scroll-reveal animation (`sc-reveal`), not a bug
- Homepage count placeholders (NN/DD/BB) pattern: fill immediately or validation-grep before commit

## Lessons to keep
- Parallel research agents with hard "fetch label or drop product" rule produced clean data; validator (`integrate-research.js`) caught nothing because agents pre-validated — keep both layers anyway
- Fresh-context verifier over the whole diff caught the one real defect (doubled brand names) self-review missed

## Next session: start here
1. Nothing pending — site shippable. If user wants next step, likely: deploy (README "Deploy free" section) or affiliate tag swap.
2. If adding products/categories: follow README "Add or edit a product" + `js/categories.js` header comment; regenerate with `node scripts/build-product-pages.js`.

## Relevant files
- `js/categories.js` — category registry, key grammar doc in header
- `js/app.js` — renderer; `PAGE_CATEGORY` lock at top, `factOf` resolver ~line 175
- `data/products.js` — schema comment at top (metrics + badge rules current)
- `scripts/build-product-pages.js` — page generator + sitemap; `SITE_ORIGIN` placeholder at bottom
- `scripts/integrate-research.js` — research JSON validator/appender
- `docs/superpowers/specs/2026-07-28-multi-category-expansion-design.md` — approved spec
