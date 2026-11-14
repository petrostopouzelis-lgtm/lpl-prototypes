# TEIQue 360: Figma findings (2026-11-10)

Source: Figma file `OABrZx0GBrroCvGFQfj89Z`, page "TEIQue + TSIQue" (238:314). Screenshots are in `figma-refs/`.
The file has no 360 frames. The closest models are the Personal, Developmental and Recruitment variants.

## Frames
| Node | What it is |
|---|---|
| 238:323 / 261:1154 | Cover / back cover |
| 238:315 | Contents |
| 238:1379, 238:1481, 238:1515 | Intro, 15-4-1 structure, uses |
| 238:1605 | Wheel page |
| 238:1622 (+ 900:1667) | Summary bar graph page (and the bar graph component) |
| 238:1542 | Global score page |
| 238:1578 | Factor page (Well-Being) |
| 442:695 to 442:837 | Developmental: factor + facet pages with headed suggestion cards |
| 273:1469 (+ 273:1517) | Recruitment: one factor and all its facets on one page, a small gauge per row |
| 249:19485 | Score wheel (petals) |
| 505:754 | Updated score gauge, 7 colour versions |
| 261:931 | Older score gauge |

## Page layout
- A4 at 595×842 pt. 40 px side padding, 40 px gap between blocks.
- Header: 62 px tall, white, shadow `0 0 15.5px rgba(0,0,0,.10)`. Left: product name; centre: logo, 67 px wide; right: date over candidate name.
- Footer: "page" in Inter Thin 11, page number in Inter Light 11 in the accent colour; "© K. V. Petrides 2025. All rights reserved." in Inter Light 10, `#B7B6B7`.
- Text card: white, 15 px padding, 15 px radius, shadow `0 0 10px rgba(0,0,0,.15)`. Chart shadow variable `ds` = `0 0 20px #00000026`.
- **No watermark in Figma.** The watermark is a generator setting only.

## Text styles
| Role | Font | Size / line height | Colour |
|---|---|---|---|
| Header product name | Inter Medium | 18 | `#42A2DA`, with "ue" in `#E47C2D` |
| Header date / name | Inter Light | 12 | black |
| Page title | **Manrope Medium** | 26 | factor colour |
| Lead line | Inter Medium | 12 / 14.5, justified | factor colour |
| Body | **Inter Light (300)** | 12 / 14.5, justified | black |
| Sub-heading ("Your Score") | Inter Medium | 14 | factor colour |
| Dev. card heading | Inter, all caps | about 12 | factor colour |
| Summary chart labels | Manrope Bold (factors) / Regular (facets) | 12 | factor colour |
| Summary axis | Manrope Regular | 10 (bands), 8 (ticks, `#808080`) | |

The 2025 PDF sample uses Inter Thin/ExtraLight for body text and Poppins for labels. Figma uses Inter Light and Manrope. The generator is off, not the design.

## Colours (fill gradient dark → light; text colour)
| Group | Fill | Light | Text |
|---|---|---|---|
| Global | `#EC1C24` | `#F26065` | `#EC1C24` |
| Well-being | `#F3792A` | `#EBA97C` | `#E47C2D` |
| Self-control | `#EBBB3D` | `#F1CF77` | `#EBBB3D` |
| Emotionality | `#3AA756` | `#75C188` | `#3AA756` |
| Sociability | `#7569A1` | `#9E96BD` | `#7569A1` |
| Independent | `#B271A4` | `#C99BBF` | `#B271A4` |
| Brand blue | `#42A2DA` | | |

## Charts
**Score gauge (505:754)**
- Fills clockwise from 12 o'clock, with a light-to-dark gradient.
- Thin white dividers at 30 % and 70 % of the ring split it into the three bands.
- "Low" labels the 0–30 sector (upper right), "Average" the bottom sector, "High" the 70–100 sector (upper left).
- So **High on the left is intended.** The new version adds the band dividers; the 2025 PDF uses the older gauge without them.
- On the pages, the gauge is a 155×155 PNG, not live vector.

**Summary bars (900:1667)**
- Three separate white tracks per row (5 px gap, inset shadow `0 0 5.2px rgba(0,0,0,.25)`). Factor rows 15 px tall, facet rows 10 px.
- The fill runs across the tracks, so a bar that crosses a boundary appearing in pieces **is the design**, not a bug.
- The three tracks are **equal widths**, while the bands span 1–30, 31–70 and 71–99.
- **Decided 2026-11-10 (Petros): keep equal thirds.** Each band fills its own track in proportion: Low = (score − 1) / 29, Average = (score − 30) / 40, High = (score − 70) / 29, each clamped to 0–1. Earlier tracks are full. Use the same mapping wherever a 360 chart sits on the band tracks (the rater strip and the you-vs-others summary), so every chart reads the same way.
- Minor inconsistency: Self-Control is ExtraBold with Medium facets; the other factors are Bold with Regular facets.

**Wheel (249:19485): the 3-tier wheel**
- **Decided 2026-11-10 (Petros): any wheel in the 360 is this 3-tier wheel.**
- Petals rounded at the outer end, grown from a hub circle, with the % rotated at the petal base.
- **Correction (same day):** my first ring measurements ignored a scaled group and were wrong. Measured from the full-size render, the radii as drawn are: hub 157, grid rings at 361 / 578 / 822, facet-label ring 1074 to 1280, factor ring 1280 to 1471. The three inner rings sit at roughly a quarter, a half and three-quarters of the petal zone. They are a plain grid, **not** Low / Average / High bands.
- What the chart code does (`teique-360/src/charts/radial.js`): keeps the Figma structure (hub, petal zone, label ring, factor ring) and uses a **linear 0–100 radial scale with dashed rings at 30 and 70**, so the rings mark the band edges the same way the gauge's dividers do. This replaces the "equal thirds on the wheel" idea above. Open for Petros to confirm.
- The petal lengths in the Figma frame are placeholder data and don't follow any scale.
- Long facet names wrap onto two lines ("Emotion / Regulation"), which fixes the clipping.
- Outer factor ring has a gradient band with white labels.

## What this means for the 360
- **Factor pages:** the Recruitment layout (one factor and its facets, each row with a gauge and text) fits the 360 well. It fills the page and leaves room for a rater strip on each row.
- **Development suggestions:** reuse the Developmental pattern: the factor's gauge, an intro paragraph, then cards with all-caps orange headings.
- **Header:** "TEIQue 360" in the same style.
- **Fix before reuse:** contents list numbers "5." twice. The Recruitment text uses 7 levels (very low … very high), unlike the 3 bands used elsewhere. Confirm which the 360 should use.
