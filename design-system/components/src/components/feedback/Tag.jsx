import React from 'react';

const colors = {
  secondary: { bg: 'var(--color-secondary-light)', border: 'var(--color-secondary-full)', color: '#fff' },
  primary: { bg: 'var(--color-primary-light)', border: 'var(--color-primary-full)', color: '#fff' },
  yellow: { bg: 'var(--color-facet-yellow-light)', border: 'var(--color-facet-yellow-full)', color: 'var(--color-black)' },
  green: { bg: 'var(--color-facet-green-light)', border: 'var(--color-facet-green-full)', color: '#fff' },
  magenta: { bg: 'var(--color-facet-magenta-light)', border: 'var(--color-facet-magenta-full)', color: '#fff' },
  purple: { bg: 'var(--color-facet-purple-light)', border: 'var(--color-facet-purple-full)', color: '#fff' },
  red: { bg: 'var(--color-facet-red-light)', border: 'var(--color-facet-red-full)', color: '#fff' },
};

export function Tag({ color = 'secondary', children, style, ...rest }) {
  const c = colors[color] || colors.secondary;
  return (
    <span
      style={{
        background: c.bg,
        border: `1px solid ${c.border}`,
        color: c.color,
        fontFamily: 'var(--font-inter)',
        fontWeight: 'var(--font-weight-bold)',
        fontSize: 'var(--font-size-secondary)',
        padding: '4px 12px',
        borderRadius: 'var(--radius-standard)',
        boxShadow: '0px 1px 2px rgba(0,0,0,0.1)',
        display: 'inline-block',
        ...style,
      }}
      {...rest}
    >
      {children}
    </span>
  );
}
