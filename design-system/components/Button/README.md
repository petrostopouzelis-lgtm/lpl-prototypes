Pill-shaped action button used across every surface — platform dashboards, account screens and marketing pages.

**There is exactly one blue button in this system**: `variant="primary"` (the blue gradient pill). Everything else is white, gray or red. Do not add a second blue fill — a table-row action, a card footer CTA and a page-header action all use `primary`, differing only in `fullWidth`.

```jsx
<Button variant="primary">New Assignment</Button>
<Button variant="secondary">Cancel</Button>
<Button variant="danger">Delete Account</Button>
<Button variant="submit">Save Changes</Button>
<Button variant="ghost">Resend</Button>
<Button variant="primary" fullWidth>View</Button>
```

Hover: `primary` inverts to a white fill with primary text and lifts 2px; `secondary` scales 1.05×; `danger`/`submit` lift with a larger shadow (`submit` also turns primary). Press: all shrink to `scale(0.96)`.
