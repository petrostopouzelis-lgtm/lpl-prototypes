import React from 'react';

export function Modal({ open = true, title, onClose, actions, width = 520, children }) {
  if (!open) return null;
  return (
    <div style={{ position: 'absolute', inset: 0, background: 'rgba(30,30,30,0.45)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--spacing-narrow-l)' }}>
      <div style={{ background: 'var(--color-white)', borderRadius: 'var(--radius-standard)', boxShadow: 'var(--shadow-card)', width: '100%', maxWidth: width, maxHeight: '90%', overflowY: 'auto', padding: 'var(--spacing-narrow-l)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--spacing-narrow-l)' }}>
          <h3 style={{ fontFamily: 'var(--font-manrope)', fontWeight: 'var(--font-weight-bold)', fontSize: 'var(--font-size-title-large)', color: 'var(--color-text-blue)', margin: 0 }}>{title}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary-full)" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </div>
        {children}
        {actions && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--spacing-narrow-m)', marginTop: 'var(--spacing-narrow-l)' }}>
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
