# Continue here

**Where it stopped (2026-11-28):** the contour illustration is the chosen direction, with facet spokes and 3D spheres, and three magazine-style cover layouts (`masthead`, `bleed`, `poster`) are built for review. The viewer is published at https://claude.ai/artifact/G1ERB6wRVNkfsLBo8THYmt (rebuild with `python report-covers/viewer/build.py`, publish `viewer/viewer.html`).

**Files**

- `src/theories.js`: factors, facets, domains, colours (TSIQue proposed; Scan-In domain colours from Figma frame 648:1440)
- `src/cover.js`: data normalising, ribbon shape, shared finish
- `src/radial.js`: contours (blended, sharp silhouette, density shading, blue core), group rings, facet spokes and spheres, saved preset
- `src/layout.js`: cover typography and layouts
- `src/samples.js`: made-up people (facet scores only; factors and global are derived)
- `viewer/`: the published single-file viewer (`viewer.src.html` + `build.py`)

**Next**

1. User picks a cover layout (or a mix) and refines it.
2. Confirm TSIQue colours and the sampled Scan-In hex values.
3. Decide whether facet scores should appear on the cover (currently names only).
4. A headless export (PNG/PDF at 300 dpi) for the report generators.
