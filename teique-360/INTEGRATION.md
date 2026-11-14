# TEIQue 360 report: integration notes for the dashboard team

Draft, written before the dashboard stack is known. Everything here runs today from this folder with no build step and no npm packages.

## What exists

| Piece | File | What it does |
|---|---|---|
| Web report | `web.html` | The "View report" page: all sections, hover values, rater-group switches, PDF button |
| Print layout and page viewer | `report.html` | The same content on A4 pages; printing it gives the PDF. On screen it has a viewer bar, which never prints |
| PDF generator | `tools/build-pdf.js` | Opens `report.html` in headless Chrome or Edge and saves the PDF |
| Charts | `src/charts/*.js` | Functions that take report data and return an SVG string |
| Content | `src/report/content.js` | Turns data + text library into sections and blocks; used by both outputs |
| Text | `text/library.json` | All wording, keyed by scale and band |
| Data format | `data/DATA-FORMAT.md` | The JSON the dashboard must supply for each report |

## How a report gets its data

Both pages take a `data` query parameter with the URL of the report JSON:

```
web.html?data=/api/reports/123/360.json&pdf=/api/reports/123/360.pdf
report.html?data=/api/reports/123/360.json
```

- Without `data`, both pages show the built-in sample.
- `pdf` is the address of the finished PDF for the Download button. Without it, the button opens `report.html` with the browser's print dialog.
- The JSON must follow `data/DATA-FORMAT.md`. In particular, **every score arrives as a ready percentile**; the report never averages scores.

## Making PDFs

```
node tools/build-pdf.js <data.json> <out.pdf> [--fill=none] [--watermark] [--scales=pair] [--png]
```

- Needs Node 22 or newer and Chrome, Chromium or Edge on the machine. Set `CHROME_PATH` if the browser is somewhere unusual.
- It starts a local server on a free port, loads `report.html`, waits until the page reports it has finished laying out, and prints with zero margins at A4.
- Exit code 0 means success, 1 a failure, 2 a PDF that was written but has layout warnings (for example a block taller than a page).
- A few seconds and about 5 MB per report on a laptop (not timed precisely). Most of the size is card and header shadows, which Chrome stores as images.

**Server or browser?** The generator is built for a server or a job queue. Making the PDF in the user's browser would need either the print dialog (already wired to the Download button as a fallback) or a different library, and would not guarantee identical output. If the dashboard already runs Playwright or Puppeteer, replace the small protocol client in `build-pdf.js` with it; the page it loads stays the same.

## Using the charts in a React or other app

Each chart is a plain function: `TEIQ.charts.wheel(view)` returns an SVG string. `view = TEIQ.view(data)`.

```js
import './src/model.js'; import './src/svg.js'; import './src/charts/radial.js';
const svg = TEIQ.charts.gauge(TEIQ.view(data), 'empathy');
// React: <div dangerouslySetInnerHTML={{ __html: svg }} />
```

- The files attach to a global `TEIQ` object (and `module.exports` it in Node). Converting them to ES modules is mechanical if the app's bundler prefers that.
- Charts available: `wheel`, `gauge`, `strip`, `summary`, `gap`, `map`, `raters`.
- Every mark carries a `<title>` with its values. `web.html` turns those into its own tooltip; a React wrapper can do the same.

## Fonts and images

- `fonts/` holds Inter and Manrope (variable fonts, SIL Open Font License), copied from this machine. Both pages load them from there, so no network access is needed.
- `assets/` holds the cover, back cover and header logo exported from the Figma file. There is no 360-specific cover yet; the TEIQue cover is used.

## Not done, and decisions that change the integration

1. **App shell.** `web.html` has a stand-in top bar and section list. The real sidebar and top bar from the design system should wrap `<main>`.
2. **Text.** The library holds only the wording of the 2010 sample report: one band per scale. The other bands show as a yellow "Text needed" marker. Do not ship until those are gone (`grep -c "needed" text/library.json`).
3. **Languages.** One library file per language would work (`library.<lang>.json`), but chart labels in `src/model.js` and a few fixed words in the charts would need to move into the library first.
4. **Short form (TEIQue-360-S).** Not handled: the pages assume all 15 facets.
5. **Action plan.** Printed as empty boxes; it is left out of the web view.
6. **Anonymity rule, rater names, the wheel's scale.** See `data/DATA-FORMAT.md` and `brief/TEIQUE-360-FIGMA-NOTES.md`. The Rater Groups page prints rater names when the data has them, as the 2010 report does.
7. **Which score picks the wording.** `settings.textFollows` is `"self"` (default, as in the 2010 report) or `"others"`.
