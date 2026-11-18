/* Assignment creation wizard — slide stack navigation
   Coach account: an assignment issues a QUESTIONNAIRE (instrument + form) to a
   target. The report step selects an OPTIONAL report to auto-generate on
   completion; further reports are generated later from the completed
   questionnaire (assignment detail / candidate page). Full wizard expansion
   is a later phase. */
(function () {
    const REPORTS = {
        individual: [
            { name: 'Personal' },
            { name: 'Corporate' },
            { name: 'Leadership' },
            { name: 'Developmental' },
            { name: 'Recruitment' }
        ],
        group: [
            { name: 'Team Report' },
            { name: 'Compatibility' },
            { name: 'Group-Sort' },
            { name: 'RoleSync' }
        ],
        /* TEIQue 360°: one report, for one candidate rated by themself and their raters */
        '360': [
            { name: 'TEIQue 360°' }
        ]
    };
    const REPORT_360 = 'TEIQue 360°';
    /* rater groups a 360° starts with (the groups of the 2010 TEIQue 360° report) */
    const RATER_GROUPS = ['Boss', 'Other superiors', 'Direct reports', 'Peers'];

    function reportCoverSrc(name) {
        if (typeof coverForReport === 'function') {
            return coverForReport(name);
        }
        return '';
    }

    function reportCoverImg(name) {
        var src = reportCoverSrc(name);
        if (src) {
            return '<img class="report-thumb" src="' + src + '" alt="' + name + ' report cover">';
        }
        return '<span class="report-thumb report-thumb-placeholder" aria-hidden="true">' + name.charAt(0) + '</span>';
    }

    const STAGE_MAP = {
        target: 1,
        'assessment-mode': 2,
        'teique-report': 2,
        raters: 2,
        'rolesync-preset': 2,
        compatibility: 2,
        settings: 3,
        review: 4
    };

    const INSTRUMENT_LABELS = {
        teique: 'TEIQue',
        tsique: 'TSIQue',
        scanin: 'Scan-In',
        '3rs': '3Rs'
    };
    const TOOLKIT_LABELS = {
        personality: 'TEIQue Personality Toolkit',
        lecture: 'TEIQue Lecture Series',
        compatibility: 'TEIQue Compatibility Bundle'
    };

    /* Administration credit rates — see ../shared/admin-credits.js */
    const AC = typeof AdminCredits !== 'undefined' ? AdminCredits : null;
    const PROMO = typeof Promotions !== 'undefined' ? Promotions : null;
    const PROMO_CONTEXT = { accountType: 'coach', isPremium: false };
    const DEMO_BALANCE = AC ? AC.DEMO_BALANCE : 124.7;

    const FORM_LABELS = { full: 'Full Form', short: 'Short Form' };
    const ADDON_LABELS = { CDC: 'CDC Report', DISC: 'DISC Report' };
    const FORM_HINTS = {
        full: 'Comprehensive 153-item questionnaire with full facet breakdown.',
        short: 'Streamlined 30-item questionnaire covering the four broad factors.'
    };

    const DELIVERY_LABELS = { coach: 'Coach only', both: 'Coach & candidate' };
    const DELIVERY_HINTS = {
        coach: 'Only you receive the generated reports — candidates will not see their results.',
        both: 'Both you and each candidate receive their own report once it is generated.'
    };

    let slideStack = ['target'];
    let prefillInstrument = null;
    let prefillMode = null;
    let awDirection = 'forward';

    const state = {
        targetMode: 'individuals',
        individuals: [],
        groups: [],
        assessmentMode: 'report',
        instrument: null,
        toolkit: null,
        teiqueReportScope: 'individual',
        report: null,
        teiqueForm: 'full',
        addOns: [],
        rolesyncPreset: null,
        compatibilityCandidate: null,
        reminders: true,
        reportDelivery: 'coach',
        deadline: 'none',
        selectedPromo: null,
        /* 360°: rater groups, each with its raters ({ name, email }) */
        raterGroups: [],
        minGroupSize: 1
    };

    const is360 = function () { return state.instrument === 'teique' && state.teiqueReportScope === '360'; };
    function freshRaterGroups() {
        return RATER_GROUPS.map(function (g) { return { label: g, raters: [{ name: '', email: '' }] }; });
    }
    /* raters with something typed in; empty rows are ignored */
    function filledRaters() {
        const out = [];
        state.raterGroups.forEach(function (g) {
            g.raters.forEach(function (r) {
                if ((r.name || '').trim() || (r.email || '').trim()) out.push({ group: g.label, name: r.name.trim(), email: r.email.trim() });
            });
        });
        return out;
    }

    /* Tell the coach why Next did not move on. The app's toast (showToast in app.js), as the Generate
       report dialog does; alert() is blocked in some views (claude.ai), where Next then seemed to do nothing. */
    function awWarn(msg) {
        if (typeof showToast === 'function') showToast(msg);
        else window.alert(msg);
    }

    function formatAC(n) {
        return AC ? AC.formatAC(n) : (Number(n).toFixed(1) + ' AC');
    }

    function respondentCount() {
        return AC ? AC.respondentCount(state) : state.individuals.length;
    }

    function baseCostResult() {
        if (!AC) return { items: [], total: 0, qty: 0 };
        return AC.calcAssignmentCost(state);
    }

    function getAvailablePromos() {
        if (!PROMO) return [];
        return PROMO.filterPromosForAssignment(PROMO.getPromosForUser(PROMO_CONTEXT), state);
    }

    function syncSelectedPromo() {
        if (!state.selectedPromo || !PROMO) return;
        const valid = getAvailablePromos().some(function (p) { return p.id === state.selectedPromo; });
        if (!valid) state.selectedPromo = null;
    }

    function getAppliedCost() {
        const base = baseCostResult();
        if (!PROMO || !state.selectedPromo) {
            return Object.assign({}, base, { savingsAC: 0, promoLine: null });
        }
        const promo = PROMO.getPromoById(state.selectedPromo);
        if (!promo) {
            state.selectedPromo = null;
            return Object.assign({}, base, { savingsAC: 0, promoLine: null });
        }
        return PROMO.applyPromoDiscount(promo, base, state);
    }

    function cartLineItems() {
        return getAppliedCost().items;
    }

    function cartTotal() {
        return getAppliedCost().total;
    }

    function currentSlide() {
        return slideStack[slideStack.length - 1];
    }

    function getNextSlide(from) {
        switch (from) {
            case 'target':
                return 'assessment-mode';
            case 'assessment-mode':
                if (state.assessmentMode === 'toolkit') return 'settings';
                return state.instrument === 'teique' ? 'teique-report' : 'settings';
            case 'teique-report':
                if (is360()) return 'raters';
                if (state.report === 'RoleSync') return 'rolesync-preset';
                if (state.report === 'Compatibility') return 'compatibility';
                return 'settings';
            case 'rolesync-preset':
            case 'compatibility':
            case 'raters':
                return 'settings';
            case 'settings':
                return 'review';
            default:
                return 'review';
        }
    }

    function validateSlide(slide) {
        switch (slide) {
            case 'target':
                if (state.targetMode === 'individuals') {
                    syncIndividuals();
                    if (!state.individuals.length) {
                        awWarn('Select at least one candidate.');
                        return false;
                    }
                } else if (!state.groups.length) {
                    awWarn('Select at least one group.');
                    return false;
                }
                return true;
            case 'assessment-mode':
                if (state.assessmentMode === 'toolkit') {
                    if (!state.toolkit) {
                        awWarn('Select a toolkit.');
                        return false;
                    }
                    return true;
                }
                if (!state.instrument) {
                    awWarn('Select a questionnaire.');
                    return false;
                }
                return true;
            case 'teique-report':
                if (is360()) {
                    syncIndividuals();
                    if (state.targetMode !== 'individuals' || state.individuals.length !== 1) {
                        awWarn('A 360° is for one candidate at a time. Go back to Target and select one candidate.');
                        return false;
                    }
                    state.report = REPORT_360;
                    return true;
                }
                if (!state.report) {
                    awWarn('Select a report.');
                    return false;
                }
                return true;
            case 'raters': {
                const raters = filledRaters();
                if (!raters.length) {
                    awWarn('Add at least one rater.');
                    return false;
                }
                const incomplete = raters.filter(function (r) { return !r.name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(r.email); });
                if (incomplete.length) {
                    awWarn('Each rater needs a name and a valid email address (' + incomplete.length + ' to finish).');
                    return false;
                }
                return true;
            }
            case 'rolesync-preset':
                if (!state.rolesyncPreset) {
                    awWarn('Choose a RoleSync preset.');
                    return false;
                }
                return true;
            case 'compatibility':
                if (!state.compatibilityCandidate) {
                    awWarn('Select a candidate for compatibility comparison.');
                    return false;
                }
                return true;
            default:
                return true;
        }
    }

    function syncIndividuals() {
        state.individuals = [];
        document.querySelectorAll('#awCandList .cand-row').forEach(function (row) {
            if (row.querySelector('.custom-checkbox').classList.contains('checked')) {
                state.individuals.push({
                    name: row.dataset.name,
                    initials: row.querySelector('.avatar-sm').textContent
                });
            }
        });
    }

    function initPickCardPrices() {
        if (!AC) return;
        document.querySelectorAll('#awInstrumentCards .instrument-card').forEach(function (card) {
            var priceEl = card.querySelector('.pick-card-price');
            if (priceEl) priceEl.textContent = AC.instrumentCardPrice(card.dataset.instrument);
        });
        document.querySelectorAll('#awAddonGrid .addon-card').forEach(function (card) {
            var priceEl = card.querySelector('.pick-card-price');
            if (priceEl) priceEl.textContent = AC.addonCardPrice(card.dataset.addon);
        });
        document.querySelectorAll('#awToolkitCards .instrument-card').forEach(function (card) {
            var priceEl = card.querySelector('.pick-card-price');
            if (priceEl) priceEl.textContent = AC.toolkitCardPrice(card.dataset.toolkit);
        });
    }

    function buildReportGrid() {
        const isGroup = state.teiqueReportScope === 'group';
        const isThreeSixty = state.teiqueReportScope === '360';

        /* Form toggle and add-ons are individual-only; a 360° uses the full form and has one report */
        if (isThreeSixty) {
            state.teiqueForm = 'full';
            state.addOns = [];
            state.report = REPORT_360;
            setSegActive('awFormSeg', 'full');
        }
        if (isGroup) {
            state.teiqueForm = 'full';
            state.addOns = [];
            setSegActive('awFormSeg', 'full');
        }

        const list = REPORTS[state.teiqueReportScope] || REPORTS.individual;
        const grid = document.getElementById('awReportGrid');
        const hint = document.getElementById('awReportHint');
        hint.textContent = isThreeSixty
            ? 'The candidate rates themself, and the raters you add next rate them too. The report compares the two views, by rater group.'
            : isGroup
            ? 'Select a group report. Some reports require 2+ completed questionnaires.'
            : 'Select an individual report.';
        grid.innerHTML = list.map(function (r) {
            const sel = state.report === r.name ? ' selected' : '';
            const price = AC && !isThreeSixty ? AC.reportCardPrice(r.name, state.teiqueReportScope, state.teiqueForm) : '';
            return '<div class="report-pick-card' + sel + '" data-report="' + r.name + '">' +
                reportCoverImg(r.name) +
                '<b>' + r.name + '</b>' +
                (price ? '<span class="pick-card-price">' + price + '</span>' : '') +
                '</div>';
        }).join('');
        grid.querySelectorAll('.report-pick-card').forEach(function (card) {
            card.addEventListener('click', function () {
                grid.querySelectorAll('.report-pick-card').forEach(function (c) { c.classList.remove('selected'); });
                card.classList.add('selected');
                state.report = card.dataset.report;
            });
        });

        const formHint = document.getElementById('awFormHint');
        if (formHint) formHint.textContent = FORM_HINTS[state.teiqueForm] || '';

        const formSection = document.getElementById('awFormSection');
        if (formSection) formSection.style.display = isGroup || isThreeSixty ? 'none' : '';

        const addonSection = document.getElementById('awAddonSection');
        if (addonSection) addonSection.style.display = isGroup || isThreeSixty ? 'none' : '';

        /* a 360° is for one candidate: say so here, before the Next button refuses */
        let note = document.getElementById('aw360Note');
        if (!note) {
            note = document.createElement('div');
            note.id = 'aw360Note';
            note.className = 'aw-360-note';
            grid.parentNode.appendChild(note);
        }
        syncIndividuals();
        const picked = state.targetMode === 'individuals' ? state.individuals.length : 0;
        note.textContent = state.targetMode !== 'individuals'
            ? 'A 360° is for one candidate at a time, not a group. Go back to Target and select one candidate.'
            : 'A 360° is for one candidate at a time. You selected ' + picked + '; go back to Target and keep one.';
        note.hidden = !isThreeSixty || picked === 1;

        syncAddonCards();
    }

    /* ---------- 360° raters step ---------- */
    function escHtml(s) {
        return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; });
    }
    function buildRaters() {
        const who = state.individuals[0];
        document.getElementById('awRaterSelf').innerHTML = who
            ? '<span class="avatar-sm">' + escHtml(who.initials) + '</span><div><b>' + escHtml(who.name) + '</b><small>Rates themself (self-rating)</small></div>'
            : '';
        const box = document.getElementById('awRaterGroups');
        box.innerHTML = state.raterGroups.map(function (g, gi) {
            const n = g.raters.filter(function (r) { return (r.name || '').trim() || (r.email || '').trim(); }).length;
            return '<div class="aw-rgroup" data-g="' + gi + '">' +
                '<div class="aw-rgroup-head"><h4>' + escHtml(g.label) + '</h4><span class="aw-count">' + n + ' rater' + (n === 1 ? '' : 's') + '</span>' +
                (RATER_GROUPS.indexOf(g.label) === -1 ? '<button type="button" class="aw-link aw-remove-group" data-act="remove-group">Remove group</button>' : '') + '</div>' +
                g.raters.map(function (r, ri) {
                    return '<div class="aw-rater" data-r="' + ri + '">' +
                        '<input class="form-input aw-name" placeholder="Full name" aria-label="' + escHtml(g.label) + ' rater name" value="' + escHtml(r.name) + '">' +
                        '<input class="form-input aw-email" type="email" placeholder="name@company.com" aria-label="' + escHtml(g.label) + ' rater email" value="' + escHtml(r.email) + '">' +
                        '<button type="button" class="aw-x" data-act="remove" aria-label="Remove this rater">×</button></div>';
                }).join('') +
                '<button type="button" class="aw-link" data-act="add">+ Add ' + escHtml(g.label.toLowerCase()) + ' rater</button></div>';
        }).join('');
        document.getElementById('awMinGroup').value = String(state.minGroupSize);
    }
    function wireRaters() {
        const box = document.getElementById('awRaterGroups');
        box.addEventListener('input', function (e) {
            const row = e.target.closest('.aw-rater'), grp = e.target.closest('.aw-rgroup');
            if (!row || !grp) return;
            const r = state.raterGroups[+grp.dataset.g].raters[+row.dataset.r];
            if (e.target.classList.contains('aw-name')) r.name = e.target.value;
            if (e.target.classList.contains('aw-email')) r.email = e.target.value;
            const g = state.raterGroups[+grp.dataset.g];
            const n = g.raters.filter(function (x) { return (x.name || '').trim() || (x.email || '').trim(); }).length;
            grp.querySelector('.aw-count').textContent = n + ' rater' + (n === 1 ? '' : 's');
        });
        box.addEventListener('click', function (e) {
            const btn = e.target.closest('[data-act]'), grp = e.target.closest('.aw-rgroup');
            if (!btn || !grp) return;
            const g = state.raterGroups[+grp.dataset.g];
            if (btn.dataset.act === 'add') g.raters.push({ name: '', email: '' });
            if (btn.dataset.act === 'remove') {
                g.raters.splice(+btn.closest('.aw-rater').dataset.r, 1);
                if (!g.raters.length) g.raters.push({ name: '', email: '' });
            }
            if (btn.dataset.act === 'remove-group') state.raterGroups.splice(+grp.dataset.g, 1);
            buildRaters();
            if (btn.dataset.act === 'add') {
                const rows = box.querySelectorAll('.aw-rgroup[data-g="' + grp.dataset.g + '"] .aw-name');
                if (rows.length) rows[rows.length - 1].focus();
            }
        });
        document.getElementById('awAddGroup').addEventListener('click', function () {
            const input = document.getElementById('awNewGroupName'), label = input.value.trim();
            if (!label) { input.focus(); return; }
            if (state.raterGroups.some(function (g) { return g.label.toLowerCase() === label.toLowerCase(); })) {
                awWarn('There is already a group called ' + label + '.');
                return;
            }
            state.raterGroups.push({ label: label, raters: [{ name: '', email: '' }] });
            input.value = '';
            buildRaters();
        });
        document.getElementById('awNewGroupName').addEventListener('keydown', function (e) {
            if (e.key === 'Enter') { e.preventDefault(); document.getElementById('awAddGroup').click(); }
        });
        document.getElementById('awMinGroup').addEventListener('change', function (e) { state.minGroupSize = +e.target.value; });
    }

    function syncAddonCards() {
        document.querySelectorAll('#awAddonGrid .addon-card').forEach(function (card) {
            card.classList.toggle('selected', state.addOns.indexOf(card.dataset.addon) !== -1);
        });
    }

    function updateStepper() {
        const stage = STAGE_MAP[currentSlide()] || 1;
        document.querySelectorAll('#awStepper .step').forEach(function (s) {
            const n = +s.dataset.stage;
            s.classList.toggle('active', n === stage);
            s.classList.toggle('done', n < stage);
        });
        document.querySelectorAll('#awStepper .step-line').forEach(function (l) {
            l.classList.toggle('done', +l.dataset.line < stage);
        });
    }

    function isAwMenu(menu) {
        return !!(menu && menu.id && menu.id.indexOf('aw') === 0);
    }

    function awDropdownTrigger(menu) {
        return menu && (menu._awTrigger || menu.previousElementSibling);
    }

    function ensureAwDropdownAnchor(menu) {
        if (menu._awAnchor) return;
        const anchor = document.createComment('aw-dropdown-anchor');
        menu.parentNode.insertBefore(anchor, menu);
        menu._awAnchor = anchor;
        menu._awHome = menu.parentNode;
    }

    function clearAwDropdownStyles(menu) {
        if (!menu) return;
        menu.classList.remove('aw-portal', 'aw-drop-up');
        menu.style.position = '';
        menu.style.left = '';
        menu.style.top = '';
        menu.style.width = '';
        menu.style.minWidth = '';
        menu.style.maxHeight = '';
        menu.style.overflowY = '';
        menu.style.zIndex = '';
        menu.style.visibility = '';
    }

    function restoreAwDropdown(menu) {
        if (!menu) return;
        clearAwDropdownStyles(menu);
        if (menu._awHome && menu._awAnchor && menu.parentNode !== menu._awHome) {
            menu._awHome.insertBefore(menu, menu._awAnchor.nextSibling);
        }
        menu._awTrigger = null;
    }

    function closeAwDropdown(menu) {
        if (!menu) return;
        menu.classList.remove('active');
        const trigger = awDropdownTrigger(menu);
        if (trigger) trigger.classList.remove('active');
        restoreAwDropdown(menu);
    }

    function closeAwDropdowns() {
        document.querySelectorAll('.dropdown-menu.aw-portal, #newAssignmentModal .dropdown-menu').forEach(closeAwDropdown);
    }

    function positionAwDropdown(menu, trigger) {
        if (!menu || !trigger || !menu.classList.contains('active')) return;

        const gap = 4;
        const rect = trigger.getBoundingClientRect();
        if (!rect.width && !rect.height) {
            closeAwDropdown(menu);
            return;
        }
        const viewportPad = 8;
        const maxMenuWidth = Math.min(320, window.innerWidth - viewportPad * 2);
        const menuWidth = Math.min(Math.max(rect.width, 180), maxMenuWidth);

        menu.style.position = 'fixed';
        menu.style.width = menuWidth + 'px';
        menu.style.minWidth = '180px';
        menu.style.zIndex = '500';
        menu.style.top = (rect.bottom + gap) + 'px';
        menu.classList.remove('aw-drop-up');

        let left = rect.left;
        if (left + menuWidth > window.innerWidth - viewportPad) {
            left = window.innerWidth - viewportPad - menuWidth;
        }
        if (left < viewportPad) left = viewportPad;
        menu.style.left = left + 'px';

        const menuHeight = menu.offsetHeight || menu.scrollHeight;
        const spaceBelow = window.innerHeight - rect.bottom - gap - viewportPad;
        const spaceAbove = rect.top - gap - viewportPad;

        if (menuHeight > spaceBelow && spaceAbove > spaceBelow) {
            menu.classList.add('aw-drop-up');
            menu.style.top = Math.max(viewportPad, rect.top - menuHeight - gap) + 'px';
        }

        const maxH = Math.min(280, window.innerHeight - viewportPad * 2);
        if (menu.offsetHeight > maxH) {
            menu.style.maxHeight = maxH + 'px';
            menu.style.overflowY = 'auto';
        } else {
            menu.style.maxHeight = '';
            menu.style.overflowY = '';
        }
    }

    function openAwDropdown(menu, trigger) {
        if (!menu || !trigger) return;
        ensureAwDropdownAnchor(menu);
        menu._awTrigger = trigger;
        menu.classList.add('aw-portal');
        menu.style.visibility = 'hidden';
        document.body.appendChild(menu);
        menu.classList.add('active');
        trigger.classList.add('active');
        requestAnimationFrame(function () {
            positionAwDropdown(menu, trigger);
            menu.style.visibility = '';
        });
    }

    function awToggleDropdown(id) {
        const menu = document.getElementById(id);
        if (!isAwMenu(menu)) return false;
        const trigger = awDropdownTrigger(menu) || menu.previousElementSibling;
        const wasOpen = menu.classList.contains('active');

        closeAwDropdowns();
        if (!wasOpen && trigger) openAwDropdown(menu, trigger);
        return true;
    }

    function repositionAwDropdowns() {
        document.querySelectorAll('.dropdown-menu.aw-portal.active').forEach(function (menu) {
            positionAwDropdown(menu, awDropdownTrigger(menu));
        });
    }

    function render() {
        const slide = currentSlide();
        closeAwDropdowns();
        document.querySelectorAll('.assign-wizard .wiz-slide').forEach(function (el) {
            const isActive = el.dataset.slide === slide;
            el.classList.toggle('active', isActive);
            el.classList.remove('aw-from-back', 'aw-from-forward');
            if (isActive) {
                el.classList.add(awDirection === 'back' ? 'aw-from-back' : 'aw-from-forward');
            }
        });
        updateStepper();

        const wizBody = document.querySelector('#newAssignmentModal .wiz-body');
        if (wizBody) wizBody.scrollTop = 0;

        const backBtn = document.getElementById('awBack');
        const nextBtn = document.getElementById('awNext');
        const finishBtn = document.getElementById('awFinish');
        backBtn.style.visibility = slideStack.length > 1 ? 'visible' : 'hidden';
        nextBtn.style.display = slide === 'review' ? 'none' : '';
        finishBtn.style.display = slide === 'review' ? '' : 'none';

        if (slide === 'teique-report') buildReportGrid();
        if (slide === 'raters') buildRaters();
        if (slide === 'review') buildReview();
    }

    function buildReview() {
        const count = respondentCount();
        let targetHtml = '';
        if (state.targetMode === 'group') {
            targetHtml = '<div class="review-row"><span class="review-label">Groups</span><span class="review-val">' +
                state.groups.map(function (g) { return g.name; }).join(', ') + '</span></div>';
            targetHtml += '<div class="review-row"><span class="review-label">Respondents</span><span class="review-val">' +
                count + ' candidate' + (count === 1 ? '' : 's') + '</span></div>';
        } else {
            targetHtml = '<div class="review-row"><span class="review-label">Candidates</span><span class="review-val">' +
                state.individuals.map(function (i) { return i.name; }).join(', ') + '</span></div>';
            targetHtml += '<div class="review-row"><span class="review-label">Respondents</span><span class="review-val">' +
                (is360() ? '1 candidate and ' + filledRaters().length + ' raters' : count + ' candidate' + (count === 1 ? '' : 's')) + '</span></div>';
        }

        let assessHtml = '';
        if (state.assessmentMode === 'toolkit') {
            assessHtml = '<div class="review-row"><span class="review-label">Type</span><span class="review-val">Toolkit</span></div>';
            assessHtml += '<div class="review-row"><span class="review-label">Toolkit</span><span class="review-val">' +
                (TOOLKIT_LABELS[state.toolkit] || state.toolkit || '—') + '</span></div>';
        } else {
            assessHtml = '<div class="review-row"><span class="review-label">Instrument</span><span class="review-val">' +
                (INSTRUMENT_LABELS[state.instrument] || state.instrument || '—') + '</span></div>';
            if (is360()) {
                const raters = filledRaters();
                const byGroup = state.raterGroups.map(function (g) {
                    const n = raters.filter(function (r) { return r.group === g.label; }).length;
                    return n ? g.label + ' ' + n : '';
                }).filter(Boolean).join(' · ');
                assessHtml += '<div class="review-row"><span class="review-label">Report scope</span><span class="review-val">360° report</span></div>';
                assessHtml += '<div class="review-row"><span class="review-label">Form</span><span class="review-val">Full Form</span></div>';
                assessHtml += '<div class="review-row"><span class="review-label">Report</span><span class="review-val">TEIQue 360° Report</span></div>';
                assessHtml += '<div class="review-row"><span class="review-label">Self-rating</span><span class="review-val">' +
                    escHtml(state.individuals.length ? state.individuals[0].name : '—') + '</span></div>';
                assessHtml += '<div class="review-row"><span class="review-label">Raters</span><span class="review-val">' +
                    raters.length + ' (' + escHtml(byGroup) + ')</span></div>';
                assessHtml += '<div class="review-row"><span class="review-label">Group shown from</span><span class="review-val">' +
                    state.minGroupSize + ' rater' + (state.minGroupSize === 1 ? '' : 's') + '</span></div>';
            } else if (state.instrument === 'teique') {
                assessHtml += '<div class="review-row"><span class="review-label">Report scope</span><span class="review-val">' +
                    (state.teiqueReportScope === 'group' ? 'Group report' : 'Individual report') + '</span></div>';
                if (state.teiqueReportScope !== 'group') {
                    assessHtml += '<div class="review-row"><span class="review-label">Form</span><span class="review-val">' +
                        (FORM_LABELS[state.teiqueForm] || '—') + '</span></div>';
                }
                if (state.report) {
                    assessHtml += '<div class="review-row"><span class="review-label">Report</span><span class="review-val">' +
                        state.report + '</span></div>';
                }
                if (state.addOns.length) {
                    assessHtml += '<div class="review-row"><span class="review-label">Add-ons</span><span class="review-val">' +
                        state.addOns.map(function (a) { return ADDON_LABELS[a] || a; }).join(', ') + '</span></div>';
                }
                if (state.rolesyncPreset) {
                    assessHtml += '<div class="review-row"><span class="review-label">RoleSync preset</span><span class="review-val">' +
                        state.rolesyncPreset + '</span></div>';
                }
                if (state.compatibilityCandidate) {
                    assessHtml += '<div class="review-row"><span class="review-label">Compare with</span><span class="review-val">' +
                        state.compatibilityCandidate + '</span></div>';
                }
            }
        }

        const settingsHtml = buildSettingsReview();
        const promoHtml = buildPromoSection();
        const cartHtml = is360() && !AC ? '' : buildCart();

        document.getElementById('awReviewContent').innerHTML =
            '<div class="review-block"><h4>Target</h4>' + targetHtml + '</div>' +
            '<div class="review-block"><h4>Assessment</h4>' + assessHtml + '</div>' +
            '<div class="review-block"><h4>Settings</h4>' + settingsHtml + '</div>' +
            promoHtml +
            cartHtml;

        wirePromoPicker();
    }

    function buildPromoSection() {
        syncSelectedPromo();
        const available = getAvailablePromos();
        if (!available.length) {
            return '<div class="review-block aw-promo-block"><h4>Promotions</h4><p class="aw-promo-empty">No promotions apply to this assignment.</p></div>';
        }
        const cost = baseCostResult();
        let html = '<div class="review-block aw-promo-block"><h4>Promotions</h4>' +
            '<p class="aw-slide-hint" style="margin-bottom:var(--spacing-narrow-m);">Optional — select one promotion to reduce the AC cost.</p>' +
            '<div class="aw-promo-picker" id="awPromoPicker">';
        available.forEach(function (p) {
            const sel = state.selectedPromo === p.id ? ' selected' : '';
            const preview = PROMO.previewSavings(p, cost, state);
            const tagCls = p.tag === 'Spotlight' ? ' spotlight' : (p.scope === 'user' ? ' user' : '');
            html += '<button type="button" class="aw-promo-row' + sel + '" data-promo-id="' + p.id + '">' +
                '<span class="addon-check" aria-hidden="true"></span>' +
                '<span class="aw-promo-row-info">' +
                '<span class="promo-tag-pill' + tagCls + '">' + p.tag + '</span>' +
                '<b>' + p.title + '</b>' +
                '<span class="aw-promo-row-save">' + preview + '</span>' +
                '</span></button>';
        });
        html += '</div></div>';
        return html;
    }

    function wirePromoPicker() {
        const picker = document.getElementById('awPromoPicker');
        if (!picker) return;
        picker.querySelectorAll('.aw-promo-row').forEach(function (row) {
            row.addEventListener('click', function () {
                const id = row.dataset.promoId;
                state.selectedPromo = state.selectedPromo === id ? null : id;
                buildReview();
            });
        });
    }

    function buildCart() {
        const applied = getAppliedCost();
        const items = applied.items || [];
        const rowsHtml = items.map(function (i) {
            return '<div class="cart-row">' +
                '<div class="cart-item"><span class="cart-item-name">' + i.label + '</span>' +
                '<span class="cart-item-meta">' + formatAC(i.unit) + ' × ' + i.qty + '</span></div>' +
                '<span class="cart-item-total">' + formatAC(i.total) + '</span></div>';
        }).join('');
        const promoRow = applied.savingsAC > 0 && applied.promoLine
            ? '<div class="cart-row cart-row-promo"><div class="cart-item"><span class="cart-item-name">' + applied.promoLine + '</span>' +
                '<span class="cart-item-meta">Promotion applied</span></div>' +
                '<span class="cart-item-total">−' + formatAC(applied.savingsAC) + '</span></div>'
            : '';
        const total = applied.total || 0;
        const remaining = Math.max(0, DEMO_BALANCE - total);
        return '<div class="review-block cart-block">' +
            '<h4>Credit summary</h4>' +
            '<div class="cart-list">' + rowsHtml + promoRow + '</div>' +
            '<div class="cart-total-row"><span>Total deduction</span><span class="cart-total-val">' + formatAC(total) + '</span></div>' +
            '<p class="cart-note">' + formatAC(total) + ' will be deducted from your balance (' + formatAC(remaining) + ' remaining).</p>' +
            '</div>';
    }

    function isToggleOn(id) {
        const el = document.getElementById(id);
        return el && !el.classList.contains('off');
    }

    function buildSettingsReview() {
        const rows = [];

        rows.push(['Report delivery', DELIVERY_LABELS[state.reportDelivery] || 'Coach only']);
        rows.push(['Auto reminders', isToggleOn('awRemindersToggle') ? 'Every 48 hours' : 'Off']);

        const qLang = document.querySelector('#awQLang .dropdown-label');
        const rLang = document.querySelector('#awRLang .dropdown-label');
        if (qLang) rows.push(['Questionnaire language', qLang.textContent]);
        if (rLang) rows.push(['Report language', rLang.textContent]);

        if (isToggleOn('awScheduleToggle')) rows.push(['Schedule invite', 'Enabled']);
        if (state.deadline && state.deadline !== 'none') {
            if (state.deadline === 'custom') {
                const d = document.getElementById('awDueDay').value;
                const m = document.getElementById('awDueMonth').value;
                const y = document.getElementById('awDueYear').value;
                rows.push(['Completion deadline', (d || m || y) ? [d, m, y].filter(Boolean).join('/') : 'Custom date']);
            } else {
                const dl = document.getElementById('awDeadlineLabel');
                rows.push(['Completion deadline', dl ? dl.textContent : state.deadline + ' days']);
            }
        }
        if (isToggleOn('awCustomInviteToggle')) rows.push(['Invite email', 'Custom message']);

        return rows.map(function (r) {
            return '<div class="review-row"><span class="review-label">' + r[0] +
                '</span><span class="review-val">' + r[1] + '</span></div>';
        }).join('');
    }

    function updateAssessmentPanel() {
        const isReport = state.assessmentMode === 'report';
        document.getElementById('awInstrumentSection').style.display = isReport ? '' : 'none';
        document.getElementById('awToolkitSection').style.display = isReport ? 'none' : '';
    }

    function resetWizard(opts) {
        opts = opts || {};
        slideStack = ['target'];
        awDirection = 'forward';
        closeAwDropdowns();
        state.targetMode = 'individuals';
        state.individuals = [];
        state.groups = [];
        state.assessmentMode = opts.mode === 'toolkit' ? 'toolkit' : 'report';
        state.instrument = opts.mode === 'toolkit' ? null : (opts.instrument || null);
        state.toolkit = opts.toolkit || null;
        state.teiqueReportScope = 'individual';
        state.report = null;
        state.teiqueForm = 'full';
        state.addOns = [];
        state.rolesyncPreset = null;
        state.compatibilityCandidate = null;
        state.reminders = true;
        state.reportDelivery = 'coach';
        state.deadline = 'none';
        state.selectedPromo = null;
        state.raterGroups = freshRaterGroups();
        state.minGroupSize = 1;
        const newGroup = document.getElementById('awNewGroupName');
        if (newGroup) newGroup.value = '';

        document.querySelectorAll('#awCandList .cand-row[data-new]').forEach(function (r) { r.remove(); });
        document.querySelectorAll('#awCandList .custom-checkbox.checked').forEach(function (cb) {
            cb.classList.remove('checked');
        });
        document.querySelectorAll('#awGroupPick .group-card.selected').forEach(function (c) {
            c.classList.remove('selected');
        });
        document.querySelectorAll('#awInstrumentCards .instrument-card.selected').forEach(function (c) {
            c.classList.remove('selected');
        });
        document.querySelectorAll('#awToolkitCards .instrument-card.selected').forEach(function (c) {
            c.classList.remove('selected');
        });
        document.querySelectorAll('#awCompList .comp-cand-row.selected').forEach(function (c) {
            c.classList.remove('selected');
        });
        document.querySelectorAll('#awAddonGrid .addon-card.selected').forEach(function (c) {
            c.classList.remove('selected');
        });

        if (state.instrument) {
            const card = document.querySelector('#awInstrumentCards [data-instrument="' + state.instrument + '"]');
            if (card) card.classList.add('selected');
        }
        if (state.toolkit) {
            const tkCard = document.querySelector('#awToolkitCards [data-toolkit="' + state.toolkit + '"]');
            if (tkCard) tkCard.classList.add('selected');
        }

        document.getElementById('awCandSearch').value = '';
        document.querySelectorAll('#awCandList .cand-row').forEach(function (r) { r.style.display = ''; });

        setSegActive('awTargetSeg', state.targetMode === 'group' ? 'group' : 'individuals');
        document.getElementById('awTargetIndividuals').style.display = state.targetMode === 'group' ? 'none' : '';
        document.getElementById('awTargetGroups').style.display = state.targetMode === 'group' ? '' : 'none';

        setSegActive('awModeSeg', state.assessmentMode);
        updateAssessmentPanel();

        setSegActive('awTeiqueScopeSeg', 'individual');
        setSegActive('awFormSeg', 'full');
        setSegActive('awDeliverySeg', 'coach');

        const delHint = document.getElementById('awDeliveryHint');
        if (delHint) delHint.textContent = DELIVERY_HINTS.coach;

        const deadlineLabel = document.getElementById('awDeadlineLabel');
        if (deadlineLabel) deadlineLabel.textContent = 'No deadline';
        const deadlineNested = document.getElementById('awDeadlineNested');
        if (deadlineNested) deadlineNested.classList.add('hidden');
        ['awDueDay', 'awDueMonth', 'awDueYear', 'awNewFirst', 'awNewLast', 'awNewEmail'].forEach(function (id) {
            const el = document.getElementById(id);
            if (el) el.value = '';
        });
        const newForm = document.getElementById('awNewCandForm');
        if (newForm) newForm.style.display = 'none';

        document.getElementById('awRoleSyncLabel').textContent = 'Choose a preset';

        const remToggle = document.getElementById('awRemindersToggle');
        if (remToggle) remToggle.classList.toggle('off', !state.reminders);

        render();
        if (typeof initSegIndicators === 'function') initSegIndicators();
    }

    function setSegActive(segId, value) {
        const seg = document.getElementById(segId);
        if (!seg) return;
        seg.querySelectorAll('button').forEach(function (b) {
            b.classList.toggle('active', b.dataset.target === value || b.dataset.mode === value || b.dataset.scope === value || b.dataset.form === value || b.dataset.delivery === value);
        });
    }

    window.awNext = function () {
        const slide = currentSlide();
        if (!validateSlide(slide)) return;
        const next = getNextSlide(slide);
        awDirection = 'forward';
        slideStack.push(next);
        render();
    };

    window.awBack = function () {
        if (slideStack.length <= 1) return;
        awDirection = 'back';
        slideStack.pop();
        render();
    };

    window.awFinish = function () {
        closeModal('newAssignmentModal');
        const banner = document.getElementById('assignSuccessBanner');
        if (banner) {
            banner.classList.add('visible');
            setTimeout(function () { banner.classList.remove('visible'); }, 6000);
        }
        if (window.history.replaceState) {
            window.history.replaceState({}, '', 'assignments.html');
        }
    };

    window.awSelectPreset = function (name) {
        state.rolesyncPreset = name;
        document.getElementById('awRoleSyncLabel').textContent = name;
        selectOption('awRoleSyncPreset', name);
    };

    window.awSelectDeadline = function (value, label) {
        state.deadline = value;
        const lbl = document.getElementById('awDeadlineLabel');
        if (lbl) lbl.textContent = label;
        const nested = document.getElementById('awDeadlineNested');
        if (nested) nested.classList.toggle('hidden', value !== 'custom');
        closeAwDropdowns();
    };

    window.awToggleNested = function (id, toggleEl) {
        const nested = document.getElementById(id);
        if (!nested) return;
        const show = toggleEl && !toggleEl.classList.contains('off');
        nested.classList.toggle('hidden', !show);
    };

    window.openAssignmentWizard = function (opts) {
        opts = opts || {};
        resetWizard(opts);
        openModal('newAssignmentModal');
    };

    function wireAwDropdowns() {
        const modal = document.getElementById('newAssignmentModal');
        if (!modal) return;

        const origToggle = window.toggleDropdown;
        if (typeof origToggle === 'function') {
            window.toggleDropdown = function (id) {
                if (awToggleDropdown(id)) return;
                origToggle(id);
            };
        }

        const origSelect = window.selectOption;
        if (typeof origSelect === 'function') {
            window.selectOption = function (id, label) {
                const menu = document.getElementById(id);
                origSelect(id, label);
                if (isAwMenu(menu)) closeAwDropdown(menu);
            };
        }

        document.addEventListener('click', function (e) {
            const overlay = document.getElementById('newAssignmentModal');
            if (!overlay || !overlay.classList.contains('active')) return;
            if (e.target.closest('#newAssignmentModal .dropdown-trigger')) return;
            if (e.target.closest('.dropdown-menu.aw-portal')) return;
            closeAwDropdowns();
        });

        const overlay = document.getElementById('newAssignmentModal');
        if (overlay) {
            new MutationObserver(function () {
                if (!overlay.classList.contains('active')) closeAwDropdowns();
            }).observe(overlay, { attributes: true, attributeFilter: ['class'] });
        }

        const origCloseModal = window.closeModal;
        if (typeof origCloseModal === 'function') {
            window.closeModal = function (id) {
                if (id === 'newAssignmentModal') closeAwDropdowns();
                origCloseModal(id);
            };
        }

        const body = modal.querySelector('.wiz-body');
        if (body) body.addEventListener('scroll', repositionAwDropdowns, { passive: true });
        window.addEventListener('resize', repositionAwDropdowns);
        window.addEventListener('scroll', repositionAwDropdowns, { passive: true, capture: true });
    }

    function wireEvents() {
        initPickCardPrices();
        document.getElementById('awTargetSeg').addEventListener('click', function (e) {
            const btn = e.target.closest('button');
            if (!btn) return;
            this.querySelectorAll('button').forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');
            state.targetMode = btn.dataset.target;
            document.getElementById('awTargetIndividuals').style.display = state.targetMode === 'individuals' ? '' : 'none';
            document.getElementById('awTargetGroups').style.display = state.targetMode === 'group' ? '' : 'none';
            if (typeof initSegIndicators === 'function') initSegIndicators();
        });

        document.getElementById('awModeSeg').addEventListener('click', function (e) {
            const btn = e.target.closest('button');
            if (!btn) return;
            this.querySelectorAll('button').forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');
            state.assessmentMode = btn.dataset.mode;
            if (state.assessmentMode === 'toolkit') {
                state.instrument = null;
                state.report = null;
                state.addOns = [];
                state.selectedPromo = null;
                document.querySelectorAll('#awInstrumentCards .instrument-card.selected').forEach(function (c) {
                    c.classList.remove('selected');
                });
            } else {
                state.toolkit = null;
                state.selectedPromo = null;
                document.querySelectorAll('#awToolkitCards .instrument-card.selected').forEach(function (c) {
                    c.classList.remove('selected');
                });
            }
            updateAssessmentPanel();
            if (typeof initSegIndicators === 'function') initSegIndicators();
        });

        document.getElementById('awTeiqueScopeSeg').addEventListener('click', function (e) {
            const btn = e.target.closest('button');
            if (!btn) return;
            this.querySelectorAll('button').forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');
            state.teiqueReportScope = btn.dataset.scope;
            state.report = null;
            buildReportGrid();
            if (typeof initSegIndicators === 'function') initSegIndicators();
        });

        document.getElementById('awInstrumentCards').addEventListener('click', function (e) {
            const card = e.target.closest('.instrument-card');
            if (!card) return;
            this.querySelectorAll('.instrument-card').forEach(function (c) { c.classList.remove('selected'); });
            card.classList.add('selected');
            state.instrument = card.dataset.instrument;
            state.report = null;
            state.addOns = [];
            state.selectedPromo = null;
            state.rolesyncPreset = null;
            state.compatibilityCandidate = null;
        });

        document.getElementById('awToolkitCards').addEventListener('click', function (e) {
            const card = e.target.closest('.instrument-card');
            if (!card) return;
            this.querySelectorAll('.instrument-card').forEach(function (c) { c.classList.remove('selected'); });
            card.classList.add('selected');
            state.toolkit = card.dataset.toolkit;
            state.selectedPromo = null;
        });

        document.getElementById('awFormSeg').addEventListener('click', function (e) {
            const btn = e.target.closest('button');
            if (!btn) return;
            this.querySelectorAll('button').forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');
            state.teiqueForm = btn.dataset.form;
            const formHint = document.getElementById('awFormHint');
            if (formHint) formHint.textContent = FORM_HINTS[state.teiqueForm] || '';
            if (state.teiqueReportScope === 'individual') buildReportGrid();
            if (typeof initSegIndicators === 'function') initSegIndicators();
        });

        document.getElementById('awAddonGrid').addEventListener('click', function (e) {
            const card = e.target.closest('.addon-card');
            if (!card) return;
            const name = card.dataset.addon;
            const idx = state.addOns.indexOf(name);
            if (idx === -1) state.addOns.push(name);
            else state.addOns.splice(idx, 1);
            card.classList.toggle('selected', idx === -1);
        });

        document.getElementById('awGroupPick').addEventListener('click', function (e) {
            const card = e.target.closest('.group-card');
            if (!card) return;
            const name = card.dataset.group;
            const idx = state.groups.findIndex(function (g) { return g.name === name; });
            if (idx === -1) {
                state.groups.push({ name: name, count: +card.dataset.count || 0 });
                card.classList.add('selected');
            } else {
                state.groups.splice(idx, 1);
                card.classList.remove('selected');
            }
        });

        document.getElementById('awCompList').addEventListener('click', function (e) {
            const row = e.target.closest('.comp-cand-row');
            if (!row || row.dataset.teiqueComplete !== 'true') return;
            this.querySelectorAll('.comp-cand-row').forEach(function (r) { r.classList.remove('selected'); });
            row.classList.add('selected');
            state.compatibilityCandidate = row.dataset.name;
        });

        document.getElementById('awCandSearch').addEventListener('input', function () {
            const q = this.value.trim().toLowerCase();
            document.querySelectorAll('#awCandList .cand-row').forEach(function (row) {
                const ok = !q || row.dataset.name.toLowerCase().indexOf(q) !== -1;
                row.style.display = ok ? '' : 'none';
            });
        });

        const deliverySeg = document.getElementById('awDeliverySeg');
        if (deliverySeg) {
            deliverySeg.addEventListener('click', function (e) {
                const btn = e.target.closest('button');
                if (!btn) return;
                this.querySelectorAll('button').forEach(function (b) { b.classList.remove('active'); });
                btn.classList.add('active');
                state.reportDelivery = btn.dataset.delivery;
                const hint = document.getElementById('awDeliveryHint');
                if (hint) hint.textContent = DELIVERY_HINTS[state.reportDelivery] || '';
                if (typeof initSegIndicators === 'function') initSegIndicators();
            });
        }

        wireNewCandidate();
        wireRaters();
    }

    function wireNewCandidate() {
        const toggle = document.getElementById('awAddNewCandToggle');
        const form = document.getElementById('awNewCandForm');
        const cancel = document.getElementById('awNewCandCancel');
        const add = document.getElementById('awNewCandAdd');
        if (!toggle || !form || !add) return;

        function closeForm() {
            form.style.display = 'none';
            ['awNewFirst', 'awNewLast', 'awNewEmail'].forEach(function (id) {
                const el = document.getElementById(id);
                if (el) el.value = '';
            });
        }

        toggle.addEventListener('click', function () {
            const open = form.style.display !== 'none';
            form.style.display = open ? 'none' : '';
            if (!open) {
                const first = document.getElementById('awNewFirst');
                if (first) first.focus();
            }
        });

        if (cancel) cancel.addEventListener('click', closeForm);

        add.addEventListener('click', function () {
            const first = (document.getElementById('awNewFirst').value || '').trim();
            const last = (document.getElementById('awNewLast').value || '').trim();
            const email = (document.getElementById('awNewEmail').value || '').trim();
            if (!first && !last) {
                awWarn('Enter a name for the new candidate.');
                return;
            }
            const full = (first + ' ' + last).trim();
            const initials = ((first.charAt(0) || '') + (last.charAt(0) || '')).toUpperCase() || full.charAt(0).toUpperCase();

            const row = document.createElement('div');
            row.className = 'cand-row';
            row.dataset.name = full;
            row.dataset.new = '1';
            row.innerHTML =
                '<div class="custom-checkbox sm checked" onclick="toggleCheckbox(this)"></div>' +
                '<span class="avatar-sm">' + initials + '</span>' +
                '<div class="cand-info"><div class="cand-name"><b>' + full + '</b></div>' +
                '<div class="cand-email">' + (email || 'No email') + '</div></div>' +
                '<span class="group-pill none">New</span>';

            const list = document.getElementById('awCandList');
            list.insertBefore(row, list.firstChild);

            closeForm();
            if (typeof showToast === 'function') showToast(full + ' added and selected.');
        });
    }

    function parseQuery() {
        const params = new URLSearchParams(window.location.search);
        if (params.get('new') !== '1') return;

        const instrument = params.get('instrument');
        const mode = params.get('mode');
        const instrumentMap = {
            teique: 'teique',
            tsiqe: 'tsique',
            scanin: 'scanin',
            '3rs': '3rs',
            toolkit: null
        };

        let inst = instrument && instrumentMap[instrument.toLowerCase()];
        if (instrument === 'toolkit') {
            openAssignmentWizard({ mode: 'toolkit' });
            return;
        }
        if (inst === 'teique' && params.get('scope') === '360') {
            openAssignmentWizard({ instrument: inst });
            state.teiqueReportScope = '360';
            setSegActive('awTeiqueScopeSeg', '360');
        } else if (inst) {
            openAssignmentWizard({ instrument: inst });
        } else {
            openAssignmentWizard();
        }
    }

    wireEvents();
    wireAwDropdowns();
    document.addEventListener('DOMContentLoaded', parseQuery);
    if (document.readyState !== 'loading') parseQuery();
})();
