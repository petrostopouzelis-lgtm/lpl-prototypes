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

  // Default finish for blended contours, as saved by the user in the viewer (2026-11-28).
  NS.CONTOUR_PRESET = { contourStyle: 'filled', softness: 0.70, pastel: 0.86, vibrance: 0.52, grain: 0.33,
    shading: 0.60, blueCore: 0.50, lines: 0.66, detail: 0.53, fit: 0.64, variation: 0 };
  const smoothstep = (a, b, v) => { const t = Math.max(0, Math.min(1, (v - a) / (b - a))); return t * t * (3 - 2 * t); };

  // Mix two sRGB colours ([r,g,b] 0..255) in OKLab, t = share of b; lift adds lightness.
  function toLab(c) {
    const f = v => { v /= 255; return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
    const [r, g, b] = c.map(f);
    const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
    const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
    const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
    return [0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s, 1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s, 0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s];
  }
  function fromLab([L, A, B]) {
    const l = (L + 0.3963377774 * A + 0.2158037573 * B) ** 3, m = (L - 0.1055613458 * A - 0.0638541728 * B) ** 3, s = (L - 0.0894841775 * A - 1.2914855480 * B) ** 3;
    const g = v => { v = v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055; return Math.round(Math.max(0, Math.min(1, v)) * 255); };
    return [g(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s), g(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s), g(-0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s)];
  }
  function oklabMix(a, b, t, lift = 0, chroma = 1) {
    const A = toLab(a), B = toLab(b);
    return fromLab([A[0] + (B[0] - A[0]) * t + lift, (A[1] + (B[1] - A[1]) * t) * chroma, (A[2] + (B[2] - A[2]) * t) * chroma]);
  }

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
    let { cx, cy, Rmax } = k;
    const { P, mixColor, css, mix, mean } = k;
    const sp = spokes(T), detail = opts.detail != null ? opts.detail : 0.8;
    const fitted = k.fitted || {};
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
    const split = 0.5, innerScale = T.id === 'scanin' ? 0.7 : 0.8;
    const shapeAt = t => { // outline function and inner radius for blend step t (0 = core, 1 = outer outline)
      if (t <= split) { const u = Math.pow(t / split, 0.9); return [th => inner(th) * innerScale * u, Rmax * core * Math.min(1, u * 1.6)]; }
      const u = (t - split) / (1 - split); return [th => inner(th) * innerScale * (1 - u) + outer(th) * u, Rmax * core];
    };
    const rotAt = t => rot0 + swirl * Math.pow(1 - t, 1.6);

    // Group rings: each member's ring follows the team outline, pushed out by a gap, and
    // bulges or dips where that member is above or below the team on each facet. Rings
    // nest outwards from lowest to highest global score.
    const memberRings = [];
    if (group) {
      const ranked = people.slice().sort((a, b) => a.global - b.global), n = ranked.length;
      const step = Math.min(0.03, 0.32 / n);
      ranked.forEach((q, i) => {
        const own = radiusFn(T.id === 'scanin' ? q.factors : q.facets, detail);
        memberRings.push(th => outer(th) + 0.07 + step * i + 0.45 * (own(th) - outer(th)));
      });
    }

    // Same place, same size on every cover: measure the whole drawing at its natural size,
    // then move its centre and scale its radii so its bounding box fits a fixed square
    // (opts.fit × page width) centred on the page. Every point is centre + radius ×
    // direction, so changing the centre and Rmax moves and scales it exactly.
    {
      let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity, reach = 0;
      const take = pts => pts.forEach(p => { if (p[0] < x0) x0 = p[0]; if (p[0] > x1) x1 = p[0]; if (p[1] < y0) y0 = p[1]; if (p[1] > y1) y1 = p[1]; reach = Math.max(reach, Math.hypot(p[0] - cx, p[1] - cy)); });
      for (let i = 1; i <= 60; i++) { const t = i / 60, [fn, R0] = shapeAt(t); take(ring(fn, R0 * Math.min(1, t * 4), Rmax * span, rotAt(t), cx, cy)); }
      memberRings.forEach(fn => take(ring(fn, Rmax * core, Rmax * span, rot0, cx, cy))); // a group's rings fit too
      const { W: PW, H: PH } = I();
      const box = PW * (opts.fit != null ? opts.fit : 0.64);
      const kf = box / Math.max(x1 - x0, y1 - y0);
      const tx = PW / 2, ty = PH * (opts.centreY != null ? opts.centreY : 0.5);
      // new centre: the old centre's position relative to the box middle, scaled
      cx = tx + (cx - (x0 + x1) / 2) * kf; cy = ty + (cy - (y0 + y1) / 2) * kf; Rmax *= kf;
      fitted.cx = cx; fitted.cy = cy; fitted.Rmax = Rmax;
      fitted.spokes = { rot0, vals: outerVals, factorVals, reach: reach * kf }; // for the spokes overlay; reach = furthest point from the centre
    }

    if (opts.contourStyle === 'lines') {
      const steps = 52;
      for (let i = 1; i <= steps; i++) {
        const t = i / steps, rot = rotAt(t), [fn, R0] = shapeAt(t);
        stroke(ring(fn, R0, Rmax * span, rot, cx, cy), conic(0.5 * (1 - t), 0.5 + 0.45 * t, rot), 0.35 + 0.65 * t * (group ? 0.7 : 1));
      }
    } else {
      // Filled: the blend steps are stacked as solid layers, outermost first, so they melt
      // into one organic shape. The core is LPL blue, fading out into the score colours:
      // the scores coming out of the lab. Colours are mixed in OKLab so the fades stay clean.
      const blue = P({ full: '#259DD5', light: '#66BAE2' }).full;
      const steps = 90, lines = opts.lines != null ? opts.lines : 0;
      const vib = 1 + 0.6 * (opts.vibrance != null ? opts.vibrance : 0.5); // chroma boost in OKLab
      const W2 = x.canvas.width, H2 = x.canvas.height, mk = I().mk;
      const colour = mk(W2, H2), cx2 = colour.getContext('2d');   // the layered colours
      const dens = mk(W2, H2), dx2 = dens.getContext('2d');       // greyscale: where the lines bunch up
      const path = (c, pts) => { c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(p[0] * s, p[1] * s) : c.moveTo(p[0] * s, p[1] * s)); c.closePath(); };
      const rings = [];
      for (let i = steps; i >= 1; i--) {
        const t = i / steps, rot = rotAt(t), [fn, R0] = shapeAt(t);
        const pts = ring(fn, R0 * Math.min(1, t * 4), Rmax * span, rot, cx, cy);
        rings.push([t, pts]);
        const b = Math.pow(1 - smoothstep(0.0, 0.62, t), 1.7) * (opts.blueCore != null ? opts.blueCore * 2 : 1); // how blue this layer is
        const g = cx2.createConicGradient(-Math.PI / 2 + rot, cx * s, cy * s);
        for (let j = 0; j <= sp.length; j++) {
          const c = P(sp[j % sp.length].color).full;
          g.addColorStop(j / sp.length, css(oklabMix(c, blue, Math.min(1, b), 0.06 * Math.sin(Math.PI * Math.min(1, b)), vib)));
        }
        path(cx2, pts); cx2.fillStyle = g; cx2.fill();
        // every step leaves a faint dark line on the density map; close lines add up
        if (t > 0.12) { path(dx2, pts); dx2.lineWidth = 1.9 * s; dx2.strokeStyle = `rgba(0,0,0,${(0.105 * smoothstep(0.1, 0.28, t)).toFixed(3)})`; dx2.stroke(); }
      }
      // blue centre so no white shows
      const coreR = Rmax * core * 0.5, cg = cx2.createRadialGradient(cx * s, cy * s, 0, cx * s, cy * s, coreR * s);
      cg.addColorStop(0, css(blue)); cg.addColorStop(1, css(blue, 0));
      cx2.beginPath(); cx2.arc(cx * s, cy * s, coreR * s, 0, TAU); cx2.fillStyle = cg; cx2.fill();

      // 1. colours blend inside, but the outline stays sharp: blur, then cut back to the shape
      const soft = Math.max(0, Math.min(1, opts.softness != null ? opts.softness : 0.7));
      const out = mk(W2, H2), o = out.getContext('2d');
      o.filter = `blur(${(7 * soft * s).toFixed(2)}px)`; o.drawImage(colour, 0, 0); o.filter = 'none';
      o.globalCompositeOperation = 'destination-over'; o.drawImage(colour, 0, 0); // fills the blur's faded rim
      // 2. shading from line density: dark where lines bunch (steep), light where they spread
      const shade = Math.max(0, Math.min(1, opts.shading != null ? opts.shading : 0.6));
      if (shade > 0) {
          // A neutral grey relief map: mid grey changes nothing; darker (lines bunched, and
        // the side away from the light) deepens the colour, lighter brightens it. Blended
        // with soft-light, so hue and saturation survive instead of going muddy.
        const sm = mk(W2, H2), sx = sm.getContext('2d');
        sx.filter = `blur(${(3 * s).toFixed(2)}px)`; sx.drawImage(dens, 0, 0); sx.filter = 'none';
        const hl = mk(W2, H2), hx = hl.getContext('2d'); // the same map in white, for highlights
        hx.drawImage(sm, 0, 0); hx.globalCompositeOperation = 'source-in'; hx.fillStyle = '#fff'; hx.fillRect(0, 0, W2, H2);
        const rel = mk(W2, H2), rx = rel.getContext('2d'), d = 2.9 * s;
        rx.fillStyle = '#808080'; rx.fillRect(0, 0, W2, H2);
        rx.globalAlpha = 1; rx.drawImage(sm, d * 0.5, d * 0.5);   // shadow, cast down-right
        rx.globalAlpha = 0.9; rx.drawImage(hl, -d, -d);          // highlight, towards the light
        rx.globalAlpha = 0.85; rx.drawImage(sm, d, d);
        rx.globalAlpha = 0.3; rx.drawImage(sm, d * 2, d * 2);   // a longer, fainter fall-off
        o.globalCompositeOperation = 'soft-light';
        for (let pass = shade; pass > 0; pass -= 0.5) { o.globalAlpha = Math.min(1, pass * 2); o.drawImage(rel, 0, 0); }
        // the same relief again in overlay mode: richer, more saturated light and shade
        o.globalCompositeOperation = 'overlay'; o.globalAlpha = 0.45 * shade; o.drawImage(rel, 0, 0);
        o.globalAlpha = 1;
        // Coloured shadow: a darker, richer copy of the shape's own colours, shown only where
        // the lines bunch (and a little down-right of it). Darkens without going grey.
        const dk = mk(W2, H2), dk2 = dk.getContext('2d');
        dk2.filter = 'brightness(0.72) saturate(1.3)'; dk2.drawImage(out, 0, 0); dk2.filter = 'none';
        const sh = mk(W2, H2), sh2 = sh.getContext('2d');
        sh2.drawImage(sm, d * 0.6, d * 0.6); sh2.globalAlpha = 0.4; sh2.drawImage(sm, d * 1.5, d * 1.5); sh2.globalAlpha = 1;
        dk2.globalCompositeOperation = 'destination-in'; dk2.drawImage(sh, 0, 0);
        o.globalCompositeOperation = 'source-over'; o.globalAlpha = Math.min(1, shade * 0.9);
        o.drawImage(dk, 0, 0); o.globalAlpha = 1;
      }
      if (lines > 0) rings.forEach(([t, pts], i) => { if (i % 2) return; path(o, pts); o.globalCompositeOperation = 'source-over'; o.lineWidth = 0.5 * s; o.strokeStyle = `rgba(255,255,255,${(0.5 * lines).toFixed(3)})`; o.stroke(); });
      o.globalCompositeOperation = 'destination-in'; o.drawImage(colour, 0, 0); // sharp silhouette
      o.globalCompositeOperation = 'source-over';
      // The shape, with a light drop shadow for depth.
      x.save();
      x.shadowColor = 'rgba(25,35,70,0.22)'; x.shadowBlur = 16 * s; x.shadowOffsetX = 3 * s; x.shadowOffsetY = 6 * s;
      x.drawImage(out, 0, 0);
      x.restore();

      // Group: each member is a thin ring on top of the shape: a solid band with a sharp
      // edge, in the facet colours at full strength, each with its own light drop shadow
      // so rings separate from the shape and from each other.
      if (group) {
        const half = Math.max(1.1, Math.min(2.2, 13 / people.length));   // band half-width, pt
        const band = mk(W2, H2), b2 = band.getContext('2d');
        const pathAt = (c, fn, d) => path(c, ring(fn, Rmax * core + d, Rmax * span, rot0, cx, cy));
        const bandPath = (c, fn) => { // outer contour, then inner: filled even-odd = a band
          const o1 = ring(fn, Rmax * core + half, Rmax * span, rot0, cx, cy), i1 = ring(fn, Rmax * core - half, Rmax * span, rot0, cx, cy);
          c.beginPath();
          o1.forEach((p, i) => i ? c.lineTo(p[0] * s, p[1] * s) : c.moveTo(p[0] * s, p[1] * s)); c.closePath();
          i1.forEach((p, i) => i ? c.lineTo(p[0] * s, p[1] * s) : c.moveTo(p[0] * s, p[1] * s)); c.closePath();
        };
        const ringConic = c => {
          const g = c.createConicGradient(-Math.PI / 2 + rot0, cx * s, cy * s);
          for (let j = 0; j <= sp.length; j++) {
            const col = sp[j % sp.length].color, base = mix(I().rgb(col.full), [255, 255, 255], (opts.pastel || 0) * 0.3);
            g.addColorStop(j / sp.length, css(oklabMix(base, base, 0, 0, vib)));
          }
          return g;
        };
        memberRings.forEach(fn => { bandPath(b2, fn); b2.fillStyle = ringConic(b2); b2.fill('evenodd'); });
        if (false) { // tube relief (switched off: rings are flat colour with a drop shadow)
          const rr = mk(W2, H2), q2 = rr.getContext('2d');
          q2.fillStyle = '#808080'; q2.fillRect(0, 0, W2, H2);
          const lit = mk(W2, H2), l2 = lit.getContext('2d');
          memberRings.forEach(fn => {
            [-half, half].forEach(d => { pathAt(l2, fn, d * 0.85); l2.lineWidth = half * 0.9 * s; l2.strokeStyle = 'rgba(0,0,0,0.85)'; l2.stroke(); });
            pathAt(l2, fn, 0); l2.lineWidth = half * 0.55 * s; l2.strokeStyle = 'rgba(255,255,255,0.95)';
            l2.save(); l2.translate(-half * 0.35 * s, -half * 0.35 * s); l2.stroke(); l2.restore();
          });
          q2.filter = `blur(${(half * 0.45 * s).toFixed(2)}px)`; q2.drawImage(lit, 0, 0); q2.filter = 'none';
          b2.globalCompositeOperation = 'soft-light';
          for (let pass = shade; pass > 0; pass -= 0.5) { b2.globalAlpha = Math.min(1, pass * 2); b2.drawImage(rr, 0, 0); }
          b2.globalCompositeOperation = 'overlay'; b2.globalAlpha = 0.5 * shade; b2.drawImage(rr, 0, 0);
          b2.globalAlpha = 1; b2.globalCompositeOperation = 'source-over';
        }
        // each ring filled with the shaded bands as a pattern: sharp edges, own drop shadow
        const pat = x.createPattern(band, 'no-repeat');
        memberRings.forEach(fn => {
          x.save();
          x.shadowColor = 'rgba(25,35,70,0.28)'; x.shadowBlur = 5 * s; x.shadowOffsetX = 1.2 * s; x.shadowOffsetY = 2 * s;
          bandPath(x, fn); x.fillStyle = pat; x.fill('evenodd');
          x.restore();
        });
      }
    }
    if (group && opts.contourStyle === 'lines') memberRings.forEach(fn => {
      const pts = ring(fn, Rmax * core, Rmax * span, rot0, cx, cy);
      stroke(pts, conic(0.1, Math.max(0.3, (opts.contourStyle === 'lines' ? 0.8 : 0.6) / Math.sqrt(people.length)), rot0), 0.9);
    });
  }

  // Facet spokes over the shape: a thin spoke per facet with its name at the end (no scores),
  // and at each score a small 3D sphere in the factor's colour, hovering over the blob.
  // Sphere radius grows with the factor score (3 to 6.6pt across the range).
  // Group reports use the team's average scores.
  function drawGuide(ctx, T, S, s, cx, cy, Rmax, opts = {}) {
    const sp = spokes(T), { rgb, mix, css } = I();
    ctx.save(); ctx.scale(s, s);
    ctx.font = '300 6.5px Inter, "Helvetica Neue", Arial, sans-serif'; ctx.textBaseline = 'middle';
    const at = sp.map((q, j) => {
      const a = q.a + S.rot0, dx = Math.sin(a), dy = -Math.cos(a), v = S.vals[j];
      return { q, j, dx, dy, v };
    });
    at.forEach(({ q, dx, dy, v }) => {
      ctx.strokeStyle = 'rgba(0,0,0,0.18)'; ctx.lineWidth = 0.4;
      // spokes stop just beyond the shape's furthest point, so the chart stays compact
      const end = S.reach + 10, lab = S.reach + 14;
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + dx * end, cy + dy * end); ctx.stroke();
      // facet name only (no score), kept inside the page
      const label = q.name, tw = ctx.measureText(label).width;
      let lx = cx + dx * lab; const ly = cy + dy * lab;
      lx = dx > 0.15 ? lx : dx < -0.15 ? lx - tw : lx - tw / 2;
      lx = Math.max(6, Math.min(I().W - 6 - tw, lx));
      ctx.fillStyle = '#6b7380'; ctx.textAlign = 'left'; ctx.fillText(label, lx, ly);
    });
    ctx.restore();

    // Spheres, treated exactly like the blob: pastel and vibrance on the colours, colours
    // softened inside but cut back to a sharp silhouette, soft-light + overlay relief, a
    // coloured shadow, grain, and a drop shadow. Size grows with the factor score.
    const W2 = ctx.canvas.width, H2 = ctx.canvas.height, mk = I().mk;
    const pastel = opts.pastel || 0, vib = 1 + 0.6 * (opts.vibrance != null ? opts.vibrance : 0.5);
    const tone = c => oklabMix(mix(rgb(c), [255, 255, 255], pastel * 0.55), [0, 0, 0], 0, 0, vib);
    const balls = at.map(({ q, dx, dy, v }) => {
      const r = Rmax * (0.22 + 0.78 * v);
      const fv = T.id === 'scanin' ? v : (q.fi >= 0 ? S.factorVals[q.fi] : v);
      return { x: (cx + dx * r) * s, y: (cy + dy * r) * s, R: (3 + 3.6 * fv) * s, full: tone(q.color.full), light: tone(q.color.light) };
    });
    const col = mk(W2, H2), c2 = col.getContext('2d');
    balls.forEach(b => {
      const g = c2.createRadialGradient(b.x - b.R * 0.35, b.y - b.R * 0.4, b.R * 0.05, b.x, b.y, b.R);
      g.addColorStop(0, css(mix(b.light, [255, 255, 255], 0.22)));
      g.addColorStop(0.45, css(mix(b.full, b.light, 0.3)));
      g.addColorStop(1, css(b.full));
      c2.fillStyle = g; c2.beginPath(); c2.arc(b.x, b.y, b.R, 0, TAU); c2.fill();
    });
    const soft = Math.max(0, Math.min(1, opts.softness != null ? opts.softness : 0.7));
    const shade = Math.max(0, Math.min(1, opts.shading != null ? opts.shading : 0.6));
    const out = mk(W2, H2), o = out.getContext('2d');
    o.filter = `blur(${(1.6 * soft * s).toFixed(2)}px)`; o.drawImage(col, 0, 0); o.filter = 'none';
    o.globalCompositeOperation = 'destination-over'; o.drawImage(col, 0, 0);
    if (shade > 0) {
      // grey relief per sphere: lit top left, dark rim towards the bottom right
      const rel = mk(W2, H2), rx = rel.getContext('2d'), dm = mk(W2, H2), d2 = dm.getContext('2d');
      rx.fillStyle = '#808080'; rx.fillRect(0, 0, W2, H2);
      balls.forEach(b => {
        const g = rx.createRadialGradient(b.x - b.R * 0.3, b.y - b.R * 0.35, 0, b.x + b.R * 0.1, b.y + b.R * 0.1, b.R * 1.05);
        g.addColorStop(0, '#a6a6a6'); g.addColorStop(0.5, '#808080'); g.addColorStop(1, '#2a2a2a');
        rx.fillStyle = g; rx.beginPath(); rx.arc(b.x, b.y, b.R, 0, TAU); rx.fill();
        const k = d2.createRadialGradient(b.x - b.R * 0.3, b.y - b.R * 0.35, b.R * 0.5, b.x, b.y, b.R);
        k.addColorStop(0, 'rgba(0,0,0,0)'); k.addColorStop(1, 'rgba(0,0,0,0.9)');
        d2.fillStyle = k; d2.beginPath(); d2.arc(b.x, b.y, b.R, 0, TAU); d2.fill();
      });
      o.globalCompositeOperation = 'soft-light';
      for (let pass = shade; pass > 0; pass -= 0.5) { o.globalAlpha = Math.min(1, pass * 2); o.drawImage(rel, 0, 0); }
      o.globalCompositeOperation = 'overlay'; o.globalAlpha = 0.45 * shade; o.drawImage(rel, 0, 0);
      // coloured shadow: darker, richer copy of the sphere colours at the rim
      const dk = mk(W2, H2), k2 = dk.getContext('2d');
      k2.filter = 'brightness(0.72) saturate(1.3)'; k2.drawImage(out, 0, 0); k2.filter = 'none';
      k2.globalCompositeOperation = 'destination-in'; k2.drawImage(dm, 0, 0);
      o.globalCompositeOperation = 'source-over'; o.globalAlpha = Math.min(1, shade * 0.9); o.drawImage(dk, 0, 0);
      o.globalAlpha = 1;
    }
    o.globalCompositeOperation = 'destination-in'; o.drawImage(col, 0, 0); // sharp silhouettes
    o.globalCompositeOperation = 'source-over';
    const fin = I().finish(out, Object.assign({}, opts, { softness: 0 }), s); // same grain
    ctx.save();
    ctx.shadowColor = 'rgba(25,35,70,0.14)'; ctx.shadowBlur = 3.5 * s; ctx.shadowOffsetX = 0.8 * s; ctx.shadowOffsetY = 1.6 * s;
    ctx.drawImage(fin, 0, 0);
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
    const fitted = { cx, cy, Rmax };
    if (shape === 'contours') { paintContours(x, T, people, group, opts, s, { cx, cy, Rmax, P, mixColor, css, mix, mean, fitted }); }
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
    // contours handle their own softness (filled: inside only, so the edge stays sharp)
    const fo = shape === 'contours' ? Object.assign({}, opts, { softness: opts.contourStyle === 'lines' ? (opts.softness || 0) * 0.3 : 0 }) : opts;
    ctx.drawImage(X.finish(layer, fo, s), 0, 0);
    if (opts.guide && shape === 'contours' && fitted.spokes) drawGuide(ctx, T, fitted.spokes, s, fitted.cx, fitted.cy, fitted.Rmax, opts);
  };
})(typeof window !== 'undefined' ? window : globalThis);
