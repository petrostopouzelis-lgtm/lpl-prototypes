// Builds the report's content from one data file and the text library.
// Output is a list of sections, each a list of HTML blocks. The PDF paginator and the
// web view both consume this, so the two outputs always carry the same content.
//
// The pages and their wording follow the 2010 TEIQue 360 sample report and nothing else:
// about, what the TEIQue measures, report contents, rater groups, global score, profile,
// one section per factor (charts and text), development suggestions, action plan,
// acknowledgement, coach data. Three pages that report never had (summary graph, perception map,
// gap chart) follow the profile page; opt.extras === false leaves them out.
(function (root) {
  const T = root.TEIQ, S = T.svg, C = T.charts, R = (T.report = T.report || {});
  const esc = S.esc;
  const fmt = (t, vars) => String(t).replace(/\{(\w+)\}/g, (m, k) => (vars[k] != null ? vars[k] : m));
  const P = (t, cls) => `<p${cls ? ` class="${cls}"` : ''}>${esc(t)}</p>`;
  const paras = t => String(t).split(/\n\n+/).map(x => P(x)).join('');
  const chart = (svg, width, cls) => `<div class="chart${cls ? ' ' + cls : ''}"${width ? ` style="width:${width}pt"` : ''}>${svg}</div>`;
  const FILLER = 'This paragraph stands in for text that has not been written yet, so that the page shows a realistic amount of copy and the layout can be judged. It will be replaced by the approved wording for this score.';

  R.build = (data, lib, opt = {}) => {
    const v = T.view(data, opt.view), pg = lib.pages, fill = opt.fill || 'typical', st = data.settings || {};
    const year = String(data.report.date || '').slice(0, 4) || new Date().getFullYear();
    // which score picks the wording for a scale: the person's own (as in the 2010 report) or the raters' average
    const follows = st.textFollows === 'others' ? 'others' : 'self';
    const bandFor = id => T.bandOf(follows === 'others' ? v.others[id] : v.self[id]);
    const sections = [];
    const add = (id, title, color, blocks, extra) => sections.push(Object.assign({ id, title, color, blocks: blocks.filter(Boolean), kind: 'flow' }, extra));
    // A small "Added" tag on whatever the 2010 report did not have: the three extra pages, charts
    // with no counterpart there, and data a redrawn chart shows on top of the original.
    // opt.marks === false leaves the tags out (the finished report, the web view).
    const mark = what => opt.marks === false ? '' : `<span class="added">${esc(what)}</span>`;
    const head = (eyebrow, title, tag) => `<div>${eyebrow ? `<div class="eyebrow">${esc(eyebrow)}</div>` : ''}<h1 class="title">${esc(title)}${tag ? mark(tag) : ''}</h1></div>`;
    const chartTag = (svg, tag, width, cls) => `<div class="chart${cls ? ' ' + cls : ''}"${width ? ` style="width:${width}pt"` : ''}>${svg}${mark(tag)}</div>`;

    // wording the library does not have yet is shown as a visible marker plus filler
    const needed = (what, n) => {
      let out = `<div class="needed">Text needed: ${esc(what)}</div>`;
      const count = fill === 'none' ? 0 : fill === 'long' ? n * 4 : n;
      for (let i = 0; i < count; i++) out += `<p class="filler">${esc(FILLER + (i % 2 ? '' : ' ' + FILLER))}</p>`;
      return out;
    };
    const interpretation = id => {
      const band = bandFor(id), t = lib.scales[id].interpretation[band.id];
      return t ? paras(t) : needed(`interpretation for ${T.nameOf(id)} in the ${band.label} band`, 2);
    };
    const scorers = id => {
      const sc = lib.scales[id], box = t => `<div class="card"><p>${esc(t).replace(/^((?:Low|High) Scorers)/, '<b>$1</b>')}</p></div>`;
      return sc.low_scorers || sc.high_scorers ? `<div class="scorers">${sc.low_scorers ? box(sc.low_scorers) : ''}${sc.high_scorers ? box(sc.high_scorers) : ''}</div>` : '';
    };

    // ---- cover
    sections.push({ id: 'cover', kind: 'cover', title: 'Cover',
      html: `<img class="bg" src="assets/cover.jpg" alt=""><div class="legal">${esc(lib.footer.legal)}</div>
        <div class="box"><div><div class="t"><b>TEIQ<i>ue</i> 360</b> Report</div><div class="n">${esc(data.subject.name)}</div></div></div>
        <div class="cr">${esc(fmt(lib.footer.copyright, { year }))}</div>` });

    // ---- about trait emotional intelligence
    const half = Math.ceil(pg.about.list.length / 2), ul = items => `<ul>${items.map(t => `<li>${esc(t)}</li>`).join('')}</ul>`;
    add('about', pg.about.title, T.BLUE, [
      head(pg.section_intro, pg.about.title),
      `<div><h4 class="sub">${esc(pg.about.what_title)}</h4>${pg.about.what.map(t => P(t)).join('')}</div>`,
      `<div><h4 class="sub">${esc(pg.about.why_title)}</h4>${pg.about.why.map(t => P(t)).join('')}</div>`,
      `<div class="card list2">${ul(pg.about.list.slice(0, half))}${ul(pg.about.list.slice(half))}</div>`,
      `<div>${pg.about.after.map(t => P(t)).join('')}</div>`
    ]);

    // ---- what the TEIQue measures
    const fmap = `<div class="fmap">${T.GROUPS.map(g => `<div class="grp" style="--f:${g.fill};--l:${g.light}"><div class="chip">${esc(g.name)}</div><div class="rows">${g.facets.map(f =>
      `<div class="r"><div class="chip f">${esc(T.nameOf(f))}</div><span>${esc(lib.scales[f].short || '')}</span></div>`).join('')}</div></div>`).join('')}</div>`;
    add('measures', pg.measures.title, T.BLUE, [
      head(pg.section_intro, pg.measures.title),
      `<div><h4 class="sub">${esc(pg.measures.index_title)}</h4>${P(pg.measures.index)}</div>`,
      `<div><h4 class="sub">${esc(pg.measures.factors_title)}</h4>${P(pg.measures.factors)}</div>`,
      fmap
    ]);

    // ---- report contents
    add('contents', pg.contents.title, T.BLUE, [
      head(pg.section_intro, pg.contents.title),
      `<div>${pg.contents.paragraphs.map(t => P(fmt(t, { norm: data.report.norm || '' }))).join('')}</div>`,
      `<div><h4 class="sub">${esc(pg.contents.list_title)}</h4><div class="items">${pg.contents.items.map(it => `<div class="card"><h5>${esc(it.t)}</h5>${P(it.d)}</div>`).join('')}</div></div>`
    ]);

    // ---- rater groups
    const sub = data.subject, yrs = sub.time_in_role_years;
    const you = [sub.role ? `${pg.raters.role}: ${sub.role}` : '', yrs != null ? `${pg.raters.time}: ${yrs} ${yrs === 1 ? 'year' : 'years'}` : ''].filter(Boolean);
    const withRaters = v.groups.filter(g => g.responded > 0);
    const groupList = withRaters.map(g => `<div class="rg"><h5>${esc(g.label)} (${g.responded})</h5>${(g.raters || []).map(r =>
      `<div class="rl"><span>${esc(r.name)}</span><span>${esc(fmt(pg.raters.line, { years: r.known_years, contact: r.contact }))}</span></div>`).join('')}</div>`).join('');
    add('raters', pg.raters.title, T.BLUE, [
      head(pg.section_intro, pg.raters.title),
      you.length ? `<div><h4 class="sub">${esc(pg.raters.you)}</h4>${you.map(t => P(t, 'tight')).join('')}</div>` : '',
      chartTag(C.raters(v), 'Added chart'),
      `<div><h4 class="sub">${esc(fmt(pg.raters.all, { n: v.responded }))}</h4><div class="card rgs">${groupList}</div></div>`
    ]);

    // ---- global score
    add('global', pg.global.title, T.GLOBAL.text, [
      head(pg.section_results, pg.global.title),
      `<div class="stack">${chartTag(C.gauge(v, 'global'), 'Added: your own score', 236, 'center')}<p class="note mid">${esc(fmt(pg.global.caption, { n: v.responded }))}</p></div>`,
      { html: `<div><div class="card">${interpretation('global')}</div></div>`, split: '.card' }
    ]);

    // ---- profile
    add('profile', pg.profile.title, T.BLUE, [head(pg.section_results, pg.profile.title), chartTag(C.wheel(v, { legendOthers: pg.profile.legend_others && fmt(pg.profile.legend_others, { n: v.responded }), legendYou: pg.profile.legend_self }), 'Added: Global scores in the centre'), P(pg.profile.paragraph)]);

    // ---- pages the 2010 report did not have: summary graph, perception map, gap chart
    // (kept at Petros's request, 2026-11-11; opt.extras === false leaves them out)
    if (opt.extras !== false && lib.extras) {
      const ex = lib.extras, agree = (ex.comparison && ex.comparison.agree_within) || 10;
      const facets = T.FACET_ORDER.map(id => ({ id, name: T.nameOf(id), g: T.groupOf(id), self: v.self[id], oth: v.others[id], gap: v.gap(id) }));
      const list = (items, none) => items.length ? items.map(f => `<div class="li" style="--c:${f.g.fill}"><i></i>${esc(f.name)}<span>${f.oth} · you ${f.self}</span></div>`).join('') : `<div class="none">${esc(none)}</div>`;
      const strengths = facets.filter(f => f.self >= 71 && f.oth >= 71).sort((a, b) => b.oth - a.oth).slice(0, 4);
      const hiddenS = facets.filter(f => f.gap > agree).sort((a, b) => b.gap - a.gap).slice(0, 4);
      const blind = facets.filter(f => f.gap < -agree).sort((a, b) => a.gap - b.gap).slice(0, 4);
      add('summary', ex.summary.title, T.BLUE, [head('', ex.summary.title, 'Added page'), chart(C.summary(v))]);
      add('map', ex.map.title, T.BLUE, [head('', ex.map.title, 'Added page'), chart(C.map(v), 460, 'center'), P(ex.map.caption, 'note'),
        `<div class="cols3"><div class="card mini"><h5>${esc(ex.map.strengths)}</h5>${list(strengths, ex.map.none)}</div><div class="card mini"><h5>${esc(ex.map.hidden)}</h5>${list(hiddenS, ex.map.none)}</div><div class="card mini"><h5>${esc(ex.map.blind)}</h5>${list(blind, ex.map.none)}</div></div>`]);
      add('gap', ex.gap.title, T.BLUE, [head('', ex.gap.title, 'Added page'), P(ex.gap.caption), chart(C.gap(v, { agree }))]);
    }

    // ---- one section per factor: the factor, then each of its facets, each with its chart and its text
    // every scale shows its score wheel (you and others) with its rater-group strip.
    // opt.scales: 'single' (default) gives every factor and facet a page of its own, with a large
    // wheel above a full-width strip; 'pair' puts a small wheel beside the strip and lets two
    // scales share a page (the web view uses it).
    const single = opt.scales !== 'pair';
    const scoreCharts = id => single
      ? `<div class="scores big">${mark('Added: score wheel, all-others average')}<div class="chart wheel">${C.gauge(v, id)}</div><div class="chart strip">${C.strip(v, id)}</div></div>`
      : `<div class="scores">${mark('Added: score wheel, all-others average')}<div class="chart wheel">${C.gauge(v, id, { compact: true })}</div><div class="chart strip">${C.strip(v, id, { width: 324 })}</div></div>`;
    const scaleBlock = (id, heading) => ({ split: '.card',
      html: `<div>${heading ? `<h4 class="sub">${esc(T.nameOf(id))}</h4>` : ''}${scoreCharts(id)}<div class="card">${interpretation(id)}</div></div>` });
    T.GROUPS.forEach(g => {
      const lead = g.scored ? lib.scales[g.id].short : pg.independent.short;
      const blocks = [head(pg.section_results, g.name), lead ? P(lead, 'lead') : ''];
      if (g.scored) blocks.push(scaleBlock(g.id, false), scorers(g.id));
      if (single) {
        // the independent facets have no factor score, so their first facet opens the section
        const own = g.scored ? g.facets : g.facets.slice(1);
        if (!g.scored) blocks.push(scaleBlock(g.facets[0], true), scorers(g.facets[0]));
        add(g.id, g.name, g.text, blocks);
        own.forEach(f => add(f, T.nameOf(f), g.text, [head(g.name, T.nameOf(f)), scaleBlock(f, false), scorers(f)], { parent: g.id }));
      } else {
        g.facets.forEach(f => blocks.push(scaleBlock(f, true), scorers(f)));
        add(g.id, g.name, g.text, blocks);
      }
    });

    // ---- development suggestions: facets whose score is outside the average band
    const flagged = T.FACET_ORDER.filter(id => bandFor(id).id !== 'average');
    if (flagged.length) {
      const dev = [head('', pg.development.title)];
      flagged.forEach(id => {
        const g = T.groupOf(id), band = bandFor(id), items = lib.scales[id].development[band.id] || [];
        const body = items.length ? items.map(it => `<p><b>${esc(it.heading)}:</b> ${esc(it.body)}</p>`).join('') : needed(`development suggestions for ${T.nameOf(id)} in the ${band.label} band`, 2);
        dev.push({ html: `<div style="--c:${g.text}"><div class="dev-head"><h3>${esc(T.nameOf(id))}</h3></div><div class="card dev">${body}</div></div>`, split: '.card' });
      });
      add('development', pg.development.title, T.BLUE, dev);
    }

    // ---- action plan
    add('plan', pg.plan.title, T.BLUE, [head('', pg.plan.title),
      `<div class="plan">${pg.plan.columns.map(c => `<div class="h">${esc(c)}</div>`).join('')}${'<div class="cell"></div>'.repeat(9)}</div>`]);

    // ---- acknowledgement
    add('ack', pg.ack.title, T.BLUE, [head('', pg.ack.title),
      `<div>${pg.ack.paragraphs.map(t => P(t)).join('')}</div>`,
      `<div class="ack">${pg.ack.notes.map(n => `<h5>${esc(n.h)}</h5>${P(n.p)}`).join('')}</div>`]);

    // ---- coach data
    const raw = data.self_raw, cell = (cls, val) => `<td${cls ? ` class="${cls}"` : ''}>${val == null ? '' : val}</td>`;
    const row = (id, strong) => {
      const g = id === 'global' ? T.GLOBAL : T.groupOf(id);
      return `<tr${strong ? ' class="head"' : ''} style="--c:${g.text}"><td>${esc(id === 'global' ? 'Global Trait EI' : T.nameOf(id))}</td>${raw ? cell('', raw[id]) : ''}${cell('you', v.self[id])}${cell('oth', v.others[id])}</tr>`;
    };
    const cols = `${raw ? `<th>${esc(pg.coach.raw)}</th>` : ''}<th>${esc(pg.coach.self)}</th><th>${esc(pg.coach.average)}</th>`;
    const rows = row('global', true) + T.GROUPS.filter(g => g.scored).map(g => row(g.id, true)).join('')
      + `<tr class="sep"><th>${esc(pg.coach.facets)}</th>${cols}</tr>` + T.FACET_ORDER.map(f => row(f, false)).join('');
    const dd = String(data.report.date || '').split('-'), date = dd.length === 3 ? `${dd[2]}/${dd[1]}/${dd[0]}` : data.report.date || '';
    const meta = [[pg.coach.id, data.report.id], [pg.coach.norm, data.report.norm], [pg.coach.date, date]];
    add('coach', pg.coach.title, T.BLUE, [head('', pg.coach.title),
      data.report.valid ? `<p class="valid">${esc(pg.coach.valid)}</p>` : '',
      `<div class="coachrow"><div class="card"><table class="coach"><thead><tr><th>${esc(pg.coach.scale || '')}</th>${cols}</tr></thead><tbody>${rows}</tbody></table></div>
        <div class="card meta">${meta.map(([k, val]) => `<div><b>${esc(k)}</b>${esc(val == null ? '' : val)}</div>`).join('')}</div></div>`]);

    sections.push({ id: 'back', kind: 'back', title: 'Back cover', html: '<img class="bg" src="assets/back-cover.jpg" alt="">' });

    return {
      sections,
      meta: { product: 'TEIQ<i>ue</i> 360', name: data.subject.name, date: data.report.date, copyright: fmt(lib.footer.copyright, { year }),
        watermark: !!st.watermark || opt.watermark, watermarkText: 'London Psychometric Laboratory Sample' }
    };
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = T;
})(typeof window !== 'undefined' ? window : globalThis);
