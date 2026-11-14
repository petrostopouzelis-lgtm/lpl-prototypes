General-purpose surface for grouping content — the base unit for tiles, promo panels and bento layouts.

```jsx
<Card>Plain white surface, 16px radius, standard shadow</Card>
<Card variant="primary">Gradient promo card, white text</Card>
<Card hoverable>Tile that flips to a primary gradient on hover</Card>
```

`hoverable` is used for concept/topic tiles that invert to the primary gradient and flip icon colors to white via `filter: brightness(0) invert(1)` on hover — add that filter to any icon `<img>` inside manually when using this variant in a real page, since it can't be expressed purely through props.
