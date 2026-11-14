# Psychometric Laboratory Design System

Design system for **LPL** (the London Psychometric Laboratory) and its flagship assessment brand **TEIQue** (Trait Emotional Intelligence Questionnaire). These docs say "LPL"; product UI always spells out "Psychometric Laboratory" (as the platform sidebars do). Compiled from the org's own front-end codebase, design-system docs and Figma token exports — attached locally at `web/` (paths below are relative to that folder).

## Company & product context

The London Psychometric Laboratory is an academic research center at University College London directed by Professor K. V. Petrides, studying Trait Emotional Intelligence (Trait EI) and publishing the TEIQue family of psychometric assessments. Two public-facing surfaces exist side by side:

- **psychometriclab.com** — the Lab's academic site: research library, tools (scoring engine, certificate checker, instrument validation), member forum, support and account screens.
- **teique.com** — the TEIQue brand's public site and shop, plus a set of logged-in **platforms** behind it: the coach, managed-coach, business and manager accounts (administering, distributing and tracking assessments, managing candidates/groups/credits/billing) and the learn platform (accreditation courses, modules, quizzes). All of these share one app shell — a 256px floating sidebar rail, a sticky topbar, and the same component set.

**Every one of these surfaces consumes the same components** — the ones in `components/`, lifted from the shared styles folder (`008_STYLES`) and the `app.css` each platform ships. Nothing here is per-platform.

The teique.com public pages are being redesigned and are deliberately **not** recreated here (see Caveats).

**Everything runs on one design system** — the same tokens, type, buttons, cards and shadows across every surface, public and logged-in. There is no per-product variant.

## Sources

- `web/008_STYLES/restyling-guide/comprehensive-design-system-guidelines.md` — the canonical styling spec (colors, type, spacing, buttons, cards, forms, tables, header/footer, responsive rules). Primary source for all tokens in this system.
- `web/001_TEIQue/{coach,business,managed coach,manager} account/app.css` — **the most authoritative implementation of the system.** Each account platform ships the same `app.css`, which names the showcase above as its source of truth and covers the full app shell (sidebar, topbar, panels, stat cards, tabs, segmented controls, wizards, modals). Where anything conflicts, this file wins.
- `web/001_TEIQue/front end/2026 redesign/shared/{header,footer}.css` — the current header and footer spec; `Header`/`Footer` here follow these. (The rest of that folder is work in progress — see Caveats.)
- `web/008_STYLES/tokens (figma exports)/tokens/global.json` — raw Figma Tokens Studio export (source of truth for exact values).
- `web/008_STYLES/restyling-guide/design-system-showcase.html` — a component showcase HTML built from the same tokens.
- `web/002_Psychometric Lab/front end/final pages/*.html` — ~20 finished psychometriclab.com pages (landing, tools, library, forum, login, register, settings, contact, support, about-us) plus `shared-header.html` / `shared-footer.html` / `shared-components.js`.
- `web/001_TEIQue/learn platform/` — the course/module/quiz platform, same shell with its own `learn.css`/`shell.css` layer.
- `web/002_Psychometric Lab/front end/final pages/*.html` are the finished psychometriclab.com pages; `resources/DesignSystem.md` in that folder is a stale, page-by-page writeup superseded by the two sources above and is **not** used here.
- `web/005_PLATFORM ICONS/`, `web/006_RASTER/` — the org's icon and image libraries (logos, illustrations, report covers, case studies, photography).
- No Figma file or GitHub repo link was provided — only the local `web/` folder mount. If either becomes available later, re-run against it to cross-check pixel values.

## Content Fundamentals

- **Voice**: academic and professional, but warm — this is a research institute talking about personal growth, not a SaaS product talking about features. Long-form "About Us" copy reads like an academic bio; short-form UI copy (buttons, nav, form labels) is plain and functional.
- **Person**: mixed. Marketing/onboarding copy addresses the reader directly ("Access our extensive library...", "you gain access to psychometric tools..."). Institutional copy (About Us, mission) speaks in third person about the Lab and "individuals."
- **Casing**: sentence case almost everywhere — page titles, button labels, nav items, form labels. No ALL-CAPS, no title-case nav items.
- **Tone examples** (verbatim from the source):
  - Login hero: *"Join the Research Community"* / *"Access our extensive library of emotional intelligence research, explore our professional tools, and connect with the global TEIQue community."*
  - About Us hero: *"Empowering Insight. Unleashing Infinite Potential."*
  - Mission statement: *"The ultimate aim of the Laboratory and its activities is to help people realize their infinite – totally limitless – potential."*
- **Aspirational language**: "infinite potential," "unleash," "elevate," "transcend perceived limits" recur — the brand leans into big, aspirational framing around self-understanding, not clinical/dry psychometric language, even though the underlying content (validation studies, scoring engines) is rigorously academic.
- **Emoji**: never used in product/marketing copy. (Internal working docs in the codebase use emoji in filenames/headers — that's working-notes style, not brand voice, and should not be imitated.)
- **Buttons/CTAs**: short, imperative, lowercase-first ("Login", "Register", "Read More", "View report").

## Visual Foundations

- **Color**: a two-color brand system — primary blue (`#259dd5`→`#66bae2` gradient) for platform/interactive elements, secondary orange (`#f3792a`→`#eba97c`) as accent. A five-color **facet palette** (red/magenta/purple/green/yellow) exists specifically to color-code TEIQue's emotional-intelligence facets and score visualizations — treat these as data/semantic colors, not general UI accents. Neutrals are a simple black/gray/light-gray/white scale. Max effectively 2 hero colors (blue, orange) per screen; facet colors appear only in facet-specific contexts (tags, charts, master-key icons).
- **Type**: Manrope (600/700) for all titles, navigation and button labels; Inter (300/400) for body copy, inputs and descriptions. Only 4 font sizes exist system-wide (36/20/16/12px) — resist introducing more.
- **Spacing**: a named scale, not a bare 4/8px grid — "narrow" (2–24px) for component-internal spacing, "standard" (32–48px) for section spacing, "wide" (56–192px) for page margins and major gaps. `--spacing-wide-l` (192px) is the desktop page margin — very generous, giving the whole system an airy, uncluttered feel.
- **Backgrounds**: solid white page backgrounds throughout; no full-bleed color sections. The one recurring texture is a very low-opacity (≈0.2) abstract illustration behind hero sections (`assets/illustrations/background-abstract.png`), faded to white at the edges with a linear-gradient mask so it never competes with foreground text. No repeating patterns, no photographic full-bleed heroes on the Lab site; TEIQue's marketing hero uses real product/photo imagery in a fixed-size right-hand panel instead.
- **Animation**: minimal and functional — 0.2–0.3s ease transitions on hover/focus almost everywhere; a slower 0.4s cubic-bezier only for larger state changes (e.g. the support page's topic→article transition). No bounce, no spring, no decorative motion. A checkbox "pop" (scale 0→1) is the one small delight.
- **Hover states**: two consistent patterns — (1) gradient buttons/cards invert to a white fill with primary-colored text, usually paired with `translateY(-1px to -2px)` and a slightly larger shadow; (2) white pills/cards scale up slightly (1.05–1.2×) instead of inverting. Nav links swap to secondary orange and grow from 16px→20px on hover (padding stays fixed so layout doesn't jump).
- **Press/active states**: active nav items get the full primary gradient background with white text and the standard card shadow — same visual language as "selected," not a separate press effect.
- **Borders**: almost no visible borders. Inputs have no border at all — depth comes from the inner shadow instead. The few borders that exist are 1px, in `--color-light-gray`, used only for row dividers (tables, mobile nav) and as an outline on facet tags in their "full" color.
- **Shadows**: one consistent soft **card shadow** (`0 1px 6px rgba(0,0,0,.12), 0 4px 20px rgba(0,0,0,.18)`) used on every raised surface — header, footer, cards, dropdowns, buttons. Inputs instead use an **inset** shadow (`inset 0 0 6px 2px rgba(0,0,0,.2)`) to read as recessed rather than raised. Table headers get a unique downward drop-shadow instead of a border to separate them from rows.
- **Radii**: 16px standard (cards, inputs, dropdowns), 8px small (checkboxes, small elements), 50px full pill (primary/secondary/danger buttons, nav-item hover state), 40px specifically for the nav pill shape, 24px pill on mobile where 50px would look oversized.
- **Layout**: `max-width: 1440px` centered container (1600px above 1441px). The site header is a **floating white pill card** — inset 80px from the page edge, 15px radius, sitting on a white-to-transparent gradient strip (`#fff` to transparent at 27.55%) so page content scrolls up underneath it rather than hitting a hard bar edge. Hard cutover at 1225px: the pill becomes a 10px-radius bar with a burger left, logo centered, account right, and the nav moves into a 300px left drawer with the CTA pinned at its bottom. The footer is full-bleed primary gradient with 96px side padding.
- **Transparency & blur**: no backdrop-blur/glassmorphism anywhere. Transparency is used for the header's fade strip, the fading edges of the hero background illustration, the footer's 28%-white divider rule, and the mobile menu's dark overlay scrim (`rgba(0,0,0,.5)`).
- **Imagery tone**: photography is warm and human (the professor portrait, coaching/leadership photography) rather than cool/corporate-blue-toned; report covers and platform illustrations are flat, brand-blue/orange line-art style, not photographic. No grain or duotone treatment observed.
- **Cards**: white fill, 16px radius, the one standard card shadow, 24px internal padding, no border. Gradient variants (primary/secondary) exist for promotional/leadership callouts and always pair with white text.

## Iconography

- **Style**: flat, single/two-tone SVGs (brand blue or orange, occasionally with a "hover" color-swapped twin file) — not an icon font, not Unicode/emoji-as-icon. Every icon that has an interactive hover state ships as **two separate SVG files** (`state=Default` / `state=hover`, or `default-icon` / `hover-icon`), cross-faded via opacity rather than recolored with CSS filters (one exception: the CTA arrow icon, which is recolored on hover with a CSS `filter`).
- **Families copied into `assets/icons/`**: user/account icon (`user/guest.svg`, `guest-hover.svg`, `logged-in.svg`, `logged-in-hover.svg`), burger menu (collapsed/expanded), UI (`ui/search.svg`, `ui/tick.svg`, `ui/x.svg`, `ui/dropdown-arrow.svg` + blue variant, `ui/language.svg`, `ui/request-demo-arrow.svg`), file type icons (PDF/CSV/Excel, each with a hover twin), payment method marks (Apple Pay, Google Pay, Revolut, credit card), social icons (Facebook/Instagram/LinkedIn/TikTok/X/YouTube/Website, each with a hover twin), notification-category icons (billing/coaching/internal/legal/product/quality/reminder/support/system/user), the three platform tool icons (scoring engine, psychometric validation, certificate checker), the six "master key" concept icons (TEIQue, Trait EI, KVP, Radix Intelligence, Psychobionomy, BELIMP), and the four support-topic icons (FAQ, library, theory & concepts, using the TEIQue).
- **Larger illustrations** (`assets/illustrations/`): flat, single-color-line style webp illustrations for hero/section icons (about us, settings, library, padlock, contact chat bubble, toolbox) — sized 64–144px, not photographic.
- **Photography** (`assets/case-studies/`, `assets/hero/`): used sparingly, for case-study article headers and the TEIQue marketing hero carousel only — not used decoratively elsewhere.
- No emoji, no Unicode-character icons, and no icon font were found anywhere in the codebase. If a needed glyph isn't in these libraries, the closest same-stroke-weight flat SVG substitute should be sourced rather than hand-drawn.

## Text fields: one canonical spec

Two input treatments exist in the repo. The canonical one is the **white-gradient fill, no border, 16px padding, inset shadow** (`--color-white-gradient` + `--shadow-inner`) — that is what `Input` and `Textarea` render. The platform `app.css` uses a tighter variant (white fill, 1px `--color-light-gray` border, 8px 16px padding) for dense table-adjacent forms and the topbar search; treat that as a density variant of the same field, not a second design.

## Fonts

Manrope and Inter are both used as Google Fonts (`@import` in `tokens/typography.css`) in every source page — no self-hosted `.woff`/`.ttf` files exist in the codebase to copy, so this system links them from Google Fonts CDN exactly as the source does. No substitution was needed.

## Intentional additions

Every component here corresponds to a class the source CSS actually defines. Renames only:

- `Select` ← `.dropdown`, `Table` ← `.pl-table-card`, `Tag` ← `.highlight-tag`, `Chip` ← `.chip`, `SegmentedControl` ← `.seg`, `Panel` ← `.panel`, `Modal` ← `.modal`, `AppSidebar` ← `.app-sidebar`, `AppTopbar` ← `.app-topbar`.
- No `Toast` or `Tooltip` exists in the source, so neither was invented.
- **One blue button.** The source defines `.primary-button` and `.pl-action-button` with the same blue gradient, differing only in width — so `Button` exposes a single `primary` variant plus `fullWidth`, rather than two blue variants.

## Index

```
styles.css                  entry point — @imports every token file below
tokens/colors.css            primary/secondary/neutral/status/facet colors
tokens/typography.css        font families, sizes, weights, line-heights
tokens/spacing.css            spacing scale + border radii
tokens/shadows.css            card/inner/table shadows + easing tokens
tokens/base.css               resets, container, link states, breakpoints

components/buttons/Button.jsx           THE blue pill + secondary/ghost/danger/submit
components/cards/Card.jsx               base/primary/secondary/hoverable surface
components/cards/DropdownCard.jsx        collapsible card
components/feedback/Tag.jsx             facet-coded chip
components/feedback/SocialIcon.jsx       hover-swap social link (paired SVGs)
components/forms/Input.jsx              text field
components/forms/Textarea.jsx           multi-line field
components/forms/Select.jsx             gradient-trigger dropdown
components/forms/Checkbox.jsx           32px square checkbox
components/forms/ToggleSwitch.jsx       36×20 pill toggle
components/tables/Table.jsx             pl-table grid pattern
components/navigation/Header.jsx        floating white pill header (drawer below 1225px)
components/navigation/Footer.jsx        gradient footer, 5-column + bottom bar

components/app-shell/AppSidebar.jsx     256px platform nav rail with badges + org footer
components/app-shell/AppTopbar.jsx      platform topbar: title, search, profile menu
components/app-shell/Avatar.jsx         initials avatar (sm/md/lg)
components/data/StatCard.jsx            dashboard KPI tile
components/data/Panel.jsx               card with header band + flush content
components/data/ProgressBar.jsx         completion track
components/data/StatusDot.jsx           status dot + label
components/data/EmptyState.jsx          zero state for filtered lists
components/controls/Tabs.jsx            underline status tabs with counts
components/controls/SegmentedControl.jsx  pill type toggle
components/controls/Chip.jsx            toggleable filter chip
components/controls/Stepper.jsx         wizard step indicator
components/overlays/Modal.jsx           dialog + wizard shell

guidelines/                  foundation specimen cards (Colors, Type, Spacing, Brand, Iconography)
assets/logos/                LPL + TEIQue logo lockups (blue/orange/white, mono/vertical/horizontal)
assets/icons/                all icon families (see Iconography above)
assets/illustrations/        flat section/hero illustrations + background texture
assets/report-covers/        all 15 TEIQue report cover designs
assets/case-studies/         all 7 case study header images
assets/hero/                 5 TEIQue hero frames + the spotlight wheel hero
assets/try-teique/           try-TEIQue step images, score wheel, blurred-results teaser
assets/articles/             spotlight article diagrams (indices, prototypicality, formations)
assets/quotes/               quote portrait imagery
assets/placeholders/         video preview placeholder

(No UI kits at present — see Caveats.)
```

## Caveats

- **teique.com's public pages are excluded on purpose.** `web/001_TEIQue/front end/2026 redesign/` is work in progress, so nothing in this system references those pages; the shop/marketing screens they describe are not recreated as a UI kit. Assets that happen to live near them (the TEIQue wordmark, hero frames) are still included since they are brand assets rather than page designs.
- **No UI kits / platform recreations are included.** Removed for now by request. The design system is the tokens, components and guidelines; the platforms and public sites consume them. The component set was derived from those surfaces' own CSS, so nothing was lost by removing the recreations — add kits back later if a reference view is wanted.
- **The questionnaires are not recreated.** There are several (3Rs true/false timed trial, CDC/free-trial demographics, the optional extended demographics form) and they introduce page-specific furniture — a timer chip, a countdown bar, a score chip, a floating cue "stage" — that only exists in those files. Those are page designs rather than shared system components, so they are documented here but not built. If you want any of them promoted into the system as real components, say which.
- Two design-system documents exist in the source with slightly different shadow values for `--shadow-card` (guidelines doc vs. individual page `<style>` blocks used `0px 0px 4px rgba(0,0,0,.1), 0px 0px 24px rgba(0,0,0,.16)` on some pages). This system uses the guidelines doc's values (`0px 1px 6px rgba(0,0,0,.12), 0px 4px 20px rgba(0,0,0,.18)`) as canonical since it's the more recent, more widely-referenced source (`shared/tokens.css` in the 2026 TEIQue redesign also matches this value).
- No Figma file or GitHub repo was attached — everything here comes from the local `web/` folder. If a Figma library exists beyond the token JSON exports, re-attach it to verify component-level details (variants, auto-layout specifics) that plain CSS can't fully capture.

## Migrated from a legacy design system

This system was carried over from the standalone version on 2026-09-17. The part of this README the author wrote predates the move, so any file names in it are the old ones. Where things are now:

- `styles.css`, `tokens/colors.css`, `tokens/typography.css`, `tokens/spacing.css`, `tokens/shadows.css`, `tokens/app-shell.css`, `tokens/base.css` (the global stylesheets) → `project/components/bundle.css`, with the token declarations moved to `project/tokens.json` (`project/tokens.css` is generated from them)
- `_ds_bundle.js` → `project/components/bundle.js`
- showcase pages, each kept whole as one component’s preview (a page of examples, not an export of the bundle): `components/app-shell/app-shell.card.html` → `project/components/AppShell/preview.html`; `components/buttons/buttons.card.html` → `project/components/Buttons/preview.html`; `components/cards/cards.card.html` → `project/components/Cards/preview.html`; `components/controls/controls.card.html` → `project/components/Controls/preview.html`; `components/data/data.card.html` → `project/components/Data/preview.html`; `components/feedback/tags.card.html` → `project/components/Tags/preview.html`; `components/forms/forms.card.html` → `project/components/Forms/preview.html`; `components/navigation/footer.card.html` → `project/components/Footer2/preview.html`; … and 3 more
- the migration report, which lists what did not come across: `project/assets/notes/MIGRATION-REPORT.md`
