import React from 'react';

export function Input({ label, style, ...rest }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-narrow-s)' }}>
      {label && (
        <label style={{ fontFamily: 'var(--font-inter)', fontSize: 'var(--font-size-content)', color: 'var(--color-primary-full)' }}>
          {label}
        </label>
      )}
      <input
        style={{
          background: 'var(--color-white-gradient)',
          border: 'none',
          borderRadius: 'var(--radius-standard)',
          padding: 'var(--spacing-narrow-m)',
          fontFamily: 'var(--font-inter)',
          fontSize: 'var(--font-size-content)',
          color: 'var(--color-black)',
          boxShadow: 'var(--shadow-inner)',
          outline: 'none',
          width: '100%',
          transition: 'var(--ease-standard)',
          ...style,
        }}
        {...rest}
      />
    </div>
  );
}
