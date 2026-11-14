# Wording audit against the 2010 TEIQue 360 sample report

Done 2026-11-14 on the sample report (`data/sample-360.json`, one score per page, extras on).
Re-run it any time: `node tools/audit-text.js`.

## How it was checked

1. **By script, both ways.** Every piece of text the generated report prints was looked up, word for word, in the 2010 report's text (`reference/2010-sample-pages/extracted-text.txt`); then every line of the 2010 text was looked up in the generated report. Case, line breaks and curly quotes are ignored; nothing else is.
2. **By eye.** The 2010 page images were compared with the new pages for anything that sits inside a picture and so is not in the extracted text (cover, the factor diagram, the charts, the coach table).

## Result

- **All running text is the 2010 wording, word for word**: the introduction pages, the 20 interpretation texts, the Low/High Scorers boxes, the ten development suggestions, the action plan headings, the acknowledgement and the coach data labels. The 2010 typos are kept too ("recommedations", "understand , process").
- **Nothing from the 2010 text is missing**, apart from the items in "Differences" below. None of them is body text.
- **What the new report adds** is listed under "Additions". What is wholly new carries a small blue "+ Added" tag on the page.

## Additions (not in the 2010 report)

Only content and visuals that are wholly new carry the "+ Added" tag. A 2010 chart that was redrawn is not tagged, even where it now shows more (Petros, 2026-11-14).

**New, tagged on the page**

| Where | What | Tag |
|---|---|---|
| Summary Graph, Perception Map, Where the Views Differ | Three whole pages: titles, captions, charts and chart labels. The wording is Claude's draft (`extras` in the library) | "Added page" |
| Rater Groups | The response cards above the rater list ("9 of 9 raters responded", one card per group) | "Added chart" |
| Every factor and facet page | The score wheel (the 2010 report has only the rater-group chart there) | "Added chart" |

**Existing in 2010, redrawn; not tagged**

| Where | What the redrawn chart shows on top of the 2010 one |
|---|---|
| Global score page | The 2010 chart is one bar for the raters' average. The wheel also shows the person's own score |
| Profile page (petal chart) | The two Global scores in the centre (the 2010 wheel has a logo there); each facet's two scores as numbers |
| Rater-group chart on every factor and facet page | The "All others" average marker, the pale bar from the lowest to the highest group, and the exact score beside each group name (the 2010 chart shows positions only) |

**New wording, not tagged**

| Where | What |
|---|---|
| Cover | "A product of London Psychometric Laboratory Ltd." (from the current LPL reports); the form line "Full Form" (from the cover template) |
| Every page | Footer "© K. V. Petrides 2026. All rights reserved." (from the current LPL reports) |
| Where wording is missing | The yellow "Text needed" marker and grey filler, which mark themselves. Not in the sample: its scores all fall in bands the 2010 report has wording for |

The cover line and the footer are not tagged because a tag on the cover and on every footer would be noise; they are wording to confirm with LPL.

Switch the tags off for a finished report: untick "Mark additions" in the page viewer, `marks=0` in its address, or `--no-marks` for `tools/build-pdf.js`. The web view never shows them.

## Differences from the 2010 report

| 2010 report | New report | Why |
|---|---|---|
| Cover: "Multi Rater (360) Report", "SAMPLE REPORT", the date, APS logo and strapline | "TEIQue / 360 Report / Full Form", the person's name and the date, Psychometric Laboratory logo. "Sample" is the optional watermark | cover template (2026-11) |
| Footer "© Copyright 2010 - APS & K.V. Petrides", "Page 5 / 22" | "© K. V. Petrides 2026. All rights reserved.", "page 5" (no total) | current LPL reports |
| "Emotional Management / Perception / Expression / Regulation" | "Emotion Management / Perception / Expression / Regulation" | scale names follow the Figma file |
| "Auxiliary Facets" | "Independent Facets" | Figma |
| "Self Motivation", "Self Control", "Well Being", "Self-esteem" | "Self-Motivation", "Self-Control", "Well-Being", "Self-Esteem" | Figma |
| The wheel labels Impulse Control as "Low Impulsiveness" | "Impulse Control" | Figma |
| Factor order: Well-Being, Sociability, Emotionality, Self Control, Auxiliary (Self Motivation, then Adaptability) | Well-Being, Self-Control, Emotionality, Sociability, Independent (Adaptability, then Self-Motivation) | Figma |
| Rater-group charts: letters B, O, D, P, Y on a 0 to 100 axis, with the key "Y=You, B=Boss (1), O=Other Superiors (2), …" under each page | Group names and scores written on the chart, on Low / Average / High tracks. No numbered axis, and the group sizes are not repeated under each chart (they are on the Rater Groups page) | new chart design |
| Each factor's charts on one page, its texts on the facing page | One page per factor and per facet, chart and text together | new layout |
| Coach data: "Participant ID:", "Norm:", "Administration date:" | Same labels without the colon, as small headings | styling |
| Rater names, participant id, dates | Made-up sample values | sample data |

## Changed during the audit, to match the 2010 wording

- Profile legend: "Others' average" is now "Average rating across all coworkers (9)", as in the 2010 report.
- Coach data: the first column heading "Scale" is gone; the 2010 table has none.

## Not covered

- The other 40 interpretation texts and most development suggestions: the 2010 sample does not contain them, so there is nothing to check them against.
- The audit reads the sample report. Other data files print the same wording wherever a text exists, and the "Text needed" marker where it does not.
