import React from 'react';

export function EmptyState({ title, description, action, style }) {
  return (
    <div style={{ textAlign: 'center', padding: 'var(--spacing-standard-l) var(--spacing-narrow-l)', color: 'var(--color-gray)', ...style }}>
      {title && <h3 style={{ fontFamily: 'var(--font-manrope)', fontWeight: 'var(--font-weight-semibold)', fontSize: 'var(--font-size-content)', color: 'var(--color-black)', marginBottom: 'var(--spacing-narrow-s)' }}>{title}</h3>}
      {description && <p style={{ fontFamily: 'var(--font-inter)', fontSize: 14, marginBottom: action ? 'var(--spacing-narrow-l)' : 0 }}>{description}</p>}
      {action}
    </div>
  );
}
