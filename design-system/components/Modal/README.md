Centered dialog on a 45%-black scrim, used for confirmations and as the shell for the multi-step group and assignment wizards.

```jsx
<Modal title="Delete group?" onClose={close}
  actions={<><Button variant="secondary" onClick={close}>Cancel</Button><Button variant="danger">Delete</Button></>}>
  <p>Candidates stay in your account — only the group is removed.</p>
</Modal>
```

Widths: 520px default, 780px for the group wizard, 860px for the assignment wizard (which scrolls its body and keeps the stepper and footer pinned).
