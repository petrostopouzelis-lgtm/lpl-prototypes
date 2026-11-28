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


  // ---------- contours: a radial chart of every facet, drawn as blend steps ----------
  // Facets sit on fixed spokes, grouped by factor, starting at the top and running
  // clockwise. The outline passes through each facet's own score (radius = score), so
  // every facet shows as its own bulge or dip. Lines step from a small core out to
  // that outline; around the circle each line takes the colour of the facet's factor.

  // Spoke layout: angle (0 = top) and colour for every facet.
  function spokes(T) {
    const light = hex => { const n = parseInt(hex.slice(1), 16), c = [n >> 16 & 255, n >> 8 & 255, n & 255].map(v => Math.round(v + (255 - v) * 0.4)); return '#' + c.map(v => v.toString(16).padStart(2, '0')).join(''); };
    if (T.id === 'scanin') return T.domains.map((d, j) => ({ name: d, a: TAU * j / T.domains.length, fi: j, color: { full: T.domainColors[d], light: light(T.domainColors[d]) } }));
    const list = [];
    T.factors.forEach((f, fi) => f.facets.forEach(n => list.push({ name: n, color: f.color, fi })));
    if (T.independent) T.independent.facets.forEach(n => list.push({ name: n, color: T.independent.color, fi: -1 }));
    return list.map((sp, j) => Object.assign(sp, { a: TAU * j / list.length }));
  }

  // Radius at angle th through every value, using periodic Catmull-Rom, blended with a
  // smoother Fourier version by `detail` (1 = passes exactly through each score).
  function radiusFn(vals, detail) {
    const m = vals.length, f = fourier(vals, Math.max(2, Math.floor(m / 3)));
    return th => {
      const u = ((th / TAU) % 1 + 1) % 1 * m, i = Math.floor(u), t = u - i;
      const p0 = vals[(i - 1 + m) % m], p1 = vals[i % m], p2 = vals[(i + 1) % m], p3 = vals[(i + 2) % m];
      const cr = 0.5 * (2 * p1 + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t * t + (-p0 + 3 * p1 - 3 * p2 + p3) * t * t * t);
      return detail * cr + (1 - detail) * f(th);
    };
  }

  function ring(fn, R0, R1, rot, cx, cy) { // points of one contour, radius R0 + R1*fn(th)
    const pts = [];
    for (let i = 0; i < M; i++) {
      const th = TAU * i / M, r = R0 + R1 * Math.max(0, Math.min(1.05, fn(th - rot)));
      pts.push([cx + r * Math.sin(th), cy - r * Math.cos(th)]);
    }
    return pts;
  }

  function paintContours(x, T, people, group, opts, s, k) {
    const { cx, cy, Rmax, P, mixColor, css, mix, mean } = k;
    const sp = spokes(T), detail = opts.detail != null ? opts.detail : 0.8;
    const rot0 = (opts.variation || 0) * 0.07; // variation turns the chart a little; 0 keeps the first facet at the top
    const core = 0.22, span = 0.78; // radius = Rmax * (core + span * score)
    // conic gradient: each facet's factor colour at its spoke, tinted by step
    const conic = (tint, alpha, rot) => {
      const g = x.createConicGradient(-Math.PI / 2 + rot, cx * s, cy * s);
      for (let j = 0; j <= sp.length; j++) {
        const c = P(sp[j % sp.length].color);
        g.addColorStop(j / sp.length, css(mix(c.full, c.light, tint), alpha));
      }
      return g;
    };
    const stroke = (pts, style, t) => {
      x.beginPath(); pts.forEach((p, i) => i ? x.lineTo(p[0] * s, p[1] * s) : x.moveTo(p[0] * s, p[1] * s)); x.closePath();
      x.lineWidth = (0.45 + 0.9 * t) * s; x.strokeStyle = style; x.stroke();
    };

    // Two outlines, and the lines morph from a small core to the inner one, then on to the
    // outer one. TEIQue/TSIQue: inner = factor level (each spoke at its factor's score, so
    // factors read as broad lobes), outer = facet level (every facet its own bump).
    // Scan-In: inner = importance, outer = belief, every domain in its own colour.
    const avg = (k) => group ? mean(people.map(q => q[k])) : people[0][k];
    const facetVals = people[0].facets.map((_, j) => group ? mean(people.map(q => q.facets[j])) : people[0].facets[j]);
    const factorVals = people[0].factors.map((_, i) => group ? mean(people.map(q => q.factors[i])) : people[0].factors[i]);
    let innerVals, outerVals;
    if (T.id === 'scanin') { innerVals = facetVals; outerVals = factorVals; }
    else {
      const ind = mean(facetVals.filter((_, j) => sp[j].fi < 0)) || mean(factorVals);
      innerVals = sp.map(q => q.fi >= 0 ? factorVals[q.fi] : ind);
      outerVals = facetVals;
    }
    const inner = radiusFn(innerVals, detail), outer = radiusFn(outerVals, detail);
    const g = avg('global');
    const swirl = 0.25 + 1.1 * g; // inner lines turn; the outermost line sits exactly on the spokes
    const steps = 52, split = 0.5, innerScale = T.id === 'scanin' ? 0.7 : 0.8;
    for (let i = 1; i <= steps; i++) {
      const t = i / steps, rot = rot0 + swirl * Math.pow(1 - t, 1.6);
      let fn, R0;
      if (t <= split) { const u = Math.pow(t / split, 0.9); fn = th => inner(th) * innerScale * u; R0 = Rmax * core * Math.min(1, u * 1.6); }
      else { const u = (t - split) / (1 - split); fn = th => inner(th) * innerScale * (1 - u) + outer(th) * u; R0 = Rmax * core; }
      stroke(ring(fn, R0, Rmax * span, rot, cx, cy), conic(0.5 * (1 - t), 0.5 + 0.45 * t, rot), 0.35 + 0.65 * t * (group ? 0.7 : 1));
    }
    if (group) people.forEach(q => {
      const pts = ring(radiusFn(T.id === 'scanin' ? q.factors : q.facets, detail), Rmax * core, Rmax * span, rot0, cx, cy);
      stroke(pts, conic(0.1, Math.max(0.35, 0.8 / Math.sqrt(people.length)), rot0), 0.9);
    });
  }

  // Spokes and facet names over the shape, for checking only (not part of the artwork).
  function drawGuide(ctx, T, p, s, cx, cy, Rmax, group) {
    const sp = spokes(T);
    ctx.save(); ctx.scale(s, s);
    ctx.font = '400 7px Inter, sans-serif'; ctx.textBaseline = 'middle';
    sp.forEach((q, j) => {
      const dx = Math.sin(q.a), dy = -Math.cos(q.a);
      ctx.strokeStyle = 'rgba(0,0,0,0.18)'; ctx.lineWidth = 0.4;
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + dx * Rmax * 1.04, cy + dy * Rmax * 1.04); ctx.stroke();
      const v = T.id === 'scanin' ? p.factors[j] : p.facets[j];
      if (!group) { // the facet's score as a dot on its spoke
        const r = Rmax * (0.22 + 0.78 * v); // same mapping as the outline
        ctx.fillStyle = q.color.full; ctx.beginPath(); ctx.arc(cx + dx * r, cy + dy * r, 1.6, 0, TAU); ctx.fill();
      }
      // label kept inside the page
      const label = q.name + (group ? '' : ' ' + Math.round(v * 100)), tw = ctx.measureText(label).width;
      let lx = cx + dx * Rmax * 1.08; const ly = cy + dy * Rmax * 1.08;
      lx = dx > 0.15 ? lx : dx < -0.15 ? lx - tw : lx - tw / 2;
      lx = Math.max(6, Math.min(I().W - 6 - tw, lx));
      ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.textAlign = 'left'; ctx.fillText(label, lx, ly);
    });
    ctx.restore();
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
    if (shape === 'contours') { paintContours(x, T, people, group, opts, s, { cx, cy, Rmax, P, mixColor, css, mix, mean }); }
    else if (shape === 'petals') {
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
    if (opts.guide) drawGuide(ctx, T, people[0], s, cx, cy, Rmax, group);
  };
})(typeof window !== 'undefined' ? window : globalThis);
