Numbered progress stepper for the multi-step wizards (new group, new assignment). Done and current steps both use the primary gradient; upcoming steps stay light gray. Step labels hide below 560px.

```jsx
<Stepper steps={['Questionnaire', 'Recipients', 'Review']} current={0} />
```

Always used inside `Modal` — the stepper and the footer buttons stay pinned while the body scrolls.
