---
date: 2026-09-02 23:30
topic: Batch 3 label research (EVL EAA7000, Gatorade Zero powder, Micro Ingredients Sport Electrolytes)
status: paused
---

# Handoff: Batch 3 label research — three JSONs verified, not yet merged into products.js

## What we were doing
Researching supplement labels for three new Scoop Sense products per `RESEARCH_SPEC.md` and writing one JSON per product into the coordinator's scratchpad `research/` dir. All three are VERIFIED and written. Nothing has been merged into `data/products.js` yet — that is the next step (the coordinator's assemble pipeline handles it; see `scratchpad/assemble.js`, `asins.json`, `fix.js` from the earlier batch).

## Done
- `research/evl-eaa.json` — EVL EAA7000 (caffeine-free), verified from brand label images.
- `research/gatorade-zero-powder.json` — Gatorade Zero Sugar Thirst Quencher Powder, 8 x 3.5 g sticks (2026 pack), verified.
- `research/micro-ingredients-electrolytes.json` — **rewritten** to the Sport Electrolytes Powder 2 lb / 90 servings SKU after coordinator swap request (first draft was the wrong "Electrolytes Hydration Drink Mix" bag).
- All three validated: required schema keys present, no treat/cure/prevent/diagnose words, no dollar amounts in copy, every image URL returns HTTP 200 + image content-type.

## In-progress / not done
- [ ] Merge the three JSONs into `data/products.js` (eaa section ~line 13175, electrolytes section ~line 13250; the "September 2026" sections).
- [ ] Swap search-form `affiliateUrl` for direct ASIN listing (separate process; never fetch amazon.com from research).
- [ ] Download/set `imageUrl` local copies (`images/products/<id>.jpg`) + `imageBg` per house style.
- [ ] `reviews` block (house style has one; not part of research spec).

## Key decisions (why, not just what)
- **EVL: researched EAA7000, not EAA Energy** — coordinator asked for the caffeine-free one. EAA Energy = same 7 g amino profile + 110 mg caffeine + 500 mg beta-alanine + vit C/B6, 11.9 g scoop.
- **EVL keyIngredients list individual aminos only (leucine, lysine, threonine, tryptophan), no "BCAA matrix 5 g" total** — coordinator rule: never list a nested total beside its components (double-counts on the site's dose chart). The 7 g / 5 g / 2.5 g totals live in `metrics` and `blurb`.
- **Gatorade `magnesiumMg: 0`** — no magnesium row on the panel; coordinator said 0 is fine.
- **Gatorade servings = 8** (the retail box). Larger counts exist at foodservice sellers but are unverified on the brand site.
- **Micro Ingredients = "Sport Electrolytes Powder"** (name as printed on bag), NOT "Electrolytes Hydration Drink Mix". Coordinator: the affiliate listing is the Sport 2 lb / 90-serving SKU; a 10 mg-sodium mix doesn't fit a training catalog.
- **Beta-alanine 500 mg published (label), not 200 mg (web copy)** — both flavor panels AND the front of bag say 500 mg; the product-page marketing text on all four Sport flavor pages says 200 mg (stale). Label wins.
- **priceRange**: EVL "$$" (26.99/30), Gatorade "$$" (~0.62–0.75 per stick), MI Sport "$$" (38.99/90). No Budget Pick badge on any.
- **No "Third-Party Tested" badge anywhere** — MI only has a generic "lab tested" claim, no NSF / Informed Sport mark.

## Concrete identifiers (the stuff that will be lost to /clear)
- Coordinator scratchpad (NOT this session's): `C:\Users\deand\AppData\Local\Temp\claude\C--Users-deand-Projects-Pre-workout\1967ff55-c080-4c4a-b741-a4b82836a9c2\scratchpad\` — spec at `RESEARCH_SPEC.md`, outputs in `research/`. Also holds downloaded label images (`evl_*.jpg`, `sp_wl_2.jpg`, `sp_bp_2.jpg`, `gz_wyg.png`, `mi_*.jpg`).
- **EVL EAA7000**: 1 scoop, 30 servings. Pink Lemonade scoop **10.3 g**, net 10.9 oz (**309 g**); Watermelon Splash scoop **9.4 g**. Leucine 2500 / Iso 1250 / Val 1250 / Lysine HCl 1000 / Threonine 650 / Phenylalanine 250 / Histidine HCl 80 / Methionine 10 / Tryptophan 10 mg. Sodium 85 mg. PL panel: total carb <1 g. Sucralose + Ace-K + FD&C Red 40 (both flavors). Brand site variants: only Pink Lemonade + Watermelon Splash (an Unflavored SFP image exists on the CDN but is not a purchasable variant). Panel image: `evlnutrition.com/cdn/shop/files/EAA7000-30SERV-PL_3_6893a4c0-...jpg`; WM SFP: `SFP-EAA7000-30SERV-WM_4.jpg`.
- **Gatorade Zero powder**: name printed "ZERO SUGAR THIRST QUENCHER POWDER". 8 x 0.12 oz (3.5 g) sticks, net 0.96 oz (28 g). Per stick into 20 fl oz: 5 cal, 0 g carb, 0 g sugar, **270 mg Na, 80 mg K**, phosphorus 50 mg, caffeine 0. Ingredients: citric acid, maltodextrin, sodium citrate, salt, monopotassium phosphate, <=2% Ace-K, natural flavor, silicon dioxide, sucralose — **no colors**. Seven flavors. Panel source: Giant Food listing `/product/...403027`; Na/K also on gatorade.com flavor pages (checked Glacier Freeze + Orange, identical). GTINs: Glacier Freeze 00052000066173, Fruit Punch 00052000066135, Grape 00052000066234, Lemon-Lime 00052000066159, Orange 00052000066210. Front image on Gatorade's DatoCMS: `datocms-assets.com/101859/1776191514-gatorade_gzero-powder_glacierfreeze_pdpwhatyouget_desktop_2026_1812x2720.png`.
- **MI Sport Electrolytes Powder** (Watermelon Lime, SKU BA-MI-ELW0907): 2 lb (907 g), **90 servings, 2 scoops = ~10 g**, 5 cal. **Na 500 / K 400 / Mg 100 / Cl 770 / Ca 50 / Zn 5 mg**, carb 3 g = 3 g inulin fiber, 0 sugar, vit C 62, B1 1.93, B6 5 mg, B12 5.79 mcg, pantothenic 9.63 mg, **L-glutamine 500 mg, beta-alanine 500 mg**. Stevia. Flavors: Watermelon Lime (90), Berry Punch (90), Passionfruit & Citrus (95 servings), Pina Colada. Panel image: `microingredients.com/cdn/shop/files/SportElectrolytesPowderWatermelonLimeFlavor2lb_2_9ee1a6ae-...jpg`; Berry Punch panel `SportElectrolytesPowderBerryPunchFlavor2lb_2.jpg` (identical numbers).
- MI's OTHER electrolyte bag (do not confuse): "Electrolytes Hydration Drink Mix" 2 lb, 139 servings, 6.5 g scoop, **Na 10 / K 1000 / Mg 100 / Ca 82 mg** — handle `electrolyte-hydration-drink-mix-powder`. Now cited only as the buying-trap contrast in a caution.
- House-style reference entries in `data/products.js`: `lmnt-drink-mix` (~4351), `xtend-eaa-bcaa` (13179), `nutricost-electrolyte-complex` (13252).

## Pitfalls already hit (do NOT retry these)
- **WebFetch drops Supplement Facts panels** on Shopify (EVL, MI) and Gatorade pages — they are images/JS. Use `curl` for raw HTML, grep CDN image names (`SFP-*`, `*_SFP*`, `*SupplmentFact*`) or hit the Shopify `/products/<handle>.json` endpoint, download the image, Read it.
- **pepsicoproductfacts.com** is Incapsula-blocked to curl, and via WebFetch the gtin-to-flavor mapping came back wrong (66173 showed Grape, 66135 showed Glacier Cherry). Only trust the flavor-independent rows from it (3.5 g stick, 8/container, caffeine 0, phosphorus 50). Full panel came from giantfood.com instead. Target URL guess 404'd; heb.com returned empty.
- **curl URL globbing**: Shopify `search/suggest.json?resources[type]=...` — the `[]` made curl fail silently. Use `-g` or URL-encode `%5B%5D`.
- **Shopify product JSON on microingredients.com has no `available` key** on variants — do not index it.
- **EVL product `body_html` for EAA7000 is BCAA5000 copy** (site template bug) — ignore it; use label images only.
- **Old Gatorade Zero ingredient lists online include Red 40** — that is the retired 10-stick (1.08 oz) pack. Current 8-stick pack has no colors.
- **MI product-page copy says 200 mg beta-alanine; label says 500 mg.** Label published.
- Flavor-specific scoop weight (EVL 10.3 g vs 9.4 g) — always say which tub a figure is from.
- Bash heredoc with a quoted `EOF` delimiter failed in this Git Bash env ("unexpected EOF while looking for matching `''`") when the body had many apostrophes/backticks — use the Write tool for long markdown files.

## Lessons to keep
- Two independent flavor panels from the brand CDN is a cheap, strong cross-check (used on MI twice and EVL).
- `curl -sIL -o /dev/null -w '%{http_code} %{content_type}'` loop to verify every image URL before putting it in `images`.
- Final validation one-liner: required keys, banned-words grep, dollar-amount grep — run on every JSON before reporting.

## Next session: start here
1. Read the three JSONs in the coordinator scratchpad `research/` dir (path above) and merge them into `data/products.js` in the "September 2026" eaa / electrolytes sections, matching house style (`imageUrl`, `imageBg`, `metrics.form`, etc.).
2. Run the existing assemble / ASIN / image steps from the earlier batch (`scratchpad/assemble.js`, `fix.js`) if the coordinator pipeline expects them, then commit + push (git push auto-deploys to thescoopsense.com).

## Relevant files
- `C:\Users\deand\Projects\Pre_workout\data\products.js` — target; eaa section line ~13175, electrolytes ~13250.
- `<coordinator scratchpad>\RESEARCH_SPEC.md` — schema + hard rules (no amazon.com fetches, no dollar amounts, structure/function only).
- `<coordinator scratchpad>\research\evl-eaa.json`, `gatorade-zero-powder.json`, `micro-ingredients-electrolytes.json` — the deliverables.
