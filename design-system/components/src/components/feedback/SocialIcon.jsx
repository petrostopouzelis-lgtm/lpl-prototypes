import React, { useState } from 'react';

export function SocialIcon({ defaultSrc, hoverSrc, label, href = '#', size = 24 }) {
  const [hover, setHover] = useState(false);
  return (
    <a
      href={href}
      aria-label={label}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: size, height: size, position: 'relative', display: 'inline-block', cursor: 'pointer',
        transition: 'var(--ease-standard)',
        transform: hover ? 'scale(1.2)' : 'none',
        filter: hover ? 'drop-shadow(0px 2px 4px rgba(0,0,0,0.2))' : 'none',
      }}
    >
      <img src={defaultSrc} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', opacity: hover ? 0 : 1, transition: 'opacity 0.3s ease' }} />
      {hoverSrc && <img src={hoverSrc} alt="" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'contain', opacity: hover ? 1 : 0, transition: 'opacity 0.3s ease' }} />}
    </a>
  );
}
