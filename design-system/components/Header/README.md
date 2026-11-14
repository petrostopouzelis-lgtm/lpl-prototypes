Site header: a floating white pill card on a white-to-transparent fade, so page content scrolls up underneath it.

```jsx
<Header
  logo="/assets/logos/lpl-logo-blue-monogram.webp"
  iconBase="/assets/icons"
  navItems={['Shop', 'Accreditation', 'Coaching',
             { name: 'Resources', items: ['Case Studies', 'Articles', 'Academic Website'] }]}
/>
```

Structure, left to right: blue monogram (56px) — nav with 40px gaps — Request Demo pill — globe language button (32px) — account icon (48px). Nav labels are 16px Manrope regular in `--color-text-blue` and turn `--color-secondary-full` (orange) on hover. Dropdown parents show the `dropdown-arrow.svg` glyph, blue-tinted, rotating 180° when open; menu items highlight to a `--color-primary-light` fill with white text.

The CTA inverts on hover — white fill, primary text, its arrow glyph blue-tinted, lifted 2px with a larger shadow.

All glyphs are the real asset files (`icons/ui/request-demo-arrow.svg`, `icons/ui/language.svg`, `icons/ui/dropdown-arrow.svg`, `icons/user/guest.svg` + its hover pair) — set `iconBase` rather than substituting inline SVG.

Below 1225px: a 10px-radius bar with the burger left (animating to an X), logo centered, account icon right; the Request Demo pill and language button leave the bar, and the nav moves into a 300px left drawer over a 50%-black scrim, with the CTA full-width and the language button in the drawer footer.
