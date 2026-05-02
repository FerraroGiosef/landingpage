'use client';

import { useRouter } from 'next/navigation';

export default function SavedPage() {
  const router = useRouter();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        padding: '32px 24px',
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: 40, marginBottom: 16 }}>🤍</div>
      <div style={{ fontSize: 16, fontWeight: 800, color: '#1A1614', marginBottom: 8, letterSpacing: '-0.3px' }}>
        No saved restaurants yet
      </div>
      <div style={{ fontSize: 12, color: '#8B7E71', lineHeight: 1.6, maxWidth: 240, marginBottom: 24 }}>
        Tap the heart icon on any restaurant to save it here for easy access.
      </div>
      <button
        onClick={() => router.push('/')}
        style={{
          background: '#1A1614',
          color: '#FDFBF7',
          border: 'none',
          borderRadius: 14,
          padding: '13px 24px',
          fontSize: 12,
          fontWeight: 800,
          cursor: 'pointer',
        }}
      >
        Explore restaurants →
      </button>
    </div>
  );
}
