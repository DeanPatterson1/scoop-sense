---
date: 2026-09-03 16:45
track: mobile-ui
topic: rework the phone layout to read as professional / apply UI psychology
status: in-progress
---

# Handoff: [mobile-ui] Professional mobile layout

## What we were doing

Owner's request, verbatim: **"i want the mobile layout to be changed to look more
professional and fit ui phycology"** (UI psychology).

This session did NOT start that work — it finished and shipped the previous
batch (see "Done" below), then measured the current phone layout so the next
session starts from numbers instead of impressions. The redesign itself is
entirely ahead of you.

## Done ✓ (shipped this session, already live)

Pushed `f9512ec..8de7a90` to `main`; Cloudflare edge confirmed serving
`v=20260903a` on root, hub, compare, a category page and four product pages.

- `908f74e` — removed the two `m.media-amazon.com` image hotlinks (Associates
  agreement forbids them), 0.75rem type floor, 40–44px touch targets, five dead
  CSS rules cut, dose wording normalised, three `js/app.js` fixes (results-count
  denominator, `decodeURIComponent` crash on a malformed hash, `-1` sorting as a
  small number instead of falling to the bottom).
- `47fb354` — `check-affiliate-links.js` crashed on a `/dp/` URL with no
  10-char ASIN; `integrate-research.js` validated entries it then skipped.
- `3318cbb` — **the footer-date bug**: the build computes the verified window
  from the data, but the re-dating pass only walked the repo root, so 219 pages
  under `products/` kept a hardcoded "July 2026" from the template. Window is
  now computed above the template and interpolated. All 229 pages agree.
- `8de7a90` — committed the two handoffs that had never been committed.

Catalog state: **219 products**, 5 categories (pre-workout 51, creatine 46,
protein 46, electrolytes 42, eaa 34). All 33 research JSONs from the previous
batch are merged; that older handoff is fully closed.

## In-progress / not done

- [ ] **The mobile redesign — nothing started.** No CSS written, no direction
      chosen, no approval from the owner on a direction.
- [ ] Decide with the owner what "professional" means here before touching CSS.
      The site's whole identity is the paper facts-panel on a dark shell (see
      `scoop-sense-design-language` memory) — a generic "clean mobile" pass
      would erase the thing that makes it not look like every other affiliate
      site. Get a direction agreed, don't guess.
- [ ] Clean run of `node scripts/check-affiliate-links.js` (~6 min, 219
      amazon.com title fetches). Unrelated to mobile; just still outstanding.

## Measured current state (390×844, iPhone-14-class viewport)

Numbers taken with Playwright against `python scripts/serve.py 8743`.

**Page lengths (viewport-screens of scrolling):**
| Page | Height | Screens |
|---|---|---|
| `index.html` | 6776px | 8.0 |
| `hub.html` (24 tiles drawn) | 17869px | 21.2 |
| `products/c4-original.html` | 8917px | 10.6 |

**hub.html — the worst offender:**
- Sticky toolbar is **206px tall = 24% of the viewport, permanently**. In a
  screenshot at the first tile it covers the product photo entirely.
- **First product tile starts at y=862** — a full screen (1.02×) of nav, hero,
  category chips, affiliate disclosure and toolbar before a single product.
- Each tile is **660px tall at 343px wide** — 1.3 screens per product, so you
  can never see a whole card plus its neighbour. Grid is a single 343px column.
- The category chip row and the "All categories" `<select>` are both on screen
  at once, doing the same job.

**products/*.html:**
- `<h1>` (the product name) sits at **y=875 — below the fold**.
- The affiliate CTA "View current price at Amazon" is at **y=1569, 1.86 screens
  down**, and nothing is sticky on the page to bring it back. This is the one
  place the site earns.

**Global:**
- `.sc-nav` wraps to **96px / 2 rows** for 6 links. No hamburger, no mobile
  nav pattern at all.
- No horizontal page scroll anywhere (good — keep it that way).
- One intentional sideways scroller on index: `.sc-table-scroll` (559px in a
  343px box), which is the designed "columns continue" affordance.
- Tap targets: **zero under 24px**. Three in 25–34px: `.sc-logo` (25px) and two
  inline text links at 34px. The 40–44px floor shipped this session.

## Key decisions (why, not just what)

- **Measured before proposing.** "More professional" is unfalsifiable; "the
  first product is one full screen down and the sticky toolbar eats 24% of the
  viewport" is something a redesign can be checked against. Every number above
  is a target to move.
- **Did not start the redesign this session.** The request arrived after the
  deploy, and a visual direction is the owner's call, not a default. Starting
  CSS on a guess would have burned the context that this document preserves.
- **Kept the shipped work and the redesign in separate commits/tracks.** The
  batch above was already verified and live; the mobile work should not land
  on top of an unshipped pile.

## Concrete identifiers (lost to /clear)

- CSS is **mobile-first**: unqualified rules ARE the phone layout. Breakpoints
  are `min-width` at 560 / 640 / 768 / 880 / 900 / 920 / 1000 / 1100, plus two
  `max-width: 559px` blocks at `css/styles.css:782` and `:840`.
  `css/styles.css` is 3491 lines.
- Sticky positions: `css/styles.css:789`, `:851`, `:1431` (`.sc-toolbar`).
- `.sc-toolbar` `:1430` · `.sc-toolbar-row` `:1447` · `.sc-toolbar-filters`
  `:1563` · `.sc-hero` `:492` · `.sc-hero-grid` `:526` · `.sc-tile` `:1767` ·
  `.sc-tile-ctas` `:1964`.
- Design tokens live at the top of `css/styles.css`; `--sc-photo-bg: #E7E2D8`
  (added this session) is the ground behind retailer photography.
- Dev server: `python scripts/serve.py 8743` (sends `no-store`).
- Page generator: `node scripts/build-product-pages.js` — rebuilds all 219
  product pages, 5 category slices, catalog markup in 7 pages, sitemap, AND
  syncs the cache-bust token + label-verified window. **It is idempotent**; run
  it after any data change and commit the output.
- Cache-bust token: `VERSION` in `scripts/build-product-pages.js`, currently
  `20260903a`. Bump it on any css/js change or returning browsers keep stale
  assets.

## Pitfalls already hit (do NOT retry these)

- **`scripts/serve.py` truncates `data/products.js` (654KB) intermittently on
  Windows** — you get `ERR_CONNECTION_RESET` and a short body, and the page
  looks broken when it isn't. Seen as `curl` returning 652800 of 669679 bytes.
  If a browser test shows a dead page, re-fetch before believing it. Navigating
  via `about:blank` between loads made it much less frequent.
- **Do not pipe `check-affiliate-links.js` through `tail`** — it prints results
  progressively on purpose (a buffered run was killed by a timeout once and lost
  everything). `| tail -25` reproduced exactly that; the run showed zero output
  for six minutes. Run it bare.
- **`git diff` on this repo is noisy with CRLF warnings.** Use
  `--ignore-cr-at-eol`; ~239 files can show as modified from line endings alone.
- The live site is behind a Cloudflare edge cache that serves the previous build
  for a minute or two after a push (`CF-Cache-Status: HIT`). A stale read is not
  a failed deploy — poll until `styles.css?v=<VERSION>` flips.
- GitHub shows **no workflow run and no deployments entry** for this repo; the
  Cloudflare build is invisible from `gh`. Don't go looking for CI.

## Lessons to keep

- Measuring the phone layout in JS (`getBoundingClientRect`, `scrollHeight/
  innerHeight`, `position === 'sticky'`) gives far more usable findings than
  reading a full-page screenshot — a 6913px-tall page thumbnails down to
  unreadable, but "8 screens, first tile at 1.02 screens" is actionable.
- A viewport screenshot at a computed scroll offset (`window.scrollTo(0, 862)`)
  is the way to see what the sticky chrome actually covers.
- Checking removed CSS classes are truly unused before deleting them
  (`grep -rn "$class" --include=*.html --include=*.js`) caught nothing this time
  but is cheap insurance on a 3491-line stylesheet.

## Next session: start here

1. **Ask the owner for a direction before writing CSS.** Offer 2–3 concrete
   options against the numbers above — e.g. (a) reclaim the fold: collapse the
   toolbar to a single search + filter button and drop the duplicate chip row,
   (b) shrink the tile: a compact row that shows 2–3 products per screen with
   the facts panel behind a tap, (c) product page: move the name above the fold
   and add a sticky price CTA. Note (c) touches the affiliate CTA, which the
   trust rules keep secondary to the breakdown — confirm before changing its
   prominence.
2. Once a direction is agreed, work in `css/styles.css` **base rules** (they are
   the mobile layout) and verify at 390×844 against the measured table above.
3. Bump `VERSION` in `scripts/build-product-pages.js`, run the generator, commit
   the regenerated pages with the CSS.

## Relevant files

- `css/styles.css` — 3491 lines, mobile-first; base rules are the phone layout.
- `js/app.js:926` — results count. `:1407` `safeDecode`. `:1640` compare sort.
- `js/app.js:1948` — the saved-table markup that needs `.sc-saved-scroll`.
- `scripts/build-product-pages.js` — `VERSION`, the page template (footer now
  interpolates `labelWindow`), and the root-page re-dating pass.
- `data/products.js` — 219 entries, single source of truth; the header comment
  block documents every field including the no-Amazon-images rule.
- `.handoffs/2026-09-02-2330-batch3-label-research.md` — the previous track,
  now fully closed. Nothing to resume there.
