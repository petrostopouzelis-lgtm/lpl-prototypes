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
  people: [{ facets: { Happiness: 70, Optimism: 66, /* … every facet */ } }] }
```

Only facet scores are inputs: each factor score is the mean of its facets and the global score the mean of all facets (a given factor score is used only if all its facets are missing). Scan-In people carry `belief` and `importance` maps keyed by domain instead. A group report has one entry in `people` per member.

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
| `contours` | A radial chart drawn as blend steps. Each facet (Scan-In: life domain) has a fixed spoke, grouped by factor, clockwise from the top; radius = 22% + 78% × score. Lines morph from a small core to an inner outline, then to the outer outline. TEIQue/TSIQue: inner = factor level (each spoke at its factor's score, so factors read as broad lobes), outer = facet level (every facet its own bump). Scan-In: inner = importance, outer = belief. Around the circle each line takes its facet's factor colour (Scan-In: each domain's own colour), inner lines paler and turned more for a higher global score. Groups: the shape uses the team's averages; around it, each member is a thin ring on top of the shape: a flat band (about 2–4pt wide) with a sharp edge, in the facet colours at full strength, each with its own light drop shadow so rings separate from the shape and each other. A ring follows the team outline pushed out by a gap and bulges or dips where that member is above or below the team on each facet; rings nest outwards from lowest to highest global score, and count towards the fitted size. `opts.guide` overlays spokes, labels and score dots for checking. |

**Contour style** (`opts.contourStyle`): `filled` (default) stacks the blend steps as solid layers, outermost first, and softens them into one organic shape. The core is LPL blue (`#259DD5`), fading outwards into the score colours, to symbolise the scores coming from the lab; colours are mixed in OKLab so the fades stay clean. `opts.blueCore` (0..1, default 0.5) sets how far the blue reaches; `opts.lines` adds a faint white line texture. Softness blurs the colours inside only; the result is cut back to the sharp silhouette so the edge stays crisp. `opts.shading` (default 0.6) adds 3D relief: every step leaves a faint line on a density map, so it darkens where lines bunch together. That becomes a neutral grey relief map (mid grey = no change, with an offset highlight and shadow lit from the top left), blended in soft-light so hue and saturation survive, plus a lighter overlay pass of the same map for richer colour. On top, a coloured shadow (a darker, more saturated copy of the shape's own colours) shows where the lines bunch and falls a little down-right, so the shadows read darker and wider without turning grey. The whole shape has a light drop shadow. `opts.vibrance` (default 0.5) boosts colour saturation in OKLab; pastel defaults to 0. **Saved preset:** `LPLCovers.CONTOUR_PRESET` (in `src/radial.js`) holds the finish saved in the viewer on 2026-11-28 and is the default for contours: softness 0.70, pastel 0.86, vibrance 0.52, grain 0.33, shading 0.60, blue core 0.50, line texture 0.66, detail 0.53. Anything passed in `opts` overrides it. The viewer's Save settings button stores its sliders in the page's db (`settings/finish`). **Diagram overlay** (`opts.diagram`, on in the viewer): the shape is treated like a specimen photo with a technical drawing on top, in one ink (`opts.diagramInk`, default `#1d2b3a`), hairlines and 5–6pt type: registration corners on the shape's box, a dial of ticks (one per facet, longer at factor boundaries), a centre crosshair with its coordinates, callouts `F.01…` (Scan-In `D.01…`) from fixed points on the outline with their angle, a score-to-radius scale bar, and a plate block (figure number, theory, structure, report type, a reference code from the seed). **It shows no results:** markers sit at fixed places, never at high or low scores, and no score is printed. **Placement:** the contour shape is always centred on the page and scaled so its bounding box's longer side is `opts.fit` × page width (default 0.64), whatever the scores; `opts.centreY` (default 0.5) moves it vertically. For groups the rings are included, so the whole group fits. `lines` draws the steps as thin lines instead.

**Colours, option "Every factor"** (individual TEIQue and TSIQue): one lane per factor, each in its factor colour, lane width set by the factor score. More colourful; shown as an alternative to the two-colour default.

**Finish:** softness (blur and feathering, like the rasterised reference), pastel (lifts the colours toward white) and grain (fine noise on the shape only). Variation picks another seeded variant of the same data.

## Status

First working version of the illustration step. Renders all three theories, individual and group (2 to 20 members), with a 300 dpi PNG export. Checked visually across flat, uneven, high and low profiles and groups of 3, 8 and 20.

## Decisions

- **Colours come from the design system's factor palette** (`color-facet-*` tokens, mapped as in the "LPL - Reports" Figma file). TEIQue: Well-Being orange, Self-Control yellow, Emotionality green, Sociability purple, independent facets magenta, global red.
- **Scan-In has 17 life domains, each with its own colour**, taken from the "results graph" frame (node 648:1440) of the LPL - Reports Figma file. The values were sampled from its render; check them against the file's fills if exact values matter.
- **TSIQue colours are proposals.** The design system defines factor colours only for TEIQue. Proposed: Social cognizing purple, Social acting orange, Social relating green. The ribbon shape's two Scan-In colours (belief blue, importance orange) are also a proposal. All in `src/theories.js`.
- Twisting is modelled as a real ribbon turning in space (seen slightly from above), so folds read as creases rather than pinch points.
- Rendered on a canvas, not SVG, because the soft blended finish and grain need raster effects.
- No titles or logo yet, by request.

## Open items

- Confirm TSIQue colour mappings, or add them to the design system. Confirm the sampled Scan-In domain hex values against Figma.
- Confirm the TSIQue facet list per factor (taken from the sample report; Social acting is the least certain).
- Pick between "Top two factors" and "Every factor" colouring for individual reports.
- Then: add the cover layout (logo, title, name and date bar) over the illustration, matching the reference cover.
- Decide how report generators will call it (in the browser as now, or a headless build script like `teique-360/tools/build-pdf.js`).
