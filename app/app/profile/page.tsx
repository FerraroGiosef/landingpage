'use client';

import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const router = useRouter();
  return (
    <div style={{ fontFamily: 'Inter, -apple-system, sans-serif', padding: '40px 24px', textAlign: 'center' }}>
      <div style={{ fontSize: 40, marginBottom: 16 }}>◯</div>
      <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 20, fontWeight: 400, color: '#1A1614', marginBottom: 8 }}>Your profile</h1>
      <p style={{ fontSize: 13, color: '#8B7E71', marginBottom: 24, lineHeight: 1.6 }}>Save your allergen preferences for quick access. No account needed — your preferences stay on this device.</p>
      <button onClick={() => router.push('/app/allergens')} style={{ background: '#1A1614', color: '#FDFBF7', border: 'none', borderRadius: 10, padding: '12px 24px', fontSize: 13, cursor: 'pointer' }}>
        Set my dietary needs →
      </button>
    </div>
  );
}
