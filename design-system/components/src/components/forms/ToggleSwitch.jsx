import React from 'react';

export function ToggleSwitch({ on = true, onChange, label }) {
  return (
    <label style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--spacing-narrow-s)', cursor: 'pointer' }}>
      <button
        type="button"
        onClick={() => onChange && onChange(!on)}
        style={{
          position: 'relative', width: 36, height: 20, border: 'none', borderRadius: 'var(--radius-standard)',
          padding: 0, cursor: 'pointer', overflow: 'hidden', transition: 'box-shadow 0.25s ease',
          background: on ? 'var(--color-primary-gradient)' : 'var(--color-primary-light)',
          boxShadow: on ? '0px 0px 2px 0px rgba(0,0,0,0.25)' : 'var(--shadow-inner)',
        }}
      >
        <span
          style={{
            content: "''", width: 14, height: 14, background: '#fff', borderRadius: '50%',
            transition: 'transform 0.25s ease', position: 'absolute', top: 3, right: 3,
            boxShadow: '0px 1px 3px rgba(0,0,0,0.2)',
            transform: on ? 'scale(1.05)' : 'translateX(-16px) scale(0.95)',
            display: 'block',
          }}
        />
      </button>
      {label && <span style={{ fontFamily: 'var(--font-inter)', fontWeight: 'var(--font-weight-light)', fontSize: 'var(--font-size-secondary)', color: 'var(--color-black)' }}>{label}</span>}
    </label>
  );
}
