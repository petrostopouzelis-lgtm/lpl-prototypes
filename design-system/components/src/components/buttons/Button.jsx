import React from 'react';

const base = {
  border: 'none',
  borderRadius: 'var(--radius-pill)',
  padding: '8px 24px',
  fontFamily: 'var(--font-manrope)',
  fontWeight: 'var(--font-weight-semibold)',
  fontSize: 'var(--font-size-content)',
  lineHeight: 'var(--line-height-button)',
  cursor: 'pointer',
  transition: 'var(--ease-standard)',
  textDecoration: 'none',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 'var(--spacing-narrow-s)',
  boxShadow: 'var(--shadow-card)',
  textAlign: 'center',
};

const variants = {
  primary: { background: 'var(--color-primary-gradient)', color: 'var(--color-white)' },
  secondary: { background: 'var(--color-white)', color: 'var(--color-primary-full)' },
  danger: { background: 'var(--color-error-gradient)', color: 'var(--color-white)' },
  submit: { background: 'var(--color-disabled-gradient)', color: 'var(--color-white)' },
  ghost: { background: 'var(--color-white)', color: 'var(--color-primary-full)', border: '1px solid var(--color-light-gray)' },
};

export function Button({ variant = 'primary', disabled = false, fullWidth = false, icon, children, onClick, type = 'button', style, ...rest }) {
  const v = variants[variant] || variants.primary;
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        ...base,
        ...v,
        width: fullWidth ? '100%' : undefined,
        ...(disabled ? { background: 'var(--color-disabled-gradient)', color: 'var(--color-white)', cursor: 'not-allowed' } : null),
        ...style,
      }}
      {...rest}
    >
      {icon}
      {children}
    </button>
  );
}
