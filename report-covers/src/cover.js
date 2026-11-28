// Report cover illustration generator.
//
//   LPLCovers.renderIllustration(canvas, data, opts)  the A4 illustration, transparent background
//
// Titles, logo and name bar are left out for now: this step is only about the illustration.
//
// The illustration is one or more twisted ribbons. Each ribbon runs from the
// bottom-left of the page to the top-right, behind the title, like the reference
// artwork. What the scores do:
//   factor (or domain) scores  bend the ribbon: one control point per factor
//   facet scores               swell and narrow the ribbon along its length
//   global score               sets how many times the ribbon twists, and its overall width
//   the two highest factors    give the two colours (front ribbon + the one behind it)
//   individual report          one shape (a pair of ribbons, like the reference)
//   group report               one thin ribbon per member, braided into a bundle
// The same data always gives the same picture. A seed made from the name, date
// and scores adds small variations, so two people with similar scores still differ.
(function (root) {
  const NS = root.LPLCovers = root.LPLCovers || {};
  const W = 595, H = 842; // A4 in points, the units of the Reports Figma file

  // ---------- small helpers ----------
  function hash(str) { // cyrb53
    let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
    for (let i = 0; i < str.length; i++) { const c = str.charCodeAt(i); h1 = Math.imul(h1 ^ c, 2654435761); h2 = Math.imul(h2 ^ c, 1597334677); }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return (h2 >>> 0) * 4096 + (h1 >>> 0);
  }
  function rng(seed) { // mulberry32
    let a = seed >>> 0;
    return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  }
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const smooth = t => t * t * (3 - 2 * t);
  const lerp = (a, b, t) => a + (b - a) * t;
  const rgb = hex => { const n = parseInt(hex.slice(1), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; };
  const mix = (a, b, t) => [0, 1, 2].map(i => Math.round(lerp(a[i], b[i], t)));
  const css = (c, a = 1) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
  const WHITE = [255, 255, 255];
  const mean = a => a.reduce((s, v) => s + v, 0) / (a.length || 1);

  // ---------- data ----------
  // Turns report data into, per person: factors[] (0..1), facets[] (0..1), global (0..1).
  function normalise(data) {
    const T = NS.THEORIES[data.theory] || NS.THEORIES.teique;
    const pct = v => clamp((+v || 0) / 100, 0, 1);
    const people = (data.people || []).map(p => {
      if (T.id === 'scanin') {
        const belief = T.domains.map(d => pct((p.belief || {})[d]));
        const importance = T.domains.map(d => pct((p.importance || {})[d]));
        return { name: p.name, factors: belief, facets: importance, global: p.global != null ? pct(p.global) : mean(belief), raw: p };
      }
      const factors = T.factors.map(f => pct((p.factors || {})[f.id]));
      const facetNames = T.factors.flatMap(f => f.facets).concat(T.independent ? T.independent.facets : []);
      const facets = facetNames.map(n => (p.facets && p.facets[n] != null) ? pct(p.facets[n]) : null);
      // a facet left out takes its factor's score
      let k = 0;
      T.factors.forEach((f, fi) => f.facets.forEach(() => { if (facets[k] == null) facets[k] = factors[fi]; k++; }));
      for (; k < facets.length; k++) if (facets[k] == null) facets[k] = mean(factors);
      return { name: p.name, factors, facets, global: p.global != null ? pct(p.global) : mean(factors), raw: p };
    });
    return { T, people };
  }

  // The colour pair for a set of factor scores: the two highest factors' colours.
  function topPair(T, factors) {
    if (T.id === 'scanin') return [T.scales.belief.color, T.scales.importance.color];
    const order = factors.map((v, i) => [v, i]).sort((a, b) => b[0] - a[0] || a[1] - b[1]).map(x => x[1]);
    return [T.factors[order[0]].color, T.factors[order[1]].color];
  }

  // ---------- geometry ----------
  const N = 520; // samples along a ribbon

  function catmull(pts, n) { // centripetal-free uniform Catmull-Rom, returns n points
    const out = [];
    const P = [pts[0], ...pts, pts[pts.length - 1]];
    const segs = pts.length - 1;
    for (let i = 0; i < n; i++) {
      const u = i / (n - 1) * segs, s = Math.min(segs - 1, Math.floor(u)), t = u - s;
      const p0 = P[s], p1 = P[s + 1], p2 = P[s + 2], p3 = P[s + 3];
      const t2 = t * t, t3 = t2 * t;
      const f = (a, b, c, d) => 0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
      out.push([f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1])]);
    }
    return out;
  }

  // Interpolated profile along 0..1 from a list of values, smooth between neighbours.
  function profile(vals, t) {
    if (!vals.length) return 0.5;
    const x = clamp(t * vals.length - 0.5, 0, vals.length - 1), i = Math.floor(x), f = smooth(x - i);
    return lerp(vals[i], vals[Math.min(vals.length - 1, i + 1)], f);
  }

  // Centre line of the page's flow, traced from the reference artwork: enters low on
  // the left almost flat, climbs steeply through the middle, rolls over to the right
  // near the top and leaves through the top-right corner.
  const CORRIDOR = [[-0.30, 0.975], [0.04, 0.915], [0.27, 0.80], [0.43, 0.63], [0.54, 0.47], [0.64, 0.33], [0.76, 0.18], [0.95, 0.06], [1.25, -0.04]];
  const corridorPts = catmull(CORRIDOR.map(p => [p[0] * W, p[1] * H]), 400);
  function corridorX(y) {
    for (let i = 1; i < corridorPts.length; i++) {
      const a = corridorPts[i - 1], b = corridorPts[i];
      if ((a[1] - y) * (b[1] - y) <= 0) return lerp(a[0], b[0], (y - a[1]) / ((b[1] - a[1]) || 1));
    }
    return W / 2;
  }

  // Control points for a spine. dev[i] in -1..1 per factor bends the middle of the corridor.
  function spinePoints(dev, r, amp) {
    const k = dev.length, pts = [];
    const j = () => (r() - 0.5) * 0.03 * H;
    pts.push([CORRIDOR[0][0] * W, CORRIDOR[0][1] * H + j()]);
    pts.push([CORRIDOR[1][0] * W, CORRIDOR[1][1] * H + j()]);
    for (let i = 0; i < k; i++) {
      const y = H * lerp(0.78, 0.25, k === 1 ? 0.5 : i / (k - 1));
      const taper = 0.6 + 0.4 * Math.sin(Math.PI * (0.15 + 0.7 * (k === 1 ? 0.5 : i / (k - 1))));
      pts.push([corridorX(y) + dev[i] * amp * W * taper, y]);
    }
    pts.push([CORRIDOR[7][0] * W, CORRIDOR[7][1] * H + j()]);
    pts.push([CORRIDOR[8][0] * W, CORRIDOR[8][1] * H + j()]);
    return pts;
  }

  // Deviation of each control point from the corridor, from factor scores.
  // Sides alternate, so differences between factors read as S-bends.
  function deviations(factors, r) {
    const side = r() < 0.5 ? 1 : -1;
    // The shape of the profile, not its level, bends the ribbon: each factor is taken
    // relative to the person's own average. A gentle seeded wave keeps flat profiles graceful.
    const m = mean(factors);
    let d = factors.map((f, i) => {
      const alt = i % 2 ? -side : side;
      return clamp((f - m) * 3.2, -1, 1) * alt + 0.35 * alt * (0.6 + 0.4 * r());
    });
    // many factors (Scan-In has 8 domains) sit close together: soften so the curve can't knot
    if (d.length > 4) {
      d = d.map((v, i) => 0.5 * v + 0.25 * ((d[i - 1] ?? v) + (d[i + 1] ?? v)));
      d = d.map(v => v * Math.sqrt(4 / factors.length));
    }
    return d;
  }

  // Ribbons widen towards the top of the page, as in the reference.
  const TILT = 0.55;
  const grow = t => 0.78 + 0.6 * smooth(t);

  // One ribbon: centre line, half width, twist, sideways offset. A lane is a strip of a
  // wider ribbon: lane(t) gives its two edges as positions across the parent, -1..1,
  // and it twists with the parent.
  function buildRibbon(o) {
    const C = catmull(o.points, N);
    const R = [];
    for (let i = 0; i < N; i++) {
      const a = C[Math.max(0, i - 1)], b = C[Math.min(N - 1, i + 1)];
      let tx = b[0] - a[0], ty = b[1] - a[1]; const l = Math.hypot(tx, ty) || 1; tx /= l; ty /= l;
      const nx = -ty, ny = tx, t = i / (N - 1);
      const off = o.offset ? o.offset(t) : 0;
      const cx = C[i][0] + nx * off, cy = C[i][1] + ny * off;
      const hw = o.halfWidth(t);
      const th = o.phase + Math.PI * o.halfTwists * (t + o.warp * Math.sin(2 * Math.PI * t + o.phase));
      // bias keeps the front face showing more than the back
      const c = clamp(Math.cos(th) * (1 - o.bias) + o.bias, -1, 1);
      const [p1, p2] = o.lane ? o.lane(t) : [1, -1];
      // Seen from slightly above, the depth of a twisting ribbon shows along its length,
      // so a fold reads as a slanted crease instead of pinching to a point.
      const sn = Math.sin(th) * (1 - o.bias) * TILT;
      const ex = nx * c + tx * sn, ey = ny * c + ty * sn;
      R.push({ x1: cx + ex * hw * p1, y1: cy + ey * hw * p1, x2: cx + ex * hw * p2, y2: cy + ey * hw * p2,
        u1: (1 - p1) / 2, u2: (1 - p2) / 2, c });
    }
    return { pts: R, color: o.color, alpha: o.alpha == null ? 1 : o.alpha, shade: o.shade == null ? 1 : o.shade };
  }

  // Lanes across a sheet: weights(t) gives each lane's share; lanes keep a small gap.
  function lanes(n, weights, gap) {
    return j => t => {
      const w = weights(t), tot = w.reduce((a, b) => a + b, 0), free = 2 - gap * (n - 1);
      let x = 1; for (let i = 0; i < j; i++) x -= w[i] / tot * free + gap;
      return [x, x - w[j] / tot * free];
    };
  }
  const hex = c => '#' + c.map(v => v.toString(16).padStart(2, '0')).join('');
  const mixColor = (A, B, t) => ({ full: hex(mix(rgb(A.full), rgb(B.full), t)), light: hex(mix(rgb(A.light), rgb(B.light), t)) });

  // Everything to draw, back to front.
  function layout(data, opts) {
    const { T, people } = normalise(data);
    if (!people.length) return [];
    const seedStr = [data.theory, data.name, data.date, opts.variation || 0, JSON.stringify(people.map(p => [p.factors, p.facets, p.global]))].join('|');
    const r = rng(hash(seedStr) % 4294967296);
    const group = data.type === 'group' && people.length > 1;
    const ribbons = [];

    if (!group && opts.colorMode !== 'all') {
      // individual: the reference's pair of ribbons, front in the top factor's colour
      const p = people[0], [ca, cb] = topPair(T, p.factors);
      const dev = deviations(p.factors, r), pts = spinePoints(dev, r, 0.15);
      const base = W * 0.095 * (0.8 + 0.4 * p.global);
      const halfTwists = 1.8 + 1.6 * p.global, phase = r() * Math.PI * 2;
      const facets = p.facets, spread = 0.04 + 0.08 * Math.abs(p.factors[0] - p.factors[p.factors.length - 1]);
      const ph2 = r() * Math.PI * 2;
      ribbons.push(buildRibbon({ points: pts, color: cb, phase: phase + 0.7, halfTwists: halfTwists * 0.92, warp: 0.05, bias: 0.12,
        halfWidth: t => base * 1.05 * grow(t) * (0.6 + 0.8 * profile(facets.slice().reverse(), t)),
        offset: t => W * spread * (Math.sin(Math.PI * 1.6 * t + ph2) + 0.4 * Math.sin(Math.PI * 3.4 * t + ph2 * 2)) }));
      ribbons.push(buildRibbon({ points: pts, color: ca, phase, halfTwists, warp: 0.06, bias: 0.15,
        halfWidth: t => base * grow(t) * (0.6 + 0.8 * profile(facets, t)) }));
      return ribbons;
    }

    // A sheet of lanes: one lane per group member, or (colour mode "all") one per factor.
    // The sheet bends with the (team) factor scores and twists as one surface.
    const p0 = people[0];
    const sheetFactors = group ? p0.factors.map((_, i) => mean(people.map(p => p.factors[i]))) : p0.factors;
    const sheetFacets = group ? p0.facets.map((_, i) => mean(people.map(p => p.facets[i]))) : p0.facets;
    const g = group ? mean(people.map(p => p.global)) : p0.global;
    let colors, weights;
    if (group) {
      const [ca, cb] = topPair(T, sheetFactors);
      const ia = T.id === 'scanin' ? -1 : T.factors.findIndex(f => f.color === ca);
      const ib = T.id === 'scanin' ? -1 : T.factors.findIndex(f => f.color === cb);
      // members ordered from most "colour A" to most "colour B", so the colours blend across the sheet
      const lean = p => ia < 0 ? mean(p.factors) - mean(p.facets) : p.factors[ia] - p.factors[ib];
      const ordered = people.slice().sort((x, y) => lean(y) - lean(x));
      const n = ordered.length;
      colors = ordered.map((_, j) => mixColor(ca, cb, n === 1 ? 0 : j / (n - 1)));
      // each lane swells where its member scores high along the factor sequence
      weights = t => ordered.map(p => (0.5 + p.global) * (0.45 + profile(p.factors, t)));
    } else {
      colors = T.factors.map(f => f.color);
      const facetsOf = []; let k = 0;
      T.factors.forEach(f => { facetsOf.push(p0.facets.slice(k, k + f.facets.length)); k += f.facets.length; });
      weights = t => T.factors.map((f, j) => 0.25 + p0.factors[j] * (0.5 + profile(facetsOf[j], t)));
    }
    const n = colors.length, gap = Math.min(0.05, 0.4 / n);
    const lane = lanes(n, weights, gap);
    const dev = deviations(sheetFactors, r), pts = spinePoints(dev, r, 0.15);
    const base = W * 0.11 * (0.8 + 0.4 * g);
    const halfTwists = 1.6 + 1.4 * g, phase = r() * Math.PI * 2;
    colors.forEach((color, j) => ribbons.push(buildRibbon({ points: pts, color, phase, halfTwists, warp: 0.06, bias: 0.15, shade: 0.55,
      lane: lane(j), halfWidth: t => base * grow(t) * (0.7 + 0.6 * profile(sheetFacets, t)) })));
    return ribbons;
  }

  // ---------- drawing ----------
  // A ribbon is drawn as overlapping quads, each with a gradient across its width.
  // The saturated edge is on one side of the ribbon; when the ribbon twists, the
  // sides swap on screen, which is what makes it read as a turning surface.
  // Colour of a face at u (0 = saturated edge, 1 = pale edge), as [rgb, alpha].
  function faceColor(full, light, front, k, u) {
    const S = front
      ? [[0, full, 1], [0.45, mix(light, full, k), 0.96], [1, mix(light, full, k * 0.5), 0.4 + k * 0.3]]
      : [[0, mix(light, full, k * 0.4), 0.25 + k * 0.3], [0.6, mix(mix(light, WHITE, 0.2), full, k), 0.9], [1, mix(full, light, 0.15), 1]];
    for (let i = 1; i < S.length; i++) if (u <= S[i][0]) {
      const f = (u - S[i - 1][0]) / (S[i][0] - S[i - 1][0]);
      return [mix(S[i - 1][1], S[i][1], f), lerp(S[i - 1][2], S[i][2], f)];
    }
    return [S[S.length - 1][1], S[S.length - 1][2]];
  }

  function drawRibbon(ctx, rb, s, pastel = 0) {
    const full = mix(rgb(rb.color.full), WHITE, pastel * 0.55), light = mix(rgb(rb.color.light), WHITE, pastel * 0.6);
    const P = rb.pts;
    // Quads overlap two deep, so each alpha is set to land on its target after two coats.
    const A = a => 1 - Math.sqrt(1 - clamp(a, 0, 0.999));
    for (let i = 0; i < P.length - 2; i++) {
      const a = P[i], b = P[i + 2];
      const L1 = [a.x1 * s, a.y1 * s], R1 = [a.x2 * s, a.y2 * s], L2 = [b.x1 * s, b.y1 * s], R2 = [b.x2 * s, b.y2 * s];
      const k = (1 - Math.abs(a.c)) * 0.55; // folds, seen edge-on, look deeper
      const front = a.c >= 0;
      const u = x => rb.shade * lerp(a.u1, a.u2, x);
      let g;
      if (Math.hypot(L1[0] - R1[0], L1[1] - R1[1]) < 0.5) { const [c, al] = faceColor(full, light, front, k, u(0.5)); g = css(c, A(al)); }
      else {
        g = ctx.createLinearGradient(L1[0], L1[1], R1[0], R1[1]);
        for (const x of [0, 0.25, 0.5, 0.75, 1]) { const [c, al] = faceColor(full, light, front, k, u(x)); g.addColorStop(x, css(c, A(al))); }
      }
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.moveTo(L1[0], L1[1]); ctx.lineTo(L2[0], L2[1]); ctx.lineTo(R2[0], R2[1]); ctx.lineTo(R1[0], R1[1]); ctx.closePath(); ctx.fill();
    }
  }

  let noiseTile = null;
  function noise() {
    if (noiseTile) return noiseTile;
    const c = document.createElement('canvas'); c.width = c.height = 256;
    const x = c.getContext('2d'), im = x.createImageData(256, 256), r = rng(7);
    for (let i = 0; i < im.data.length; i += 4) { const v = r() < 0.5 ? 0 : 255; im.data[i] = im.data[i + 1] = im.data[i + 2] = v; im.data[i + 3] = Math.floor(r() * 255); }
    x.putImageData(im, 0, 0); return (noiseTile = c);
  }
  const mk = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };

  // Draws the illustration into ctx at scale s (pixels per point).
  function paintIllustration(ctx, data, opts, s) {
    opts = Object.assign({ softness: 0.7, grain: 0.2, pastel: 0.4, variation: 0, colorMode: 'pair' }, opts);
    const w = Math.round(W * s), h = Math.round(H * s);
    const ribbons = layout(data, opts);
    const layer = mk(w, h), lx = layer.getContext('2d');
    const one = mk(w, h), ox = one.getContext('2d');
    ribbons.forEach(rb => {
      ox.clearRect(0, 0, w, h); drawRibbon(ox, rb, s, opts.pastel);
      lx.globalAlpha = rb.alpha; lx.drawImage(one, 0, 0); lx.globalAlpha = 1;
    });
    // soft, blended finish like the rasterised reference
    const out = mk(w, h), x = out.getContext('2d');
    const soft = clamp(opts.softness, 0, 1);
    if (soft > 0) {
      x.filter = `blur(${(9 * soft * s).toFixed(2)}px)`; x.globalAlpha = 0.4 * soft; x.drawImage(layer, 0, 0);
      x.filter = `blur(${(2.8 * soft * s).toFixed(2)}px)`; x.globalAlpha = 1; x.drawImage(layer, 0, 0);
      x.filter = 'none'; x.globalAlpha = Math.max(0, 1 - soft * 1.1); x.drawImage(layer, 0, 0); x.globalAlpha = 1;
    } else x.drawImage(layer, 0, 0);
    if (opts.grain > 0) { // grain only where there is colour
      x.save(); x.globalCompositeOperation = 'source-atop'; x.globalAlpha = 0.22 * opts.grain;
      const pat = x.createPattern(noise(), 'repeat');
      const k = Math.max(1, s / 1.5); pat.setTransform(new DOMMatrix([k, 0, 0, k, 0, 0]));
      x.fillStyle = pat; x.fillRect(0, 0, w, h); x.restore();
    }
    ctx.drawImage(out, 0, 0);
  }

  function size(canvas, s) { canvas.width = Math.round(W * s); canvas.height = Math.round(H * s); return canvas.getContext('2d'); }
  NS.renderIllustration = (canvas, data, opts = {}) => { const s = opts.scale || 2; paintIllustration(size(canvas, s), data, opts, s); };
  NS.PAGE = { W, H };
  NS._internal = { normalise, topPair, layout, hash, rng };
})(typeof window !== 'undefined' ? window : globalThis);
