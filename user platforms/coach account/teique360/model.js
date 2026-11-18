// TEIQue structure, colours and score scales. Shared by every chart.
// Plain script: works by double-click in a browser (window.TEIQ) and in Node (require).
(function (root) {
  const T = (root.TEIQ = root.TEIQ || {});

  // Colours come from the Figma file "LPL - Reports": fill is the dark end of each
  // gradient, light the pale end, text the label colour.
  T.GLOBAL = { id: 'global', name: 'Global Score', fill: '#EC1C24', light: '#F26065', text: '#EC1C24' };
  T.GROUPS = [
    { id: 'wellbeing', name: 'Well-Being', scored: true, fill: '#F3792A', light: '#EBA97C', text: '#E47C2D',
      facets: ['happiness', 'optimism', 'self_esteem'] },
    { id: 'self_control', name: 'Self-Control', scored: true, fill: '#EBBB3D', light: '#F1CF77', text: '#EBBB3D',
      facets: ['emotion_regulation', 'impulse_control', 'stress_management'] },
    { id: 'emotionality', name: 'Emotionality', scored: true, fill: '#3AA756', light: '#75C188', text: '#3AA756',
      facets: ['empathy', 'emotion_perception', 'emotion_expression', 'relationships'] },
    { id: 'sociability', name: 'Sociability', scored: true, fill: '#7569A1', light: '#9E96BD', text: '#7569A1',
      facets: ['emotion_management', 'assertiveness', 'social_awareness'] },
    // The two independent facets count towards Global but belong to no factor.
    { id: 'independent', name: 'Independent Facets', scored: false, fill: '#B271A4', light: '#C99BBF', text: '#B271A4',
      facets: ['adaptability', 'self_motivation'] }
  ];
  // lines: how the name wraps on the wheel's label ring.
  T.FACETS = {
    happiness: { name: 'Happiness' },
    optimism: { name: 'Optimism' },
    self_esteem: { name: 'Self-Esteem' },
    emotion_regulation: { name: 'Emotion Regulation', lines: ['Emotion', 'Regulation'] },
    impulse_control: { name: 'Impulse Control', lines: ['Impulse', 'Control'] },
    stress_management: { name: 'Stress Management', lines: ['Stress', 'Management'] },
    empathy: { name: 'Empathy' },
    emotion_perception: { name: 'Emotion Perception', lines: ['Emotion', 'Perception'] },
    emotion_expression: { name: 'Emotion Expression', lines: ['Emotion', 'Expression'] },
    relationships: { name: 'Relationships' },
    emotion_management: { name: 'Emotion Management', lines: ['Emotion', 'Management'] },
    assertiveness: { name: 'Assertiveness' },
    social_awareness: { name: 'Social Awareness', lines: ['Social', 'Awareness'] },
    adaptability: { name: 'Adaptability' },
    self_motivation: { name: 'Self-Motivation', lines: ['Self-', 'Motivation'] }
  };
  T.FACET_ORDER = T.GROUPS.flatMap(g => g.facets);
  T.groupOf = id => T.GROUPS.find(g => g.id === id || g.facets.includes(id)) || T.GLOBAL;
  T.nameOf = id => (T.FACETS[id] || T.GROUPS.find(g => g.id === id) || T.GLOBAL).name;

  // Neutral inks. "You" is always drawn in INK; others in the factor colour.
  T.INK = '#1F2733';
  T.MUTED = '#6B7380';
  T.FAINT = '#B7B6B7';
  T.RULE = '#E3E5E9';
  T.BLUE = '#42A2DA';

  // How "you" (the self score) is coloured in the petal chart and the score wheel.
  // Others always wear the factor colour. You wear a variation of that same colour, so every
  // mark still belongs to its factor (Petros, 2026-11-11: no unrelated grey).
  //   deep    a darker, richer shade of the factor colour
  //   hollow  white with an edge in the factor colour (solid against hollow)
  //   blue    the brand blue, the same for every factor
  T.YOU_STYLES = { deep: { name: 'Deeper shade' }, hollow: { name: 'White with a colour edge' }, blue: { name: 'Brand blue' } };
  T.YOU_DEFAULT = 'deep';
  // A darker shade of a colour: same hue, lightness scaled by lk, saturation by sk.
  T.shade = (hex, lk = 0.62, sk = 1.2) => {
    const [r, g, b] = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255);
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, d = mx - mn;
    let h = 0, s = 0;
    if (d) { s = d / (1 - Math.abs(2 * l - 1)); h = 60 * (mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4); if (h < 0) h += 360; }
    const L = l * lk, Sx = Math.min(1, s * sk), c = (1 - Math.abs(2 * L - 1)) * Sx, x = c * (1 - Math.abs((h / 60) % 2 - 1)), m = L - c / 2;
    const rgb = h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x] : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x];
    return '#' + rgb.map(q => Math.round((q + m) * 255).toString(16).padStart(2, '0')).join('');
  };
  // The colours for "you" in one factor group g: fill and light (gradient ends), edge (strokes), text (numbers).
  T.youStyle = (key, g) => {
    key = T.YOU_STYLES[key] ? key : T.YOU_DEFAULT;
    const deep = T.shade(g.fill);
    if (key === 'blue') return { key, fill: '#42A2DA', light: '#8CC6E8', edge: '#42A2DA', text: '#2B86BF' };
    if (key === 'hollow') return { key, hollow: true, fill: '#ffffff', light: '#ffffff', edge: g.fill, text: deep };
    return { key, fill: deep, light: T.shade(g.fill, 0.82, 1.1), edge: deep, text: deep };
  };

  // Score bands. Scores are percentiles, 1 to 99.
  T.BANDS = [
    { id: 'low', label: 'Low', min: 1, max: 30 },
    { id: 'average', label: 'Average', min: 31, max: 70 },
    { id: 'high', label: 'High', min: 71, max: 99 }
  ];
  T.clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  T.bandOf = s => T.BANDS[s <= 30 ? 0 : s <= 70 ? 1 : 2];

  // Equal-thirds scale (decided 2026-11-10): each band fills its own equal-width track.
  // Returns the band index and the fraction of that band's track that is filled.
  T.thirds = s => {
    s = T.clamp(s, 1, 99);
    if (s <= 30) return { i: 0, f: (s - 1) / 29 };
    if (s <= 70) return { i: 1, f: (s - 30) / 40 };
    return { i: 2, f: (s - 70) / 29 };
  };
  // x position of a score on three tracks that start at x0, span width w, with a gap between.
  T.trackX = (s, x0, w, gap) => {
    const tw = (w - 2 * gap) / 3, t = T.thirds(s);
    return x0 + t.i * (tw + gap) + t.f * tw;
  };
  // Linear scale, used by the gauge and the wheel.
  T.lin = (s, a, b) => a + (T.clamp(s, 0, 100) / 100) * (b - a);

  // One normalised view of a report data file, so charts never touch the raw shape.
  // Applies the anonymity rule: a group with fewer raters than minGroupSize is not
  // shown on its own unless it is listed in alwaysShowGroups.
  // opt.hideGroups: group ids the reader has switched off (web view).
  T.view = (data, opt) => {
    const st = data.settings || {}, hide = (opt && opt.hideGroups) || [];
    const min = st.minGroupSize || 1, keep = st.alwaysShowGroups || [];
    const groups = (data.groups || []).map(g => ({ ...g, shown: (g.responded >= min || keep.includes(g.id)) && !hide.includes(g.id) }));
    return {
      data,
      self: data.self,
      others: data.others.scores,
      responded: data.others.responded,
      invited: data.others.invited,
      groups,
      shownGroups: groups.filter(g => g.shown && g.responded > 0),
      gap: id => data.others.scores[id] - data.self[id]
    };
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = T;
})(typeof window !== 'undefined' ? window : globalThis);
