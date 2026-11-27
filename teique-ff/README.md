# TEIQue Full Form report

The TEIQue Full Form (TEIQue-FF) report generator, built on the TEIQue 360° report's engine. It turns one person's
20 TEIQue scores into the A4 report. So far it makes the **Personal/Counselling** version.

Started 2026-11-27. Source of every word: the 2025 sample `2025/Samples/Sample Reports 28-11-2025/TEIQue-FF Personal_Counselling Report [SAMPLE].pdf`.
Page design: Figma file `OABrZx0GBrroCvGFQfj89Z`, page "TEIQue + TSIQue" (frame list in `../teique-360/brief/TEIQUE-360-FIGMA-NOTES.md`).

## Where things are

| Path | What |
|---|---|
| `report.html` | **Page viewer**: every PDF page as it prints, with a data-file switcher. Printing it gives the PDF |
| `src/content.js` | Builds the pages' content (`T.ff.build`) from a data file and the text library |
| `src/ff.css` | Styles this report adds to the 360's page styles |
| `text/library.json` | All report wording (`text/library.js` is the same, for double-click use). **Generated**: edit `tools/build-library.py`, not the JSON |
| `data/` | Made-up data: `sample-ff.json` (the sample's own scores), `edge-extremes.json` (1, 99, every band, a long name), `edge-watermark.json` |
| `reference/` | What was read out of the 2025 sample: its text layer, and the OCR of its text cards (which are pictures) |
| `tools/build-pdf.js` | `node teique-ff/tools/build-pdf.js` makes `out/sample-ff.pdf`; give a data file to build another |
| `tools/audit-text.py` | Checks a built PDF against the sample, both ways (see below) |
| `tools/build-library.py` | Makes `text/library.json` from `reference/`, with every proofreading correction listed |
| `tools/extract-sample.py`, `tools/ocr-cards.py` | How `reference/` was made (pypdf; RapidOCR for the cards). Needed again for the other versions |
| `tools/wrap-json.js` | After adding or editing a data file: writes the `data/*.js` scripts and `data/files.js` |

Shared with `../teique-360/` (not copied): the score model and colours (`src/model.js`), the SVG helpers, the charts
(`src/charts/radial.js`, `linear.js`), the paginator (`src/report/paginate.js`), the page styles (`src/report/report.css`),
the fonts, the cover template artwork and the back cover. The charts gained a one-score mode for this report
(`C.wheel(v, {single})`, `C.gauge(v, id, {single})`, `C.summary(v, {single})`); the 360 report draws exactly as before.

The **Report Hub** (`../teique-360/hub.html`) makes this report too: pick "TEIQue Full Form" under Report.

## Running it

- Open `report.html` by double-click, or serve the **repo folder** (the page loads `../teique-360/`): `py -m http.server 4360` in the repo root, then `http://localhost:4360/teique-ff/report.html`.
- PDF: `node teique-ff/tools/build-pdf.js [data.json] [out.pdf] [--fill=none|typical|long] [--watermark] [--png=<dir>]`. Needs Node 22+ and Chrome or Edge (`CHROME_PATH` to choose).
- Wording check: `python teique-ff/tools/audit-text.py` after building `out/sample-ff.pdf`. It must print 0 missing and 0 pieces not in the sample.

## Data file

```json
{ "schema": "teique-ff/1",
  "report": { "form": "TEIQue-FF", "version": "personal", "language": "en", "norm": "UK", "date": "2025-11-21", "id": "SAMPLE-FF-0001" },
  "subject": { "name": "Maria Green" },
  "settings": { "watermark": false },
  "self": { "global": 8, "wellbeing": 8, "happiness": 8, "...": "all 20 scales, percentiles 1 to 99" } }
```

Scale ids are the 360's: `global`, the factors `wellbeing`, `self_control`, `emotionality`, `sociability`, and the 15 facets.

## The pages (28, as in the sample)

Cover · Contents · Introduction · Structure of the TEIQue (15-4-1 tree, "Scores" card with three example wheels) ·
Uses of the TEIQue report (15 circles) · Wheel chart and quote · Summary graph · Global Score · each factor page followed by
its facets · Independent Facets (Adaptability, Self-Motivation) · back cover.

Each scale page: title, lead line (Global and factors), the definition beside the score wheel, "Your Score", and the card
with the interpretation for the person's band (Low 1–30, Average 31–70, High 71–99, the 360's bands).

## Wording: where it comes from

- Everything on the pages is the sample's text, word for word: the text layer for titles, introduction, definitions and
  lead lines; the card pictures (OCR, then proofread line by line against the pictures) for the interpretations and the
  score explanation. `tools/build-library.py` lists every correction made to the OCR.
- From Figma or the cover template, not the sample: "Your Score", "Your TEIQue Wheel Chart", "Your TEIQue Summary Graph",
  the header "TEIQue Personal", the factor titles in the contents ("Well-Being Factor"), the cover's "Full Form".
- Left out because they are only in one of the two: Figma's sign-off under the introduction ("Sincerely, Konstantinos V.
  Petrides", not in the sample) and Figma's structure page title ("The Structure of Trait Emotional Intelligence"; the sample's
  "Structure of the TEIQue" is used). The back cover is the 360's (Figma's "Get to Know Thyself"); the sample's says
  "Reflection of your essence".

## Open items

1. **Missing wording (needs LPL):** the sample shows one band per scale, so 40 of 60 interpretation texts are missing
   (filled: Low for 19 scales, Average for Impulse Control). The report shows the "Text needed" marker for them.
2. Band thresholds (1–30, 31–70, 71–99) are the 360's; the sample does not state them. Confirm.
3. Next versions, as agreed: Corporate and Leadership (same pages, other wording), then Developmental and Recruitment
   (their own page types). Each needs its sample read with `extract-sample.py` and `ocr-cards.py`, then proofread.
