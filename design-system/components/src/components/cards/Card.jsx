import React from 'react';

const variants = {
  base: { background: 'var(--color-white)', color: 'var(--color-black)' },
  primary: { background: 'var(--color-primary-gradient)', color: '#fff' },
  secondary: { background: 'var(--color-secondary-gradient)', color: '#fff' },
};

export function Card({ variant = 'base', hoverable = false, children, style, ...rest }) {
  const [hover, setHover] = React.useState(false);
  const v = variants[variant] || variants.base;
  return (
    <div
      onMouseEnter={() => hoverable && setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        borderRadius: 'var(--radius-standard)',
        boxShadow: hoverable && hover ? 'var(--shadow-card-hover)' : 'var(--shadow-card)',
        padding: 'var(--spacing-narrow-l)',
        transition: 'box-shadow 0.3s ease, transform 0.3s ease',
        transform: hoverable && hover ? 'translateY(-2px)' : 'none',
        cursor: hoverable ? 'pointer' : 'default',
        ...v,
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
