# Scoop Sense — simulated-traffic peer review

**Date:** 2026-07-29
**Method:** Eight independent simulated visitors browsed `http://localhost:8743` blind, each in an isolated
browser session, with no access to the source. Each was given a real motive, a device, and an entry point,
and asked to report where the site failed them. Affiliate links, buy buttons, retailer links and outbound
link health were declared out of scope and excluded from all findings.

**Panel**

| Session | Persona | Device | Entry |
| --- | --- | --- | --- |
| traf-hype | 21, TikTok referral, wants the strongest pre-workout | phone 390×844 | homepage |
| traf-cautious | 34, caffeine sensitive, on a prescription, safety first | desktop | homepage |
| traf-datanerd | 29, engineer, stress-tests filters, sorts and deep links | desktop | homepage |
| traf-budget | 41, non-supplement parent, cheap protein, jargon-blind | phone 390×844 | homepage |
| traf-accessible | 63, low vision and hand tremor, keyboard-driven, 175% zoom | desktop | homepage |
| traf-organic | 26, Google third result, lands cold on a product page | desktop | sitemap deep link |
| traf-skeptic | 38, health communications, credibility audit | desktop | homepage |
| traf-stacker | 31, builds a four-category stack, tests shortlist persistence | desktop then phone | homepage |

Every persona checked the browser console at the end of its session. **All eight reported a clean console.**
Nothing in this review is a JavaScript error — every defect below is layout, state, or derivation, which is
precisely why none of it announces itself.

---

## 1. Defects confirmed in the source

These five were reported by personas and then traced to specific code. They are not judgement calls.

### 1.1 Scroll-reveal permanently hides tall content — BLOCKER

`js/app.js:1502`

```js
}, { rootMargin: "0px 0px -14% 0px", threshold: 0.15 });
```

An element must have 15% of its own height inside the root before it gets `.sc-in` and becomes visible
(`css/styles.css:3222` starts it at `opacity: 0`). The `-14%` bottom inset shrinks the root further. On a
390×844 phone the effective root is roughly 726px, so **any revealed element taller than about 4,840px can
never satisfy the threshold and stays invisible forever.**

Observed consequences:

- The `#compare` table wrappers on `protein.html` and `creatine.html` (~5,000px) are **completely invisible
  on a phone**. The heading renders, then black space. Reported independently by traf-budget.
- At 175% zoom the effective root shrinks again and the failure spreads to desktop: traf-accessible found
  `saved.html` rendering an empty page while the nav said "Saved (1)", plus whole product-page mid-sections
  and the 39-row electrolyte table as black voids.
- Even when the threshold is eventually met, fast scrolling loses the race: traf-hype and traf-organic both
  saw `compare.html` as blank striped rows for 1–2.5 seconds and concluded the table was broken.

Three personas on three different setups, and it presents as "the site lost my data" rather than as an
animation problem. Render content visible by default and treat the reveal as an enhancement; at minimum
trigger on a section header rather than the tall wrapper, and skip the reveal for anything taller than the
viewport.

### 1.2 Proprietary-blend totals are charted as single-ingredient doses — BLOCKER

`scripts/build-product-pages.js:530`

```js
const entry = DOSES.ingredients.find((e) => new RegExp(e.match, "i").test(ing.name));
```

The studied-dose lookup matches against the ingredient **name string**, and `parseDoseMg` (`:476`) reads a
leading number while ignoring the trailing word "blend". So a blend row whose name lists several ingredients
matches on whichever studied-dose entry hits first, and the blend's combined weight is charted as that single
ingredient's dose.

`data/products.js:2652` — Bloom High Energy Pre-Workout:

```js
name: "Performance Blend (L-Citrulline Malate, L-Citrulline, Beta Alanine, Beet Root Extract)",
dose: "4.68 g blend",
clinicalNote: "This is a proprietary blend — the label discloses a combined 4.68g weight but not each
  ingredient's individual amount, so the citrulline and beta-alanine doses can't be compared to the
  amounts used in published pump or endurance studies."
```

Bloom carries **no `citrullineG` and no `betaAlanineG` field at all.** The 4.68 g figure on its card, in the
compare table, and in its research bar is manufactured at build time, then awarded "At or above the studied
amount" — directly contradicting the `clinicalNote` on the very row it came from, and the footnote under the
bars saying blend contents "cannot be compared at all".

Same mechanism, other products:

| Product | Charted as | Actually |
| --- | --- | --- |
| Bloom High Energy | Beta-alanine 4.68 g, at or above studied amount | 4.68 g four-ingredient blend total |
| Bloom High Energy | L-theanine 1260 mg vs a 100–200 mg range | 1.26 g six-ingredient blend total, which also contains the 220 mg caffeine |
| JNX The Curse | Citrulline 900 mg, 15% of the low end | 900 mg Amplifier Blend total |
| JNX The Curse | Beta-alanine 0 g, 0% of the low end | 3,000 mg, undisclosed inside a blend |
| Dymatize All9 Amino | Leucine 7.2 g, at or above studied amount | combined BCAA total; the same page's stat block says "Leucine —" |

Because `seen` dedupes by studied-dose label, two products get opposite halves of the same pair, so the site
contradicts itself both within a page and across pages. Reported independently by traf-datanerd and
traf-skeptic.

This is the most damaging defect on the site. Every one of these numbers is absent from the label, on a site
whose entire promise is that every figure comes off the panel. Suppress the bar and the metric whenever the
value derives from a blend total, and print "undisclosed — inside a 4.68 g blend" in its place.

### 1.3 Category chips never filter and never update — MAJOR

`hub.html:48-53`

```html
<a href="hub.html" class="sc-chip sc-chip-active" aria-current="page">All</a>
<a href="hub.html#cat-pre-workout" class="sc-chip">Pre-workout</a>
```

The chips are static anchors. `All` has `sc-chip-active` and `aria-current="page"` hardcoded, and nothing ever
moves them. The Pre-workout chip is a same-page hash link, and `js/app.js` registers no `hashchange` or
`popstate` listener, so clicking it rewrites the URL and does nothing else.

A cold load of `hub.html#cat-pre-workout` **does** filter correctly (`readHashState()`, `js/app.js:1047`), so
the filter logic is sound. What is broken is the feedback: after a correct cold load the chip still says
"All", the H1 still says "Every supplement on file", and the facts panel still says 187 while the count says
38. Four personas hit this and three of them concluded the site's filtering was broken. traf-hype named it
their bounce point.

The same missing listener produces traf-datanerd's finding that editing the hash in an open tab leaves the
grid, the count and the selects on the previous view while the address bar advertises the new one — so a
copied URL can describe a view the user never saw.

### 1.4 The shortlist reads rows from the category config, not the label — MAJOR

`js/app.js:1605-1614`

```js
products.forEach(function (p) {
  cfgOf(p).tileFacts.forEach(function (f) {
    ...
    factRows.push(savedRowHTML(f.label, products.map(function (q) {
      return '<td class="sc-num">' + factOf(q, f.key) + "</td>";
```

Rows exist because some saved product's *category* declares them, and each cell is `factOf(product, key)`.
Gorilla Mode's label lists Creatine Monohydrate 5 g (`data/products.js:318-320`), but that dose lives only in
`keyIngredients` and never as a `creatineG` metric, so the shortlist prints "—" for it.

traf-stacker shortlisted Gorilla Mode plus a standalone creatine and was never told the pre-workout already
contained 5 g. In their words: "that is exactly the kind of thing I came here to catch." The same gap is why
traf-datanerd could not reach Kaged Pre-Kaged's disclosed 1.5 g creatine HCl through any filter on the site.
One fix serves both — lift disclosed ingredient doses into queryable metrics regardless of category.

### 1.5 The sitemap ships placeholder URLs — MAJOR

`YOUR-DOMAIN` appears **196 times in `sitemap.xml`**, plus in `robots.txt` and
`scripts/build-product-pages.js`. Every URL a crawler would read is unusable. traf-organic found it while
entering the site the way a search engine would, and read it as a signal about how finished the site was.

---

## 2. Findings by agreement

Ranked by how many independent personas hit the same thing. Convergence across unrelated motives and devices
matters more than any single report.

### Four or more personas

| Finding | Personas | Detail |
| --- | --- | --- |
| The em dash carries two meanings and is defined nowhere | 4 | `—` means both "not in this product" (Gorilla Mode, blend: No) and "hidden inside a blend" (N.O.-XPLODE, blend: Yes). The compare footnote defines "malate" and "Blend: yes" but not the dash. traf-accessible read it as "nothing at all"; traf-organic could not tell which sense applied. On a site whose subject is label transparency this single glyph does the most damage per pixel. |
| `#compare` anchors are stripped on load | 4 | Product-page "compare all X" links, the `compare.html` intro links, and category cross-links all land at scroll 0 with the hash gone, 9,000–9,600px from the table they promised. |
| Disabled AMOUNT and SORT never say why | 4 | Both greyed on open with the explanation in small grey body text below. traf-hype and traf-cautious both nearly left here. Put the reason in the control's own placeholder: "Pick a figure first". |
| Pre-workout is the only category without its own page | 4 | Every other category has `creatine.html`, `protein.html`, `eaa.html`, `electrolytes.html`. Pre-workout gets `hub.html#cat-pre-workout`, and the footer BROWSE list omits it entirely. This asymmetry is the direct cause of §1.3's visible symptoms. |
| Zero-result states are dead ends | 4 | "No products match the current filters" with no diagnosis. Searching "isopure" inside Pre-workout returns 0 while Isopure sits in Protein; "LMNT" from `creatine.html` returns 0 of 39; Brand LMNT + figure Creatine returns 0 while LMNT is still offered in a brand list the figure filter never narrowed. |

### Three personas

| Finding | Personas | Detail |
| --- | --- | --- |
| Disclosure stats do not sum, and the third state is unnamed | 3 | 125 fully disclosed + 45 blends ≠ 187, on six pages: index and hub (125+45 of 187), compare (31+4 of 38), creatine (34+3 of 39), protein (14+21 of 39), eaa (15+16 of 32), electrolytes (31+1 of 39). The Label filter offers "No blends at all (142)" — a fourth number. 17 products sit in a state the site never names, visible on Kaged Creatine HCl which shows "Proprietary blend: No" yet carries no "fully disclosed" badge. Note the cross-page totals all reconcile exactly (categories to 187, third-party to 42, disclosed to 125, blends to 45) — the counting is right, the taxonomy is missing a term. |
| Tables overflow on mobile with no sticky first column and no scroll hint | 3 | `compare.html` shows 3 of 8 columns at 390px and swiping takes the product-name column with it, leaving anonymous rows. The homepage glance table clips at "BETA-ALAN" and hides BLEND and STIM TIER. `saved.html` overflows with a **single** product saved: "400 mg" clipped, servings "20" rendering as "2C", buttons off-screen. Header rows also scroll away on `compare.html` although the homepage table pins its own. |
| Main nav clips mid-word with no affordance | 3 | "Methodolog\|y" at the right edge, Health & Safety and About off-screen behind a horizontal scroll with no fade, chevron or menu button. On `disclaimer.html` the current page's own nav item is off-screen, so there is no active-page cue at all. The link a worried parent most needs is the one hidden. |
| Saving gives no feedback where the tap happened | 3 | The only confirmation is a "Saved (n)" nav counter that is off-screen whenever the user is scrolled into the list. Two personas tapped twice, unsure whether they had saved or unsaved. traf-cautious had two clicks silently do nothing shortly after typing in the search box, suggesting the handler is lost on list re-render. |
| Badge vocabulary is undefined where it is read | 3 | "Third-party tested" is a badge, a filter, and a headline stat (42 of 187), and is defined nowhere on the site — traf-budget read it as a safety claim and guessed. "Beginner friendly" is undefined and, unlike three terms the same persona could not understand, is not filterable. "Fully disclosed" vs "No blends at all" is never distinguished. Badges are `title`-only, so on a phone there is no explanation at all. Editorial verdicts ("Budget pick", "Beginner friendly") sit in the same row and styling as label-derived facts. |
| Nobody is named and the contact is a personal Gmail | 3 | No author, no reviewer, no credentials, no organisation. "We" is never defined. traf-cautious, who came with a prescription-interaction question, said this is what stopped good method from converting into trust. |
| Price tiers carry no numbers | 3 | Budget / Mid-range / Premium with no band, no threshold, no date, and no cost-per-serving figure. The site declines to print dollar prices because they go stale, then publishes a tier derived from those same prices. traf-budget: "a word tier can't tell me whether I can afford it monthly." |
| The Compare nav item is pre-workout only | 3 | Reached from a creatine, protein or electrolyte page, "Compare" silently means pre-workouts. Its category switcher is four lowercase words mid-sentence rather than the chip row used everywhere else, and following one lands on the category grid rather than its table. |

### Two personas

| Finding | Personas | Detail |
| --- | --- | --- |
| 400 mg caffeine reads as an achievement | 2 | The caffeine bar says "At or above the studied amount" — the same approving phrase used for a well-dosed citrulline — on the highest-caffeine product on the site. The axis maximum also sits just above whatever the product contains, so no dose ever looks excessive. traf-cautious: "that phrase reads as a compliment, on the number that would put me in A&E." Needs a distinct non-approving state for hitting or exceeding a ceiling. |
| Filter option counts never recount against active filters | 2 | Creatine + Fully disclosed showed 34 in the grid while the buckets still read 7/31/1 = 39, and choosing the "(31)" bucket returned 28. Budget + "Third-party tested (12)" returns 0 while the dropdown keeps advertising 12, so users build dead ends and assume they broke something. |
| Changing category silently discards the figure filter | 2 | Figure, bucket and sort are dropped with no notice while the label filter survives. Setting caffeine then narrowing to Pre-workout resets to "Any amount"; the sequence only works in one order. |
| Products with missing source lines are the ones on the homepage | 2 | Transparent Labs Bulk and Legion Pulse Stim-Free both say "Label verified: July 2026" with no source line and no label image, while Kaged, Genius Pre and others link theirs. Both are promoted on the homepage as exemplars. |
| Nutrient columns sort descending on first click | 2 | Wrong direction for anyone limiting caffeine or sodium, which is exactly who filters on those columns. |
| Duplicate rows in the label facts panel | 2 | LMNT lists Sodium 1000 mg then "Sodium (from salt) 1000 mg", and doubles potassium and magnesium; traf-organic stopped to work out whether it was 1000 or 2000 mg. Thorne Creatine lists "Creatine Monohydrate 5 g" and "Micronized creatine monohydrate 5 g"; Kaged HCl lists its 750 mg twice, once as a marketing descriptor. |
| Caffeine buckets skip 1–149 mg | 2 | "Stim-free (0 mg) / 150–249 mg / 250 mg and up" leaves a gap, while the EAA page reports labels down to 124 mg. Within pre-workout the shelf is 0 or 150+, and the site never says so — traf-cautious spent her whole session discovering there is nothing gentle. |
| Unbranded server 404 | 2 | A mistyped URL yields "Error code: 404 — Nothing matches the given URI" with no nav, branding or route back. |
| Research ranges are never cited | 2 | Every dose verdict rests on ranges attributed to "published research" with no study, author, year or journal anywhere on the site. traf-skeptic called this the central unearned authority; the reader cannot check the one thing the site is built on. |
| The safety page is caffeine-shaped | 2 | Two of seven sections are caffeine; there is nothing about protein powder, and the only statement about minors — "not intended for anyone under 18" — is one clause mid-paragraph under a heading about medication. traf-budget, shopping for a 15-year-old, nearly left without finding it. Medication guidance names no category to raise with a doctor, and no product-level caution mentions medication even at 400 mg. |

### Single-persona findings worth keeping

**Search and filtering**
- Search is hyphen-literal: "stim free" returns 0 of 187, "caffeine free" returns 0, only "stim-free" returns 7. The exact phrase a caffeine-sensitive visitor types finds nothing. (traf-cautious)
- `FILTER BY = Caffeine` with All categories returns **187 of 187**, whey isolates included, and the AMOUNT bucket control disappears; the same deep link with sodium or creatine correctly returns 39. (traf-datanerd)
- Sorting by caffeine across all categories ranks caffeinated EAAs between 155 mg and zero while their cards show no caffeine figure, so the ordering cannot be checked against anything visible. (traf-datanerd)
- The citrulline filter returns 31 of 38 pre-workouts while 33 cards display a citrulline figure — the two blend-derived numbers from §1.2 are shown but unfilterable. (traf-datanerd)
- Category-page compare tables ignore the filters above them: "Showing 12 of 39" with all 39 rows in the table. (traf-stacker)
- Advanced "Closest to" accepts 9999 and −50 against a field labelled "between 0 and 400" and writes them to the URL; an empty tolerance result never names the nearest match. (traf-datanerd)
- Stale URL parameters survive mode switches: `within=0.1` persists into Simple mode, `sort=asc` into Advanced, and a blank search writes `q=%20%20`. (traf-datanerd)
- Filter changes use `replaceState`, so Back exits the site instead of undoing a filter. Reload and Forward both restore correctly. (traf-datanerd)
- `compare.html` sorts on rendered strings, so any cell with a suffix (`900 mg(blend)`, `4.68 gblend malate`) falls into the null block with the dashes and Bloom's 4.68 g sorts below a 1.5 g — wrong in both directions. Sorting never touches the URL, and BLEND, STIM TIER and PRICE are not sortable at all. (traf-datanerd)
- No full-EAA vs BCAA-only filter, although the homepage advertises that distinction; sorting by leucine puts BCAA-only products with EAAs "—" on top. (traf-stacker)

**Accessibility** (traf-accessible, at 175% zoom, keyboard-driven)
- Filter labels (FILTER BY / AMOUNT / SORT / PRICE / LABEL) are 11.5px letter-spaced grey caps — the smallest text on the page, above the most important controls.
- Text link hit areas measure 14–19px tall (breadcrumbs, "View label source", "Details"). Unusable with a tremor.
- "Filters & sort" opens the panel below the fold with no scroll and no focus move, so pressing Enter appears to do nothing.
- 27 tab stops before the first product; the skip link only clears the seven header links.
- Product grid images all carry empty `alt`.
- The save button is icon-only at 37px wide, and after saving the visible text says "Saved" while the accessible name still says "Save to compare: …".
- Only two headings on `electrolytes.html` and one on `compare.html`, so heading navigation cannot reach the filters, the results or the table.
- The Advanced "CLOSEST TO" field shows only an em dash, and "MATCH WITHIN" option text is clipped by the select arrow.

**Mobile layout**
- The sticky filter toolbar on category pages is 168px tall — 20% of a 390×844 screen — and swallows taps on cards beneath it. (traf-stacker)
- The image zoom lightbox is a narrow mid-screen band with the page readable above and below, the close × colliding with the site header, and the product cutout barely larger than inline. The facts-panel image zooms usefully, so the feature works and only looks unfinished. (traf-hype)
- Product names hyphen-break one word per line ("Pre-" / "Kaged", "N.O.-" / "XPLODE"), making rows three to four lines tall. (traf-hype)
- `saved.html` has ~250px of dead space above the shortlist, pushing it below the fold on a phone. (traf-stacker, traf-hype)
- Each hub card is roughly a full phone screen, so an unfiltered 187-product list is ~145 screens. (traf-hype)

**Data and copy**
- MuscleTech Cell-Tech: `creatine.html` FORM says "blend", its label panel says "Creatine Monohydrate 5 g". The blend on that label is the 38 g carb blend. (traf-datanerd)
- Serving basis varies row to row while `compare.html` claims "per full labeled serving": The Curse is per one of up to three scoops, Naked Energy's cell says "2 g per 2-scoop serving", and Legion Pulse is normalised to two scoops, halving the manufacturer's servings count and roughly doubling the per-serving cost the price tier rests on. (traf-datanerd, traf-skeptic)
- "Label verified: July 2026" is identical on every product page, hub, compare and footer, so it reads as a build stamp rather than 187 verification events — which makes the About page's promise that a correction updates the date meaningless. (traf-skeptic)
- Ancient Nutrition publishes 450 mg sodium and 280 mg potassium "from the electrolyte blend" on a page stating the blend's individual amounts are not broken out. (traf-skeptic)
- "Dosed at the level used in university research tied to strength gains after training" names no institution, study or year. (traf-skeptic)
- Bloom says "about two cups of coffee" in its cautions and "roughly 2.3 small cups" in its FAQ; the "small cup" is undefined sitewide and works out to 95 mg. (traf-datanerd, traf-skeptic)
- The Prop 65 line tells the reader a warning exists, does not say what it is, and asks them to judge its relevance. (traf-budget)
- Protein source vocabulary — isolate, concentrate, hydrolysate, casein, peptide blend — appears in a Source row on every card and is explained nowhere, so a non-expert cannot tell whether paying more is worth it. (traf-budget)
- "Per scoop 64%" appears dozens of times with no reference point; the concept is explained only in a product-page FAQ, four screens below where the number is first met. (traf-budget)
- `saved.html` asserts "Caffeine: 0 mg" for a creatine, an EAA and two electrolytes while every other absent value shows "—"; the Form row mixes "monohydrate", "powder tub" and "stick pack"; Remove buttons are all named just "Remove"; column headings show only the product part, so Thorne's column reads "Creatine" above a metric row also labelled "Creatine". (traf-stacker)
- One EAA card renders a grey "TL" monogram placeholder among neighbours with real photos. (traf-stacker)
- Product `<h1>` omits the brand ("Drink Mix 320") although the tab title includes it. (traf-accessible)
- Accordion markers use "×" when open and "+" when closed, reading as "delete this section". (traf-hype, traf-organic)
- Product images and label panels are hot-linked from brand and Amazon CDNs, handing the reader's IP and referrer to the brand under review on a site that raised the privacy bar itself. (traf-skeptic)

---

## 3. What is working — protect this in any refactor

Unprompted praise, from personas who were told to look for problems.

**Editorial integrity.** Every persona who examined it rated this the site's strongest asset, and the
skeptic — whose stated prior was that any ranking site is paid — called parts of it better than anything
they had seen.

- "Our analysis — editorial take, not from the label" as a literal heading above every opinion block, and
  "Derived from the label figures above — not medical advice" under every recommendation. Readers always knew
  which sentences were the panel and which were opinion.
- Refusing to publish star ratings, with the reason conceding the conflict: "A site that earns commission on
  the products it rates has no business handing out its own star ratings."
- Publishing "C4 is probably one of the worst pres you can take" and "users repeatedly call the packet price
  steep for what amounts to salt" on pages carrying the site's own affiliate links.
- Framing the seller's own rating as "collected and moderated by the seller — treat it as a marketing figure,
  not an independent one", directly beside the number.
- The LMNT sodium bar declining to score because mixing volume is absent from the panel, so concentration
  cannot be derived. A site refusing to produce a number it cannot defend.
- The Kaged HCl note: no established studied dose of its own, "a solubility argument that head-to-head
  research has not settled."
- Excluding Amazon ratings on terms-of-service grounds and excluding brand testimonials and affiliate-review
  blogs "because they are advertising with a friendlier voice."
- Verbatim Reddit quotes with thread links and years, including ones that favour competitors.
- Honestly flagging the homepage's own worked example as a superseded pre-2024 label instead of quietly
  updating it.
- No analytics, no ad tags, no trackers; shortlist stored locally. The privacy claims verify.

**The label-versus-research bars.** Named the single best thing on the site by four personas, including the
one who reads no paragraphs and the one who understands no jargon. Dose, shaded studied range, a marker for
where this product lands, and a caption. This is the format that made non-experts feel able to judge a
product. It is also why §1.2 matters so much: the most persuasive component is the one being fed
manufactured numbers.

**Real photographed supplement facts panels.** traf-hype: "this is where I fully trusted the site."
traf-organic said the "Label verified · View label source" line did more for credibility than any amount of
copy.

**Cautions that work against the sale.** Beta-alanine tingles, creatine HCl being weaker gram-for-gram,
"not a sensible first pre-workout", "stim-free doesn't mean effect-free", glycerol clumping, and spelling out
that every figure assumes two scoops when the label prints one. traf-hype: "nobody else does that."

**Accessibility fundamentals.** From the persona hunting for failures: focus visible on every control with a
2px outline, a skip link that becomes a solid button on focus, tab order matching visual order with no traps,
a real accessible name on every control ("Save to compare: Dr. Berg Electrolyte Powder", "Show image 2 of 3"),
`aria-sort` on real header buttons, a caption and scoped headers on the product table, the result count in a
live region, and reduced-motion respected. The image zoom dialog was called "the best-behaved dialog I have
used in a long time" — focus moves in, is trapped, Escape closes, focus returns.

**The cream facts panels.** Dark text on light card with right-aligned tabular figures — singled out by the
low-vision persona as the best thing on the site for weak eyes, and by the parent as the only place she could
read a number confidently.

**State handling, where it works.** The shortlist survived reload, cross-page navigation, a new tab, closing
the original tab, and a desktop-to-phone switch, with the nav count correct everywhere. Browser Back from a
product page restored filters, sort **and** scroll position — traf-stacker's "best moment of the session".
Deep links rebuild the full view including selects and an active-filter badge. Clear all genuinely clears,
including the URL.

**Filter option counts.** "250 mg and up (21)", "Third-party tested (12)" — letting users size a filter
before committing was praised by four personas. Worth fixing (§2) precisely because it is relied on.

**Category page intros.** traf-budget called the protein page's explanation of grams versus scoop size "the
single most useful sentence on the site". traf-organic noted the category pages orient a stranger better than
the product pages do — which is backwards, and points at the fix for §2's cold-entry problem.

**Tone.** Every persona, including the two hostile ones, said the homepage did not read like a scam blog.
"Read the label. Skip the hype." plus "no paid product placement" bought trust in seconds.

---

## 4. Suggested order

Ordered by damage per unit of work, not by severity label.

1. **Stop hiding content behind the scroll-reveal** (§1.1). One observer configuration. Fixes an invisible
   compare table on phones, an apparently empty shortlist at zoom, black voids mid-product-page, and the
   "broken table" impression on fast scroll. Three personas, three setups, presenting as data loss.
2. **Never derive an ingredient dose from a blend total** (§1.2). One guard in the build script plus a
   rebuild. Removes the site's most serious factual contradictions from its most persuasive component.
3. **Fix the chip and hash feedback loop** (§1.3). Add a `hashchange`/`popstate` handler, drive chip active
   state from applied state, and sync the heading and facts panel to the active filter. Removes the bounce
   point four personas hit and the URL-lies-about-the-view problem in one change.
4. **Define the em dash, and define the badges** (§2). Cheapest credibility win available. One glyph with two
   meanings on a transparency site, plus "Third-party tested" undefined while used as a badge, a filter and a
   headline stat.
5. **Name the third disclosure state and make the stats sum** (§2). The counting is already correct; the
   taxonomy is missing a term. Add "Partly disclosed (17)" to the stat blocks and the Label filter.
6. **Make the shortlist read from label data** (§1.4), which also makes cross-category doses filterable.
7. **Mobile tables: sticky first column, sticky header row, edge affordance.** One pass fixes `compare.html`,
   the homepage glance table and `saved.html`.
8. **Give pre-workout its own page** (§2). Removes the asymmetry behind several separate symptoms.
9. **Search synonyms and hyphen-insensitivity, and a diagnostic zero-result state** — "0 pre-workouts match
   'isopure' — 1 match in Protein. Search all categories?"
10. **Accessibility pass:** filter label sizes, link hit areas, focus move on panel open, image `alt`, the
    save button's accessible name, and headings for the filter and result regions.
11. **Put a name on the site and cite the research ranges.** The largest trust gain available, and the one
    thing no amount of good method compensates for. Three personas raised it independently.
12. **Fix the sitemap placeholder** (§1.5) before any indexing matters.
