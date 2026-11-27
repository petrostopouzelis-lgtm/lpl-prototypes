// Builds a TEIQue 360 report PDF from a data file.
//
//   node tools/build-pdf.js [data.json] [out.pdf] [--fill=none|typical|long] [--watermark] [--no-extras] [--scales=pair] [--no-marks] [--png=<dir>]
//
// No npm packages. It serves this folder on a local port, opens report.html in a
// headless Chrome or Edge already installed on the machine, waits for the page to
// finish laying itself out, and prints it to PDF. Needs Node 22 or newer.
// Set CHROME_PATH to choose the browser.
const fs = require('fs'), path = require('path'), http = require('http'), os = require('os');
const { spawn } = require('child_process');

// Other report projects reuse this builder: REPORT_ROOT is the folder to serve (default: this project),
// REPORT_PAGE the page to print inside it, REPORT_SAMPLE the default data file.
const root = path.resolve(process.env.REPORT_ROOT || path.join(__dirname, '..'));
const reportPage = process.env.REPORT_PAGE || 'report.html';
const args = process.argv.slice(2), flags = args.filter(a => a.startsWith('--')), files = args.filter(a => !a.startsWith('--'));
const dataFile = path.resolve(files[0] || process.env.REPORT_SAMPLE || path.join(root, 'data', 'sample-360.json'));
const outFile = path.resolve(files[1] || path.join(path.dirname(path.join(root, reportPage)), 'out', path.basename(dataFile, '.json') + '.pdf'));
const flag = name => { const f = flags.find(x => x === '--' + name || x.startsWith('--' + name + '=')); return f ? (f.includes('=') ? f.split('=')[1] : true) : null; };

function findBrowser() {
  const c = [process.env.CHROME_PATH,
    'C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', 'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser'];
  const hit = c.find(p => p && fs.existsSync(p));
  if (!hit) throw new Error('No Chrome or Edge found. Set CHROME_PATH.');
  return hit;
}

const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.png': 'image/png', '.ttf': 'font/ttf', '.svg': 'image/svg+xml' };
function serve() {
  return new Promise(resolve => {
    const server = http.createServer((req, res) => {
      const url = decodeURIComponent(req.url.split('?')[0]);
      // the data file is served from a fixed address, wherever it lives on disk
      const file = url === '/__data.json' ? dataFile : path.join(root, url);
      if (url !== '/__data.json' && !file.startsWith(root)) { res.writeHead(403); return res.end(); }
      fs.readFile(file, (err, buf) => {
        if (err) { res.writeHead(404); return res.end('not found'); }
        res.writeHead(200, { 'Content-Type': TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream' });
        res.end(buf);
      });
    });
    server.listen(0, '127.0.0.1', () => resolve(server));
  });
}

// Minimal Chrome DevTools Protocol client over the built-in WebSocket.
function connect(wsUrl) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(wsUrl), pending = new Map();
    let id = 0;
    ws.onopen = () => resolve({
      send: (method, params = {}, sessionId) => new Promise((res, rej) => { const i = ++id; pending.set(i, { res, rej }); ws.send(JSON.stringify({ id: i, method, params, sessionId })); }),
      close: () => ws.close()
    });
    ws.onerror = e => reject(new Error('Could not connect to the browser: ' + (e.message || e.type)));
    ws.onmessage = m => { const msg = JSON.parse(m.data); const p = pending.get(msg.id); if (p) { pending.delete(msg.id); msg.error ? p.rej(new Error(msg.error.message)) : p.res(msg.result); } };
  });
}

(async () => {
  if (!fs.existsSync(dataFile)) throw new Error('Data file not found: ' + dataFile);
  JSON.parse(fs.readFileSync(dataFile, 'utf8')); // fail early on invalid JSON
  const server = await serve(), port = server.address().port;
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'teique360-'));
  const browser = spawn(findBrowser(), ['--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check', '--remote-debugging-port=0', '--user-data-dir=' + profile, 'about:blank'], { stdio: ['ignore', 'ignore', 'pipe'] });
  try {
    const wsUrl = await new Promise((resolve, reject) => {
      let buf = '';
      const timer = setTimeout(() => reject(new Error('The browser did not start within 20 seconds')), 20000);
      browser.stderr.on('data', chunk => { buf += chunk; const m = buf.match(/DevTools listening on (ws:\/\/\S+)/); if (m) { clearTimeout(timer); resolve(m[1]); } });
      browser.on('exit', code => reject(new Error('The browser exited early with code ' + code)));
    });
    const cdp = await connect(wsUrl);
    const { targetId } = await cdp.send('Target.createTarget', { url: 'about:blank' });
    const { sessionId } = await cdp.send('Target.attachToTarget', { targetId, flatten: true });
    const call = (method, params) => cdp.send(method, params, sessionId);
    const evaluate = async expression => (await call('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })).result.value;

    const query = new URLSearchParams({ data: '/__data.json', fill: flag('fill') || 'typical' });
    if (flag('watermark')) query.set('watermark', '1');
    if (flag('no-extras')) query.set('extras', '0');
    if (flag('scales')) query.set('scales', flag('scales'));
    if (flag('no-marks')) query.set('marks', '0');
    await call('Page.enable');
    await call('Page.navigate', { url: `http://127.0.0.1:${port}/${reportPage.split(path.sep).join('/')}?${query}` });
    const started = Date.now();
    while (!(await evaluate("document.documentElement.dataset.ready === '1'"))) {
      if (Date.now() - started > 60000) throw new Error('The report page did not finish within 60 seconds');
      await new Promise(r => setTimeout(r, 150));
    }
    const result = await evaluate('window.__REPORT');
    if (!result || result.error) throw new Error('The report page failed: ' + (result && result.error));

    const pdf = await call('Page.printToPDF', { printBackground: true, preferCSSPageSize: true, marginTop: 0, marginBottom: 0, marginLeft: 0, marginRight: 0 });
    fs.mkdirSync(path.dirname(outFile), { recursive: true });
    fs.writeFileSync(outFile, Buffer.from(pdf.data, 'base64'));
    console.log(`${path.basename(outFile)}: ${result.pages} pages (${result.numbered} numbered), ${(fs.statSync(outFile).size / 1024).toFixed(0)} KB`);
    result.warnings.forEach(w => console.log('  warning: ' + w));

    // optional: one PNG per page, for checking layouts
    const pngDir = flag('png');
    if (pngDir) {
      const dir = path.resolve(pngDir === true ? path.join(path.dirname(outFile), path.basename(outFile, '.pdf')) : pngDir);
      fs.mkdirSync(dir, { recursive: true });
      await call('Emulation.setDeviceMetricsOverride', { width: 794, height: 1123, deviceScaleFactor: 1, mobile: false });
      await call('Emulation.setEmulatedMedia', { media: 'print' });
      const boxes = await evaluate("[...document.querySelectorAll('.page')].map(p => { const r = p.getBoundingClientRect(); return { x: r.left + scrollX, y: r.top + scrollY, width: r.width, height: r.height }; })");
      for (let i = 0; i < boxes.length; i++) {
        const shot = await call('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip: Object.assign({ scale: 1 }, boxes[i]) });
        fs.writeFileSync(path.join(dir, `page-${String(i + 1).padStart(2, '0')}.png`), Buffer.from(shot.data, 'base64'));
      }
      console.log(`  ${boxes.length} page images in ${dir}`);
    }
    cdp.close();
    if (result.warnings.length) process.exitCode = 2;
  } finally {
    browser.kill();
    server.close();
    setTimeout(() => { try { fs.rmSync(profile, { recursive: true, force: true }); } catch (e) {} }, 500).unref();
  }
})().catch(e => { console.error('Failed: ' + e.message); process.exit(1); });
