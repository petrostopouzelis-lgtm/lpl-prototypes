# TEIQue 360 report: handoff brief

Planning only so far. **Do not build anything until Petros says go.**

## Goal
1. A **PDF generator** that turns 360 score data into a finished A4 report: charts, layout, fonts and styling, matching the Figma designs as closely as possible.
2. The **same report as an interactive web page**, to plug into the account dashboards as the "View report" page (today that button only downloads the PDF).

The TEIQue 360 combines a person's own TEIQue scores with how other people (raters) scored them. There is **no Figma design for the 360 report yet**. The charts need to be designed together, starting from the old 360 report's content and drawn in the current report style.

## Source material
- **Old 360 report (2010)**: `Sample TEIQue 360° report 2010.pdf`. Use it for **content only, not design**. It contains:
  - Intro and the 15 facets / 4 factors
  - Rater roster
  - Global score bar
  - Wheel comparing self with others
  - Strip charts per factor and facet, with a letter per rater group (Y = you, B = boss, O = other superiors, D = direct reports, P = peers)
  - Interpretation text, plus low/high scorer descriptions
  - Development suggestions for selected facets
  - Action plan
  - Coach data table
- **Current report style**: `TEIQue-FF_Corporate_Report_SAMPLE.pdf` (28 pages). Its page pattern:
  - Cover, contents, intro, the 15-4-1 structure, the wheel, a summary bar chart
  - One page per score: title, coloured lead line, definition, circular score gauge, and a white card with the interpretation text
  - Back cover
- **Figma (intended design)**: file `OABrZx0GBrroCvGFQfj89Z` "LPL - Reports".
  - Frames (node ids): 238-323, 238-315, 238-1379, 238-1481, 238-1515, 238-1605, 238-1622, 238-1542, 238-1578, 273-1469, 261-1154, 442-695, 442-750, 442-806, 442-837, 249-19485, 261-931, 252-179, 496-1591, 273-1517
  - **Latest score wheel: 505-754**
  - Link format: `https://www.figma.com/design/OABrZx0GBrroCvGFQfj89Z/LPL---Reports?node-id=<id>`
- **Existing chart tools**, which draw one chart from hand-entered values and save it as a PNG:
  - `C:\Users\petro\Desktop\L.P.L\Design\web\cursor\003_INTERNAL TOOLS\teique\`
  - `teique results graph.html` draws the circular score gauge (titled "TEIQue Results Wheel").
  - `pedal results chart.html` draws the wheel petals.
  - Reuse their geometry and gradients. Replace the manual PNG step with charts drawn directly from the score data.
- **Design system**: "Psychometric Laboratory Design System" (claude.ai artifact 3961e6b2-fc74-4b0e-9062-f9c5d83b9fa4).
  - Fonts: Manrope for titles, Inter for body text.
  - One standard card shadow; 16px corner radius.
  - Includes the app-shell components (sidebar, topbar, panels) for the web view.
  - A second copy exists (85yioxQ7dp8u4qtEHgkB6s). Confirm which copy is current.

## Known facts
- **Score bands**: 1–30 low, 31–70 average, 71–100 high. Scores are percentiles against norms.
- **Factor colours**: Global red, Well-being orange, Self-control yellow, Emotionality green, Sociability purple, independent facets (Adaptability, Self-motivation) pink/magenta.
- **Structure**: Global trait EI, 4 factors, 15 facets. The 2 independent facets count towards the Global score but belong to no factor.

## Problems in the current output to fix
- Wheel labels are cut off ("motion Managemen") or run into each other (Self-Control / Impulse Control).
- On the summary chart, a bar that crosses a band boundary splits into two disconnected pieces.
- Watermarks sit on top of body text and the page number.
- Body text is very light with wide letter spacing, which prints poorly.
- Factor and facet pages leave about 40% of the page empty.
- On the gauge, "High" is on the left and "Low" on the right. Check this against Figma.

## Proposed approach
- **Data**: one data file per report, plus a separate text library keyed by score, band and audience.
- **Charts**: one set of vector (SVG) chart components, shared by the PDF and the web page.
- **PDF**: HTML laid out on A4 pages, printed to PDF with headless Chromium (Playwright). Fonts are embedded, text flows across pages, and there is a running header/footer with correct page numbers. The sample watermark is a setting.
- **Web**: the same sections in a responsive layout inside the app shell. Hovering shows exact values, rater groups can be switched on and off, and there's a download-PDF button.

## 360 chart ideas (show 2–3 options for each before building)
1. **360 wheel**: a filled petal for the others' average, with a thin arc marking the self score. Or two narrow petals side by side.
2. **Two-ring gauge**: outer ring for self, inner ring for others, both values in the centre.
3. **Rater-group strip**: a low/average/high pill track with one labelled marker per group, and a bar spanning the lowest to highest group to show how much they agree. Replaces the old B/O/D/P letters.
4. **Summary, you vs others**: two bars per row, or a dot for each joined by a line.
5. **Gap chart**: others minus self for each facet, sorted, split into "others see more" and "you see more".
6. **Perception map**: a 2×2 grid, self score across and others score up, one dot per facet. Quarters: strengths, hidden strengths, blind spots, development areas.
7. **Raters overview**: who responded, how many, and response rate.

## Proposed page order
1. Cover (360 version)
2. Contents
3. Introduction to the 360
4. TEIQue structure and how to read your scores
5. Your raters
6. 360 wheel
7. Summary, you vs others
8. Perception map, with top strengths and blind spots
9. Gap chart
10. Global score page
11. Factor and facet pages: two-ring gauge, rater strip, definition and interpretation text
12. Development suggestions
13. Action plan
14. Coach data table
15. Back cover

## Still needed from Petros
1. Figma: frame details, text styles (font, size, weight, letter spacing, colour) and graphics (cover illustration, watermark pattern, header mark, back-page icons).
2. A sample 360 data export with names removed:
   - Does it hold each rater's scores, or only group averages?
   - What is the smallest group size before groups are merged to keep raters anonymous?
3. Text rules:
   - Is the interpretation paragraph based on the self score, the others' average, or both? Proposal: base it on the others' average and add a generated sentence comparing it with self. LPL needs to sign off those sentences.
   - Which facets get development suggestions?
4. Dashboard stack: React or plain HTML/JS, how the page receives report data, and whether PDFs are made on a server or in the browser.
5. Open decisions: support both forms (TEIQue-360 and TEIQue-360-S)? Other languages? A fillable action plan? Footer and copyright wording?

## Steps (after approval)
1. Data format, sample data and text library.
2. Chart options on a canvas; Petros picks one per chart.
3. Chart components, checked against the sample data.
4. A4 page templates matched to Figma.
5. PDF generator, tested with long text and edge cases: 1 rater, missing groups, scores of 1 and 99.
6. Web view in the app shell.
7. Integration notes for the dashboard team.
