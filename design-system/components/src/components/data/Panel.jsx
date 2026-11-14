import React from 'react';

export function Panel({ title, action, footer, children, style, ...rest }) {
  return (
    <div style={{ background: 'var(--color-white)', borderRadius: 'var(--radius-standard)', boxShadow: 'var(--shadow-card)', overflow: 'hidden', ...style }} {...rest}>
      {(title || action) && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--spacing-narrow-m)', padding: 'var(--spacing-narrow-l)', flexWrap: 'wrap' }}>
          {title && <h2 style={{ fontFamily: 'var(--font-manrope)', fontWeight: 'var(--font-weight-semibold)', fontSize: 'var(--font-size-title-large)', color: 'var(--color-text-blue)', margin: 0 }}>{title}</h2>}
          {action}
        </div>
      )}
      {children}
      {footer && (
        <div style={{ textAlign: 'center', padding: 'var(--spacing-narrow-m)' }}>
          {footer}
        </div>
      )}
    </div>
  );
}
