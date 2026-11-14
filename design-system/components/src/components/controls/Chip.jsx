import React from 'react';

export function Chip({ active = false, children, onClick, style, ...rest }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '6px 14px', borderRadius: 999, cursor: 'pointer',
        fontFamily: 'var(--font-inter)', fontSize: 13,
        background: active ? 'var(--color-primary-light)' : 'var(--color-white)',
        border: `1px solid ${active ? 'var(--color-primary-full)' : 'var(--color-light-gray)'}`,
        color: active ? 'var(--color-white)' : 'var(--color-gray)',
        boxShadow: active ? 'var(--shadow-card)' : 'none',
        transition: 'var(--ease-fast)',
        ...style,
      }}
      {...rest}
    >
      {children}
    </button>
  );
}
