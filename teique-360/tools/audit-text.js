// Compares the wording of the generated report with the 2010 TEIQue 360 sample report, both ways.
//   node tools/audit-text.js [data.json]
// 1. Every piece of text the generated report prints that is NOT in the 2010 report, word for word.
// 2. Every line of the 2010 report that is NOT in the generated report.
// It builds the report in Node (no browser), with the "Added" tags and the grey filler switched off.
// The reference is reference/2010-sample-pages/extracted-text.txt; text that sits inside pictures in
// the 2010 PDF (the wheel's labels, the logos) is not in that file and was checked by eye instead.
const path = require('path'), fs = require('fs'), root = path.join(__dirname, '..');
['model.js', 'svg.js', 'charts/radial.js', 'charts/linear.js', 'charts/overview.js', 'report/content.js'].forEach(f => require(path.join(root, 'src', f)));
const T = globalThis.TEIQ;
const lib = JSON.parse(fs.readFileSync(path.join(root, 'text/library.json'), 'utf8'));
const dataFile = process.argv[2] ? path.resolve(process.argv[2]) : path.join(root, 'data/sample-360.json');
const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
const built = T.report.build(data, lib, { fill: 'none', marks: false });

const norm = s => s.replace(/­/g, '').replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/™/g, '').replace(/\s+/g, ' ').trim().toLowerCase();
const decode = s => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&amp;/g, '&');

// ---- reference: join lines, mend words hyphenated across a line end, drop bullet glyphs
const refRaw = fs.readFileSync(path.join(root, 'reference/2010-sample-pages/extracted-text.txt'), 'utf8').replace(/[-]/g, '');
const refLines = [];
let page = 0;
refRaw.split('\n').forEach(l => { const m = l.match(/===== PAGE (\d+)/); if (m) page = +m[1]; else if (l.trim()) refLines.push({ page, text: l.trim() }); });
const refFlat = norm(refLines.map(l => l.text).join('\n').replace(/-\n/g, '-').replace(/\n/g, ' '));

// ---- generated: text blocks and chart labels, section by section
const chunks = [];
built.sections.forEach(s => {
  const html = (s.html || '') + (s.blocks || []).map(b => (typeof b === 'string' ? b : b.html)).join('\n');
  html.replace(/<svg[\s\S]*?<\/svg>/g, svg => { svg.replace(/<title>[\s\S]*?<\/title>/g, '').replace(/<text[^>]*>([\s\S]*?)<\/text>/g, (m, t) => { chunks.push({ sec: s.id, kind: 'chart', text: decode(t.replace(/<[^>]+>/g, '')) }); return ''; }); return ''; });
  html.replace(/<svg[\s\S]*?<\/svg>/g, '\n').replace(/<\/?(b|i)>/g, '').replace(/<[^>]+>/g, '\n').split('\n').map(t => decode(t).trim()).filter(Boolean).forEach(t => chunks.push({ sec: s.id, kind: 'text', text: t }));
});
chunks.push({ sec: 'every page', kind: 'text', text: decode(built.meta.product.replace(/<[^>]+>/g, '')) }, { sec: 'every page', kind: 'text', text: built.meta.copyright });

const numeric = t => /^[\d\s|%→+−±·.,/()-]+$/.test(t);
const seen = new Map();
chunks.forEach(c => { const k = norm(c.text); if (!k || numeric(k)) return; if (!seen.has(k)) seen.set(k, { ...c, secs: new Set() }); seen.get(k).secs.add(c.sec); });
// a label that is a score beside a name ("Boss 65", "You 52", "All others 52") is checked without the number
const inRef = k => refFlat.includes(k) || refFlat.includes(k.replace(/ \d+$/, ''));
const notInRef = [...seen.entries()].filter(([k]) => !inRef(k)).map(([, v]) => v);

console.log(`Report built from ${path.relative(root, dataFile)}: ${seen.size} distinct pieces of wording.\n`);
console.log(`1. In the generated report, not word for word in the 2010 report (${notInRef.length}):\n`);
['text', 'chart'].forEach(kind => {
  const list = notInRef.filter(c => c.kind === kind);
  console.log(`   ${kind === 'text' ? 'Page text' : 'Chart labels'} (${list.length}):`);
  list.forEach(c => console.log(`     [${[...c.secs].slice(0, 3).join(', ')}${c.secs.size > 3 ? ', …' : ''}] ${c.text.length > 110 ? c.text.slice(0, 110) + '…' : c.text}`));
  console.log('');
});

const genFlat = norm(chunks.map(c => c.text).join(' ¶ '));
const genJoined = genFlat.replace(/ ¶ /g, ' ');
const furniture = l => /^© Copyright 2010|^Page \d+ \/ \d+$/.test(l) || /^(\d{1,3}|[BODPY]|LOW|AVERAGE|HIGH)$/.test(l);
const missing = refLines.filter(l => !furniture(l.text)).filter(l => { const k = norm(l.text.replace(/-$/, '')); return !genFlat.includes(k) && !genJoined.includes(k); });
console.log(`2. In the 2010 report, not in the generated report (${missing.length}; page footers, axis numbers and the B/O/D/P/Y chart letters are left out of this list):\n`);
missing.forEach(l => console.log(`     [2010 p${l.page}] ${l.text}`));
