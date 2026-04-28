'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UK_ALLERGENS } from '@/lib/scoring';

const DIET_PREFS = [
  { key: 'vegan', label: 'Vegan', emoji: '🌱' },
  { key: 'vegetarian', label: 'Vegetarian', emoji: '🥦' },
];

const ALLERGEN_DISPLAY = UK_ALLERGENS.map((a) => ({ key: a.key, name: a.name, emoji: a.emoji }));

export default function AllergensPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const saved = sessionStorage.getItem('pm_filters');
    if (saved) {
      try { setSelected(JSON.parse(saved)); } catch {}
    }
  }, []);

  function toggle(key: string) {
    setSelected((prev) => prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]);
  }

  function handleConfirm() {
    sessionStorage.setItem('pm_filters', JSON.stringify(selected));
    router.back();
  }

  const filteredAllergens = search.trim()
    ? ALLERGEN_DISPLAY.filter((a) => a.name.toLowerCase().includes(search.toLowerCase()))
    : ALLERGEN_DISPLAY;

  return (
    <div style={{ fontFamily: 'Inter, -apple-system, sans-serif', paddingBottom: 80 }}>
      {/* Header */}
      <div style={{ padding: '16px 16px 0', borderBottom: '0.5px solid #C4B9A8', background: '#FDFBF7' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <button onClick={() => router.back()} style={{ width: 36, height: 36, borderRadius: '50%', background: '#F5F0E8', border: '0.5px solid #C4B9A8', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 16, flexShrink: 0 }}>←</button>
          <div>
            <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 20, fontWeight: 400, color: '#1A1614', margin: 0, letterSpacing: '-0.3px' }}>Personalise your search</h1>
          </div>
        </div>
        <p style={{ fontSize: 13, color: '#8B7E71', margin: '0 0 14px', lineHeight: 1.5 }}>
          Select allergens or dietary needs. We&apos;ll show you compatible dishes at every restaurant.
        </p>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search allergens…"
          style={{ width: '100%', background: '#F5F0E8', border: '0.5px solid #C4B9A8', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#1A1614', outline: 'none', fontFamily: 'inherit', marginBottom: 14, boxSizing: 'border-box' }}
        />
      </div>

      <div style={{ padding: '16px' }}>
        {/* Dietary preferences */}
        {!search.trim() && (
          <>
            <div className="label-upper" style={{ color: '#8B7E71', marginBottom: 12 }}>Dietary preferences</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 24 }}>
              {DIET_PREFS.map((pref) => {
                const active = selected.includes(pref.key);
                return (
                  <button
                    key={pref.key}
                    onClick={() => toggle(pref.key)}
                    style={{ background: active ? '#1A1614' : '#FFFFFF', border: `0.5px solid ${active ? '#1A1614' : '#C4B9A8'}`, borderRadius: 12, padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, cursor: 'pointer' }}
                  >
                    <span style={{ fontSize: 28 }}>{pref.emoji}</span>
                    <span style={{ fontSize: 12, color: active ? '#FDFBF7' : '#1A1614', fontWeight: 500 }}>{pref.label}</span>
                  </button>
                );
              })}
            </div>
            <div className="label-upper" style={{ color: '#8B7E71', marginBottom: 12 }}>Common allergens</div>
          </>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
          {filteredAllergens.map((allergen) => {
            const active = selected.includes(allergen.key);
            return (
              <button
                key={allergen.key}
                onClick={() => toggle(allergen.key)}
                style={{
                  background: active ? '#1A1614' : '#FFFFFF',
                  border: `0.5px solid ${active ? '#1A1614' : '#C4B9A8'}`,
                  borderRadius: 12,
                  padding: '14px 8px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 6,
                  cursor: 'pointer',
                }}
              >
                <span style={{ fontSize: 24 }}>{allergen.emoji}</span>
                <span style={{ fontSize: 10.5, color: active ? '#FDFBF7' : '#1A1614', fontWeight: 500, textAlign: 'center', lineHeight: 1.3 }}>{allergen.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Fixed bottom bar */}
      <div style={{ position: 'fixed', bottom: 68, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 430, padding: '12px 16px', background: '#FDFBF7', borderTop: '0.5px solid #C4B9A8', display: 'flex', alignItems: 'center', gap: 12, boxSizing: 'border-box' }}>
        <span style={{ fontSize: 12, color: '#8B7E71', flex: 1 }}>
          {selected.length > 0 ? `${selected.length} filter${selected.length > 1 ? 's' : ''} selected` : 'No filters'}
        </span>
        {selected.length > 0 && (
          <button onClick={() => setSelected([])} style={{ fontSize: 12, color: '#C8553A', background: 'none', border: 'none', cursor: 'pointer', padding: '8px' }}>Clear all</button>
        )}
        <button
          onClick={handleConfirm}
          style={{ background: '#1A1614', color: '#FDFBF7', border: 'none', borderRadius: 10, padding: '12px 24px', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0 }}
        >
          Show compatible restaurants →
        </button>
      </div>
    </div>
  );
}
