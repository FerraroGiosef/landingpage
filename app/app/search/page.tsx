'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { restaurants, getDishesByRestaurant } from '@/lib/data/restaurants';
import { getCompatibleCount } from '@/lib/scoring';

export default function SearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const results = query.trim()
    ? restaurants.filter((r) =>
        r.name.toLowerCase().includes(query.toLowerCase()) ||
        r.cuisine.toLowerCase().includes(query.toLowerCase()) ||
        r.location.toLowerCase().includes(query.toLowerCase())
      )
    : restaurants;

  return (
    <div style={{ fontFamily: 'Inter, -apple-system, sans-serif', padding: '20px 16px' }}>
      <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 20, fontWeight: 400, color: '#1A1614', margin: '0 0 16px', letterSpacing: '-0.3px' }}>Search</h1>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search restaurants, cuisine, area…"
        autoFocus
        style={{ width: '100%', background: '#F5F0E8', border: '0.5px solid #C4B9A8', borderRadius: 10, padding: '12px 14px', fontSize: 13, color: '#1A1614', outline: 'none', fontFamily: 'inherit', marginBottom: 16, boxSizing: 'border-box' }}
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {results.map((r) => (
          <button
            key={r.id}
            onClick={() => router.push(`/app/restaurant/${r.slug}`)}
            style={{ background: '#FFFFFF', border: '0.5px solid #C4B9A8', borderRadius: 12, padding: '14px', textAlign: 'left', cursor: 'pointer', width: '100%' }}
          >
            <div style={{ fontFamily: 'Georgia, serif', fontSize: 14, color: '#1A1614', marginBottom: 3 }}>{r.name}</div>
            <div style={{ fontSize: 12, color: '#8B7E71' }}>{r.cuisine} · {r.location} · {r.distance}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
