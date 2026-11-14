// Small SVG string helpers. Charts are pure functions that return an SVG string,
// so the same code draws the PDF (Node) and the web page (browser).
(function (root) {
  const T = (root.TEIQ = root.TEIQ || {});
  const S = (T.svg = {});
  let uid = 0;
  S.id = p => p + '-' + (++uid);
  S.n = v => +(+v).toFixed(2);
  S.esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  S.el = (tag, attrs, inner) => {
    let a = '';
    for (const k in attrs) if (attrs[k] != null && attrs[k] !== false) a += ` ${k}="${S.esc(attrs[k])}"`;
    return inner == null ? `<${tag}${a}/>` : `<${tag}${a}>${inner}</${tag}>`;
  };
  S.title = t => `<title>${S.esc(t)}</title>`;
  S.FONT_T = "Manrope, 'Segoe UI', Arial, sans-serif"; // titles and chart labels
  S.FONT_B = "Inter, 'Segoe UI', Arial, sans-serif"; // body and numbers
  S.text = (x, y, str, a = {}) => S.el('text', Object.assign({ x: S.n(x), y: S.n(y), 'font-family': S.FONT_T, 'font-size': 10, fill: T.INK }, a), S.esc(str));
  S.root = (w, h, inner, label) =>
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="100%" role="img" aria-label="${S.esc(label || '')}" style="display:block;max-width:${w}px">${inner}</svg>`;
  // Rough text width, good enough for collision checks.
  S.tw = (str, size) => String(str).length * size * 0.56;
  // Shorten a label that would be wider than maxW.
  S.fit = (str, size, maxW) => {
    str = String(str);
    if (S.tw(str, size) <= maxW) return str;
    return str.slice(0, Math.max(3, Math.floor(maxW / (size * 0.56)) - 1)).trimEnd() + '…';
  };

  // Angles are degrees, 0 at 12 o'clock, clockwise.
  const rad = d => (d * Math.PI) / 180;
  S.pt = (cx, cy, r, deg) => [cx + r * Math.sin(rad(deg)), cy - r * Math.cos(rad(deg))];
  const p = q => S.n(q[0]) + ' ' + S.n(q[1]);
  // Open arc from a0 to a1. ccw draws it anticlockwise (used so bottom labels read upright).
  S.arc = (cx, cy, r, a0, a1, ccw) =>
    `M${p(S.pt(cx, cy, r, a0))}A${S.n(r)} ${S.n(r)} 0 ${Math.abs(a1 - a0) > 180 ? 1 : 0} ${ccw ? 0 : 1} ${p(S.pt(cx, cy, r, a1))}`;
  // Ring segment between two radii.
  S.ring = (cx, cy, r0, r1, a0, a1) => {
    if (a1 - a0 >= 359.99) a1 = a0 + 359.99;
    const big = a1 - a0 > 180 ? 1 : 0;
    return `M${p(S.pt(cx, cy, r1, a0))}A${S.n(r1)} ${S.n(r1)} 0 ${big} 1 ${p(S.pt(cx, cy, r1, a1))}L${p(S.pt(cx, cy, r0, a1))}A${S.n(r0)} ${S.n(r0)} 0 ${big} 0 ${p(S.pt(cx, cy, r0, a0))}Z`;
  };
  // Wheel petal: a sector from r0 to r1 whose sides sit h inside the sector edges
  // (so the gap between petals has a constant width) with rounded corners.
  S.petal = (cx, cy, r0, r1, a0, a1, h, cr, ci) => {
    const len = r1 - r0;
    cr = Math.max(0.01, Math.min(cr, len / 2 - 0.01));
    ci = Math.max(0.01, Math.min(ci, len / 2 - 0.01));
    const side = (a, sgn) => {
      const u = [Math.sin(rad(a)), -Math.cos(rad(a))];
      const nrm = [Math.cos(rad(a)) * sgn, Math.sin(rad(a)) * sgn];
      const P = (d, o) => [cx + d * u[0] + o * nrm[0], cy + d * u[1] + o * nrm[1]];
      const dc = Math.sqrt(Math.max(0, (r1 - cr) ** 2 - (h + cr) ** 2));
      const di = Math.sqrt(Math.max(0, (r0 + ci) ** 2 - (h + ci) ** 2));
      const C = P(dc, h + cr), Ci = P(di, h + ci);
      const k = r1 / (r1 - cr), ki = r0 / (r0 + ci);
      return { S: P(dc, h), O: [cx + (C[0] - cx) * k, cy + (C[1] - cy) * k], Si: P(di, h), I: [cx + (Ci[0] - cx) * ki, cy + (Ci[1] - cy) * ki] };
    };
    const L = side(a0, 1), R = side(a1, -1), A = (r, sw, q) => `A${S.n(r)} ${S.n(r)} 0 0 ${sw} ${p(q)}`;
    return `M${p(L.Si)}L${p(L.S)}${A(cr, 1, L.O)}${A(r1, 1, R.O)}${A(cr, 1, R.S)}L${p(R.Si)}${A(ci, 1, R.I)}${A(r0, 0, L.I)}${A(ci, 1, L.Si)}Z`;
  };

  S.mix = (a, b, t) => {
    const h = c => [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16));
    const A = h(a), B = h(b);
    return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, '0')).join('');
  };
  // A ring arc whose colour runs from c0 to c1 along its length. SVG has no angular
  // gradient, so this draws short segments. Stays vector in the PDF.
  S.arcGrad = (cx, cy, r0, r1, a0, a1, c0, c1) => {
    const sweep = a1 - a0;
    if (sweep <= 0.01) return '';
    const nSeg = Math.max(1, Math.ceil(sweep / 3));
    let out = '';
    for (let i = 0; i < nSeg; i++) {
      const s = a0 + (sweep * i) / nSeg, e = Math.min(a1, a0 + (sweep * (i + 1)) / nSeg + (i < nSeg - 1 ? 1.6 : 0));
      out += S.el('path', { d: S.ring(cx, cy, r0, r1, s, e), fill: S.mix(c0, c1, nSeg === 1 ? 1 : i / (nSeg - 1)) });
    }
    return out;
  };

  // Three equal band tracks (the report's pill track) and a fill up to a score.
  S.tracks = (x0, y, w, h, gap) => {
    const tw = (w - 2 * gap) / 3;
    let out = '';
    // White pill with a soft inner shadow, as in Figma (inset 0 0 5.2px rgba(0,0,0,.25)).
    // Drawn as nested pills that fade to white, so it stays vector and needs no SVG filter.
    const rim = [[0, '#DADCE0'], [0.6, '#E9EAED'], [1.3, '#F5F5F7'], [2.1, '#FFFFFF']];
    for (let i = 0; i < 3; i++)
      rim.forEach(([d, c]) => { if (h - 2 * d > 0.8) out += S.el('rect', { x: S.n(x0 + i * (tw + gap) + d), y: S.n(y + d), width: S.n(tw - 2 * d), height: S.n(h - 2 * d), rx: S.n(h / 2 - d), fill: c }); });
    return out;
  };
  S.trackFill = (score, x0, y, w, h, gap, fill) => {
    const tw = (w - 2 * gap) / 3, t = T.thirds(score);
    let out = '';
    for (let i = 0; i <= t.i; i++) {
      const f = i < t.i ? 1 : t.f, fw = Math.max(f * tw, f > 0 ? Math.min(h, tw) : 0);
      if (fw > 0) out += S.el('rect', { x: S.n(x0 + i * (tw + gap)), y: S.n(y), width: S.n(fw), height: h, rx: h / 2, fill });
    }
    return out;
  };
  S.bandHeader = (x0, y, w, gap) => {
    const tw = (w - 2 * gap) / 3;
    let out = '';
    T.BANDS.forEach((b, i) => { out += S.text(x0 + i * (tw + gap) + tw / 2, y, b.label, { 'text-anchor': 'middle', 'font-size': 8.5, fill: T.MUTED }); });
    return out;
  };
  // Top-to-bottom gradient, as on the Figma bars: c0 along the top edge, c1 along the bottom.
  S.vGrad = (id, c0, c1) => `<linearGradient id="${id}" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="${c0}"/><stop offset="1" stop-color="${c1}"/></linearGradient>`;
  S.hGrad = (id, c0, c1) => `<linearGradient id="${id}" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="${c0}"/><stop offset="1" stop-color="${c1}"/></linearGradient>`;

  if (typeof module !== 'undefined' && module.exports) module.exports = T;
})(typeof window !== 'undefined' ? window : globalThis);
