// Theories, their score structure and the colours each score wears.
//
// TEIQue colours are the design system's facet palette (design-system/tokens.json,
// color-facet-*) as mapped in the "LPL - Reports" Figma file and the root README:
// Well-Being orange, Self-Control yellow, Emotionality green, Sociability purple,
// independent facets magenta, global red.
//
// Scan-In domain colours come from the LPL - Reports Figma file (see below).
// TSIQue has NO colour mapping yet: its choices are proposals from the same palette,
// marked `proposed: true`.
// Change them here only; everything else reads from this file.
(function (root) {
  const C = {
    red:     { full: '#EC1C24', light: '#F26065' },
    orange:  { full: '#F3792A', light: '#EBA97C' },
    yellow:  { full: '#EBBB3D', light: '#F1CF77' },
    green:   { full: '#3AA756', light: '#75C188' },
    purple:  { full: '#7569A1', light: '#9E96BD' },
    magenta: { full: '#B271A4', light: '#C99BBF' },
    blue:    { full: '#259DD5', light: '#66BAE2' }, // color-primary-full / -light
  };

  const THEORIES = {
    teique: {
      id: 'teique', label: 'TEIQue', wordmark: ['TEIQ', 'ue'],
      global: { name: 'Global trait EI', color: C.red },
      factors: [
        { id: 'wellbeing', name: 'Well-Being', color: C.orange,
          facets: ['Happiness', 'Optimism', 'Self-esteem'] },
        { id: 'self_control', name: 'Self-Control', color: C.yellow,
          facets: ['Emotion regulation', 'Impulse control', 'Stress management'] },
        { id: 'emotionality', name: 'Emotionality', color: C.green,
          facets: ['Empathy', 'Emotion perception', 'Emotion expression', 'Relationships'] },
        { id: 'sociability', name: 'Sociability', color: C.purple,
          facets: ['Emotion management', 'Assertiveness', 'Social awareness'] },
      ],
      independent: { name: 'Independent facets', color: C.magenta, facets: ['Adaptability', 'Self-motivation'] },
    },
    tsique: {
      id: 'tsique', label: 'TSIQue', wordmark: ['TSIQ', 'ue'], proposed: true,
      global: { name: 'Global trait SI', color: C.red },
      factors: [
        { id: 'social_cognizing', name: 'Social cognizing', color: C.purple,
          facets: ['Understanding others', 'Social prediction', 'Perspective taking', 'Social attention'] },
        { id: 'social_acting', name: 'Social acting', color: C.orange,
          facets: ['Social confidence', 'Communicative confidence', 'Managing others', 'Networking'] },
        { id: 'social_relating', name: 'Social relating', color: C.green,
          facets: ['Teamwork', 'Social adaptability', 'Social interest', 'Social relationships'] },
      ],
    },
    scanin: {
      // Scan-In scores every life domain twice: belief and importance. Each domain has
      // its own colour (below). The ribbon shape, which needs just two colours, uses the
      // two brand colours for the two scales (a proposal).
      id: 'scanin', label: 'Scan-In™', wordmark: ['Scan-', 'In', '™'],
      global: { name: 'Total belief', color: C.blue },
      scales: { belief: { name: 'Belief', color: C.blue }, importance: { name: 'Importance', color: C.orange } },
      // Domains and colours from the "results graph" frame (node 648:1440) in the
      // LPL - Reports Figma file. Colours were sampled from its render, so check them
      // against the file's fills if exact values matter.
      domains: ['Financial independence', 'Family', 'Health', 'Leisure', 'Appearance', 'Friends', 'Work', 'Parenting', 'Age',
        'Spirituality', 'Relationships', 'Legacy', 'Happiness', 'Motivation', 'Habits', 'Socializing', 'Success'],
      domainColors: {
        'Financial independence': '#E6A57A', 'Family': '#9A98CB', 'Health': '#EFC760', 'Leisure': '#67C17F',
        'Appearance': '#4AADDC', 'Friends': '#3F499B', 'Work': '#DE559F', 'Parenting': '#FDC34C', 'Age': '#A66733',
        'Spirituality': '#7061AA', 'Relationships': '#5AC1B6', 'Legacy': '#5ABD7E', 'Happiness': '#F5AE9E',
        'Motivation': '#D6B590', 'Habits': '#B95E8C', 'Socializing': '#BF88B3', 'Success': '#D4E499',
      },
      total: '#E74343', // Total Scan-In score
    },
  };

  root.LPLCovers = root.LPLCovers || {};
  root.LPLCovers.COLORS = C;
  root.LPLCovers.THEORIES = THEORIES;
})(typeof window !== 'undefined' ? window : globalThis);
