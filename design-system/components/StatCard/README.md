KPI tile at the top of every platform dashboard — centered icon, label, big number, small trend caption. Always used in a 4-up grid that drops to 2-up below 1380px and 1-up below 680px.

```jsx
<StatCard label="Total Candidates" value={248} sub="+12 added this month" subTone="up" icon={<UsersIcon />} />
<StatCard label="Awaiting Completion" value={37} sub="across 5 assignments" subTone="warn" />
```

`plain` removes the card surface (transparent, no shadow) for the borderless variant where stats are separated by 1px vertical rules instead.
