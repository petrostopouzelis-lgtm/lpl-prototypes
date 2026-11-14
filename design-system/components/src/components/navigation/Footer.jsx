import React, { useState, useEffect, useRef } from 'react';

// Measures the footer's own root rather than the window, so the column count is correct
// inside constrained columns and preview frames alike.
function useContainerWidth(ref, fallback = 1440) {
  const [w, setW] = useState(fallback);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = (next) => { if (next > 0) setW(next); };
    measure(el.getBoundingClientRect().width);
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) measure(entry.contentRect.width);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return w;
}

function SocialLink({ defaultSrc, hoverSrc, label, href = '#' }) {
  const [hover, setHover] = useState(false);
  return (
    <a
      href={href} aria-label={label}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ width: 24, height: 24, position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.3s ease', transform: hover ? 'scale(1.1)' : 'none' }}
    >
      <img src={defaultSrc} alt="" style={{ width: 24, height: 24, display: 'block', opacity: hover ? 0 : 1, transition: 'opacity 0.3s ease' }} />
      {hoverSrc && <img src={hoverSrc} alt="" style={{ position: 'absolute', top: 0, left: 0, width: 24, height: 24, display: 'block', opacity: hover ? 1 : 0, transition: 'opacity 0.3s ease' }} />}
    </a>
  );
}

export function Footer({ logo, tagline, social = [], columns = [], impressum, legalLinks = [], copyright, onNavigate }) {
  const rootRef = useRef(null);
  const w = useContainerWidth(rootRef);
  const narrow = w < 1225;
  const stacked = w < 768;

  const linkStyle = { color: '#ffffff', textDecoration: 'none', fontFamily: 'var(--font-inter)', fontWeight: 'var(--font-weight-regular)', fontSize: 'var(--font-size-content)', lineHeight: 'var(--line-height-normal)', transition: 'opacity 0.3s ease', cursor: 'pointer' };

  return (
    <footer ref={rootRef} style={{ background: 'var(--color-primary-gradient)', color: '#ffffff', padding: stacked ? 'var(--spacing-standard-m) 0 var(--spacing-narrow-l)' : 'var(--spacing-standard-l) 0 var(--spacing-narrow-l)', position: 'relative', zIndex: 10 }}>
      <div style={{ width: '100%', maxWidth: 1440, margin: '0 auto', padding: stacked ? '0 var(--spacing-narrow-l)' : narrow ? '0 var(--spacing-standard-s)' : '0 96px', display: 'flex', flexDirection: 'column', gap: stacked ? 'var(--spacing-narrow-l)' : 'var(--spacing-standard-s)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: stacked ? '1fr' : narrow ? '1fr 1fr' : '1.4fr 1fr 1fr 1fr 1.2fr', gap: stacked ? 'var(--spacing-narrow-l)' : 'var(--spacing-standard-s)', alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-narrow-l)', maxWidth: narrow ? 'none' : 320, gridColumn: narrow && !stacked ? '1 / -1' : undefined }}>
            {logo && (
              <div style={{ height: 48, width: 'auto', maxWidth: 220 }}>
                <img src={logo} alt="" style={{ height: '100%', width: 'auto', maxWidth: '100%', objectFit: 'contain', display: 'block', filter: 'brightness(0) invert(1)' }} />
              </div>
            )}
            {tagline && <p style={{ fontFamily: 'var(--font-inter)', fontSize: 'var(--font-size-content)', lineHeight: 'var(--line-height-normal)', color: '#ffffff', margin: 0 }}>{tagline}</p>}
            {social.length > 0 && (
              <div style={{ display: 'flex', gap: 'var(--spacing-narrow-m)', flexWrap: 'wrap', alignItems: 'center' }}>
                {social.map((s) => <SocialLink key={s.label} {...s} />)}
              </div>
            )}
          </div>

          {columns.map((col) => (
            <div key={col.heading} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-narrow-m)' }}>
              <h3 style={{ fontFamily: 'var(--font-manrope)', fontWeight: 'var(--font-weight-semibold)', fontSize: 'var(--font-size-content)', lineHeight: 'var(--line-height-button)', color: '#ffffff', margin: 0 }}>{col.heading}</h3>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 'var(--spacing-narrow-s)' }}>
                {(col.links || []).map((link) => (
                  <li key={link}><a onClick={() => onNavigate && onNavigate(link)} style={linkStyle}>{link}</a></li>
                ))}
              </ul>
            </div>
          ))}

          {impressum && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-narrow-s)', fontFamily: 'var(--font-inter)', fontWeight: 'var(--font-weight-regular)', fontSize: 'var(--font-size-secondary)', lineHeight: 'var(--line-height-normal)', color: '#ffffff' }}>
              {impressum.title && <strong style={{ fontFamily: 'var(--font-manrope)', fontWeight: 'var(--font-weight-semibold)', fontSize: 'var(--font-size-content)', display: 'block', marginBottom: 4 }}>{impressum.title}</strong>}
              {(impressum.lines || []).map((line) => <p key={line} style={{ margin: 0, color: '#ffffff' }}>{line}</p>)}
            </div>
          )}
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.28)', paddingTop: 'var(--spacing-narrow-l)', display: 'flex', alignItems: stacked ? 'flex-start' : 'center', justifyContent: 'space-between', gap: 'var(--spacing-narrow-l)', flexWrap: 'wrap', flexDirection: stacked ? 'column' : 'row' }}>
          <div style={{ display: 'flex', gap: 'var(--spacing-narrow-l)', flexWrap: 'wrap' }}>
            {legalLinks.map((link) => (
              <a key={link} onClick={() => onNavigate && onNavigate(link)} style={{ color: '#ffffff', textDecoration: 'none', fontFamily: 'var(--font-inter)', fontSize: 'var(--font-size-secondary)', transition: 'opacity 0.3s ease', cursor: 'pointer' }}>{link}</a>
            ))}
          </div>
          {copyright && <p style={{ fontFamily: 'var(--font-inter)', fontWeight: 'var(--font-weight-light)', fontSize: 'var(--font-size-secondary)', color: '#ffffff', textAlign: stacked ? 'left' : 'right', letterSpacing: '0.24px', lineHeight: 'var(--line-height-normal)', margin: 0 }}>{copyright}</p>}
        </div>
      </div>
    </footer>
  );
}
