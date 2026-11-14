import React, { useState, useRef, useEffect } from 'react';

export function Select({ label, options = [], value, onChange, placeholder = 'Select…' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, []);
  return (
    <div ref={ref} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-narrow-s)', position: 'relative', fontFamily: 'var(--font-inter)' }}>
      {label && <label style={{ fontSize: 'var(--font-size-content)', color: 'var(--color-primary-full)' }}>{label}</label>}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        style={{
          background: 'var(--color-primary-gradient)', color: '#fff', border: 'none',
          borderRadius: 'var(--radius-standard)', padding: '8px 16px', fontFamily: 'var(--font-inter)',
          fontSize: 'var(--font-size-content)', cursor: 'pointer', boxShadow: 'var(--shadow-card)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, width: '100%',
        }}
      >
        {value || placeholder}
        <span>▾</span>
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, background: '#fff', borderRadius: 'var(--radius-standard)',
          boxShadow: 'var(--shadow-card)', padding: 8, zIndex: 10, marginTop: 4, minWidth: 180,
        }}>
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => { onChange && onChange(opt); setOpen(false); }}
              style={{
                display: 'block', width: '100%', padding: '8px 16px', background: 'none', border: 'none',
                textAlign: 'left', fontFamily: 'var(--font-inter)', fontSize: 'var(--font-size-content)',
                color: 'var(--color-primary-full)', cursor: 'pointer', borderRadius: 'var(--radius-small)',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-primary-light)'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--color-primary-full)'; }}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
