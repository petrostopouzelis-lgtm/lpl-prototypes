// The report cover, drawn from the person's scores by the cover generator (report-covers/, LPLCovers).
// The generator draws the whole A4 cover: logo, title line, the contour illustration made from the facet
// scores, name and date, legal line. This file only turns a report's data into the generator's data and
// returns the cover as a picture the report pages can use.
//
//   T.coverArt.available()                         the generator's scripts are loaded
//   await T.coverArt.render(data, { reportTitle, subtitle, scores, layout, scale })   -> image URL (JPEG data URL)
//     data      the report data file (subject.name, report.date)
//     scores    { id: percentile } in the report's scale ids (data.self by default); only facets are used,
//               the generator works out factors and Global from them
//     layout    'pill' (default) or 'plain', the generator's cover layouts
//     scale     pixels per point; 300/72 (300 dpi, 2480 x 3508) by default
// The covers' look (contours with facet spokes and spheres, the saved finish) is the generator's own default.
(function (root) {
  const T = root.TEIQ, CA = (T.coverArt = T.coverArt || {});
  // where the generator is, relative to the page: next to the report's folder in the repo, or (published hub)
  // inside it. The LPL logo is the design system's, found the same way.
  CA.bases = ['../report-covers/', 'report-covers/'];
  // The LPL logo comes as a data URL in src/cover-logo.js (written by tools/build-hub-embed.js from the design
  // system's lpl-logo-blue-horizontal.webp): an image file opened from disk would taint the canvas, and the
  // finished cover could not be exported.
  const HERE = document.currentScript ? document.currentScript.src.replace(/cover-art\.js.*$/, '') : '';
  CA.available = () => !!(root.LPLCovers && root.LPLCovers.renderCover && root.LPLCovers.THEORIES);

  // load the generator's scripts (theories, shapes, layout) once
  let loading = null;
  CA.load = () => loading || (loading = (async () => {
    if (CA.available()) return true;
    const v = root.HUB_V || '';
    const script = src => new Promise((res, rej) => { const s = document.createElement('script'); s.src = src + v; s.onload = res; s.onerror = () => { s.remove(); rej(new Error('Could not load ' + src)); }; document.head.appendChild(s); });
    for (const base of CA.bases) {
      try { await script(base + 'src/theories.js'); } catch (e) { continue; }
      for (const f of ['src/cover.js', 'src/radial.js', 'src/layout.js']) await script(base + f);
      if (!root.TEIQ_COVER_LOGO) await script(HERE + 'cover-logo.js').catch(() => null);
      root.LPLCovers.LOGO_SRC = root.LPLCovers.LOGO_SRC || root.TEIQ_COVER_LOGO;
      return true;
    }
    throw new Error('The cover generator (report-covers/) was not found');
  })().catch(e => { loading = null; throw e; }));

  // the generator names facets in sentence case ("Self-esteem"); ours are ids ("self_esteem")
  const facetsOf = scores => {
    const L = root.LPLCovers.THEORIES.teique, out = {};
    const all = L.factors.flatMap(f => f.facets).concat(L.independent ? L.independent.facets : []);
    T.FACET_ORDER.forEach(id => {
      const name = all.find(n => n.toLowerCase() === T.nameOf(id).toLowerCase());
      if (name && scores[id] != null) out[name] = scores[id];
    });
    return out;
  };
  const dmy = iso => { const d = String(iso || '').split('-'); return d.length === 3 ? `${d[2]}/${d[1]}/${d[0]}` : String(iso || ''); };

  const cache = new Map();
  CA.render = async (data, opt = {}) => {
    await CA.load();
    const L = root.LPLCovers;
    await L.ready();
    const scores = opt.scores || data.self;
    const d = { theory: 'teique', type: 'individual', name: data.subject.name, date: dmy(data.report.date),
      reportTitle: opt.reportTitle, subtitle: opt.subtitle, people: [{ name: data.subject.name, facets: facetsOf(scores) }] };
    const o = { shape: 'contours', guide: true, layout: opt.layout || 'pill', scale: opt.scale || 300 / 72 };
    const key = JSON.stringify([d, o]);
    if (cache.has(key)) return cache.get(key);
    const canvas = document.createElement('canvas');
    L.renderCover(canvas, d, o);
    const url = canvas.toDataURL('image/jpeg', 0.92);
    cache.set(key, url);
    return url;
  };
})(typeof window !== 'undefined' ? window : globalThis);
