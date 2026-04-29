'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { restaurants, getDishesByRestaurant } from '@/lib/data/restaurants';
import { getCompatibleCount } from '@/lib/scoring';
import { analytics } from '@/lib/analytics';
import type { DishAllergens } from '@/lib/types';

const CUISINES = [
  { code: 'IT', label: 'Italian' },
  { code: 'JP', label: 'Japanese' },
  { code: 'IN', label: 'Indian' },
  { code: 'TH', label: 'Thai' },
  { code: 'GR', label: 'Greek' },
  { code: 'MX', label: 'Mexican' },
  { code: 'CN', label: 'Chinese' },
  { code: 'FR', label: 'French' },
  { code: 'LB', label: 'Lebanese' },
  { code: 'GB', label: 'British' },
];

const FILTER_CHIPS = ['All', 'Open now', 'Top rated', 'Nearest', 'Group match'];

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function AppHomePage() {
  const router = useRouter();
  const [activeCuisine, setActiveCuisine] = useState<string | null>(null);
  const [activeChip, setActiveChip] = useState('All');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const saved = sessionStorage.getItem('pm_filters');
    if (saved) {
      try { setActiveFilters(JSON.parse(saved)); } catch {}
    }
  }, []);

  const filteredRestaurants = restaurants
    .filter((r) => {
      if (activeCuisine && !r.cuisine.toLowerCase().includes(activeCuisine.toLowerCase())) return false;
      if (activeChip === 'Open now' && !r.isOpen) return false;
      if (search.trim() && !r.name.toLowerCase().includes(search.toLowerCase()) && !r.location.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    })
    .map((r) => {
      const dishes = getDishesByRestaurant(r.id);
      const count = getCompatibleCount(dishes, activeFilters);
      return { ...r, dishes, compatibleCount: count };
    })
    .sort((a, b) => b.compatibleCount - a.compatibleCount);

  return (
    <div style={{ fontFamily: 'Inter, -apple-system, sans-serif' }}>
      {/* Top bar */}
      <div style={{ padding: '20px 16px 0', background: '#FDFBF7' }}>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 22, fontWeight: 400, color: '#1A1614', margin: '0 0 4px', letterSpacing: '-0.3px' }}>
          {getGreeting()}
        </h1>
        <p style={{ fontSize: 13, color: '#8B7E71', margin: '0 0 16px' }}>Find restaurants that match your needs</p>

        {/* Search + filter */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search restaurants or cuisines"
              style={{
                width: '100%',
                background: '#F5F0E8',
                border: '0.5px solid #C4B9A8',
                borderRadius: 10,
                padding: '10px 14px 10px 36px',
                fontSize: 13,
                color: '#1A1614',
                outline: 'none',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
              }}
            />
            <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 14, color: '#C4B9A8' }}>🔍</span>
          </div>
          <button
            onClick={() => router.push('/app/allergens')}
            style={{
              background: activeFilters.length > 0 ? '#1A1614' : '#1A1614',
              color: '#FDFBF7',
              border: 'none',
              borderRadius: 10,
              padding: '10px 14px',
              fontSize: 13,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              flexShrink: 0,
              position: 'relative',
            }}
          >
            <span style={{ fontSize: 14 }}>⚙</span>
            {activeFilters.length > 0 && (
              <span style={{ position: 'absolute', top: -4, right: -4, width: 16, height: 16, background: '#C8553A', borderRadius: '50%', fontSize: 9, color: '#FDFBF7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {activeFilters.length}
              </span>
            )}
          </button>
        </div>

        {/* Active filter pills */}
        {activeFilters.length > 0 && (
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
            {activeFilters.map((f) => (
              <div key={f} style={{ background: '#1A1614', color: '#FDFBF7', borderRadius: 100, padding: '4px 10px', fontSize: 11, display: 'flex', alignItems: 'center', gap: 5 }}>
                {f}
                <button onClick={() => {
                  const newFilters = activeFilters.filter((x) => x !== f);
                  setActiveFilters(newFilters);
                  sessionStorage.setItem('pm_filters', JSON.stringify(newFilters));
                }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#C4B9A8', padding: 0, fontSize: 11, lineHeight: 1 }}>×</button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cuisine filter row */}
      <div style={{ display: 'flex', gap: 8, padding: '0 16px 12px', overflowX: 'auto' }} className="no-scrollbar">
        {CUISINES.map((c) => {
          const active = activeCuisine === c.label;
          return (
            <button
              key={c.label}
              onClick={() => setActiveCuisine(active ? null : c.label)}
              style={{
                flexShrink: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 4,
                width: 56,
                padding: '8px 4px',
                background: active ? '#1A1614' : '#F5F0E8',
                border: `0.5px solid ${active ? '#1A1614' : '#C4B9A8'}`,
                borderRadius: 10,
                cursor: 'pointer',
              }}
            >
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: active ? '#1A1614' : '#F5F0E8',
                border: `0.5px solid ${active ? '#1A1614' : '#C4B9A8'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 500,
                color: active ? '#FDFBF7' : '#8B7E71',
              }}>
                {c.code}
              </div>
              <span style={{ fontSize: 9.5, color: active ? '#FDFBF7' : '#8B7E71', fontWeight: 400 }}>{c.label}</span>
            </button>
          );
        })}
      </div>

      {/* Chip filters */}
      <div style={{ display: 'flex', gap: 8, padding: '0 16px 16px', overflowX: 'auto' }} className="no-scrollbar">
        {FILTER_CHIPS.map((chip) => {
          const active = activeChip === chip;
          return (
            <button
              key={chip}
              onClick={() => setActiveChip(chip)}
              style={{
                flexShrink: 0,
                padding: '7px 14px',
                background: active ? '#1A1614' : 'transparent',
                border: `0.5px solid ${active ? '#1A1614' : '#C4B9A8'}`,
                borderRadius: 100,
                fontSize: 12,
                color: active ? '#FDFBF7' : '#8B7E71',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {chip}
            </button>
          );
        })}
      </div>

      {/* Restaurant cards */}
      <div style={{ padding: '0 16px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ fontSize: 11, color: '#8B7E71', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>
          {filteredRestaurants.length} restaurants{activeFilters.length > 0 ? ` · ${filteredRestaurants.reduce((a, r) => a + r.compatibleCount, 0)} compatible dishes` : ''}
        </div>
        {filteredRestaurants.map((r) => (
          <RestaurantCard
            key={r.id}
            restaurant={r}
            compatibleCount={r.compatibleCount}
            totalDishes={r.dishCount}
            onClick={() => {
              analytics.restaurantViewed(r.slug);
              router.push(`/app/restaurant/${r.slug}?filters=${activeFilters.join(',')}`);
            }}
          />
        ))}
      </div>
    </div>
  );
}

function RestaurantCard({
  restaurant,
  compatibleCount,
  totalDishes,
  onClick,
}: {
  restaurant: { name: string; cuisine: string; location: string; address: string; rating: number; distance: string; isOpen: boolean; heroImage: string };
  compatibleCount: number;
  totalDishes: number;
  onClick: () => void;
}) {
  const [imgError, setImgError] = useState(false);

  const tags = [];
  if (compatibleCount > 0) tags.push(`${compatibleCount} compatible`);
  if (restaurant.isOpen) tags.push('Open');

  return (
    <button
      onClick={onClick}
      style={{ background: '#FFFFFF', border: '0.5px solid #C4B9A8', borderRadius: 14, overflow: 'hidden', width: '100%', textAlign: 'left', cursor: 'pointer', padding: 0 }}
    >
      {/* Hero */}
      <div style={{ position: 'relative', height: 160 }}>
        {!imgError ? (
          <Image
            src={restaurant.heroImage}
            alt={restaurant.name}
            fill
            style={{ objectFit: 'cover' }}
            onError={() => setImgError(true)}
            sizes="(max-width: 430px) 100vw"
          />
        ) : (
          <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #2D3530, #1A1614)' }} />
        )}
        {/* gradient overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, rgba(26,22,20,0.75) 100%)' }} />

        {/* Text overlay */}
        <div style={{ position: 'absolute', bottom: 12, left: 14, right: 14 }}>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: 17, color: '#FDFBF7', fontWeight: 400, marginBottom: 2 }}>{restaurant.name}</div>
          <div style={{ fontSize: 11, color: 'rgba(253,251,247,0.7)' }}>{restaurant.address}</div>
        </div>

        {/* Ring score */}
        <div style={{ position: 'absolute', top: 12, right: 12, width: 52, height: 52, borderRadius: '50%', background: 'rgba(26,22,20,0.75)', border: '2px solid #C8553A', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
          <span style={{ fontFamily: 'Georgia, serif', fontSize: 16, color: '#FDFBF7', lineHeight: 1 }}>{compatibleCount}</span>
          <span style={{ fontSize: 6.5, color: '#C4B9A8', lineHeight: 1, marginTop: 1 }}>of {totalDishes}</span>
        </div>
      </div>

      {/* Card body */}
      <div style={{ padding: '12px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <span style={{ fontSize: 13, color: '#C8553A' }}>★</span>
          <span style={{ fontSize: 13, color: '#1A1614', fontWeight: 500 }}>{restaurant.rating}</span>
          <span style={{ fontSize: 11, color: '#C4B9A8' }}>·</span>
          <span style={{ fontSize: 12, color: '#8B7E71' }}>{restaurant.cuisine}</span>
          <span style={{ fontSize: 11, color: '#C4B9A8' }}>·</span>
          <span style={{ fontSize: 12, color: '#8B7E71' }}>{restaurant.distance}</span>
          <span style={{ fontSize: 11, color: '#C4B9A8' }}>·</span>
          <span style={{ fontSize: 12, color: restaurant.isOpen ? '#639922' : '#8B7E71' }}>{restaurant.isOpen ? 'Open' : 'Closed'}</span>
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
          {tags.map((tag) => (
            <span key={tag} style={{ background: '#F5F0E8', color: '#8B7E71', border: '0.5px solid #C4B9A8', borderRadius: 100, padding: '3px 10px', fontSize: 11 }}>
              {tag}
            </span>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={(e) => { e.stopPropagation(); }}
            style={{ flex: 1, background: '#1A1614', color: '#FDFBF7', border: 'none', borderRadius: 8, padding: '8px', fontSize: 12, cursor: 'pointer' }}
          >
            Book
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); }}
            style={{ flex: 1, background: 'transparent', color: '#1A1614', border: '0.5px solid #C4B9A8', borderRadius: 8, padding: '8px', fontSize: 12, cursor: 'pointer' }}
          >
            Ask
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onClick(); }}
            style={{ flex: 1, background: 'transparent', color: '#1A1614', border: '0.5px solid #C4B9A8', borderRadius: 8, padding: '8px', fontSize: 12, cursor: 'pointer' }}
          >
            Menu
          </button>
        </div>
      </div>
    </button>
  );
}
