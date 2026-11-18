/* =====================================================================
   LPL Manager Platform — Shared App Shell (app.js)
   Serves regional distributors and private enterprises.
   ===================================================================== */

/* =====================================================================
   PLStore — shared, persisted demo state (single source of truth)
   ---------------------------------------------------------------------
   All pages read canonical figures (credits, budget, teams, coaches)
   from here so numbers stay consistent and changes persist + sync
   across pages via localStorage.
   ===================================================================== */
var PL_STORE_KEY = 'plMgrStore_v2';

function plDefaultState() {
  var allProducts = ['teique-full', 'teique-short', 'tsique', 'scanin', '3rs', 'cdc', 'disc'];
  return {
    org: { name: 'Northwind Coaching Group', plan: 'Manager 300', initials: 'NC', contactEmail: 'admin@northwind.com', accountType: 'Enterprise', defaultProducts: allProducts.slice(), defaultCanManageCandidates: false },
    user: { name: 'Alex Morgan', initials: 'AM', email: 'alex.morgan@northwind.com' },
    credits: { contract: 300, renews: '14 Aug 2026', unitPrice: 38, vatRate: 0.20, threshold: 0.9 },
    budget: { annual: 50000, spent: 31600, currency: '£', threshold: 0.9 },
    teams: [
      { id: 'leadership', name: 'Leadership Coaches', color: '#7569a1', gradient: 'linear-gradient(180deg,#7569a1 0%,#9e96bd 100%)', lead: 'Elena Rivera', desc: 'Senior leadership and executive coaching cohort.', allocated: 120, inUse: 104, engagement: 92, spend: 13200, created: '15 Feb 2026' },
      { id: 'sales', name: 'Sales Coaches', color: '#f3792a', gradient: 'linear-gradient(180deg,#f3792a 0%,#eba97c 100%)', lead: 'Priya Nair', desc: 'Revenue and sales enablement coaching.', allocated: 85, inUse: 68, engagement: 87, spend: 10300, created: '02 Mar 2026' },
      { id: 'wellbeing', name: 'Wellbeing Network', color: '#3aa756', gradient: 'linear-gradient(180deg,#3aa756 0%,#75c188 100%)', lead: 'Sara Kim', desc: 'Employee wellbeing and resilience support.', allocated: 40, inUse: 33, engagement: 81, spend: 8100, created: '27 May 2026' }
    ],
    coaches: [
      { id: 'elena', name: 'Elena Rivera', email: 'elena.rivera@northwind.com', initials: 'ER', teamId: 'leadership', status: 'active', allocated: 10, inUse: 8, spent: 640, lastActive: 'Today', linkedSince: '12 Jan 2026', allowedProducts: allProducts.slice(), canManageCandidates: false },
      { id: 'amira', name: 'Amira Hassan', email: 'amira.h@northwind.com', initials: 'AH', teamId: 'leadership', status: 'active', allocated: 15, inUse: 14, spent: 1120, lastActive: 'Today', linkedSince: '18 Jan 2026', allowedProducts: ['teique-full', 'teique-short', 'tsique', 'scanin'], canManageCandidates: true },
      { id: 'liam', name: 'Liam Chen', email: 'liam.c@northwind.com', initials: 'LC', teamId: 'leadership', status: 'active', allocated: 12, inUse: 10, spent: 800, lastActive: 'Yesterday', linkedSince: '20 Jan 2026', allowedProducts: ['teique-full', 'teique-short', '3rs'], canManageCandidates: false },
      { id: 'priya', name: 'Priya Nair', email: 'priya.n@northwind.com', initials: 'PN', teamId: 'sales', status: 'active', allocated: 12, inUse: 9, spent: 720, lastActive: 'Yesterday', linkedSince: '22 Jan 2026', allowedProducts: allProducts.slice(), canManageCandidates: true },
      { id: 'joaquin', name: 'Joaquin Souza', email: 'j.souza@northwind.com', initials: 'JS', teamId: 'sales', status: 'invited', allocated: 0, inUse: 0, spent: 0, lastActive: '—', linkedSince: '—', allowedProducts: allProducts.slice(), canManageCandidates: false },
      { id: 'tomas', name: 'Tomás Reyes', email: 't.reyes@northwind.com', initials: 'TR', teamId: null, status: 'invited', allocated: 0, inUse: 0, spent: 0, lastActive: '—', linkedSince: '—', allowedProducts: allProducts.slice(), canManageCandidates: false }
    ],
    candidates: [
      { id: 'james', name: 'James Okoro', email: 'james.okoro@example.com', phone: '+44 7700 900221', company: 'Northwind', role: 'Operations Director', initials: 'JO', coachId: 'elena', status: 'active', added: '08 Jan 2026', products: [{ id: 'teique-full', count: 2, last: '02 Jul 2026' }, { id: 'tsique', count: 1, last: '18 Apr 2026' }] },
      { id: 'anna', name: 'Anna Müller', email: 'anna.muller@example.com', phone: '+49 151 234 8890', company: 'Northwind DACH', role: 'People Partner', initials: 'AM', coachId: 'elena', status: 'active', added: '14 Jan 2026', products: [{ id: 'teique-short', count: 1, last: '25 Jun 2026' }] },
      { id: 'marcus', name: 'Marcus Chen', email: 'marcus.chen@example.com', phone: '+44 7700 900356', company: 'Northwind', role: 'Sales Manager', initials: 'MC', coachId: 'priya', status: 'active', added: '03 Feb 2026', products: [{ id: 'teique-full', count: 1, last: '29 May 2026' }, { id: 'disc', count: 1, last: '29 May 2026' }] },
      { id: 'sofia', name: 'Sofia Rossi', email: 'sofia.rossi@example.com', phone: '+39 333 554 1288', company: 'Northwind Europe', role: 'Regional Lead', initials: 'SR', coachId: 'amira', status: 'active', added: '19 Feb 2026', products: [{ id: 'scanin', count: 2, last: '09 Jul 2026' }] },
      { id: 'david', name: 'David Williams', email: 'david.williams@example.com', phone: '+44 7700 900408', company: 'Northwind', role: 'Finance Manager', initials: 'DW', coachId: 'liam', status: 'inactive', added: '07 Mar 2026', products: [{ id: '3rs', count: 1, last: '17 Mar 2026' }] },
      { id: 'maya', name: 'Maya Patel', email: 'maya.patel@example.com', phone: '+44 7700 900512', company: 'Northwind', role: 'Programme Manager', initials: 'MP', coachId: 'priya', status: 'active', added: '22 Mar 2026', products: [] }
    ],
    invoices: [
      { date: '01 May 2026', desc: 'Manager plan', credits: 300, total: 11400 },
      { date: '01 Apr 2026', desc: 'Manager plan', credits: 300, total: 11400 },
      { date: '15 Mar 2026', desc: 'Credit add-on', credits: 50, total: 1900 }
    ]
  };
}

var PLStore = {
  data: null,
  load: function () {
    try { this.data = JSON.parse(localStorage.getItem(PL_STORE_KEY)); } catch (e) { this.data = null; }
    if (!this.data || !this.data.credits || !this.data.teams) this.data = plDefaultState();
    var defaults = plDefaultState();
    if (!Array.isArray(this.data.candidates)) this.data.candidates = defaults.candidates;
    if (!Array.isArray(this.data.org.defaultProducts)) this.data.org.defaultProducts = defaults.org.defaultProducts;
    if (typeof this.data.org.defaultCanManageCandidates !== 'boolean') this.data.org.defaultCanManageCandidates = false;
    this.data.coaches.forEach(function (coach) {
      var seed = defaults.coaches.find(function (c) { return c.id === coach.id; });
      if (!Array.isArray(coach.allowedProducts)) coach.allowedProducts = seed ? seed.allowedProducts : defaults.org.defaultProducts.slice();
      if (typeof coach.canManageCandidates !== 'boolean') coach.canManageCandidates = false;
    });
    this.save();
    return this.data;
  },
  save: function () { try { localStorage.setItem(PL_STORE_KEY, JSON.stringify(this.data)); } catch (e) {} },
  reset: function () { this.data = plDefaultState(); this.save(); return this.data; },
  get: function () { return this.data || this.load(); },
  update: function (fn) { fn(this.get()); this.save(); return this.data; }
};
PLStore.load();

/* ---- Derived getters ---- */
function plTeamsAllocated() { return PLStore.get().teams.reduce(function (s, t) { return s + (t.allocated || 0); }, 0); }
function plUnallocated() { return Math.max(0, PLStore.get().credits.contract - plTeamsAllocated()); }
function plCreditsUsedPct() { var c = PLStore.get().credits.contract; return c ? Math.round((plTeamsAllocated() / c) * 100) : 0; }
function plBudgetRemaining() { var b = PLStore.get().budget; return Math.max(0, b.annual - b.spent); }
function plBudgetSpentPct() { var b = PLStore.get().budget; return b.annual ? Math.round((b.spent / b.annual) * 100) : 0; }
function plTeamById(id) { return PLStore.get().teams.find(function (t) { return t.id === id; }) || null; }
function plCoachById(id) { return PLStore.get().coaches.find(function (c) { return c.id === id; }) || null; }
function plActiveCoaches() { return PLStore.get().coaches.filter(function (c) { return c.status === 'active'; }); }
function plPendingCoaches() { return PLStore.get().coaches.filter(function (c) { return c.status === 'invited'; }); }
function plTeamCoaches(teamId) { return PLStore.get().coaches.filter(function (c) { return c.teamId === teamId; }); }
var PL_PRODUCTS = [
  { id: 'teique-full', label: 'TEIQue Full Form', family: 'TEIQue', description: 'Full trait emotional intelligence assessment' },
  { id: 'teique-short', label: 'TEIQue Short Form', family: 'TEIQue', description: 'Short-form emotional intelligence assessment' },
  { id: 'tsique', label: 'TSIQue', family: 'Assessment', description: 'Trait social intelligence questionnaire' },
  { id: 'scanin', label: 'Scan-In', family: 'Assessment', description: 'Workplace capability scan' },
  { id: '3rs', label: '3Rs', family: 'Assessment', description: 'Resilience, regulation and recovery' },
  { id: 'cdc', label: 'CDC Report', family: 'Add-on', description: 'Career development competency add-on' },
  { id: 'disc', label: 'DISC Report', family: 'Add-on', description: 'DISC behavioural profile add-on' }
];
function plCandidateById(id) { return PLStore.get().candidates.find(function (c) { return c.id === id; }) || null; }
function plCoachCandidates(coachId) { return PLStore.get().candidates.filter(function (c) { return c.coachId === coachId; }); }
function plProductById(id) { return PL_PRODUCTS.find(function (p) { return p.id === id; }) || { id: id, label: id, family: 'Product', description: '' }; }
function plCoachAllowsProduct(coachId, productId) { var c = plCoachById(coachId); return !!(c && c.allowedProducts.indexOf(productId) > -1); }
function plReassignCandidate(candidateId, coachId) {
  var candidate = plCandidateById(candidateId);
  var coach = plCoachById(coachId);
  if (!candidate || !coach) return false;
  candidate.coachId = coachId;
  PLStore.save();
  return true;
}

/* ---- Money formatting ---- */
function plMoney(n) {
  var cur = PLStore.get().budget.currency || '£';
  return cur + Number(n || 0).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function plMoney0(n) {
  var cur = PLStore.get().budget.currency || '£';
  return cur + Number(n || 0).toLocaleString('en-GB', { maximumFractionDigits: 0 });
}
function plMoneyShort(n) {
  var cur = PLStore.get().budget.currency || '£';
  n = Number(n || 0);
  if (Math.abs(n) >= 1000) {
    var k = n / 1000;
    return cur + (k % 1 === 0 ? k.toFixed(0) : k.toFixed(1)) + 'k';
  }
  return cur + n.toLocaleString('en-GB', { maximumFractionDigits: 0 });
}

(function () {
  const ORG = PLStore.get().org;
  const USER = PLStore.get().user;

  const NAV = [
    { id: 'dashboard', label: 'Dashboard', href: 'dashboard.html', icon: 'dashboard' },
    { id: 'coaches', label: 'Coaches', href: 'coaches.html', icon: 'coaches' },
    { id: 'candidates', label: 'Candidates', href: 'candidates.html', icon: 'candidates' },
    { id: 'teams', label: 'Teams', href: 'teams.html', icon: 'teams' },
    { id: 'analytics', label: 'Analytics', href: 'analytics.html', icon: 'analytics' },
    { id: 'billing', label: 'Billing & Credits', href: 'billing.html', icon: 'billing' },
  ];

  const ICONS = {
    dashboard: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></svg>',
    coaches: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8.5" r="3"/><path d="M5.5 19a6.5 6.5 0 0 1 13 0"/></svg>',
    candidates: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="3.5"/><path d="M5.5 20a6.5 6.5 0 0 1 13 0"/></svg>',
    teams: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8.5" r="3"/><path d="M3.5 19a5.5 5.5 0 0 1 11 0"/><path d="M16 6.2a3 3 0 0 1 0 5.6M17.5 19a5.5 5.5 0 0 0-3-4.9"/></svg>',
    analytics: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19V5"/><path d="M4 19h16"/><path d="M8 17V11"/><path d="M12 17V7"/><path d="M16 17v-4"/></svg>',
    billing: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 3.5h14v17l-2.3-1.5-2.3 1.5-2.4-1.5L9.6 20 7.3 18.5 5 20z"/><path d="M8.5 8.5h7M8.5 12.5h7"/></svg>',
    settings: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 12a7.4 7.4 0 0 0-.1-1.2l1.8-1.4-1.8-3.1-2.1.9a7.3 7.3 0 0 0-2.1-1.2L14.5 3h-3.6l-.5 2.4a7.3 7.3 0 0 0-2.1 1.2l-2.1-.9-1.8 3.1 1.8 1.4a7.4 7.4 0 0 0 0 2.4l-1.8 1.4 1.8 3.1 2.1-.9a7.3 7.3 0 0 0 2.1 1.2l.5 2.4h3.6l.5-2.4a7.3 7.3 0 0 0 2.1-1.2l2.1.9 1.8-3.1-1.8-1.4c.07-.4.1-.8.1-1.2z"/></svg>',
    bell: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6.5 9.5a5.5 5.5 0 0 1 11 0c0 4 1.5 5.5 1.5 5.5H5s1.5-1.5 1.5-5.5z"/><path d="M10 18.5a2 2 0 0 0 4 0"/></svg>',
  };

  const ICON_BASE = '../../005_PLATFORM ICONS/';
  const NOTIFICATIONS = [
    { icon: 'notification ID=USR.svg', text: '<b>Elena Rivera</b> accepted her coach invitation.', time: '20 minutes ago' },
    { icon: 'notification ID=BIL.svg', text: 'Credit usage reached <b>82%</b> of your contract.', time: '2 hours ago' },
    { icon: 'notification ID=REM.svg', text: '<b>James Okoro</b> was assigned to Elena Rivera.', time: 'Yesterday' },
  ];

  function buildSidebar() {
    const navHtml = NAV.map(function (n) {
      const badge = n.badge ? '<span class="nav-badge">' + n.badge + '</span>' : '';
      return '<a class="nav-link" data-nav="' + n.id + '" href="' + n.href + '">' +
        ICONS[n.icon] + '<span>' + n.label + '</span>' + badge + '</a>';
    }).join('');

    const sidebar = document.createElement('aside');
    sidebar.className = 'app-sidebar';
    sidebar.id = 'appSidebar';
    sidebar.innerHTML =
      '<a class="sidebar-brand" href="dashboard.html">' +
        '<img src="../../006_RASTER/logos webp/psychometric laboratory logo_blue monogram.webp" alt="LPL">' +
        '<span class="brand-text">' +
          '<span class="brand-name">Psychometric Laboratory</span>' +
          '<span class="brand-sub">for Managers</span>' +
        '</span>' +
      '</a>' +
      '<nav class="sidebar-nav">' +
        '<span class="sidebar-section-label">Workspace</span>' +
        navHtml +
      '</nav>' +
      '<div class="sidebar-footer">' +
        '<div class="org-avatar ent-avatar">' + ORG.initials + '</div>' +
        '<div class="org-info">' +
          '<span class="org-name">' + ORG.name + '</span>' +
          '<span class="org-plan">' + ORG.plan + '</span>' +
        '</div>' +
      '</div>';
    document.body.insertBefore(sidebar, document.body.firstChild);

    const overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    overlay.id = 'sidebarOverlay';
    overlay.addEventListener('click', closeSidebar);
    document.body.appendChild(overlay);
  }

  function buildTopbar() {
    const host = document.querySelector('[data-topbar]');
    if (!host) return;
    const title = document.body.getAttribute('data-title') || '';
    const subtitle = document.body.getAttribute('data-subtitle') || '';
    const unread = NOTIFICATIONS.length;
    const subHtml = subtitle ? '<p class="topbar-subtitle">' + subtitle + '</p>' : '';
    const unreadBadge = unread ? '<span class="menu-badge">' + unread + '</span>' : '';
    const unreadDot = unread ? '<span class="profile-unread"></span>' : '';

    host.innerHTML =
      '<button class="topbar-burger" id="topbarBurger" aria-label="Menu"><span></span><span></span><span></span></button>' +
      '<div class="topbar-heading">' +
        '<h1 class="topbar-title">' + title + '</h1>' + subHtml +
      '</div>' +
      '<div class="topbar-spacer"></div>' +
      '<div class="topbar-search">' +
        '<img class="search-icon" src="' + ICON_BASE + 'other icons/search icon.svg" alt="">' +
        '<input type="text" placeholder="Search coaches, candidates, teams…" aria-label="Search">' +
      '</div>' +
      '<div class="topbar-actions">' +
        '<div class="profile-wrap">' +
          '<button class="profile-btn" id="profileBtn">' + unreadDot +
            '<span class="avatar">' + USER.initials + '</span>' +
            '<span class="pname">' + USER.name + '</span>' +
            '<img class="caret" src="' + ICON_BASE + 'other icons/dropdown arrow.svg" alt="">' +
          '</button>' +
          '<div class="profile-menu" id="profileMenu">' +
            '<a href="notifications.html">Notifications &amp; Audit Log' + unreadBadge + '</a>' +
            '<a href="settings.html">Settings</a>' +
            '<a href="roadmap.html">Feature Roadmap</a>' +
            '<div class="menu-divider"></div>' +
            '<button class="logout" onclick="window.location.href=\'../../008_STYLES/restyling-guide/design-system-showcase.html\'">Log out</button>' +
          '</div>' +
        '</div>' +
      '</div>';
  }

  function setActiveNav() {
    const page = document.body.getAttribute('data-page');
    document.querySelectorAll('.nav-link').forEach(function (el) {
      el.classList.toggle('active', el.getAttribute('data-nav') === page);
    });
  }

  function openSidebar() {
    document.getElementById('appSidebar').classList.add('open');
    document.getElementById('sidebarOverlay').classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function closeSidebar() {
    document.getElementById('appSidebar').classList.remove('open');
    document.getElementById('sidebarOverlay').classList.remove('active');
    document.body.style.overflow = '';
  }

  function wireShell() {
    const burger = document.getElementById('topbarBurger');
    if (burger) burger.addEventListener('click', function () {
      document.getElementById('appSidebar').classList.contains('open') ? closeSidebar() : openSidebar();
    });

    const profileBtn = document.getElementById('profileBtn');
    const profileMenu = document.getElementById('profileMenu');
    if (profileBtn) profileBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      profileMenu.classList.toggle('active');
    });

    document.addEventListener('click', function (e) {
      if (!e.target.closest('.profile-wrap')) closeMenu('profileMenu');
      if (!e.target.closest('.dropdown')) {
        document.querySelectorAll('.dropdown-menu.active').forEach(function (m) {
          m.classList.remove('active');
          const t = m.previousElementSibling;
          if (t) t.classList.remove('active');
        });
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        closeMenu('profileMenu');
        closeSidebar();
        document.querySelectorAll('.modal-overlay.active').forEach(function (m) { m.classList.remove('active'); });
      }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 1225) closeSidebar();
    });
  }

  function closeMenu(id) { const el = document.getElementById(id); if (el) el.classList.remove('active'); }

  function wirePageTransitions() {
    document.addEventListener('click', function (e) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target.closest('a');
      if (!a || a.target === '_blank') return;
      const href = a.getAttribute('href');
      if (!href || href.charAt(0) === '#' || /^(https?:|mailto:|tel:)/.test(href)) return;
      if (href.indexOf('.html') === -1) return;
      e.preventDefault();
      document.body.classList.add('is-leaving');
      setTimeout(function () { window.location.href = href; }, 170);
    });
    window.addEventListener('pageshow', function (e) {
      if (e.persisted) document.body.classList.remove('is-leaving');
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    buildSidebar();
    buildTopbar();
    setActiveNav();
    wireShell();
    wirePageTransitions();
    wireRowActions();
    initSegIndicators();
  });
})();

function wireRowActions() {
  document.querySelectorAll('.row-actions-btn').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var ra = btn.closest('.row-actions');
      document.querySelectorAll('.row-actions.open').forEach(function (o) {
        if (o !== ra) o.classList.remove('open');
      });
      if (ra) ra.classList.toggle('open');
    });
  });
  document.addEventListener('click', function () {
    document.querySelectorAll('.row-actions.open').forEach(function (o) { o.classList.remove('open'); });
  });
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.export-menu')) {
      document.querySelectorAll('.export-menu.open').forEach(function (m) { m.classList.remove('open'); });
    }
  });
}

function initSegIndicators() {
  document.querySelectorAll('.seg').forEach(function (seg) {
    if (seg.dataset.segReady) return;
    seg.dataset.segReady = '1';
    var indicator = document.createElement('span');
    indicator.className = 'seg-indicator';
    indicator.setAttribute('aria-hidden', 'true');
    seg.insertBefore(indicator, seg.firstChild);
    function moveIndicator() {
      var active = seg.querySelector('button.active');
      if (!active) return;
      var segRect = seg.getBoundingClientRect();
      var btnRect = active.getBoundingClientRect();
      indicator.style.left = (btnRect.left - segRect.left) + 'px';
      indicator.style.top = (btnRect.top - segRect.top) + 'px';
      indicator.style.width = btnRect.width + 'px';
      indicator.style.height = btnRect.height + 'px';
    }
    seg.addEventListener('click', function (e) {
      if (!e.target.closest('button')) return;
      requestAnimationFrame(function () { requestAnimationFrame(moveIndicator); });
    });
    if (typeof ResizeObserver !== 'undefined') new ResizeObserver(moveIndicator).observe(seg);
    window.addEventListener('resize', moveIndicator);
    moveIndicator();
  });
}

var _filterGen = 0;
var _filterItemTimers = typeof WeakMap !== 'undefined' ? new WeakMap() : null;
var _filterEmptyTimer = null;

function filterAnimate(items, shouldShow, emptyEl, duration) {
  duration = duration || 200;
  var gen = ++_filterGen;
  if (_filterEmptyTimer) { clearTimeout(_filterEmptyTimer); _filterEmptyTimer = null; }
  items.forEach(function (item) {
    item.classList.add('filter-item');
    var show = shouldShow(item);
    if (show) {
      item.classList.remove('filter-leaving', 'filter-hidden');
      item.style.removeProperty('display');
    } else if (!item.classList.contains('filter-hidden')) {
      item.classList.add('filter-leaving');
      setTimeout(function () {
        if (gen !== _filterGen) return;
        item.classList.add('filter-hidden');
        item.classList.remove('filter-leaving');
      }, duration);
    }
  });
  _filterEmptyTimer = setTimeout(function () {
    if (gen !== _filterGen || !emptyEl) return;
    var anyVisible = items.some(function (i) { return shouldShow(i); });
    emptyEl.style.display = anyVisible ? 'none' : '';
  }, duration + 16);
}

function toggleDropdown(id) {
  const menu = document.getElementById(id);
  if (!menu) return;
  const trigger = menu.previousElementSibling;
  document.querySelectorAll('.dropdown-menu').forEach(function (m) {
    if (m.id !== id) { m.classList.remove('active'); const t = m.previousElementSibling; if (t) t.classList.remove('active'); }
  });
  menu.classList.toggle('active');
  if (trigger) trigger.classList.toggle('active');
}
function selectOption(id, label) {
  const menu = document.getElementById(id);
  if (!menu) return;
  const trigger = menu.previousElementSibling;
  if (trigger) {
    const labelSpan = trigger.querySelector('.dropdown-label');
    if (labelSpan) labelSpan.textContent = label;
    else if (trigger.childNodes[0]) trigger.childNodes[0].textContent = label;
    trigger.classList.remove('active');
  }
  menu.classList.remove('active');
}

function toggleCheckbox(el) { el.classList.toggle('checked'); }
function toggleSwitch(el) { el.classList.toggle('off'); }

function openModal(id) {
  const m = document.getElementById(id);
  if (!m) return;
  m.classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeModal(id) {
  const m = document.getElementById(id);
  if (!m) return;
  m.classList.remove('active');
  document.body.style.overflow = '';
}
document.addEventListener('click', function (e) {
  if (e.target.classList && e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('active');
    document.body.style.overflow = '';
  }
});

function showToast(msg) {
  var t = document.getElementById('appToast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'appToast';
    t.className = 'app-toast';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(function () { t.classList.remove('show'); }, 2800);
}

function toggleExportMenu(btn) {
  var menu = btn.closest('.export-menu');
  if (!menu) return;
  var willOpen = !menu.classList.contains('open');
  document.querySelectorAll('.export-menu.open').forEach(function (m) { m.classList.remove('open'); });
  menu.classList.toggle('open', willOpen);
}
function exportData(name, fmt) {
  showToast('Exporting ' + name + ' as ' + fmt + '…');
  document.querySelectorAll('.export-menu.open').forEach(function (m) { m.classList.remove('open'); });
}
document.addEventListener('click', function (e) {
  if (!e.target.closest('.export-menu')) {
    document.querySelectorAll('.export-menu.open').forEach(function (m) { m.classList.remove('open'); });
  }
});

function voteFeature(btn) {
  var card = btn.closest('.roadmap-card');
  if (!card || card.classList.contains('voted')) return;
  card.classList.add('voted');
  var count = card.querySelector('.vote-count');
  if (count) count.textContent = String(parseInt(count.textContent, 10) + 1);
  btn.textContent = 'Voted';
  btn.disabled = true;
  showToast('Thanks — your vote was recorded.');
}

function plResetDemo() {
  PLStore.reset();
  showToast('Demo data reset.');
  setTimeout(function () { window.location.reload(); }, 500);
}
