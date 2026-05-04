'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { restaurants, getDishesByRestaurant } from '@/lib/data/restaurants';
import { filterMatchesDish, getCompatibleCount } from '@/lib/scoring';
import { analytics } from '@/lib/analytics';

interface Profile {
  id: string;
  name: string;
  filters: string[];
}

const ALLERGEN_PILLS = [
  { key: 'gluten', label: 'Gluten-free' },
  { key: 'milk', label: 'Dairy-free' },
  { key: 'peanuts', label: 'Peanut-free' },
  { key: 'treeNuts', label: 'Nut-free' },
  { key: 'vegan', label: 'Vegan' },
  { key: 'vegetarian', label: 'Vegetarian' },
];

const AVATAR_COLORS = ['#C8553A', '#8B7E71', '#6B8E6F', '#5B7BA8'];

export default function GroupPage() {
  const router = useRouter();
  const [profiles, setProfiles] = useState<Profile[]>([
    { id: '1', name: 'You', filters: [] },
    { id: '2', name: 'Guest 2', filters: [] },
  ]);
  const [showResults, setShowResults] = useState(false);

  function addProfile() {
    if (profiles.length >= 6) return;
    setProfiles((prev) => [...prev, { id: Date.now().toString(), name: `Guest ${prev.length + 1}`, filters: [] }]);
  }

  function removeProfile(id: string) {
    if (profiles.length <= 2) return;
    setProfiles((prev) => prev.filter((p) => p.id !== id));
  }

  function toggleFilter(profileId: string, filter: string) {
    setProfiles((prev) => prev.map((p) => {
      if (p.id !== profileId) return p;
      return { ...p, filters: p.filters.includes(filter) ? p.filters.filter((f) => f !== filter) : [...p.filters, filter] };
    }));
  }

  function updateName(profileId: string, name: string) {
    setProfiles((prev) => prev.map((p) => p.id === profileId ? { ...p, name } : p));
  }

  function openRestaurant(slug: string) {
    sessionStorage.setItem('pm_group_profiles', JSON.stringify(profiles));
    router.push(`/app/restaurant/${slug}?filters=${combinedFilters.join(',')}`);
  }

  const combinedFilters = Array.from(new Set(profiles.flatMap((p) => p.filters)));

  const rankedRestaurants = restaurants
    .map((r) => {
      const dishes = getDishesByRestaurant(r.id);
      const perPerson = profiles.map((p) => ({
        name: p.name,
        count: getCompatibleCount(dishes, p.filters),
      }));
      const minCount = Math.min(...perPerson.map((p) => p.count));
      return { ...r, perPerson, minCount };
    })
    .sort((a, b) => b.minCount - a.minCount);

  if (showResults) {
    return (
      <div style={{ fontFamily: 'Inter, -apple-system, sans-serif' }}>
        <div style={{ padding: '16px 16px 0', borderBottom: '0.5px solid #C4B9A8', background: '#FDFBF7', position: 'sticky', top: 0, zIndex: 50 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <button onClick={() => setShowResults(false)} style={{ width: 36, height: 36, borderRadius: '50%', background: '#F5F0E8', border: '0.5px solid #C4B9A8', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 16, flexShrink: 0 }}>←</button>
            <div>
              <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 20, fontWeight: 400, color: '#1A1614', margin: 0 }}>Dine together</h1>
              <p style={{ fontSize: 11, color: '#8B7E71', margin: '2px 0 0' }}>Restaurants where everyone can eat</p>
            </div>
          </div>
        </div>
        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {rankedRestaurants.every((r) => r.minCount === 0) && (
            <div style={{ padding: '32px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>🍽️</div>
              <div style={{ fontFamily: 'Georgia, serif', fontSize: 16, color: '#1A1614', marginBottom: 6 }}>
                No perfect match yet
              </div>
              <div style={{ fontSize: 13, color: '#8B7E71', lineHeight: 1.6 }}>
                No restaurant has compatible dishes for everyone. Try adjusting some filters.
              </div>
            </div>
          )}
          {rankedRestaurants.map((r) => {
            const allCanEat = r.perPerson.every((p) => p.count > 0);
            const imageSrc = 'image' in r && typeof r.image === 'string' ? r.image : r.heroImage;
            return (
              <div
                key={r.id}
                role="button"
                tabIndex={0}
                onClick={() => openRestaurant(r.slug)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') openRestaurant(r.slug);
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(26,22,20,0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                style={{ background: '#FFFFFF', border: '0.5px solid #C4B9A8', borderRadius: 14, overflow: 'hidden', width: '100%', textAlign: 'left', cursor: 'pointer', transition: 'transform 0.15s ease, box-shadow 0.15s ease' }}
              >
                <div style={{ position: 'relative', height: 160 }}>
                  <Image src={imageSrc} alt={r.name} fill style={{ objectFit: 'cover' }} sizes="(max-width: 430px) 100vw" />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, rgba(26,22,20,0.75) 100%)' }} />
                  <div style={{ position: 'absolute', bottom: 12, left: 14, right: 74 }}>
                    <div style={{ fontFamily: 'Georgia, serif', fontSize: 16, color: '#FDFBF7', fontWeight: 400, marginBottom: 2 }}>{r.name}</div>
                  </div>
                  <div style={{ position: 'absolute', top: 12, right: 12, width: 44, height: 44, borderRadius: '50%', background: 'rgba(26,22,20,0.75)', border: '2.5px solid #C8553A', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
                    <span style={{ fontFamily: 'Georgia, serif', fontSize: 15, color: '#FDFBF7', lineHeight: 1 }}>{r.minCount}</span>
                    <span style={{ fontSize: 6, color: '#C4B9A8', lineHeight: 1, marginTop: 1 }}>min</span>
                  </div>
                </div>
                <div style={{ padding: '12px 14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                    <span style={{ fontSize: 13, color: '#C8553A' }}>★</span>
                    <span style={{ fontSize: 13, color: '#1A1614', fontWeight: 500 }}>{r.rating}</span>
                    <span style={{ fontSize: 11, color: '#C4B9A8' }}>·</span>
                    <span style={{ fontSize: 12, color: '#8B7E71' }}>{r.cuisine}</span>
                    <span style={{ fontSize: 11, color: '#C4B9A8' }}>·</span>
                    <span style={{ fontSize: 12, color: '#8B7E71' }}>{r.location}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginBottom: 10 }}>
                    {r.perPerson.map((p, idx) => (
                      <span key={p.name} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: '#F5F0E8', border: '0.5px solid #C4B9A8', borderRadius: 100, padding: '3px 9px 3px 4px', fontSize: 11, color: '#8B7E71' }}>
                        <span style={{ width: 18, height: 18, borderRadius: '50%', background: AVATAR_COLORS[idx % AVATAR_COLORS.length], color: '#FDFBF7', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 500 }}>
                          {p.name.charAt(0).toUpperCase()}
                        </span>
                        {p.name}: {p.count}
                      </span>
                    ))}
                  </div>
                  {allCanEat && (
                    <div style={{ fontSize: 12, color: '#456B4B', marginBottom: 12, fontWeight: 500 }}>
                      Everyone can eat here
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={(e) => { e.stopPropagation(); }} style={{ flex: 1, background: '#1A1614', color: '#FDFBF7', border: 'none', borderRadius: 8, padding: '8px', fontSize: 12, cursor: 'pointer', transition: 'all 0.15s ease' }}>
                      Book
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); }} style={{ flex: 1, background: 'transparent', color: '#1A1614', border: '0.5px solid #C4B9A8', borderRadius: 8, padding: '8px', fontSize: 12, cursor: 'pointer', transition: 'all 0.15s ease' }}>
                      Ask
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: 'Inter, -apple-system, sans-serif' }}>
      <div style={{ padding: '16px 16px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
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
          <div>
            <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 22, fontWeight: 400, color: '#1A1614', margin: '0 0 4px', letterSpacing: '-0.3px' }}>Dine together</h1>
            <p style={{ fontSize: 13, color: '#8B7E71', margin: 0 }}>Add each person&apos;s dietary needs to find a restaurant where everyone can eat.</p>
          </div>
        </div>
      </div>

      <div style={{ padding: '0 16px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {profiles.map((profile, idx) => (
          <div key={profile.id} style={{ background: '#FFFFFF', border: '0.5px solid #C4B9A8', borderRadius: 14, padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#F5F0E8', border: '0.5px solid #C4B9A8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 500, color: '#8B7E71', flexShrink: 0 }}>
                {profile.name.charAt(0)}
              </div>
              <input
                value={profile.name}
                onChange={(e) => updateName(profile.id, e.target.value)}
                style={{ flex: 1, background: 'none', border: 'none', fontSize: 14, fontWeight: 500, color: '#1A1614', outline: 'none', fontFamily: 'inherit' }}
              />
              {idx >= 2 && (
                <button onClick={() => removeProfile(profile.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#C4B9A8', fontSize: 16 }}>×</button>
              )}
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {ALLERGEN_PILLS.map((pill) => {
                const active = profile.filters.includes(pill.key);
                return (
                  <button
                    key={pill.key}
                    onClick={() => toggleFilter(profile.id, pill.key)}
                    style={{ background: active ? '#1A1614' : 'transparent', color: active ? '#FDFBF7' : '#8B7E71', border: `0.5px solid ${active ? '#1A1614' : '#C4B9A8'}`, borderRadius: 100, padding: '5px 10px', fontSize: 11, cursor: 'pointer', transition: 'all 0.15s ease' }}
                  >
                    {pill.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {profiles.length < 6 && (
          <button onClick={addProfile} style={{ background: 'transparent', border: '0.5px dashed #C4B9A8', borderRadius: 14, padding: '14px', color: '#8B7E71', fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, transition: 'all 0.15s ease' }}>
            + Add person
          </button>
        )}

        <button
          onClick={() => { analytics.groupMatchStarted(profiles.length); setShowResults(true); }}
          style={{ background: '#1A1614', color: '#FDFBF7', border: 'none', borderRadius: 12, padding: '15px', fontSize: 13, cursor: 'pointer', marginTop: 4, transition: 'all 0.15s ease' }}
        >
          Find restaurants for everyone →
        </button>
      </div>
    </div>
  );
}
