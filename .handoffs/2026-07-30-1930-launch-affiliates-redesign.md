---
date: 2026-07-30 19:30
topic: launch day — real affiliates, static catalog, label-panel homepage
status: paused
---

# Handoff: launch day — real affiliates, static catalog, label-panel homepage

## What we were doing
Site went fully live at https://thescoopsense.com and got its revenue plumbing: real Amazon tag, direct listing links, brand-direct links for products Amazon doesn't carry, plus a homepage redesign and static (no-JS) catalog rendering. Session ended mid-way into the social-media / brand-program bootstrap.

## Done ✓
- Amazon tag `thescoopsense-20` on every link (StoreID; account exists, clock: 3 qualifying sales within 180 days of signup or account closes).
- 179 of 186 products on direct `/dp/<ASIN>` links; the other 7 link to the brand's own product page (no Amazon listing exists).
- Catalog is 186: Dymatize All9 Amino retired (dead ASIN + Dymatize's own store says unavailable). Vega entry renamed to "Protein + Recovery" (manufacturer rename; link was right, catalog name was stale).
- Static catalog markup: category pages, hub, compare table and homepage preview all render in the HTML at build time; verified byte-identical with JS on/off in Chromium. All 186 product pages statically reachable.
- Homepage redesigned after user said it "looks too much like AI": the whole front door is one paper Supplement Facts panel (search + 5 category rows + stats + dagger footnote). Sentence-case "Read the label." headline. Glow, eyebrow, chips, cred bullets, category cards, CTA band all deleted. User's shelf photo = hero backdrop (`images/hero-shelf.jpg`, two scrims).
- Canonical/og/sitemap URLs are extensionless via `publicUrl()` (Cloudflare 307s `.html` to bare paths).
- "We read labels — we do not lab-test" disclosure in 3 places (methodology step 5, disclaimer section, dose-bars intro).
- `hello@thescoopsense.com` live via Cloudflare Email Routing (MX verified); site contact swapped on disclaimer + disclosure pages.
- Link checker `scripts/check-affiliate-links.js`: streams results, `--slice A:B`, retries bot checks. Sweep: ~138 of 179 verified clean, 2 real defects found and fixed, ~40 unverified (rate-limit blocks, re-run when IP cools).
- User given step-by-step signup instructions for Bucked Up / Xwerks / 1st Phorm / Awin+Impact networks, plus an Xwerks application message text.

## In-progress / not done
- [ ] User creating X + Instagram accounts for Scoop Sense (use hello@; needed for Bucked Up form and general program review).
- [ ] Social card generator from `data/products.js` — offered, not started. One PNG per product in label-panel style; content mine for posting cadence.
- [ ] Brand program applications (user-side): Bucked Up ambassador (up to 30%), Xwerks (30%, form), 1st Phorm Legionnaire (up to 25%), Transparent Labs via Awin (their own affiliates page is a soft 404).
- [ ] Re-run link checker on the ~40 bot-blocked ASINs (`--slice` ranges; wait hours/days for IP cooldown).
- [ ] Flavors: user wants real flavor lists per product. Only `flavorsNote` prose exists. Needs a 186-product research pass (same shape as the ASIN job — parallel agents were authorized for that once, ask again).
- [ ] Reviewer feedback items deliberately parked: URL scheme change (rejected — 187 redirects for nothing), Find-My-Formula quiz, versus-pages, correction/product-request forms, owner/editor "who runs this" section.

## Key decisions (why, not just what)
- **Never guess an ASIN** — arbitrary IDs; a wrong one silently sends buyers to the wrong product. Every ASIN came from an opened listing; `apply-asins.js` refuses batches (dup ASINs, missing brand in listingTitle, `brandAlias` field for line-names like Gatorlyte).
- **7 no-Amazon products link brand-direct, plain (unmonetized)** — better than a dead Amazon search that surfaces competitors; build already switches copy ("See the Bucked Up listing", no Amazon-reviews claim).
- **Homepage signature = functional Supplement Facts panel** — the one artifact this site owns; replaced the AI-template kit. Steel-blue accent stays OFF paper; controls on paper are ink-on-cream.
- **Static markup comes from js/app.js's own renderers** (evaluated under a document stub in the build) — a second copy would drift silently.
- **Retire dead SKUs** rather than keep unpurchasable entries (All9 precedent, matches research-era rule).
- **modvision-social MCP is logged into ModVision's X/IG** — infrastructure works but WRONG BRAND; never post Scoop Sense content there.

## Concrete identifiers
- Deploy: `git push origin main` → Cloudflare Workers Builds auto-deploys (no CI file, wrangler NOT authenticated locally). Edge serves stale HTML for minutes; verify with `curl -H "Cache-Control: no-cache" "url?cb=$RANDOM"`, fetch body ONCE into a var.
- Cache-bust version currently `20260730f` (in every HTML + `VERSION` in build script; bump together).
- Repo: github.com/DeanPatterson1/scoop-sense. Session ended at commit `888e6ac`.
- Build: `node scripts/build-product-pages.js` after ANY data/products.js change — writes products/, by-category/, sitemap, static catalog markup (`<!--sc:tiles-->` etc markers), hero figures + data-cat-count counts.
- Amazon Associates StoreID: `thescoopsense-20`.
- WebSearch budget was exhausted this session (200/200); WebFetch + curl-with-UA still worked (Amazon serves titles to curl; search pages need the `/slug/s?k=` path form, plain `/s?k=` gets blocked).
- Playwright checks: `scratchpad/hydration_check.py` (JS-on/off parity), `search_check.py` (hero search round-trip), `hero_shot.py` (screenshots) — scratchpad dies with session; recreate from memory if needed (serve via `python -m http.server 8642`).

## Pitfalls already hit (do NOT retry these)
- Don't run two link-checker instances (or checker + manual curls) concurrently — Amazon rate-limits the IP and everything reads as bot-blocked.
- Bash tool kills backgrounded commands at 10 min; long sweeps must stream output and run in `--slice` halves.
- `html_handling: "none"` in wrangler.jsonc would break `/` → index.html; the canonical fix was emitting extensionless URLs, not changing Cloudflare.
- `.sc-input`'s later CSS rule ties on specificity and painted the paper search field dark — doubled selector (`.sc-labelsearch .sc-labelsearch-input`) fixed it.
- Amazon listing titles drop brand names (C4 not Cellucor, EVL not Evlution, Gatorlyte not Gatorade) — checker treats full-name-match-without-brand as "review", `brandAlias` in apply-asins.
- "Wrong product" flags can be manufacturer renames (Vega, Ritual) — check the brand's own page before re-linking.

## Next session: start here
1. Ask user if X/Instagram accounts exist yet; if yes, build the social card generator (PNG per product, label-panel style, from data/products.js) and set posting cadence.
2. If Amazon IP has cooled, re-run: `node scripts/check-affiliate-links.js --slice 90:180` (background, streams).
3. When any brand program acceptance arrives: swap that product's `affiliateUrl` to the tracked link, rebuild, push.

## Relevant files
- `data/products.js` — single source of truth, 186 products.
- `scripts/apply-asins.js` — ASIN applier with refusal checks + `brandAlias`.
- `scripts/check-affiliate-links.js` — quarterly link verifier (`--slice`, streaming).
- `scripts/build-product-pages.js` — everything generated; `publicUrl()` ~line 46; static-markup injection ~line 1310; hero stats ~line 1490.
- `js/app.js` — renderers split to return strings; module.exports hook at EOF for the build; `readQueryState()` folds `?q=` into `#q=`.
- `README.md` — affiliate section documents programs/rates found (Bucked Up 30%, 1st Phorm 25%, Xwerks 30%, TL via network).
