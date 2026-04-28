'use client';

import { DietFilter } from '@/lib/types';

interface FilterTileProps {
  filter: DietFilter;
  label: string;
  subtitle: string;
  icon: string;
  active: boolean;
  onToggle: (f: DietFilter) => void;
}

export default function FilterTile({ filter, label, subtitle, icon, active, onToggle }: FilterTileProps) {
  return (
    <button
      onClick={() => onToggle(filter)}
      style={{
        background: active ? 'rgba(45,53,48,0.95)' : '#FFFFFF',
        border: `1.5px solid ${active ? '#2D3530' : '#D4D8D0'}`,
        borderRadius: 14,
        padding: '14px 12px',
        minHeight: 56,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        width: '100%',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        transition: 'background 0.2s, border-color 0.2s',
        textAlign: 'left',
      }}
    >
      {active && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(168,216,176,0.06) 0%, transparent 60%)',
            pointerEvents: 'none',
          }}
        />
      )}
      <div
        style={{
          width: 38,
          height: 38,
          borderRadius: 10,
          background: active ? 'rgba(168,216,176,0.12)' : '#F0EFED',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 18,
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 11.5,
            fontWeight: 700,
            color: active ? '#A8D8B0' : '#1E2220',
            lineHeight: 1.3,
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontSize: 9.5,
            color: active ? 'rgba(168,216,176,0.6)' : '#8A9890',
            marginTop: 2,
          }}
        >
          {subtitle}
        </div>
      </div>
      <div
        style={{
          width: 18,
          height: 18,
          borderRadius: '50%',
          border: `1.5px solid ${active ? '#A8D8B0' : '#D4D8D0'}`,
          background: active ? '#A8D8B0' : 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          transition: 'background 0.2s, border-color 0.2s',
        }}
      >
        {active && (
          <span style={{ fontSize: 10, fontWeight: 800, color: '#1E2220', lineHeight: 1 }}>✓</span>
        )}
      </div>
    </button>
  );
}
