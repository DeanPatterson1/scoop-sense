# Scoop Sense

Scoop Sense is an independent static site that logs what is actually in popular sports supplements across five categories — pre-workouts, creatine, protein powders, EAA/BCAA formulas, and electrolyte mixes: key doses compared against the amounts used in published research, label transparency (proprietary blends flagged), and plain-language cautions. It is not a supplement brand and it does not sell anything — the site earns money through affiliate links to retailers, disclosed near the links and explained in full on its own page.

The design language is editorial research publication plus product database: warm near-black background, charcoal surfaces, one restrained lime accent, and "facts panel" data tables (thick top rule, hairline rows, right-aligned tabular figures) that echo the supplement facts panel the site is about.

Built with vanilla HTML, CSS, and JavaScript. No frameworks, no build step. The only external dependency is Google Fonts (Barlow Condensed for display headings, Source Sans 3 for body).

---

## File map

| File | What it does |
| --- | --- |
| `index.html` | Homepage. Left-aligned editorial hero with credibility row, a six-row database preview table, the methodology section (`#methodology`) with an annotated real label (C4 Original) and a labelled dose scale, three "places to start" picks, and a compact safety callout. |
| `hub.html` | The all-products database. Sticky compact toolbar (search, category filter, caffeine filter, brand filter, sort, stim-free toggle, clear all — collapsing into a Filters drawer on mobile), category chip row, result count, and an image-forward tile grid. Tiles link to static product pages. Deep links: `hub.html#cat-<slug>` preselects a category; legacy `#p-<id>` links redirect to the product page. |
| `creatine.html` `protein.html` `eaa.html` `electrolytes.html` | Category landing pages. Each declares `<body data-category="...">`, which locks the grid and the embedded compare table (at `#compare`) to that category with category-specific columns from `js/categories.js`. Each also carries the cross-category chip row and a sort control whose options come from that category's `sortOptions`. |
| `compare.html` | Pre-workout compare table (locked via `data-category="pre-workout"`): caffeine, citrulline, beta-alanine, blend status, stim tier, servings, price tier. Column headers sort; other categories compare on their own pages. |
| `disclosure.html` | About page: what the site is, plus the FTC affiliate disclosure — how the site makes money and what commissions never buy. |
| `disclaimer.html` | Health & safety page: FDA disclaimer box, not-medical-advice statement, general caffeine guidance, individual tolerance, medication/medical conditions, pregnancy and nursing, and the verify-current-label note. |
| `css/styles.css` | The whole design system in one stylesheet: design tokens, typography, facts-panel tables, product rows, toolbar/drawer, tags, chips, category cards, footer, responsive rules. All classes use the `sc-` prefix. |
| `js/categories.js` | The category registry: `CATEGORY_CONFIG` maps each category slug to its label, landing page, tile facts, compare columns, optional grid `sortOptions`, and whether caffeine filters apply. Adding a category starts here. |
| `js/doses.js` | `STUDIED_DOSES` — the amounts commonly used in published research, per ingredient and per category metric. Build-time only: `scripts/build-product-pages.js` reads it to draw the "This label against the research" bars. Ingredients with no settled research amount carry `low: null` and render as a note with no bar. Never invent a range to fill a gap. |
| `js/app.js` | One IIFE. Reads the globals `PRODUCTS`, `FEATURED_IDS`, and `CATEGORY_CONFIG`. Renders grids, compare tables, homepage preview + picks, and the saved page from config; handles filtering, sorting, and hash deep links. |
| `data/products.js` | **The single source of truth.** Every product object across all categories, plus the schema documented in a header comment. `FEATURED_IDS` picks the three "places to start" on the homepage. |
| `scripts/build-product-pages.js` | Generates one static page per product into `products/`, plus `sitemap.xml`. Category-aware. Re-run after any change to `data/products.js`, `js/categories.js`, or `js/doses.js`: `node scripts/build-product-pages.js`. |
| `scripts/integrate-research.js` | Validates researched product JSON (schema, badges, claim language, affiliate URL form) and appends it to `data/products.js`. |
| `README.md` | This file. |

Script order matters: every page that renders products loads `data/products.js` first, `js/categories.js` second, and `js/app.js` last. `disclosure.html` and `disclaimer.html` load only `js/app.js`, which is enough to keep the nav's saved counter accurate; it no-ops when `PRODUCTS` is undefined. `js/doses.js` is **not** loaded in the browser — it is a build-time reference table.

---

## Run locally

Open `index.html` in any browser — there is no build step and every internal link is relative. (Google Fonts needs a network connection; without one the system font fallbacks render.)

For a real URL, run a one-line static server from the project folder:

```
python -m http.server 8000
```

Then visit `http://localhost:8000`.

---

## Deploy free

**Netlify Drop.** Go to `app.netlify.com/drop` and drag the entire project folder onto the page. It publishes in seconds and gives you a live URL. Drag the folder again to update.

**GitHub Pages.** Push the folder to a GitHub repository, then open Settings → Pages and choose to deploy from a branch: branch `main`, folder root (`/`). Your site appears at `https://<username>.github.io/<repo>/` within a minute or two.

Either host works because the site is static files only.

---

## Make the affiliate links real

1. Join Amazon Associates at `affiliate-program.amazon.com`.
2. Get your tracking ID. It looks like `yourname-20`.
3. Open `data/products.js` and find-and-replace every occurrence of the placeholder `YOURTAG-20` with your real tracking ID. Every `affiliateUrl` in the file uses that placeholder, so one find-and-replace covers the whole site.

Two things worth knowing before you apply. Amazon requires roughly three qualifying sales within 180 days of signing up to keep your account approved, so apply when you are ready to send real traffic. Amazon also expects your affiliate disclosure to be live and visible when they review the site — `disclosure.html` and the on-page disclosure lines already satisfy that, but make sure the site is actually deployed first.

**Upgrade path.** Amazon pays roughly 1–3% on supplements. Brand-direct affiliate programs (usually run through Impact or ShareASale) pay substantially more on the same products. As you get accepted into individual brand programs, swap that brand's `affiliateUrl` in `data/products.js` for its program link. Nothing else in the site has to change — the renderer just reads the field.

---

## Add or edit a product

Open `data/products.js`, copy an existing object in the `PRODUCTS` array, and edit it. Follow the schema comment at the top of the file exactly — `js/app.js` reads those field names directly, so a typo in a field name means a blank spot on a row.

A few rules that keep the site honest and legally clean:

- **Verify every number against the current manufacturer label** before you publish it, and set `labelVerified` to the month you checked.
- Pre-workout entries carry exactly one stim badge derived from `caffeineMg` (`Stim-Free` at 0, `Low Stim` for 1–149, `Moderate Stim` for 150–249, `High Stim` at 250 and up). Entries in every other category carry a stim badge **only when caffeinated** — no "Stim-Free" badge on a protein tub. Up to two extras; `Third-Party Tested` only for a label-verified NSF Certified for Sport / Informed Sport / Informed Choice mark.
- Every non-pre-workout entry needs the category's `metrics` object (see the schema comment in `data/products.js`) — those figures drive the tiles, compare columns, and product-page facts rows.
- Set `stimFree: true` only when `caffeineMg` is `0`.
- Keep every `clinicalNote` in structure/function language — describe how an ingredient has been studied in relation to normal body function. Never say a product treats, cures, prevents, or diagnoses anything.
- Write the `blurb` as one concise editorial takeaway — specific and factual, no marketing language. It renders on the row face.
- Write `cautions` as short, factual statements. One to three per product.
- Use the `priceRange` tiers (`$`, `$$`, `$$$`). Never put a dollar amount anywhere on the site; prices go stale within days.
- Keep `affiliateUrl` in the standard form: `https://www.amazon.com/s?k=<product+words>&tag=YOURTAG-20`.

To change which products appear in the homepage "places to start," edit `FEATURED_IDS` (and the matching `START_META` labels in `js/app.js`). The database preview rows come from `PREVIEW_IDS` in `js/app.js`.

**Product imagery.** Tiles show a neutral monogram placeholder until a product has an `imageUrl`. Set the optional `imageUrl` field in `data/products.js` to an affiliate-approved image (e.g., via the Amazon PA-API) and the tile, saved-list column, and product page render it automatically. Do not use manufacturer artwork without permission, and never invent packaging. As of this writing 38 of 78 entries have real imagery and the other 40 render the placeholder, which is the most visible unfinished edge on the site.

**Studied-dose bars.** Every product page ends with "This label against the research", drawn from `js/doses.js`. An ingredient only gets a bar when the research has settled on an amount; anything else carries the explanatory note alone. If you add an ingredient the catalog has not used before and it has a settled studied range, add an entry there and re-run the build — otherwise the row simply does not appear, which is the correct failure mode.

---

## Sitemap & domain

`scripts/build-product-pages.js` writes `sitemap.xml` with a placeholder origin. When the site has a real domain: set `SITE_ORIGIN` at the top of that script, re-run it, and activate the `Sitemap:` line in `robots.txt`. Until then search engines simply ignore the placeholder file.

Setting a real `SITE_ORIGIN` also switches on the metadata that needs absolute URLs — `<link rel="canonical">`, `og:url`, and the `BreadcrumbList` structured data mirroring each product page's breadcrumb trail. They are deliberately suppressed while the origin is a placeholder, because a canonical pointing at a fake host is worse than no canonical at all.

---

## Legal checklist recap

- [ ] **FTC disclosure near links.** A plain-language affiliate line sits at the top of the hub before any product renders, and the full explanation is one click away. Never tooltip-only.
- [ ] **FTC dedicated page.** `disclosure.html` carries the full explanation and is linked from the main nav on every page ("About") and from the footer of every page.
- [ ] **Amazon Associates.** The exact sentence "As an Amazon Associate, Scoop Sense earns from qualifying purchases." appears on `disclosure.html`. No prices anywhere. Affiliate links are verb-based ("Check current price").
- [ ] **FDA disclaimer.** The exact statement "These statements have not been evaluated by the Food and Drug Administration. These products are not intended to diagnose, treat, cure, or prevent any disease." appears in the shared footer on every page and in a highlighted box on `disclaimer.html`.
- [ ] **No disease or medical claims anywhere.** Structure/function language only. Health cautions are framed as general information plus "talk to your doctor."
- [ ] **Verify-current-label note.** Present below the hub results, on every product's cautions, in the `data/products.js` header comment, and as its own section on `disclaimer.html`.
- [ ] **Link hygiene.** Every affiliate anchor carries `rel="sponsored nofollow noopener"` and `target="_blank"`.
- [ ] **No impersonation.** Brand names appear only as factual product references. No brand logos, no marketing imagery, no invented packaging.

---

## Before launch

- Re-verify every label figure in `data/products.js` against the manufacturer's current supplement facts panel, and update each `labelVerified`. Anything you cannot confirm should come off the site rather than go up unverified.
- Load all five pages and confirm the FDA statement renders in the footer of each one.
- Click every affiliate link and confirm it opens the right product search in a new tab, with your real tracking tag in the URL.
- Confirm the disclosure line is visible on the hub before any product row.
- Resize to a phone width and check the header nav, the filter drawer, the tile grid, the detail dialog, and the compare table's horizontal scroll all reflow cleanly.
- Set a reminder to re-check label figures on a schedule — quarterly is reasonable.
