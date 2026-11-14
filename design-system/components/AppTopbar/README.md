Sticky page header for the logged-in platforms: page title + subtitle on the left, search and the profile button on the right. Notifications live inside the profile dropdown, not as a separate bell.

```jsx
<AppTopbar title="Dashboard" subtitle="Welcome back, Elena."
  profileName="Elena" profileInitials="EM" unread
  menuItems={[{ name: 'Notifications', badge: 3 }, { name: 'Settings' }, { name: 'Log out', danger: true }]} />
```

The title is `--color-text-blue` (#0093d8), the text-only blue — never use it as a fill. Search hides below 900px; the burger appears below 1225px when the sidebar collapses.
