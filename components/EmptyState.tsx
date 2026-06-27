'use client';

import { useRouter } from 'next/navigation';

export default function EmptyState() {
  const router = useRouter();

  return (
    <div
      style={{
        background: '#1A1614',
        borderRadius: 12,
        margin: '10px 16px',
        padding: '12px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}
    >
      <div
        style={{
          width: 34,
          height: 34,
          borderRadius: '50%',
          background: 'rgba(253,251,247,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <span style={{ fontSize: 16, lineHeight: 1 }}>🍽</span>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            fontFamily: 'Georgia, serif',
            fontSize: 13,
            color: '#FDFBF7',
            margin: '0 0 2px',
            lineHeight: 1.3,
          }}
        >
          Find what you can eat
        </p>
        <p style={{ fontSize: 10, color: '#8B7E71', margin: 0 }}>
          Set your allergens to filter every menu.
        </p>
      </div>
      <button
        type="button"
        onClick={() => router.push('/app/allergens')}
        style={{
          background: '#C8553A',
          color: '#FDFBF7',
          border: 'none',
          borderRadius: 7,
          padding: '8px 12px',
          fontSize: 10,
          fontWeight: 500,
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          fontFamily: 'inherit',
        }}
      >
        Start →
      </button>
    </div>
  );
}
