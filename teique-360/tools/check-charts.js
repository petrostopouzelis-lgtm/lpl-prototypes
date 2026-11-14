// Renders every chart variant from the sample data and fails on broken output.
const path = require('path'), fs = require('fs');
const src = f => require(path.join(__dirname, '..', 'src', f));
src('model.js'); src('svg.js'); src('charts/radial.js'); src('charts/linear.js'); src('charts/overview.js');
const T = globalThis.TEIQ, C = T.charts;
const v = T.view(JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'sample-360.json'), 'utf8')));
const jobs = [];
const YOU = Object.keys(T.YOU_STYLES);
'DEFG'.split('').forEach(k => YOU.forEach(you => jobs.push([`wheel ${k} ${you}`, () => C.wheel(v, { variant: k, you })])));
'DEF'.split('').forEach(k => ['global', 'empathy', 'self_motivation'].forEach(id => YOU.forEach(you => jobs.push([`gauge ${k} ${id} ${you}`, () => C.gauge(v, id, { variant: k, you })]))));
'ABC'.split('').forEach(k => T.FACET_ORDER.concat(['global', 'wellbeing']).forEach(id => jobs.push([`strip ${k} ${id}`, () => C.strip(v, id, { variant: k })])));
'ABC'.split('').forEach(k => jobs.push(['summary ' + k, () => C.summary(v, { variant: k })]));
'AB'.split('').forEach(k => { jobs.push(['gap ' + k, () => C.gap(v, { variant: k })]); jobs.push(['map ' + k, () => C.map(v, { variant: k })]); jobs.push(['raters ' + k, () => C.raters(v, { variant: k })]); });
let bad = 0;
for (const [name, fn] of jobs) {
  let svg = '';
  try { svg = fn(); } catch (e) { console.log('THROW', name, e.message); bad++; continue; }
  const m = svg.match(/NaN|undefined|Infinity/);
  if (m) { console.log('BAD  ', name, m[0], svg.slice(Math.max(0, m.index - 80), m.index + 20)); bad++; }
}
console.log(`${jobs.length} charts rendered, ${bad} broken`);
// every data file in data/, drawn with the default (picked) options
let files = 0;
for (const f of fs.readdirSync(path.join(__dirname, '..', 'data')).filter(f => f.endsWith('.json'))) {
  const view = T.view(JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', f), 'utf8')));
  files++;
  const all = [['wheel', () => C.wheel(view)], ...'DEG'.split('').map(k => ['wheel ' + k, () => C.wheel(view, { variant: k })]), ...'DE'.split('').map(k => ['gauge ' + k, () => C.gauge(view, 'global', { variant: k })]), ['summary', () => C.summary(view)], ['gap', () => C.gap(view)], ['map', () => C.map(view)], ['raters', () => C.raters(view)]];
  ['global'].concat(T.GROUPS.filter(g => g.scored).map(g => g.id), T.FACET_ORDER).forEach(id => { all.push(['gauge ' + id, () => C.gauge(view, id)]); all.push(['strip ' + id, () => C.strip(view, id)]); all.push(['small gauge ' + id, () => C.gauge(view, id, { compact: true })]); all.push(['narrow strip ' + id, () => C.strip(view, id, { width: 342 })]); });
  for (const [name, fn] of all) {
    let svg = '';
    try { svg = fn(); } catch (e) { console.log('THROW', f, name, e.message); bad++; continue; }
    const m = svg.match(/NaN|undefined|Infinity/);
    if (m) { console.log('BAD  ', f, name, m[0], svg.slice(Math.max(0, m.index - 80), m.index + 20)); bad++; }
  }
}
console.log(`${files} data files drawn with the picked options, ${bad} broken in total`);
process.exit(bad ? 1 : 0);
