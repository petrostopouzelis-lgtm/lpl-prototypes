// Builds a TEIQue Full Form report PDF from a data file.
//
//   node teique-ff/tools/build-pdf.js [data.json] [out.pdf] [--fill=none|typical|long] [--watermark] [--png=<dir>]
//
// Uses the 360 report's PDF builder (teique-360/tools/build-pdf.js): it serves the repository folder,
// so this report can load the shared code in teique-360/, opens teique-ff/report.html in a headless
// Chrome or Edge and prints it. Needs Node 22 or newer; set CHROME_PATH to choose the browser.
const path = require('path');
process.env.REPORT_ROOT = path.join(__dirname, '..', '..');
process.env.REPORT_PAGE = 'teique-ff/report.html';
process.env.REPORT_SAMPLE = process.env.REPORT_SAMPLE || path.join(__dirname, '..', 'data', 'sample-ff.json');
require('../../teique-360/tools/build-pdf.js');
