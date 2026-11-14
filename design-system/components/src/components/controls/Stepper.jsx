import React from 'react';

export function Stepper({ steps = [], current = 0, style }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', ...style }}>
      {steps.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <React.Fragment key={label}>
            {i > 0 && <div style={{ flex: 1, height: 3, background: i <= current ? 'var(--color-primary-full)' : 'var(--color-light-gray)', borderRadius: 2, margin: '18px 8px 0', transition: 'background 0.25s ease' }} />}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flexShrink: 0 }}>
              <div style={{
                width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: (done || active) ? 'var(--color-primary-gradient)' : 'var(--color-light-gray)',
                color: (done || active) ? 'var(--color-white)' : 'var(--color-gray)',
                fontFamily: 'var(--font-manrope)', fontWeight: 'var(--font-weight-bold)', transition: 'all 0.25s ease',
              }}>{i + 1}</div>
              <span style={{
                fontFamily: 'var(--font-inter)', fontSize: 14,
                color: (done || active) ? 'var(--color-primary-full)' : 'var(--color-gray)',
                fontWeight: (done || active) ? 'var(--font-weight-semibold)' : 'var(--font-weight-regular)',
              }}>{label}</span>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}
