import React from 'react';

export function Checkbox({ checked = false, onChange, label }) {
  return (
    <label style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--spacing-narrow-s)', cursor: 'pointer', fontFamily: 'var(--font-inter)', fontSize: 'var(--font-size-content)', color: 'var(--color-black)' }}>
      <span
        onClick={() => onChange && onChange(!checked)}
        style={{
          position: 'relative', width: 32, height: 32, background: checked ? 'var(--color-primary-gradient)' : '#fff',
          borderRadius: 'var(--radius-small)', boxShadow: 'var(--shadow-card)', transition: 'var(--ease-standard)',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}
      >
        {checked && <span style={{ width: 12, height: 12, background: '#fff', borderRadius: '50%' }} />}
      </span>
      {label}
    </label>
  );
}
