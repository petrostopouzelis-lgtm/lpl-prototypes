// Builds data/sample-360.json.
// The self scores, the all-rater averages and the raw scores are the ones printed on the
// Coach Data page of the 2010 TEIQue 360 sample report, so every score lands in the band that
// report has wording for. The per-group scores, the names and the dates are made up.
// SAMPLE ONLY: in production the scoring engine supplies every percentile.
const fs = require('fs'), path = require('path');
const out = path.join(__dirname, '..', 'data');

//                      self  avg  raw
const rows = {
  global:             [53, 52, null],
  wellbeing:          [52, 52, 5],
  sociability:        [48, 51, 4],
  emotionality:       [31, 30, 4],
  self_control:       [69, 70, 4],
  optimism:           [42, 45, 5],
  happiness:          [53, 52, 5],
  self_esteem:        [64, 64, 5],
  emotion_management: [46, 49, 4],
  assertiveness:      [59, 56, 5],
  social_awareness:   [38, 46, 4],
  empathy:            [24, 24, 4],
  emotion_perception: [44, 43, 4],
  emotion_expression: [30, 30, 4],
  relationships:      [41, 39, 5],
  emotion_regulation: [65, 64, 4],
  impulse_control:    [69, 71, 5],
  stress_management:  [62, 65, 4],
  self_motivation:    [78, 78, 5],
  adaptability:       [56, 58, 4]
};
const groups = [
  { id: 'boss',            label: 'Boss',            invited: 1, responded: 1, raters: [
    { name: 'Jordan Ellis', known_years: 2, contact: 'very regular' }] },
  { id: 'other_superiors', label: 'Other Superiors', invited: 2, responded: 2, raters: [
    { name: 'Priya Nair', known_years: 0, contact: 'rare' },
    { name: 'Tomas Weber', known_years: 1, contact: 'irregular' }] },
  { id: 'direct_reports',  label: 'Direct Reports',  invited: 3, responded: 3, raters: [
    { name: 'Sam Okafor', known_years: 1, contact: 'very regular' },
    { name: 'Lena Fischer', known_years: 1, contact: 'very regular' },
    { name: 'Daniel Reyes', known_years: 5, contact: 'very regular' }] },
  { id: 'peers',           label: 'Peers',           invited: 3, responded: 3, raters: [
    { name: 'Maya Lindqvist', known_years: 3, contact: 'very regular' },
    { name: 'Chris Abara', known_years: 1, contact: 'very regular' },
    { name: 'Hana Sato', known_years: 1, contact: 'regular' }] }
];
groups.forEach(g => { g.scores = {}; });

// made-up group scores: three groups sit a set distance from the average and the fourth (peers)
// is solved so that the rater-weighted mean equals the printed average exactly
const dB = [-18, 12, -25, 8, -10], dO = [10, -8, 14, -5, 6], dD = [-6, 5, 3, -9, 8];
const clamp = x => Math.max(2, Math.min(98, x));
Object.keys(rows).forEach((k, i) => {
  const avg = rows[k][1];
  let b = clamp(avg + dB[i % 5]), o = clamp(avg + dO[i % 5]), d = clamp(avg + dD[i % 5]);
  while ((9 * avg - b - 2 * o - 3 * d) % 3 !== 0) b++;
  const p = (9 * avg - b - 2 * o - 3 * d) / 3;
  if (p < 1 || p > 99) throw new Error('cannot solve group scores for ' + k);
  [b, o, d, p].forEach((s, gi) => { groups[gi].scores[k] = s; });
});

const pick = n => Object.fromEntries(Object.keys(rows).map(k => [k, rows[k][n]]));
const raw = pick(2); delete raw.global;
const data = {
  schema: 'teique-360/1',
  report: { form: 'TEIQue-360', language: 'en', norm: 'UK', date: '2026-10-14', id: 'SAMPLE-0001', sample: true, valid: true },
  subject: { name: 'Alex Morgan', role: 'Sales Manager', time_in_role_years: 3 },
  settings: { minGroupSize: 1, alwaysShowGroups: [], textFollows: 'self', watermark: false },
  self: pick(0),
  self_raw: raw,
  others: { responded: 9, invited: 9, scores: pick(1) },
  groups
};
fs.writeFileSync(path.join(out, 'sample-360.json'), JSON.stringify(data, null, 2) + '\n');
console.log('wrote data/sample-360.json; now run: node tools/make-edge-cases.js && node tools/wrap-json.js');
