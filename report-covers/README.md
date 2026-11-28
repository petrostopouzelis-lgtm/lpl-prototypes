# Report cover illustrations

## What it is

A generator for the abstract artwork on the new psychometric report covers. It replaces the old illustrated covers (chess board, scales and so on) with one minimal, flowing ribbon shape that is drawn from the report's own scores, so every report gets its own cover.

The look follows the reference artwork made in Illustrator (`brief/`): blended ribbons running from the bottom-left of an A4 portrait page to the top-right, soft and lightly grained.

**This step covers only the illustration.** The logo, titles, name and date bar are left out until the illustration workflow is settled.

## How to run it

Open `index.html` in Chrome or Edge, either by double-clicking it or from a local server at the repo root:

```bash
py -m http.server 8000
```

Then go to `http://localhost:8000/report-covers/`.

- Pick the theory (TEIQue, TSIQue or Scan-In) and the report type (individual or group).
- Move the score sliders to see how the shape responds. **New sample person** makes up another profile.
- The **Compare** grid shows twelve made-up people with the same settings, to judge range and balance.
- **Download PNG (300 dpi)** saves the illustration at 2480 × 3508 px with a transparent background.

**Quick viewer:** `viewer/viewer.html` is the same generator as one self-contained page (engine pasted in), for sharing or publishing. Edit `viewer/viewer.src.html` and run `python report-covers/viewer/build.py` to rebuild it after changing `src/`.

From code:

```js
LPLCovers.renderIllustration(canvas, data, { scale: 300 / 72, softness: 0.7, grain: 0.2, pastel: 0.4, colorMode: 'pair' });
```

`data` looks like this (scores are percentiles, 1 to 99):

```js
{ theory: 'teique', type: 'individual', name: 'Jane Doe', date: '22/10/2026',
  people: [{ factors: { wellbeing: 72, self_control: 48, emotionality: 81, sociability: 55 },
             facets: { Happiness: 70, Optimism: 66, /* … */ }, global: 64 }] }
```

Scan-In people carry `belief` and `importance` maps keyed by domain instead of `factors` and `facets`. A group report has one entry in `people` per member.

## How scores become a shape

| Input | What it changes |
|---|---|
| Factor (or Scan-In domain belief) scores | Bend the ribbon: one control point per factor, each taken relative to the person's own average. A flat profile gives a gentle curve; an uneven one gives strong S-bends. |
| Facet (or domain importance) scores | Swell and narrow the ribbon along its length, in facet order. |
| Global score | How many times the ribbon twists, and how wide it runs overall. |
| Two highest factors | The two colours: front ribbon and the ribbon behind it. |
| Individual report | One shape: a pair of ribbons, like the reference. |
| Group report | One sheet made of thin lanes, one per member, that twist together. Colours blend across the lanes from the team's top factor to its second. Each lane swells where its member scores high. |
| Name, date and scores | Seed small variations, so similar profiles still get different covers. The same data always gives the same picture. |

**Radial shapes** (`src/radial.js`, picked with `opts.shape`): a centred, contained blob drawn like a radial chart, after the radial charts at bklit.com. Facet scores (Scan-In: belief per domain) sit around a circle and push the outline outwards; a few Fourier harmonics smooth it into one organic shape (`opts.detail` sets how many). The outline's shape comes from how the scores differ from the person's own average; its size from the global score.

| Shape | What it looks like |
|---|---|
| `blob` | One filled shape, rim coloured by factor (or blended between the top two), pale core. Scan-In adds importance as an inner orange blob. |
| `petals` | One translucent lobe per factor, reaching out by its score. |
| `contours` | A radial chart of every facet, drawn as blend steps. Each facet has a fixed spoke, grouped by factor, clockwise from the top; the outline passes through each facet's score (radius = 30% + 70% × score), so every facet is its own bulge or dip. Around the circle each line takes its facet's factor colour, inner lines paler. Lines step from a small core to the outline, inner ones turned more for a higher global score. Scan-In: core to importance outline (orange) to belief outline (blue). Groups: blend to the team's average facets, with each member's outline traced lightly. `opts.guide` overlays spokes, labels and score dots for checking. |

**Colours, option "Every factor"** (individual TEIQue and TSIQue): one lane per factor, each in its factor colour, lane width set by the factor score. More colourful; shown as an alternative to the two-colour default.

**Finish:** softness (blur and feathering, like the rasterised reference), pastel (lifts the colours toward white) and grain (fine noise on the shape only). Variation picks another seeded variant of the same data.

## Status

First working version of the illustration step. Renders all three theories, individual and group (2 to 20 members), with a 300 dpi PNG export. Checked visually across flat, uneven, high and low profiles and groups of 3, 8 and 20.

## Decisions

- **Colours come from the design system's factor palette** (`color-facet-*` tokens, mapped as in the "LPL - Reports" Figma file). TEIQue: Well-Being orange, Self-Control yellow, Emotionality green, Sociability purple, independent facets magenta, global red.
- **TSIQue and Scan-In colours are proposals.** The design system defines factor colours only for TEIQue. Proposed: TSIQue Social cognizing purple, Social acting orange, Social relating green; Scan-In belief brand blue, importance brand orange. All in `src/theories.js`.
- Twisting is modelled as a real ribbon turning in space (seen slightly from above), so folds read as creases rather than pinch points.
- Rendered on a canvas, not SVG, because the soft blended finish and grain need raster effects.
- No titles or logo yet, by request.

## Open items

- Confirm TSIQue and Scan-In colour mappings, or add them to the design system.
- Confirm the TSIQue facet list per factor (taken from the sample report; Social acting is the least certain).
- Pick between "Top two factors" and "Every factor" colouring for individual reports.
- Then: add the cover layout (logo, title, name and date bar) over the illustration, matching the reference cover.
- Decide how report generators will call it (in the browser as now, or a headless build script like `teique-360/tools/build-pdf.js`).
