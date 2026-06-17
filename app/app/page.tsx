'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { restaurants, getDishesByRestaurant } from '@/lib/data/restaurants';
import { getCompatibleCount } from '@/lib/scoring';
import { analytics } from '@/lib/analytics';
import type { DishAllergens } from '@/lib/types';
import EmptyState from '@/components/EmptyState';

const CUISINES: { name: string; flag: string }[] = [
  { name: 'Italian', flag: '🇮🇹' },
  { name: 'Japanese', flag: '🇯🇵' },
  { name: 'Indian', flag: '🇮🇳' },
  { name: 'Thai', flag: '🇹🇭' },
  { name: 'Greek', flag: '🇬🇷' },
  { name: 'Mexican', flag: '🇲🇽' },
  { name: 'Chinese', flag: '🇨🇳' },
  { name: 'French', flag: '🇫🇷' },
  { name: 'Lebanese', flag: '🇱🇧' },
  { name: 'British', flag: '🇬🇧' },
];

const ALLERGEN_CHIPS: { key: string; label: string }[] = [
  { key: 'gluten', label: 'Gluten-free' },
  { key: 'milk', label: 'Dairy-free' },
  { key: 'peanuts', label: 'Nut-free' },
  { key: 'eggs', label: 'Egg-free' },
  { key: 'fish', label: 'Fish-free' },
  { key: 'vegan', label: 'Vegan' },
];

const FILTER_CHIPS = ['All', 'Open now', 'Top rated', 'Nearest', 'Group match'];

const TIME_SLOTS = ['18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00'];
const PARTY_SIZES = [1, 2, 3, 4, 5, 6, 7, 8];

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function todayISO() {
  return new Date().toISOString().split('T')[0];
}

export default function AppHomePage() {
  const router = useRouter();
  const [activeCuisine, setActiveCuisine] = useState<string | null>(null);
  const [showCuisinePicker, setShowCuisinePicker] = useState(false);
  const [activeChip, setActiveChip] = useState('All');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [bookingRestaurant, setBookingRestaurant] = useState<string | null>(null);
  const [askingRestaurant, setAskingRestaurant] = useState<string | null>(null);

  // Booking form state
  const [bookingDate, setBookingDate] = useState(todayISO());
  const [bookingTime, setBookingTime] = useState('19:00');
  const [bookingParty, setBookingParty] = useState(2);
  const [bookingName, setBookingName] = useState('');
  const [bookingDone, setBookingDone] = useState(false);

  // Ask form state
  const [askMessage, setAskMessage] = useState('');
  const [askDone, setAskDone] = useState(false);

  useEffect(() => {
    const saved = sessionStorage.getItem('pm_filters');
    if (saved) {
      try { setActiveFilters(JSON.parse(saved)); } catch {}
    }
  }, []);

  function toggleFilter(key: string) {
    const newFilters = activeFilters.includes(key)
      ? activeFilters.filter((f) => f !== key)
      : [...activeFilters, key];
    setActiveFilters(newFilters);
    sessionStorage.setItem('pm_filters', JSON.stringify(newFilters));
  }

  function openBooking(name: string) {
    setBookingRestaurant(name);
    setBookingDate(todayISO());
    setBookingTime('19:00');
    setBookingParty(2);
    setBookingName('');
    setBookingDone(false);
  }

  function openAsk(name: string) {
    setAskingRestaurant(name);
    setAskMessage('');
    setAskDone(false);
  }

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
    .sort((a, b) => {
      if (activeChip === 'Nearest') {
        const distA = parseFloat(a.distance?.replace(' km', '') || '999');
        const distB = parseFloat(b.distance?.replace(' km', '') || '999');
        return distA - distB;
      }
      if (activeChip === 'Top rated') return b.rating - a.rating;
      if (activeChip === 'Group match') return b.compatibleCount - a.compatibleCount;
      return 0;
    });

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
              background: '#1A1614',
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

      {/* Allergen chips */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', padding: '0 16px 12px' }}>
        {ALLERGEN_CHIPS.map((chip) => {
          const active = activeFilters.includes(chip.key);
          return (
            <button
              key={chip.key}
              onClick={() => toggleFilter(chip.key)}
              style={{
                background: active ? '#1A1614' : '#F5F0E8',
                border: `0.5px solid ${active ? '#1A1614' : '#C4B9A8'}`,
                borderRadius: 100,
                padding: '5px 12px',
                fontSize: 11,
                color: active ? '#FDFBF7' : '#1A1614',
                cursor: 'pointer',
                fontFamily: 'inherit',
                whiteSpace: 'nowrap',
              }}
            >
              {chip.label}
            </button>
          );
        })}
        <button
          onClick={() => router.push('/app/allergens')}
          style={{
            background: '#F5F0E8',
            border: '0.5px dashed #C4B9A8',
            borderRadius: 100,
            padding: '5px 12px',
            fontSize: 11,
            color: '#1A1614',
            cursor: 'pointer',
            fontFamily: 'inherit',
            whiteSpace: 'nowrap',
          }}
        >
          + more
        </button>
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
        {(() => {
          const cuisineActive = !!activeCuisine;
          const flag = cuisineActive ? CUISINES.find((c) => c.name === activeCuisine)?.flag : null;
          return (
            <button
              onClick={() => setShowCuisinePicker(true)}
              style={{
                flexShrink: 0,
                padding: '7px 14px',
                background: cuisineActive ? '#F5F0E8' : 'transparent',
                border: `0.5px solid ${cuisineActive ? '#1A1614' : '#C4B9A8'}`,
                borderRadius: 100,
                fontSize: 12,
                color: cuisineActive ? '#1A1614' : '#8B7E71',
                fontWeight: cuisineActive ? 500 : 400,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                fontFamily: 'inherit',
              }}
            >
              {cuisineActive ? `${flag ?? ''} ${activeCuisine} ↑` : 'Cuisine ↓'}
            </button>
          );
        })()}
      </div>

      {activeFilters.length === 0 && <EmptyState />}

      {/* Restaurant cards */}
      <div id="restaurant-list" style={{ padding: '0 16px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ fontSize: 11, color: '#8B7E71', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>
          {filteredRestaurants.length} restaurants{activeFilters.length > 0 ? ` · ${filteredRestaurants.reduce((a, r) => a + r.compatibleCount, 0)} compatible dishes` : ''}
        </div>
        {filteredRestaurants.map((r) => (
          <RestaurantCard
            key={r.id}
            restaurant={r}
            compatibleCount={r.compatibleCount}
            totalDishes={r.dishCount}
            onBook={() => openBooking(r.name)}
            onAsk={() => openAsk(r.name)}
            onClick={() => {
              analytics.restaurantViewed(r.slug);
              router.push(`/app/restaurant/${r.slug}?filters=${activeFilters.join(',')}`);
            }}
          />
        ))}
      </div>

      {/* Cuisine picker bottom sheet */}
      {showCuisinePicker && (
        <div
          onClick={() => setShowCuisinePicker(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(26,22,20,0.45)', zIndex: 300, display: 'flex', alignItems: 'flex-end' }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ background: '#FDFBF7', borderRadius: '16px 16px 0 0', width: '100%', paddingBottom: 32, maxHeight: '80vh', overflowY: 'auto' }}
          >
            <div style={{ width: 40, height: 4, borderRadius: 2, background: '#C4B9A8', margin: '12px auto 14px' }} />
            <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 17, fontWeight: 400, color: '#1A1614', margin: '0 0 8px', padding: '0 20px', letterSpacing: '-0.2px' }}>
              Select cuisine
            </h3>
            <button
              type="button"
              onClick={() => { setActiveCuisine(null); setShowCuisinePicker(false); }}
              style={{ width: '100%', padding: '13px 20px', textAlign: 'left', background: 'none', border: 'none', borderBottom: '0.5px solid #F5F0E8', fontSize: 13, color: '#1A1614', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', fontFamily: 'inherit' }}
            >
              <span>All cuisines</span>
              {activeCuisine === null && (
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#C8553A' }} />
              )}
            </button>
            {CUISINES.map((c) => {
              const active = activeCuisine === c.name;
              return (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => {
                    setActiveCuisine(active ? null : c.name);
                    setShowCuisinePicker(false);
                  }}
                  style={{ width: '100%', padding: '13px 20px', textAlign: 'left', background: 'none', border: 'none', borderBottom: '0.5px solid #F5F0E8', fontSize: 13, color: '#1A1614', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', fontFamily: 'inherit' }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 18, lineHeight: 1 }}>{c.flag}</span>
                    <span>{c.name}</span>
                  </span>
                  {active && (
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#C8553A' }} />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Booking modal */}
      {bookingRestaurant && (
        <div
          onClick={() => setBookingRestaurant(null)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(26,22,20,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ background: '#FDFBF7', borderRadius: '20px', padding: '24px 20px 36px', width: '100%', maxWidth: 480, boxShadow: '0 4px 32px rgba(26,22,20,0.16)', maxHeight: '90vh', overflowY: 'auto' }}
          >
            {/* Drag handle */}
            <div style={{ width: 40, height: 4, borderRadius: 2, background: '#C4B9A8', margin: '0 auto 20px' }} />

            {bookingDone ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '8px 0 4px' }}>
                <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#EDF4EE', border: '0.5px solid rgba(126,168,132,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, color: '#7EA884', marginBottom: 16 }}>✓</div>
                <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 18, fontWeight: 400, color: '#1A1614', margin: '0 0 6px' }}>Request sent</h3>
                <p style={{ fontSize: 13, color: '#8B7E71', lineHeight: 1.6, margin: '0 0 20px', maxWidth: 280 }}>
                  {bookingRestaurant} will confirm your table for {bookingParty} on {new Date(bookingDate).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })} at {bookingTime}.
                </p>
                <button
                  onClick={() => setBookingRestaurant(null)}
                  style={{ background: '#1A1614', color: '#FDFBF7', border: 'none', borderRadius: 10, padding: '13px 32px', fontSize: 13, cursor: 'pointer' }}
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 18, fontWeight: 400, color: '#1A1614', margin: '0 0 4px' }}>
                  Book a table
                </h3>
                <p style={{ fontSize: 13, color: '#8B7E71', margin: '0 0 20px' }}>{bookingRestaurant}</p>

                {/* Date + time row */}
                <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: 11, color: '#8B7E71', marginBottom: 5 }}>Date</label>
                    <input
                      type="date"
                      value={bookingDate}
                      min={todayISO()}
                      onChange={(e) => setBookingDate(e.target.value)}
                      style={{ width: '100%', padding: '11px 12px', borderRadius: 10, border: '0.5px solid #C4B9A8', background: '#F5F0E8', fontSize: 13, fontFamily: 'inherit', color: '#1A1614', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: 11, color: '#8B7E71', marginBottom: 5 }}>Time</label>
                    <select
                      value={bookingTime}
                      onChange={(e) => setBookingTime(e.target.value)}
                      style={{ width: '100%', padding: '11px 12px', borderRadius: 10, border: '0.5px solid #C4B9A8', background: '#F5F0E8', fontSize: 13, fontFamily: 'inherit', color: '#1A1614', outline: 'none', boxSizing: 'border-box' }}
                    >
                      {TIME_SLOTS.map((t) => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                </div>

                {/* Party size */}
                <div style={{ marginBottom: 12 }}>
                  <label style={{ display: 'block', fontSize: 11, color: '#8B7E71', marginBottom: 8 }}>Party size</label>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {PARTY_SIZES.map((n) => (
                      <button
                        key={n}
                        onClick={() => setBookingParty(n)}
                        style={{
                          flex: 1,
                          padding: '9px 4px',
                          borderRadius: 8,
                          border: `0.5px solid ${bookingParty === n ? '#1A1614' : '#C4B9A8'}`,
                          background: bookingParty === n ? '#1A1614' : '#F5F0E8',
                          color: bookingParty === n ? '#FDFBF7' : '#8B7E71',
                          fontSize: 12,
                          cursor: 'pointer',
                          transition: 'all 0.12s',
                        }}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name */}
                <div style={{ marginBottom: 12 }}>
                  <label style={{ display: 'block', fontSize: 11, color: '#8B7E71', marginBottom: 5 }}>Name on booking</label>
                  <input
                    type="text"
                    value={bookingName}
                    onChange={(e) => setBookingName(e.target.value)}
                    placeholder="Your name"
                    style={{ width: '100%', padding: '11px 12px', borderRadius: 10, border: '0.5px solid #C4B9A8', background: '#F5F0E8', fontSize: 13, fontFamily: 'inherit', color: '#1A1614', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>

                {/* Message */}
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', fontSize: 11, color: '#8B7E71', marginBottom: 5 }}>Message for the restaurant</label>
                  <textarea
                    rows={2}
                    placeholder="Any dietary requirements or special requests?"
                    style={{ width: '100%', padding: '12px', borderRadius: 10, border: '0.5px solid #C4B9A8', background: '#F5F0E8', fontSize: 13, fontFamily: 'inherit', color: '#1A1614', outline: 'none', resize: 'none', boxSizing: 'border-box', lineHeight: 1.55 }}
                  />
                </div>

                <button
                  onClick={() => { if (bookingName.trim()) setBookingDone(true); }}
                  disabled={!bookingName.trim()}
                  style={{
                    width: '100%',
                    background: bookingName.trim() ? '#1A1614' : '#C4B9A8',
                    color: '#FDFBF7',
                    border: 'none',
                    borderRadius: 10,
                    padding: '14px',
                    fontSize: 13,
                    cursor: bookingName.trim() ? 'pointer' : 'not-allowed',
                    transition: 'background 0.15s',
                  }}
                >
                  Request booking
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Ask modal */}
      {askingRestaurant && (
        <div
          onClick={() => setAskingRestaurant(null)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(26,22,20,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ background: '#FDFBF7', borderRadius: '20px', padding: '24px 20px 36px', width: '100%', maxWidth: 480, boxShadow: '0 4px 32px rgba(26,22,20,0.16)', maxHeight: '90vh', overflowY: 'auto' }}
          >
            {/* Drag handle */}
            <div style={{ width: 40, height: 4, borderRadius: 2, background: '#C4B9A8', margin: '0 auto 20px' }} />

            {askDone ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '8px 0 4px' }}>
                <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#EDF4EE', border: '0.5px solid rgba(126,168,132,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, color: '#7EA884', marginBottom: 16 }}>✓</div>
                <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 18, fontWeight: 400, color: '#1A1614', margin: '0 0 6px' }}>Message sent</h3>
                <p style={{ fontSize: 13, color: '#8B7E71', lineHeight: 1.6, margin: '0 0 20px', maxWidth: 280 }}>
                  {askingRestaurant} will get back to you shortly.
                </p>
                <button
                  onClick={() => setAskingRestaurant(null)}
                  style={{ background: '#1A1614', color: '#FDFBF7', border: 'none', borderRadius: 10, padding: '13px 32px', fontSize: 13, cursor: 'pointer' }}
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 18, fontWeight: 400, color: '#1A1614', margin: '0 0 4px' }}>
                  Ask a question
                </h3>
                <p style={{ fontSize: 13, color: '#8B7E71', margin: '0 0 6px' }}>{askingRestaurant}</p>
                <p style={{ fontSize: 12, color: '#C4B9A8', margin: '0 0 16px', lineHeight: 1.5 }}>
                  Ask about allergens, dietary needs, or anything else before you visit.
                </p>

                <div style={{ marginBottom: 12 }}>
                  <label style={{ display: 'block', fontSize: 11, color: '#8B7E71', marginBottom: 5 }}>Your question</label>
                  <textarea
                    value={askMessage}
                    onChange={(e) => setAskMessage(e.target.value)}
                    rows={4}
                    placeholder="e.g. Do you have a dedicated fryer for nut-free dishes?"
                    style={{
                      width: '100%',
                      padding: '11px 12px',
                      borderRadius: 10,
                      border: '0.5px solid #C4B9A8',
                      background: '#F5F0E8',
                      fontSize: 13,
                      fontFamily: 'inherit',
                      color: '#1A1614',
                      outline: 'none',
                      resize: 'none',
                      lineHeight: 1.55,
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                {/* Quick prompts */}
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
                  {['Nut-free kitchen?', 'Vegan options?', 'Gluten-free menu?'].map((q) => (
                    <button
                      key={q}
                      onClick={() => setAskMessage(q)}
                      style={{ background: '#F5F0E8', border: '0.5px solid #C4B9A8', borderRadius: 100, padding: '5px 12px', fontSize: 11, color: '#8B7E71', cursor: 'pointer' }}
                    >
                      {q}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => { if (askMessage.trim()) setAskDone(true); }}
                  disabled={!askMessage.trim()}
                  style={{
                    width: '100%',
                    background: askMessage.trim() ? '#1A1614' : '#C4B9A8',
                    color: '#FDFBF7',
                    border: 'none',
                    borderRadius: 10,
                    padding: '14px',
                    fontSize: 13,
                    cursor: askMessage.trim() ? 'pointer' : 'not-allowed',
                    transition: 'background 0.15s',
                  }}
                >
                  Send message
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function RestaurantCard({
  restaurant,
  compatibleCount,
  totalDishes,
  onBook,
  onAsk,
  onClick,
}: {
  restaurant: { name: string; cuisine: string; location: string; address: string; rating: number; distance: string; isOpen: boolean; heroImage: string };
  compatibleCount: number;
  totalDishes: number;
  onBook: () => void;
  onAsk: () => void;
  onClick: () => void;
}) {
  const [imgError, setImgError] = useState(false);

  const tags = [];
  if (compatibleCount > 0) tags.push(`${compatibleCount} compatible`);
  if (restaurant.isOpen) tags.push('Open');

  return (
    <div
      onClick={onClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(26,22,20,0.08)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
      style={{ background: '#FFFFFF', border: '0.5px solid #C4B9A8', borderRadius: 14, overflow: 'hidden', width: '100%', textAlign: 'left', cursor: 'pointer', padding: 0, transition: 'transform 0.15s ease, box-shadow 0.15s ease' }}
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
          <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #4A3F38, #1A1614)' }} />
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
          <span style={{ fontSize: 12, color: restaurant.isOpen ? '#7EA884' : '#8B7E71' }}>{restaurant.isOpen ? 'Open' : 'Closed'}</span>
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
            onClick={(e) => { e.stopPropagation(); onBook(); }}
            style={{ flex: 1, background: 'transparent', color: '#1A1614', border: '0.5px solid #C4B9A8', borderRadius: 8, padding: '8px', fontSize: 12, cursor: 'pointer', transition: 'all 0.15s ease' }}
          >
            Book
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onAsk(); }}
            style={{ flex: 1, background: 'transparent', color: '#1A1614', border: '0.5px solid #C4B9A8', borderRadius: 8, padding: '8px', fontSize: 12, cursor: 'pointer', transition: 'all 0.15s ease' }}
          >
            Ask
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onClick(); }}
            style={{ flex: 2, background: '#1A1614', color: '#FDFBF7', border: 'none', borderRadius: 8, padding: '8px', fontSize: 12, cursor: 'pointer', transition: 'all 0.15s ease' }}
          >
            View menu
          </button>
        </div>
      </div>
    </div>
  );
}
