// Cover layouts: the illustration plus the cover typography.
//
//   await LPLCovers.ready()                         fonts and logo loaded
//   LPLCovers.renderCover(canvas, data, opts)       whole A4 cover
//     opts.layout  'pill' | 'plain'
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

  // Brand layouts, centred on one axis: logo and title group at the top, the diagram in the
  // middle (its spokes reach out to fill the free area), the name and date as one group,
  // and all legal lines together at the foot. No black rules.
  const SAFE = { x0: 70, y0: 214, x1: W - 70, y1: 700 };   // the side spokes run past x0/x1 to a 28pt page margin   // free area for the diagram and its labels
  const ART = { centreY: (SAFE.y0 + SAFE.y1) / 2 / H, fit: 0.58 };
  function header(ctx, d, T) {
    drawLogo(ctx, W / 2, 34, 300, 'center');
    // one line: wordmark • report title • form, separated by small blue gradient circles
    const px = 24, gap = 13, r = 4, y = 170;
    const parts = [{ wm: true }, { t: titleOf(d), w: 700 }].concat(d.subtitle ? [{ t: d.subtitle, w: 400 }] : []);
    parts.forEach(p => {
      if (p.wm) { p.width = T.wordmark.reduce((a, q) => { ctx.font = MANROPE(700, q === '™' ? px * 0.5 : px); return a + ctx.measureText(q).width; }, 0); }
      else { ctx.font = MANROPE(p.w, px); p.width = ctx.measureText(p.t).width; }
    });
    const sep = gap * 2 + r * 2;
    let x = W / 2 - (parts.reduce((a, p) => a + p.width, 0) + px * 0.3 + sep * (parts.length - 2)) / 2;
    parts.forEach((p, i) => {
      if (i === 1) x += px * 0.3; // wordmark and report title read as one phrase
      else if (i) {
        const ccx = x + gap + r, ccy = y - px * 0.34;
        const g = ctx.createLinearGradient(ccx - r, ccy - r, ccx + r, ccy + r); g.addColorStop(0, BLUE); g.addColorStop(1, '#66BAE2');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(ccx, ccy, r, 0, Math.PI * 2); ctx.fill();
        x += sep;
      }
      if (p.wm) wordmark(ctx, T, x, y, px); else text(ctx, p.t, x, y, MANROPE(p.w, px), RBLUE);
      x += p.width;
    });
  }
  function legal(ctx, d) {
    text(ctx, COPYRIGHT(yearOf(d)) + '   ·   ' + PRODUCT, W / 2, 820, INTER(300, 8), MUTED, 'center');
  }
  const LAYOUTS = {
    pill: {
      art: ART, safe: SAFE,
      draw(ctx, d, T) {
        header(ctx, d, T); legal(ctx, d);
        const name = d.name || '', date = d.date || '';
        const nf = fit(ctx, name, f => MANROPE(400, f), 16, 380, 10);
        ctx.font = MANROPE(400, nf); const nw = ctx.measureText(name).width, dw = ctx.measureText(date).width;
        const ph = 40, pw = nw + dw + 74, px = W / 2 - pw / 2, py = 742;
        const g = ctx.createLinearGradient(px, 0, px + pw, 0); g.addColorStop(0, BLUE); g.addColorStop(1, '#66BAE2');
        ctx.save(); ctx.shadowColor = 'rgba(37,157,213,0.3)'; ctx.shadowBlur = 10; ctx.shadowOffsetY = 2;
        ctx.fillStyle = g; ctx.beginPath(); ctx.roundRect(px, py, pw, ph, 14); ctx.fill(); ctx.restore();
        text(ctx, name, px + 22, py + ph / 2 + 0.5, MANROPE(400, nf), '#fff', 'left', 'middle');
        ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(px + 22 + nw + 14, py + ph / 2, 3.2, 0, Math.PI * 2); ctx.fill();
        text(ctx, date, px + 22 + nw + 28, py + ph / 2 + 0.5, MANROPE(400, nf), '#fff', 'left', 'middle');
      },
    },
    plain: {
      art: ART, safe: SAFE,
      draw(ctx, d, T) {
        header(ctx, d, T); legal(ctx, d);
        const nm = wrap2(ctx, d.name || '', f => MANROPE(600, f), 18, 420, 11);
        const y0 = nm.lines.length > 1 ? 748 : 758;
        nm.lines.forEach((l, i) => text(ctx, l, W / 2, y0 + i * (nm.f + 3), MANROPE(600, nm.f), RBLUE, 'center'));
        text(ctx, d.date || '', W / 2, y0 + nm.lines.length * (nm.f + 3) + 2, MANROPE(400, 12), RBLUE, 'center');
      },
    },
  };
  NS.LAYOUTS = Object.keys(LAYOUTS);

  NS.renderCover = function (canvas, data, opts = {}) {
    const s = opts.scale || 2, T = NS.THEORIES[data.theory] || NS.THEORIES.teique;
    const L = LAYOUTS[opts.layout] || LAYOUTS.pill;
    canvas.width = Math.round(W * s); canvas.height = Math.round(H * s);
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.save(); ctx.scale(s, s); if (L.under) L.under(ctx, data, T); ctx.restore();
    const art = document.createElement('canvas');
    NS.renderIllustration(art, data, Object.assign({}, opts, L.art, { avoid: L.avoid || [], safe: L.safe, bleedX: true }, { scale: s }));
    ctx.drawImage(art, 0, 0);
    ctx.save(); ctx.scale(s, s); L.draw(ctx, data, T); ctx.restore();
  };
})(typeof window !== 'undefined' ? window : globalThis);
