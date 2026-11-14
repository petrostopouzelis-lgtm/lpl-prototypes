import React from 'react';

export function AppSidebar({ brandLogo, brandName, brandSub, sections = [], activeItem, onNavigate, org, style }) {
  return (
    <aside
      style={{
        width: 'var(--sidebar-width)', background: 'var(--color-white)',
        borderRadius: 'var(--radius-standard)', boxShadow: 'var(--shadow-card)',
        display: 'flex', flexDirection: 'column', padding: 'var(--spacing-narrow-l)',
        overflowY: 'auto', flexShrink: 0, ...style,
      }}
    >
      <a style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-narrow-m)', padding: '8px 8px 24px', textDecoration: 'none', flexShrink: 0 }}>
        {brandLogo && <img src={brandLogo} alt="" style={{ width: 44, height: 'auto', flexShrink: 0 }} />}
        <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
          <span style={{ fontFamily: 'var(--font-manrope)', fontWeight: 'var(--font-weight-bold)', fontSize: 15, color: 'var(--color-text-blue)' }}>{brandName}</span>
          {brandSub && <span style={{ fontFamily: 'var(--font-inter)', fontWeight: 'var(--font-weight-light)', fontSize: 'var(--font-size-secondary)', letterSpacing: '0.5px', textTransform: 'uppercase', color: 'var(--color-secondary-full)' }}>{brandSub}</span>}
        </span>
      </a>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-narrow-xs)', flex: 1 }}>
        {sections.map((section) => (
          <React.Fragment key={section.label || 'main'}>
            {section.label && (
              <div style={{ fontFamily: 'var(--font-inter)', fontWeight: 'var(--font-weight-semibold)', fontSize: 11, letterSpacing: '0.6px', textTransform: 'uppercase', color: 'var(--color-gray)', padding: '16px 16px 8px' }}>
                {section.label}
              </div>
            )}
            {(section.items || []).map((item) => {
              const active = item.name === activeItem;
              return (
                <a
                  key={item.name}
                  onClick={() => onNavigate && onNavigate(item.name)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 'var(--spacing-narrow-m)',
                    padding: '8px 16px', borderRadius: 40, fontFamily: 'var(--font-manrope)',
                    fontWeight: 'var(--font-weight-semibold)', fontSize: 'var(--font-size-content)',
                    whiteSpace: 'nowrap', cursor: 'pointer', transition: 'all 0.25s ease',
                    color: active ? 'var(--color-white)' : 'var(--color-primary-full)',
                    background: active ? 'var(--color-primary-gradient)' : 'none',
                    boxShadow: active ? 'var(--shadow-card)' : 'none',
                  }}
                >
                  {item.icon}
                  {item.name}
                  {item.badge != null && (
                    <span style={{
                      marginLeft: 'auto', background: active ? 'rgba(255,255,255,0.25)' : 'var(--color-secondary-gradient)',
                      color: 'var(--color-white)', fontFamily: 'var(--font-inter)', fontWeight: 'var(--font-weight-bold)',
                      fontSize: 11, minWidth: 20, height: 20, padding: '0 6px', borderRadius: 10,
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    }}>{item.badge}</span>
                  )}
                </a>
              );
            })}
          </React.Fragment>
        ))}
      </nav>

      {org && (
        <div style={{ flexShrink: 0, marginTop: 'var(--spacing-narrow-l)', paddingTop: 'var(--spacing-narrow-l)', borderTop: '1px solid var(--color-light-gray)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-narrow-m)' }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--color-primary-gradient)', color: 'var(--color-white)', fontFamily: 'var(--font-manrope)', fontWeight: 'var(--font-weight-bold)', fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {org.initials}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2, minWidth: 0 }}>
            <span style={{ fontFamily: 'var(--font-manrope)', fontWeight: 'var(--font-weight-semibold)', fontSize: 14, color: 'var(--color-black)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{org.name}</span>
            <span style={{ fontSize: 'var(--font-size-secondary)', color: 'var(--color-gray)' }}>{org.plan}</span>
          </div>
        </div>
      )}
    </aside>
  );
}
