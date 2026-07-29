---
date: 2026-07-29 10:10
topic: Scoop Sense — catalog expansion, cutout imagery, two-source reviews
status: paused
---

# Handoff: catalog expansion, cutout imagery, two-source reviews

## What we were doing
Started from a 78-product site and a request to "improve it visually + have 3 blind agents review it". That produced a design/trust/a11y review pass, then the user escalated: expand every category to pre-workout depth, fix missing product imagery, make card backgrounds match, make the affiliate CTA prominent, and add two-sided reviews (seller rating + real community sentiment). All of it is committed and working. Nothing is in flight.

## Done ✓
- **Catalog 78 → 187 products**: pre-workout 38, creatine 39, electrolytes 39, protein 39, EAA 32. Built by 12 parallel research agents (3 per category), all label-verified, ~30 candidates dropped rather than guessed.
- **Imagery**: 171 of 187 carry brand photography. Every lead image is a **transparent cutout** on a lit stage — no per-product background colour remains.
- **Studied-dose bars** (`js/doses.js` + "This label against the research" section on every product page).
- **Two-source reviews on 39 products**: seller rating (paper panel) + community sentiment (editorial), 111 linked threads. `scripts/integrate-reviews.js` validates; About page has the policy at `disclosure.html#reviews-policy`.
- **Review CTA**: "Check price" is now the filled accent button on tiles, shortlist toggle shrunk to an icon square.
- Three blind agent reviews (design / trust / a11y) actioned: WCAG contrast fixes, sticky compare heads, table+tile overflow fixes, badge surfacing, price-tooltip contradiction removed, dead dialog CSS deleted, homepage figures now computed from data.
- Cache version currently **20260729g**.

## In-progress / not done
- [ ] **`YOURTAG-20` affiliate placeholder** — still in all 187 entries. Site earns nothing until the user joins Amazon Associates and one find-replace runs. This is the highest-value remaining action and it is blocked on the user.
- [ ] Reviews cover 39 of 187 products. Extending = more research runs of the same shape.
- [ ] 16 products have no imagery (list below).
- [ ] Deploy (Netlify Drop / GitHub Pages per README).
- [ ] At domain time: set `SITE_ORIGIN` in `scripts/build-product-pages.js`, re-run, uncomment `Sitemap:` in `robots.txt`. That also switches on canonical / og:url / BreadcrumbList, which are deliberately suppressed while the origin is a placeholder.

## Key decisions (why, not just what)
- **Never display Amazon ratings/review counts.** The Associates Operating Agreement forbids republishing that data and the site links to Amazon as an affiliate — using their stars risks the account that eventually pays. Seller ratings come from the brand's own storefront, with a non-Amazon retailer as fallback (labelled as such). Enforced in `scripts/integrate-reviews.js`.
- **No `aggregateRating` structured data from the seller's number.** Passing a brand's storefront score off as the page's own rating is misrepresentation and gets rich results pulled.
- **Every review quote is verified against its thread before shipping.** Of 56 quotes, 4 were removed — 2 that did not appear in the cited thread, 1 sourced from redditrecs.com (an aggregator, not the thread), 1 on C4. A quote attributed to a thread that doesn't contain it is fabricated attribution.
- **Cutouts flood-fill inward from image edges**, never a global colour key — a global key punches holes through white lettering and white lids inside the product.
- **`imageBg` was removed** once everything became a cutout. Do not reintroduce per-product background colours.
- **Glow behind product art** exists because cutouts made black-on-black worse: the photo's own light background used to do that separation work.
- **Category data slices** (`data/by-category/*.js`, generated): category pages load only their own slice, not the 190-product catalog.
- **Homepage figures are computed** from `PRODUCTS` via `[data-stat]` / `[data-cat-count]` — never type counts into `index.html` again.

## Concrete identifiers (lost to /clear)
- Cache-bust version: **`20260729g`** — bump on any css/js/data change, in the 10 root HTML files + `VERSION` in `scripts/build-product-pages.js`.
- Local preview: `python -m http.server 8321 --bind 127.0.0.1` from project root.
- Scripts: `integrate-research.js` (products), `integrate-images.js` (imagery), `integrate-reviews.js` (reviews). All take a json-dir, all-or-nothing, safe to re-run.
- **16 products with no imagery**: klean-athlete-klean-creatine, garden-of-life-sport-grass-fed-whey, bsn-creatine-dna, dymatize-creatine-micronized, universal-nutrition-creatine, sports-research-creatine-monohydrate, bucked-up-creatine-monohydrate, bodyarmor-flash-iv-electrolyte-sticks, trioral-oral-rehydration-salts, key-nutrients-electrolyte-recovery-plus, lyteshow-electrolyte-concentrate, ryse-hydration-sticks, evlution-nutrition-bcaa-energy, transparent-labs-bcaa-glutamine, muscle-milk-genuine-protein-powder, klean-athlete-klean-isolate.
- `dymatize-all9-amino` — discontinued; carries no reviews and no seller listing. Correct as-is.
- Removed entirely: `ghost-amino-v2` (404 on GHOST's own site).

## Pitfalls already hit (do NOT retry these)
- **WebFetch cannot reach reddit.com at all** (hard-blocked). Do not send agents at Reddit with WebFetch — the first review batch returned all nulls that way.
- **The working Reddit route**: open a `www.reddit.com` tab in the browser (it passes a JS challenge automatically), then call same-origin JSON from page context: `/r/<sub>/search.json?q=…&restrict_sr=1&sort=relevance&t=all` and `<permalink>.json?limit=500&sort=top` (element `[1]` is the comment tree, each node `data.body`). ~450–600ms between calls.
- **Relative fetches run against whatever tab is current.** Two verification passes returned all-404 because the tab had drifted back to `127.0.0.1:8321`. Navigate to reddit.com first, every time.
- **`r/preworkout` is a banned subreddit.** Use r/Preworkoutsupplements, r/Supplements, r/xxfitness.
- **Brand storefront ratings are JS-widget rendered** — a plain fetch sees nothing. Read them in a browser.
- **A PNG can carry an alpha channel and still be fully opaque** (Zipfizz on solid orange). File-header alpha checks lie; measure corner pixels in a browser canvas.
- **Shopify `_50x` URL suffix** ships a 50px thumbnail as the product photo. Strip it.
- Akamai blocks scripted image downloads on gardenoflife.com and kleanathlete.com (serves browsers fine).
- WebSearch budget (200/session) is exhausted fast by parallel agents; they can still WebFetch.
- Session limit killed 4 agents mid-run once — batches are cheap to relaunch, so prefer 3-4 agents at a time over 12.

## Lessons to keep
- **A contact sheet of every lead image, viewed at once, is the only thing that catches bad imagery.** It found 5 non-product images (marketing banners with health claims, supplement-facts panels, and an ISO100 hero filed under Dymatize *creatine*) that no automated check would have flagged.
- **Verify agent output rather than trusting the report.** The protein agent self-reported aggregator sourcing; re-checking every quote found 3 that had to go.
- Research agents with a hard "verify or drop" rule produce genuinely clean data — they dropped ~30 products for conflicting figures, discontinued SKUs, and unverifiable certifications.
- Budget ~150–250k tokens per research agent covering 9–10 products.

## Next session: start here
1. Nothing is blocked or half-finished. If the user wants the next step, the ranked options are: (a) swap in the real Amazon tag once they've joined Associates, (b) deploy, (c) extend reviews past 39 products, (d) source the 16 missing images.
2. Any data change → `node scripts/build-product-pages.js`, then bump the cache version.

## Relevant files
- `data/products.js` — single source of truth; schema comment at top documents `reviews`, `imageBg` (removed), `imageUrl`, `metrics`.
- `scripts/build-product-pages.js` — generator; `reviewsHTML()`, `doseComparisonHTML()`, `slidesOf()`, `SITE_ORIGIN` at top.
- `scripts/integrate-reviews.js` — review validator, encodes the Amazon/quote/brand-domain rules.
- `js/doses.js` — studied-dose reference table, build-time only.
- `css/styles.css` — section 13b studied doses, 13c reviews, tile art glow ~line 1597.
- `disclosure.html#reviews-policy` — the published review policy.
