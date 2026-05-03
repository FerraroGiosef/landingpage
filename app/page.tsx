'use client';

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { analytics } from '@/lib/analytics';

const STATS = [
  { value: '2M+', label: 'People in UK with food allergies' },
  { value: '3.6×', label: 'More engagement on filtered menus' },
  { value: 'Set once', label: 'Eat everywhere' },
];

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Set your needs',
    desc: 'Select your allergens and dietary preferences once. We remember nothing between sessions — you stay in control.',
  },
  {
    step: '02',
    title: 'Browse matches',
    desc: "Restaurants are ranked by how many of their dishes are compatible with your needs. The number you see is real — dishes, not percentages.",
  },
  {
    step: '03',
    title: 'Dine with clarity',
    desc: 'See exactly what you can eat before you arrive. Every dish shows its declared allergens. Always confirm with the restaurant.',
  },
];

const RESTAURANT_FEATURES = [
  {
    title: 'Reach',
    desc: 'Customers who need you find you automatically',
  },
  {
    title: 'Save time',
    desc: 'No more explaining allergens at every table',
  },
  {
    title: 'Stay ready',
    desc: "Owen's Law audit trail built in",
  },
];

const MOCK_DISHES = [
  { name: 'Risotto ai Funghi', price: '£16.50' },
  { name: 'Sorbetto al Limone', price: '£6.00' },
  { name: 'Insalata Verde', price: '£6.50' },
];

const FEATURES = [
  {
    title: 'Filter by your needs',
    sub: '14 UK allergens + dietary preferences',
  },
  {
    title: 'See compatible dishes',
    sub: 'Every dish checked, restaurant by restaurant',
  },
  {
    title: 'Group Match',
    sub: 'Find restaurants for different dietary requirements',
  },
];

export default function LandingPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleWaitlist(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      if (supabase) {
        await supabase.from('waitlist').upsert({
          email: email.trim().toLowerCase(),
          consent_given: true,
          consent_timestamp: new Date().toISOString(),
        });
      }
      analytics.waitlistJoined([]);
      setSubmitted(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <div style={{ background: '#FDFBF7', fontFamily: 'Inter, -apple-system, sans-serif' }}>

      {/* ── NAV ── */}
      <nav style={{ background: '#0F0E0C', borderBottom: '0.5px solid rgba(196,185,168,0.15)', padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <span style={{ fontFamily: 'Georgia, serif', fontSize: 18, fontWeight: 400, color: '#FDFBF7', letterSpacing: '-0.3px' }}>PlateMatch</span>
        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>

          <button onClick={() => location.href = "app"} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: '#A09A8F', padding: 0, fontFamily: 'inherit'}}>
            App
          </button>
          <button onClick={() => scrollTo('how-it-works')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: '#A09A8F', padding: 0, fontFamily: 'inherit', transition: 'all 0.15s ease' }}>
            How it works
          </button>
          <button onClick={() => scrollTo('for-restaurants')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: '#A09A8F', padding: 0, fontFamily: 'inherit', transition: 'all 0.15s ease' }}>
            For restaurants
          </button>
          
          <button onClick={() => scrollTo('waitlist-form')} style={{ background: '#C8553A', color: '#FDFBF7', border: 'none', borderRadius: 100, padding: '8px 18px', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s ease' }}>
            Join waitlist
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ background: '#0F0E0C', padding: '64px 24px 0', minHeight: 600, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 30% 50%, rgba(200,85,58,0.06) 0%, transparent 60%), radial-gradient(circle at 80% 20%, rgba(196,185,168,0.04) 0%, transparent 50%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 760, width: '100%', display: 'grid', gridTemplateColumns: '1fr auto', gap: 48, alignItems: 'start', position: 'relative' }}>
          {/* Left: copy + form */}
          <div>
            {/* Tag */}
            <div style={{ display: 'inline-block', background: 'rgba(200,85,58,0.15)', border: '0.5px solid rgba(200,85,58,0.35)', borderRadius: 100, padding: '5px 12px', fontSize: 11, color: '#C8553A', fontWeight: 500, marginBottom: 20 }}>
              Launching in London
            </div>

            {/* Headline */}
            <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 30, fontWeight: 400, color: '#FDFBF7', lineHeight: 1.2, marginBottom: 16, letterSpacing: '-0.5px' }}>
              Every restaurant. Matched to you.
            </h1>

            {/* Paragraph */}
            <p style={{ fontSize: 14, color: '#A09A8F', lineHeight: 1.7, marginBottom: 32, maxWidth: 380 }}>
              PlateMatch matches your dietary requirements to restaurant menus — dish by dish, restaurant by restaurant. Set your needs once. See what&apos;s compatible. Book with confidence. All verified directly by the restaurant.
            </p>

            {submitted ? (
              <div style={{ background: 'rgba(126,168,132,0.12)', border: '0.5px solid rgba(126,168,132,0.3)', borderRadius: 12, padding: '20px 24px' }}>
                <div style={{ fontSize: 16, color: '#7EA884', fontFamily: 'Georgia, serif', marginBottom: 4 }}>You&apos;re on the list.</div>
                <p style={{ fontSize: 12, color: '#A09A8F', margin: 0 }}>We&apos;ll be in touch when PlateMatch opens in your area.</p>
              </div>
            ) : (
              <form id="waitlist-form" onSubmit={handleWaitlist}>
                <div style={{ display: 'flex', gap: 10, marginBottom: 10, flexWrap: 'wrap' }}>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    style={{
                      flex: '1 1 240px',
                      background: 'rgba(253,251,247,0.07)',
                      border: '0.5px solid rgba(196,185,168,0.3)',
                      borderRadius: 10,
                      padding: '12px 16px',
                      fontSize: 14,
                      color: '#FDFBF7',
                      outline: 'none',
                      fontFamily: 'inherit',
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(200,85,58,0.6)')}
                    onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(196,185,168,0.3)')}
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    style={{ background: loading ? '#8B7E71' : '#C8553A', color: '#FDFBF7', border: 'none', borderRadius: 10, padding: '12px 24px', fontSize: 14, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap', transition: 'all 0.15s ease' }}
                  >
                    {loading ? 'Joining…' : 'Join waitlist'}
                  </button>
                </div>

                {/* Free for diners */}
                <div style={{ fontSize: 10.5, color: '#6B6760', marginBottom: 10 }}>Free for diners. Always.</div>

                {/* Consent — no checkbox */}
                <p style={{ fontSize: 10.5, color: '#6B6760', lineHeight: 1.5, margin: '0 0 8px' }}>
                  By joining you agree to receive launch updates. Unsubscribe anytime.{' '}
                  <Link href="/privacy" style={{ color: '#A09A8F', textDecoration: 'underline' }}>Privacy Policy</Link>
                </p>

                {error && <p style={{ fontSize: 11, color: '#C8553A', margin: '4px 0 0' }}>{error}</p>}

                {/* Feature list */}
                <div style={{ borderTop: '0.5px solid rgba(245,240,232,0.06)', marginTop: 24, paddingTop: 20, display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                  {FEATURES.map((f) => (
                    <div key={f.title} style={{ flex: '1 1 100px', minWidth: 80 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 3 }}>
                        <span style={{ fontSize: 10, color: '#7EA884' }}>✓</span>
                        <span style={{ fontSize: 12, fontWeight: 500, color: '#F5F0E8' }}>{f.title}</span>
                      </div>
                      <div style={{ fontSize: 10, color: '#6B6760', lineHeight: 1.45 }}>{f.sub}</div>
                    </div>
                  ))}
                </div>
              </form>
            )}

            {/* Stats */}
            <div style={{ display: 'flex', gap: 24, marginTop: 40, paddingTop: 32, borderTop: '0.5px solid rgba(196,185,168,0.12)', flexWrap: 'wrap' }}>
              {STATS.map((s) => (
                <div key={s.value} style={{ minWidth: 120, flex: '1 1 120px' }}>
                  <div style={{ fontFamily: 'Georgia, serif', fontSize: 22, color: '#FDFBF7', fontWeight: 400 }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: '#6B6760', marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: phone mockup */}
          <PhoneMockup />
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" style={{ background: '#FDFBF7', padding: '80px 24px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 26, fontWeight: 400, color: '#1A1614', marginBottom: 8, letterSpacing: '-0.3px' }}>How it works</h2>
            <p style={{ fontSize: 14, color: '#8B7E71' }}>Three steps. No more guesswork.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
            {HOW_IT_WORKS.map((item) => (
              <div key={item.step} style={{ background: '#F5F0E8', borderRadius: 14, padding: '24px', border: '0.5px solid #C4B9A8' }}>
                <div style={{ fontSize: 11, color: '#C8553A', fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 12 }}>{item.step}</div>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: 17, color: '#1A1614', marginBottom: 10, fontWeight: 400 }}>{item.title}</div>
                <p style={{ fontSize: 13, color: '#8B7E71', lineHeight: 1.65, margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── QUOTE ── */}
      <section style={{ background: '#F5F0E8', padding: '64px 24px', borderTop: '0.5px solid #C4B9A8', borderBottom: '0.5px solid #C4B9A8' }}>
        <div style={{ maxWidth: 560, margin: '0 auto', textAlign: 'center' }}>
          <blockquote style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 18, color: '#1A1614', lineHeight: 1.65, margin: 0, marginBottom: 16 }}>
            &ldquo;I spend 15 minutes on Google every time I eat out. I just want to know what I can actually eat.&rdquo;
          </blockquote>
          <cite style={{ fontSize: 12, color: '#8B7E71', fontStyle: 'normal' }}>— Vegan diner, London</cite>
        </div>
      </section>

      {/* ── FOR RESTAURANTS ── */}
      <section id="for-restaurants" style={{ background: '#1A1614', padding: '80px 24px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div style={{ display: 'inline-block', background: 'rgba(200,85,58,0.15)', border: '0.5px solid rgba(200,85,58,0.35)', borderRadius: 100, padding: '5px 12px', fontSize: 11, color: '#C8553A', fontWeight: 500, marginBottom: 20 }}>
            For restaurants
          </div>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 26, color: '#FDFBF7', fontWeight: 400, letterSpacing: '-0.3px', marginBottom: 12 }}>
            Let your menu answer before they ask.
          </h2>
          <p style={{ fontSize: 14, color: '#A09A8F', lineHeight: 1.65, maxWidth: 460, marginBottom: 48 }}>
            Your staff spends time explaining allergens to every customer who asks. Your kitchen worries about getting it wrong. And the customers who don&apos;t ask? They just don&apos;t come back. PlateMatch gives them the answers before they walk in — so your staff serves food, not explanations.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 40 }}>
            {RESTAURANT_FEATURES.map((f) => (
              <div key={f.title} style={{ background: 'rgba(253,251,247,0.05)', border: '0.5px solid rgba(196,185,168,0.15)', borderRadius: 14, padding: '24px' }}>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: 16, color: '#FDFBF7', marginBottom: 8, fontWeight: 400 }}>{f.title}</div>
                <p style={{ fontSize: 12, color: '#A09A8F', lineHeight: 1.65, margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <Link href="/waitlist?type=restaurant" style={{ background: '#C8553A', color: '#FDFBF7', padding: '12px 24px', borderRadius: 10, fontSize: 13, textDecoration: 'none', fontFamily: 'inherit', transition: 'all 0.15s ease' }}>
              Register your restaurant →
            </Link>
            <button onClick={() => scrollTo('how-it-works')} style={{ background: 'transparent', color: '#F5F0E8', border: '1px solid rgba(245,240,232,0.2)', borderRadius: 10, padding: '12px 24px', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s ease' }}>
              See how it works
            </button>
            <span style={{ fontSize: 12, color: '#6B6760', width: '100%' }}>From £29/month · Free onboarding for early partners</span>
          </div>
        </div>
      </section>

      {/* ── GDPR ── */}
      <section style={{ background: '#FDFBF7', padding: '64px 24px', borderTop: '0.5px solid #C4B9A8' }}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 22, color: '#1A1614', fontWeight: 400, marginBottom: 16, letterSpacing: '-0.3px' }}>Your data, your control</h2>
          <p style={{ fontSize: 13, color: '#8B7E71', marginBottom: 20, lineHeight: 1.65 }}>
            PlateMatch is ICO registered and fully compliant with the UK GDPR, the Data Protection Act 2018, and PECR.
          </p>
          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              'We collect only your email address for the waitlist',
              'Used solely to notify you when PlateMatch launches',
              'Never sold, shared, or transferred to third parties',
              'Unsubscribe and request deletion at any time',
              'Data stored securely in UK/EEA on encrypted servers',
            ].map((item) => (
              <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, color: '#8B7E71' }}>
                <span style={{ color: '#7EA884', flexShrink: 0 }}>✓</span>
                {item}
              </li>
            ))}
          </ul>
          <div style={{ background: '#F5F0E8', borderRadius: 10, padding: '12px 16px', fontSize: 12, color: '#8B7E71', border: '0.5px solid #C4B9A8' }}>
            <strong style={{ color: '#1A1614', fontWeight: 500 }}>Lawful basis:</strong> Consent (Art. 6(1)(a) UK GDPR) ·{' '}
            <strong style={{ color: '#1A1614', fontWeight: 500 }}>Contact:</strong>{' '}
            <a href="mailto:privacy@platematch.app" style={{ color: '#8B7E71' }}>privacy@platematch.app</a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: '#0F0E0C', padding: '32px 24px', borderTop: '0.5px solid rgba(196,185,168,0.12)' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <span style={{ fontFamily: 'Georgia, serif', fontSize: 14, color: 'rgba(253,251,247,0.4)', letterSpacing: '-0.2px' }}>PlateMatch</span>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            {[
              { label: 'Privacy Policy', href: '/privacy' },
              { label: 'Cookie Policy', href: '/cookies' },
              { label: 'Terms', href: '/terms' },
              { label: 'Consumer App', href: '/app' },
              { label: 'For Restaurants', href: '/waitlist?type=restaurant' },
            ].map((l) => (
              <Link key={l.href} href={l.href} style={{ fontSize: 11, color: 'rgba(253,251,247,0.35)', textDecoration: 'none' }}>
                {l.label}
              </Link>
            ))}
          </div>
          <span style={{ fontSize: 11, color: 'rgba(253,251,247,0.25)', width: '100%' }}>
            © 2026 PlateMatch Ltd · London, UK · ICO Reg: ZB123456
          </span>
        </div>
      </footer>
    </div>
  );
}

function PhoneMockup() {
  return (
    <div
      style={{
        width: 220,
        background: '#1A1614',
        borderRadius: 28,
        border: '2px solid rgba(196,185,168,0.2)',
        padding: '12px 10px',
        flexShrink: 0,
        marginTop: 0,
        boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
        alignSelf: 'flex-start',
      }}
    >
      {/* notch */}
      <div style={{ width: 60, height: 8, background: 'rgba(196,185,168,0.12)', borderRadius: 100, margin: '0 auto 12px' }} />

      {/* top bar */}
      <div style={{ background: '#FDFBF7', borderRadius: 14, padding: '10px 10px 8px', marginBottom: 8 }}>
        <div style={{ fontFamily: 'Georgia, serif', fontSize: 11, color: '#1A1614', marginBottom: 2, fontWeight: 400 }}>Good evening</div>
        <div style={{ fontSize: 9, color: '#8B7E71', marginBottom: 8 }}>Find restaurants that match your needs</div>
        <div style={{ display: 'flex', gap: 5 }}>
          {['Gluten-free', 'Vegan'].map((filter) => (
            <span key={filter} style={{ background: '#1A1614', color: '#FDFBF7', borderRadius: 100, padding: '4px 8px', fontSize: 7.5, fontWeight: 500 }}>
              {filter}
            </span>
          ))}
        </div>
      </div>

      {/* restaurant card */}
      <div style={{ background: '#FDFBF7', borderRadius: 10, overflow: 'hidden', marginBottom: 6, border: '0.5px solid #C4B9A8' }}>
        <div style={{ height: 48, background: 'linear-gradient(135deg, #6B5E52, #3A302A)', position: 'relative' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 25%, rgba(0,0,0,0.58) 100%)' }} />
          <div style={{ position: 'absolute', bottom: 5, left: 7, right: 5, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 5 }}>
            <div>
              <div style={{ fontFamily: 'Georgia, serif', fontSize: 8.5, color: '#FDFBF7', fontWeight: 400, marginBottom: 2 }}>L&apos;Artigiano del Gusto</div>
              <div style={{ fontSize: 6.5, color: 'rgba(253,251,247,0.75)' }}>6 dishes match your filters</div>
            </div>
            <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(0,0,0,0.6)', border: '1.5px solid #C8553A', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontSize: 8, color: '#FDFBF7', fontFamily: 'Georgia, serif', lineHeight: 1 }}>6</span>
            </div>
          </div>
        </div>
        <div style={{ padding: '6px' }}>
          {MOCK_DISHES.map((dish) => (
            <div key={dish.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6, padding: '5px 0', borderBottom: dish.name === 'Insalata Verde' ? 'none' : '0.5px solid #E7DED1' }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 7.5, color: '#1A1614', fontWeight: 500, marginBottom: 3 }}>{dish.name}</div>
                <div style={{ display: 'flex', gap: 3 }}>
                  {['GF', 'Vegan'].map((tag) => (
                    <span key={tag} style={{ background: '#EDF4EE', color: '#456B4B', borderRadius: 100, padding: '1px 4px', fontSize: 6 }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <span style={{ fontFamily: 'Georgia, serif', fontSize: 7.5, color: '#1A1614', flexShrink: 0 }}>{dish.price}</span>
            </div>
          ))}
        </div>
      </div>

      {/* disclaimer */}
      <div style={{ textAlign: 'center', marginTop: 4 }}>
        <span style={{ fontSize: 7, color: '#C4B9A8', fontStyle: 'italic' }}>Example preview — fictional restaurants</span>
      </div>
    </div>
  );
}
