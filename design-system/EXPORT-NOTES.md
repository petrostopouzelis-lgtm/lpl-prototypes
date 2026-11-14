# Export notes

This folder is a copy of the **Psychometric Laboratory Design System** made in Claude Design (a Design System artifact on claude.ai), exported on 2026-11-14 from version `1794649298-8afe`.

**Start with `README.md`**: it is the brand book (voice, visual foundations, iconography, fonts, components, caveats).

## What's here

| Path | What |
|---|---|
| `README.md` | The brand book |
| `tokens.json` | All design tokens: colours, type, spacing, radius, shadows. Source of truth |
| `tokens.css` | The same tokens as CSS custom properties, ready to link |
| `components/` | One folder per component: `README.md` (guidelines), `.d.ts` (props), `preview.html` |
| `components/src/` | React source for each component |
| `components/bundle.js`, `bundle.css`, `lib/` | The built component bundle (React 18, global `PsychometricLaboratoryDesignSystem_0d727f`) |
| `guidelines/` | Small reference pages: colours, type, spacing, radius, shadows, logos, icons |
| `assets/` | Logos, icons, illustrations, report covers, hero images, case-study images, as files |
| `api/` | Generated quick-reference cards for each component and asset group |
| `design-system.json`, `manifest.json`, `docs/` | Claude Design's index and generated metadata |

## Changes made in the export

- Images and icons are stored on claude.ai in a separate asset store. They were downloaded and saved under `assets/<group>/<file name>`, using the names the design system gives them. All 127 arrived with the expected sizes.
- The design system has asset groups `Icons` and `icons`, and `Logos` and `logos`. Windows can't hold two folders that differ only by case, so each pair is merged into one lowercase folder (`assets/icons/`, `assets/logos/`). No file names clashed. Three text files that pointed at the capitalised folders were updated.
- Left out: the Design System type's own viewer (`index.html`, `artifact-type/`) and its authoring guide (`SKILL.md`). They belong to the claude.ai page type, not to LPL's design system.

## Good to know

- **Fonts:** Manrope and Inter load from Google Fonts. There are no font files here; the report projects carry their own copies.
- **Previews:** `components/*/preview.html` were written to run inside the claude.ai design-system page, which loads `tokens.css`, `bundle.css` and the bundle around them. Opened directly from this folder they show unstyled. Use `README.md`, `tokens.css` and `components/src/` when building.
- **Two blues:** the UI design system's primary blue is `#259DD5` (`color-primary-full`). The Figma report designs use `#42A2DA` for report headers and charts. The facet colours match in both.
- **The live version stays on claude.ai.** If the design system changes there, export it again to update this copy.
