# Continue here

**Where it stopped (2026-11-28):** the illustration generator works for TEIQue, TSIQue and Scan-In, individual and group. The user asked to focus on the illustration only for now: no logo, title or name bar.

**Files**

- `index.html`: controls, main preview, "How this one was made" panel, compare grid of 12 sample people
- `src/theories.js`: factors, facets, domains and their colours (TSIQue and Scan-In marked `proposed`)
- `src/cover.js`: the engine (`LPLCovers.renderIllustration`)
- `src/samples.js`: made-up sample people
- `brief/`: the reference artwork from the user (Illustrator file, rasterised cover)

**Engine in one paragraph:** a spine curve runs through a fixed "corridor" traced from the reference (bottom-left, steep middle, out through the top-right). Factor scores, relative to the person's mean, push control points sideways (alternating sides). Each ribbon has a half width (facet profile × global × widening toward the top) and a twist angle θ(t). Edges = centre ± (normal·cosθ + tangent·sinθ·tilt)·halfwidth. Drawn as overlapping quads with a gradient across the width (saturated edge to pale translucent edge, front and back faces differ), then blurred and grained. Groups and "every factor" mode are one sheet split into lanes.

**Next**

1. Get the user's feedback on the look and on the two colour modes.
2. Confirm TSIQue and Scan-In colours.
3. Add the cover layout from the reference (`brief/reference-cover.webp`).
