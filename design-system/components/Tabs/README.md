Underline tabs for switching a list's status filter (All / Active / Completed). The active tab is text-blue with a 3px primary-gradient underline; counts sit in a pill that turns primary-light when active.

```jsx
<Tabs tabs={[{ name: 'All', count: 18 }, { name: 'Active', count: 5 }, { name: 'Completed', count: 13 }]} active={tab} onChange={setTab} />
```

Pair with `SegmentedControl` in the same toolbar: tabs switch status, the segmented control switches type.
