import React from 'react';

export function StatCard({ label, value, sub, subTone, icon, plain = false, style, ...rest }) {
  const tones = { up: 'var(--color-green-full)', warn: 'var(--color-secondary-full)' };
  return (
    <div
      style={{
        background: plain ? 'transparent' : 'var(--color-white)',
        borderRadius: plain ? 0 : 'var(--radius-standard)',
        boxShadow: plain ? 'none' : 'var(--shadow-card)',
        padding: plain ? '2px var(--spacing-standard-m)' : 'var(--spacing-narrow-l)',
        transition: 'var(--ease-standard)',
        ...style,
      }}
      {...rest}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', minWidth: 0 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--spacing-narrow-s)', marginBottom: 'var(--spacing-narrow-m)' }}>
          {icon && <div style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</div>}
          <span style={{ fontFamily: 'var(--font-manrope)', fontSize: 'var(--font-size-title-large)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-blue)', lineHeight: 'var(--line-height-tight)' }}>{label}</span>
        </div>
        <span style={{ fontFamily: 'var(--font-manrope)', fontWeight: 'var(--font-weight-bold)', fontSize: 30, color: 'var(--color-text-blue)', lineHeight: 1.1 }}>{value}</span>
        {sub && <span style={{ fontFamily: 'var(--font-inter)', fontSize: 'var(--font-size-secondary)', color: tones[subTone] || 'var(--color-gray)', marginTop: 'var(--spacing-narrow-s)' }}>{sub}</span>}
      </div>
    </div>
  );
}
