'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { analytics } from '@/lib/analytics';

const STATS = [
  { value: '2M+', label: 'allergen searches per month' },
  { value: '3.6×', label: 'more likely to revisit' },
  { value: '90s', label: 'to find a compatible dish' },
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
    icon: '⏱',
    title: '5 min setup',
    desc: 'Upload your menu PDF and allergen sheet. AI extracts and matches the data. You verify in minutes.',
  },
  {
    icon: '📈',
    title: '2.8× return visits',
    desc: 'Transparent menus build trust. Diners with dietary needs become your most loyal customers.',
  },
  {
    icon: '⚖️',
    title: "Owen's Law ready",
    desc: 'Full allergen audit trail per dish. Every update timestamped. Compliance documentation included.',
  },
];

const MOCK_CARDS = [
  { name: "L'Artigiano del Gusto", cuisine: 'Italian · Shoreditch', score: 9, total: 28, tag: 'GF options' },
  { name: 'Bella Cucina Verde', cuisine: 'Vegetarian · Camden', score: 14, total: 35, tag: 'Vegan · GF' },
  { name: 'Verde & Grano', cuisine: 'Farm-to-Table · Notting Hill', score: 11, total: 30, tag: 'Dairy-free' },
];

export default function LandingPage() {
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleWaitlist(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!consent) {
      setError('Please confirm consent to continue.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await supabase.from('waitlist').upsert({
        email: email.trim().toLowerCase(),
        consent_given: true,
        consent_timestamp: new Date().toISOString(),
      });
      analytics.waitlistJoined([]);
      setSubmitted(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ background: '#FDFBF7', fontFamily: 'Inter, -apple-system, sans-serif' }}>

      {/* ── NAV ── */}
      <nav style={{ background: '#0F0E0C', borderBottom: '0.5px solid rgba(196,185,168,0.15)', padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <span style={{ fontFamily: 'Georgia, serif', fontSize: 18, fontWeight: 400, color: '#FDFBF7', letterSpacing: '-0.3px' }}>PlateMatch</span>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <Link href="/app" style={{ fontSize: 13, color: 'rgba(253,251,247,0.65)', textDecoration: 'none' }}>Consumer app</Link>
          <Link href="/admin" style={{ fontSize: 13, background: '#C8553A', color: '#FDFBF7', padding: '7px 14px', borderRadius: 8, textDecoration: 'none' }}>Restaurants</Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ background: '#0F0E0C', padding: '64px 24px 0', minHeight: 600, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
        {/* subtle noise texture overlay */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 30% 50%, rgba(200,85,58,0.06) 0%, transparent 60%), radial-gradient(circle at 80% 20%, rgba(196,185,168,0.04) 0%, transparent 50%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 760, width: '100%', display: 'grid', gridTemplateColumns: '1fr auto', gap: 48, alignItems: 'start', position: 'relative' }}>
          {/* Left: copy + form */}
          <div>
            <div style={{ display: 'inline-block', background: 'rgba(200,85,58,0.15)', border: '0.5px solid rgba(200,85,58,0.35)', borderRadius: 100, padding: '5px 12px', fontSize: 11, color: '#C8553A', fontWeight: 500, marginBottom: 20 }}>
              Now in private beta · London
            </div>
            <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 34, fontWeight: 400, color: '#FDFBF7', lineHeight: 1.2, marginBottom: 16, letterSpacing: '-0.5px' }}>
              Find dishes you<br />can actually eat.
            </h1>
            <p style={{ fontSize: 14, color: '#A09A8F', lineHeight: 1.7, marginBottom: 32, maxWidth: 380 }}>
              Search restaurants by your allergens. See compatible dishes before you go. Verified by the restaurant.
            </p>

            {submitted ? (
              <div style={{ background: 'rgba(99,153,34,0.12)', border: '0.5px solid rgba(99,153,34,0.3)', borderRadius: 12, padding: '20px 24px' }}>
                <div style={{ fontSize: 16, color: '#639922', fontFamily: 'Georgia, serif', marginBottom: 4 }}>You&apos;re on the list.</div>
                <p style={{ fontSize: 12, color: '#A09A8F', margin: 0 }}>We&apos;ll be in touch when PlateMatch opens in your area.</p>
              </div>
            ) : (
              <form onSubmit={handleWaitlist}>
                <div style={{ display: 'flex', gap: 10, marginBottom: 12, flexWrap: 'wrap' }}>
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
                    style={{ background: loading ? '#8B7E71' : '#C8553A', color: '#FDFBF7', border: 'none', borderRadius: 10, padding: '12px 24px', fontSize: 14, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}
                  >
                    {loading ? 'Joining…' : 'Join waitlist'}
                  </button>
                </div>
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: 8, cursor: 'pointer', marginBottom: 8 }}>
                  <div
                    onClick={() => setConsent((v) => !v)}
                    style={{ width: 16, height: 16, borderRadius: 4, border: `0.5px solid ${consent ? '#C8553A' : 'rgba(196,185,168,0.4)'}`, background: consent ? '#C8553A' : 'transparent', flexShrink: 0, marginTop: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                  >
                    {consent && <span style={{ fontSize: 10, color: '#FDFBF7' }}>✓</span>}
                  </div>
                  <span style={{ fontSize: 10.5, color: '#6B6760', lineHeight: 1.5 }}>
                    By joining you agree to receive launch updates. Unsubscribe anytime.{' '}
                    <Link href="/privacy" style={{ color: '#A09A8F', textDecoration: 'underline' }}>Privacy Policy</Link>
                  </span>
                </label>
                {error && <p style={{ fontSize: 11, color: '#C8553A', margin: '4px 0 0' }}>{error}</p>}
              </form>
            )}

            {/* Stats */}
            <div style={{ display: 'flex', gap: 32, marginTop: 40, paddingTop: 32, borderTop: '0.5px solid rgba(196,185,168,0.12)', flexWrap: 'wrap' }}>
              {STATS.map((s) => (
                <div key={s.value}>
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
      <section style={{ background: '#FDFBF7', padding: '80px 24px' }}>
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
      <section style={{ background: '#1A1614', padding: '80px 24px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div style={{ display: 'inline-block', background: 'rgba(200,85,58,0.15)', border: '0.5px solid rgba(200,85,58,0.35)', borderRadius: 100, padding: '5px 12px', fontSize: 11, color: '#C8553A', fontWeight: 500, marginBottom: 20 }}>
            For restaurants
          </div>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 26, color: '#FDFBF7', fontWeight: 400, letterSpacing: '-0.3px', marginBottom: 12 }}>
            Your allergy customers are looking for you.
          </h2>
          <p style={{ fontSize: 14, color: '#A09A8F', lineHeight: 1.65, maxWidth: 460, marginBottom: 48 }}>
            1 in 6 adults in the UK has a food allergy or intolerance. They spend more time researching than eating. Give them clarity and they come back.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 40 }}>
            {RESTAURANT_FEATURES.map((f) => (
              <div key={f.title} style={{ background: 'rgba(253,251,247,0.05)', border: '0.5px solid rgba(196,185,168,0.15)', borderRadius: 14, padding: '24px' }}>
                <div style={{ fontSize: 24, marginBottom: 12 }}>{f.icon}</div>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: 16, color: '#FDFBF7', marginBottom: 8, fontWeight: 400 }}>{f.title}</div>
                <p style={{ fontSize: 12, color: '#A09A8F', lineHeight: 1.65, margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <Link href="/admin" style={{ background: '#C8553A', color: '#FDFBF7', padding: '12px 24px', borderRadius: 10, fontSize: 13, textDecoration: 'none', fontFamily: 'inherit' }}>
              Register your restaurant →
            </Link>
            <span style={{ fontSize: 12, color: '#6B6760' }}>From £39/month · Free onboarding for early partners</span>
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
                <span style={{ color: '#639922', flexShrink: 0 }}>✓</span>
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
              { label: 'For Restaurants', href: '/admin' },
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

      {/* mock top bar */}
      <div style={{ background: '#FDFBF7', borderRadius: 14, padding: '10px 10px 8px', marginBottom: 8 }}>
        <div style={{ fontFamily: 'Georgia, serif', fontSize: 11, color: '#1A1614', marginBottom: 2, fontWeight: 400 }}>Good evening</div>
        <div style={{ fontSize: 9, color: '#8B7E71', marginBottom: 8 }}>Find restaurants that match your needs</div>
        {/* mock search */}
        <div style={{ background: '#F5F0E8', borderRadius: 8, height: 26, display: 'flex', alignItems: 'center', paddingLeft: 8, gap: 6 }}>
          <span style={{ fontSize: 9, color: '#C4B9A8' }}>🔍</span>
          <span style={{ fontSize: 9, color: '#C4B9A8' }}>Search restaurants…</span>
        </div>
      </div>

      {/* mock cards */}
      {MOCK_CARDS.map((card) => (
        <div key={card.name} style={{ background: '#FDFBF7', borderRadius: 10, overflow: 'hidden', marginBottom: 6, border: '0.5px solid #C4B9A8' }}>
          <div style={{ height: 42, background: 'linear-gradient(135deg, #2D3530, #1A1614)', position: 'relative' }}>
            <div style={{ position: 'absolute', bottom: 4, left: 6, right: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <span style={{ fontFamily: 'Georgia, serif', fontSize: 8, color: '#FDFBF7', fontWeight: 400 }}>{card.name}</span>
              <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(0,0,0,0.6)', border: '1.5px solid #C8553A', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 7, color: '#FDFBF7', fontFamily: 'Georgia, serif', lineHeight: 1 }}>{card.score}</span>
                <span style={{ fontSize: 4.5, color: '#C4B9A8', lineHeight: 1 }}>dishes</span>
              </div>
            </div>
          </div>
          <div style={{ padding: '5px 6px' }}>
            <div style={{ fontSize: 7, color: '#8B7E71', marginBottom: 3 }}>{card.cuisine}</div>
            <span style={{ fontSize: 6.5, background: '#F5F0E8', color: '#8B7E71', border: '0.5px solid #C4B9A8', borderRadius: 100, padding: '1.5px 5px' }}>{card.tag}</span>
          </div>
        </div>
      ))}

      {/* disclaimer */}
      <div style={{ textAlign: 'center', marginTop: 4 }}>
        <span style={{ fontSize: 7, color: '#C4B9A8', fontStyle: 'italic' }}>Example preview — fictional restaurants</span>
      </div>
    </div>
  );
}
