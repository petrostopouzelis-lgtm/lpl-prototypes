// Lays the report's sections out on fixed A4 pages in the browser.
// Blocks flow down a page; a block that does not fit moves to a new page, and long
// text cards are split paragraph by paragraph. Page numbers and the contents page are
// filled in once every page exists.
(function (root) {
  const T = root.TEIQ, R = (T.report = T.report || {});

  R.paginate = (built, mount) => {
    const { sections, meta } = built, pages = [], warnings = [];
    const d = String(meta.date || '').split('-'), dateText = d.length === 3 ? `${d[2]} / ${d[1]} / ${d[0]}` : meta.date || '';
    const el = (html) => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; };

    function newPage(section, opts = {}) {
      const page = document.createElement('div');
      page.className = 'page' + (opts.cls ? ' ' + opts.cls : '');
      if (section.color) page.style.setProperty('--c', section.color);
      page.dataset.section = section.id;
      if (!opts.bare) {
        const wm = meta.watermark ? `<div class="wm">${`<span>${meta.watermarkText}</span>`.repeat(18)}</div>` : '';
        page.innerHTML = `${wm}<header class="hdr"><div class="prod">${meta.product}</div><img class="logo" src="${meta.logo || 'assets/logo-monogram.png'}" alt="">
          <div class="who"><div>${dateText}</div><div>${T.svg.esc(meta.name)}</div></div></header>
          <div class="body"></div><footer class="ftr"><div class="pg"></div><div class="cr">${T.svg.esc(meta.copyright)}</div></footer>`;
      }
      mount.appendChild(page);
      const rec = { el: page, body: page.querySelector('.body'), section: section.id, numbered: !opts.unnumbered && !opts.bare };
      pages.push(rec);
      return rec;
    }
    const over = p => p.body.scrollHeight > p.body.clientHeight + 1;

    // Place one block; returns the page it ended on.
    function place(page, section, node, splitSel, depth = 0) {
      page.body.appendChild(node);
      if (!over(page)) return page;
      // a page with one large score wheel first tries the smaller wheel before anything moves; a page
      // marked .can-tighten (TEIQue Full Form scale pages) tries its tighter type the same way
      if (!page.el.classList.contains('tight') && page.body.querySelector('.scores.big, .can-tighten')) {
        page.el.classList.add('tight');
        if (!over(page)) return page;
        page.el.classList.remove('tight');
      }
      const inner = splitSel ? node.querySelector(splitSel) : null;
      if (inner && inner.children.length > 1) {
        const rest = [];
        while (over(page) && inner.children.length > 1) rest.unshift(inner.removeChild(inner.lastElementChild));
        // never leave just a marker or a single short line behind: keep at least two pieces together
        if (!over(page) && (inner.children.length >= 2 || rest.length === 0)) {
          // the first part fits here; the rest continues in a fresh card on the next page
          const cont = node.cloneNode(false), shell = inner.cloneNode(false);
          cont.appendChild(shell);
          rest.forEach(k => shell.appendChild(k));
          return place(newPage(section), section, cont, splitSel, depth + 1);
        }
        rest.forEach(k => inner.appendChild(k)); // nothing fits here: put it back and move the whole block
      }
      if (page.body.children.length > 1 && depth < 6) {
        page.body.removeChild(node);
        return place(newPage(section), section, node, splitSel, depth + 1);
      }
      warnings.push(`Block taller than a page in section "${section.id}"`);
      return page;
    }

    let current = null, carry = false;
    sections.forEach(section => {
      if (section.kind === 'cover' || section.kind === 'back') {
        const p = newPage(section, { bare: true, cls: 'full ' + section.kind });
        p.el.innerHTML = section.html;
        section.page = p; carry = false;
        return;
      }
      if (section.kind === 'contents') { section.page = newPage(section, { unnumbered: true }); carry = false; return; }
      // a section marked mergeNext shares its page with the section that follows
      let page = carry && current ? current : newPage(section);
      if (carry && section.color) page.el.style.setProperty('--c', section.color);
      section.page = page;
      section.blocks.forEach(b => {
        const html = typeof b === 'string' ? b : b.html, node = el(html);
        page = place(page, section, node, typeof b === 'string' ? null : b.split);
      });
      current = page; carry = !!section.mergeNext;
    });

    // Spare height is shared out between a page's blocks (up to 22pt more per gap), so a page that
    // is not full reads as evenly spaced instead of top-heavy. What is left stays at the bottom.
    // A lead line stays attached to the title above it.
    const PT = 96 / 72;
    pages.forEach(p => {
      const kids = p.body ? [...p.body.children] : [], open = kids.slice(1).filter(k => !k.matches('p.lead'));
      if (!open.length) return;
      const free = p.body.getBoundingClientRect().bottom - parseFloat(getComputedStyle(p.body).paddingBottom) - kids[kids.length - 1].getBoundingClientRect().bottom;
      const extra = Math.min(22 * PT, Math.floor(free / open.length) - 1);
      if (extra > 1) open.forEach(k => { k.style.marginTop = extra + 'px'; });
    });

    // page numbers: counting starts at the first numbered page, as in the Figma file
    let num = 0;
    pages.forEach(p => { if (p.numbered) { p.num = ++num; p.el.querySelector('.pg').innerHTML = `page <b>${p.num}</b>`; } });

    // contents page: one numbered entry per section, in the section's colour, with the page it starts
    // on. Under a factor: its facets, each with its own page number when it has a page of its own.
    const toc = sections.find(s => s.kind === 'contents');
    if (toc) {
      const esc = T.svg.esc;
      let items = '', i = 0;
      sections.forEach(s => {
        // a section can stay out of the contents (noToc) or appear there under a shorter name (tocTitle)
        if (s.kind !== 'flow' || s.parent || s.noToc) return;
        const subs = (s.tocSubs || []).map(q => ({ title: q.title, num: q.numbered ? s.page.num : '' }))
          .concat(sections.filter(x => x.parent === s.id && !x.noToc).map(x => ({ title: x.tocTitle || x.title, num: x.page.num })))
          .map(q => meta.tocSubNumbers === false ? { title: q.title, num: '' } : q);   // the TEIQue report lists facets without page numbers
        items += `<div class="grp" style="--c:${s.color || T.BLUE}"><div class="it"><span>${++i}. ${esc(s.tocTitle || s.title)}</span><span>${s.page.num || ''}</span></div>` +
          subs.map(q => `<div class="it sub"><span>${esc(q.title)}</span><span>${q.num || ''}</span></div>`).join('') + '</div>';
      });
      toc.page.body.innerHTML = `${toc.headHtml || `<h1 class="title">${esc(toc.title || 'Contents')}</h1>`}<div class="card toc">${items}</div>`;
      if (over(toc.page)) warnings.push('Contents list is taller than its page');
    }
    return { pages: pages.length, numbered: num, warnings };
  };
})(window);
