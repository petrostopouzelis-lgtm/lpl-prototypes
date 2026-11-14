import React from 'react';

export function ProgressBar({ value = 0, max = 100, label, style }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-narrow-s)', ...style }}>
      <div style={{ flex: 1, height: 6, background: 'var(--color-light-gray)', borderRadius: 3, overflow: 'hidden', minWidth: 60 }}>
        <div style={{ height: '100%', width: `${pct}%`, background: 'var(--color-primary-gradient)', borderRadius: 3 }} />
      </div>
      {label && <span style={{ fontFamily: 'var(--font-inter)', fontSize: 'var(--font-size-secondary)', color: 'var(--color-gray)', whiteSpace: 'nowrap' }}>{label}</span>}
    </div>
  );
}
