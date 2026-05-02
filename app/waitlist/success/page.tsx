'use client';

import { useRouter } from 'next/navigation';

export default function WaitlistSuccessPage() {
  const router = useRouter();

  return (
    <div
      style={{
        minHeight: '70vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 24px',
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: 52, marginBottom: 16 }}>🎉</div>
      <div
        style={{
          fontSize: 22,
          fontWeight: 800,
          color: '#1A1614',
          letterSpacing: '-0.4px',
          marginBottom: 12,
          lineHeight: 1.2,
        }}
      >
        {"You're on the list!"}
      </div>
      <div
        style={{
          fontSize: 12,
          color: '#8B7E71',
          lineHeight: 1.6,
          maxWidth: 280,
          marginBottom: 28,
        }}
      >
        {"We'll let you know as soon as PlateMatch expands to your area. In the meantime, explore what's already available."}
      </div>

      <div
        style={{
          background: 'rgba(200,85,58,0.08)',
          border: '1px solid rgba(200,85,58,0.2)',
          borderRadius: 12,
          padding: '12px 20px',
          marginBottom: 28,
          fontSize: 11,
          color: '#C8553A',
          fontWeight: 600,
        }}
      >
        ✓ You&apos;re in — 2,400+ people waiting
      </div>

      <button
        onClick={() => router.push('/')}
        style={{
          background: '#1A1614',
          color: '#FDFBF7',
          border: 'none',
          borderRadius: 14,
          padding: '14px 28px',
          fontSize: 13,
          fontWeight: 800,
          cursor: 'pointer',
        }}
      >
        Explore restaurants →
      </button>
    </div>
  );
}
