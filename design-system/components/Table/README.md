Grid-based data table used across account/reports pages (namespaced `pl-` in the source CSS). Header row has a soft drop-shadow instead of a border; rows divide with a 1px light-gray line.

```jsx
<Table columns={['Report', 'Date', 'Action']} rows={[['Personal EQ', '2026-01-04', <Button variant="table-action">View</Button>]]} />
```
