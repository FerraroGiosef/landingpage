'use client';

import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const router = useRouter();
  return (
    <div style={{ fontFamily: 'Inter, -apple-system, sans-serif' }}>
      <div style={{ padding: '16px 16px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          onClick={() => router.push('/app')}
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: '#F5F0E8',
            border: '0.5px solid #C4B9A8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: 16,
            color: '#1A1614',
            flexShrink: 0,
            transition: 'all 0.15s ease',
          }}
        >
          ←
        </button>
      </div>

      <div style={{ padding: '24px 24px 40px', textAlign: 'center' }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>◯</div>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 20, fontWeight: 400, color: '#1A1614', marginBottom: 8 }}>Your profile</h1>
        <p style={{ fontSize: 13, color: '#8B7E71', marginBottom: 24, lineHeight: 1.6 }}>Save your allergen preferences for quick access. No account needed — your preferences stay on this device.</p>
        <button onClick={() => router.push('/app/allergens')} style={{ background: '#1A1614', color: '#FDFBF7', border: 'none', borderRadius: 10, padding: '12px 24px', fontSize: 13, cursor: 'pointer', transition: 'all 0.15s ease' }}>
          Set my dietary needs →
        </button>
      </div>
    </div>
  );
}
