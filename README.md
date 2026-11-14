# LPL prototypes

Design prototypes for London Psychometric Laboratory (LPL): report layouts, charts, PDF generators, dashboard pages and other product experiments.

This repo is worked on together with Claude. Each project lives in its own folder and carries enough notes that a new session, or a new person, can pick it up without the earlier conversation.

> Keep this repository **private**. It contains unreleased product work, brand assets and links to LPL's Figma files.

## Design system

**`design-system/`** holds the **Psychometric Laboratory Design System**, the single design system for every LPL and TEIQue surface (psychometriclab.com, teique.com and the logged-in coach, business, manager and learn platforms). Every project in this repo builds on it.

| Start here | What |
|---|---|
| [`design-system/README.md`](design-system/README.md) | The brand book: voice, visual foundations, iconography, fonts, components, caveats |
| [`design-system/tokens.json`](design-system/tokens.json) | All tokens: colours, type, spacing, radius, shadows. Source of truth |
| [`design-system/tokens.css`](design-system/tokens.css) | The same tokens as CSS custom properties: link it instead of copying values |
| [`design-system/components/`](design-system/components/) | Each component's guidelines (`README.md`), props (`.d.ts`) and React source (`src/`) |
| [`design-system/assets/`](design-system/assets/) | Logos, icons, illustrations, report covers and other brand images, as files |
| [`design-system/EXPORT-NOTES.md`](design-system/EXPORT-NOTES.md) | How this copy was exported and what to watch for |

The live version is kept in Claude Design on claude.ai. This folder is an export of it (2026-11-14); re-export when the design system changes there.

## Projects

| Folder | What | Status |
|---|---|---|
| `teique-360/` | TEIQue 360 report: PDF generator and the matching web "View report" page | First version of every step done; waiting on missing report wording from LPL |

Add a row for every new project.

## Layout

```
README.md              this file
CLAUDE.md              optional: standing instructions for Claude (can repeat "Working with Claude" below)
design-system/         the Psychometric Laboratory Design System (tokens, components, brand assets)
_shared/               other material used by more than one project (briefs, source documents, fonts)
<project>/
  README.md            what it is, how to run it, status, decisions, open items
  CONTINUE-HERE.md     handoff note: where the work stopped and what comes next
  ...                  the project's own files
```

## Starting a new project

1. Make a folder with a short lowercase name, for example `tsique-report/`.
2. Add a `README.md` with these sections: **What it is**, **How to run it**, **Status**, **Decisions**, **Open items**.
3. Put the brief, Figma links and any source documents the project depends on in the project folder (or `_shared/` if several projects use them). Don't commit real participant data.
4. Add a row to the table above.
5. At the end of each working session, update `CONTINUE-HERE.md` so the next session can start from it.

## Working with Claude

Standing rules for every project in this repo:

- **Report wording belongs to LPL.** Never write new report copy (introductions, interpretations, captions, suggestions). Copy wording word for word from the source report you're given, and where text is missing show a visible "Text needed" marker. If draft wording is unavoidable, keep it switched off by default and label it clearly as a draft.
- **Build on the design system.** Read `design-system/README.md` before designing anything. Use its tokens (link `design-system/tokens.css` or read `tokens.json`), its components and its assets; never retype a colour, approximate a logo or invent a new style when the design system has one. If something is missing from it, say so and keep the addition clearly separate.
- **Show options, then build.** For charts and visual choices, put two to four options side by side on one page so they can be compared and picked, then build only the picked one.
- **Match the Figma file.** Take sizes, colours, fonts and gradients from Figma, not from memory or old PDFs. Say plainly where the build differs from Figma.
- **Keep it simple to run.** Prefer plain HTML, CSS and JavaScript that open by double-click or from a simple local server. No build step and no npm packages unless a project needs them.
- **Use sample data only.** Made-up names and scores; real reports never go in the repo.
- **Check before saying it's done.** Render pages or screenshots and look at them; test the awkward cases (one rater, missing groups, scores of 1 and 99, long names, long text).
- **Commit and push only when asked.** Work on a branch, not directly on `main`.
- **Keep the notes current.** Update the project's `README.md` and `CONTINUE-HERE.md` whenever a decision is made.

## Report style reference

For everything else, the design system is the reference. Assessment reports (the A4 PDFs) follow their own Figma file, **LPL - Reports** (file key `OABrZx0GBrroCvGFQfj89Z`), summarised here. The facet colours match the design system's `color-facet-*` tokens. One difference: reports use `#42A2DA` as their blue, while the design system's primary blue is `#259DD5`.

**Type**

| Role | Font |
|---|---|
| Page titles, chart labels | Manrope (Medium for titles) |
| Body text | Inter Light, 12/14.5 pt, justified |
| Sub-headings | Inter Medium 14 pt |

Both fonts are free (SIL Open Font License), and are the same two families the design system uses.

**Colours** (fill / light / text)

| Group | Fill | Light | Text |
|---|---|---|---|
| Global | `#EC1C24` | `#F26065` | `#EC1C24` |
| Well-Being | `#F3792A` | `#EBA97C` | `#E47C2D` |
| Self-Control | `#EBBB3D` | `#F1CF77` | `#EBBB3D` |
| Emotionality | `#3AA756` | `#75C188` | `#3AA756` |
| Sociability | `#7569A1` | `#9E96BD` | `#7569A1` |
| Independent facets | `#B271A4` | `#C99BBF` | `#B271A4` |
| Brand blue | `#42A2DA` | | |
| Product accent ("ue" in TEIQue) | `#E47C2D` | | |

**Style**

- Solid shapes with gradients, white surfaces and soft shadows. No black outlines or dark marks on charts.
- Bars and dots run from the fill colour (top) to the light colour (bottom).
- Tracks are white pills with a soft inner shadow.
- Cards: white, 15 pt corner radius, 15 pt padding, shadow `0 0 10px rgba(0,0,0,.15)`.
- Reports are A4, which is 595 × 842 in Figma units (points), so Figma numbers can be used as-is.

## Tools

- Node 22 or newer, and Chrome or Edge, for the PDF generators.
- Python, only to run a local preview server: `py -m http.server <port>` inside a project folder.
