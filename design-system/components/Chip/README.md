Small toggleable filter pill used inside wizards and candidate pickers. Distinct from `Tag`: chips are interactive filters, tags are read-only labels.

```jsx
<Chip active={filter === 'All'} onClick={() => setFilter('All')}>All</Chip>
<Chip active={filter === 'Ungrouped'} onClick={() => setFilter('Ungrouped')}>Ungrouped</Chip>
```
