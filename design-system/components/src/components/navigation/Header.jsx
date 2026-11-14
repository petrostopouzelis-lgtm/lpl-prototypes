import React, { useState, useEffect, useRef } from 'react';

const BLUE_FILTER = 'brightness(0) saturate(100%) invert(56%) sepia(89%) saturate(1053%) hue-rotate(165deg) brightness(93%) contrast(91%)';

// Measures the header's own root rather than the window, so the layout is correct
// inside constrained columns and preview frames alike.
function useContainerNarrow(ref, breakpoint = 1225) {
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = (w) => setNarrow(w > 0 && w < breakpoint);
    measure(el.getBoundingClientRect().width);
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) measure(entry.contentRect.width);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref, breakpoint]);
  return narrow;
}

function NavItem({ label, children, mobile, active, open, onToggle, onSelect, dropdownArrow }) {
  const [hover, setHover] = useState(false);
  return (
    <a
      onClick={() => (children ? onToggle() : onSelect(label))}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: mobile ? 'flex-start' : 'center',
        gap: 'var(--spacing-narrow-s)', fontFamily: 'var(--font-manrope)', fontWeight: 400,
        fontSize: 16, color: hover ? 'var(--color-secondary-full)' : 'var(--color-text-blue)',
        textDecoration: 'none', padding: mobile ? '16px 0' : '0 16px',
        transition: 'all 0.3s ease', whiteSpace: 'nowrap', cursor: 'pointer',
        borderBottom: mobile ? '1px solid var(--color-light-gray)' : undefined,
        borderTop: mobile && active ? '1px solid var(--color-light-gray)' : undefined,
      }}
    >
      {label}
      {children && (
        <img
          src={dropdownArrow} alt=""
          style={{ width: 14, height: 8, filter: BLUE_FILTER, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s ease' }}
        />
      )}
    </a>
  );
}

function IconButton({ src, hoverSrc, size, label, onClick, scaleOnHover }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      type="button" aria-label={label} onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        width: size, height: size, background: 'none', border: 'none', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0,
        outline: 'none', boxShadow: 'none', flexShrink: 0,
        transition: 'transform 0.3s ease', transform: scaleOnHover && hover ? 'scale(1.1)' : 'none',
      }}
    >
      <img src={hover && hoverSrc ? hoverSrc : src} alt="" style={{ width: '100%', height: '100%' }} />
    </button>
  );
}

function CtaButton({ label, arrow, fullWidth, onClick }) {
  const [hover, setHover] = useState(false);
  return (
    <a
      onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        background: hover ? '#ffffff' : 'var(--color-primary-gradient)',
        color: hover ? 'var(--color-primary-full)' : '#ffffff',
        border: 'none', borderRadius: 'var(--radius-pill)', padding: '8px 24px',
        fontFamily: 'var(--font-manrope)', fontWeight: 'var(--font-weight-semibold)',
        fontSize: 'var(--font-size-content)', lineHeight: 'var(--line-height-button)',
        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 'var(--spacing-narrow-m)',
        transition: 'all 0.3s ease', textDecoration: 'none', flexShrink: 0,
        boxShadow: hover ? '0px 2px 8px 0px rgba(0,0,0,0.15), 0px 6px 24px 0px rgba(0,0,0,0.2)' : 'var(--shadow-card)',
        transform: hover ? 'translateY(-2px)' : 'none',
        width: fullWidth ? '100%' : undefined, justifyContent: fullWidth ? 'center' : undefined,
        margin: fullWidth ? '16px 0' : undefined,
      }}
    >
      {label}
      {arrow && <img src={arrow} alt="" style={{ width: 16, height: 16, filter: hover ? BLUE_FILTER : 'none', transition: 'filter 0.3s ease' }} />}
    </a>
  );
}

function MenuPanel({ items, align = 'left', onSelect }) {
  return (
    <div style={{ position: 'absolute', top: 'calc(100% + 8px)', [align]: 0, background: '#ffffff', borderRadius: 16, boxShadow: 'var(--shadow-card)', padding: 8, minWidth: align === 'right' ? 160 : 200, zIndex: 200 }}>
      {items.map((item) => <MenuPanelItem key={item} label={item} onSelect={onSelect} />)}
    </div>
  );
}

function MenuPanelItem({ label, onSelect }) {
  const [hover, setHover] = useState(false);
  return (
    <a
      onClick={() => onSelect(label)}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        display: 'block', width: '100%', padding: '12px 16px', textAlign: 'left',
        background: hover ? 'var(--color-primary-light)' : 'none',
        color: hover ? '#ffffff' : 'var(--color-text-blue)', textDecoration: 'none',
        fontFamily: 'var(--font-inter)', fontSize: 16, borderRadius: 8,
        transition: 'all 0.2s ease', cursor: 'pointer',
      }}
    >
      {label}
    </a>
  );
}

export function Header({
  logo,
  navItems = ['Shop', 'Accreditation', 'Coaching', { name: 'Resources', items: ['Case Studies', 'Articles', 'Academic Website'] }],
  mobileNavItems,
  ctaLabel = 'Request Demo',
  languages = ['English', 'Español', 'Français', 'Deutsch', 'Italiano', '中文'],
  showLanguage = true,
  loggedIn = false,
  iconBase = '../../assets/icons',
  onNavigate, onCtaClick, onLoginClick, onLanguageSelect,
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const rootRef = useRef(null);
  const isMobile = useContainerNarrow(rootRef, 1225);

  const arrow = `${iconBase}/ui/request-demo-arrow.svg`;
  const dropdownArrow = `${iconBase}/ui/dropdown-arrow.svg`;
  const userIcon = loggedIn ? `${iconBase}/user/logged-in.svg` : `${iconBase}/user/guest.svg`;
  const userIconHover = loggedIn ? `${iconBase}/user/logged-in-hover.svg` : `${iconBase}/user/guest-hover.svg`;

  const select = (name) => { setOpenMenu(null); setMobileOpen(false); onNavigate && onNavigate(name); };
  const flatMobile = mobileNavItems || navItems.flatMap((i) => (typeof i === 'string' ? [i] : i.items || [i.name]));

  const languageButton = (size) => (
    <div style={{ position: 'relative' }}>
      <IconButton src={`${iconBase}/ui/language.svg`} size={size} label="Language" scaleOnHover onClick={() => setOpenMenu(openMenu === 'lang' ? null : 'lang')} />
      {openMenu === 'lang' && <MenuPanel items={languages} align="right" onSelect={(l) => { setOpenMenu(null); onLanguageSelect && onLanguageSelect(l); }} />}
    </div>
  );

  return (
    <div ref={rootRef} style={{ position: 'sticky', top: 0, background: 'linear-gradient(to bottom, #ffffff 27.55%, rgba(255,255,255,0) 100%)', padding: isMobile ? 'var(--spacing-narrow-m)' : 'var(--spacing-narrow-m) 80px', zIndex: 10000, width: '100%' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: isMobile ? 0 : 40, background: '#ffffff',
        borderRadius: isMobile ? 10 : 15,
        boxShadow: isMobile ? '0px 0px 8px 1px rgba(0,0,0,0.15)' : '0px 0px 24px 8px rgba(0,0,0,0.15)',
        padding: isMobile ? 16 : '11px 24px 11px 16px',
        position: isMobile ? 'relative' : 'static',
      }}>
        <a style={{ width: isMobile ? 'auto' : 56, height: isMobile ? 18 : undefined, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: isMobile ? 0 : '0 5px', flexShrink: 0, position: isMobile ? 'absolute' : 'static', left: isMobile ? '50%' : undefined, transform: isMobile ? 'translateX(-50%)' : undefined, cursor: 'pointer' }}>
          {logo && <img src={logo} alt="Psychometric Laboratory" style={isMobile ? { height: '100%', width: 'auto' } : { width: '100%', height: 'auto' }} />}
        </a>

        {!isMobile && (
          <nav style={{ display: 'flex', gap: 40, alignItems: 'center', flex: 1 }}>
            {navItems.map((item) => {
              const name = typeof item === 'string' ? item : item.name;
              const children = typeof item === 'string' ? null : item.items;
              return (
                <div key={name} style={{ position: 'relative' }}>
                  <NavItem
                    label={name} children={children} open={openMenu === name} dropdownArrow={dropdownArrow}
                    onToggle={() => setOpenMenu(openMenu === name ? null : name)} onSelect={select}
                  />
                  {children && openMenu === name && <MenuPanel items={children} onSelect={select} />}
                </div>
              );
            })}
          </nav>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 0 : 'var(--spacing-narrow-l)', flexShrink: 0, width: isMobile ? '100%' : undefined, justifyContent: isMobile ? 'space-between' : undefined }}>
          {isMobile && (
            <button
              type="button" aria-label="Open menu" onClick={() => setMobileOpen(!mobileOpen)}
              style={{ display: 'flex', background: 'none', border: 'none', cursor: 'pointer', padding: 0, width: 20, height: 16, position: 'relative', order: 1, outline: 'none' }}
            >
              <span style={{ display: 'block', position: 'absolute', left: 0, top: 0, width: 20, height: 2.5, background: 'var(--color-primary-full)', borderRadius: 11, transition: 'all 0.3s ease', transform: mobileOpen ? 'rotate(-45deg) translate(-5px, 6px)' : 'none' }} />
              <span style={{ display: 'block', position: 'absolute', left: 0, top: '50%', width: 20, height: 2.5, background: 'var(--color-primary-full)', borderRadius: 11, transition: 'all 0.3s ease', transform: 'translateY(-50%)', opacity: mobileOpen ? 0 : 1 }} />
              <span style={{ display: 'block', position: 'absolute', left: 0, bottom: 0, width: 20, height: 2.5, background: 'var(--color-primary-full)', borderRadius: 11, transition: 'all 0.3s ease', transform: mobileOpen ? 'rotate(45deg) translate(-5px, -6px)' : 'none' }} />
            </button>
          )}
          {!isMobile && <CtaButton label={ctaLabel} arrow={arrow} onClick={onCtaClick} />}
          {!isMobile && showLanguage && languageButton(32)}
          <div style={{ order: isMobile ? 2 : undefined }}>
            <IconButton src={userIcon} hoverSrc={userIconHover} size={isMobile ? 32 : 48} label="Login" onClick={onLoginClick} />
          </div>
        </div>
      </div>

      {isMobile && (
        <>
          <div
            onClick={() => setMobileOpen(false)}
            style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh', background: 'rgba(0,0,0,0.5)', zIndex: 10010, transition: 'all 0.3s ease', opacity: mobileOpen ? 1 : 0, visibility: mobileOpen ? 'visible' : 'hidden' }}
          />
          <div style={{ position: 'fixed', top: 0, left: 0, width: 300, height: '100vh', background: '#ffffff', borderRadius: '0 16px 16px 0', boxShadow: '4px 0px 16px 0px rgba(0,0,0,0.15)', padding: 24, zIndex: 10020, overflowY: 'auto', display: 'flex', flexDirection: 'column', transition: 'transform 0.3s ease', transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)' }}>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: 0, flex: 1 }}>
              {flatMobile.map((name, i) => (
                <NavItem key={name} label={name} mobile active={i === 0} onSelect={select} onToggle={() => {}} />
              ))}
              <CtaButton label={ctaLabel} arrow={arrow} fullWidth onClick={onCtaClick} />
            </nav>
            {showLanguage && (
              <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 24, borderTop: '1px solid var(--color-light-gray)' }}>
                {languageButton(40)}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
