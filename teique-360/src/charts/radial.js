// Radial charts: the petal chart (all 15 facets) and the score wheel (one score).
// Both follow the Figma file "LPL - Reports": solid gradient shapes in the factor colour on
// white, soft shadows, no dark outlines. Others always wear the factor colour. You wear a
// variation of the same factor colour (T.youStyle), drawn as a solid shape of its own.
(function (root) {
  const T = root.TEIQ, S = T.svg, C = (T.charts = T.charts || {});
  const n = S.n;
  const shadow = (id, dev, op) => `<filter id="${id}" x="-40%" y="-40%" width="180%" height="180%"><feDropShadow dx="0" dy="0" stdDeviation="${dev}" flood-color="#000" flood-opacity="${op}"/></filter>`;
  // A white chip with a soft edge. The shadow is two faint rings, not an SVG filter: filters
  // are slow to draw in bulk and turn into images in the PDF.
  const chip = (x, y, r, Y, label, size, tip) =>
    S.el('circle', { cx: n(x), cy: n(y), r: r + 2.4, fill: '#000', 'fill-opacity': 0.05 }) +
    S.el('circle', { cx: n(x), cy: n(y), r: r + 1.2, fill: '#000', 'fill-opacity': 0.07 }) +
    S.el('circle', { cx: n(x), cy: n(y), r, fill: '#fff', stroke: Y.edge, 'stroke-width': r > 12 ? 2.4 : 1.8 }, tip ? S.title(tip) : null) +
    S.text(x, y + size * 0.36, label, { 'text-anchor': 'middle', 'font-size': size, 'font-weight': 700, fill: Y.text, 'font-family': S.FONT_B, 'pointer-events': 'none' });

  // ---------------------------------------------------------------- petal chart
  // Geometry follows Figma node 249:19485: hub, petal zone, facet-label ring, factor ring.
  // The radial scale is linear 0 to 100 with dashed rings at 30 and 70 (the band edges).
  // Variants (how you and others share a facet):
  //   D  split petals: two half petals side by side, others and you
  //   E  petal with a core: the petal is others, a slim bar down its middle is you
  //   F  petal with a score chip: the petal is others, a white chip is you
  //   G  petals with a profile line: the petals are others, a line through 15 points is you
  C.wheel = (v, opt = {}) => {
    const variant = 'DEFG'.includes(opt.variant) ? opt.variant : 'D';   // D picked by Petros, 2026-11-11
    const W = 600, H = 640, cx = 300, cy = 300;
    const R = { hub: 40, p0: 46, p1: 204, lab0: 206, lab1: 253, fac1: 290 };
    const step = 360 / T.FACET_ORDER.length, rOf = s => T.lin(s, R.p0, R.p1);
    const uid = S.id('wheel');
    let defs = shadow(`${uid}-sh`, 5, 0.15);
    let ring = '', dividers = '', petals = '', labels = '', marks = '';

    let a = 0;
    T.GROUPS.forEach(g => {
      const sweep = g.facets.length * step, mid = a + sweep / 2, flip = mid > 90 && mid < 270, Y = T.youStyle(opt.you, g);
      const radial = (id, r, c0, c1, from) => `<radialGradient id="${id}" gradientUnits="userSpaceOnUse" cx="${cx}" cy="${cy}" r="${r}"><stop offset="${n(from / r)}" stop-color="${c0}"/><stop offset="1" stop-color="${c1}"/></radialGradient>`;
      defs += radial(`${uid}-p-${g.id}`, R.p1, g.fill, g.light, R.p0) + radial(`${uid}-y-${g.id}`, R.p1, Y.fill, Y.light, R.p0) + radial(`${uid}-r-${g.id}`, R.fac1, g.fill, g.light, R.lab1);
      ring += S.el('path', { d: S.ring(cx, cy, R.lab1, R.fac1, a, a + sweep), fill: `url(#${uid}-r-${g.id})` });
      const rr = (R.lab1 + R.fac1) / 2, pid = `${uid}-f-${g.id}`;
      defs += S.el('path', { id: pid, d: flip ? S.arc(cx, cy, rr, a + sweep, a, true) : S.arc(cx, cy, rr, a, a + sweep) });
      labels += `<text font-family="${S.FONT_T}" font-size="12" font-weight="700" fill="#fff" dominant-baseline="central"><textPath href="#${pid}" startOffset="50%" text-anchor="middle">${S.esc(g.name)}</textPath></text>`;
      a += sweep;
    });

    const pts = [];
    T.FACET_ORDER.forEach((id, i) => {
      const g = T.groupOf(id), Y = T.youStyle(opt.you, g), a0 = i * step, a1 = a0 + step, mid = a0 + step / 2, flip = mid > 90 && mid < 270;
      const self = v.self[id], oth = v.others[id], grad = `url(#${uid}-p-${g.id})`, yGrad = `url(#${uid}-y-${g.id})`;
      const rO = Math.max(rOf(oth), R.p0 + 8), rS = Math.max(rOf(self), R.p0 + 8);
      const tip = `${T.nameOf(id)}: others ${oth}, you ${self}`;
      const edge = Y.hollow ? { stroke: Y.edge, 'stroke-width': 1.5 } : {};
      // sector dividers: solid in the label ring, dashed in the petal zone
      const d0 = S.pt(cx, cy, R.p0, a0), d1 = S.pt(cx, cy, R.p1, a0), d2 = S.pt(cx, cy, R.lab1, a0);
      dividers += S.el('line', { x1: n(d0[0]), y1: n(d0[1]), x2: n(d1[0]), y2: n(d1[1]), stroke: '#D5D8DD', 'stroke-width': 0.6, 'stroke-dasharray': '3 3' });
      dividers += S.el('line', { x1: n(d1[0]), y1: n(d1[1]), x2: n(d2[0]), y2: n(d2[1]), stroke: '#D5D8DD', 'stroke-width': 0.6 });

      if (variant === 'D') {
        // the pair sits close together and away from its neighbours, so each facet reads as one unit
        petals += S.el('path', { d: S.petal(cx, cy, R.p0, rO, a0 + 1.5, mid, 1.1, 4.5, 2), fill: grad }, S.title(tip));
        petals += S.el('path', Object.assign({ d: S.petal(cx, cy, R.p0, rS, mid, a1 - 1.5, Y.hollow ? 1.8 : 1.1, 4.5, 2), fill: yGrad }, edge), S.title(tip));
      } else {
        petals += S.el('path', { d: S.petal(cx, cy, R.p0, rO, a0, a1, 2.6, 7, 3), fill: grad }, S.title(tip));
      }
      if (variant === 'E') {
        // a slim bar of constant width down the middle of the petal, with a white edge so it
        // stays clear both inside the petal and where it runs past the tip
        const bw = 8, y0 = cy - rS, len = rS - R.p0 - 3;
        marks += `<g transform="rotate(${n(mid)} ${cx} ${cy})">` +
          (Y.hollow ? '' : S.el('rect', { x: cx - bw / 2 - 1.6, y: n(y0 - 1.6), width: bw + 3.2, height: n(len + 3.2), rx: bw / 2 + 1.6, fill: '#fff' })) +
          S.el('rect', Object.assign({ x: cx - bw / 2, y: n(y0), width: bw, height: n(len), rx: bw / 2, fill: yGrad }, edge), S.title(tip)) + '</g>';
      }
      if (variant === 'F') {
        const rc = Math.max(rS, R.p0 + 11), pc = S.pt(cx, cy, rc, mid);
        // a chip that sits beyond the petal is tied back to the petal tip, so the gap reads as a length
        if (rc - rO > 9.2) {
          const p0 = S.pt(cx, cy, rO - 1, mid);
          marks += S.el('line', { x1: n(p0[0]), y1: n(p0[1]), x2: n(pc[0]), y2: n(pc[1]), stroke: Y.edge, 'stroke-width': 2, 'stroke-linecap': 'round' });
        }
        marks += chip(pc[0], pc[1], 9.2, Y, self, 8.2, tip);
      }
      if (variant === 'G') pts.push({ p: S.pt(cx, cy, rS, mid), Y, id });

      // facet name (wrapped) and the two values, on arcs in the label ring
      const lines = T.FACETS[id].lines || [T.FACETS[id].name];
      const radii = lines.length === 2 ? (flip ? [219, 229.5, 243] : [244, 233.5, 219.5]) : flip ? [222, 238] : [239, 223.5];
      const arcAt = (r, key) => {
        const pid = `${uid}-l-${i}-${key}`;
        defs += S.el('path', { id: pid, d: flip ? S.arc(cx, cy, r, a1, a0, true) : S.arc(cx, cy, r, a0, a1) });
        return pid;
      };
      lines.forEach((ln, k) => {
        labels += `<text font-family="${S.FONT_T}" font-size="8.6" font-weight="600" fill="${g.text}" dominant-baseline="central"><textPath href="#${arcAt(radii[k], 'n' + k)}" startOffset="50%" text-anchor="middle">${S.esc(ln)}</textPath></text>`;
      });
      labels += `<text font-family="${S.FONT_B}" font-size="8" font-weight="700" dominant-baseline="central"><textPath href="#${arcAt(radii[lines.length], 'v')}" startOffset="50%" text-anchor="middle"><tspan fill="${g.text}">${oth}</tspan><tspan fill="#B7B6B7" font-weight="400"> | </tspan><tspan fill="${Y.text}">${self}</tspan></textPath></text>`;
    });

    if (variant === 'G') {
      // closed smooth curve through the 15 self scores; each stretch wears its facet's colour
      const N = pts.length, P = i => pts[(i + N) % N].p, k = 0.14;
      const seg = i => {
        const c1 = [P(i)[0] + (P(i + 1)[0] - P(i - 1)[0]) * k, P(i)[1] + (P(i + 1)[1] - P(i - 1)[1]) * k];
        const c2 = [P(i + 1)[0] - (P(i + 2)[0] - P(i)[0]) * k, P(i + 1)[1] - (P(i + 2)[1] - P(i)[1]) * k];
        return `C${n(c1[0])} ${n(c1[1])} ${n(c2[0])} ${n(c2[1])} ${n(P(i + 1)[0])} ${n(P(i + 1)[1])}`;
      };
      let whole = `M${n(P(0)[0])} ${n(P(0)[1])}`;
      for (let i = 0; i < N; i++) whole += seg(i);
      marks += S.el('path', { d: whole + 'Z', fill: 'none', stroke: '#fff', 'stroke-width': 6, 'stroke-linejoin': 'round' });
      for (let i = 0; i < N; i++) marks += S.el('path', { d: `M${n(P(i)[0])} ${n(P(i)[1])}${seg(i)}`, fill: 'none', stroke: pts[i].Y.edge, 'stroke-width': 2.6, 'stroke-linecap': 'round' });
      pts.forEach(q => { marks += S.el('circle', { cx: n(q.p[0]), cy: n(q.p[1]), r: 4.4, fill: '#fff', stroke: q.Y.edge, 'stroke-width': 2.2 }, S.title(`${T.nameOf(q.id)}: you ${v.self[q.id]}`)); });
    }

    // band rings and their names along the 12 o'clock divider
    let grid = S.el('circle', { cx, cy, r: R.lab1, fill: '#fff' }) + S.el('circle', { cx, cy, r: R.lab0, fill: 'none', stroke: T.RULE, 'stroke-width': 0.8 });
    [30, 70].forEach(s => { grid += S.el('circle', { cx, cy, r: n(rOf(s)), fill: 'none', stroke: '#C9CDD3', 'stroke-width': 0.7, 'stroke-dasharray': '4 3' }); });
    let bands = '';
    [['Low', 15], ['Average', 50], ['High', 85]].forEach(([t, s]) => {
      const y = cy - rOf(s);
      bands += S.el('rect', { x: cx - 15, y: n(y - 5), width: 30, height: 10, rx: 5, fill: '#fff', 'fill-opacity': 0.92 });
      bands += S.text(cx, y + 2.4, t, { 'text-anchor': 'middle', 'font-size': 6.6, 'font-weight': 600, fill: T.MUTED });
    });

    // hub: both Global scores at the same size, others in the factor colour and you in its deeper shade
    const YG = T.youStyle(opt.you, T.GLOBAL);
    const hubRow = (y, name, val, col) => S.text(cx - 2, y, name, { 'text-anchor': 'end', 'font-size': 7, 'font-weight': 700, fill: col }) +
      `<text x="${cx + 2}" y="${y}" font-family="${S.FONT_T}" font-size="13" font-weight="700" fill="${col}">${val}<tspan font-size="8" font-weight="500">%</tspan></text>`;
    const hub = S.el('circle', { cx, cy, r: R.hub, fill: '#fff', filter: `url(#${uid}-sh)` }) +
      S.text(cx, cy - 17, 'GLOBAL', { 'text-anchor': 'middle', 'font-size': 5.6, 'font-weight': 700, fill: T.MUTED, 'letter-spacing': 0.6 }) +
      hubRow(cy - 1, 'Others', v.others.global, T.GLOBAL.text) + hubRow(cy + 15, 'You', v.self.global, YG.text);

    // legend: both swatches run through the five factor colours, each drawn the way this variant draws it
    const ly = 618, yx = 318, stops = fn => T.GROUPS.map((g, i) => `<stop offset="${i / (T.GROUPS.length - 1)}" stop-color="${fn(g)}"/>`).join('');
    defs += `<linearGradient id="${uid}-lg" gradientUnits="userSpaceOnUse" x1="156" x2="190" y1="0" y2="0">${stops(g => g.fill)}</linearGradient>`;
    defs += `<linearGradient id="${uid}-lgy" gradientUnits="userSpaceOnUse" x1="${yx}" x2="${yx + 24}" y1="0" y2="0">${stops(g => T.youStyle(opt.you, g).edge)}</linearGradient>`;
    const yEdge = `url(#${uid}-lgy)`, hollow = T.youStyle(opt.you, T.GLOBAL).hollow;
    let legend = S.el('rect', { x: 156, y: ly - 7, width: 34, height: 11, rx: 5.5, fill: `url(#${uid}-lg)` }) + S.text(196, ly + 2.6, "Others' average", { 'font-size': 10, 'font-weight': 600, fill: T.INK });
    legend += variant === 'F' ? S.el('circle', { cx: yx + 12, cy: ly - 1.5, r: 7, fill: '#fff', stroke: yEdge, 'stroke-width': 1.8 })
      : variant === 'G' ? S.el('rect', { x: yx, y: ly - 2.8, width: 24, height: 2.6, rx: 1.3, fill: yEdge }) + S.el('circle', { cx: yx + 12, cy: ly - 1.5, r: 4.2, fill: '#fff', stroke: yEdge, 'stroke-width': 2.2 })
      : S.el('rect', { x: yx, y: ly - (variant === 'E' ? 5.5 : 7), width: 24, height: variant === 'E' ? 8 : 11, rx: 5.5, fill: hollow ? '#fff' : yEdge, stroke: hollow ? yEdge : null, 'stroke-width': hollow ? 1.5 : null });
    legend += S.text(yx + 30, ly + 2.6, 'How you rated yourself', { 'font-size': 10, 'font-weight': 600, fill: T.INK });

    return S.root(W, H, `<defs>${defs}</defs>${ring}${grid}${dividers}${petals}${bands}${marks}${labels}${hub}${legend}`, 'TEIQue 360 petal chart: you compared with others');
  };

  // ---------------------------------------------------------------- score wheel
  // Clockwise from 12 o'clock, linear, with dividers at 30% and 70% (Figma 505:754).
  // Variants:
  //   D  two rings of the same width with a clear gap: the outer ring is others, the inner ring is you;
  //      both scores sit in the centre at the same size (Petros, 2026-11-14)
  //   E  ring with a core: the ring is others, a stripe along its middle is you
  //   F  ring with a score chip: the ring is others, a white chip sitting on it is you
  // opt.compact: no band labels and a tighter frame, for the small wheel next to each scale's strip.
  C.gauge = (v, id, opt = {}) => {
    // D picked by Petros, 2026-11-11
    const variant = 'DEF'.includes(opt.variant) ? opt.variant : 'D', g = id === 'global' ? T.GLOBAL : T.groupOf(id), Y = T.youStyle(opt.you, g);
    const self = v.self[id], oth = v.others[id];
    const compact = !!opt.compact, W = compact ? 196 : 240, H = W, cx = W / 2, cy = compact ? 98 : 116, uid = S.id('gauge');
    const ang = s => T.clamp(s, 0, 100) * 3.6, aS = ang(self), aO = ang(oth);
    const defs = shadow(`${uid}-sh`, 6, 0.14);
    const rIn = variant === 'D' ? 49 : 50, rOut = 92;
    let body = S.el('circle', { cx, cy, r: (rIn + rOut) / 2, fill: 'none', stroke: '#fff', 'stroke-width': rOut - rIn, filter: `url(#${uid}-sh)` });
    const dividers = (r0, r1) => [108, 252].map(d => { const p0 = S.pt(cx, cy, r0, d), p1 = S.pt(cx, cy, r1, d); return S.el('line', { x1: n(p0[0]), y1: n(p0[1]), x2: n(p1[0]), y2: n(p1[1]), stroke: '#fff', 'stroke-width': 1.3 }) + S.el('line', { x1: n(p0[0]), y1: n(p0[1]), x2: n(p1[0]), y2: n(p1[1]), stroke: '#00000014', 'stroke-width': 0.5 }); }).join('');

    if (variant === 'D') {
      // two rings, 19 wide each, 5 apart: others 73 to 92, you 49 to 68
      const track = (r0, r1) => S.el('circle', { cx, cy, r: (r0 + r1) / 2, fill: 'none', stroke: '#F1F2F4', 'stroke-width': r1 - r0 });
      body += track(73, rOut) + track(rIn, 68);
      body += S.arcGrad(cx, cy, 73, rOut, 0, aO, g.light, g.fill);
      body += Y.hollow ? S.el('path', { d: S.ring(cx, cy, rIn + 0.8, 67.2, 0, Math.max(aS, 0.5)), fill: '#fff', stroke: Y.edge, 'stroke-width': 1.6, 'stroke-linejoin': 'round' })
        : S.arcGrad(cx, cy, rIn, 68, 0, aS, Y.light, Y.fill);
      body += S.el('circle', { cx, cy, r: 70.5, fill: 'none', stroke: '#fff', 'stroke-width': 5 });
      body += dividers(rIn, rOut);
    } else if (variant === 'E') {
      body += S.arcGrad(cx, cy, rIn, rOut, 0, aO, g.light, g.fill) + dividers(rIn, rOut);
      const rm = (rIn + rOut) / 2, e = S.pt(cx, cy, rm, aS), d = S.arc(cx, cy, rm, 0, Math.max(aS, 0.5));
      const stripe = (w, col) => S.el('path', { d, fill: 'none', stroke: col, 'stroke-width': w }) + S.el('circle', { cx: n(e[0]), cy: n(e[1]), r: w / 2, fill: col });
      body += Y.hollow ? stripe(13, Y.edge) + stripe(9.8, '#fff')
        : stripe(14, '#fff') + S.arcGrad(cx, cy, rm - 5, rm + 5, 0, aS, Y.light, Y.fill) + S.el('circle', { cx: n(e[0]), cy: n(e[1]), r: 5, fill: Y.fill });
    } else {
      body += S.arcGrad(cx, cy, rIn, rOut, 0, aO, g.light, g.fill) + dividers(rIn, rOut);
      const e = S.pt(cx, cy, (rIn + rOut) / 2, aS);
      body += chip(e[0], e[1], 14.5, Y, self, 12);
    }
    body += S.el('title', {}, `${T.nameOf(id)}: others ${oth}, you ${self}`);

    // centre. D: both scores at the same size, each in its ring's colour. E and F: others is the
    // headline number, you sits beneath it.
    if (variant === 'D') {
      const row = (y, name, val, col) => S.text(cx - 3, y, name, { 'text-anchor': 'end', 'font-size': 11.5, 'font-weight': 700, fill: col }) +
        `<text x="${cx + 2}" y="${y}" font-family="${S.FONT_T}" font-size="21" font-weight="700" fill="${col}">${val}<tspan font-size="12" font-weight="500">%</tspan></text>`;
      body += row(cy - 4, 'Others', oth, g.text) + row(cy + 19, 'You', self, Y.text);
    } else {
      body += S.text(cx, cy - 16, 'OTHERS', { 'text-anchor': 'middle', 'font-size': 8.2, 'font-weight': 700, fill: T.MUTED, 'letter-spacing': 0.7 });
      body += `<text x="${cx}" y="${cy + 9}" text-anchor="middle" font-family="${S.FONT_T}" font-size="28" font-weight="600" fill="${g.text}">${oth}<tspan font-weight="300">%</tspan></text>`;
      body += S.text(cx, cy + 25, `You ${self}%`, { 'text-anchor': 'middle', 'font-size': 11.5, 'font-weight': 700, fill: Y.text, 'font-family': S.FONT_B });
    }
    if (compact) return S.root(W, H, `<defs>${defs}</defs>${body}`, `${T.nameOf(id)} score wheel: others ${oth}, you ${self}`);

    // band labels, placed as in Figma
    const rl = 108, lo = S.pt(cx, cy, rl, 60), hi = S.pt(cx, cy, rl, 300);
    const lab = { 'font-size': 10.5, fill: '#808080', 'text-anchor': 'middle' };
    body += S.el('text', Object.assign({ transform: `translate(${n(lo[0])} ${n(lo[1])}) rotate(60)`, 'font-family': S.FONT_T, dy: 3 }, lab), 'Low');
    body += S.el('text', Object.assign({ transform: `translate(${n(hi[0])} ${n(hi[1])}) rotate(-60)`, 'font-family': S.FONT_T, dy: 3 }, lab), 'High');
    body += S.text(cx, cy + rl + 8, 'Average', lab);
    return S.root(W, H, `<defs>${defs}</defs>${body}`, `${T.nameOf(id)} score wheel: others ${oth}, you ${self}`);
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = T;
})(typeof window !== 'undefined' ? window : globalThis);
