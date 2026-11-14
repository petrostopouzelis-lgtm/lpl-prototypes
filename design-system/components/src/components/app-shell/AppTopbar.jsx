import React, { useState } from 'react';

export function AppTopbar({ title, subtitle, searchPlaceholder = 'Search…', profileName, profileInitials, unread = false, menuItems = [], onBurgerClick, onMenuSelect }) {
  const [open, setOpen] = useState(false);
  return (
    <header style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-narrow-l)', padding: 'var(--spacing-narrow-l) var(--spacing-standard-m)', background: 'var(--color-white)' }}>
      {onBurgerClick && (
        <button onClick={onBurgerClick} style={{ background: 'none', border: 'none', cursor: 'pointer', width: 24, height: 18, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flexShrink: 0, padding: 0 }}>
          <span style={{ display: 'block', width: 24, height: 2.5, background: 'var(--color-primary-full)', borderRadius: 2 }} />
          <span style={{ display: 'block', width: 24, height: 2.5, background: 'var(--color-primary-full)', borderRadius: 2 }} />
          <span style={{ display: 'block', width: 24, height: 2.5, background: 'var(--color-primary-full)', borderRadius: 2 }} />
        </button>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
        <span style={{ fontFamily: 'var(--font-manrope)', fontWeight: 'var(--font-weight-bold)', fontSize: 28, color: 'var(--color-text-blue)', whiteSpace: 'nowrap' }}>{title}</span>
        {subtitle && <span style={{ fontFamily: 'var(--font-inter)', fontSize: 14, color: 'var(--color-gray)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{subtitle}</span>}
      </div>
      <div style={{ flex: 1 }} />
      <div style={{ position: 'relative', width: 280, maxWidth: '32vw' }}>
        <input
          placeholder={searchPlaceholder}
          style={{
            width: '100%', background: 'var(--color-white)', border: '1px solid var(--color-light-gray)',
            borderRadius: 'var(--radius-standard)', padding: '10px 16px 10px 42px',
            fontFamily: 'var(--font-inter)', fontSize: 'var(--font-size-content)', color: 'var(--color-black)',
            boxShadow: 'var(--shadow-inner)', outline: 'none',
          }}
        />
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary-full)" strokeWidth="2" strokeLinecap="round" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
          <circle cx="11" cy="11" r="7" /><path d="M20 20l-3.6-3.6" />
        </svg>
      </div>
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <button
          onClick={() => setOpen(!open)}
          style={{
            position: 'relative', display: 'flex', alignItems: 'center', gap: 'var(--spacing-narrow-s)',
            background: 'var(--color-white)', border: '1px solid var(--color-light-gray)',
            boxShadow: 'var(--shadow-card)', borderRadius: 40, padding: '5px 8px 5px 5px',
            cursor: 'pointer', transition: 'all 0.25s ease',
          }}
        >
          <span style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--color-primary-gradient)', color: 'var(--color-white)', fontFamily: 'var(--font-manrope)', fontWeight: 'var(--font-weight-bold)', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {profileInitials}
          </span>
          {unread && <span style={{ position: 'absolute', top: 2, left: 30, width: 10, height: 10, borderRadius: '50%', background: 'var(--color-secondary-full)', border: '2px solid var(--color-white)' }} />}
          <span style={{ fontFamily: 'var(--font-manrope)', fontWeight: 'var(--font-weight-semibold)', fontSize: 14, color: 'var(--color-black)' }}>{profileName}</span>
          <svg width="12" height="8" viewBox="0 0 12 8" fill="none" stroke="var(--color-primary-full)" strokeWidth="2" strokeLinecap="round"><path d="M1 1.5L6 6.5L11 1.5" /></svg>
        </button>
        {open && (
          <div style={{ position: 'absolute', top: 'calc(100% + 10px)', right: 0, minWidth: 200, background: 'var(--color-white)', borderRadius: 'var(--radius-standard)', boxShadow: 'var(--shadow-card)', padding: 'var(--spacing-narrow-s)', zIndex: 200 }}>
            {menuItems.map((item) => (
              <button
                key={item.name}
                onClick={() => { onMenuSelect && onMenuSelect(item.name); setOpen(false); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 'var(--spacing-narrow-s)', width: '100%',
                  textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer',
                  padding: '10px 16px', borderRadius: 'var(--radius-small)',
                  fontFamily: 'var(--font-manrope)', fontWeight: 'var(--font-weight-semibold)',
                  fontSize: 'var(--font-size-content)',
                  color: item.danger ? 'var(--color-secondary-full)' : 'var(--color-primary-full)',
                }}
              >
                {item.name}
                {item.badge != null && (
                  <span style={{ marginLeft: 'auto', background: 'var(--color-secondary-gradient)', color: 'var(--color-white)', fontFamily: 'var(--font-inter)', fontWeight: 'var(--font-weight-bold)', fontSize: 11, minWidth: 20, height: 20, padding: '0 6px', borderRadius: 10, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{item.badge}</span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
