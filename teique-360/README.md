# TEIQue 360 report

Builds the TEIQue 360 report from score data: an A4 PDF and a matching web page.
Brief and Figma findings: `brief/TEIQUE-360-HANDOFF.md`, `brief/TEIQUE-360-FIGMA-NOTES.md`. Where the last session stopped: `CONTINUE-HERE.md`.
For the dashboard team: `INTEGRATION.md`.

## Status (2026-11-11)

| Step | State |
|---|---|
| 1. Data format, sample data, text library | Draft done. The library holds the 2010 report's wording only; that sample has one band per scale, so 40 of 60 interpretation texts are still missing |
| 2. Chart options | Done. Final picks: **1D split petals, 2D two rings**, 3A, 4C, 5A, 6A, 7A, with "You" in the deeper shade. History of charts 1 and 2 (round 2, 2026-11-11): Petros found the dark-mark style unclear and off-brand, so `chart-options.html` now offers petal chart D/E/F/G and score wheel D/E/F plus a colour treatment for "You". Grey was rejected the same day ("random gray"): "You" is now a variation of the same factor colour. **Colour decided: the deeper shade** (Petros, 2026-11-11). Style decided the same day: D for both (split petals, two rings); these are now the defaults in `src/charts/radial.js`. Charts 3 to 7 were restyled the same day: no dark marks anywhere, you is a dot or bar in the deeper shade, and every bar and dot uses the Figma gradients |
| 3. Final chart components | Done, checked against the sample and four edge-case files |
| 4. A4 page templates | Done, built from the Figma styles. Pages and wording follow the 2010 TEIQue 360 report and nothing else (changed 2026-11-11). Not yet compared page by page with Figma by Petros |
| 5. PDF generator | Done. Sample, edge cases and a long-text run all build without warnings |
| 6. Web view | First version done, with a stand-in shell |
| 7. Integration notes | Draft done (`INTEGRATION.md`) |

## Changed 2026-11-14

- **Score wheel (2D):** the two rings are now the same width with a clear gap (outer = others, inner = you), and both scores sit in the centre at the same size. Before, others had a wide ring and a large number, you a slim ring and a small number. The petal chart's hub shows both Global scores at the same size too.
- **Every factor and facet shows its score wheel** next to its rater-group strip (before, only the Global page had a wheel). The small wheel is `C.gauge(v, id, { compact: true })`; the strip beside it is drawn narrower with `C.strip(v, id, { width: 342 })`.
- Strip labels wrap onto as many rows as they need, and leader lines are drawn under the labels.
- The sample is still 30 pages; all seven builds pass without layout warnings. (Superseded the same day by the readability pass below.)

### Readability pass (2026-11-14, later)

Petros asked for better readability throughout, larger chart text, larger Low/High Scorers text, and negative space that looks intended.

- **One score per page (new default).** Every factor and facet has its own page: title, a large score wheel, the full-width rater-group strip, the text card and, where the 2010 report has them, the Low/High Scorers boxes. Facet pages carry the factor name as the small line above the title. Two per page left a lone facet on a mostly empty page for every three-facet factor; one per page gives every score the same layout. The sample is **36 pages** (was 30).
- **Two per page is still there:** `scales=pair` in the page viewer's address (the "Scores" box in the viewer bar), `--scales=pair` for `build-pdf.js`, `scales: 'pair'` in `T.report.build`. The sample is then 31 pages. The web view always uses it.
- **Score wheel:** rings 17 wide with a larger centre; "Others" and "You" print at about 10pt on the large wheel (they were under 7pt).
- **Chart text:** petal chart (larger hub, facet names and scores about 8pt, was under 7pt), perception map (wider, larger labels, labels that would collide move out on a thin leader line), gap chart (taller rows, larger text), summary graph (roomier rows), raters cards.
- **Page text:** Low/High Scorers boxes 12pt (was 10.5pt) with the lead-in in the factor colour and both boxes the same height; rater list, factor/facet overview, report-contents cards, coach data table, acknowledgement and notes all larger. Action-plan boxes are taller, so that page is full.
- **Spacing:** the paginator shares a page's spare height between its blocks (up to 22pt more per gap, `paginate.js`), so pages read as evenly spaced. A page whose large wheel would push something onto the next page first switches to a smaller wheel (`.page.tight`).
- All seven builds pass without layout warnings in both layouts.

### Wording audit and "Added" tags (2026-11-14, later still)

- `AUDIT-2010.md`: the report's wording checked against the 2010 sample report, both ways. All running text is the 2010 wording; nothing from it is missing except the listed differences (names, cover, footer, chart furniture). `node tools/audit-text.js` re-runs the check.
- What is wholly new compared with the 2010 report carries a small blue **"+ Added"** tag: the three extra pages, the raters cards and the score wheel on each factor and facet page. Charts the 2010 report already had and that were only redrawn (petal chart, Global score, rater-group strip) are not tagged. Off with "Mark additions" in the viewer, `marks=0`, `--no-marks`, or `marks: false` in `T.report.build`. **Switch them off for a finished report.**
- The profile legend now uses the 2010 wording; the coach table's "Scale" heading is gone.

### New cover (2026-11-14, evening)

- The cover follows Petros's template (`brief/cover-template-2026-11.pdf`): ribbon artwork, Psychometric Laboratory logo, three title lines, and a blue bar with the name and the date.
- Title lines: "TEIQue" / "360 Report" / "Full Form". The last two come from `cover` in the text library; the form line follows `report.form` in the data ("TEIQue-360" gives "Full Form", "TEIQue-360-S" gives "Short Form"). **To confirm with Petros.**
- The artwork is one image, `assets/cover-2026.jpg`; `tools/cover-artwork.py` says how it was made. The template is CMYK with no colour profile, so the script converts ink by ink and was checked against the brand blue of the logo.
- The earlier Figma cover (chess pieces) is kept as `reference/earlier-prototypes/cover-chess-figma.jpg`.

### Contents page and the name "TEIQue 360°" (2026-11-14, last edits)

- **Contents page** after the cover: every section with its page number, in its factor colour, facets listed under their factor. It is not numbered itself, so the page numbers of the rest are unchanged; the sample is now **37 pages**. The 2010 report has no such page, so it carries the "Added page" tag. `toc: false` in `T.report.build` leaves it out.
- **The report's name is "TEIQue 360°"** with the degree sign (Petros): cover, page header, the Summary Graph title, the web page and the browser tab. The acknowledgement page title is now "TEIQue 360° (multi-rater feedback)"; the 2010 report prints it without the sign. Body text is untouched.

## Look at it

- `report.html`: **the page viewer.** It shows every PDF page as it will print, page by page or all at once, with a bar to switch the data file, the filler, the watermark and the zoom. "Save as PDF" prints exactly what is shown.
- `out/sample-360.pdf`: the sample report (37 pages), the only build kept in git.
- The stress tests (`edge-*.pdf`, `sample-long-text.pdf`; `edge-big-gaps` shows self and raters disagreeing): build them with `node tools/build-pdf.js data/<file>.json`, or open the data file in the page viewer.
- `web.html`: the web report. `chart-options.html`: the options Petros chose from. All open by double-click.

## Commands

```
node tools/build-pdf.js [data.json] [out.pdf] [--fill=none|typical|long] [--watermark] [--no-extras] [--scales=pair] [--no-marks] [--png]
node tools/check-charts.js       # draw every chart from every data file; exit 1 on broken output
node tools/audit-text.js         # compare the report's wording with the 2010 report, both ways
node tools/make-sample.js        # rebuild data/sample-360.json
node tools/make-edge-cases.js    # rebuild data/edge-*.json
node tools/wrap-json.js          # after editing text/library.json or any data file: refresh the .js copies
node tools/seed-old-report-text.js   # how the 2010 wording got into the library (safe to re-run)
```

`--fill` controls the grey filler shown where text is missing. `--no-extras` leaves out the three pages the 2010 report did not have. `--png` also saves one image per page.

## Layout

```
report.html, web.html, chart-options.html
data/      sample-360.json, edge-*.json   made-up report data; DATA-FORMAT.md describes the format
text/      library.json                   all wording; library.js is a generated copy
src/       model.js      facets, factors, colours, score scales, the anonymity rule
           svg.js        SVG helpers
           charts/       radial.js (wheel, gauge), linear.js (strip, summary, gap), overview.js (map, raters)
           report/       content.js (pages as blocks), paginate.js (A4 layout), report.css
           web/          web.css
assets/    cover artwork (cover-2026.jpg, from the cover template), back cover and header logo (from Figma)
fonts/     Inter and Manrope
tools/     build-pdf.js and the scripts above; extract_definitions.py read the 2025 definitions (not shown in the 360 report)
out/       built PDFs (only sample-360.pdf is kept in git)
brief/     the original brief, Figma notes and screenshots, the first session's memory notes
reference/ the 2010 TEIQue 360 sample report as page images and text; earlier prototypes
CONTINUE-HERE.md   where the last session stopped and what comes next
```

## How it works

- Each chart is a function that takes the report data and returns an SVG string. No libraries.
- `content.js` turns one data file plus the text library into sections made of HTML blocks.
- `paginate.js` flows those blocks onto fixed A4 pages in the browser: a block that does not fit moves to the next page, long text cards split between paragraphs, and page numbers and the contents page are filled in last.
- `build-pdf.js` opens that page in headless Chrome and prints it.
- `web.html` shows the same blocks in a responsive layout.
- Every page loads its scripts and styles with a fresh address on each load (`?v=...`), because the preview server sends no cache headers and a new page running old cached scripts draws nothing.
- Encoding: **others = a filled shape in the factor colour.** In the petal chart and the score wheel, **you = a shape of its own in a variation of the same factor colour** (`T.youStyle` in `src/model.js`: a deeper shade, white with a colour edge, or brand blue). No unrelated grey. The strip, summary and gap charts use the same rule: you is a dot in the deeper shade with a white ring (strip, summary), and in the gap chart a bar wears the colour of whoever scored higher (factor gradient for others, deeper shade for you). No black or dark-ink marks in any chart (Petros, 2026-11-11).
- Gradients, from the Figma file: bars and dots run from the full colour along the top edge to the light colour along the bottom; petals from the full colour at the hub to the light colour at the tip; the score wheel from light at 12 o'clock to the full colour at the end of the arc. Tracks are white pills with a soft inner shadow, drawn as nested shapes so no SVG filter is needed.
- Scales: track charts use three equal-width band tracks (Low 1–30, Average 31–70, High 71–99). The gauge and the wheel are linear with marks at 30 and 70.

## What is in the report

The 2010 TEIQue 360 report's pages, in its order, with its wording: about trait EI, what the TEIQue measures, report contents, rater groups, global score, profile (wheel), one section per factor (each scale's rater-group chart, its text, and the Low Scorers / High Scorers boxes), development suggestions, action plan, acknowledgement, coach data. The cover and back cover are the Figma ones.

Not from the 2010 report but kept at Petros's request (2026-11-11): summary graph, perception map, gap chart, after the profile page. Their titles and captions are draft wording under `extras` in the library. `--no-extras`, or the box in the viewer, leaves them out.

Differences from the 2010 report that remain: scale names and factor order follow the Figma file (Emotion Management, Independent Facets; Well-Being, Self-Control, Emotionality, Sociability); each scale's chart sits next to its text instead of on a facing page; facet texts carry the facet name as a heading.

## Decided

- Interpretation text and development suggestions follow the person's **own score** (Petros, 2026-11-11), as the 2010 report appears to (its Emotionality text reads "average" for self 31 / raters 30, and 30 counts as low elsewhere in that report). `settings.textFollows: "others"` in the data would switch it.

## Assumptions to confirm

- Development suggestions appear for facets in the Low or High band (the 2010 sample shows them for exactly those).
- The sample data shows every rater group, including groups of one and two, and names the raters, as the 2010 report does. The anonymity rule still exists in the data format but is off in the sample.
- The wheel's scale (linear with rings at 30 and 70; Figma has plain quarter rings).
- The anonymity rule in `data/DATA-FORMAT.md`.
- One page per factor and per facet (34 numbered pages for the sample); `--scales=pair` gives the earlier two-per-page flow.
- Body text is Inter Light, as in Figma. If it still prints too faintly, change one line in `src/report/report.css`.
