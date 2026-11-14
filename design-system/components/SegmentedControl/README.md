Pill-shaped segmented toggle for switching between mutually exclusive types (Individual / Group, Short form / Full form). The selected segment gets the primary gradient; in the source the fill slides between segments with a spring easing.

```jsx
<SegmentedControl options={['All types', 'Individual', 'Group']} value={type} onChange={setType} />
<SegmentedControl options={[{ name: 'Short form', price: '£30' }, { name: 'Full form', price: '£50' }]} value={form} onChange={setForm} />
```
