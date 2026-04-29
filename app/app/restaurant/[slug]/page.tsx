'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { getRestaurantBySlug, getDishesByRestaurant } from '@/lib/data/restaurants';
import { filterMatchesDish, getAllergenSummary, getDishTags } from '@/lib/scoring';
import { analytics } from '@/lib/analytics';
import type { Dish } from '@/lib/types';

type DishWithWarnings = Dish & { traceWarnings: string[] };

export default function RestaurantDetailPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<'compatible' | 'full'>('compatible');
  const [imgError, setImgError] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  useEffect(() => {
    const filtersParam = searchParams.get('filters') || '';
    const fromSession = sessionStorage.getItem('pm_filters');
    if (filtersParam) {
      setActiveFilters(filtersParam.split(',').filter(Boolean));
    } else if (fromSession) {
      try { setActiveFilters(JSON.parse(fromSession)); } catch {}
    }
  }, [searchParams]);

  const restaurant = getRestaurantBySlug(params.slug);
  if (!restaurant) return <div style={{ padding: 32, textAlign: 'center', color: '#8B7E71' }}>Restaurant not found.</div>;

  const allDishes = getDishesByRestaurant(restaurant.id);
  const compatibleDishes = allDishes.filter((d) => filterMatchesDish(d, activeFilters).compatible);
  const dishesWithWarnings: DishWithWarnings[] = compatibleDishes.map((d) => ({
    ...d,
    traceWarnings: filterMatchesDish(d, activeFilters).traceWarnings,
  }));
  const displayDishes: (Dish | DishWithWarnings)[] = activeTab === 'compatible' ? dishesWithWarnings : allDishes;

  const starters = displayDishes.filter((d) => d.category === 'starter');
  const mains = displayDishes.filter((d) => d.category === 'main');
  const desserts = displayDishes.filter((d) => d.category === 'dessert');
  const sides = displayDishes.filter((d) => d.category === 'side');

  return (
    <div style={{ fontFamily: 'Inter, -apple-system, sans-serif' }}>
      {/* Hero */}
      <div style={{ position: 'relative', height: 220 }}>
        {!imgError ? (
          <Image src={restaurant.heroImage} alt={restaurant.name} fill style={{ objectFit: 'cover' }} onError={() => setImgError(true)} sizes="430px" />
        ) : (
          <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #2D3530, #1A1614)' }} />
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 30%, rgba(26,22,20,0.78) 100%)' }} />

        {/* Back button */}
        <button onClick={() => router.back()} style={{ position: 'absolute', top: 16, left: 16, width: 36, height: 36, borderRadius: '50%', background: 'rgba(253,251,247,0.15)', backdropFilter: 'blur(8px)', border: '0.5px solid rgba(253,251,247,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 16, color: '#FDFBF7' }}>←</button>

        {/* Actions */}
        <div style={{ position: 'absolute', top: 16, right: 16, display: 'flex', gap: 8 }}>
          {['🤍', '⬆'].map((icon) => (
            <button key={icon} style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(253,251,247,0.15)', backdropFilter: 'blur(8px)', border: '0.5px solid rgba(253,251,247,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 15, color: '#FDFBF7' }}>{icon}</button>
          ))}
        </div>

        {/* Restaurant name + address overlay */}
        <div style={{ position: 'absolute', bottom: 12, left: 14, right: 70 }}>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: 22, color: '#FDFBF7', fontWeight: 400, marginBottom: 3, letterSpacing: '-0.3px' }}>{restaurant.name}</div>
          <div style={{ fontSize: 12, color: 'rgba(253,251,247,0.65)' }}>{restaurant.address}</div>
        </div>

        {/* Ring */}
        <div style={{ position: 'absolute', bottom: 12, right: 14, width: 56, height: 56, borderRadius: '50%', background: 'rgba(26,22,20,0.7)', border: '2.5px solid #C8553A', backdropFilter: 'blur(4px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontFamily: 'Georgia, serif', fontSize: 18, color: '#FDFBF7', lineHeight: 1 }}>{compatibleDishes.length}</span>
          <span style={{ fontSize: 6, color: '#C4B9A8', lineHeight: 1.2 }}>of {allDishes.length}</span>
        </div>
      </div>

      {/* Info row */}
      <div style={{ background: '#FFFFFF', borderBottom: '0.5px solid #C4B9A8', padding: '12px 16px' }}>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'space-around' }}>
          {[
            { value: `★ ${restaurant.rating}`, label: 'Rating' },
            { value: restaurant.isOpen ? '● Open' : '○ Closed', label: 'Status', color: restaurant.isOpen ? '#639922' : '#8B7E71' },
            { value: restaurant.cuisine, label: 'Cuisine' },
            { value: restaurant.distance, label: 'Distance' },
          ].map((item) => (
            <div key={item.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: item.color || '#1A1614' }}>{item.value}</div>
              <div style={{ fontSize: 10, color: '#8B7E71', marginTop: 2 }}>{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Attribution */}
      <div style={{ background: '#F5F0E8', borderBottom: '0.5px solid #C4B9A8', padding: '8px 16px', fontSize: 11, color: '#8B7E71' }}>
        Allergen information declared by restaurant · Last updated {restaurant.lastUpdated} · Always confirm with staff before ordering
      </div>

      {/* Tab toggle */}
      <div style={{ display: 'flex', background: '#FFFFFF', borderBottom: '0.5px solid #C4B9A8' }}>
        {[
          { key: 'compatible', label: `Compatible dishes (${compatibleDishes.length})` },
          { key: 'full', label: `Full menu (${allDishes.length})` },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as 'compatible' | 'full')}
            style={{ flex: 1, padding: '12px 8px', background: 'none', border: 'none', borderBottom: `2px solid ${activeTab === tab.key ? '#1A1614' : 'transparent'}`, fontSize: 12.5, fontWeight: 500, color: activeTab === tab.key ? '#1A1614' : '#8B7E71', cursor: 'pointer' }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Dish list by category */}
      <div style={{ padding: '16px 16px 24px' }}>
        {[
          { label: 'Starters', dishes: starters },
          { label: 'Mains', dishes: mains },
          { label: 'Desserts', dishes: desserts },
          { label: 'Sides', dishes: sides },
        ].filter((section) => section.dishes.length > 0).map((section) => (
          <div key={section.label} style={{ marginBottom: 28 }}>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 18, fontWeight: 400, color: '#1A1614', marginBottom: 12, letterSpacing: '-0.2px' }}>{section.label}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {section.dishes.map((dish) => (
                <DishRow
                  key={dish.id}
                  dish={dish}
                  activeFilters={activeFilters}
                  onClick={() => {
                    analytics.dishViewed(dish.id, restaurant.id);
                    router.push(`/app/dish/${dish.id}?filters=${activeFilters.join(',')}`);
                  }}
                />
              ))}
            </div>
          </div>
        ))}

        {displayDishes.length === 0 && (
          <div style={{ textAlign: 'center', padding: '32px 0', color: '#8B7E71', fontSize: 13 }}>
            No dishes match your current filters.<br />
            <button onClick={() => setActiveTab('full')} style={{ marginTop: 8, color: '#C8553A', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13 }}>View full menu</button>
          </div>
        )}
      </div>

      {/* Bottom action bar */}
      <div style={{ position: 'sticky', bottom: 68, background: '#FDFBF7', borderTop: '0.5px solid #C4B9A8', padding: '12px 16px', display: 'flex', gap: 10 }}>
        <button
          onClick={() => { analytics.bookTableClicked(restaurant.slug); window.open(restaurant.bookingUrl, '_blank'); }}
          style={{ flex: 1, background: '#1A1614', color: '#FDFBF7', border: 'none', borderRadius: 10, padding: '12px', fontSize: 13, cursor: 'pointer' }}
        >
          Book a table
        </button>
        <button style={{ flex: 1, background: 'transparent', color: '#1A1614', border: '0.5px solid #C4B9A8', borderRadius: 10, padding: '12px', fontSize: 13, cursor: 'pointer' }}>
          Ask the restaurant
        </button>
      </div>
    </div>
  );
}

function DishRow({ dish, activeFilters, onClick }: { dish: Dish | DishWithWarnings; activeFilters: string[]; onClick: () => void }) {
  const [imgError, setImgError] = useState(false);
  const { contains, traces } = getAllergenSummary(dish.allergens);
  const tags = getDishTags(dish);
  const match = filterMatchesDish(dish, activeFilters);
  const traceWarnings = 'traceWarnings' in dish ? dish.traceWarnings : match.traceWarnings;

  return (
    <button
      onClick={onClick}
      style={{ display: 'flex', gap: 12, alignItems: 'flex-start', background: '#FFFFFF', border: '0.5px solid #C4B9A8', width: '100%', textAlign: 'left', cursor: 'pointer', padding: '10px 12px', borderRadius: 12 } as React.CSSProperties}
    >
      {/* Thumbnail */}
      <div style={{ width: 64, height: 64, borderRadius: 10, overflow: 'hidden', flexShrink: 0, background: '#F5F0E8' }}>
        {dish.image && !imgError ? (
          <Image src={dish.image} alt={dish.name} width={64} height={64} style={{ objectFit: 'cover', width: '100%', height: '100%' }} onError={() => setImgError(true)} />
        ) : (
          <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #F5F0E8, #C4B9A8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>🍽️</div>
        )}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: 'Georgia, serif', fontSize: 14, color: '#1A1614', marginBottom: 3, fontWeight: 400 }}>{dish.name}</div>
        <div style={{ fontSize: 11.5, color: '#8B7E71', lineHeight: 1.5, marginBottom: 6, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const }}>
          {dish.description}
        </div>

        {/* Allergen chips */}
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 6 }}>
          {contains.slice(0, 3).map((a) => (
            <span key={a} style={{ background: '#FCEBEB', color: '#A32D2D', borderRadius: 100, padding: '2px 7px', fontSize: 10 }}>Contains: {a}</span>
          ))}
          {traces.slice(0, 2).map((a) => (
            <span key={a} style={{ background: '#FAEEDA', color: '#854F0B', borderRadius: 100, padding: '2px 7px', fontSize: 10 }}>Traces: {a}</span>
          ))}
          {traceWarnings.map((a) => (
            <span key={`warning-${a}`} style={{ background: '#FAEEDA', color: '#854F0B', borderRadius: 100, padding: '2px 7px', fontSize: 10 }}>May contain: {a}</span>
          ))}
          {tags.map((t) => (
            <span key={t} style={{ background: '#EDF6E2', color: '#3A6B0A', borderRadius: 100, padding: '2px 7px', fontSize: 10 }}>{t}</span>
          ))}
        </div>

        <div style={{ fontFamily: 'Georgia, serif', fontSize: 13, color: '#1A1614' }}>{dish.price}</div>
      </div>
    </button>
  );
}
