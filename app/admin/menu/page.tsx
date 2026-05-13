'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { getDishesByRestaurant } from '@/lib/data/restaurants';
import { getAllergenSummary, getDishTags } from '@/lib/scoring';

const categories = ['starter', 'main', 'dessert', 'side'] as const;

export default function MenuPage() {
  const router = useRouter();
  const [expanded, setExpanded] = useState<string | null>(null);
  const dishes = getDishesByRestaurant(1);
  const grouped = categories
    .map((cat) => ({
      key: cat,
      label: cat === 'starter' ? 'Starters' : cat === 'main' ? 'Mains' : cat === 'dessert' ? 'Desserts' : 'Sides',
      dishes: dishes.filter((d) => d.category === cat),
    }))
    .filter((g) => g.dishes.length > 0);

  return (
    <div style={{ fontFamily: 'Inter, -apple-system, sans-serif', background: '#FDFBF7', minHeight: '100vh' }}>
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
        {grouped.map((group) => {
          const isExpanded = expanded === group.key;
          return (
            <div key={group.key} style={{ background: '#FFFFFF', border: '0.5px solid #C4B9A8', borderRadius: 12, overflow: 'hidden' }}>
              <button
                onClick={() => setExpanded(isExpanded ? null : group.key)}
                style={{ background: '#FFFFFF', border: 'none', padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', width: '100%', textAlign: 'left' }}
              >
                <div style={{ fontFamily: 'Georgia, serif', fontSize: 15, color: '#1A1614' }}>{group.label}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 12, color: '#8B7E71' }}>{group.dishes.length} dishes</span>
                  <span style={{ color: '#C4B9A8', fontSize: 14, transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.15s ease' }}>›</span>
                </div>
              </button>

              {isExpanded && (
                <div style={{ paddingLeft: 12 }}>
                  {group.dishes.map((dish) => {
                    const { contains, traces } = getAllergenSummary(dish.allergens);
                    const tags = getDishTags(dish);
                    return (
                      <button
                        key={dish.id}
                        onClick={() => router.push(`/admin/dish/${dish.id}?from=menu`)}
                        style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', border: 'none', borderBottom: '0.5px solid #F5F0E8', background: 'transparent', width: '100%', textAlign: 'left', cursor: 'pointer' }}
                      >
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontFamily: 'Georgia, serif', fontSize: 13, color: '#1A1614', marginBottom: 5 }}>{dish.name}</div>
                          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                            {tags.slice(0, 3).map((tag) => (
                              <span key={tag} style={{ background: '#EDF4EE', color: '#456B4B', borderRadius: 100, padding: '2px 7px', fontSize: 9.5 }}>{tag}</span>
                            ))}
                            {contains.slice(0, 2).map((allergen) => (
                              <span key={allergen} style={{ background: '#F9EFEA', color: '#8A4A32', borderRadius: 100, padding: '2px 7px', fontSize: 9.5 }}>Contains: {allergen}</span>
                            ))}
                            {traces.slice(0, 1).map((allergen) => (
                              <span key={allergen} style={{ background: '#F8F2E6', color: '#7A6432', borderRadius: 100, padding: '2px 7px', fontSize: 9.5 }}>Traces: {allergen}</span>
                            ))}
                          </div>
                        </div>
                        <span style={{ fontFamily: 'Georgia, serif', fontSize: 12, color: '#8B7E71', flexShrink: 0 }}>{dish.price}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
