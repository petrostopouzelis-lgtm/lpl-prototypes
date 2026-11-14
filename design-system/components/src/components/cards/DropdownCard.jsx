import React, { useState } from 'react';

export function DropdownCard({ title, defaultOpen = true, children, style, ...rest }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ background: 'var(--color-white)', borderRadius: 'var(--radius-standard)', boxShadow: 'var(--shadow-card)', padding: 'var(--spacing-narrow-l)', transition: 'var(--ease-standard)', ...style }} {...rest}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--spacing-narrow-m)' }}>
        <h3 style={{ fontFamily: 'var(--font-manrope)', fontWeight: 'var(--font-weight-semibold)', fontSize: 'var(--font-size-title-large)', color: 'var(--color-text-blue)', margin: 0 }}>{title}</h3>
        <button
          onClick={() => setOpen(!open)}
          style={{ background: 'none', border: 'none', padding: 0, width: 20, height: 20, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary-full)" strokeWidth="2" strokeLinecap="round" style={{ transform: open ? 'none' : 'rotate(180deg)', transition: 'transform 0.3s ease' }}>
            <path d="M6 15l6-6 6 6" />
          </svg>
        </button>
      </div>
      <div style={{ marginTop: open ? 'var(--spacing-narrow-m)' : 0, maxHeight: open ? 1200 : 0, opacity: open ? 1 : 0, overflow: 'hidden', transition: 'max-height 0.3s ease, opacity 0.3s ease' }}>
        {children}
      </div>
    </div>
  );
}
