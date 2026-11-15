// Builds the ready-made PDFs the page viewer saves when it runs inside the claude.ai viewer
// (which may not open a print dialog): for every data file, one with the "Added" tags (review) and
// one without (final), in the standard layout. They go to out/viewer-pdf/<name>.pdf and
// out/viewer-pdf/<name>-final.pdf; publish them next to report.html as pdf/<name>.pdf.
//   node tools/build-viewer-pdfs.js        (set CHROME_PATH if Chrome or Edge is not found)
const { execFileSync } = require('child_process'), fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..'), out = path.join(root, 'out/viewer-pdf');
fs.mkdirSync(out, { recursive: true });
const names = fs.readdirSync(path.join(root, 'data')).filter(f => f.endsWith('.json')).map(f => f.slice(0, -5));
for (const n of names) for (const final of [false, true]) {
  const dest = path.join(out, `${n}${final ? '-final' : ''}.pdf`);
  const args = [path.join(__dirname, 'build-pdf.js'), path.join(root, 'data', n + '.json'), dest].concat(final ? ['--no-marks'] : []);
  process.stdout.write(execFileSync(process.execPath, args, { encoding: 'utf8' }));
}
