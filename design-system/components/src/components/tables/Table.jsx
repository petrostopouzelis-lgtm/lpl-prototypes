import React from 'react';

export function Table({ columns = [], rows = [], renderCell }) {
  return (
    <div style={{ background: '#fff', borderRadius: 'var(--radius-standard)', boxShadow: 'var(--shadow-card)', overflow: 'hidden' }}>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${columns.length}, 1fr)`, gap: 'var(--spacing-narrow-l)', alignItems: 'center', padding: '16px 24px', background: '#fff', fontFamily: 'var(--font-manrope)', fontWeight: 'var(--font-weight-semibold)', fontSize: 'var(--font-size-content)', color: 'var(--color-primary-full)', boxShadow: 'var(--shadow-table-header)' }}>
        {columns.map((c) => <div key={c}>{c}</div>)}
      </div>
      {rows.map((row, i) => (
        <div key={i} style={{ display: 'grid', gridTemplateColumns: `repeat(${columns.length}, 1fr)`, gap: 'var(--spacing-narrow-l)', alignItems: 'center', padding: '16px 24px', fontFamily: 'var(--font-inter)', fontSize: 'var(--font-size-content)', color: 'var(--color-black)', borderTop: '1px solid var(--color-light-gray)' }}>
          {columns.map((c, ci) => <div key={c}>{renderCell ? renderCell(row, c) : row[ci]}</div>)}
        </div>
      ))}
    </div>
  );
}
