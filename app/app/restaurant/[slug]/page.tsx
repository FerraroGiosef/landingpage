'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { getRestaurantBySlug, getDishesByRestaurant } from '@/lib/data/restaurants';
import { filterMatchesDish, getAllergenSummary, getDishTags } from '@/lib/scoring';
import { analytics } from '@/lib/analytics';
import type { Dish } from '@/lib/types';

type DishWithWarnings = Dish & { traceWarnings: string[]; modifiedBy?: string; priceExtra?: number };
interface GroupProfileView {
  name: string;
  filters: string[];
}

export default function RestaurantDetailPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<'compatible' | 'full'>('compatible');
  const [imgError, setImgError] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [showAskModal, setShowAskModal] = useState(false);
  const [showBookModal, setShowBookModal] = useState(false);
  const [groupProfiles, setGroupProfiles] = useState<GroupProfileView[]>([]);
  const [selectedProfileIdx, setSelectedProfileIdx] = useState<number | null>(null);

  useEffect(() => {
    const filtersParam = searchParams.get('filters') || '';
    const fromSession = sessionStorage.getItem('pm_filters');
    if (filtersParam) {
      setActiveFilters(filtersParam.split(',').filter(Boolean));
    } else if (fromSession) {
      try { setActiveFilters(JSON.parse(fromSession)); } catch {}
    }
    const groupParam = searchParams.get('group');
    const storedGroupProfiles = sessionStorage.getItem('pm_group_profiles');
    if (groupParam) {
      try {
        setGroupProfiles(JSON.parse(decodeURIComponent(groupParam)));
      } catch {
        setGroupProfiles([]);
      }
    } else if (filtersParam && storedGroupProfiles) {
      try {
        setGroupProfiles(JSON.parse(storedGroupProfiles));
      } catch {
        setGroupProfiles([]);
      }
    } else {
      setGroupProfiles([]);
    }
  }, [searchParams]);

  const restaurant = getRestaurantBySlug(params.slug);
  if (!restaurant) return <div style={{ padding: 32, textAlign: 'center', color: '#8B7E71' }}>Restaurant not found.</div>;

  const allDishes = getDishesByRestaurant(restaurant.id);
  const isFromGroup = groupProfiles.length > 0;

  // In group mode, "compatible" = at least one person can eat it (or filtered by selected profile)
  const selectedProfile = selectedProfileIdx !== null ? groupProfiles[selectedProfileIdx] : null;
  const compatibleDishes = isFromGroup
    ? selectedProfile
      ? allDishes.filter((d) => filterMatchesDish(d, selectedProfile.filters).compatible)
      : allDishes.filter((d) => groupProfiles.some((p) => filterMatchesDish(d, p.filters).compatible))
    : allDishes.filter((d) => filterMatchesDish(d, activeFilters).compatible);

  const dishesWithWarnings: DishWithWarnings[] = compatibleDishes.map((d) => ({
    ...d,
    traceWarnings: filterMatchesDish(d, activeFilters).traceWarnings,
    modifiedBy: filterMatchesDish(d, activeFilters).modifiedBy,
    priceExtra: filterMatchesDish(d, activeFilters).priceExtra,
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
          <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #4A3F38, #1A1614)' }} />
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 30%, rgba(26,22,20,0.78) 100%)' }} />

        {/* Back button */}
        <button onClick={() => { if (searchParams.get('from') === 'admin') { router.push('/admin'); } else { router.back(); } }} style={{ position: 'absolute', top: 16, left: 16, width: 36, height: 36, borderRadius: '50%', background: 'rgba(253,251,247,0.15)', backdropFilter: 'blur(8px)', border: '0.5px solid rgba(253,251,247,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 16, color: '#FDFBF7' }}>←</button>

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
            { value: restaurant.isOpen ? '● Open' : '○ Closed', label: 'Status', color: restaurant.isOpen ? '#7EA884' : '#8B7E71' },
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

      {activeFilters.length > 0 && (
        <div style={{ background: '#F5F0E8', borderBottom: '0.5px solid #C4B9A8', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 10, color: '#8B7E71', flexShrink: 0 }}>Filtering for:</span>
          {activeFilters.map((f) => {
            const LABELS: Record<string, string> = {
              gluten: 'Gluten-free', milk: 'Dairy-free', eggs: 'Egg-free',
              peanuts: 'Peanut-free', treeNuts: 'Nut-free', fish: 'Fish-free',
              crustaceans: 'Crustacean-free', soya: 'Soya-free', celery: 'Celery-free',
              mustard: 'Mustard-free', sesame: 'Sesame-free', sulphites: 'Sulphite-free',
              lupin: 'Lupin-free', molluscs: 'Mollusc-free',
              vegan: 'Vegan', vegetarian: 'Vegetarian',
              'dairy-free': 'Dairy-free', 'nut-free': 'Nut-free', gf: 'Gluten-free',
            };
            const label = LABELS[f] || f;
            return (
              <span key={f} style={{ background: '#1A1614', color: '#FDFBF7', borderRadius: 100, padding: '3px 10px', fontSize: 11, whiteSpace: 'nowrap' }}>
                {label}
              </span>
            );
          })}
        </div>
      )}

      {/* Attribution */}
      <div style={{ background: '#F5F0E8', borderBottom: '0.5px solid #C4B9A8', padding: '8px 16px', fontSize: 11, color: '#8B7E71' }}>
        Allergen information declared by restaurant · Last updated {restaurant.lastUpdated} · Always confirm with staff before ordering
      </div>
      <div style={{ padding: '0 20px 8px', fontSize: 11, color: '#8B7E71', lineHeight: 1.55, background: '#F5F0E8', borderBottom: '0.5px solid #C4B9A8' }}>
        Dishes marked &quot;May contain&quot; indicate possible cross-contamination during preparation. Always inform staff about severe allergies.
      </div>

      {/* Tab toggle */}
      <div style={{ display: 'flex', background: '#FFFFFF', borderBottom: '0.5px solid #C4B9A8' }}>
        {[
          { key: 'compatible', label: selectedProfile ? `${selectedProfile.name}'s options (${compatibleDishes.length})` : isFromGroup ? `Group options (${compatibleDishes.length})` : `Compatible dishes (${compatibleDishes.length})` },
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

      {/* Group legend bar */}
      {isFromGroup && (
        <div style={{ background: '#F5F0E8', borderBottom: '0.5px solid #C4B9A8', padding: '8px 16px', display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          {groupProfiles.map((profile, idx) => {
            const PROFILE_COLORS = ['#C8553A', '#8B7E71', '#6B8E6F', '#5B7BA8'];
            const filterLabels = profile.filters.map((f) => {
              const MAP: Record<string, string> = { gluten: 'GF', milk: 'Dairy-free', vegan: 'Vegan', vegetarian: 'Vegetarian', peanuts: 'Peanut-free', treeNuts: 'Nut-free', eggs: 'Egg-free', fish: 'Fish-free' };
              return MAP[f] || f;
            });
            const isActive = selectedProfileIdx === idx;
            const color = PROFILE_COLORS[idx % PROFILE_COLORS.length];
            return (
              <button
                key={profile.name}
                onClick={() => setSelectedProfileIdx(isActive ? null : idx)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                  fontSize: 11,
                  background: isActive ? color : '#FFFFFF',
                  color: isActive ? '#FDFBF7' : '#1A1614',
                  border: `1.5px solid ${color}`,
                  borderRadius: 100,
                  padding: '4px 10px 4px 6px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  fontFamily: 'inherit',
                }}
              >
                <span style={{ width: 14, height: 14, borderRadius: '50%', background: isActive ? 'rgba(255,255,255,0.35)' : color, display: 'inline-block', flexShrink: 0 }} />
                <span style={{ fontWeight: 500 }}>{profile.name}</span>
                {filterLabels.length > 0 && <span style={{ opacity: 0.75 }}>· {filterLabels.join(', ')}</span>}
              </button>
            );
          })}
          {selectedProfileIdx !== null && (
            <button
              onClick={() => setSelectedProfileIdx(null)}
              style={{ fontSize: 11, color: '#8B7E71', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 6px', fontFamily: 'inherit' }}
            >
              Show all
            </button>
          )}
        </div>
      )}

      {/* Dish list by category */}
      <div style={{ padding: '16px 16px 24px' }}>
        {activeTab === 'compatible' && compatibleDishes.length === 0 && (activeFilters.length > 0 || isFromGroup) && (
          <div style={{ padding: '32px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🍽️</div>
            <div style={{ fontFamily: 'Georgia, serif', fontSize: 16, color: '#1A1614', marginBottom: 6 }}>
              {isFromGroup ? 'No dishes for your group' : 'No compatible dishes found'}
            </div>
            <div style={{ fontSize: 13, color: '#8B7E71', lineHeight: 1.6, maxWidth: 280, margin: '0 auto 16px' }}>
              {isFromGroup
                ? 'None of the dishes are compatible with any member of your group. Check the full menu.'
                : 'None of the dishes match all your current filters. Try removing a filter or check the full menu.'}
            </div>
            <button
              onClick={() => setActiveTab('full')}
              style={{ background: '#1A1614', color: '#FDFBF7', border: 'none', borderRadius: 10, padding: '12px 20px', fontSize: 13, cursor: 'pointer' }}
            >
              View full menu
            </button>
          </div>
        )}
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
                  groupProfiles={groupProfiles}
                  onClick={() => {
                    analytics.dishViewed(dish.id, restaurant.id);
                    router.push(`/app/dish/${dish.id}?filters=${activeFilters.join(',')}`);
                  }}
                />
              ))}
            </div>
          </div>
        ))}

        {displayDishes.length === 0 && !(activeTab === 'compatible' && compatibleDishes.length === 0 && activeFilters.length > 0) && (
          <div style={{ textAlign: 'center', padding: '32px 0', color: '#8B7E71', fontSize: 13 }}>
            No dishes match your current filters.<br />
            <button onClick={() => setActiveTab('full')} style={{ marginTop: 8, color: '#C8553A', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13 }}>View full menu</button>
          </div>
        )}
      </div>

      {/* Bottom action bar */}
      <div style={{ position: 'sticky', bottom: 68, background: '#FDFBF7', borderTop: '0.5px solid #C4B9A8', padding: '12px 16px', display: 'flex', gap: 10 }}>
        <button
          onClick={() => { analytics.bookTableClicked(restaurant.slug); setShowBookModal(true); }}
          style={{ flex: 1, background: '#1A1614', color: '#FDFBF7', border: 'none', borderRadius: 10, padding: '12px', fontSize: 13, cursor: 'pointer' }}
        >
          Book a table
        </button>
        <button onClick={() => setShowAskModal(true)} style={{ flex: 1, background: 'transparent', color: '#1A1614', border: '0.5px solid #C4B9A8', borderRadius: 10, padding: '12px', fontSize: 13, cursor: 'pointer' }}>
          Ask the restaurant
        </button>
      </div>

      {showAskModal && (
        <AskRestaurantModal
          restaurantName={restaurant.name}
          activeFilters={activeFilters}
          onClose={() => setShowAskModal(false)}
        />
      )}
      {showBookModal && (
        <BookTableModal onClose={() => setShowBookModal(false)} />
      )}
    </div>
  );
}

function DishRow({
  dish,
  activeFilters,
  groupProfiles,
  onClick,
}: {
  dish: Dish | DishWithWarnings;
  activeFilters: string[];
  groupProfiles: GroupProfileView[];
  onClick: () => void;
}) {
  const [imgError, setImgError] = useState(false);
  const { contains, traces } = getAllergenSummary(dish.allergens);
  const tags = getDishTags(dish);
  const match = filterMatchesDish(dish, activeFilters);
  const traceWarnings = 'traceWarnings' in dish ? dish.traceWarnings : match.traceWarnings;
  const modifiedBy = 'modifiedBy' in dish ? dish.modifiedBy : match.modifiedBy;
  const priceExtra = 'priceExtra' in dish ? dish.priceExtra : match.priceExtra;
  const modification = dish.modifications?.find((mod) => mod.name === modifiedBy);
  const modificationLabel = modification?.removes.length
    ? `Can be made ${modification.removes.map((item) => item === 'gluten' ? 'GF' : `${item}-free`).join(', ')}`
    : 'Can be modified';
  const matchingProfiles = groupProfiles.filter((profile) => filterMatchesDish(dish, profile.filters).compatible);

  return (
    <button
      onClick={onClick}
      style={{ display: 'flex', gap: 12, alignItems: 'flex-start', background: modifiedBy ? '#F7F9FC' : '#FFFFFF', border: `0.5px solid ${modifiedBy ? '#7A9ABB' : '#C4B9A8'}`, width: '100%', textAlign: 'left', cursor: 'pointer', padding: '10px 12px', borderRadius: 12 } as React.CSSProperties}
    >
      {/* Thumbnail */}
      <div style={{ width: 80, height: 80, borderRadius: 10, overflow: 'hidden', flexShrink: 0, background: '#F5F0E8' }}>
        {dish.image && !imgError ? (
          <Image src={dish.image} alt={dish.name} width={80} height={80} style={{ objectFit: 'cover', width: '100%', height: '100%' }} onError={() => setImgError(true)} />
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
          {tags.map((t) => (
            <span key={t} style={{ background: '#EDF4EE', color: '#456B4B', borderRadius: 100, padding: '2px 7px', fontSize: 10 }}>{t}</span>
          ))}
          {contains.slice(0, 3).map((a) => (
            <span key={a} style={{ background: '#F9EFEA', color: '#8A4A32', borderRadius: 100, padding: '2px 7px', fontSize: 10 }}>Contains: {a}</span>
          ))}
          {traces.slice(0, 2).map((a) => (
            <span key={a} style={{ background: '#F8F2E6', color: '#7A6432', borderRadius: 100, padding: '2px 7px', fontSize: 10 }}>Traces: {a}</span>
          ))}
          {traceWarnings.map((a) => (
            <span key={`warning-${a}`} style={{ background: '#F8F2E6', color: '#7A6432', borderRadius: 100, padding: '2px 7px', fontSize: 10 }}>May contain: {a}</span>
          ))}
          {modifiedBy && (
            <span style={{ background: '#EBF0F7', color: '#4A6A8A', border: '0.5px solid #7A9ABB', borderRadius: 100, padding: '2px 7px', fontSize: 10 }}>{modificationLabel}</span>
          )}
        </div>

        {modifiedBy && (
          <div style={{ fontSize: 10, color: '#4A6A8A', fontStyle: 'italic', marginBottom: 6 }}>
            Ask for {modifiedBy}{typeof priceExtra === 'number' ? ` (+£${priceExtra.toFixed(2)})` : ''}
          </div>
        )}

        {groupProfiles.length > 0 && (
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 6 }}>
            {groupProfiles.map((profile, idx) => {
              const PROFILE_COLORS = ['#C8553A', '#8B7E71', '#6B8E6F', '#5B7BA8'];
              const canEat = matchingProfiles.some((matchProfile) => matchProfile.name === profile.name);
              if (!canEat) return null;
              return (
                <span
                  key={profile.name}
                  style={{
                    background: PROFILE_COLORS[idx % PROFILE_COLORS.length],
                    color: '#FDFBF7',
                    borderRadius: 100,
                    padding: '2px 8px',
                    fontSize: 10,
                    fontWeight: 500,
                  }}
                >
                  {profile.name}
                </span>
              );
            })}
          </div>
        )}

        <div style={{ fontFamily: 'Georgia, serif', fontSize: 13, color: '#1A1614' }}>{dish.price}</div>
      </div>
    </button>
  );
}

function AskRestaurantModal({
  restaurantName,
  activeFilters,
  onClose,
}: {
  restaurantName: string;
  activeFilters: string[];
  onClose: () => void;
}) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(26,22,20,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} onClick={onClose}>
      <div style={{ background: '#FDFBF7', borderRadius: '20px', padding: '24px 20px 32px', width: '100%', maxWidth: 480, maxHeight: '80vh', overflow: 'auto' }} onClick={(e) => e.stopPropagation()}>
        <div style={{ width: 40, height: 4, borderRadius: 2, background: '#C4B9A8', margin: '0 auto 16px' }} />
        <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 18, fontWeight: 400, color: '#1A1614', marginBottom: 4 }}>Ask {restaurantName}</h3>
        <p style={{ fontSize: 13, color: '#8B7E71', marginBottom: 16 }}>Send a message about your dietary requirements before visiting.</p>

        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 11, color: '#8B7E71', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 4 }}>Your message</label>
          <textarea
            defaultValue={`Hi, I'm planning to visit your restaurant. I have the following dietary requirements: ${activeFilters.join(', ')}. Could you confirm which dishes are suitable for me? Thank you.`}
            style={{ width: '100%', minHeight: 100, padding: '12px 14px', borderRadius: 10, border: '0.5px solid #C4B9A8', background: '#F5F0E8', fontSize: 13, color: '#1A1614', fontFamily: 'inherit', resize: 'vertical', outline: 'none', boxSizing: 'border-box' }}
          />
        </div>

        <button
          onClick={() => { onClose(); alert('Message sent! (Demo mode — in production this sends via email or WhatsApp)'); }}
          style={{ width: '100%', background: '#1A1614', color: '#FDFBF7', border: 'none', borderRadius: 10, padding: '14px', fontSize: 14, fontWeight: 500, cursor: 'pointer', marginBottom: 8 }}
        >
          Send message
        </button>
        <button
          onClick={onClose}
          style={{ width: '100%', background: 'transparent', color: '#8B7E71', border: '0.5px solid #C4B9A8', borderRadius: 10, padding: '12px', fontSize: 13, cursor: 'pointer' }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

function BookTableModal({ onClose }: { onClose: () => void }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(26,22,20,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} onClick={onClose}>
      <div style={{ background: '#FDFBF7', borderRadius: '20px', padding: '24px 20px 32px', width: '100%', maxWidth: 480 }} onClick={(e) => e.stopPropagation()}>
        <div style={{ width: 40, height: 4, borderRadius: 2, background: '#C4B9A8', margin: '0 auto 16px' }} />
        <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 18, fontWeight: 400, color: '#1A1614', marginBottom: 4 }}>Book a table</h3>
        <p style={{ fontSize: 13, color: '#8B7E71', marginBottom: 16 }}>Choose your preferred date and time.</p>

        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <input type="date" style={{ flex: 1, padding: '12px 14px', borderRadius: 10, border: '0.5px solid #C4B9A8', background: '#F5F0E8', fontSize: 13, fontFamily: 'inherit' }} />
          <select style={{ flex: 1, padding: '12px 14px', borderRadius: 10, border: '0.5px solid #C4B9A8', background: '#F5F0E8', fontSize: 13, fontFamily: 'inherit' }}>
            <option>19:00</option><option>19:30</option><option>20:00</option><option>20:30</option><option>21:00</option>
          </select>
        </div>
        <div style={{ marginBottom: 16 }}>
          <select style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '0.5px solid #C4B9A8', background: '#F5F0E8', fontSize: 13, fontFamily: 'inherit' }}>
            <option>2 guests</option><option>3 guests</option><option>4 guests</option><option>5 guests</option><option>6 guests</option>
          </select>
        </div>

        <button
          onClick={() => { onClose(); alert('Booking request sent! (Demo mode — in production this integrates with TheFork/OpenTable)'); }}
          style={{ width: '100%', background: '#1A1614', color: '#FDFBF7', border: 'none', borderRadius: 10, padding: '14px', fontSize: 14, fontWeight: 500, cursor: 'pointer', marginBottom: 8 }}
        >
          Request booking
        </button>
        <button onClick={onClose} style={{ width: '100%', background: 'transparent', color: '#8B7E71', border: '0.5px solid #C4B9A8', borderRadius: 10, padding: '12px', fontSize: 13, cursor: 'pointer' }}>
          Cancel
        </button>
      </div>
    </div>
  );
}
