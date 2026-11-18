/* =====================================================================
   LPL Business Platform — Shared App Shell (app.js)
   Injects the sidebar + top bar, sets active nav, and wires shared UI.
   Each page declares: <body data-page="dashboard" data-title="Dashboard">
   and contains: <main class="app-main">
                   <header class="app-topbar" data-topbar></header>
                   <section class="page-content"> ... </section>
                 </main>
   ===================================================================== */

(function () {
  // ---- Org / user context (demo) ----
  const ORG = { name: 'Acme Talent Group', plan: 'Business plan', initials: 'AT' };
  const USER = { name: 'Maria Chen', initials: 'MC' };

  // ---- Navigation model ----
  const NAV = [
    { id: 'dashboard',  label: 'Dashboard',          href: 'dashboard.html',  icon: 'dashboard' },
    { id: 'assignments',label: 'Assignments',        href: 'assignments.html',icon: 'assignments', badge: '3' },
    { id: 'candidates', label: 'Candidates',         href: 'candidates.html', icon: 'candidates' },
    { id: 'groups',     label: 'Groups',             href: 'groups.html',     icon: 'groups' },
    { id: 'credits',    label: 'Credits',            href: 'credits.html',    icon: 'inventory' },
    { id: 'promotions', label: 'Promotions',         href: 'promotions.html', icon: 'promotions' },
  ];

  // ---- Inline icon set (line style, inherits currentColor) ----
  const ICONS = {
    dashboard: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></svg>',
    assignments: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="3.5" width="14" height="17" rx="2"/><path d="M9 3.5h6v3H9z"/><path d="M8.5 11l1.6 1.6 3-3.2M8.5 16.5h7"/></svg>',
    candidates: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="3.5"/><path d="M5.5 20a6.5 6.5 0 0 1 13 0"/></svg>',
    groups: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8.5" r="3"/><path d="M3.5 19a5.5 5.5 0 0 1 11 0"/><path d="M16 6.2a3 3 0 0 1 0 5.6M17.5 19a5.5 5.5 0 0 0-3-4.9"/></svg>',
    inventory: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 7.5 12 3l8.5 4.5v9L12 21l-8.5-4.5z"/><path d="M3.5 7.5 12 12l8.5-4.5M12 12v9"/></svg>',
    promotions: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><circle cx="7.5" cy="7.5" r="1.5" fill="currentColor" stroke="none"/></svg>',
    store: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 8h14l-1 12H6z"/><path d="M8.5 8a3.5 3.5 0 0 1 7 0"/></svg>',
    billing: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 3.5h14v17l-2.3-1.5-2.3 1.5-2.4-1.5L9.6 20 7.3 18.5 5 20z"/><path d="M8.5 8.5h7M8.5 12.5h7"/></svg>',
    settings: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 12a7.4 7.4 0 0 0-.1-1.2l1.8-1.4-1.8-3.1-2.1.9a7.3 7.3 0 0 0-2.1-1.2L14.5 3h-3.6l-.5 2.4a7.3 7.3 0 0 0-2.1 1.2l-2.1-.9-1.8 3.1 1.8 1.4a7.4 7.4 0 0 0 0 2.4l-1.8 1.4 1.8 3.1 2.1-.9a7.3 7.3 0 0 0 2.1 1.2l.5 2.4h3.6l.5-2.4a7.3 7.3 0 0 0 2.1-1.2l2.1.9 1.8-3.1-1.8-1.4c.07-.4.1-.8.1-1.2z"/></svg>',
    bell: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6.5 9.5a5.5 5.5 0 0 1 11 0c0 4 1.5 5.5 1.5 5.5H5s1.5-1.5 1.5-5.5z"/><path d="M10 18.5a2 2 0 0 0 4 0"/></svg>',
  };

  const ICON_BASE = '../../005_PLATFORM ICONS/';

  // ---- Demo notifications ----
  const NOTIFICATIONS = [
    { icon: 'notification ID=QUA.svg', text: '<b>3 candidates</b> completed the TEIQue Full Form questionnaire.', time: '20 minutes ago' },
    { icon: 'notification ID=REM.svg', text: 'Reminder: <b>Leadership Cohort</b> assignment closes in 2 days.', time: '2 hours ago' },
    { icon: 'notification ID=USR.svg', text: '<b>James Okoro</b> accepted the questionnaire invitation.', time: 'Yesterday' },
    { icon: 'notification ID=BIL.svg', text: 'Invoice <b>#INV-2041</b> is ready to download.', time: '2 days ago' },
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
          '<span class="brand-sub">for Business</span>' +
        '</span>' +
      '</a>' +
      '<nav class="sidebar-nav">' +
        '<span class="sidebar-section-label">Workspace</span>' +
        navHtml +
      '</nav>' +
      '<div class="sidebar-footer">' +
        '<div class="org-avatar">' + ORG.initials + '</div>' +
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
        '<input type="text" placeholder="Search candidates, assignments..." aria-label="Search">' +
      '</div>' +
      '<div class="topbar-actions">' +
        '<div class="profile-wrap">' +
          '<button class="profile-btn" id="profileBtn">' + unreadDot +
            '<span class="avatar">' + USER.initials + '</span>' +
            '<span class="pname">' + USER.name + '</span>' +
            '<img class="caret" src="' + ICON_BASE + 'other icons/dropdown arrow.svg" alt="">' +
          '</button>' +
          '<div class="profile-menu" id="profileMenu">' +
            '<a href="notifications.html">Notifications' + unreadBadge + '</a>' +
            '<a href="settings.html">Account Info</a>' +
            '<a href="billing.html">Billing &amp; Orders</a>' +
            '<a href="settings.html">Settings</a>' +
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

  // ---- Sidebar drawer (mobile) ----
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
      const open = document.getElementById('appSidebar').classList.contains('open');
      open ? closeSidebar() : openSidebar();
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
        closeMenu('profileMenu'); closeSidebar();
        document.querySelectorAll('.modal-overlay.active').forEach(function (m) { m.classList.remove('active'); });
      }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 1225) closeSidebar();
    });
  }

  function closeMenu(id) { const el = document.getElementById(id); if (el) el.classList.remove('active'); }

  // ---- Smooth page-to-page transitions for internal links ----
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
    // Clear the leaving state if the page is restored from bfcache (back/forward)
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
    initSegIndicators();
  });
})();

/* ===================== Segmented controls & list filters ===================== */

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
      requestAnimationFrame(function () {
        requestAnimationFrame(moveIndicator);
      });
    });

    if (typeof ResizeObserver !== 'undefined') {
      new ResizeObserver(moveIndicator).observe(seg);
    }
    window.addEventListener('resize', moveIndicator);
    moveIndicator();
  });
}

/** Animate show/hide when filtering list rows or cards */
var _filterGen = 0;
var _filterItemTimers = typeof WeakMap !== 'undefined' ? new WeakMap() : null;
var _filterEmptyTimer = null;

function _filterIsGridItem(item) {
  return !!(item.closest && item.closest('.inv-grid'));
}

function _filterClearGridStyles(item) {
  item.style.removeProperty('max-height');
  item.style.removeProperty('overflow');
  item.style.removeProperty('margin-top');
  item.style.removeProperty('margin-bottom');
  item.style.removeProperty('padding-top');
  item.style.removeProperty('padding-bottom');
  item.style.removeProperty('opacity');
}

function _filterRevealGridItem(item) {
  var target = item.scrollHeight;
  item.style.overflow = 'hidden';
  item.style.maxHeight = '0';
  item.style.opacity = '0';
  requestAnimationFrame(function () {
    item.style.maxHeight = target + 'px';
    item.style.opacity = '1';
    setTimeout(function () {
      _filterClearGridStyles(item);
    }, 220);
  });
}

function _filterCollapseGridItem(item, duration, gen) {
  _filterClearGridStyles(item);
  item.classList.add('filter-leaving');
  item.style.overflow = 'hidden';
  item.style.maxHeight = item.scrollHeight + 'px';
  requestAnimationFrame(function () {
    item.style.maxHeight = '0';
    item.style.marginTop = '0';
    item.style.marginBottom = '0';
    item.style.paddingTop = '0';
    item.style.paddingBottom = '0';
    item.style.opacity = '0';
  });
  var timer = setTimeout(function () {
    if (gen !== _filterGen) return;
    item.classList.add('filter-hidden');
    item.classList.remove('filter-leaving');
    _filterClearGridStyles(item);
    if (_filterItemTimers) _filterItemTimers.delete(item);
  }, duration);
  if (_filterItemTimers) _filterItemTimers.set(item, timer);
}

function filterAnimate(items, shouldShow, emptyEl, duration) {
  duration = duration || 200;
  var gen = ++_filterGen;

  if (_filterEmptyTimer) {
    clearTimeout(_filterEmptyTimer);
    _filterEmptyTimer = null;
  }

  items.forEach(function (item) {
    item.classList.add('filter-item');
    var show = shouldShow(item);
    var isGrid = _filterIsGridItem(item);

    if (_filterItemTimers) {
      var pending = _filterItemTimers.get(item);
      if (pending) {
        clearTimeout(pending);
        _filterItemTimers.delete(item);
      }
    }

    if (show) {
      item.classList.remove('filter-leaving');
      _filterClearGridStyles(item);
      if (item.classList.contains('filter-hidden')) {
        item.classList.remove('filter-hidden');
        item.style.removeProperty('display');
        if (isGrid) {
          _filterRevealGridItem(item);
        } else {
          item.classList.add('filter-entering');
          requestAnimationFrame(function () {
            requestAnimationFrame(function () { item.classList.remove('filter-entering'); });
          });
        }
      }
    } else if (!item.classList.contains('filter-hidden')) {
      if (isGrid) {
        _filterCollapseGridItem(item, duration, gen);
      } else {
        item.classList.add('filter-leaving');
        var timer = setTimeout(function () {
          if (gen !== _filterGen) return;
          item.classList.add('filter-hidden');
          item.classList.remove('filter-leaving');
          if (_filterItemTimers) _filterItemTimers.delete(item);
        }, duration);
        if (_filterItemTimers) _filterItemTimers.set(item, timer);
      }
    }
  });

  _filterEmptyTimer = setTimeout(function () {
    if (gen !== _filterGen) return;
    if (!emptyEl) return;
    var anyVisible = items.some(function (i) { return shouldShow(i); });
    if (!anyVisible) {
      emptyEl.style.display = '';
      emptyEl.classList.add('filter-entering');
      requestAnimationFrame(function () { emptyEl.classList.remove('filter-entering'); });
    } else {
      emptyEl.style.display = 'none';
      emptyEl.classList.remove('filter-entering');
    }
  }, duration + 16);
}

/* ===================== Shared UI helpers (global) ===================== */

// Select-style dropdowns
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
    // Preserve trailing arrow (::after) — only replace the text node / label span
    const labelSpan = trigger.querySelector('.dropdown-label');
    if (labelSpan) { labelSpan.textContent = label; }
    else { trigger.childNodes[0] ? trigger.childNodes[0].textContent = label : trigger.textContent = label; }
    trigger.classList.remove('active');
  }
  menu.classList.remove('active');
}

// Checkbox / toggle
function toggleCheckbox(el) { el.classList.toggle('checked'); }
function toggleSwitch(el) { el.classList.toggle('off'); }

// Collapsible dropdown card
function toggleDropdownCard(btn) {
  const card = btn.closest('.dropdown-card');
  if (!card) return;
  const content = card.querySelector('.dropdown-card-content');
  const collapsed = card.classList.toggle('collapsed');
  if (!collapsed && content) {
    content.style.maxHeight = content.scrollHeight + 'px';
    setTimeout(function () { content.style.maxHeight = ''; }, 300);
  }
}

// Modals
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
// Close modal when clicking the backdrop
document.addEventListener('click', function (e) {
  if (e.target.classList && e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('active');
    document.body.style.overflow = '';
  }
});
