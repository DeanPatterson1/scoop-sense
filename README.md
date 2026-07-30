# Scoop Sense

Scoop Sense is an independent static site that logs what is actually in popular sports supplements across five categories — pre-workouts, creatine, protein powders, EAA/BCAA formulas, and electrolyte mixes: key doses compared against the amounts used in published research, label transparency (proprietary blends flagged), and plain-language cautions. It is not a supplement brand and it does not sell anything — the site earns money through affiliate links to retailers, disclosed near the links and explained in full on its own page.

The design language is editorial research publication plus product database: warm near-black background, charcoal surfaces, one restrained lime accent, and "facts panel" data tables (thick top rule, hairline rows, right-aligned tabular figures) that echo the supplement facts panel the site is about.

Built with vanilla HTML, CSS, and JavaScript. No frameworks, no build step. The only external dependency is Google Fonts (Barlow Condensed for display headings, Source Sans 3 for body).

---

## File map

| File | What it does |
| --- | --- |
| `index.html` | Homepage. Left-aligned editorial hero with credibility row, a six-row database preview table, the methodology section (`#methodology`) with an annotated real label (C4 Original) and a labelled dose scale, three "places to start" picks, and a compact safety callout. |
| `hub.html` | The all-products database. Sticky one-line toolbar (search, category, brand, "Filters & sort", clear all) over a collapsible filter panel, category chip row, result count, and an image-forward tile grid. Tiles link to static product pages. Deep links: `hub.html#cat-<slug>` preselects a category; legacy `#p-<id>` links redirect to the product page. |
| `creatine.html` `protein.html` `eaa.html` `electrolytes.html` | Category landing pages. Each declares `<body data-category="...">`, which locks the grid and the embedded compare table (at `#compare`) to that category with category-specific columns from `js/categories.js`. Each also carries the cross-category chip row, and the filter panel builds itself from that category's own figures. |
| `compare.html` | Pre-workout compare table (locked via `data-category="pre-workout"`): caffeine, citrulline, beta-alanine, blend status, stim tier, servings, price tier. Column headers sort; other categories compare on their own pages. |
| `disclosure.html` | About page: what the site is, plus the FTC affiliate disclosure — how the site makes money and what commissions never buy. |
| `disclaimer.html` | Health & safety page: FDA disclaimer box, not-medical-advice statement, general caffeine guidance, individual tolerance, medication/medical conditions, pregnancy and nursing, and the verify-current-label note. |
| `css/styles.css` | The whole design system in one stylesheet: design tokens, typography, facts-panel tables, product rows, toolbar/drawer, tags, chips, category cards, footer, responsive rules. All classes use the `sc-` prefix. |
| `js/categories.js` | The category registry: `CATEGORY_CONFIG` maps each category slug to its label, landing page, tile facts, compare columns, and whether it carries stim badges. Adding a category starts here. The sortable numeric compare columns double as the category's filter axes, so a new category gets its filter panel for free. |
| `js/doses.js` | `STUDIED_DOSES` — the amounts commonly used in published research, per ingredient and per category metric. Build-time only: `scripts/build-product-pages.js` reads it to draw the "This label against the research" bars. Ingredients with no settled research amount carry `low: null` and render as a note with no bar. Never invent a range to fill a gap. Each entry also carries `cite` — `{ label, url, quote }` — a position stand or review that was actually fetched, with the sentence the range came from; it renders under the bar as an openable source. An entry with no verified source gets no `cite` rather than borrowing another row's authority, and a range must never contradict the quote printed beneath it. |
| `js/app.js` | One IIFE. Reads the globals `PRODUCTS`, `FEATURED_IDS`, and `CATEGORY_CONFIG`. Renders grids, compare tables, homepage preview + picks, and the saved page from config; handles filtering, sorting, and hash deep links. |
| `data/products.js` | **The single source of truth.** Every product object across all categories, plus the schema documented in a header comment. `FEATURED_IDS` picks the three "places to start" on the homepage. |
| `data/by-category/*.js` | **Generated — do not edit.** One slice of `data/products.js` per category, written by the build script. A category landing page loads only its own slice instead of the whole catalog; `compare.html` loads the pre-workout slice. Regenerate by re-running the build. |
| `scripts/build-product-pages.js` | Generates one static page per product into `products/`, plus `sitemap.xml`. Category-aware. Re-run after any change to `data/products.js`, `js/categories.js`, or `js/doses.js`: `node scripts/build-product-pages.js`. |
| `scripts/integrate-research.js` | Validates researched product JSON (schema, badges, claim language, affiliate URL form) and appends it to `data/products.js`. |
| `scripts/integrate-reviews.js` | Validates researched review JSON and merges a `reviews` object into the matching products. Enforces the rules that decide what the site will publish about other people's opinions — no Amazon ratings, verbatim quotes capped at 200 characters, no brand-owned URL passed off as community, no disease-claim language, no dollar figures. Refuses the whole batch on any failure: `node scripts/integrate-reviews.js <json-dir>`. |
| `scripts/integrate-images.js` | Takes researched image JSON, downloads each product's lead image into `images/products/`, and writes `imageUrl` / `imageOpaque` / `images` into the entry. Re-checks that every URL really downloads as an image and derives `imageOpaque` from the file's alpha channel. Skips products that already have imagery, so it is safe to re-run: `node scripts/integrate-images.js <json-dir>`. |
| `README.md` | This file. |

Script order matters: every page that renders products loads its data file first, `js/categories.js` second, and `js/app.js` last. The data file is `data/products.js` on the homepage, hub, and saved list — all three need the whole catalog — and `data/by-category/<slug>.js` on the four category pages and `compare.html`, which each render one category. `disclosure.html` and `disclaimer.html` load only `js/app.js`, which is enough to keep the nav's saved counter accurate; it no-ops when `PRODUCTS` is undefined. `js/doses.js` is **not** loaded in the browser — it is a build-time reference table.

---

## How the filter works

Every browse page ships an empty `<div id="sc-filters" hidden>`; `js/app.js` builds the panel inside it at load. There is no filter markup to maintain per page.

Both tabs start with the same question — **which figure do you care about?** — and differ only in what they do with the answer:

| | Simple | Advanced |
| --- | --- | --- |
| 1 | Filter by — the figure | Filter by — the figure |
| 2 | Amount — a range of it | Closest to — an amount of it |
| 3 | Sort — high to low, low to high | Match within — how far out to allow |
| 4 | Price — Budget / Mid-range / Premium | Price — Budget / Mid-range / Premium |

Picking a figure means "show me labels that actually list it", so choosing Creatine on the all-products hub narrows 187 products to the 39 that disclose a creatine dose. The figure and the price tier are shared state: set either on one tab and the other follows. Search, category, and brand sit in the toolbar above and apply throughout. The brand list is cut from the category in scope and recut when that changes, so a category holding a dozen brands never offers the other ninety.

Advanced orders results by distance from the amount you typed, closest first. "Match within" turns that ranking into a hard cut-off — sodium closest to 500 mg within 10% leaves six products.

The figure list is read from each category's own `compareCols` entries marked `sortable` and `num`, so a category's filters and its compare table can never disagree about which figures matter, and a new category needs no extra configuration. A category page lists its own figures flat. The all-products hub lists everything, grouped by the supplement each figure belongs to, with figures that appear in more than one category lifted into a shared "Any supplement" group so caffeine is not filed under Pre-workout.

Each figure works out its own ranges from the labels actually on file: cuts at the one-third and two-thirds points of the real values, rounded to a step derived from the spread. Caffeine is the exception and keeps hand-written ranges, because "under 150 mg" already means something to a reader in a way a computed cut does not. Milligram figures that run into four digits are shown in grams, matching the label they came from.

### The URL carries the filter

A narrowed view is the thing worth sending someone, so the whole filter writes itself into the address bar:

```
hub.html#cat-creatine&fig=m:creatineG:g&sort=desc&price=Budget
```

The keys are `cat` (as the older bare `cat-<slug>` token, which is what existing links use), `q` for search, `brand`, `mode` when it is Advanced, `fig` for the chosen figure, `range` for its amount band, `sort`, `price`, and `near` / `within` for the Advanced target and tolerance. Only what is actually set appears; clearing every filter clears the fragment.

Opening such a link restores the panel, both tabs, and the result order. Every value is checked against what that page really offers first — a figure from a creatine link means nothing on the protein page and is dropped rather than filtering on something absent. Writes go through `history.replaceState`, because changing a filter is not a navigation and thirty of them would turn the back button into an undo log.

Because those writes are `replaceState`, they never fire `hashchange` — which is reserved for a link the reader followed. Four of the five category chips point at a category page and get a fresh load; the pre-workout chip has no landing page to point at, so it points at `hub.html#cat-pre-workout`. On the hub that is a same-document hash change, and a `hashchange` listener re-reads it, resets the filters, and redraws. A plain anchor (`#compare`) is told apart from filter state and left alone: it scrolls, it survives the first render, and it does not clear the view the reader built.

### Quick label filters, and how much of the grid is drawn

Above the result count, `js/app.js` draws one chip per label filter that has anything to say about the category in scope, with its count: **Third-party tested**, **Fully disclosed**, **No blends at all**, and — protein only — **Dairy-free protein source**, read off the panel's own source line (whey, casein and milk are dairy; a product whose source line says nothing stays out, because "unstated" is not "safe"). The chips set the same state as the panel's Label select, and a filter with a count of zero is not offered. A filter that the newly chosen category cannot answer resets itself rather than emptying the grid.

The grid draws `PAGE_SIZE` (24) tiles and offers a **Show more** button for the rest — the unnarrowed hub is 187 tiles, which is 48 desktop screens. The result count reads "showing N of M": N is what is on screen, M the set it was drawn from. Changing any filter goes back to the first helping; only Show more keeps the reader's place.

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

## The affiliate links

The Amazon Associates tracking ID is **`thescoopsense-20`**, and every `affiliateUrl` in `data/products.js` already carries it. The category files and product pages are generated from that one file, so a tag change is a single find-and-replace there followed by `node scripts/build-product-pages.js` — never edit `products/*.html` or `data/by-category/*.js` by hand. `scripts/integrate-research.js` rejects any new product whose `affiliateUrl` does not carry the tag.

One deadline worth tracking: Amazon requires roughly three qualifying sales within 180 days of signing up, or the account is closed and has to be reapplied for. Their review also expects the affiliate disclosure to be live and visible, which `disclosure.html` and the on-page disclosure lines satisfy on the deployed site.

**Upgrade path.** Amazon pays low single digits on supplements and revises its own fee schedule, so read the current one rather than trusting a number here. Brand-direct programs — run in-house or through Impact, Awin (which absorbed ShareASale), CJ Affiliate or Rakuten Advertising — commonly pay several times that on the same product, and their cookie windows run 30 to 90 days against Amazon's 24 hours. As you are accepted into individual brand programs, swap that brand's `affiliateUrl` for its program link. Nothing else needs editing: the retailer named in the page's prose is derived from the link's host by `retailerOf`, mirrored in `js/app.js` and `scripts/build-product-pages.js`. Set the optional `retailer` field only when the destination is neither Amazon nor the brand's own store.

Sequencing is forced, and it is worth knowing before you start applying. Brand programs review a site's traffic before approving it, and one with none is rejected or ignored — so Amazon is the bootstrap that funds the traffic that qualifies you for the better programs, not the destination. The catalog is concentrated enough to make this tractable: 101 brands across 187 products, but the top twenty brands cover close to half of them, led by Optimum Nutrition at 10 and Transparent Labs, Kaged and Nutricost at 7 each. Sixty-two brands carry exactly one product and are not worth an application.

**Every affiliateUrl is currently an Amazon *search* URL,** which makes the reader hunt for the right tub and can surface a reseller or the wrong size. Converting them to direct product links is the single cheapest conversion improvement available, and it has to be done one verified link at a time — never pattern-guessed, same rule as product imagery.

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
- Keep `affiliateUrl` in the standard form: `https://www.amazon.com/s?k=<product+words>&tag=thescoopsense-20`.

To change which products appear in the homepage "places to start," edit `FEATURED_IDS` (and the matching `START_META` labels in `js/app.js`). The database preview rows come from `PREVIEW_IDS` in `js/app.js`.

**Product imagery.** Tiles show a neutral monogram placeholder until a product has an `imageUrl`. The lead image is stored locally in `images/products/<id>.<ext>` and the seller's own gallery URLs go in `images`, which feeds the product page's gallery and lightbox.

**Every lead image is a transparent cutout**, so all 187 cards sit on the same dark stage and the grid reads as one set. Retailer photography arrives on a white, orange, or navy studio sweep; that background is flood-filled away from the image edges inward before the file is stored. Filling inward matters — a global colour key would punch holes through white lettering and white lids inside the product. If you add a photo that still carries its background, cut it out before shipping it, or the card will read as a pasted rectangle among 186 cutouts.

Two rules learned the hard way, worth keeping: a PNG can carry an alpha channel and still be entirely opaque, so never trust the file header to tell you whether a background is present — look at the pixels. And check what the image actually *is* before shipping it: brand CDNs serve supplement-facts panels, promotional banners with health claims, and hero art for a different product from the same URL patterns as real product shots. Several of each were caught only by looking at a contact sheet of every lead image at once.

Add imagery by writing per-category JSON (`[{ "id": …, "images": […], "source": … }]`) and running `node scripts/integrate-images.js <json-dir>`, then regenerating the product pages. Every URL must be a real, checked image published by the brand or retailer — never invent or pattern-guess one, and never invent packaging.

**Reviews.** Product pages can carry a "What other people say" section holding two clearly separated signals: the star rating printed on the **seller's own storefront**, and a summary of **independent discussion** on Reddit and forums with linked threads and short verbatim quotes. Scoop Sense writes neither and collects no reviews of its own — the section states that, dates the seller figure, and says plainly that a seller's rating is moderated by the seller.

Three rules are non-negotiable and enforced by `scripts/integrate-reviews.js`. **Never display an Amazon rating or review count** — the Associates Operating Agreement does not permit it, and this site links to Amazon as an affiliate. **Never use the brand's own site, influencer posts, or affiliate-review blogs as "community"** — that is marketing wearing a disguise. **Never pad an empty result**: `seller` and `community` may each be `null`, and the page says so rather than inventing a consensus. The section is omitted entirely when both are missing.

**Studied-dose bars.** Every product page ends with "This label against the research", drawn from `js/doses.js`. An ingredient only gets a bar when the research has settled on an amount; anything else carries the explanatory note alone. If you add an ingredient the catalog has not used before and it has a settled studied range, add an entry there and re-run the build — otherwise the row simply does not appear, which is the correct failure mode.

---

## Sitemap & domain

The site is deployed at `https://thescoopsense.com`, which is the `SITE_ORIGIN` set at the top of `scripts/build-product-pages.js`. A real origin there switches on the metadata that needs absolute URLs — `<link rel="canonical">`, `og:url`, `sitemap.xml`, and the `BreadcrumbList` structured data mirroring each product page's breadcrumb trail. They stay suppressed while the origin is a placeholder, because a canonical pointing at a fake host is worse than no canonical at all. `robots.txt` carries the matching `Sitemap:` line.

Those absolute URLs are **extensionless**, and `publicUrl()` in the build script is what makes them so. Cloudflare's asset server strips the suffix and redirects — `/creatine.html` answers `Location: /creatine`, `/index.html` answers `Location: /` — so a canonical naming the `.html` form points at a redirect, and Google resolves the redirect's target as canonical instead of honouring the tag. The `href`s between pages deliberately keep `.html`: they resolve either way through that redirect, and the site still has to open from the local filesystem and from `scripts/serve.py`, where the extensionless paths do not exist.

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
- Resize to a phone width and check the header nav, the filter panel, the tile grid, the detail dialog, and the compare table's horizontal scroll all reflow cleanly.
- Set a reminder to re-check label figures on a schedule — quarterly is reasonable.
