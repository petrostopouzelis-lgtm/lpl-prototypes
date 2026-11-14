import React from 'react';

export function Avatar({ initials, size = 'md', gradient, style, ...rest }) {
  const sizes = { sm: { box: 34, font: 13 }, md: { box: 40, font: 15 }, lg: { box: 64, font: 22 } };
  const s = sizes[size] || sizes.md;
  return (
    <div
      style={{
        width: s.box, height: s.box, borderRadius: '50%',
        background: gradient || 'var(--color-primary-gradient)',
        color: 'var(--color-white)', fontFamily: 'var(--font-manrope)',
        fontWeight: 'var(--font-weight-bold)', fontSize: s.font,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        ...style,
      }}
      {...rest}
    >
      {initials}
    </div>
  );
}
