// Builds awkward-but-valid report data files from the sample, for testing layouts.
const fs = require('fs'), path = require('path');
const dir = path.join(__dirname, '..', 'data');
const base = JSON.parse(fs.readFileSync(path.join(dir, 'sample-360.json'), 'utf8'));
const clone = o => JSON.parse(JSON.stringify(o));
const save = (name, d, note) => {
  d.report.id = name.toUpperCase(); d.report.note = note;
  d.groups.forEach(g => { if (g.raters) g.raters = g.raters.slice(0, g.responded); });
  fs.writeFileSync(path.join(dir, name + '.json'), JSON.stringify(d, null, 2) + '\n'); console.log('wrote', name);
};
const KEYS = Object.keys(base.self);

// 1. One rater: only the boss responded.
let d = clone(base);
d.groups = [d.groups[0]];
d.others = { responded: 1, invited: 1, scores: clone(d.groups[0].scores) };
save('edge-one-rater', d, 'Only one rater (the boss) responded.');

// 2. Missing groups: one group with no responses, one too small to show by name.
d = clone(base);
d.settings.minGroupSize = 3; d.settings.alwaysShowGroups = ['boss'];
d.groups[2].responded = 0;                    // direct reports: nobody responded
d.groups[3].responded = 2;                    // peers: below the minimum group size
d.others.responded = d.groups.reduce((s, g) => s + g.responded, 0);
save('edge-missing-groups', d, 'Direct reports did not respond; Other Superiors (2) and Peers (2) are below a minimum group size of 3.');

// 3. Extremes: scores of 1 and 99, the largest possible gaps, and ties.
d = clone(base);
KEYS.forEach((k, i) => {
  const pattern = [[99, 1], [1, 99], [1, 1], [99, 99], [50, 50]][i % 5];
  d.self[k] = pattern[0]; d.others.scores[k] = pattern[1];
  d.groups.forEach((g, gi) => { g.scores[k] = [pattern[1], 1, 99, pattern[1]][gi % 4]; });
});
save('edge-extremes', d, 'Scores of 1 and 99, maximum gaps and exact ties.');

// 4. Many groups with long names and one large group.
d = clone(base);
const extra = [['senior_leadership', 'Senior leadership team', 3, 3], ['external_clients', 'External clients and partners', 12, 9]];
extra.forEach(([id, label, invited, responded], i) => {
  const scores = {}; KEYS.forEach((k, j) => { scores[k] = Math.max(1, Math.min(99, base.others.scores[k] + ((j * 7 + i * 11) % 23) - 11)); });
  d.groups.push({ id, label, invited, responded, scores });
});
d.groups[3].label = 'Peers in the same department';
d.others.responded = d.groups.reduce((s, g) => s + g.responded, 0);
d.others.invited = d.groups.reduce((s, g) => s + g.invited, 0);
d.subject.name = 'Alexandria Montgomery-Fitzwilliam';
d.subject.role = 'Regional Sales and Partnerships Manager, Northern Europe';
save('edge-many-groups', d, 'Six groups, long group names, a long subject name and one large group.');

// 5. Big gaps: self and raters disagree strongly on several facets (the made-up profile used
// for the first chart options). Shows how each chart copes when the two views are far apart.
d = clone(base);
//                    self boss superiors reports peers
const GAPS = {
  happiness:          [62, 70, 61, 66, 58], optimism:           [71, 64, 68, 75, 60], self_esteem:        [35, 72, 64, 68, 61],
  emotion_regulation: [58, 41, 44, 30, 47], impulse_control:    [74, 55, 52, 38, 49], stress_management:  [45, 62, 55, 41, 50],
  empathy:            [68, 30, 35, 22, 38], emotion_perception: [55, 48, 50, 40, 52], emotion_expression: [28, 35, 30, 18, 24],
  relationships:      [60, 66, 63, 58, 71], emotion_management: [77, 80, 74, 61, 72], assertiveness:      [83, 88, 76, 85, 79],
  social_awareness:   [49, 60, 71, 57, 66], adaptability:       [40, 58, 51, 33, 45], self_motivation:    [88, 91, 79, 86, 82]
};
const FACTORS = { wellbeing: ['happiness', 'optimism', 'self_esteem'], self_control: ['emotion_regulation', 'impulse_control', 'stress_management'],
  emotionality: ['empathy', 'emotion_perception', 'emotion_expression', 'relationships'], sociability: ['emotion_management', 'assertiveness', 'social_awareness'] };
const meanOf = a => Math.round(a.reduce((s, x) => s + x, 0) / a.length);
const fill = col => {
  const s = {}; Object.keys(GAPS).forEach(k => { s[k] = col(k); });
  Object.entries(FACTORS).forEach(([f, ids]) => { s[f] = meanOf(ids.map(i => s[i])); });
  s.global = meanOf(Object.keys(GAPS).map(i => s[i]));
  return s;
};
d.self = fill(k => GAPS[k][0]);
d.groups.forEach((g, gi) => { g.scores = fill(k => GAPS[k][gi + 1]); });
const tot = d.groups.reduce((s, g) => s + g.responded, 0);
d.others.scores = fill(k => Math.round(d.groups.reduce((s, g) => s + g.scores[k] * g.responded, 0) / tot));
delete d.self_raw;
save('edge-big-gaps', d, 'Self and raters far apart on several facets.');
