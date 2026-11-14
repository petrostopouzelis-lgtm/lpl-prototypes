// Overview charts: the perception map and the raters overview.
(function (root) {
  const T = root.TEIQ, S = T.svg, C = (T.charts = T.charts || {});
  const n = S.n;

  // ---------------------------------------------------------------- perception map
  // Your score across, others' score up, one dot per facet.
  // Variants: A linear scale, four quadrants, names on the dots.
  // B band grid (3 x 3, equal thirds), numbered dots with a key.
  C.map = (v, opt = {}) => {
    const variant = opt.variant || 'A';
    const pts = T.FACET_ORDER.map((id, i) => ({ id, i, g: T.groupOf(id), self: v.self[id], oth: v.others[id] }));
    // dots wear the factor gradient, like every other mark in the report
    const uid = S.id('map'), defs = '<defs>' + T.GROUPS.map(g => S.vGrad(`${uid}-${g.id}`, g.fill, g.light)).join('') + '</defs>', gr = g => `url(#${uid}-${g.id})`;
    const tipOf = q => `${T.nameOf(q.id)}: you ${q.self}, others ${q.oth}`;

    if (variant === 'B') {
      const W = 640, H = 470, px = 62, py = 26, sz = 384, gap = 0;
      const X = s => T.trackX(s, px, sz, gap), Y = s => py + sz - (T.trackX(s, px, sz, gap) - px), c = sz / 3;
      let out = '';
      for (let r = 0; r < 3; r++) for (let k = 0; k < 3; k++) {
        const kind = r === 2 - k ? 'agree' : 2 - r > k ? 'hidden' : 'blind';
        out += S.el('rect', { x: n(px + k * c), y: n(py + r * c), width: n(c), height: n(c), fill: kind === 'agree' ? '#FFFFFF' : kind === 'hidden' ? '#EEF6FB' : '#FBF1EA', stroke: '#DDE0E5', 'stroke-width': 0.8 });
      }
      const cap = { 'font-size': 8.5, 'font-weight': 700, fill: T.MUTED, 'letter-spacing': 0.4 };
      out += S.text(px + 10, py + 17, 'HIDDEN STRENGTHS', cap) + S.text(px + 10, py + 29, 'Others rate you higher', { 'font-size': 8, fill: T.MUTED });
      out += S.text(px + sz - 10, py + sz - 20, 'BLIND SPOTS', Object.assign({ 'text-anchor': 'end' }, cap)) + S.text(px + sz - 10, py + sz - 8, 'You rate yourself higher', { 'font-size': 8, fill: T.MUTED, 'text-anchor': 'end' });
      T.BANDS.forEach((b, k) => {
        out += S.text(px + k * c + c / 2, py + sz + 15, b.label, { 'text-anchor': 'middle', 'font-size': 9, fill: T.MUTED });
        out += S.el('text', { transform: `translate(${px - 9} ${n(py + sz - k * c - c / 2)}) rotate(-90)`, 'text-anchor': 'middle', 'font-family': S.FONT_T, 'font-size': 9, fill: T.MUTED }, b.label);
      });
      out += S.text(px + sz / 2, py + sz + 33, 'How you rated yourself', { 'text-anchor': 'middle', 'font-size': 9.5, 'font-weight': 700, fill: T.INK });
      out += S.el('text', { transform: `translate(${px - 28} ${py + sz / 2}) rotate(-90)`, 'text-anchor': 'middle', 'font-family': S.FONT_T, 'font-size': 9.5, 'font-weight': 700, fill: T.INK }, 'How others rated you');
      // nudge dots that would sit on top of each other
      const placed = [];
      pts.forEach(q => {
        let x = X(q.self), y = Y(q.oth);
        placed.forEach(o => { if (Math.hypot(o.x - x, o.y - y) < 16) { x += 9; y -= 9; } });
        placed.push({ x, y });
        const dark = q.g.id === 'self_control';
        out += S.el('circle', { cx: n(x), cy: n(y), r: 8, fill: gr(q.g), stroke: '#fff', 'stroke-width': 1.6 }, S.title(tipOf(q)));
        out += S.text(x, y + 3, q.i + 1, { 'text-anchor': 'middle', 'font-size': 8, 'font-weight': 700, fill: dark ? T.INK : '#fff', 'font-family': S.FONT_B, 'pointer-events': 'none' });
      });
      // key
      let ky = py + 6;
      const kx = px + sz + 26;
      T.GROUPS.forEach(g => {
        out += S.text(kx, ky + 4, g.name, { 'font-size': 9, 'font-weight': 700, fill: g.text });
        ky += 15;
        g.facets.forEach(f => {
          const idx = T.FACET_ORDER.indexOf(f) + 1;
          out += S.el('circle', { cx: kx + 6, cy: ky, r: 6, fill: gr(g) }) + S.text(kx + 6, ky + 2.8, idx, { 'text-anchor': 'middle', 'font-size': 7, 'font-weight': 700, fill: g.id === 'self_control' ? T.INK : '#fff', 'font-family': S.FONT_B });
          out += S.text(kx + 18, ky + 3.2, T.nameOf(f), { 'font-size': 9, fill: T.INK });
          ky += 15.5;
        });
        ky += 7;
      });
      return S.root(W, H, defs + out, 'Perception map: your view against others');
    }

    const W = 540, H = 520, px = 62, py = 24, sz = 430;
    const X = s => px + ((s - 1) / 98) * sz, Y = s => py + sz - ((s - 1) / 98) * sz, mid = X(50), midY = Y(50);
    let out = S.el('rect', { x: px, y: py, width: sz, height: sz, fill: '#fff', stroke: '#DDE0E5', 'stroke-width': 0.8, rx: 6 });
    out += S.el('rect', { x: px, y: py, width: n(mid - px), height: n(midY - py), fill: '#EEF6FB', rx: 6 }) + S.el('rect', { x: n(mid), y: n(midY), width: n(px + sz - mid), height: n(py + sz - midY), fill: '#FBF1EA', rx: 6 });
    out += S.el('line', { x1: n(mid), y1: py, x2: n(mid), y2: py + sz, stroke: '#C9CDD3', 'stroke-width': 0.8 }) + S.el('line', { x1: px, y1: n(midY), x2: px + sz, y2: n(midY), stroke: '#C9CDD3', 'stroke-width': 0.8 });
    out += S.el('line', { x1: px, y1: py + sz, x2: px + sz, y2: py, stroke: '#A9AFB8', 'stroke-width': 0.8, 'stroke-dasharray': '4 3' });
    const cap = { 'font-size': 8.5, 'font-weight': 700, fill: T.MUTED, 'letter-spacing': 0.4 }, sub = { 'font-size': 8, fill: T.MUTED };
    out += S.text(px + 10, py + 17, 'HIDDEN STRENGTHS', cap) + S.text(px + 10, py + 29, 'Others see more than you do', sub);
    out += S.text(px + sz - 10, py + 17, 'STRENGTHS', Object.assign({ 'text-anchor': 'end' }, cap)) + S.text(px + sz - 10, py + 29, 'You and others both rate high', Object.assign({ 'text-anchor': 'end' }, sub));
    out += S.text(px + 10, py + sz - 20, 'DEVELOPMENT AREAS', cap) + S.text(px + 10, py + sz - 8, 'You and others both rate low', sub);
    out += S.text(px + sz - 10, py + sz - 20, 'BLIND SPOTS', Object.assign({ 'text-anchor': 'end' }, cap)) + S.text(px + sz - 10, py + sz - 8, 'You see more than others do', Object.assign({ 'text-anchor': 'end' }, sub));
    [1, 50, 99].forEach(t => {
      out += S.text(X(t), py + sz + 14, t, { 'text-anchor': 'middle', 'font-size': 8, fill: '#808080', 'font-family': S.FONT_B });
      out += S.text(px - 8, Y(t) + 3, t, { 'text-anchor': 'end', 'font-size': 8, fill: '#808080', 'font-family': S.FONT_B });
    });
    out += S.text(px + sz / 2, py + sz + 32, 'How you rated yourself', { 'text-anchor': 'middle', 'font-size': 9.5, 'font-weight': 700, fill: T.INK });
    out += S.el('text', { transform: `translate(${px - 30} ${py + sz / 2}) rotate(-90)`, 'text-anchor': 'middle', 'font-family': S.FONT_T, 'font-size': 9.5, 'font-weight': 700, fill: T.INK }, 'How others rated you');

    // labels: try positions around each dot, keep the first that hits nothing
    // facets with identical scores share one label and sit side by side
    const clusters = [];
    pts.forEach(q => { const c = clusters.find(o => o.self === q.self && o.oth === q.oth); if (c) c.items.push(q); else clusters.push({ self: q.self, oth: q.oth, items: [q] }); });
    const boxes = clusters.map(q => { const hw = 7 + (q.items.length - 1) * 3.5; return { x0: X(q.self) - hw, y0: Y(q.oth) - 7, x1: X(q.self) + hw, y1: Y(q.oth) + 7 }; });
    // keep labels off the quadrant captions
    [[px, py, 150, 34], [px + sz - 150, py, 150, 34], [px, py + sz - 32, 150, 32], [px + sz - 150, py + sz - 32, 150, 32]].forEach(([x, y, w2, h2]) => boxes.push({ x0: x, y0: y, x1: x + w2, y1: y + h2 }));
    const hit = (a, b) => a.x0 < b.x1 && a.x1 > b.x0 && a.y0 < b.y1 && a.y1 > b.y0;
    let dots = '', labels = '';
    clusters.forEach(q => {
      const nI = q.items.length, off = 9 + (nI - 1) * 3.5, x = X(q.self), y = Y(q.oth), first = T.nameOf(q.items[0].id);
      const name = nI === 1 ? first : nI === 2 ? `${first}, ${T.nameOf(q.items[1].id)}` : `${first} +${nI - 1} more`, tw = S.tw(name, 8.6), th = 10;
      const cands = [[x + off, y - th / 2, 'start'], [x - off - tw, y - th / 2, 'end'], [x - tw / 2, y - 9 - th, 'middle'], [x - tw / 2, y + 9, 'middle'],
        [x + 7, y - 7 - th, 'start'], [x + 7, y + 7, 'start'], [x - 7 - tw, y - 7 - th, 'end'], [x - 7 - tw, y + 7, 'end']];
      let best = cands[0], bestHits = 99;
      for (const cnd of cands) {
        const b = { x0: cnd[0] - 1, y0: cnd[1] - 1, x1: cnd[0] + tw + 1, y1: cnd[1] + th + 1 };
        if (b.x0 < px + 2 || b.x1 > px + sz - 2 || b.y0 < py + 2 || b.y1 > py + sz - 2) continue;
        const h = boxes.filter(o => hit(b, o)).length;
        if (h < bestHits) { best = cnd; bestHits = h; if (!h) break; }
      }
      boxes.push({ x0: best[0], y0: best[1], x1: best[0] + tw, y1: best[1] + th });
      const tx = best[2] === 'start' ? best[0] : best[2] === 'end' ? best[0] + tw : best[0] + tw / 2;
      labels += S.text(tx, best[1] + 8, name, { 'text-anchor': best[2], 'font-size': 8.6, 'font-weight': 600, fill: T.INK, stroke: '#fff', 'stroke-width': 2.4, 'paint-order': 'stroke', 'stroke-linejoin': 'round' });
      q.items.forEach((it, k) => { dots += S.el('circle', { cx: n(x + (k - (nI - 1) / 2) * 7), cy: n(y), r: 5.4, fill: gr(it.g), stroke: '#fff', 'stroke-width': 1.6 }, S.title(tipOf(it))); });
    });
    return S.root(W, H, defs + out + dots + labels, 'Perception map: your view against others');
  };

  // ---------------------------------------------------------------- raters overview
  // Who was invited and who responded. Variants: A one card per group. B bars.
  C.raters = (v, opt = {}) => {
    const variant = opt.variant || 'A', W = 540, gs = v.groups;
    const pct = (a, b) => Math.round((a / b) * 100);
    const headline = `${v.responded} of ${v.invited} raters responded (${pct(v.responded, v.invited)}%)`;
    // brand blue, with the same top-to-bottom gradient as the Figma bars
    const uid = S.id('raters'), BL = `url(#${uid}-b)`;
    let out = `<defs>${S.vGrad(uid + '-b', T.BLUE, '#7FC0E6')}</defs>` + S.text(16, 18, headline, { 'font-size': 12, 'font-weight': 700, fill: T.INK });

    if (variant === 'B') {
      const x0 = 132, maxW = 270, maxInv = Math.max(...gs.map(g => g.invited)), top = 40, pitch = 26;
      gs.forEach((g, i) => {
        const y = top + i * pitch, wInv = (g.invited / maxInv) * maxW, wRes = (g.responded / maxInv) * maxW;
        out += S.text(x0 - 12, y + 3.6, g.label, { 'text-anchor': 'end', 'font-size': 10, 'font-weight': 600, fill: T.INK });
        out += S.el('rect', { x: x0, y: y - 6, width: n(wInv), height: 12, rx: 6, fill: '#F3F4F6', stroke: '#E1E3E7', 'stroke-width': 0.6 });
        out += S.el('rect', { x: x0, y: y - 6, width: n(Math.max(wRes, 12)), height: 12, rx: 6, fill: BL }, S.title(`${g.label}: ${g.responded} of ${g.invited} responded`));
        out += S.text(x0 + wInv + 10, y + 3.6, `${g.responded} of ${g.invited}`, { 'font-size': 9.5, 'font-weight': 700, fill: T.INK, 'font-family': S.FONT_B });
        out += S.text(W - 16, y + 3.6, `${pct(g.responded, g.invited)}%`, { 'text-anchor': 'end', 'font-size': 9.5, fill: T.MUTED, 'font-family': S.FONT_B });
      });
      const H = top + gs.length * pitch + 6;
      return S.root(W, H, out, 'Raters: invited and responded, by group');
    }

    // up to four cards per row; dots wrap inside a card when a group is large
    const gapC = 10, perRow = Math.min(4, Math.max(gs.length, 1)), cw = Math.min((W - 32 - gapC * (perRow - 1)) / perRow, 150), top0 = 32;
    const dotsPerRow = Math.max(1, Math.floor((cw - 22) / 14)), dotRows = Math.max(1, ...gs.map(g => Math.ceil(g.invited / dotsPerRow)));
    const ch = 92 + (dotRows - 1) * 13, cardRows = Math.ceil(gs.length / perRow);
    let top = top0;
    gs.forEach((g, i) => {
      const x = 16 + (i % perRow) * (cw + gapC);
      top = top0 + Math.floor(i / perRow) * (ch + gapC);
      out += S.el('rect', { x: n(x), y: top, width: n(cw), height: ch, rx: 12, fill: '#fff', stroke: '#E1E3E7', 'stroke-width': 0.8 }, S.title(`${g.label}: ${g.responded} of ${g.invited} responded`));
      out += S.text(x + 12, top + 20, S.fit(g.label, 10, cw - 22), { 'font-size': 10, 'font-weight': 700, fill: T.MUTED });
      out += `<text x="${n(x + 12)}" y="${top + 50}" font-family="${S.FONT_T}" font-size="24" font-weight="600" fill="${T.INK}">${g.responded}<tspan font-size="10.5" font-weight="500" fill="${T.MUTED}"> of ${g.invited}</tspan></text>`;
      for (let k = 0; k < g.invited; k++)
        out += S.el('circle', { cx: n(x + 17 + (k % dotsPerRow) * 14), cy: top + 72 + Math.floor(k / dotsPerRow) * 13, r: k < g.responded ? 5.6 : 5, fill: k < g.responded ? BL : '#fff', stroke: k < g.responded ? null : '#B7BCC4', 'stroke-width': k < g.responded ? null : 1.2 });
    });
    top = top0 + (cardRows - 1) * (ch + gapC);
    out += S.el('circle', { cx: 21, cy: top + ch + 16, r: 4, fill: BL }) + S.text(30, top + ch + 19, 'Responded', { 'font-size': 8.5, fill: T.MUTED });
    out += S.el('circle', { cx: 91, cy: top + ch + 16, r: 4, fill: '#fff', stroke: '#B7BCC4', 'stroke-width': 1.2 }) + S.text(100, top + ch + 19, 'Invited, no response', { 'font-size': 8.5, fill: T.MUTED });
    return S.root(W, top + ch + 28, out, 'Raters: invited and responded, by group');
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = T;
})(typeof window !== 'undefined' ? window : globalThis);
