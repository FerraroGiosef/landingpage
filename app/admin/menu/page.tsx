'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

const CATEGORIES = [
  { label: 'Starters', count: 4 },
  { label: 'Mains', count: 12 },
  { label: 'Desserts', count: 5 },
  { label: 'Sides', count: 4 },
  { label: 'Drinks', count: 3 },
];

export default function MenuPage() {
  const router = useRouter();
  return (
    <div style={{ fontFamily: 'Inter, -apple-system, sans-serif' }}>
      <div style={{ padding: '16px 16px 0', borderBottom: '0.5px solid #C4B9A8' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={() => router.push('/admin')}
              style={{ width: 34, height: 34, borderRadius: '50%', background: '#F5F0E8', border: '0.5px solid #C4B9A8', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 16, color: '#1A1614', flexShrink: 0 }}
            >
              ←
            </button>
            <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 20, fontWeight: 400, color: '#1A1614', margin: 0 }}>Menu editor</h1>
          </div>
          <Link href="/admin/menu/import" style={{ background: '#C8553A', color: '#FDFBF7', borderRadius: 8, padding: '8px 14px', fontSize: 12, textDecoration: 'none' }}>
            Import menu
          </Link>
        </div>
      </div>
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {CATEGORIES.map((cat) => (
          <button key={cat.label} onClick={() => router.push('/admin/menu/import?step=review')} style={{ background: '#FFFFFF', border: '0.5px solid #C4B9A8', borderRadius: 12, padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', width: '100%', textAlign: 'left' }}>
            <div style={{ fontFamily: 'Georgia, serif', fontSize: 15, color: '#1A1614' }}>{cat.label}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 12, color: '#8B7E71' }}>{cat.count} dishes</span>
              <span style={{ color: '#C4B9A8', fontSize: 14 }}>›</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
