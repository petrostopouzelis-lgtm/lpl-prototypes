---
name: teique-360-report-project
description: "TEIQue 360 report project (PDF generator + web \"View report\" page) — where everything lives, decisions made, and current state"
metadata:
  node_type: memory
  type: project
  originSessionId: bf757c21-4b56-40ad-96b8-adb7b7276cf3
  modified: 2026-11-11T12:32:35.127Z
---

TEIQue 360 report: a PDF generator and a matching web report page built from 360 score data. Planning started 2026-11-10; Petros said "execute" the same day.

- Project code: `cursor/003_INTERNAL TOOLS/teique/teique-360/` (README has status, commands and layout; INTEGRATION.md is for the dashboard team). Preview server config `teique-360` (port 4360) is in `Design/web/.claude/launch.json`.
- Brief and Figma findings: `cursor/003_INTERNAL TOOLS/teique/Claude outputs/`.
- Figma file `OABrZx0GBrroCvGFQfj89Z`, page "TEIQue + TSIQue"; wheel 249:19485, gauge 505:754, bar graph 900:1667.

Decisions by Petros: summary bars keep equal-width band tracks; the wheel is "the 3 tiered one" (taken to be 249:19485); **final chart picks (2026-11-11): 1D split petals, 2D two rings, 3A, 4C, 5A, 6A, 7A, with "You" in the deeper shade of each factor colour** (round 1 picks 1B/2B are superseded). On 2026-11-11: interpretation and development text follows the person's own score, not the raters' average; and the report must contain **only the old (2010) TEIQue 360 report's contents, nothing else** — see [[no-invented-report-content]].

Later on 2026-11-11 he asked for the summary graph, perception map and gap chart back (on by default now; `--no-extras` removes them), and said the you-vs-others styling in the petal chart and score wheel lacked visual separation and brand fit. Round 2 options are in `chart-options.html`: petal chart D split / E core / F score chip / G profile line, score wheel D two rings / E core / F chip, plus a "You" colour treatment. He rejected grey ("random gray, doesn't match the vibe") and asked for a variation of the same facet colours: now deeper shade (default), white with a colour edge, or brand blue. He picked the **deeper shade** (decided 2026-11-11). He then confirmed style D for both ("Apply 1D and 2D"); these are the defaults in `src/charts/radial.js` and the PDFs are rebuilt with them. He also asked for no black line in the gap, summary and strip charts and for correct Figma gradients everywhere: done — you is a deeper-shade dot (strip, summary), gap bars wear the colour of whoever scored higher, bars/dots use top-to-bottom fill→light gradients, tracks are white with an inner shadow. Pages load scripts with `?v=` cache-busting because stale cached JS once left the options page blank ("frozen").

State at 2026-11-11: pages and wording follow the 2010 sample report (30-page sample PDF). `report.html` is the page viewer he asked for (page by page / all pages, data-file switcher). Text follows the person's own score, as the 2010 report appears to. The library has only the 2010 sample's one band per scale (20 of 60 interpretation texts).

**Why:** Petros reviews in the viewer; he objected to copy I had written myself (an introduction).
**How to apply:** Next work depends on his review. Still open: the missing 40 interpretation texts and most development text, wheel scale, anonymity rule and rater names, the dashboard stack and real app shell, a 360 cover, the Corporate sample PDF, short form and languages.
