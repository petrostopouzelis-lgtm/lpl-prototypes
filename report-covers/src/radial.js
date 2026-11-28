// Radial shapes: a centred, contained blob drawn like a radial chart.
//
// Scores sit around a circle (facets for TEIQue and TSIQue, life domains for
// Scan-In), each pushing the outline outwards. The outline is smoothed with a
// few Fourier harmonics so it reads as one organic shape, not a spiky radar.
//   opts.shape   'blob'      one filled shape, coloured around its rim by factor
//                'petals'    one translucent lobe per factor, overlapping
//                'contours'  thin outlines blending from a small core out to the score shape
//   opts.detail  0..1, how closely the outline follows individual scores
// A group report overlays one outline per member around a shared centre.
(function (root) {
  const NS = root.LPLCovers = root.LPLCovers || {};
  const TAU = Math.PI * 2, M = 360; // samples around the outline

  function I() { return NS._internal; }

  // Smooth periodic profile through values evenly spaced around the circle, 0..1.
  function fourier(vals, H) {
    const m = vals.length, a = [], b = [];
    const a0 = vals.reduce((s, v) => s + v, 0) / m;
    for (let h = 1; h <= H; h++) {
      let c = 0, d = 0;
      vals.forEach((v, j) => { const t = TAU * j / m; c += v * Math.cos(h * t); d += v * Math.sin(h * t); });
      a.push(2 * c / m); b.push(2 * d / m);
    }
    return th => { let f = a0; for (let h = 1; h <= H; h++) f += a[h - 1] * Math.cos(h * th) + b[h - 1] * Math.sin(h * th); return f; };
  }

  // What goes around the circle, and the colour of each position.
  function series(T, p) {
    if (T.id === 'scanin') return { values: p.factors, colors: p.factors.map(() => T.scales.belief.color), inner: p.facets };
    const colors = [];
    T.factors.forEach(f => f.facets.forEach(() => colors.push(f.color)));
    if (T.independent) T.independent.facets.forEach(() => colors.push(T.independent.color));
    return { values: p.facets, colors };
  }

  // Outline points for one set of values.
  function outline(vals, o) {
    const { clamp } = I();
    const H = Math.max(2, Math.round(2 + o.detail * Math.min(6, Math.floor(vals.length / 2) - 1)));
    // the profile's shape drives the outline; its level is left to the global score (size)
    const m = vals.reduce((a, b) => a + b, 0) / vals.length;
    const f = fourier(o.keepLevel ? vals : vals.map(v => clamp(v - m + 0.62, 0, 1)), H);
    const pts = [];
    for (let i = 0; i < M; i++) {
      const th = TAU * i / M;
      const wob = 0.035 * Math.sin(3 * th + o.ph1) + 0.025 * Math.sin(5 * th + o.ph2);
      const r = o.R * clamp(o.floor + (1 - o.floor) * f(th - o.rot) + wob, 0.12, 1.08);
      pts.push([o.cx + r * Math.cos(th - Math.PI / 2), o.cy + r * Math.sin(th - Math.PI / 2), r, th]);
    }
    return pts;
  }

  function pathOf(ctx, pts, s) {
    ctx.beginPath();
    pts.forEach((p, i) => i ? ctx.lineTo(p[0] * s, p[1] * s) : ctx.moveTo(p[0] * s, p[1] * s));
    ctx.closePath();
  }

  NS.paintRadial = function (ctx, data, opts, s) {
    const X = I(), { W, H, rgb, mix, css, mean, mixColor } = X;
    const { T, people } = X.normalise(data);
    if (!people.length) return;
    const r = X.rng(X.hash([data.theory, data.name, data.date, opts.variation || 0, opts.shape, JSON.stringify(people.map(p => [p.factors, p.facets, p.global]))].join('|')) % 4294967296);
    const w = Math.round(W * s), h = Math.round(H * s);
    const layer = X.mk(w, h), x = layer.getContext('2d');
    const group = data.type === 'group' && people.length > 1;
    const cx = W / 2, cy = H * (opts.centreY != null ? opts.centreY : 0.5);
    const detail = opts.detail != null ? opts.detail : 0.5;
    const pastel = opts.pastel || 0;
    const tint = (hex, k) => mix(rgb(hex), [255, 255, 255], k);
    const P = c => ({ full: tint(c.full, pastel * 0.55), light: tint(c.light, pastel * 0.6) });
    const rot = r() * TAU, ph1 = r() * TAU, ph2 = r() * TAU;
    const team = people[0].factors.map((_, i) => mean(people.map(p => p.factors[i])));
    const [ca, cb] = X.topPair(T, group ? team : people[0].factors);
    const base = { cx, cy, rot, ph1, ph2, detail };
    const Rmax = W * 0.40;

    const shape = opts.shape;
    if (shape === 'contours') {
      // Each line is a step of a blend from a small core to the score outline;
      // the angle turns a little per step, so higher global scores swirl more.
      const outers = group ? people.slice().sort((a, b) => a.global - b.global) : [people[0]];
      const steps = group ? Math.max(3, Math.round(36 / outers.length)) : 36;
      const g = group ? mean(people.map(p => p.global)) : people[0].global;
      const swirl = 0.25 + 0.9 * g;
      const coreVals = series(T, people[0]).values.map(() => 0.5);
      outers.forEach((p, k) => {
        const vals = series(T, p).values;
        const inner = k === 0 ? coreVals : series(T, outers[k - 1]).values;
        const innerR = k === 0 ? 0.12 : (0.55 + 0.45 * outers[k - 1].global) * (0.5 + 0.5 * (k) / outers.length);
        const outerR = group ? (0.55 + 0.45 * p.global) * (0.5 + 0.5 * (k + 1) / outers.length) : 0.82 + 0.18 * p.global;
        for (let i = 0; i < steps; i++) {
          const t = (i + 1) / steps, tt = (k + t) / outers.length;
          const v = vals.map((vv, j) => inner[j] + (vv - inner[j]) * t);
          const pts = outline(v, Object.assign({}, base, { R: Rmax * (innerR + (outerR - innerR) * t), floor: 0.45, rot: rot + swirl * tt * 1.2 }));
          const c = mixColor(ca, cb, tt), cc = P(c);
          pathOf(x, pts, s);
          x.lineWidth = (0.6 + 0.8 * tt) * s; x.strokeStyle = css(mix(cc.full, cc.light, 0.25), 0.55 + 0.4 * tt); x.stroke();
        }
      });
    } else if (shape === 'petals') {
      // One lobe per factor, pointing at that factor's facets, reaching out by its score.
      const list = group ? people : [people[0]];
      list.forEach((p, pi) => {
        const ser = series(T, p);
        const groups = T.id === 'scanin'
          ? [{ color: T.scales.belief.color, idx: ser.values.map((_, j) => j), score: mean(p.factors) }, { color: T.scales.importance.color, idx: ser.values.map((_, j) => j), score: mean(p.facets), inner: true }]
          : (() => { let k = 0; const out = T.factors.map((f, fi) => { const idx = f.facets.map(() => k++); return { color: f.color, idx, score: p.factors[fi] }; }); return out; })();
        const order = groups.map((gr, i) => i).sort((a, b) => groups[b].score - groups[a].score);
        order.forEach((gi, rank) => {
          const gr = groups[gi];
          let color = gr.color;
          if (opts.colorMode !== 'all' && T.id !== 'scanin') color = mixColor(ca, cb, order.length > 1 ? rank / (order.length - 1) : 0);
          const vals = ser.values.map((v, j) => {
            if (gr.inner) return 0.25 + 0.5 * p.facets[j];
            const on = gr.idx.includes(j);
            return on ? 0.35 + 0.65 * v : 0;
          });
          const pts = outline(vals, Object.assign({}, base, { R: Rmax * (group ? 0.7 + 0.3 * p.global : 0.85 + 0.15 * p.global), floor: 0.04, keepLevel: true, detail: Math.min(1, detail + 0.3) }));
          const cc = P(color);
          const grad = x.createRadialGradient(cx * s, cy * s, 0, cx * s, cy * s, Rmax * s);
          grad.addColorStop(0, css(cc.light, 0.15)); grad.addColorStop(0.55, css(cc.light, 0.6)); grad.addColorStop(1, css(cc.full, 0.95));
          pathOf(x, pts, s);
          x.globalAlpha = group ? Math.max(0.12, 0.6 / Math.sqrt(list.length)) : 0.7;
          x.fillStyle = grad; x.fill(); x.globalAlpha = 1;
        });
      });
    } else {
      // blob: filled shape, rim coloured by the factor of the facet under it, pale core
      const list = group ? people.slice().sort((a, b) => b.global - a.global) : [people[0]];
      list.forEach((p, pi) => {
        const ser = series(T, p);
        const R = Rmax * (group ? 0.55 + 0.45 * p.global : 0.82 + 0.18 * p.global);
        const pts = outline(ser.values, Object.assign({}, base, { R, floor: 0.4 }));
        const conic = x.createConicGradient(rot - Math.PI / 2, cx * s, cy * s);
        const n = ser.values.length;
        const colAt = j => {
          if (T.id === 'scanin') return P(T.scales.belief.color);
          if (opts.colorMode === 'all') return P(ser.colors[j]);
          const fi = T.factors.findIndex(f => f.color === ser.colors[j]);
          const sc = fi < 0 ? mean(p.factors) : p.factors[fi];
          const ia = T.factors.findIndex(f => f.color === ca);
          return P(mixColor(ca, cb, X.clamp((p.factors[ia] - sc) * 3, 0, 1)));
        };
        for (let j = 0; j <= n; j++) conic.addColorStop(j / n, css(colAt(j % n).full));
        pathOf(x, pts, s);
        x.globalAlpha = group ? Math.max(0.1, 0.5 / Math.sqrt(list.length)) : 1;
        x.fillStyle = conic; x.fill();
        // pale core fading out to the coloured rim
        const core = x.createRadialGradient(cx * s, cy * s, 0, cx * s, cy * s, R * s);
        core.addColorStop(0, 'rgba(255,255,255,0.92)'); core.addColorStop(0.45, 'rgba(255,255,255,0.55)'); core.addColorStop(1, 'rgba(255,255,255,0)');
        x.fillStyle = core; x.fill();
        x.globalAlpha = 1;
        if (ser.inner) { // Scan-In: importance as an inner blob
          const ip = outline(ser.inner, Object.assign({}, base, { R: R * 0.62, floor: 0.35, rot: rot + 0.4 }));
          const ig = x.createRadialGradient(cx * s, cy * s, 0, cx * s, cy * s, R * 0.62 * s);
          const oc = P(T.scales.importance.color);
          ig.addColorStop(0, css(oc.light, 0.2)); ig.addColorStop(1, css(oc.full, 0.85));
          pathOf(x, ip, s); x.fillStyle = ig; x.fill();
        }
      });
    }
    // thin contour lines would dissolve under the full blur
    const fo = shape === 'contours' ? Object.assign({}, opts, { softness: (opts.softness || 0) * 0.3 }) : opts;
    ctx.drawImage(X.finish(layer, fo, s), 0, 0);
  };
})(typeof window !== 'undefined' ? window : globalThis);
