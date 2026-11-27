// TEIQue Full Form report: builds the pages' content from one data file and the text library.
// Output is the same list of sections the 360 report makes, so the 360's paginator
// (teique-360/src/report/paginate.js) lays it out on A4 and its charts draw the scores.
//
// The pages follow the 2025 Personal/Counselling sample and the Figma frames for the TEIQue report
// (file OABrZx0GBrroCvGFQfj89Z, page "TEIQue + TSIQue"): cover, contents, introduction, structure,
// uses, wheel chart, summary graph, Global score, then each factor and its facets, back cover.
// All wording comes from text/library.json; a missing band shows a "Text needed" marker.
(function (root) {
  const T = root.TEIQ, S = T.svg, C = T.charts, F = (T.ff = T.ff || {});
  const esc = S.esc;
  const fmt = (t, vars) => String(t).replace(/\{(\w+)\}/g, (m, k) => (vars[k] != null ? vars[k] : m));
  const P = (t, cls) => `<p${cls ? ` class="${cls}"` : ''}>${esc(t)}</p>`;
  const paras = t => String(t).split(/\n\n+/).map(x => P(x)).join('');
  // "TEIQue" is set with an orange "ue" wherever it appears in a title (Figma)
  const brand = t => esc(t).replace(/TEIQue/g, 'TEIQ<i>ue</i>');
  const FILLER = 'This paragraph stands in for text that has not been written yet, so that the page shows a realistic amount of copy and the layout can be judged. It will be replaced by the approved wording for this score.';

  // The structure diagram: the 15-4-1 tree (sample page 4, Figma 238:1481).
  const tree = top => `<div class="tree"><div class="chip top">${esc(top)}</div><div class="cols">${T.GROUPS.map(g =>
    `<div class="col" style="--f:${g.fill};--l:${g.light}"><div class="chip">${esc(g.name)}</div>${g.facets.map(f => `<div class="chip f">${esc(T.nameOf(f))}</div>`).join('')}</div>`).join('')}</div></div>`;

  // The uses of the report: overlapping circles in rows of 4, 5 and 6, blue and orange in turn
  // (sample page 5, Figma 238:1515).
  function bubbles(items) {
    const rows = [4, 5, 6], r = 43, dx = 80, dy = 70, W = 6 * dx + 2 * r - dx + 4, top = r + 2;
    const blue = ['#7CC3EC', '#3C9BD6'], orange = ['#F8B27E', '#EF8A45'];
    let out = '', k = 0, defs = '';
    const gid = S.id('bub');
    defs += `<radialGradient id="${gid}-b" cx="40%" cy="30%" r="80%"><stop offset="0" stop-color="${blue[0]}"/><stop offset="1" stop-color="${blue[1]}"/></radialGradient>`;
    defs += `<radialGradient id="${gid}-o" cx="40%" cy="30%" r="80%"><stop offset="0" stop-color="${orange[0]}"/><stop offset="1" stop-color="${orange[1]}"/></radialGradient>`;
    defs += `<filter id="${gid}-sh" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity=".18"/></filter>`;
    // wrap a label into lines of at most ~13 characters, whole words only
    const wrap = t => t.split(' ').reduce((ls, w) => { const last = ls[ls.length - 1]; if (last && (last + ' ' + w).length <= 13) ls[ls.length - 1] = last + ' ' + w; else ls.push(w); return ls; }, []);
    rows.forEach((n, ri) => {
      const x0 = W / 2 - (n - 1) * dx / 2, cy = top + ri * dy;
      for (let i = 0; i < n && k < items.length; i++, k++) {
        const cx = x0 + i * dx, isBlue = (i + ri) % 2 === 0;
        out += S.el('circle', { cx, cy, r, fill: `url(#${gid}-${isBlue ? 'b' : 'o'})`, 'fill-opacity': 0.94, filter: `url(#${gid}-sh)` });
        const ls = wrap(items[k]), lh = 10.5, y0 = cy - (ls.length - 1) * lh / 2 + 3.4;
        out += ls.map((l, j) => S.text(cx, y0 + j * lh, l, { 'text-anchor': 'middle', 'font-size': 9, 'font-weight': 600, fill: '#fff' })).join('');
      }
    });
    return S.root(W, top + (rows.length - 1) * dy + r + 6, `<defs>${defs}</defs>${out}`, items.join(', '));
  }

  // opt.assets: where the 360's cover, back cover and logo images are, seen from the page (the Report Hub
  // sits next to them); opt.fill and opt.watermark as in the 360 report
  F.build = (data, lib, opt = {}) => {
    const ASSETS = opt.assets || '../teique-360/assets/';
    const fill = opt.fill || 'typical', st = data.settings || {}, pg = lib.pages;
    const ver = lib.versions[data.report.version] ? data.report.version : 'personal', V = lib.versions[ver];
    const year = String(data.report.date || '').slice(0, 4) || new Date().getFullYear();
    // the charts read a "view" of the scores; the Full Form has one score per scale, the person's own
    const v = { data, self: data.self, others: data.self, groups: [], shownGroups: [], responded: 0, gap: () => 0 };
    const sections = [];
    const add = (id, title, color, blocks, extra) => sections.push(Object.assign({ id, title, color, blocks: blocks.filter(Boolean), kind: 'flow' }, extra));
    const head = (title, cls) => `<h1 class="title${cls ? ' ' + cls : ''}">${brand(title)}</h1>`;
    const needed = (what, n) => {
      let out = `<div class="needed">Text needed: ${esc(what)}</div>`;
      const count = fill === 'none' ? 0 : fill === 'long' ? n * 4 : n;
      for (let i = 0; i < count; i++) out += `<p class="filler">${esc(FILLER + (i % 2 ? '' : ' ' + FILLER))}</p>`;
      return out;
    };
    const interpretation = id => {
      const band = T.bandOf(data.self[id]), t = ((lib.scales[id].interpretation || {})[ver] || {})[band.id];
      return t ? paras(t) : needed(`interpretation for ${T.nameOf(id)} in the ${band.label} band`, 2);
    };

    // ---- cover: the 2026 cover template, as on the 360 report
    const cv = lib.cover || {};
    const cd = String(data.report.date || '').split('-'), coverDate = cd.length === 3 ? `${cd[2]}/${cd[1]}/${cd[0]}` : data.report.date || '';
    const nameLen = String(data.subject.name).length, whoSize = nameLen > 24 ? Math.max(14, Math.round(22 * 24 / nameLen * 10) / 10) : 22;
    sections.push({ id: 'cover', kind: 'cover', title: 'Cover',
      html: `<img class="bg" src="${ASSETS}cover-2026.jpg" alt=""><div class="cr">${esc(fmt(lib.footer.copyright, { year }))}</div>
        <div class="ttl"><div>TEIQ<i>ue</i></div><div>${esc(V.cover || cv.report)}</div>${cv.form ? `<div class="form">${esc(cv.form)}</div>` : ''}</div>
        <div class="who" style="font-size:${whoSize}pt"><span>${esc(data.subject.name)}</span>${coverDate ? `<i></i><span>${esc(coverDate)}</span>` : ''}</div>
        <div class="legal">${esc(lib.footer.legal)}</div>` });

    // ---- contents: filled in by the paginator. Entries as in the sample and Figma: Introduction,
    // Wheel Chart, Summary Graphs, Global Score, each factor with its facets, Independent Facets.
    const ct = pg.contents;
    sections.push({ id: 'toc', kind: 'contents', title: ct.title, color: T.BLUE, headHtml: head(ct.title) });

    // ---- introduction, structure, uses: one contents entry, "Introduction"
    add('intro', pg.intro.title, T.BLUE, [head(pg.intro.title), `<div>${pg.intro.paragraphs.map(t => P(t)).join('')}</div>`], { tocTitle: ct.intro });
    const st4 = pg.structure, examples = [25, 50, 75].map(s => `<div class="ex">${C.gauge({ self: { global: s }, others: { global: s } }, 'global', { single: true, compact: true })}<span>${esc(T.bandOf(s).label)}</span></div>`).join('');
    add('structure', st4.title, T.BLUE, [head(st4.title), P(st4.paragraph), tree(st4.diagram_top),
      `<h4 class="sub blue">${esc(st4.scores_title)}</h4>`,
      { html: `<div><div class="card scores-card"><div class="lead-row">${P(st4.scores[0])}<div class="examples">${examples}</div></div>${st4.scores.slice(1).map(t => P(t)).join('')}</div></div>`, split: '.card' }],
      { noToc: true });
    add('uses', pg.uses.title, T.BLUE, [head(pg.uses.title), P(pg.uses.paragraph), `<div class="chart bubbles">${bubbles(pg.uses.items)}</div>`], { noToc: true });

    // ---- wheel chart and summary graph
    add('wheel', pg.wheel.title, T.BLUE, [head(pg.wheel.title), `<div class="chart wheel-chart">${C.wheel(v, { single: true, label: 'TEIQue wheel chart' })}</div>`,
      `<figure class="quote"><blockquote>${esc(pg.wheel.quote)}</blockquote><figcaption>${esc(pg.wheel.quote_by)}</figcaption></figure>`], { tocTitle: ct.wheel });
    add('summary', pg.summary.title, T.BLUE, [head(pg.summary.title), `<div class="chart">${C.summary(v, { single: true, width: 540, label: 'TEIQue summary graph' })}</div>`], { tocTitle: ct.summary });

    // ---- one page per scale: title, lead line (Global and factors), definition beside the score wheel,
    // "Your Score", and the interpretation card for the person's band
    const scalePage = id => {
      const sc = lib.scales[id];
      return [head(sc.title),
        `<div class="row"><div class="txt">${sc.lead ? P(sc.lead, 'lead') : ''}${paras(sc.definition)}</div><div class="gauge chart">${C.gauge(v, id, { single: true })}</div></div>`,
        { html: `<div><h4 class="sub">${esc(pg.scale.your_score)}</h4><div class="card">${interpretation(id)}</div></div>`, split: '.card' }];
    };
    add('global', lib.scales.global.title, T.GLOBAL.text, scalePage('global'), { tocTitle: ct.global });
    T.GROUPS.forEach(g => {
      if (g.scored) {
        add(g.id, lib.scales[g.id].title, g.text, scalePage(g.id));
        g.facets.forEach(f => add(f, lib.scales[f].title, g.text, scalePage(f), { parent: g.id }));
      } else {
        // the independent facets have no factor page: their first facet opens the entry
        const [first, ...rest] = g.facets;
        add(g.id, ct.independent, g.text, scalePage(first), { tocSubs: [{ title: lib.scales[first].title }] });
        rest.forEach(f => add(f, lib.scales[f].title, g.text, scalePage(f), { parent: g.id }));
      }
    });

    sections.push({ id: 'back', kind: 'back', title: 'Back cover', html: `<img class="bg" src="${ASSETS}back-cover.jpg" alt="">` });

    return {
      sections,
      meta: { product: `TEIQ<i>ue</i> ${esc(V.header)}`, name: data.subject.name, date: data.report.date, copyright: fmt(lib.footer.copyright, { year }),
        logo: ASSETS + 'logo-monogram.png', tocSubNumbers: false,
        watermark: !!st.watermark || opt.watermark, watermarkText: 'London Psychometric Laboratory Sample' }
    };
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = T;
})(typeof window !== 'undefined' ? window : globalThis);
