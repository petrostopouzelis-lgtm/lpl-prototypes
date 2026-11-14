import React from 'react';

export function SegmentedControl({ options = [], value, onChange, style }) {
  return (
    <div style={{ display: 'inline-flex', background: 'var(--color-white)', border: '1px solid var(--color-light-gray)', borderRadius: 50, padding: 4, boxShadow: 'var(--shadow-card)', flexShrink: 0, ...style }}>
      {options.map((opt) => {
        const name = typeof opt === 'string' ? opt : opt.name;
        const isActive = name === value;
        return (
          <button
            key={name}
            onClick={() => onChange && onChange(name)}
            style={{
              border: 'none', cursor: 'pointer',
              background: isActive ? 'var(--color-primary-gradient)' : 'none',
              boxShadow: isActive ? 'var(--shadow-card)' : 'none',
              fontFamily: 'var(--font-manrope)', fontWeight: 'var(--font-weight-semibold)', fontSize: 14,
              color: isActive ? 'var(--color-white)' : 'var(--color-gray)',
              padding: '8px 18px', borderRadius: 50, whiteSpace: 'nowrap',
              transition: 'color 0.28s ease, background 0.28s ease',
              display: 'inline-flex', alignItems: 'center', gap: 'var(--spacing-narrow-s)',
            }}
          >
            {name}
            {typeof opt !== 'string' && opt.price != null && (
              <span style={{
                fontFamily: 'var(--font-manrope)', fontWeight: 'var(--font-weight-bold)', fontSize: 13,
                padding: '1px 8px', borderRadius: 50,
                background: isActive ? 'rgba(255,255,255,0.28)' : 'var(--color-light-gray)',
                color: isActive ? 'var(--color-white)' : 'var(--color-black)',
              }}>{opt.price}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
