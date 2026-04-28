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
          color: '#1E2220',
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
          color: '#4A5248',
          lineHeight: 1.6,
          maxWidth: 280,
          marginBottom: 28,
        }}
      >
        {"We'll let you know as soon as PlateMatch expands to your area. In the meantime, explore what's already available."}
      </div>

      <div
        style={{
          background: 'rgba(45,96,69,0.08)',
          border: '1px solid rgba(45,96,69,0.2)',
          borderRadius: 12,
          padding: '12px 20px',
          marginBottom: 28,
          fontSize: 11,
          color: '#2D6045',
          fontWeight: 600,
        }}
      >
        ✓ You&apos;re in — 2,400+ people waiting
      </div>

      <button
        onClick={() => router.push('/')}
        style={{
          background: '#A8D8B0',
          color: '#1E2220',
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
