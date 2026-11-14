# TEIQue 360 report: continue here

Handoff for a new Claude session or account. Read this first, then `README.md` in this folder.
All paths below are relative to this folder, `teique-360/` in the `lpl-prototypes` repo.
Written 2026-11-14 at the end of the first working session (2026-11-10 to 2026-11-11).

## What the project is

Petros (designer, LPL / London Psychometric Laboratory) needs the **TEIQue 360 report** in two forms:

1. A **PDF generator** that turns one person's 360 score data (their own TEIQue scores plus their raters' scores) into a finished A4 report matching the LPL Figma designs.
2. The same report as a **web page** for the account dashboard's "View report" page.

The original brief is `brief/TEIQUE-360-HANDOFF.md`. Figma findings are in `brief/TEIQUE-360-FIGMA-NOTES.md`, with screenshots in `brief/figma-refs/`.

## Where things are

| Path | What |
|---|---|
| this folder | All the code. No npm packages, no build step |
| `report.html` | **Page viewer**: every PDF page as it prints, page by page or all at once, with a data-file switcher. Printing it gives the PDF |
| `web.html` | Web version of the report (stand-in app shell) |
| `chart-options.html` | Chart options Petros chose from (picks saved in the browser) |
| `tools/build-pdf.js` | `node tools/build-pdf.js data/sample-360.json` makes `out/sample-360.pdf` with headless Chrome |
| `text/library.json` | All report wording |
| `data/` | Made-up sample and edge-case data files; `DATA-FORMAT.md` |
| `out/sample-360.pdf` | The current sample report (36 pages). Other builds in `out/` are ignored by git |
| `brief/` | Brief, Figma notes, Figma screenshots |
| `reference/2010-sample-pages/` | Page images and extracted text of the 2010 TEIQue 360 sample report, the source of all wording |
| `brief/claude-memory/` | The two memory notes the first session kept (copy into the new account's memory if useful) |
| `reference/earlier-prototypes/` | Petros's own earlier chart files, found in the original folder; not part of this build |

The original working folder on Petros's machine was `Desktop/L.P.L/Design/web/cursor/003_INTERNAL TOOLS/teique/`; this repo folder replaces it.
The whole site's design system is in `../design-system/`.

## How to run it

- Needs Node 22 or newer and Chrome or Edge. Python is only used for the local preview server.
- Open `report.html` by double-click, or serve this folder: `py -m http.server 4360` inside it, then open `http://localhost:4360/report.html`.
- In the Claude desktop app, the first session had this preview config in `Design/web/.claude/launch.json`:
  `{ "name": "teique-360", "runtimeExecutable": "py", "runtimeArgs": ["-m", "http.server", "4360", "--bind", "127.0.0.1", "--directory", "<path to teique-360>"], "port": 4360 }`
- After editing `text/library.json` or any data file: `node tools/wrap-json.js`. Check charts: `node tools/check-charts.js`. Rebuild PDFs: see the README.

## Decisions Petros made (do not reopen)

1. **Contents:** only the 2010 TEIQue 360 report's pages and wording, copied word for word, in its order. Petros objected to wording Claude had drafted (an introduction): "only include the old report contents for now nothing else". **Do not write new report copy**; where wording is missing, show the yellow "Text needed" marker.
2. **Exception, at his request:** the summary graph, perception map and gap chart pages stay in (after the profile page). Their titles and captions are Claude's draft, kept under `extras` in the library.
3. **Score text follows the person's own score**, not the raters' average (as the 2010 report appears to). `settings.textFollows` in the data can switch it.
4. **Final chart picks:** 1D split petals (petal chart), 2D two rings (score wheel; since 2026-11-14 the rings are equal in width, clearly separated, with both scores the same size in the centre), 3A labelled rater-group strip, 4C summary bar + marker, 5A gap bars, 6A perception map with four quarters, 7A raters cards.
5. **"You" vs "others" styling:** others = the factor colour gradient; **you = a deeper shade of the same factor colour**. No grey ("random gray, doesn't match the vibe"), no black lines or dark marks in any chart.
6. **Gradients as in Figma:** bars and dots run from full colour (top) to light colour (bottom); petals from full colour at the hub to light at the tip; score wheel from light at 12 o'clock to full colour. Tracks are white pills with a soft inner shadow.
7. **Summary bars keep equal-width Low / Average / High tracks** (Low 1–30, Average 31–70, High 71–99 each fill their own third).
8. The wheel is the Figma "3 tiered" wheel (node 249:19485). Note: its rings are a plain quarter grid in Figma; the code uses a linear 0–100 scale with dashed rings at 30 and 70. Not yet confirmed by Petros.

9. **Every factor and facet shows its score wheel as well as its bar** (Petros, 2026-11-14): a small wheel sits to the left of each rater-group strip.
10. **Readability pass** (Petros, 2026-11-14): larger text in every chart and card, and negative space that looks intended. Claude's answer was one score per page with a large wheel (36 pages); two per page (31 pages) stays available as `scales=pair`. **Not yet confirmed by Petros**: he may prefer the shorter layout.
11. **Additions are tagged** (Petros, 2026-11-14): only what is wholly new compared with the 2010 report carries a small "+ Added" tag (the three extra pages, the raters cards, the score wheel on each factor and facet page); redrawn 2010 charts such as the petal chart are not tagged. The tags are on by default for review and must be switched off for a finished report. `AUDIT-2010.md` has the full wording audit.

## Current state

- Second session (2026-11-14, in the cloud from this repo): equal-ring score wheel and a wheel on every scale, see the README's "Changed 2026-11-14". The page viewer is also published as a private claude.ai page for Petros to review.

- All seven brief steps have a working version: data format and sample, chart options, final charts, A4 pages, PDF generator, web view, integration notes (`INTEGRATION.md`).
- Seven PDFs build without layout warnings: the sample, a long-text run with the watermark, and stress tests (one rater, missing groups, scores of 1 and 99, many groups with long names, big self/rater gaps).
- The sample's self scores, averages and raw scores are the ones printed in the 2010 sample, so every score lands in a band that report has wording for. Names and per-group scores are made up.

## Open items

1. **Missing wording (needs LPL):** the 2010 sample shows one band per scale, so 40 of 60 interpretation texts are missing, and development suggestions exist only for Empathy (low), Emotion Expression (low) and Self-Motivation (high).
2. Petros has not compared the pages with Figma yet.
3. Cover: done 2026-11-14 from Petros's template (`brief/cover-template-2026-11.pdf`). Its title lines ("TEIQue / 360 Report / Full Form") are still to be confirmed by him.
4. Anonymity rule (minimum group size) and whether rater names appear: undecided. The sample shows all groups and names, as the 2010 report does.
5. The wheel's scale (see decision 8).
6. The dashboard's real app shell and stack are unknown; `web.html` has a stand-in.
7. Short form (TEIQue-360-S), other languages, the Corporate sample PDF, a fillable action plan: not handled.
8. The options page still marks option F as "Recommended" for charts 1 and 2; the report uses D, as Petros chose.

## Not in this repo

- The two sample PDFs Petros attached at the start (`Sample TEIQue 360° report (2010).pdf` and `TEIQue-FF Personal_Counselling Report [SAMPLE].pdf`). The 2010 one is represented by `reference/2010-sample-pages/`; the 2025 one only supplied the scale definitions, already in the library.
- The other built PDFs and the page-image test folders in `out/` (regenerate with `tools/build-pdf.js`; `.gitignore` keeps them out of git).
- The fonts in `fonts/` are Inter and Manrope (SIL Open Font License), included.
- The full conversation transcript is a separate file, exported to `Downloads/session-export-1794648352539.zip` (121 MB, mostly screenshots).

## Working with Petros

- Short messages, often with typos; acts quickly on recommendations; likes to see options side by side and pick.
- Wants to review in the page viewer (`report.html`), not in long explanations.
- Report wording is LPL's psychometric content: never invent it.
