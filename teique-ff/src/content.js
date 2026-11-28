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
  // an interpretation card: its paragraphs, with the library's card headings ("Possible Positive") as headings.
  // A heading and the paragraph after it stay together, so a card split across pages never ends on a heading.
  const cardParas = (t, heads) => {
    const parts = String(t).split(/\n\n+/), out = [];
    for (let i = 0; i < parts.length; i++) {
      if (heads.includes(parts[i]) && i + 1 < parts.length) { out.push(`<div class="ch-group"><h5 class="ch">${esc(parts[i])}</h5>${P(parts[i + 1])}</div>`); i++; }
      else out.push(P(parts[i]));
    }
    return out.join('');
  };
  // "TEIQue" is set with an orange "ue" wherever it appears in a title (Figma)
  const brand = t => esc(t).replace(/TEIQue/g, 'TEIQ<i>ue</i>');
  const FILLER = 'This paragraph stands in for text that has not been written yet, so that the page shows a realistic amount of copy and the layout can be judged. It will be replaced by the approved wording for this score.';

  // The structure diagram: the 15-4-1 tree (sample page 4, Figma 238:1481).
  const tree = top => `<div class="tree"><div class="chip top" style="--on:${T.colourCard({ fill: '#42A2DA', light: '#6FB9E4' }).color}">${esc(top)}</div><div class="cols">${T.GROUPS.map(g =>
    `<div class="col" style="--f:${g.fill};--l:${g.light};--on:${T.colourCard(g).color}"><div class="chip">${esc(g.name)}</div>${g.facets.map(f => `<div class="chip f">${esc(T.nameOf(f))}</div>`).join('')}</div>`).join('')}</div></div>`;

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

  // The version (Personal, Corporate, Leadership...) picks the wording: opt.version, else the data file's
  // report.version, else Personal. Each version's pages, definitions and interpretations are in
  // lib.versions[version]; the page design is the same.
  F.versionOf = (data, lib, want) => [want, data && data.report && data.report.version].find(x => x && lib.versions[x]) || 'personal';
  // opt.assets: where the 360's back cover and logo images are, seen from the page (the Report Hub sits next
  // to them); opt.covers: where the design system's report covers are; opt.fill and opt.watermark as in the 360
  F.covers = 'assets/covers/';
  // A cover: the design system's cover picture without its name card and copyright (tools/clean-covers.py), with a
  // new card in the same place (the report title, the first word in the cover's accent colour, and the person's
  // name; it widens for a long name) and the current copyright line. Positions come from lib.covers.
  F.cover = (lib, image, title, name, copyright, base) => {
    const L = lib.covers[image.replace(/\.png$/, '')], c = L.card, r = L.copyright;
    const [first, ...rest] = String(title).split(' ');
    // type sizes from the measured cap heights (Inter's cap height is 0.727 of its size; the name's "J" dips a
    // little below the baseline, so it measures 0.70), checked against the width of the original lines; a line
    // set at line-height 1 has its cap top 0.137 em and its baseline 0.864 em below the line's top
    const tSize = c.title_cap / 0.727, nSize = c.name_cap / 0.70, f = v => Math.round(v * 10) / 10;
    const tTop = c.title_cap_top - c.y - 0.137 * tSize, nTop = c.name_baseline - c.y - 0.864 * nSize, gap = nTop - tTop - tSize;
    // copyright: 13pt (the original line's width); its measured bottom is the parentheses', 0.19 em below the baseline
    const crSize = 13, crTop = r.bottom - (0.19 + 0.864) * crSize;
    return `<img class="bg" src="${base}${image}" alt="">
      <div class="cv-card" style="top:${c.y}pt;min-width:${c.w}pt;height:${c.h}pt;padding-top:${f(tTop)}pt">
        <div class="cv-t" style="font-size:${f(tSize)}pt"><b style="color:${c.accent}">${esc(first)}</b> ${esc(rest.join(' '))}</div>
        <div class="cv-n" style="font-size:${f(nSize)}pt;margin-top:${f(gap)}pt">${esc(name)}</div></div>
      <div class="cv-cr" style="left:${r.cx}pt;top:${f(crTop)}pt;font-size:${crSize}pt;color:${r.color}">${esc(copyright)}</div>`;
  };
  // the cover generator's title line for a version: "TEIQue Personal Report • Full Form"
  F.coverTitles = (data, lib, version) => { const V = lib.versions[F.versionOf(data, lib, version)]; return { reportTitle: V.cover, subtitle: 'Full Form' }; };
  F.build = (data, lib, opt = {}) => {
    const ASSETS = opt.assets || '../teique-360/assets/', COVERS = opt.covers || F.covers;
    const ver = F.versionOf(data, lib, opt.version), V = lib.versions[ver], pg = V.pages, SC = V.scales, heads = lib.card_headings || [];
    const fill = opt.fill || 'typical', st = data.settings || {};
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
      const band = T.bandOf(data.self[id]), t = (SC[id].interpretation || {})[band.id];
      return t ? cardParas(t, heads) : needed(`interpretation for ${T.nameOf(id)} in the ${band.label} band`, 2);
    };

    // ---- cover: the version's cover from the design system (Petros, 2026-11-28: always the design-system covers),
    // its placeholder name and old copyright replaced by live text (F.cover). Editable covers come later.
    // opt.coverImage: the cover drawn from the person's scores by the cover generator (T.coverArt), which then
    // replaces the design-system cover; it carries its own title, name, date and legal line
    sections.push({ id: 'cover', kind: 'cover', title: 'Cover', html: opt.coverImage
      ? `<img class="bg" src="${opt.coverImage}" alt="${esc('TEIQue ' + V.cover + ': ' + data.subject.name)}">`
      : F.cover(lib, V.cover_image, V.cover, data.subject.name, fmt(lib.footer.copyright, { year }), COVERS) });

    if (V.template === 'recruitment') return recruitment();
    if (V.template === 'developmental') return developmental();

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
    // Corporate opens this page with "Factor and Facets", then the uses under their own title
    const uses = [head(pg.uses.title, pg.factors ? 'second' : ''), P(pg.uses.paragraph), `<div class="chart bubbles">${bubbles(pg.uses.items)}</div>`];
    if (pg.factors) add('uses', pg.factors.title, T.BLUE, [head(pg.factors.title), `<div>${pg.factors.paragraphs.map(t => P(t)).join('')}</div>`].concat(uses), { noToc: true });
    else add('uses', pg.uses.title, T.BLUE, uses, { noToc: true });

    // ---- wheel chart and summary graph
    add('wheel', pg.wheel.title, T.BLUE, [head(pg.wheel.title), `<div class="chart wheel-chart">${C.wheel(v, { single: true, label: 'TEIQue wheel chart' })}</div>`,
      `<figure class="quote"><blockquote>${esc(pg.wheel.quote)}</blockquote><figcaption>${esc(pg.wheel.quote_by)}</figcaption></figure>`], { tocTitle: ct.wheel });
    add('summary', pg.summary.title, T.BLUE, [head(pg.summary.title), `<div class="chart">${C.summary(v, { single: true, width: 540, label: 'TEIQue summary graph' })}</div>`], { tocTitle: ct.summary });

    // ---- one page per scale: title, lead line (Global and factors), definition beside the score wheel,
    // "Your Score", and the interpretation card for the person's band
    const scalePage = id => {
      const sc = SC[id];
      return [head(sc.title),
        `<div class="row can-tighten"><div class="txt">${sc.lead ? P(sc.lead, 'lead') : ''}${paras(sc.definition)}</div><div class="gauge chart">${C.gauge(v, id, { single: true })}</div></div>`,
        { html: `<div><h4 class="sub">${esc(pg.scale.your_score)}</h4><div class="card">${interpretation(id)}</div></div>`, split: '.card' }];
    };
    add('global', SC.global.title, T.GLOBAL.text, scalePage('global'), { tocTitle: ct.global });
    T.GROUPS.forEach(g => {
      if (g.scored) {
        add(g.id, SC[g.id].title, g.text, scalePage(g.id));
        g.facets.forEach(f => add(f, SC[f].title, g.text, scalePage(f), { parent: g.id }));
      } else {
        // the independent facets have no factor page: their first facet opens the entry
        const [first, ...rest] = g.facets;
        add(g.id, ct.independent, g.text, scalePage(first), { tocSubs: [{ title: SC[first].title }] });
        rest.forEach(f => add(f, SC[f].title, g.text, scalePage(f), { parent: g.id }));
      }
    });

    return finish();

    // ---- the end of every version: back cover, running header and footer
    function finish() {
      sections.push({ id: 'back', kind: 'back', title: 'Back cover', html: `<img class="bg" src="${ASSETS}back-cover.jpg" alt="">` });
      return {
      sections,
      version: ver,
      meta: { product: `TEIQ<i>ue</i> ${esc(V.header)}`, name: data.subject.name, date: data.report.date, copyright: fmt(lib.footer.copyright, { year }),
        logo: ASSETS + 'logo-monogram.png', tocSubNumbers: false,
        watermark: !!st.watermark || opt.watermark, watermarkText: 'London Psychometric Laboratory Sample' }
      };
    }

    // ---- Recruitment (its own template, sample "TEIQue-FF Recruitment Report"): introduction, summary graph,
    // Global Trait EI with the auxiliary facets, then one page per factor with all its facets. Each scale is a row:
    // a small score wheel beside a card (factor cards in the factor's colour). Seven score levels (V.levels).
    function recruitment() {
      const ct = pg.contents, levelOf = s => V.levels.find(l => s >= l.min && s <= l.max) || V.levels[0];
      const isAvg = l => ['low_average', 'average', 'high_average'].includes(l.id);
      const line = t => `<p class="${t.startsWith('•') ? 'rline bul' : 'rline'}">${esc(t)}</p>`;
      const card = id => {
        const sc = SC[id], lv = levelOf(data.self[id]), own = sc.interpretation[lv.id] || [];
        const open = line(fmt(V.opening, { name: sc.card_name, level: lv.label }));
        if (own.length) return open + own.map(line).join('');
        if (isAvg(lv)) return open + line(fmt(V.average_text, { name: sc.card_name }));
        return open + needed(`interpretation for ${T.nameOf(id)} at the ${lv.label} level`, 1);
      };
      const row = (id, heading, fill) => {
        const g = id === 'global' ? T.GLOBAL : T.groupOf(id);
        return `<div class="rrow can-tighten" style="--c:${g.text};--f:${g.fill}"><div class="rwheel chart">${C.gauge(v, id, { single: true })}</div>
          <div class="rbody">${heading ? `<h5 class="rh">${esc(heading)}</h5>` : ''}<div class="rcard${fill ? ' fill' : ''}"${fill ? ` style="${T.colourCard(g).style}"` : ''}>${card(id)}</div></div></div>`;
      };
      sections.push({ id: 'toc', kind: 'contents', title: ct.title, color: T.BLUE, headHtml: head(ct.title) });
      add('intro', pg.intro.title, T.BLUE, [head(pg.intro.title), `<div>${pg.intro.paragraphs.map(t => P(t)).join('')}</div>`,
        `<div class="signoff">${pg.intro.signoff.map(t => P(t)).join('')}</div>`], { tocTitle: ct.intro });
      add('summary', pg.summary.title, T.BLUE, [head(pg.summary.title), `<div class="chart">${C.summary(v, { single: true, width: 540, label: 'TEIQue summary graph' })}</div>`], { tocTitle: ct.summary });
      add('global', pg.global.title, T.GLOBAL.text, [head(pg.global.title), P(pg.global.lead), row('global', '', true)], { tocTitle: ct.global, mergeNext: true });
      const ind = T.GROUPS.find(g => !g.scored);
      add('auxiliary', pg.auxiliary.title, ind.text, [head(pg.auxiliary.title, 'second')].concat(pg.auxiliary.facets.map((f, i) => row(f, pg.auxiliary.headings[i]))),
        { tocTitle: ct.auxiliary, tocSubs: ct.subs.auxiliary.map(title => ({ title })) });
      pg.factors.forEach(fp => {
        const g = T.groupOf(fp.id);
        add(fp.id, fp.title, g.text, [head(fp.title), P(fp.lead), row(fp.id, '', true)].concat(fp.facets.map(f => row(f, SC[f].heading))),
          { tocTitle: ct.factors[fp.id], tocSubs: ct.subs[fp.id].map(title => ({ title })) });
      });
      return finish();
    }

    // ---- Developmental (its own template, sample "TEIQue-FF Developmental Report", Figma 442:695 to 442:837):
    // introduction, wheel chart, summary graph, then each factor (a paragraph beside its score wheel, a card of
    // pointers) followed by its facets (the facet name beside its score wheel, then headed cards).
    function developmental() {
      const ct = pg.contents;
      const textFor = id => (SC[id].interpretation || {})[T.bandOf(data.self[id]).id];
      const gauge = id => `<div class="gauge chart">${C.gauge(v, id, { single: true })}</div>`;
      const factorPage = id => {
        const t = textFor(id), band = T.bandOf(data.self[id]);
        if (!t) return [`<div class="dev-top factor"><h1 class="title">${brand(SC[id].title)}</h1>${gauge(id)}</div>`,
          { html: `<div><div class="card">${needed(`development pointers for ${T.nameOf(id)} in the ${band.label} band`, 2)}</div></div>`, split: '.card' }];
        return [head(SC[id].title), `<div class="row"><div class="txt">${P(t.intro)}</div>${gauge(id)}</div>`,
          { html: `<div><div class="card dev-list"><ul>${t.bullets.map(b => `<li>${esc(b)}</li>`).join('')}</ul></div></div>`, split: 'ul' }];
      };
      const facetPage = id => {
        const t = textFor(id), band = T.bandOf(data.self[id]);
        const top = `<div class="dev-top"><h1 class="title">${brand(SC[id].title)}</h1>${gauge(id)}</div>`;
        if (!t) return [top, { html: `<div><div class="card">${needed(`development suggestions for ${T.nameOf(id)} in the ${band.label} band`, 2)}</div></div>`, split: '.card' }];
        return [top, t.intro ? `<div class="card">${paras(t.intro)}</div>` : '']
          .concat(t.sections.map(x => ({ html: `<div class="dev-sec"><h5 class="caps">${esc(x.heading)}</h5><div class="card">${x.paragraphs.map(q => P(q)).join('')}</div></div>`, split: '.card' })));
      };
      sections.push({ id: 'toc', kind: 'contents', title: ct.title, color: T.BLUE, headHtml: head(ct.title) });
      add('intro', pg.intro.title, T.BLUE, [head(pg.intro.title), `<div>${pg.intro.paragraphs.map(t => P(t)).join('')}</div>`,
        `<div class="signoff">${pg.intro.signoff.map(t => P(t)).join('')}</div>`], { tocTitle: ct.intro });
      add('wheel', pg.wheel.title, T.BLUE, [head(pg.wheel.title), `<div class="chart wheel-chart">${C.wheel(v, { single: true, label: 'TEIQue wheel chart' })}</div>`,
        `<figure class="quote"><blockquote>${esc(pg.wheel.quote)}</blockquote><figcaption>${esc(pg.wheel.quote_by)}</figcaption></figure>`], { tocTitle: ct.wheel });
      add('summary', pg.summary.title, T.BLUE, [head(pg.summary.title), `<div class="chart">${C.summary(v, { single: true, width: 540, label: 'TEIQue summary graph' })}</div>`], { tocTitle: ct.summary });
      T.GROUPS.forEach(g => {
        if (g.scored) {
          add(g.id, SC[g.id].title, g.text, factorPage(g.id), { tocTitle: T.nameOf(g.id) });
          g.facets.forEach(f => add(f, SC[f].title, g.text, facetPage(f), { parent: g.id }));
        } else {
          const [first, ...rest] = g.facets;
          add(g.id, ct.independent, g.text, facetPage(first), { tocSubs: [{ title: SC[first].title }] });
          rest.forEach(f => add(f, SC[f].title, g.text, facetPage(f), { parent: g.id }));
        }
      });
      return finish();
    }
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = T;
})(typeof window !== 'undefined' ? window : globalThis);
