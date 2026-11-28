// LPL Report Hub (hub.html): choose a report, load a data file, then make the full report or single charts.
// Everything runs in the browser from the same code as the reports' own pages: T.report.build (360) or
// T.ff.build (Full Form, from ../teique-ff/), T.report.paginate for the pages, T.charts for the charts.
// Nothing is uploaded anywhere; a chosen file is read locally.
//
// Saving: opened by double-click or from a server, files download straight away and "Save as PDF" opens
// the print dialog. Inside the claude.ai viewer, which allows neither, files go through the viewer's
// downloads capability and the PDF button is hidden (the HTML download prints to PDF from any browser).
(function () {
  const T = window.TEIQ, C = T.charts, S = T.svg, LIB = window.TEIQ_TEXT;
  const $ = id => document.getElementById(id);
  const esc = S.esc;
  const V = window.HUB_V || '';
  const inViewer = !!(window.claude && typeof window.claude.use === 'function');
  const downloadsReady = inViewer ? window.claude.use('downloads').catch(() => null) : Promise.resolve(null);

  // ---------------------------------------------------------------- the report types the hub knows
  // One entry per report. A new report type adds an entry here, a data check, a build and its charts.
  const REPORTS = {
    '360': { schema: 'teique-360/1', form: 'TEIQue-360', sample: 'sample-360', file: 'teique360', title: 'TEIQue 360 Report',
      files: () => window.TEIQ_FILE_LIST || Object.keys(window.TEIQ_FILES || {}), data: () => window.TEIQ_FILES || {} },
    ff: { schema: 'teique-ff/1', form: 'TEIQue-FF', sample: 'sample-ff', file: 'teique-ff', title: 'TEIQue Full Form Report',
      files: () => window.TEIQ_FF_FILE_LIST || [], data: () => window.TEIQ_FF_FILES || {} }
  };
  const R = () => REPORTS[state.report];
  const isFF = () => state.report === 'ff';
  // The Full Form's code, text and samples live in ../teique-ff/ and load when it is first chosen. In the
  // published hub they sit in teique-ff/ next to this page instead, so both places are tried.
  const loadScript = src => new Promise((res, rej) => {
    const el = document.createElement('script'); el.src = src + V;
    el.onload = res; el.onerror = () => { el.remove(); rej(new Error('Could not load ' + src)); };
    document.head.appendChild(el);
  });
  let ffP = null, ffCovers = '';   // ffCovers: the Full Form's covers (teique-ff/assets/covers/), wherever teique-ff/ was found
  const loadFF = () => ffP || (ffP = (async () => {
    let base = null;
    for (const b of ['../teique-ff/', 'teique-ff/']) { try { await loadScript(b + 'data/files.js'); base = b; break; } catch (e) { /* try the next place */ } }
    if (!base) throw new Error('The Full Form files were not found: teique-ff/ should sit next to teique-360/.');
    for (const n of window.TEIQ_FF_FILE_LIST || []) await loadScript(base + 'data/' + n + '.js');
    await loadScript(base + 'text/library.js');
    await loadScript(base + 'src/content.js');
    await new Promise(res => { ffCss.onload = ffCss.onerror = res; ffCss.href = base + 'src/ff.css' + V; });
    ffCovers = base + 'assets/covers/';
    return base;
  })().catch(e => { ffP = null; throw e; }));
  const ffView = d => ({ data: d, self: d.self, others: d.self, groups: [], shownGroups: [], responded: 0, gap: () => 0 });
  const FACTORS = T.GROUPS.filter(g => g.scored).map(g => g.id);
  const SCALES = ['global'].concat(FACTORS, T.FACET_ORDER);
  const nameOf = id => (id === 'global' ? 'Global score' : T.nameOf(id));

  // ---------------------------------------------------------------- state
  const state = {
    report: '360',
    ffVersion: 'personal',      // the Full Form version picked under Report: its wording
    mode: 'report',
    data: null, source: null, issues: { errors: [], warnings: [] },
    zoom: null,
    charts: { types: new Set(['profile', 'summary', 'map', 'gap', 'raters', 'wheel', 'strip', 'wheel-chart']), scales: new Set(['global'].concat(FACTORS)) }
  };

  // ---------------------------------------------------------------- data check
  // Follows data/DATA-FORMAT.md. Errors stop the report; warnings are shown and the report still builds.
  const isScore = x => typeof x === 'number' && isFinite(x) && x >= 1 && x <= 99;
  const scoresCheck = (errors, warnings) => (obj, where) => {
      if (!obj || typeof obj !== 'object') { errors.push(`<b>${where}</b> is missing.`); return; }
      const missing = SCALES.filter(k => obj[k] == null), bad = SCALES.filter(k => obj[k] != null && !isScore(obj[k]));
      if (missing.length) errors.push(`<b>${where}</b> has no score for ${list(missing.map(nameOf))}.`);
      if (bad.length) errors.push(`<b>${where}</b>: ${list(bad.map(k => `${nameOf(k)} (${esc(String(obj[k]))})`))} ${bad.length > 1 ? 'are' : 'is'} not a percentile from 1 to 99.`);
      const odd = SCALES.filter(k => isScore(obj[k]) && !Number.isInteger(obj[k]));
      if (odd.length) warnings.push(`<b>${where}</b>: ${list(odd.map(nameOf))} ${odd.length > 1 ? 'are' : 'is'} not a whole number; the report prints it as given.`);
  };
  // what every report needs: a name and a well-formed date
  function checkCommon(d, errors, warnings) {
    if (d.schema !== R().schema) warnings.push(`<b>schema</b> is ${d.schema ? `"${esc(String(d.schema))}"` : 'missing'}; this report reads "${R().schema}".`);
    if (!d.subject || !String(d.subject.name || '').trim()) errors.push('<b>subject.name</b> is missing: the person\'s name goes on the cover and every page.');
    const rep = d.report || {};
    if (!rep.date) warnings.push('<b>report.date</b> is missing; the cover and page headers will have no date.');
    else if (!/^\d{4}-\d{2}-\d{2}$/.test(rep.date)) warnings.push(`<b>report.date</b> "${esc(String(rep.date))}" is not in the form YYYY-MM-DD.`);
    return rep;
  }
  function checkFF(d) {
    const errors = [], warnings = [];
    if (!d || typeof d !== 'object' || Array.isArray(d)) return { errors: ['The file does not hold a report: expected an object with <b>subject</b>, <b>report</b> and <b>self</b>.'], warnings };
    const rep = checkCommon(d, errors, warnings), FFLIB = window.TEIQ_FF_TEXT || { versions: {} };
    if (rep.form && rep.form !== 'TEIQue-FF') warnings.push(`<b>report.form</b> is "${esc(String(rep.form))}"; this report is the full form (TEIQue-FF).`);
    if (!FFLIB.versions[rep.version]) warnings.push(`<b>report.version</b> is ${rep.version ? `"${esc(String(rep.version))}"` : 'missing'}; built so far: ${Object.keys(FFLIB.versions).join(', ')}. The version picked under Report is made.`);
    scoresCheck(errors, warnings)(d.self, 'self');
    if (d.others || d.groups) warnings.push('This file has rater scores (<b>others</b>, <b>groups</b>); the Full Form report uses the person\'s own scores only.');
    return { errors, warnings };
  }
  function check(d) {
    if (isFF()) return checkFF(d);
    const errors = [], warnings = [], scores = scoresCheck(errors, warnings);
    if (!d || typeof d !== 'object' || Array.isArray(d)) return { errors: ['The file does not hold a report: expected an object with <b>subject</b>, <b>self</b>, <b>others</b> and <b>groups</b>.'], warnings };
    const rep = checkCommon(d, errors, warnings);
    if (rep.form && rep.form !== 'TEIQue-360') warnings.push(`<b>report.form</b> is "${esc(String(rep.form))}"; only the full form (TEIQue-360) is built so far.`);
    scores(d.self, 'self');
    const o = d.others;
    if (!o || typeof o !== 'object') errors.push('<b>others</b> is missing: the raters\' average scores and counts.');
    else {
      scores(o.scores, 'others.scores');
      if (!(o.responded >= 1)) errors.push('<b>others.responded</b> must be at least 1.');
      if (o.invited != null && o.responded > o.invited) warnings.push(`<b>others</b>: ${o.responded} responded but only ${o.invited} invited.`);
    }
    if (!Array.isArray(d.groups) || !d.groups.length) warnings.push('<b>groups</b> is empty; the rater-group charts will show you and all others only.');
    else {
      d.groups.forEach((g, i) => {
        const where = `groups[${i}]${g && g.label ? ` (${esc(String(g.label))})` : ''}`;
        if (!g || !g.id || !g.label) errors.push(`<b>${where}</b> needs an <b>id</b> and a <b>label</b>.`);
        if (!g) return;
        if (g.responded > 0) scores(g.scores, where + '.scores');
        if (g.invited != null && g.responded > g.invited) warnings.push(`<b>${where}</b>: ${g.responded} responded but only ${g.invited} invited.`);
      });
      const sum = d.groups.reduce((s, g) => s + ((g && g.responded) || 0), 0);
      if (o && o.responded != null && sum !== o.responded) warnings.push(`The groups add up to ${sum} raters, but <b>others.responded</b> says ${o.responded}.`);
    }
    return { errors, warnings };
  }
  const list = a => a.length <= 3 ? a.join(', ') : `${a.slice(0, 3).join(', ')} and ${a.length - 3} more`;

  // ---------------------------------------------------------------- data in
  function useData(d, source) {
    state.data = d; state.source = source; state.issues = check(d);
    if (isFF()) { const fv = d && d.report && d.report.version; if (fv && window.TEIQ_FF_TEXT.versions[fv]) setVersion(fv, false); }
    // settings from the file become the starting options
    const st = (d && d.settings) || {};
    $('o-follows').value = st.textFollows === 'others' ? 'others' : 'self';
    $('o-min').value = String(Math.min(5, Math.max(1, st.minGroupSize || 1)));
    $('o-wm').checked = !!st.watermark;
    renderLoaded();
    note('');
    refresh();
  }
  function readFile(file) {
    if (!file) return;
    if (!/\.json$/i.test(file.name) && file.type !== 'application/json') { showLoadError(file.name, 'Choose a .json report data file.'); return; }
    const fr = new FileReader();
    fr.onload = () => {
      let d;
      try { d = JSON.parse(fr.result); } catch (e) { showLoadError(file.name, `This file is not valid JSON (${esc(e.message)}).`); return; }
      $('sample').value = '';
      useData(d, { kind: 'file', name: file.name });
    };
    fr.onerror = () => showLoadError(file.name, 'The file could not be read.');
    fr.readAsText(file);
  }
  function showLoadError(name, msg) {
    state.data = null; state.source = { kind: 'file', name }; state.issues = { errors: [msg], warnings: [] };
    renderLoaded(); refresh();
  }
  function renderLoaded() {
    const box = $('loaded'), d = state.data, src = state.source, is = state.issues;
    box.hidden = false;
    const tag = src && src.kind === 'sample' ? '<span class="badge">Sample data</span>' : `<span class="badge file">${esc(src ? src.name : '')}</span>`;
    let html = '';
    if (d && d.subject) {
      const rep = d.report || {}, o = d.others || {}, groups = Array.isArray(d.groups) ? d.groups : [];
      html += `<div class="who"><b>${esc(String(d.subject.name || 'No name'))}</b>${tag}</div><dl>`;
      if (rep.date) html += `<dt>Date</dt><dd>${esc(dmy(rep.date))}</dd>`;
      html += `<dt>Form</dt><dd>${esc(String(rep.form || 'not given'))}${rep.norm ? ` · ${esc(String(rep.norm))} norms` : ''}</dd>`;
      if (isFF()) {
        const VL = window.TEIQ_FF_TEXT.versions, fileV = rep.version && VL[rep.version] ? VL[rep.version].name : (rep.version || 'not given');
        html += `<dt>Version</dt><dd>${esc(VL[state.ffVersion].name)}${String(fileV) !== VL[state.ffVersion].name ? ` <span class="muted">(file: ${esc(String(fileV))})</span>` : ''}</dd>`;
        if (d.self && isScore(d.self.global)) html += `<dt>Global</dt><dd>${d.self.global}</dd>`;
      } else html += `<dt>Raters</dt><dd>${o.responded != null ? `${o.responded}${o.invited != null ? ` of ${o.invited}` : ''} responded` : 'not given'}</dd>`;
      if (!isFF() && groups.length) html += `<dt>Groups</dt><dd>${groups.map(g => `${esc(String(g.label || g.id))} ${g.responded != null ? g.responded : '?'}`).join(' · ')}</dd>`;
      html += '</dl>';
    } else html += `<div class="who">${tag}</div>`;
    if (is.errors.length || is.warnings.length)
      html += `<div class="issues">${is.errors.map(t => `<div class="issue err">${t}</div>`).join('')}${is.warnings.map(t => `<div class="issue warn">${t}</div>`).join('')}</div>`;
    box.innerHTML = html;
  }
  const dmy = s => { const p = String(s).split('-'); return p.length === 3 ? `${p[2]}/${p[1]}/${p[0]}` : String(s); };

  // the data as the report sees it, with the options from the panel
  function effectiveData() {
    const d = state.data, st = Object.assign({}, d.settings || {});
    st.textFollows = $('o-follows').value;
    st.minGroupSize = +$('o-min').value;
    st.watermark = $('o-wm').checked;
    if (st.minGroupSize === 1) st.alwaysShowGroups = [];
    return Object.assign({}, d, { settings: st });
  }
  const usable = () => state.data && !state.issues.errors.length;

  // ---------------------------------------------------------------- the report preview
  // The pages are laid out inside a shadow root, so the report's stylesheet applies to them and nothing
  // else, and printing the hub prints exactly these pages.
  const host = $('report-host'), shadow = host.attachShadow({ mode: 'open' });
  shadow.innerHTML = `<link rel="stylesheet" href="src/report/report.css${V}"><link rel="stylesheet" id="ff-css" media="not all">
    <style>
      #report { zoom: var(--zoom, 1); padding: 22px 0 8px; }
      .page { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      @media print { #report { zoom: 1 !important; padding: 0; } .page { margin: 0 !important; box-shadow: none !important; } }
    </style><div id="report"></div>`;
  const mount = shadow.getElementById('report'), ffCss = shadow.getElementById('ff-css');
  const cssReady = new Promise(res => { const l = shadow.querySelector('link'); l.onload = l.onerror = res; });
  const assetsReady = Promise.all(['assets/cover-2026.jpg', 'assets/back-cover.jpg', 'assets/logo-monogram.png'].map(src => new Promise(res => { const i = new Image(); i.onload = i.onerror = res; i.src = src; })))
    .then(() => Promise.all([document.fonts.load('300 12pt Inter'), document.fonts.load('500 26pt Manrope'), document.fonts.load('700 12pt Manrope')]))
    .then(() => document.fonts.ready);
  let lastReport = null, building = 0;

  async function buildReport() {
    const ticket = ++building;
    await Promise.all([cssReady, assetsReady]);
    if (ticket !== building) return;
    const data = effectiveData();
    ffCss.media = isFF() ? 'all' : 'not all';
    const built = isFF()
      ? T.ff.build(data, window.TEIQ_FF_TEXT, { fill: $('o-fill').value, watermark: $('o-wm').checked, assets: 'assets/', covers: ffCovers, version: state.ffVersion })
      : T.report.build(data, LIB, {
        fill: $('o-fill').value, watermark: $('o-wm').checked, extras: $('o-extras').checked,
        scales: $('o-scales').value, marks: $('o-marks').checked
      });
    mount.innerHTML = '';
    mount.style.setProperty('--zoom', 1);       // measured at full size
    const r = T.report.paginate(built, mount);
    const missing = mount.querySelectorAll('.needed').length;
    lastReport = { name: String(data.subject.name), pages: r.pages, warnings: r.warnings, missing };
    if (state.zoom == null) state.zoom = fitZoom();
    applyZoom();
    setStatus(`${data.subject.name ? esc(String(data.subject.name)) : 'Report'} <span>· ${r.pages} pages</span>` +
      (missing ? ` <span class="w">· ${missing} text${missing > 1 ? 's' : ''} still needed</span>` : '') +
      (r.warnings.length ? ` <span class="w">· layout: ${esc(r.warnings[0])}</span>` : ''));
  }
  const fitZoom = () => Math.max(0.3, Math.min(1, Math.floor(($('work').clientWidth - 48) / 794 * 20) / 20));
  function applyZoom() { mount.style.setProperty('--zoom', state.zoom); $('z-val').textContent = Math.round(state.zoom * 100) + '%'; }
  const setStatus = html => { $('status').innerHTML = html; };

  // ---------------------------------------------------------------- charts
  // Each chart type draws from the same view of the data as the report. Per-scale types make one
  // chart for every scale picked in the panel.
  const CHART_TYPES = [
    { id: 'profile', name: 'Profile wheel', wide: true, draw: v => C.wheel(v, profileLegend(v)) },
    { id: 'summary', name: 'Summary graph', wide: true, draw: v => C.summary(v) },
    { id: 'map', name: 'Perception map', draw: v => C.map(v) },
    { id: 'gap', name: 'Where the views differ', wide: true, draw: v => C.gap(v, { agree: (LIB.extras && LIB.extras.comparison && LIB.extras.comparison.agree_within) || 10 }) },
    { id: 'raters', name: 'Raters overview', wide: true, draw: v => C.raters(v) },
    { id: 'wheel', name: 'Score wheel', perScale: true, narrow: true, draw: (v, id) => C.gauge(v, id) },
    { id: 'strip', name: 'Rater-group chart', perScale: true, draw: (v, id) => C.strip(v, id) }
  ];
  // the Full Form has one score per scale: its own wheel chart, summary graph and score wheel
  const FF_CHART_TYPES = [
    { id: 'wheel-chart', name: 'Wheel chart', wide: true, draw: v => C.wheel(v, { single: true, label: 'TEIQue wheel chart' }) },
    { id: 'summary', name: 'Summary graph', wide: true, draw: v => C.summary(v, { single: true, label: 'TEIQue summary graph' }) },
    { id: 'wheel', name: 'Score wheel', perScale: true, narrow: true, draw: (v, id) => C.gauge(v, id, { single: true }) }
  ];
  const chartTypes = () => (isFF() ? FF_CHART_TYPES : CHART_TYPES);
  function profileLegend(v) {
    const p = (LIB.pages && LIB.pages.profile) || {};
    return { legendOthers: p.legend_others ? p.legend_others.replace('{n}', v.responded) : undefined, legendYou: p.legend_self };
  }
  function chartJobs() {
    const v = isFF() ? ffView(effectiveData()) : T.view(effectiveData()), jobs = [];
    const scales = SCALES.filter(s => state.charts.scales.has(s));
    chartTypes().forEach(t => {
      if (!state.charts.types.has(t.id)) return;
      if (!t.perScale) jobs.push({ key: t.id, title: t.name, sub: '', type: t, svg: () => t.draw(v) });
      else scales.forEach(id => jobs.push({ key: `${t.id}-${id}`, title: nameOf(id), sub: t.name, type: t, scale: id, svg: () => t.draw(v, id) }));
    });
    return jobs;
  }
  function renderCharts() {
    const jobs = chartJobs(), box = $('cards');
    box.innerHTML = jobs.map((j, i) => `<article class="card${j.type.wide ? ' wide' : ''}" data-i="${i}">
      <header><div><b>${esc(j.title)}</b>${j.sub ? `<small>${esc(j.sub)}</small>` : ''}</div>
        <div class="acts"><button type="button" data-fmt="png" aria-label="Download ${esc(j.title)} as PNG">PNG</button><button type="button" data-fmt="svg" aria-label="Download ${esc(j.title)} as SVG">SVG</button></div></header>
      <div class="art${j.type.narrow ? ' narrow' : ''}">${j.svg()}</div></article>`).join('');
    box._jobs = jobs;
    const n = jobs.length;
    $('c-count').textContent = `${n} chart${n === 1 ? '' : 's'}`;
    $('x-zip').textContent = n === 1 ? 'Download chart' : `Download ${n} charts (.zip)`;
    $('x-zip').disabled = !n;
    setStatus(n ? `${n} chart${n === 1 ? '' : 's'} <span>· ${esc(String(state.data.subject.name || ''))}</span>` : 'No charts picked');
    $('empty').hidden = !!n; if (!n) $('empty-text').textContent = isFF() ? 'Pick at least one chart, and for score wheels at least one scale.' : 'Pick at least one chart, and for score wheels and rater-group charts at least one scale.';
  }
  function renderChartPicker() {
    const counts = { perScale: state.charts.scales.size };
    $('c-scales-title').textContent = isFF() ? 'Scales for the score wheels' : 'Scales for the score wheels and rater-group charts';
    $('c-types').innerHTML = chartTypes().map(t => `<label class="pick"><input type="checkbox" data-type="${t.id}"${state.charts.types.has(t.id) ? ' checked' : ''}><span>${esc(t.name)}</span><em>${t.perScale ? `× ${counts.perScale}` : ''}</em></label>`).join('');
    const chip = (id, color, head) => `<button type="button" class="chip${head ? ' head' : ''}" data-scale="${id}" style="--c:${color}" aria-pressed="${state.charts.scales.has(id)}">${esc(nameOf(id))}</button>`;
    let html = `<div class="sg">${chip('global', T.GLOBAL.fill, true)}</div>`;
    T.GROUPS.forEach(g => { html += `<div class="sg">${g.scored ? chip(g.id, g.fill, true) : ''}${g.facets.map(f => chip(f, g.fill)).join('')}</div>`; });
    $('c-scales').innerHTML = html;
  }

  // ---------------------------------------------------------------- exporting
  let embedP = null;
  const loadEmbed = () => embedP || (embedP = new Promise((res, rej) => {
    const s = document.createElement('script'); s.src = 'src/hub/embed.js' + V;
    s.onload = () => (window.TEIQ_EMBED ? res(window.TEIQ_EMBED) : rej(new Error('fonts file is empty')));
    s.onerror = () => { embedP = null; rej(new Error('Could not load src/hub/embed.js (run tools/build-hub-embed.js).')); };
    document.head.appendChild(s);
  }));
  let coversP = null;
  const loadCovers = () => coversP || (coversP = new Promise((res, rej) => {
    const s = document.createElement('script'); s.src = 'src/hub/covers.js' + V;
    s.onload = () => (window.TEIQ_COVERS ? res(window.TEIQ_COVERS) : rej(new Error('covers file is empty')));
    s.onerror = () => { coversP = null; rej(new Error('Could not load src/hub/covers.js (run tools/build-hub-embed.js).')); };
    document.head.appendChild(s);
  }));
  const fontFaces = E => `@font-face{font-family:'Inter';src:url(data:font/ttf;base64,${E.fonts.Inter}) format('truetype');font-weight:100 900}` +
    `@font-face{font-family:'Manrope';src:url(data:font/ttf;base64,${E.fonts.Manrope}) format('truetype');font-weight:200 800}`;

  // a chart's SVG at its natural size; with fonts embedded when it is drawn into a PNG
  function sizedSvg(svg, scale, fonts) {
    const m = svg.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/), w = +m[1], h = +m[2], W = Math.round(w * scale), H = Math.round(h * scale);
    let out = svg.replace(' width="100%"', ` width="${W}" height="${H}"`).replace(/ style="display:block;max-width:[^"]*"/, '');
    if (fonts) out = out.replace(/(<svg[^>]*>)/, `$1<style>${fonts}</style>`);
    return { svg: out, W, H };
  }
  async function svgToPng(svg, scale, bg) {
    const E = await loadEmbed();
    const s = sizedSvg(svg, scale, fontFaces(E));
    const url = URL.createObjectURL(new Blob([s.svg], { type: 'image/svg+xml' }));
    try {
      const img = new Image();
      await new Promise((res, rej) => { img.onload = res; img.onerror = () => rej(new Error('The chart could not be drawn.')); img.src = url; });
      if (img.decode) await img.decode().catch(() => {});
      const c = document.createElement('canvas'); c.width = s.W; c.height = s.H;
      const g = c.getContext('2d');
      if (bg === 'white') { g.fillStyle = '#fff'; g.fillRect(0, 0, s.W, s.H); }
      g.drawImage(img, 0, 0, s.W, s.H);
      return await new Promise((res, rej) => c.toBlob(b => (b ? res(b) : rej(new Error('The PNG could not be made.'))), 'image/png'));
    } finally { URL.revokeObjectURL(url); }
  }
  const svgFile = svg => new Blob(['<?xml version="1.0" encoding="UTF-8"?>\n' + sizedSvg(svg, 1).svg], { type: 'image/svg+xml' });

  async function saveBlob(name, blob) {
    const dl = inViewer ? await Promise.race([downloadsReady, new Promise(r => setTimeout(() => r(null), 1500))]) : null;
    if (dl) return dl.save({ filename: name, data: blob });
    const a = document.createElement('a'), url = URL.createObjectURL(blob);
    a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 10000);
    return { status: 'saved' };
  }
  const slug = s => String(s).normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/[^A-Za-z0-9]+/g, '-').replace(/^-|-$/g, '').toLowerCase() || 'report';
  const fileBase = () => `${R().file}${isFF() ? '-' + state.ffVersion : ''}_${slug(state.data.subject.name)}`;
  const reportName = () => `${isFF() ? `TEIQue ${window.TEIQ_FF_TEXT.versions[state.ffVersion].name} Report (Full Form)` : R().title} - ${String(state.data.subject.name).replace(/[\\/:*?"<>|]+/g, ' ').trim()}`;

  function note(text, bad) { const n = $('x-note'); n.textContent = text; n.classList.toggle('bad', !!bad); }
  function saveError(e) {
    const code = e && e.code;
    if (code === 'declined') return note('Not saved.');
    if (code === 'rate_limited') return note('A save is already waiting for your answer.', true);
    note((e && e.message) || 'The file could not be saved.', true);
  }
  async function busy(btn, label, fn) {
    const old = btn.textContent; btn.disabled = true; btn.textContent = label;
    try { await fn(); } catch (e) { saveError(e); } finally { btn.disabled = false; btn.textContent = old; }
  }

  // full report as one self-contained HTML file: the laid-out pages with fonts, images and styles inside
  async function exportHtml() {
    const E = await loadEmbed();
    let body = mount.innerHTML;
    Object.keys(E.images).forEach(p => { body = body.split(`src="${p}"`).join(`src="${E.images[p]}"`); });
    // the Full Form's cover, from the design system: its picture is in src/hub/covers.js, loaded only for this
    if (isFF()) {
      const C2 = await loadCovers();
      Object.keys(C2).forEach(f => { body = body.split(`src="${ffCovers}${f}"`).join(`src="${C2[f]}"`); });
    }
    const css = (E.reportCss + (isFF() ? '\n' + (E.ffCss || '') : '')).replace(/@font-face\s*{[^}]*}/g, '');
    const html = `<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">` +
      `<title>${esc(reportName())}</title><style>${fontFaces(E)}\n${css}\n.page{-webkit-print-color-adjust:exact;print-color-adjust:exact}</style></head>` +
      `<body><!-- To make a PDF: open in Chrome or Edge, print (Ctrl+P / Cmd+P), Destination "Save as PDF", Margins "None", tick "Background graphics". -->${body}</body></html>`;
    const r = await saveBlob(reportName() + '.html', new Blob([html], { type: 'text/html' }));
    note(r && r.status === 'delivered' ? 'Sent.' : 'HTML saved. Open it in Chrome or Edge and print it to PDF.');
  }
  function printPdf() {
    const title = document.title;
    document.title = reportName();                 // the browser's suggested PDF file name
    window.print();
    setTimeout(() => { document.title = title; }, 500);
    note('In the print dialog: Destination "Save as PDF", Margins "None", Background graphics on.');
  }
  async function exportCharts(jobs) {
    const fmt = $('c-format').value, scale = +$('c-scale').value, bg = $('c-bg').value, files = [];
    for (let i = 0; i < jobs.length; i++) {
      note(`Preparing ${i + 1} of ${jobs.length}…`);
      const j = jobs[i], svg = j.svg(), base = `${fileBase()}_${slug(j.key)}`;
      if (fmt !== 'svg') files.push({ name: base + '.png', blob: await svgToPng(svg, scale, bg) });
      if (fmt !== 'png') files.push({ name: base + '.svg', blob: svgFile(svg) });
    }
    if (files.length === 1) await saveBlob(files[0].name, files[0].blob);
    else await saveBlob(`${fileBase()}_charts.zip`, await zip(files));
    note(files.length === 1 ? 'Saved.' : `Saved ${files.length} files in one .zip.`);
  }

  // A small ZIP writer (files stored as they are; PNGs are already compressed).
  const CRC = (() => { const t = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
  const crc32 = u => { let c = 0xFFFFFFFF; for (let i = 0; i < u.length; i++) c = CRC[(c ^ u[i]) & 0xFF] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0; };
  async function zip(files) {
    const enc = new TextEncoder(), parts = [], central = [];
    const now = new Date(), dt = ((now.getHours() << 11) | (now.getMinutes() << 5) | (now.getSeconds() >> 1)) & 0xFFFF, dd = (((now.getFullYear() - 1980) << 9) | ((now.getMonth() + 1) << 5) | now.getDate()) & 0xFFFF;
    let offset = 0;
    for (const f of files) {
      const name = enc.encode(f.name), data = new Uint8Array(await f.blob.arrayBuffer()), crc = crc32(data);
      const h = new DataView(new ArrayBuffer(30));
      h.setUint32(0, 0x04034b50, true); h.setUint16(4, 20, true); h.setUint16(6, 0x0800, true); h.setUint16(8, 0, true);
      h.setUint16(10, dt, true); h.setUint16(12, dd, true); h.setUint32(14, crc, true); h.setUint32(18, data.length, true); h.setUint32(22, data.length, true);
      h.setUint16(26, name.length, true); h.setUint16(28, 0, true);
      parts.push(h.buffer, name, data);
      const c = new DataView(new ArrayBuffer(46));
      c.setUint32(0, 0x02014b50, true); c.setUint16(4, 20, true); c.setUint16(6, 20, true); c.setUint16(8, 0x0800, true); c.setUint16(10, 0, true);
      c.setUint16(12, dt, true); c.setUint16(14, dd, true); c.setUint32(16, crc, true); c.setUint32(20, data.length, true); c.setUint32(24, data.length, true);
      c.setUint16(28, name.length, true); c.setUint32(42, offset, true);
      central.push(c.buffer, name);
      offset += 30 + name.length + data.length;
    }
    const size = central.reduce((s, p) => s + (p.byteLength || p.length), 0);
    const e = new DataView(new ArrayBuffer(22));
    e.setUint32(0, 0x06054b50, true); e.setUint16(8, files.length, true); e.setUint16(10, files.length, true); e.setUint32(12, size, true); e.setUint32(16, offset, true);
    return new Blob(parts.concat(central, [e.buffer]), { type: 'application/zip' });
  }

  // ---------------------------------------------------------------- what the right side shows
  let timer = 0;
  function refresh() { clearTimeout(timer); timer = setTimeout(render, 60); }
  async function render() {
    const report = state.mode === 'report', ok = usable();
    $('opts-report').hidden = !report; $('opts-charts').hidden = report;
    $('x-report').hidden = !report; $('x-charts').hidden = report;
    $('zoom-tools').hidden = !report || !ok;
    host.hidden = !report || !ok;
    $('cards').hidden = report || !ok;
    $('x-pdf').disabled = $('x-html').disabled = !ok; $('x-zip').disabled = !ok;
    $('empty').hidden = ok;
    if (!ok) {
      $('empty-text').textContent = state.data || state.issues.errors.length ? 'Fix the problems listed under Data, or choose another file.' : 'Choose a data file or a sample.';
      setStatus(state.issues.errors.length ? '<span class="w">The data file has problems</span>' : 'No data');
      return;
    }
    if (report) await buildReport(); else renderCharts();
  }

  // ---------------------------------------------------------------- wiring
  function setMode(m) {
    state.mode = m;
    if (m === 'report' && state.zoom != null && state.zoom > fitZoom()) state.zoom = fitZoom();
    $('mode-report').setAttribute('aria-pressed', m === 'report'); $('mode-charts').setAttribute('aria-pressed', m === 'charts');
    note('');
    refresh();
  }
  $('mode-report').onclick = () => setMode('report');
  $('mode-charts').onclick = () => setMode('charts');

  // samples: "Sample report (name)", with the version for the Full Form's; edge cases: "Test: ..."
  const label = n => {
    const d = R().data()[n] || {}, who = d.subject ? d.subject.name : n;
    if (!/^sample/.test(n)) return 'Test: ' + n.replace(/^edge-/, '').replace(/-/g, ' ');
    const VL = isFF() && window.TEIQ_FF_TEXT && window.TEIQ_FF_TEXT.versions, ver = VL && d.report && VL[d.report.version];
    return ver ? `Sample ${ver.name.toLowerCase()} report (${who})` : `Sample report (${who})`;
  };
  const listSamples = () => { $('sample').innerHTML = '<option value="">Choose a sample…</option>' + R().files().map(n => `<option value="${esc(n)}">${esc(label(n))}</option>`).join(''); };
  const useSample = n => { const d = R().data()[n]; if (!d) return; $('sample').value = n; $('file').value = ''; useData(JSON.parse(JSON.stringify(d)), { kind: 'sample', id: n, name: label(n) }); };
  $('sample').onchange = e => { if (e.target.value) useSample(e.target.value); };
  $('file').onchange = e => readFile(e.target.files[0]);
  const drop = $('drop');
  ['dragenter', 'dragover'].forEach(t => drop.addEventListener(t, e => { e.preventDefault(); drop.classList.add('over'); }));
  ['dragleave', 'drop'].forEach(t => drop.addEventListener(t, e => { e.preventDefault(); drop.classList.remove('over'); }));
  drop.addEventListener('drop', e => readFile(e.dataTransfer.files[0]));
  document.querySelectorAll('[data-template]').forEach(btn => {
    btn.onclick = () => {
      const d = R().data()[R().sample];
      busy(btn, 'Preparing…', async () => { await saveBlob(`${R().file}-data-template.json`, new Blob([JSON.stringify(d, null, 2) + '\n'], { type: 'application/json' })); note('Template saved.'); });
    };
  });

  // the Full Form's version: its buttons come from the text library, so a new version appears by itself.
  // Picking one changes the wording; on a version's sample data it also loads the new version's own sample.
  function renderVersions() {
    const VL = window.TEIQ_FF_TEXT.versions, ids = Object.keys(VL);
    $('ff-versions').style.setProperty('--n', ids.length);
    $('ff-versions').innerHTML = ids.map(k => `<button type="button" role="radio" data-version="${k}" aria-checked="${k === state.ffVersion}">${esc(VL[k].name)}</button>`).join('');
  }
  function setVersion(v, rebuild = true) {
    state.ffVersion = v;
    document.querySelectorAll('#ff-versions [data-version]').forEach(b => b.setAttribute('aria-checked', b.dataset.version === v));
    if (!rebuild) return;
    const own = R().files().find(n => (R().data()[n].report || {}).version === v && /^sample/.test(n));
    // a version's own sample swaps for the new version's; a test file or the reader's own file keeps its data
    if (state.source && /^sample/.test(state.source.id || '') && own) useSample(own);
    else { renderLoaded(); note(''); refresh(); }
  }
  $('ff-versions').addEventListener('click', e => { const b = e.target.closest('[data-version]'); if (b && b.dataset.version !== state.ffVersion) setVersion(b.dataset.version); });

  // switching the report type: its options, data description, samples and charts, then its sample data
  async function setReport(r) {
    if (r === state.report) return;
    if (r === 'ff') {
      setStatus('Loading the Full Form report…');
      try { await loadFF(); } catch (e) { setStatus(`<span class="w">${esc(e.message)}</span>`); return; }
    }
    state.report = r;
    document.querySelectorAll('#rtypes .rtype').forEach(b => b.setAttribute('aria-checked', b.dataset.report === r));
    $('opts-360').hidden = $('opts-360b').hidden = r !== '360';
    $('ff-version').hidden = r !== 'ff';
    if (r === 'ff') renderVersions();
    document.querySelectorAll('details.fmt[data-for]').forEach(el => { el.hidden = el.dataset.for !== r; });
    listSamples(); renderChartPicker();
    state.zoom = state.zoom == null ? null : Math.min(state.zoom, fitZoom());
    useSample(R().sample);
  }
  $('rtypes').addEventListener('click', e => { const b = e.target.closest('[data-report]'); if (b) setReport(b.dataset.report); });
  $('rtypes').addEventListener('keydown', e => {
    if (!['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight'].includes(e.key)) return;
    e.preventDefault();
    const next = state.report === '360' ? 'ff' : '360';
    setReport(next).then(() => document.querySelector(`#rtypes [data-report="${state.report}"]`).focus());
  });

  ['o-fill', 'o-scales', 'o-follows', 'o-min', 'o-extras', 'o-marks', 'o-wm'].forEach(id => { $(id).onchange = refresh; });
  ['c-format', 'c-scale', 'c-bg'].forEach(id => { $(id).onchange = () => note(''); });
  $('c-types').addEventListener('change', e => { const t = e.target.dataset.type; if (!t) return; e.target.checked ? state.charts.types.add(t) : state.charts.types.delete(t); refresh(); });
  $('c-scales').addEventListener('click', e => {
    const b = e.target.closest('[data-scale]'); if (!b) return;
    const id = b.dataset.scale, on = !state.charts.scales.has(id);
    on ? state.charts.scales.add(id) : state.charts.scales.delete(id);
    b.setAttribute('aria-pressed', on); renderChartPicker(); refresh();
  });
  $('c-all').onclick = () => { SCALES.forEach(s => state.charts.scales.add(s)); renderChartPicker(); refresh(); };
  $('c-none').onclick = () => { state.charts.scales.clear(); renderChartPicker(); refresh(); };
  $('cards').addEventListener('click', e => {
    const b = e.target.closest('button[data-fmt]'); if (!b) return;
    const j = $('cards')._jobs[+b.closest('.card').dataset.i], base = `${fileBase()}_${slug(j.key)}`;
    busy(b, '…', async () => {
      if (b.dataset.fmt === 'png') await saveBlob(base + '.png', await svgToPng(j.svg(), +$('c-scale').value, $('c-bg').value));
      else await saveBlob(base + '.svg', svgFile(j.svg()));
      note('Saved.');
    });
  });

  $('x-pdf').onclick = printPdf;
  $('x-html').onclick = () => busy($('x-html'), 'Preparing…', exportHtml);
  $('x-zip').onclick = () => busy($('x-zip'), 'Preparing…', () => exportCharts($('cards')._jobs || []));
  $('z-out').onclick = () => { state.zoom = Math.max(0.2, Math.round((state.zoom - 0.1) * 100) / 100); applyZoom(); };
  $('z-in').onclick = () => { state.zoom = Math.min(2, Math.round((state.zoom + 0.1) * 100) / 100); applyZoom(); };
  $('z-fit').onclick = () => { state.zoom = fitZoom(); applyZoom(); };
  // a narrower window shrinks the pages to fit; a wider one keeps the zoom the reader chose
  let rz = 0;
  addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(() => { if (state.zoom != null && state.zoom > fitZoom()) { state.zoom = fitZoom(); applyZoom(); } }, 120); });

  // Inside the claude.ai viewer pages cannot open a print dialog: the HTML download is the way to a PDF.
  if (inViewer) {
    $('x-pdf').hidden = true; $('x-report').classList.add('one');
    $('x-html').classList.replace('ghost', 'primary');
    $('x-html').textContent = 'Download report (HTML)';
    $('where').textContent = 'To save a PDF directly, open hub.html from the repo in Chrome or Edge';
  }

  // start with the sample, options as in the page viewer's defaults
  $('o-fill').value = 'typical'; $('o-scales').value = 'single'; $('o-extras').checked = true; $('o-marks').checked = false;
  renderChartPicker();
  listSamples();
  useSample('sample-360');
  // hub.html?report=ff opens on the Full Form (&version=corporate on one of its versions)
  const qs = new URLSearchParams(location.search);
  if (qs.get('report') === 'ff') setReport('ff').then(() => { if (qs.get('version') && window.TEIQ_FF_TEXT.versions[qs.get('version')]) setVersion(qs.get('version')); });
})();
