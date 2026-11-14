Left navigation rail for every logged-in platform (coach, business, managed coach, manager, learn). A 256px white card floating with a 16px gap on all sides — not a flush full-height panel.

```jsx
<AppSidebar
  brandLogo="/assets/logos/lpl-logo-blue-monogram.webp"
  brandName="Psychometric Laboratory" brandSub="For Coaches"
  sections={[{ items: [{ name: 'Dashboard' }, { name: 'Assignments', badge: 3 }] },
             { label: 'People', items: [{ name: 'Candidates' }, { name: 'Groups' }] }]}
  activeItem="Dashboard"
  org={{ initials: 'EM', name: 'Elena Moreau', plan: 'Premium coach' }}
/>
```

Active row = primary gradient pill with white text and the card shadow. Hover = orange text on a 10%-primary-light tint, shifted 3px right. Below 1225px the source slides the whole rail off-canvas behind a burger in the topbar.
