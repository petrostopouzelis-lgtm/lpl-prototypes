// Cover layouts: the illustration plus the cover typography.
//
//   await LPLCovers.ready()                         fonts and logo loaded
//   LPLCovers.renderCover(canvas, data, opts)       whole A4 cover
//     opts.layout  'plate' | 'axis' | 'grid'
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

  // Each layout: where the illustration sits (centreY, fit) and the type around it.
  const LAYOUTS = {
    // A specimen plate: hairline frame, header across the top, caption row at the foot.
    plate: {
      art: { centreY: 0.47, fit: 0.6 },
      draw(ctx, d, T) {
        const m = 30;
        ctx.strokeStyle = RULE; ctx.lineWidth = 0.5; ctx.strokeRect(m, m, W - 2 * m, H - 2 * m);
        // corner ticks in brand blue
        ctx.strokeStyle = BLUE; ctx.lineWidth = 0.8;
        [[m, m, 1, 1], [W - m, m, -1, 1], [m, H - m, 1, -1], [W - m, H - m, -1, -1]].forEach(([x, y, a, b]) => { ctx.beginPath(); ctx.moveTo(x + a * 10, y); ctx.lineTo(x, y); ctx.lineTo(x, y + b * 10); ctx.stroke(); });
        drawLogo(ctx, m + 18, m + 20, 130);
        wordmark(ctx, T, W - m - 18, m + 40, 24, 'right');
        text(ctx, titleOf(d), W - m - 18, m + 60, MANROPE(600, 13), INK, 'right');
        if (d.subtitle) text(ctx, d.subtitle, W - m - 18, m + 76, INTER(300, 10.5), MUTED, 'right');
        hline(ctx, m + 18, W - m - 18, H - m - 74);
        const nm = wrap2(ctx, d.name || '', f => MANROPE(600, f), 18, 290, 11);
        nm.lines.forEach((l, i) => text(ctx, l, m + 18, H - m - 46 - (nm.lines.length - 1 - i) * (nm.f + 3), MANROPE(600, nm.f), INK));
        text(ctx, d.date || '', m + 18, H - m - 28, INTER(400, 10), MUTED);
        text(ctx, COPYRIGHT(yearOf(d)), W - m - 18, H - m - 40, INTER(300, 7), MUTED, 'right');
        text(ctx, PRODUCT, W - m - 18, H - m - 29, INTER(300, 7), MUTED, 'right');
      },
    },
    // A centred, symmetrical composition on the blob's axis; the name sits in the design
    // system's blue pill under the diagram.
    axis: {
      art: { centreY: 0.5, fit: 0.54 },
      draw(ctx, d, T) {
        text(ctx, COPYRIGHT(yearOf(d)), W / 2, 22, INTER(300, 7), MUTED, 'center');
        drawLogo(ctx, W / 2, 44, 120, 'center');
        wordmark(ctx, T, W / 2, 140, 22, 'center');
        text(ctx, titleOf(d) + (d.subtitle ? '  ·  ' + d.subtitle : ''), W / 2, 160, MANROPE(600, 11.5), INK, 'center');
        // name pill
        const label = `${d.name || ''}`, date = d.date || '';
        const nf = fit(ctx, label, f => MANROPE(500, f), 14, 300);
        ctx.font = MANROPE(500, nf); const nw = ctx.measureText(label).width;
        ctx.font = INTER(400, 11); const dw = ctx.measureText(date).width;
        const pw = nw + dw + 64, ph = 34, px = W / 2 - pw / 2, py = 720;
        const g = ctx.createLinearGradient(px, 0, px + pw, 0); g.addColorStop(0, BLUE); g.addColorStop(1, '#66BAE2');
        ctx.save(); ctx.shadowColor = 'rgba(0,0,0,0.12)'; ctx.shadowBlur = 8; ctx.shadowOffsetY = 2;
        ctx.fillStyle = g; ctx.beginPath(); ctx.roundRect(px, py, pw, ph, ph / 2); ctx.fill(); ctx.restore();
        text(ctx, label, px + 24, py + ph / 2 + 0.5, MANROPE(500, nf), '#fff', 'left', 'middle');
        ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(px + 24 + nw + 8, py + ph / 2, 2.5, 0, Math.PI * 2); ctx.fill();
        text(ctx, date, px + 24 + nw + 16, py + ph / 2 + 0.5, INTER(400, 11), '#fff', 'left', 'middle');
        text(ctx, PRODUCT, W / 2, 826, INTER(300, 7), MUTED, 'center');
      },
    },
    // A spec sheet: ruled header and footer cells, the diagram in the open field between.
    grid: {
      art: { centreY: 0.5, fit: 0.62 },
      draw(ctx, d, T) {
        const m = 28, top = 34, hh = 74, bot = H - 34, fh = 54, c1 = m + 170, c2 = W - m - 150;
        [top, top + hh, bot - fh, bot].forEach(y => hline(ctx, m, W - m, y));
        vline(ctx, c1, top, top + hh); vline(ctx, c2, top, top + hh);
        vline(ctx, c1, bot - fh, bot); vline(ctx, c2, bot - fh, bot);
        hline(ctx, m, m + 40, top, BLUE, 1.2); // brand accent on the top rule
        drawLogo(ctx, m + 4, top + 22, 140);
        wordmark(ctx, T, c1 + 14, top + 34, 22);
        text(ctx, titleOf(d), c1 + 14, top + 52, MANROPE(600, 11.5), INK);
        if (d.subtitle) text(ctx, d.subtitle, c1 + 14, top + 65, INTER(300, 9.5), MUTED);
        const nm = wrap2(ctx, d.name || '', f => MANROPE(600, f), 12, W - m - c2 - 18);
        nm.lines.forEach((l, i) => text(ctx, l, c2 + 12, top + 30 + i * (nm.f + 2), MANROPE(600, nm.f), INK));
        text(ctx, d.date || '', c2 + 12, top + 34 + nm.lines.length * (nm.f + 2) + 4, INTER(400, 9.5), MUTED);
        text(ctx, COPYRIGHT(yearOf(d)), m + 4, bot - fh / 2 + 3, INTER(300, 7), MUTED);
        text(ctx, T.label + '  ·  ' + titleOf(d), c1 + 14, bot - fh / 2 + 3, INTER(400, 7.5), MUTED);
        text(ctx, PRODUCT, W - m - 4, bot - fh / 2 + 3, INTER(300, 7), MUTED, 'right');
      },
    },
  };
  NS.LAYOUTS = Object.keys(LAYOUTS);

  NS.renderCover = function (canvas, data, opts = {}) {
    const s = opts.scale || 2, T = NS.THEORIES[data.theory] || NS.THEORIES.teique;
    const L = LAYOUTS[opts.layout] || LAYOUTS.plate;
    canvas.width = Math.round(W * s); canvas.height = Math.round(H * s);
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    const art = document.createElement('canvas');
    NS.renderIllustration(art, data, Object.assign({}, opts, L.art, opts.fit != null && opts.keepFit ? { fit: opts.fit } : {}, { scale: s }));
    ctx.drawImage(art, 0, 0);
    ctx.save(); ctx.scale(s, s); L.draw(ctx, data, T); ctx.restore();
  };
})(typeof window !== 'undefined' ? window : globalThis);
