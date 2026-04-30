'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { analytics } from '@/lib/analytics';

const FILTER_OPTIONS: { filter: string; label: string; icon: string }[] = [
  { filter: 'vegan', label: 'Vegan', icon: '🌱' },
  { filter: 'gf', label: 'Gluten-free', icon: '🌾' },
  { filter: 'nut-free', label: 'Nut-free', icon: '🫘' },
  { filter: 'dairy-free', label: 'Dairy-free', icon: '🥛' },
];

export default function WaitlistPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: 180, background: '#1A1614' }} />}>
      <WaitlistContent />
    </Suspense>
  );
}

function WaitlistContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isRestaurant = searchParams.get('type') === 'restaurant';
  const [email, setEmail] = useState('');
  const [restaurantName, setRestaurantName] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [filters, setFilters] = useState<string[]>([]);
  const [consent, setConsent] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function toggleFilter(f: string) {
    setFilters((prev) => (prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]));
  }

  async function handleSubmit() {
    if (isRestaurant && !restaurantName.trim()) {
      setError('Please enter your restaurant name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!consent) {
      setError('Please confirm you consent to join the waitlist.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      if (supabase) {
        await supabase.from('waitlist').insert({
          email: email.trim().toLowerCase(),
          dietary_filters: isRestaurant
            ? ['restaurant', restaurantName.trim(), cuisine.trim()].filter(Boolean)
            : filters,
          consent_given: true,
          consent_timestamp: new Date().toISOString(),
        });
      }
      analytics.waitlistJoined(isRestaurant ? ['restaurant'] : filters);
      if (isRestaurant) {
        setSubmitted(true);
        return;
      }
      router.push('/waitlist/success');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (isRestaurant && submitted) {
    return (
      <div style={{ padding: '40px 20px', fontFamily: 'Inter, -apple-system, sans-serif', textAlign: 'center' }}>
        <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#EDF4EE', color: '#7EA884', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px', fontSize: 22 }}>✓</div>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 24, fontWeight: 400, color: '#1A1614', margin: '0 0 10px' }}>Thank you!</h1>
        <p style={{ fontSize: 14, color: '#8B7E71', lineHeight: 1.6, margin: '0 auto', maxWidth: 320 }}>
          We&apos;ll contact you within 24 hours to set up your menu together.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div
        style={{
          minHeight: 180,
          background: 'linear-gradient(135deg, #1A1614, #2B2420, #3A302A)',
          padding: '32px 20px 24px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: -40,
            right: -40,
            width: 140,
            height: 140,
            borderRadius: '50%',
            background: 'rgba(200,85,58,0.08)',
            pointerEvents: 'none',
          }}
        />
        <div style={{ fontSize: 9, fontWeight: 700, color: '#C8553A', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
          {isRestaurant ? 'For restaurants' : 'Coming everywhere'}
        </div>
        <div style={{ fontSize: 26, fontWeight: 800, color: '#E8EAE5', letterSpacing: '-0.4px', lineHeight: 1.2, marginBottom: 8 }}>
          {isRestaurant ? <>Let diners find{'\n'}what works.</> : <>Eat freely.{'\n'}Everywhere.</>}
        </div>
        <div style={{ fontSize: 11, color: 'rgba(232,234,229,0.65)', lineHeight: 1.5 }}>
          {isRestaurant
            ? <>Request early access and we&apos;ll help set up{'\n'}your allergen-aware menu.</>
            : <>2,400+ people waiting for PlateMatch to expand.{'\n'}Join them and be first to know.</>}
        </div>
      </div>

      <div style={{ padding: '20px 16px' }}>
        {isRestaurant && (
          <>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: '#8B7E71', display: 'block', marginBottom: 6 }}>
                Restaurant name
              </label>
              <input
                type="text"
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
                placeholder="L'Artigiano del Gusto"
                style={{
                  width: '100%',
                  background: '#FFFFFF',
                  border: '1.5px solid #C4B9A8',
                  borderRadius: 12,
                  padding: '12px 14px',
                  fontSize: 13,
                  color: '#1A1614',
                  outline: 'none',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = '#C8553A')}
                onBlur={(e) => (e.currentTarget.style.borderColor = '#C4B9A8')}
              />
            </div>
          </>
        )}

        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: '#8B7E71', display: 'block', marginBottom: 6 }}>
            Email address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            style={{
              width: '100%',
              background: '#FFFFFF',
              border: '1.5px solid #C4B9A8',
              borderRadius: 12,
              padding: '12px 14px',
              fontSize: 13,
              color: '#1A1614',
              outline: 'none',
              fontFamily: 'inherit',
              boxSizing: 'border-box',
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = '#C8553A')}
            onBlur={(e) => (e.currentTarget.style.borderColor = '#C4B9A8')}
          />
        </div>

        {isRestaurant ? (
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: '#8B7E71', display: 'block', marginBottom: 6 }}>
              Cuisine type
            </label>
            <select
              value={cuisine}
              onChange={(e) => setCuisine(e.target.value)}
              style={{
                width: '100%',
                background: '#FFFFFF',
                border: '1.5px solid #C4B9A8',
                borderRadius: 12,
                padding: '12px 14px',
                fontSize: 13,
                color: '#1A1614',
                outline: 'none',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
              }}
            >
              <option value="">Select a cuisine</option>
              <option value="Italian">Italian</option>
              <option value="Japanese">Japanese</option>
              <option value="Indian">Indian</option>
              <option value="Thai">Thai</option>
              <option value="Greek">Greek</option>
              <option value="Mexican">Mexican</option>
              <option value="British">British</option>
              <option value="Other">Other</option>
            </select>
          </div>
        ) : (
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#8B7E71', marginBottom: 8 }}>
              What works for you? (optional)
            </div>
            <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
              {FILTER_OPTIONS.map((opt) => {
                const active = filters.includes(opt.filter);
                return (
                  <button
                    key={opt.filter}
                    onClick={() => toggleFilter(opt.filter)}
                    style={{
                      background: active ? '#1A1614' : '#F5F0E8',
                      color: active ? '#FDFBF7' : '#8B7E71',
                      border: `1px solid ${active ? '#1A1614' : '#C4B9A8'}`,
                      borderRadius: 100,
                      padding: '7px 14px',
                      fontSize: 11,
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    {opt.icon} {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <label
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 10,
            cursor: 'pointer',
            marginBottom: 16,
          }}
        >
          <div
            onClick={() => setConsent((v) => !v)}
            style={{
              width: 18,
              height: 18,
              borderRadius: 5,
              border: `2px solid ${consent ? '#C8553A' : '#C4B9A8'}`,
              background: consent ? '#C8553A' : 'transparent',
              flexShrink: 0,
              marginTop: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            {consent && <span style={{ fontSize: 11, fontWeight: 800, color: '#FDFBF7' }}>✓</span>}
          </div>
          <span style={{ fontSize: 11, color: '#8B7E71', lineHeight: 1.5 }}>
            I agree to receive updates about PlateMatch and confirm I am over 13. You can unsubscribe at any time.
          </span>
        </label>

        {error && (
          <div style={{ fontSize: 11, color: '#A83226', marginBottom: 12, fontWeight: 600 }}>{error}</div>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: '100%',
            background: loading ? '#8B7E71' : '#1A1614',
            color: '#FDFBF7',
            border: 'none',
            borderRadius: 14,
            padding: '15px 20px',
            fontSize: 13,
            fontWeight: 800,
            cursor: loading ? 'not-allowed' : 'pointer',
            marginBottom: 12,
          }}
        >
          {loading ? 'Joining…' : isRestaurant ? 'Request early access' : 'Join the waitlist →'}
        </button>

        <div style={{ textAlign: 'center', fontSize: 10, color: '#8B7E71', lineHeight: 1.6 }}>
          UK GDPR compliant · ICO registered · Never shared
        </div>
      </div>
    </div>
  );
}
