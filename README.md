# Scoop Sense

Scoop Sense is an independent static site that logs what is actually in popular pre-workout supplements: caffeine per serving, the doses of the key ingredients, and honest cautions worth knowing before you scoop. It is not a supplement brand and it does not sell anything — the site earns money through affiliate links to retailers, which is disclosed in plain English next to every buy button and explained in full on its own page. The landing page (`index.html`) is deliberately warm and story-first: it explains who we are and how entries get built before it hands you off to the product hub (`hub.html`), where the full database lives with search, caffeine filters, and sorting.

Built with vanilla HTML, CSS, and JavaScript. No frameworks, no build step, no external CDNs, no images.

---

## File map

| File | What it does |
| --- | --- |
| `index.html` | Landing page. Hero, the "wall of tubs" story, how every entry gets built (with a CSS-only example dose bar), the transparency block about affiliate revenue, three JS-rendered featured products, and honest cautions. |
| `hub.html` | The product hub. Filter bar (search, caffeine buckets, stim-free toggle, sort), a results count, and the full product grid rendered by JavaScript. |
| `disclosure.html` | FTC affiliate disclosure page — how the site makes money and what commissions never buy. Loads no scripts. |
| `disclaimer.html` | FDA supplement disclaimer plus health and safety notes: not medical advice, talk to your doctor, about caffeine, always check the current label. Loads no scripts. |
| `css/styles.css` | The whole design system in one stylesheet: custom properties, typography, layout, cards, chips, dose bars, filter bar, responsive rules. All classes use the `sc-` prefix. |
| `js/app.js` | One IIFE. Reads the globals `PRODUCTS` and `FEATURED_IDS`, handles filtering, sorting, and the shared card renderer used by both the hub grid and the homepage teasers. |
| `data/products.js` | **The single source of truth.** Every product object, plus the schema documented in a header comment. `FEATURED_IDS` picks the three products shown on the homepage. |
| `README.md` | This file. |

Script order matters: `index.html` and `hub.html` load `data/products.js` first and `js/app.js` second. `disclosure.html` and `disclaimer.html` load no scripts at all.

---

## Run locally

Open `index.html` in any browser. That is the whole process — there is no build and no server required, and every link on the site is relative so it works straight off the filesystem.

If you would rather browse it over a real URL (closer to production behavior), run a one-line static server from the project folder:

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

Two things worth knowing before you apply. Amazon requires roughly three qualifying sales within 180 days of signing up to keep your account approved, so apply when you are ready to send real traffic. Amazon also expects your affiliate disclosure to be live and visible when they review the site — `disclosure.html` and the near-link disclosure lines already satisfy that, but make sure the site is actually deployed first.

**Upgrade path.** Amazon pays roughly 1–3% on supplements. Brand-direct affiliate programs (usually run through Impact or ShareASale) pay substantially more on the same products. As you get accepted into individual brand programs, swap that brand's `affiliateUrl` in `data/products.js` for its program link. Nothing else in the site has to change — the card renderer just reads the field.

---

## Add or edit a product

Open `data/products.js`, copy an existing object in the `PRODUCTS` array, and edit it. Follow the schema comment at the top of the file exactly — `js/app.js` reads those field names directly, so a typo in a field name means a blank spot on a card.

A few rules that keep the site honest and legally clean:

- **Verify every number against the current manufacturer label** before you publish it. Formulas change without notice.
- The `badges` array carries exactly one stim badge derived from `caffeineMg` (`Stim-Free` at 0, `Low Stim` for 1–149, `Moderate Stim` for 150–249, `High Stim` at 250 and up), plus up to two extras.
- Set `stimFree: true` only when `caffeineMg` is `0`.
- Keep every `clinicalNote` in structure/function language — describe how an ingredient has been studied in relation to normal body function. Never say a product treats, cures, prevents, or diagnoses anything.
- Write `cautions` as short, factual statements. One to three per product.
- Use the `priceRange` tiers (`$`, `$$`, `$$$`). Never put a dollar amount anywhere on the site; prices go stale within days.
- Keep `affiliateUrl` in the standard form: `https://www.amazon.com/s?k=<product+words>&tag=YOURTAG-20`.

To change which products appear on the homepage, edit the three ids in `FEATURED_IDS` at the top of the same file.

---

## Legal checklist recap

- [ ] **FTC near-link disclosure.** A plain-language affiliate line sits directly beneath every buy button, above the featured grid on the homepage, and at the top of the hub before any product renders. Never tooltip-only, never footer-only.
- [ ] **FTC dedicated page.** `disclosure.html` carries the full explanation and is linked from the main nav on every page ("How We Make Money") and from the homepage transparency block.
- [ ] **Amazon Associates.** The exact sentence "As an Amazon Associate, Scoop Sense earns from qualifying purchases." appears on `disclosure.html`. No prices anywhere. Buy buttons are verb-based ("Check price on Amazon").
- [ ] **FDA disclaimer.** The exact statement "These statements have not been evaluated by the Food and Drug Administration. These products are not intended to diagnose, treat, cure, or prevent any disease." appears in the shared footer on every page and in a highlighted box on `disclaimer.html`.
- [ ] **No disease or medical claims anywhere.** Structure/function language only. Health cautions are framed as general information plus "talk to your doctor."
- [ ] **Verify-current-label note.** Present in the shared footer, below the hub grid, under the homepage dose-bar example, in the `data/products.js` header comment, and as its own section on `disclaimer.html`.
- [ ] **Link hygiene.** Every affiliate anchor carries `rel="sponsored nofollow noopener"` and `target="_blank"`.
- [ ] **No impersonation.** Brand names appear only as factual product references. No brand logos, no marketing imagery.
- [ ] **Replace `hello@scoopsense.example`** with a real, monitored email address on both `disclosure.html` and `disclaimer.html` before launch.

---

## Before launch

- Re-verify every label figure in `data/products.js` against the manufacturer's current supplement facts panel. Anything you cannot confirm should come off the site rather than go up unverified.
- Load all four pages and confirm the FDA statement renders in the footer of each one.
- Click every affiliate link and confirm it opens the right product search in a new tab, with your real tracking tag in the URL.
- Confirm the disclosure line is visible above the fold on the hub, before any product card.
- Resize to a phone width and check the header nav, the filter bar, and the card grid all reflow cleanly.
- Replace the placeholder email address, and set a reminder to re-check label figures on a schedule — quarterly is reasonable.
