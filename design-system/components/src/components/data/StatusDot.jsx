import React from 'react';

export function StatusDot({ tone = 'primary', label, style }) {
  const tones = {
    primary: 'var(--color-primary-full)',
    green: 'var(--color-green-full)',
    red: 'var(--color-error-full)',
    yellow: 'var(--color-yellow-full)',
  };
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-inter)', fontSize: 14, color: 'var(--color-black)', ...style }}>
      <span style={{ width: 10, height: 10, borderRadius: '50%', background: tones[tone] || tones.primary, flexShrink: 0 }} />
      {label}
    </span>
  );
}
