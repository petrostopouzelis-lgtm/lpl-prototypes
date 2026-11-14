Site footer: a full-bleed primary-gradient block with all-white content, a 5-column top row and a divided bottom bar.

```jsx
<Footer
  logo="/assets/logos/teique-wordmark.svg"
  tagline="The Trait Emotional Intelligence Questionnaire."
  social={[{ label: 'LinkedIn', defaultSrc: '…/linkedin-default.svg', hoverSrc: '…/linkedin-hover.svg' }]}
  columns={[
    { heading: 'Assessments', links: ['TEIQue Full Form', 'TEIQue Short Form', 'TSIQue'] },
    { heading: 'For Business', links: ['Recruitment', 'Development', 'Teams'] },
    { heading: 'Resources', links: ['Research Library', 'Case Studies', 'Support'] },
  ]}
  impressum={{ title: 'London Psychometric Laboratory', lines: ['26 Bedford Way', 'London WC1H 0AP'] }}
  legalLinks={['Privacy Policy', 'Terms of Service', 'Cookie Policy']}
  copyright="© 2026 London Psychometric Laboratory. All rights reserved."
/>
```

Layout: `1.4fr 1fr 1fr 1fr 1.2fr` with 96px side padding, collapsing to 2 columns below 1225px (brand spans full width) and 1 column below 768px, where the bottom bar stacks and the copyright left-aligns. The logo is knocked out to white; links fade to 0.75 opacity on hover; the bottom bar is divided by a 28%-white rule.
