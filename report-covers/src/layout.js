// Cover layouts: the illustration plus the cover typography.
//
//   await LPLCovers.ready()                         fonts and logo loaded
//   LPLCovers.renderCover(canvas, data, opts)       whole A4 cover
//     opts.layout  'masthead' | 'bleed' | 'poster'
//
// Brand: the design system's fonts (Manrope titles, Inter text), brand blue #259DD5 with
// the report blue #42A2DA, the orange "ue" accent #E47C2D, and the LPL horizontal logo.
// Fixed wording is copied from the reference cover; nothing else is written here.
// data: { theory, type, name, date, reportTitle?, subtitle? }
(function (root) {
  const NS = root.LPLCovers = root.LPLCovers || {};
  const W = 595, H = 842;
  const BLUE = '#259DD5', RBLUE = '#42A2DA', ACCENT = '#E47C2D', INK = '#1e1e1e', MUTED = '#6b7380', RULE = '#cfd6dd';
  const COPYRIGHT = year => `© K. V. Petrides ${year}. All rights reserved.`;
  const PRODUCT = 'A product of London Psychometric Laboratory Ltd.';

  let logo = null;
  NS.ready = function () {
    const fonts = document.fonts ? Promise.all(['600 20px Manrope', '700 20px Manrope', '300 12px Inter', '400 12px Inter', '500 12px Inter']
      .map(f => document.fonts.load(f).catch(() => null))) : Promise.resolve();
    const img = NS.LOGO_SRC ? new Promise(res => { const i = new Image(); i.onload = () => { logo = i; res(); }; i.onerror = () => res(); i.src = NS.LOGO_SRC; }) : Promise.resolve();
    return Promise.all([fonts, img]);
  };

  // text helpers (in points; the context is already scaled)
  const MANROPE = (w, px) => `${w} ${px}px Manrope, "Helvetica Neue", Arial, sans-serif`;
  const INTER = (w, px) => `${w} ${px}px Inter, "Helvetica Neue", Arial, sans-serif`;
  function fit(ctx, str, font, size, maxW, min = 7) { let f = size; ctx.font = font(f); while (ctx.measureText(str).width > maxW && f > min) { f -= 0.25; ctx.font = font(f); } return f; }
  // Name on up to two lines in maxW, shrinking only if two lines are not enough.
  function wrap2(ctx, str, fontFn, size, maxW, min = 8) {
    for (let f = size; f >= min; f -= 0.25) {
      ctx.font = fontFn(f);
      if (ctx.measureText(str).width <= maxW) return { f, lines: [str] };
      const words = str.split(/\s+/); let a = '', lines = [];
      words.forEach(w => { const t = a ? a + ' ' + w : w; if (ctx.measureText(t).width <= maxW || !a) a = t; else { lines.push(a); a = w; } });
      lines.push(a);
      if (lines.length <= 2 && lines.every(l => ctx.measureText(l).width <= maxW)) return { f, lines };
    }
    return { f: min, lines: [str] };
  }
  function text(ctx, str, x, y, font, color, align = 'left', base = 'alphabetic') { ctx.font = font; ctx.fillStyle = color; ctx.textAlign = align; ctx.textBaseline = base; ctx.fillText(str, x, y); }
  function hline(ctx, x0, x1, y, c = RULE, w = 0.5) { ctx.strokeStyle = c; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke(); }
  function vline(ctx, x, y0, y1, c = RULE, w = 0.5) { ctx.strokeStyle = c; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(x, y0); ctx.lineTo(x, y1); ctx.stroke(); }

  // theory wordmark: "TEIQ" in report blue, "ue" in the orange accent (Scan-In: "In", plus ™)
  function wordmark(ctx, T, x, y, px, align = 'left') {
    ctx.font = MANROPE(700, px);
    const parts = T.wordmark.map((p, i) => ({ p, sup: p === '™', color: i === 1 ? ACCENT : RBLUE }));
    const width = parts.reduce((w, q) => { ctx.font = MANROPE(700, q.sup ? px * 0.5 : px); return w + ctx.measureText(q.p).width; }, 0);
    let cx = align === 'right' ? x - width : align === 'center' ? x - width / 2 : x;
    parts.forEach(q => {
      ctx.font = MANROPE(700, q.sup ? px * 0.5 : px); ctx.fillStyle = q.sup ? RBLUE : q.color; ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
      ctx.fillText(q.p, cx, q.sup ? y - px * 0.42 : y); cx += ctx.measureText(q.p).width;
    });
    return width;
  }
  function drawLogo(ctx, x, y, w, align = 'left') {
    if (!logo) return 0;
    const h = w * logo.height / logo.width, lx = align === 'center' ? x - w / 2 : align === 'right' ? x - w : x;
    ctx.drawImage(logo, lx, y, w, h); return h;
  }
  const titleOf = d => d.reportTitle || (d.type === 'group' ? 'Team Report' : 'Personal Report');
  const yearOf = d => { const m = String(d.date || '').match(/(\d{4})/); return m ? m[1] : new Date().getFullYear(); };

  // wordmark sized to fill a width
  function wordmarkToWidth(ctx, T, x, y, maxW, maxPx, align = 'left') {
    ctx.font = MANROPE(700, 100);
    let w = 0; T.wordmark.forEach(p => { ctx.font = MANROPE(700, p === '™' ? 50 : 100); w += ctx.measureText(p).width; });
    const px = Math.min(maxPx, 100 * maxW / w);
    wordmark(ctx, T, x, y, px, align);
    return px;
  }
  const lineOf = d => titleOf(d) + (d.subtitle ? '  ·  ' + d.subtitle : '');

  // Magazine-style layouts: big type, the diagram as the cover subject.
  // under(): drawn before the art (the art overlaps it); draw(): drawn on top.
  const LAYOUTS = {
    // A giant theory wordmark as the masthead; the diagram overlaps its foot like a cover
    // subject; the person's name set large at the bottom.
    masthead: {
      art: { centreY: 0.585, fit: 0.84 },
      under(ctx, d, T) { wordmarkToWidth(ctx, T, W / 2, 196, W - 44, 190, 'center'); },
      draw(ctx, d, T) {
        drawLogo(ctx, 24, 24, 104);
        text(ctx, COPYRIGHT(yearOf(d)), W - 24, 34, INTER(300, 6.5), MUTED, 'right');
        text(ctx, lineOf(d).toUpperCase(), W - 24, 48, MANROPE(600, 8.5), INK, 'right');
        hline(ctx, 24, W - 24, 60, INK, 0.6);
        const nm = wrap2(ctx, d.name || '', f => MANROPE(700, f), 38, W - 200, 18);
        const yb = 790;
        nm.lines.forEach((l, i) => text(ctx, l, 24, yb - (nm.lines.length - 1 - i) * (nm.f * 1.05), MANROPE(700, nm.f), INK));
        hline(ctx, 24, W - 24, 806, INK, 0.6);
        text(ctx, d.date || '', 24, 820, INTER(400, 8.5), INK);
        text(ctx, PRODUCT, W - 24, 820, INTER(300, 6.5), MUTED, 'right');
      },
    },
    // The diagram oversized and running off the right edge; a strong type column on the left.
    bleed: {
      art: { centreX: 0.7, centreY: 0.53, fit: 0.98 },
      under(ctx, d, T) {},
      draw(ctx, d, T) {
        drawLogo(ctx, 28, 28, 112);
        wordmarkToWidth(ctx, T, 28, 150, 250, 64);
        const t = titleOf(d).split(' ');
        t.forEach((w, i) => text(ctx, w, 28, 196 + i * 36, MANROPE(700, 34), INK));
        if (d.subtitle) text(ctx, d.subtitle, 28, 196 + t.length * 36 - 8, INTER(300, 15), MUTED);
        const nm = wrap2(ctx, d.name || '', f => MANROPE(700, f), 26, 230, 14);
        nm.lines.forEach((l, i) => text(ctx, l, 28, 744 + i * (nm.f * 1.1), MANROPE(700, nm.f), INK));
        text(ctx, d.date || '', 28, 744 + nm.lines.length * (nm.f * 1.1) + 4, INTER(400, 10), MUTED);
        text(ctx, COPYRIGHT(yearOf(d)), 28, 822, INTER(300, 6.5), MUTED);
        text(ctx, PRODUCT, 28, 831, INTER(300, 6.5), MUTED);
      },
    },
    // The diagram fills the page; the name runs huge across the foot, the wordmark and report
    // line sit in a slim top band.
    poster: {
      art: { centreY: 0.47, fit: 0.96 },
      under(ctx, d, T) {},
      draw(ctx, d, T) {
        drawLogo(ctx, 24, 24, 100);
        wordmarkToWidth(ctx, T, W - 24, 52, 160, 30, 'right');
        text(ctx, lineOf(d), W - 24, 68, MANROPE(600, 9.5), INK, 'right');
        const nm = wrap2(ctx, d.name || '', f => MANROPE(700, f), 64, W - 48, 22);
        const yb = 786;
        nm.lines.forEach((l, i) => text(ctx, l, 24, yb - (nm.lines.length - 1 - i) * (nm.f * 1.02), MANROPE(700, nm.f), BLUE));
        text(ctx, d.date || '', 24, 812, INTER(500, 9), INK);
        text(ctx, COPYRIGHT(yearOf(d)), W - 24, 812, INTER(300, 6.5), MUTED, 'right');
        text(ctx, PRODUCT, W - 24, 822, INTER(300, 6.5), MUTED, 'right');
      },
    },
  };
  NS.LAYOUTS = Object.keys(LAYOUTS);

  NS.renderCover = function (canvas, data, opts = {}) {
    const s = opts.scale || 2, T = NS.THEORIES[data.theory] || NS.THEORIES.teique;
    const L = LAYOUTS[opts.layout] || LAYOUTS.masthead;
    canvas.width = Math.round(W * s); canvas.height = Math.round(H * s);
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.save(); ctx.scale(s, s); if (L.under) L.under(ctx, data, T); ctx.restore();
    const art = document.createElement('canvas');
    NS.renderIllustration(art, data, Object.assign({}, opts, L.art, opts.fit != null && opts.keepFit ? { fit: opts.fit } : {}, { scale: s }));
    ctx.drawImage(art, 0, 0);
    ctx.save(); ctx.scale(s, s); L.draw(ctx, data, T); ctx.restore();
  };
})(typeof window !== 'undefined' ? window : globalThis);
