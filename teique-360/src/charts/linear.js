// Track-based charts: rater-group strip, summary (you vs others) and the gap chart.
// All of them use the report's three equal band tracks (Low, Average, High).
// Colour: others wear the factor gradient, you wear the deeper shade of the same factor
// (T.youStyle). No black or dark-ink marks. Bars use the Figma bar gradient: the full colour
// along the top edge, the light colour along the bottom.
(function (root) {
  const T = root.TEIQ, S = T.svg, C = (T.charts = T.charts || {});
  const n = S.n;
  const colour = id => (id === 'global' ? T.GLOBAL : T.groupOf(id));
  // one pair of vertical gradients per factor: -o- for others, -y- for you
  const gradDefs = (uid, opt) => '<defs>' + [T.GLOBAL].concat(T.GROUPS).map(g => { const Y = T.youStyle(opt.you, g); return S.vGrad(`${uid}-o-${g.id}`, g.fill, g.light) + S.vGrad(`${uid}-y-${g.id}`, Y.fill, Y.light); }).join('') + '</defs>';
  // marks reused across charts
  const dotOthers = (x, y, r, fill, tip) => S.el('circle', { cx: n(x), cy: n(y), r, fill, stroke: '#fff', 'stroke-width': 1.5 }, tip ? S.title(tip) : null);
  // you: a solid dot in the deeper shade, with a white ring so it stays clear on a bar of its own hue
  const dotYou = (x, y, r, Y, fill, tip) => (Y.hollow ? '' : S.el('circle', { cx: n(x), cy: n(y), r: r + 1.7, fill: '#fff' })) +
    S.el('circle', { cx: n(x), cy: n(y), r, fill, stroke: Y.hollow ? Y.edge : null, 'stroke-width': Y.hollow ? 1.8 : null }, tip ? S.title(tip) : null);

  // ---------------------------------------------------------------- rater-group strip
  // One scale, every rater group. Variants: A labelled markers on one track.
  // B one row per group. C compact, letter chips with a key.
  C.strip = (v, id, opt = {}) => {
    const variant = opt.variant || 'A', g = colour(id), Y = T.youStyle(opt.you, g), self = v.self[id], oth = v.others[id];
    const uid = S.id('strip'), gO = `url(#${uid}-o-${g.id})`, gY = `url(#${uid}-y-${g.id})`, defs = gradDefs(uid, opt);
    const groups = v.shownGroups.map(gr => ({ label: gr.label, n: gr.responded, s: gr.scores[id] }));
    // with no group to show (all too small to name), the strip still shows you and all others
    const has = groups.length > 0, lo = has ? Math.min(...groups.map(q => q.s)) : oth, hi = has ? Math.max(...groups.map(q => q.s)) : oth;
    // opt.width: a narrower drawing, for the strip that sits next to the small score wheel
    const W = variant === 'B' ? 460 : opt.width || 460, gap = 5;
    // variant A puts the group labels in one row; when they cannot fit, in as many rows as they need
    const nRows = variant === 'A' ? Math.max(1, Math.ceil(groups.reduce((s, q) => s + S.tw(`${S.fit(q.label, 8.4, 112)} ${q.s}`, 8.4) + 9, 0) / (W - 4))) : 1;

    if (variant === 'B') {
      const lx = 124, x0 = 132, w = 286, rows = [{ label: 'You', s: self, kind: 'you' }, { label: `All others (${v.responded})`, s: oth, kind: 'others' }].concat(groups.map(q => ({ label: `${q.label} (${q.n})`, s: q.s, kind: 'group' })));
      const top = 22, pitch = 17, H = top + rows.length * pitch + 4;
      let out = defs + S.bandHeader(x0, 11, w, gap);
      const xs = T.trackX(self, x0, w, gap);
      out += S.el('line', { x1: n(xs), y1: top - 2, x2: n(xs), y2: H - 6, stroke: Y.edge, 'stroke-width': 0.8, 'stroke-dasharray': '2 2.5', opacity: 0.6 });
      rows.forEach((r, i) => {
        const y = top + i * pitch + 6, x = T.trackX(r.s, x0, w, gap), bold = r.kind !== 'group', ink = r.kind === 'you' ? Y.text : r.kind === 'others' ? g.text : T.MUTED;
        out += S.text(lx, y + 3.2, r.label, { 'text-anchor': 'end', 'font-size': 9, 'font-weight': bold ? 700 : 500, fill: ink });
        out += S.tracks(x0, y - 2.5, w, 5, gap);
        out += r.kind === 'you' ? dotYou(x, y, 4.6, Y, gY) : r.kind === 'others' ? dotOthers(x, y, 5.2, gO) : S.el('circle', { cx: n(x), cy: n(y), r: 3.8, fill: '#fff', stroke: g.fill, 'stroke-width': 1.4 });
        out += S.text(x0 + w + 10, y + 3.2, r.s, { 'font-size': 9, 'font-weight': bold ? 700 : 500, fill: ink, 'font-family': S.FONT_B });
      });
      return S.root(W, H, out, `${T.nameOf(id)} by rater group`);
    }

    const x0 = 20, w = W - 40, ty = variant === 'C' ? 26 : 40 + (nRows - 1) * 13, th = 12, cyT = ty + th / 2;
    let out = defs + S.tracks(x0, ty, w, th, gap);
    // pale bar from the lowest to the highest group, drawn per track so it never covers a gap
    const xl = T.trackX(lo, x0, w, gap) - 6, xh = T.trackX(hi, x0, w, gap) + 6, tw3 = (w - 2 * gap) / 3;
    for (let i = 0; i < 3; i++) {
      const a = Math.max(xl, x0 + i * (tw3 + gap)), b = Math.min(xh, x0 + i * (tw3 + gap) + tw3);
      if (has && b - a > 1) out += S.el('rect', { x: n(a), y: ty, width: n(b - a), height: th, rx: th / 2, fill: gO, 'fill-opacity': 0.42 }, S.title(`Groups range from ${lo} to ${hi}`));
    }
    const xo = T.trackX(oth, x0, w, gap), xs = T.trackX(self, x0, w, gap);

    if (variant === 'C') {
      // letter chips; a chip that would overlap its neighbour sits above the track
      out += dotYou(xs, cyT, 6.4, Y, gY, `You: ${self}`);
      const pts = groups.map(q => ({ ...q, x: T.trackX(q.s, x0, w, gap) })).sort((a, b) => a.x - b.x);
      let lastX = -99, lastUp = false;
      pts.forEach(q => {
        const up = q.x - lastX < 14 && !lastUp, y = up ? cyT - 15 : cyT;
        out += S.el('circle', { cx: n(q.x), cy: n(y), r: 6.3, fill: '#fff', stroke: g.fill, 'stroke-width': 1.2 }, S.title(`${q.label}: ${q.s}`));
        out += S.text(q.x, y + 2.6, q.label[0], { 'text-anchor': 'middle', 'font-size': 7.4, 'font-weight': 700, fill: Y.text });
        lastX = q.x; lastUp = up;
      });
      out += S.el('path', { d: `M${n(xo)} ${ty + th + 2}l4.5 7h-9z`, fill: g.fill }, S.title(`All others: ${oth}`));
      out += S.bandHeader(x0, 60, w, gap);
      const key = groups.map(q => `${q.label[0]} ${q.label}`).join('   ·   ');
      out += S.text(W / 2, 76, `${key}   ·   ▲ all others   ·   ● you`, { 'text-anchor': 'middle', 'font-size': 7.6, fill: T.MUTED });
      return S.root(W, 84, out, `${T.nameOf(id)} by rater group`);
    }

    // variant A: group labels in one row above, spread apart so they never overlap,
    // each joined to its marker by a leader line; you and all-others below
    const items = groups.map(q => ({ ...q, x: T.trackX(q.s, x0, w, gap), text: `${S.fit(q.label, 8.4, 112)} ${q.s}` })).sort((a, b) => a.x - b.x);
    items.forEach(q => { q.w = S.tw(q.text, 8.4); q.c = q.x; });
    const labelRows = Array.from({ length: nRows }, (_, r) => items.filter((q, i) => i % nRows === r));
    labelRows.forEach((row, ri) => {
      row.forEach(q => { q.up = ri * 13; });
      for (let pass = 0; pass < 60; pass++) {
        for (let i = 0; i < row.length - 1; i++) {
          const a = row[i], b = row[i + 1], need = (a.w + b.w) / 2 + 9 - (b.c - a.c);
          if (need > 0) { a.c -= need / 2; b.c += need / 2; }
        }
        row.forEach(q => { q.c = T.clamp(q.c, q.w / 2 + 2, W - q.w / 2 - 2); });
      }
    });
    // you first, so a group marker at the same score still shows on top of it
    out += dotYou(xs, cyT, 6.4, Y, gY, `You: ${self}`);
    // every leader line first, then every label, so a line never runs over another group's label
    items.forEach(q => { out += S.el('path', { d: `M${n(q.x)} ${ty}V${ty - 6}L${n(q.c)} ${ty - 17 - q.up}V${ty - 20 - q.up}`, fill: 'none', stroke: g.light, 'stroke-width': 0.8 }); });
    items.forEach(q => {
      out += S.text(q.c, ty - 24 - q.up, q.text, { 'text-anchor': 'middle', 'font-size': 8.4, 'font-weight': 500, fill: T.MUTED, stroke: '#fff', 'stroke-width': 2.6, 'paint-order': 'stroke', 'stroke-linejoin': 'round' });
      out += S.el('circle', { cx: n(q.x), cy: cyT, r: 3.7, fill: '#fff', stroke: g.fill, 'stroke-width': 1.5 }, S.title(`${q.label} (${q.n}): ${q.s}`));
    });
    const by = ty + th + 2;
    out += S.el('path', { d: `M${n(xo)} ${by}l5 8h-10z`, fill: g.fill }, S.title(`All others: ${oth}`));
    const tO = `All others ${oth}`, tY = `You ${self}`, close = Math.abs(xo - xs) < (S.tw(tO, 9.5) + S.tw(tY, 9.5)) / 2 + 8;
    const youLeft = xs <= xo, ly = by + 20;
    const put = (x, t, fill, side) => S.text(x, ly, t, { 'text-anchor': side, 'font-size': 9.5, 'font-weight': 700, fill });
    if (close) {
      const mid = (xo + xs) / 2;
      out += put(Math.min(youLeft ? xs : xo, mid) - 5, youLeft ? tY : tO, youLeft ? Y.text : g.text, 'end');
      out += put(Math.max(youLeft ? xo : xs, mid) + 5, youLeft ? tO : tY, youLeft ? g.text : Y.text, 'start');
    } else {
      out += put(T.clamp(xo, 34, W - 34), tO, g.text, 'middle') + put(T.clamp(xs, 20, W - 20), tY, Y.text, 'middle');
    }
    out += S.bandHeader(x0, ty + 50, w, gap);
    return S.root(W, ty + 56, out, `${T.nameOf(id)} by rater group`);
  };

  // ---------------------------------------------------------------- summary, you vs others
  // Layout follows the Figma bar graph (900:1667). Variants: A two bars per row.
  // B dot for each, joined by a line. C others bar with a marker for you.
  C.summary = (v, opt = {}) => {
    const variant = opt.variant || 'C', W = 540, lx = 16, x0 = 143, w = 318, gap = 5, vx = 476, uid = S.id('sum');
    const rows = [{ id: 'global', level: 0 }];
    T.GROUPS.forEach(g => { rows.push({ id: g.id, level: 1, scored: g.scored }); g.facets.forEach(f => rows.push({ id: f, level: 2 })); });
    let out = gradDefs(uid, opt) + S.bandHeader(x0, 14, w, gap), y = 34;
    const tw = (w - 2 * gap) / 3;
    [[1, x0], [30, x0 + tw + gap / 2], [70, x0 + 2 * tw + 1.5 * gap], [99, x0 + w]].forEach(([t, x]) => { out += S.text(x, 24.5, t, { 'text-anchor': 'middle', 'font-size': 8, fill: '#808080' }); });
    out += S.text(vx + 9, 14, 'Others', { 'text-anchor': 'middle', 'font-size': 8.5, 'font-weight': 700, fill: T.MUTED }) + S.text(vx + 43, 14, 'You', { 'text-anchor': 'middle', 'font-size': 8.5, 'font-weight': 700, fill: T.MUTED });

    rows.forEach(r => {
      const g = colour(r.id), Y = T.youStyle(opt.you, g), head = r.level < 2, h = head ? 13 : 9, gO = `url(#${uid}-o-${g.id})`, gY = `url(#${uid}-y-${g.id})`;
      if (r.level === 1) y += 10;
      const cyR = y + h / 2;
      out += S.text(lx, cyR + 3.6, T.nameOf(r.id), { 'font-size': head ? 11.5 : 11, 'font-weight': head ? 700 : 400, fill: g.text });
      if (r.scored !== false) {
        const self = v.self[r.id], oth = v.others[r.id], xs = T.trackX(self, x0, w, gap), xo = T.trackX(oth, x0, w, gap);
        const tip = `${T.nameOf(r.id)}: others ${oth}, you ${self}`;
        if (variant === 'A') {
          const hb = h - 4;
          out += S.tracks(x0, y, w, hb, gap) + S.trackFill(oth, x0, y, w, hb, gap, gO);
          out += S.trackFill(self, x0, y + hb + 1.5, w, 3, gap, Y.edge);
        } else if (variant === 'B') {
          out += S.tracks(x0, cyR - 2, w, 4, gap);
          out += S.el('line', { x1: n(xs), y1: n(cyR), x2: n(xo), y2: n(cyR), stroke: g.light, 'stroke-width': head ? 3 : 2.4, 'stroke-linecap': 'round' });
          out += dotOthers(xo, cyR, head ? 5.4 : 4.6, gO, tip) + dotYou(xs, cyR, head ? 4.6 : 3.9, Y, gY, tip);
        } else {
          out += S.tracks(x0, y, w, h, gap) + S.trackFill(oth, x0, y, w, h, gap, gO);
          out += dotYou(xs, cyR, h / 2 + 1.4, Y, gY, tip);
        }
        const num = { 'text-anchor': 'middle', 'font-size': head ? 10.5 : 10, 'font-family': S.FONT_B, 'font-weight': 700 };
        out += S.text(vx + 9, cyR + 3.4, oth, Object.assign({ fill: g.text }, num)) + S.text(vx + 43, cyR + 3.4, self, Object.assign({ fill: Y.text }, num));
      }
      y += h + (head ? 14 : 15);
    });
    // key, drawn in the first factor's colours
    const ky = y + 4, sw = T.GROUPS[0], YS = T.youStyle(opt.you, sw), kO = `url(#${uid}-o-${sw.id})`, kY = `url(#${uid}-y-${sw.id})`, lab = { 'font-size': 9.5, fill: T.MUTED };
    let key = '';
    if (variant === 'B') key = dotOthers(x0 + 6, ky, 4.6, kO) + S.text(x0 + 16, ky + 3.2, "Others' average", lab) + dotYou(x0 + 110, ky, 3.9, YS, kY) + S.text(x0 + 119, ky + 3.2, 'You', lab);
    else key = S.el('rect', { x: x0, y: ky - 4, width: 20, height: 8, rx: 4, fill: kO }) + S.text(x0 + 26, ky + 3.4, "Others' average", lab) +
      (variant === 'A' ? S.el('rect', { x: x0 + 108, y: ky - 1.5, width: 20, height: 3, rx: 1.5, fill: YS.edge }) + S.text(x0 + 134, ky + 3.2, 'You', lab)
        : dotYou(x0 + 121, ky, 4.6, YS, kY) + S.text(x0 + 131, ky + 3.4, 'You', lab));
    return S.root(W, ky + 12, out + key, 'Summary: you compared with others');
  };

  // ---------------------------------------------------------------- gap chart
  // Others minus you, per facet, sorted. Variants: A bars either side of zero.
  // B arrows from your score to others' score on the band tracks.
  // In A the bar wears the colour of whoever scored higher: the factor gradient where others
  // rate you higher, the deeper shade where you rate yourself higher.
  C.gap = (v, opt = {}) => {
    const variant = opt.variant || 'A', W = 540, agree = opt.agree == null ? 10 : opt.agree, uid = S.id('gap');
    const rows = T.FACET_ORDER.map(id => ({ id, self: v.self[id], oth: v.others[id], gap: v.gap(id) })).sort((a, b) => b.gap - a.gap);
    const top = 42, pitch = 30, H = top + rows.length * pitch + 22, lx = 124;
    const sign = d => (d > 0 ? '+' : d < 0 ? '−' : '±') + Math.abs(d);
    let out = gradDefs(uid, opt);

    if (variant === 'B') {
      const x0 = 136, w = 330, gapT = 5, sw = T.GROUPS[0], YS = T.youStyle(opt.you, sw);
      out += S.bandHeader(x0, 14, w, gapT) + S.text(W - 14, 14, 'Gap', { 'text-anchor': 'end', 'font-size': 7.5, 'font-weight': 700, fill: T.MUTED });
      rows.forEach((r, i) => {
        const g = T.groupOf(r.id), Y = T.youStyle(opt.you, g), y = top + i * pitch, xs = T.trackX(r.self, x0, w, gapT), xo = T.trackX(r.oth, x0, w, gapT), dir = xo >= xs ? 1 : -1;
        const tip = `${T.nameOf(r.id)}: you ${r.self}, others ${r.oth} (${sign(r.gap)})`;
        out += S.text(lx, y + 3.5, T.nameOf(r.id), { 'text-anchor': 'end', 'font-size': 10, 'font-weight': 500, fill: g.text });
        out += S.tracks(x0, y - 2.5, w, 5, gapT);
        // an arrow needs room; for small gaps show the two dots instead
        const far = Math.abs(xo - xs) > 20;
        if (far) {
          out += S.el('line', { x1: n(xs + dir * 5), y1: y, x2: n(xo - dir * 6), y2: y, stroke: g.fill, 'stroke-width': 2.4 });
          out += S.el('path', { d: `M${n(xo)} ${y}l${-dir * 7.5} -4.4v8.8z`, fill: g.fill });
        } else out += dotOthers(xo, y, 4.4, `url(#${uid}-o-${g.id})`, tip);
        out += dotYou(xs, y, 3.9, Y, `url(#${uid}-y-${g.id})`, tip);
        out += S.el('rect', { x: Math.min(xs, xo) - 6, y: y - 8, width: Math.abs(xo - xs) + 12, height: 16, fill: 'transparent' }, S.title(tip));
        out += S.text(W - 14, y + 3.5, sign(r.gap), { 'text-anchor': 'end', 'font-size': 9.5, 'font-weight': 700, fill: Math.abs(r.gap) <= agree ? T.MUTED : Y.text, 'font-family': S.FONT_B });
      });
      const ky = H - 12;
      out += dotYou(x0 + 6, ky, 3.9, YS, `url(#${uid}-y-${sw.id})`) + S.text(x0 + 15, ky + 3.2, 'You', { 'font-size': 8.5, fill: T.MUTED });
      out += S.el('line', { x1: x0 + 50, y1: ky, x2: x0 + 66, y2: ky, stroke: sw.fill, 'stroke-width': 2.4 }) + S.el('path', { d: `M${x0 + 73} ${ky}l-7 -4.2v8.4z`, fill: sw.fill }) + S.text(x0 + 79, ky + 3.2, "Others' average", { 'font-size': 8.5, fill: T.MUTED });
      return S.root(W, H, out, 'Gap between your view and others, per facet');
    }

    // the scale covers at least 50 points each way and grows when a gap is larger
    const zx = 300, max = Math.max(50, Math.ceil(Math.max(...rows.map(r => Math.abs(r.gap))) / 10) * 10), px = 150 / max, bh = 14;
    out += S.el('rect', { x: n(zx - agree * px), y: top - 17, width: n(2 * agree * px), height: rows.length * pitch + 4, fill: '#F1F2F4', rx: 5 });
    out += S.text(zx - agree * px - 8, 15, '◀  You rate yourself higher', { 'text-anchor': 'end', 'font-size': 9, 'font-weight': 700, fill: T.MUTED });
    out += S.text(zx + agree * px + 8, 15, 'Others rate you higher  ▶', { 'font-size': 9, 'font-weight': 700, fill: T.MUTED });
    out += S.el('line', { x1: zx, y1: top - 17, x2: zx, y2: top + rows.length * pitch - 13, stroke: '#C9CDD3', 'stroke-width': 1 });
    rows.forEach((r, i) => {
      const g = T.groupOf(r.id), Y = T.youStyle(opt.you, g), y = top + i * pitch, len = Math.min(Math.abs(r.gap), max) * px, pos = r.gap >= 0;
      const tip = `${T.nameOf(r.id)}: you ${r.self}, others ${r.oth} (${sign(r.gap)})`;
      out += S.text(lx, y + 3.9, T.nameOf(r.id), { 'text-anchor': 'end', 'font-size': 11, 'font-weight': 500, fill: g.text });
      if (len > 0.5) {
        const x = pos ? zx : zx - len, rr = Math.min(4, len);
        // square at the zero line, rounded at the data end
        const d = pos ? `M${n(x)} ${y - bh / 2}h${n(len - rr)}a${rr} ${rr} 0 0 1 ${rr} ${rr}v${bh - 2 * rr}a${rr} ${rr} 0 0 1 ${-rr} ${rr}h${n(-(len - rr))}z`
          : `M${n(zx)} ${y - bh / 2}h${n(-(len - rr))}a${rr} ${rr} 0 0 0 ${-rr} ${rr}v${bh - 2 * rr}a${rr} ${rr} 0 0 0 ${rr} ${rr}h${n(len - rr)}z`;
        out += S.el('path', Object.assign({ d, fill: `url(#${uid}-${pos ? 'o' : 'y'}-${g.id})` }, !pos && Y.hollow ? { stroke: Y.edge, 'stroke-width': 1.4 } : {}), S.title(tip));
      }
      out += S.text(pos ? zx + len + 6 : zx - len - 6, y + 3.8, sign(r.gap), { 'text-anchor': pos ? 'start' : 'end', 'font-size': 10.5, 'font-weight': 700, fill: Y.text, 'font-family': S.FONT_B });
      out += `<text x="${W - 12}" y="${n(y + 3.6)}" text-anchor="end" font-family="${S.FONT_B}" font-size="9.5" font-weight="700"><tspan fill="${Y.text}">${r.self}</tspan><tspan fill="#B7B6B7" font-weight="400"> → </tspan><tspan fill="${g.text}">${r.oth}</tspan></text>`;
    });
    out += S.text(zx, H - 8, `Shaded: broad agreement (within ${agree} points)`, { 'text-anchor': 'middle', 'font-size': 9, fill: T.MUTED });
    out += S.text(W - 12, 15, 'You → Others', { 'text-anchor': 'end', 'font-size': 8.5, 'font-weight': 700, fill: T.MUTED });
    return S.root(W, H, out, 'Gap between your view and others, per facet');
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = T;
})(typeof window !== 'undefined' ? window : globalThis);
