---
date: 2026-09-03 17:40
track: mobile-ui
topic: rework the phone layout to look professional / apply UI psychology
status: shipped — one open question left, listed below
supersedes: .handoffs/2026-09-03-1645-mobile-ui-professional-mobile-layout.md
---

# Handoff: [mobile-ui] Professional mobile layout — shipped

Owner's request, verbatim: **"i want the mobile layout to be changed to look more
professional and fit ui phycology"**.

Live on thescoopsense.com as `v=20260903b`. Pushed `8de7a90..b7d25ee`, edge
confirmed serving the new token, and the changes were re-verified against the
live site (not just localhost) at 390×844.

## The direction the owner actually gave

The first session measured and stopped. This one asked, and the answer
reframed the work — worth keeping, because the numbers pointed the wrong way:

- Owner on the problem: **"since its consise the issue is all of the empty
  space is gone and it just a list as you scroll"**, then, with screenshots of
  index.html's nav/hero/panel stack: **"This is what u ment by no space"**.
- Chosen: **sticky bar, breakdown-first** on product pages; **layout +
  typographic tightening** (identity untouched).

So: **do not compress the cards.** The previous handoff's "shrink the tile so
2–3 fit per screen" idea was offered and rejected. What was wanted was
separation and rhythm, plus the removal of space that was being *wasted*
rather than space that was *there*.

## Shipped ✓

`adeca6b` — **the dev server pitfall both previous handoffs warned about is
fixed, not worked around.** `SimpleHTTPRequestHandler` defaults to HTTP/1.0, so
the server closed the socket after every response; on Windows a close with a
654KB body still in the send buffer reaches the browser as an RST. Console said
`ERR_CONNECTION_RESET`, the server still logged 200, and the page rendered its
server-side tiles with no `PRODUCTS` behind them — a dead page that looked like
a CSS bug. Now `protocol_version = "HTTP/1.1"` on a `ThreadingHTTPServer`.
Verified 669679/669679 bytes, three runs of three. **Delete the "re-fetch before
believing a dead page" workaround from your mental model.**

`8e425a5` — the layout pass:

| | before | after |
|---|---|---|
| Sticky toolbar | 206px (24% of viewport) | 114px (14%) |
| Quick-filter chips | 184px, 4 stacked | 48px, one scrolling row |
| Gallery thumbnails | 136px, wrapped | 72px, one row |
| Tile gap | 12px | 20px |
| Section padding | 40px | 56px |
| `.sc-lead` | 1.125rem/1.65 | 1.0625rem/1.55 below 640px |
| Product `<h1>` | y=875 (below fold) | y=724, 2-line title clears |

`b7d25ee` — **the database facts panel came apart at phone width.** The
two-column fold was scoped `max-width: 899px`. Right at 700px (306px columns);
wrong at 390px, where each column is 152px — narrower than the labels — so
"Caffeine range" and "Fully disclosed" wrapped while their figures stayed on
the line above, and every row grew to 55px. Now single-column below 560px.

## The bugs found along the way (all real, all fixed)

1. **The comparison table.** `.sc-table-scroll` becomes `display: flex` under
   559px, which made `.sc-table` a flex item — and a flex item shrinks to
   min-content. The figure columns are `nowrap` and would not give, so the
   whole squeeze landed on the product column: "Legion Pulse Stim-Free" set
   **one word per line** beside figures it no longer lined up with. Fixed with
   `flex: 0 0 auto` plus a 10.5rem floor on the first column; the table is now
   642px in a 343px scroller and scrolls as the edge chevron always promised.
2. **`.sc-pdp-media-col` had no `min-width: 0`.** The thumbnail strip's
   5×64 + 4×8 = 352px of min-content was already blowing the grid item out to
   352 inside a 343 track. Invisible until the full-bleed strip carried 9px of
   it off the side of the page.
3. **The "How we evaluate products" note was pinned inside the sticky
   `<section>`**, so its ~44px was stuck to the top of the screen for the whole
   session. Moved out, in all 5 pages.
4. **"Clear all" took a toolbar row to offer to undo nothing.** `syncClearBtn()`
   in js/app.js marks it `.sc-clear-idle`; hidden below 560px until any filter
   is set.

## Pitfalls hit THIS session (do not repeat)

- **`flex: 1 1 0` on the toolbar `<select>`s crushed them to bare chevrons with
  no visible label.** They need `flex: 1 1 0` *with* `min-width: 9rem`.
  `flex-basis: auto` is equally wrong the other way — a select's auto width is
  its widest option (the longest brand name on file), so each one claimed a
  full row. Both mistakes were made and both are in the git history.
- **`display: contents` to reorder the PDP media column is a trap** — the grid
  gap then applies between the photo, the thumbs and the caption, adding 64px.
  Rejected; the photo was shrunk to 4:3 instead.
- **The action bar cannot be always-on.** At 65px fixed it left the `<h1>`
  clearing it by 2px, which is a coincidence, not clearance. It now hides while
  `.sc-pdp-title` *or* `.sc-buybox` is on screen.
- **Playwright + `scroll-behavior: smooth`**: `window.scrollTo` animates, so a
  350ms wait reads mid-scroll state and lies. Set
  `document.documentElement.style.scrollBehavior='auto'` first.
- **`/hub.html` 307s to `/hub` on the live site.** `curl` without `-L` returns
  an empty body and a deploy poll that never matches. Poll the bare path.
- `.playwright-mcp/` and `*.log` are gitignored; screenshots written to the repo
  root are NOT — delete them before `git add -A`.

## Open question for the owner (the only thing left on this track)

The first product on the hub sits at **1.35 screens**. The stack above it:
header 158 · intro 697 · toolbar 114 · eval note 50 · quick chips 66 · count 38.

Presented as a measured menu; owner has not chosen:

- **"How we evaluate products" below the grid → −50.** Pure duplication
  (methodology is in the nav and the footer). Recommended; loses nothing.
- **Drop the facts panel on phone → −203** (index.html carries the same four
  figures). Would reach 1.11 screens.
- **Lead to two lines → −52.** Editorial.
- **Hide the quick label chips → −66.** Argued against: a code comment says
  they exist because those filters were invisible inside a collapsed panel.

Even all four only reaches 0.91 screens — 426px of header/toolbar/filter chrome
precedes the intro — so a sub-one-screen first product means gutting the hero.
**Do not cut intro content without the owner saying so.** The intro was
investigated and found sound; the panel was the actual defect.

## Deliberately NOT changed

- **The nav is still 2 rows / 96px.** A previous session tried a scrolling row,
  found it hid "Health & Safety" and "About" behind an undiscoverable swipe,
  and wrote the reasoning into the CSS comment at `.sc-nav`. Left alone.
- **The category chip row still wraps to 2 rows (88px).** Unlike `.sc-quick`,
  it packs 3+3 tidily and every category stays visible. It looks intentional;
  scrolling it would hide "Electrolytes" for no real gain.
- **Tile size and the affiliate CTA's priority.** Cards were not compressed
  (owner's direction), and the bar keeps the breakdown as the filled control
  with the retailer link secondary, per the trust rules.

## Still outstanding (unrelated to mobile)

- **`node scripts/check-affiliate-links.js` produced no signal.** Every one of
  the 219 ASINs came back `blocked by Amazon bot check — recheck by hand`. Not
  a pass — the run simply could not verify anything. Needs a different approach
  (different IP, throttling, or the Product Advertising API), not a re-run.

## Concrete identifiers

- `css/styles.css` is now ~3790 lines, still mobile-first: unqualified rules
  ARE the phone layout. New phone blocks live at `.sc-quick`, `.sc-toolbar`,
  `.sc-gallery-thumbs`, `.sc-pdp-bar`, `.sc-intropanel`.
- `js/app.js`: `initPdpBar()` (bar visibility) and `syncClearBtn()` (called
  from `renderHub()`, which is the one place every filter change passes
  through).
- `scripts/build-product-pages.js`: `VERSION` = `20260903b`; emits
  `<body class="sc-pdp-page">`, `id="label-data"` on the facts section, and the
  `.sc-pdp-bar` markup after `</footer>`. `breakdownHref` falls back to
  `#label-data` when `doseComparisonHTML(p)` returns "" — **218 pages link to
  `#studied-doses`, exactly 1 needs the fallback**, so the fallback is load
  bearing, not defensive.
- Verify a claim about the phone layout by measuring, not by screenshotting a
  full page: `getBoundingClientRect`, `scrollHeight/innerHeight`, and
  `documentElement.scrollWidth > clientWidth` for overflow.
