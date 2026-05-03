'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { getDishById, getRestaurantById } from '@/lib/data/restaurants';
import { getAllergenSummary, getDishTags, filterMatchesDish, UK_ALLERGENS } from '@/lib/scoring';

export default function DishDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [imgError, setImgError] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [showAskModal, setShowAskModal] = useState(false);
  const [showBookModal, setShowBookModal] = useState(false);

  useEffect(() => {
    const filtersParam = searchParams.get('filters') || '';
    if (filtersParam) {
      setActiveFilters(filtersParam.split(',').filter(Boolean));
    } else {
      const saved = sessionStorage.getItem('pm_filters');
      if (saved) { try { setActiveFilters(JSON.parse(saved)); } catch {} }
    }
  }, [searchParams]);

  const dish = getDishById(Number(params.id));
  if (!dish) return <div style={{ padding: 32, textAlign: 'center', color: '#8B7E71' }}>Dish not found.</div>;

  const restaurant = getRestaurantById(dish.restaurantId);
  const { contains, traces } = getAllergenSummary(dish.allergens);
  const tags = getDishTags(dish);
  const { compatible: isCompatible, traceWarnings } = filterMatchesDish(dish, activeFilters);
  const hasFilters = activeFilters.length > 0;

  const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div style={{ fontFamily: 'Inter, -apple-system, sans-serif', paddingBottom: 80 }}>
      {/* Hero */}
      <div style={{ position: 'relative', height: 200 }}>
        {dish.image && !imgError ? (
          <Image src={dish.image} alt={dish.name} fill style={{ objectFit: 'cover' }} onError={() => setImgError(true)} sizes="430px" />
        ) : (
          <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #4A3F38, #1A1614)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48 }}>🍽️</div>
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, rgba(26,22,20,0.7) 100%)' }} />
        <button onClick={() => router.back()} style={{ position: 'absolute', top: 16, left: 16, width: 36, height: 36, borderRadius: '50%', background: 'rgba(253,251,247,0.15)', backdropFilter: 'blur(8px)', border: '0.5px solid rgba(253,251,247,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 16, color: '#FDFBF7' }}>←</button>
        <button style={{ position: 'absolute', top: 16, right: 16, width: 36, height: 36, borderRadius: '50%', background: 'rgba(253,251,247,0.15)', backdropFilter: 'blur(8px)', border: '0.5px solid rgba(253,251,247,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 15, color: '#FDFBF7' }}>🤍</button>
        {hasFilters && isCompatible && (
          <div style={{ position: 'absolute', bottom: 12, left: 14, background: '#7EA884', borderRadius: 8, padding: '5px 10px', fontSize: 11, color: '#FFFFFF', fontWeight: 500 }}>
            ✓ Matches your filter
          </div>
        )}
      </div>

      <div style={{ padding: '16px 16px 24px' }}>
        {/* Dish name + restaurant + price */}
        <div style={{ marginBottom: 16 }}>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 22, fontWeight: 400, color: '#1A1614', margin: '0 0 4px', letterSpacing: '-0.3px' }}>{dish.name}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <span style={{ fontSize: 13, color: '#8B7E71' }}>{restaurant?.name}</span>
            <span style={{ color: '#C4B9A8', fontSize: 11 }}>·</span>
            <span style={{ fontFamily: 'Georgia, serif', fontSize: 18, color: '#C8553A', fontWeight: 400 }}>{dish.price}</span>
          </div>

          {/* Active filter box */}
          {hasFilters && (
            <div style={{ background: '#1A1614', borderRadius: 12, padding: '12px 14px', marginBottom: 16 }}>
              <div className="label-upper" style={{ color: '#8B7E71', marginBottom: 4 }}>Your active filter</div>
              <div style={{ fontSize: 13, color: '#FDFBF7', marginBottom: 6 }}>{activeFilters.join(' · ')}</div>
              <div style={{ fontSize: 12, color: isCompatible ? '#7EA884' : '#C2A46E' }}>
                {isCompatible ? '✓ This dish matches all your requirements' : '⚠ This dish may not match all your requirements'}
              </div>
              {traceWarnings.length > 0 && (
                <div style={{ fontSize: 11, color: '#C2A46E', marginTop: 4 }}>
                  May contain traces of {traceWarnings.join(', ')}
                </div>
              )}
            </div>
          )}

          <p style={{ fontSize: 14, color: '#8B7E71', lineHeight: 1.65, margin: 0 }}>{dish.description}</p>
        </div>

        {/* Nutrition */}
        {dish.kcal && (
          <div style={{ background: '#F5F0E8', borderRadius: 12, padding: '16px', marginBottom: 20 }}>
            <div className="label-upper" style={{ color: '#8B7E71', marginBottom: 12 }}>Nutritional information</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
              {[
                { val: dish.kcal, label: 'kcal' },
                { val: dish.protein ? `${dish.protein}g` : '–', label: 'protein' },
                { val: dish.carbs ? `${dish.carbs}g` : '–', label: 'carbs' },
                { val: dish.fat ? `${dish.fat}g` : '–', label: 'fat' },
              ].map((n) => (
                <div key={n.label} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 16, fontWeight: 500, color: '#1A1614' }}>{n.val}</div>
                  <div style={{ fontSize: 10, color: '#8B7E71', marginTop: 2 }}>{n.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dietary tags */}
        <div style={{ marginBottom: 20 }}>
          <div className="label-upper" style={{ color: '#8B7E71', marginBottom: 10 }}>Dietary information</div>
          <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
            {[
              { key: 'vegan', label: 'Vegan', active: dish.isVegan },
              { key: 'vegetarian', label: 'Vegetarian', active: dish.isVegetarian },
              { key: 'gf', label: 'GF', active: dish.allergens.gluten === 'no' },
              { key: 'nut-free', label: 'Nut-free', active: dish.allergens.peanuts === 'no' && dish.allergens.treeNuts === 'no' },
              { key: 'dairy-free', label: 'Dairy-free', active: dish.allergens.milk === 'no' },
            ].map((tag) => (
              <span
                key={tag.key}
                style={{
                  background: tag.active ? '#1A1614' : 'transparent',
                  color: tag.active ? '#FDFBF7' : '#8B7E71',
                  border: `0.5px solid ${tag.active ? '#1A1614' : '#C4B9A8'}`,
                  borderRadius: 100,
                  padding: '5px 12px',
                  fontSize: 12,
                }}
              >
                {tag.label}
              </span>
            ))}
          </div>
        </div>

        {/* Allergen section */}
        <div style={{ marginBottom: 20 }}>
          <div className="label-upper" style={{ color: '#8B7E71', marginBottom: 12 }}>Allergen information</div>

          {contains.length === 0 && traces.length === 0 ? (
            <div style={{ background: '#EDF4EE', border: '0.5px solid rgba(126,168,132,0.3)', borderRadius: 10, padding: '12px 14px', fontSize: 13, color: '#456B4B', fontWeight: 500 }}>
              No regulated allergens detected
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {contains.map((a) => (
                <div key={a} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#C67A5C', flexShrink: 0 }} />
                  <span style={{ flex: 1, fontSize: 14, color: '#1A1614' }}>{a}</span>
                  <span style={{ background: '#F9EFEA', color: '#8A4A32', borderRadius: 100, padding: '3px 10px', fontSize: 11 }}>Contains</span>
                </div>
              ))}
              {traces.map((a) => (
                <div key={a} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#C2A46E', flexShrink: 0 }} />
                  <span style={{ flex: 1, fontSize: 14, color: '#1A1614' }}>{a}</span>
                  <span style={{ background: '#F8F2E6', color: '#7A6432', borderRadius: 100, padding: '3px 10px', fontSize: 11 }}>May contain traces</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Legal disclaimer */}
        <div style={{ background: '#F5F0E8', borderRadius: 10, padding: '12px 14px', fontSize: 11, color: '#8B7E71', lineHeight: 1.6, border: '0.5px solid #C4B9A8' }}>
          <strong style={{ color: '#1A1614', fontWeight: 500 }}>Information declared by {restaurant?.name} · Last updated {restaurant?.lastUpdated ?? today}</strong>
          <br />
          Always confirm with restaurant staff before ordering. PlateMatch presents allergen information as declared by the restaurant. We cannot guarantee accuracy.
        </div>

        {traces.length > 0 && (
          <div style={{
            marginTop: 12,
            padding: '10px 14px',
            background: '#F8F2E6',
            borderRadius: 10,
            border: '0.5px solid #C2A46E',
          }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: '#7A6432', marginBottom: 3 }}>
              Cross-contamination notice
            </div>
            <div style={{ fontSize: 11, color: '#7A6432', lineHeight: 1.55 }}>
              This dish may have been prepared in a kitchen that also handles {traces.join(', ')}. If you have a severe allergy, please inform the restaurant staff before ordering.
            </div>
          </div>
        )}
      </div>

      {/* Bottom action bar */}
      <div style={{ position: 'fixed', bottom: 68, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 430, background: '#FDFBF7', borderTop: '0.5px solid #C4B9A8', padding: '12px 16px', display: 'flex', gap: 10, boxSizing: 'border-box' }}>
        <button onClick={() => setShowBookModal(true)} style={{ flex: 1, background: '#1A1614', color: '#FDFBF7', border: 'none', borderRadius: 10, padding: '12px', fontSize: 13, cursor: 'pointer' }}>
          Book a table
        </button>
        <button onClick={() => setShowAskModal(true)} style={{ flex: 1, background: 'transparent', color: '#1A1614', border: '0.5px solid #C4B9A8', borderRadius: 10, padding: '12px', fontSize: 13, cursor: 'pointer' }}>
          Ask the restaurant
        </button>
      </div>

      {showAskModal && (
        <AskRestaurantModal
          restaurantName={restaurant?.name || 'the restaurant'}
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
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(26,22,20,0.5)', zIndex: 100, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }} onClick={onClose}>
      <div style={{ background: '#FDFBF7', borderRadius: '20px 20px 0 0', padding: '24px 20px 32px', width: '100%', maxWidth: 480, maxHeight: '70vh', overflow: 'auto' }} onClick={(e) => e.stopPropagation()}>
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
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(26,22,20,0.5)', zIndex: 100, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }} onClick={onClose}>
      <div style={{ background: '#FDFBF7', borderRadius: '20px 20px 0 0', padding: '24px 20px 32px', width: '100%', maxWidth: 480 }} onClick={(e) => e.stopPropagation()}>
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
