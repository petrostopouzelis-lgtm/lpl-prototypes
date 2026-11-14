import React from 'react';

export function Tabs({ tabs = [], active, onChange, style }) {
  return (
    <div style={{ display: 'flex', gap: 'var(--spacing-narrow-l)', borderBottom: '1px solid var(--color-light-gray)', ...style }}>
      {tabs.map((tab) => {
        const name = typeof tab === 'string' ? tab : tab.name;
        const count = typeof tab === 'string' ? undefined : tab.count;
        const isActive = name === active;
        return (
          <button
            key={name}
            onClick={() => onChange && onChange(name)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontFamily: 'var(--font-manrope)', fontWeight: 'var(--font-weight-semibold)',
              fontSize: 'var(--font-size-content)',
              color: isActive ? 'var(--color-text-blue)' : 'var(--color-gray)',
              padding: '0 0 var(--spacing-narrow-m)', position: 'relative',
              display: 'flex', alignItems: 'center', gap: 'var(--spacing-narrow-s)',
              transition: 'color 0.2s ease',
            }}
          >
            {name}
            {count != null && (
              <span style={{
                background: isActive ? 'var(--color-primary-light)' : 'var(--color-light-gray)',
                color: isActive ? 'var(--color-white)' : 'var(--color-black)',
                fontFamily: 'var(--font-inter)', fontWeight: 'var(--font-weight-semibold)', fontSize: 11,
                minWidth: 20, height: 20, padding: '0 6px', borderRadius: 10,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                transform: isActive ? 'scale(1.05)' : 'none', transition: 'all 0.25s ease',
              }}>{count}</span>
            )}
            {isActive && <span style={{ position: 'absolute', left: 0, right: 0, bottom: -1, height: 3, borderRadius: '3px 3px 0 0', background: 'var(--color-primary-gradient)' }} />}
          </button>
        );
      })}
    </div>
  );
}
