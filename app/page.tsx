'use client';

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { analytics } from '@/lib/analytics';

const APP_NAME = 'PlateMatch';

const HOW_IT_WORKS = [
  {
    n: '1',
    title: 'Set your needs once',
    desc: 'Select your allergens and dietary preferences. Your data stays on your device — never stored between sessions.',
  },
  {
    n: '2',
    title: "See what's compatible",
    desc: 'Every dish is checked against your needs. The number you see is real dishes — not a percentage, not an estimate.',
  },
  {
    n: '3',
    title: 'Arrive knowing your options',
    desc: 'No more calling ahead. No more waiting for the waiter. Always confirm with staff before ordering.',
  },
];

const RESTAURANT_POINTS = [
  'Your staff answers fewer allergen questions at the table — they focus on service.',
  "A timestamped record of every allergen declaration — ready when Owen's Law arrives in 2027.",
  'Customers who were avoiding you start finding you and arriving informed.',
];

const PREVIEW_DISHES = [
  { name: 'Risotto ai Funghi', price: '£16.50', badge: 'Compatible', tone: 'green' as const },
  { name: 'Pasta al Ragù', price: '£14.00', badge: 'Can be made GF', tone: 'blue' as const },
  { name: 'Sorbetto al Limone', price: '£6.00', badge: 'Compatible', tone: 'green' as const },
];

const GROUP_PEOPLE = [
  { initial: 'G', name: 'Giulia', needs: 'Gluten-free · Dairy-free', color: '#1B5E7A' },
  { initial: 'L', name: 'Lorenzo', needs: 'Vegan', color: '#1B9BA8' },
  { initial: 'M', name: 'Marco', needs: 'Peanut-free', color: '#3D6B4F' },
];

const SOCIAL_AVATARS = [
  { initial: 'S', color: '#1B5E7A' },
  { initial: 'L', color: '#1B9BA8' },
  { initial: 'M', color: '#3D6B4F' },
  { initial: 'A', color: '#6B5E3A' },
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
      analytics.waitlistJoined();
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
    <div style={{ background: '#F4F6F8', fontFamily: 'Inter, -apple-system, sans-serif', color: '#2C3E50', minHeight: '100vh', overflowX: 'hidden' }}>
      <style>{`
        html { scroll-behavior: smooth; }
        @keyframes pm-pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.55; transform: scale(1.3); } }
        .pm-nav-text { color: #A0AEC0; transition: color 0.15s ease; white-space: nowrap; }
        .pm-nav-text:hover { color: #0A1628; }
        .pm-section { padding: 72px 24px; }
        .pm-container { max-width: 680px; margin: 0 auto; }
        .pm-hero { padding: 56px 24px 72px; }
        .pm-hero-stack { display: flex; flex-direction: column; gap: 36px; align-items: stretch; }
        .pm-nav-links { display: flex; gap: 24px; align-items: center; }
        .pm-nav-cta { padding: 9px 18px; white-space: nowrap; }
        .pm-h1 { font-size: clamp(28px, 8vw, 38px); }
        .pm-sub { font-size: clamp(13px, 3.5vw, 15px); }
        .pm-h2 { font-size: clamp(20px, 5.5vw, 23px); }
        @media (max-width: 640px) {
          .pm-section { padding: 28px 20px; }
          .pm-hero { padding: 28px 20px 36px; }
          .pm-nav-wrap { padding: 0 20px !important; }
          .pm-nav-text { display: none !important; }
          .pm-nav-cta { padding: 6px 12px !important; font-size: 12px !important; }
          .pm-nav-links { gap: 10px !important; }
        }
      `}</style>

      {/* ── NAV ── */}
      <nav className="pm-nav-wrap" style={{ background: '#FFFFFF', borderBottom: '1px solid #CBD5E0', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <span style={{ fontFamily: 'Georgia, serif', fontSize: 18, fontWeight: 400, color: '#0A1628', letterSpacing: '-0.3px' }}>{APP_NAME}</span>
        <div className="pm-nav-links">
          <button className="pm-nav-text" onClick={() => scrollTo('how-it-works')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, padding: 0, fontFamily: 'inherit' }}>
            How it works
          </button>
          <button className="pm-nav-text" onClick={() => scrollTo('for-restaurants')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, padding: 0, fontFamily: 'inherit' }}>
            For restaurants
          </button>
          <button className="pm-nav-cta" onClick={() => scrollTo('waitlist')} onMouseEnter={(e) => (e.currentTarget.style.background = '#0C3A4E')} onMouseLeave={(e) => (e.currentTarget.style.background = '#1B5E7A')} style={{ background: '#1B5E7A', color: '#FFFFFF', border: 'none', borderRadius: 7, fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.15s ease' }}>
            Join waitlist
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="pm-hero" style={{ background: '#F4F6F8' }}>
        <div className="pm-container pm-hero-stack">
          {/* Column — copy + form */}
          <div>
            {/* Tag pill */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: '#E0F2F4', borderRadius: 100, padding: '5px 11px', fontSize: 11, color: '#0C4A5C', fontWeight: 500, marginBottom: 22 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#1B9BA8', animation: 'pm-pulse 1.8s ease-in-out infinite' }} />
              Launching in London
            </div>

            {/* H1 */}
            <h1 className="pm-h1" style={{ fontFamily: 'Georgia, serif', fontWeight: 400, color: '#0A1628', lineHeight: 1.15, letterSpacing: '-0.6px', margin: '0 0 16px' }}>
              Dinner out. On your terms.
            </h1>

            {/* Subheadline */}
            <p className="pm-sub" style={{ color: '#2C3E50', lineHeight: 1.7, margin: '0 0 24px', maxWidth: 460 }}>
              Filter every dish in London by your exact allergens and dietary needs — restaurant by restaurant, dish by dish. Set your preferences once. Always confirm with staff before ordering.
            </p>

            {/* Social proof */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{ display: 'flex' }}>
                {SOCIAL_AVATARS.map((a, i) => (
                  <div key={a.initial} style={{ width: 26, height: 26, borderRadius: '50%', background: a.color, color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, border: '2px solid #F4F6F8', marginLeft: i === 0 ? 0 : -8 }}>
                    {a.initial}
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 12, color: '#4A5568' }}>
                <strong style={{ color: '#0A1628', fontWeight: 600 }}>127 Londoners</strong> with dietary needs already waiting
              </div>
            </div>

            {/* Progress bar */}
            <div style={{ marginBottom: 22 }}>
              <div style={{ height: 6, background: 'rgba(27,94,122,0.12)', borderRadius: 100, overflow: 'hidden', marginBottom: 6 }}>
                <div style={{ width: '63.5%', height: '100%', background: '#1B5E7A' }} />
              </div>
              <div style={{ fontSize: 11, color: '#4A5568' }}>127 / 200 early access spots</div>
            </div>

            {/* Form card */}
            <div id="waitlist" style={{ background: '#FFFFFF', border: '1px solid #CBD5E0', borderRadius: 10, padding: 14 }}>
              {submitted ? (
                <div style={{ padding: '6px 2px' }}>
                  <div style={{ fontFamily: 'Georgia, serif', fontSize: 17, color: '#0A1628', marginBottom: 4 }}>You&apos;re on the list.</div>
                  <p style={{ fontSize: 12, color: '#4A5568', margin: 0 }}>We&apos;ll be in touch when {APP_NAME} opens.</p>
                </div>
              ) : (
                <form onSubmit={handleWaitlist}>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      style={{ flex: '1 1 220px', minWidth: 0, background: '#F4F6F8', border: '1px solid #CBD5E0', borderRadius: 7, padding: '11px 13px', fontSize: 13, color: '#0A1628', outline: 'none', fontFamily: 'inherit' }}
                      onFocus={(e) => (e.currentTarget.style.borderColor = '#1B5E7A')}
                      onBlur={(e) => (e.currentTarget.style.borderColor = '#CBD5E0')}
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = '#0C3A4E'; }}
                      onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = '#1B5E7A'; }}
                      style={{ background: loading ? '#A0AEC0' : '#1B5E7A', color: '#FFFFFF', border: 'none', borderRadius: 7, padding: '11px 20px', fontSize: 13, fontWeight: 500, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap', transition: 'background 0.15s ease' }}
                    >
                      {loading ? 'Joining…' : 'Get my access'}
                    </button>
                  </div>
                  <div style={{ fontSize: 11, color: '#4A5568', textAlign: 'center', marginBottom: 10 }}>Free for diners · Always</div>
                  <p style={{ fontSize: 10, color: '#4A5568', lineHeight: 1.55, margin: 0 }}>
                    By joining I agree to the{' '}
                    <Link href="/terms" style={{ color: '#1B5E7A', textDecoration: 'underline' }}>Terms of Service</Link>
                    {' '}and confirm I have read the{' '}
                    <Link href="/privacy" style={{ color: '#1B5E7A', textDecoration: 'underline' }}>Privacy Policy</Link>.
                    {' '}I understand my allergen preferences are stored only on my device.{' '}
                    <Link href="/cookies" style={{ color: '#4A5568', textDecoration: 'underline' }}>Cookie Policy</Link>
                  </p>
                  {error && <p style={{ fontSize: 11, color: '#C0392B', margin: '8px 0 0' }}>{error}</p>}
                </form>
              )}
            </div>
          </div>

          {/* Product preview — stacks below form */}
          <ProductPreview />
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="pm-section" style={{ background: '#FFFFFF' }}>
        <div className="pm-container">
          <SectionLabel>How it works</SectionLabel>
          <h2 className="pm-h2" style={{ fontFamily: 'Georgia, serif', fontWeight: 400, color: '#0A1628', letterSpacing: '-0.3px', margin: '12px 0 32px' }}>
            Three steps. No more guesswork.
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {HOW_IT_WORKS.map((item, i) => (
              <div key={item.n} style={{ display: 'flex', gap: 16, padding: '22px 0', borderTop: i === 0 ? 'none' : '1px solid #CBD5E0' }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#E0F2F4', color: '#0C4A5C', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600, flexShrink: 0 }}>
                  {item.n}
                </div>
                <div style={{ paddingTop: 4 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, color: '#0A1628', marginBottom: 6 }}>{item.title}</div>
                  <p style={{ fontSize: 13, color: '#2C3E50', lineHeight: 1.65, margin: 0 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY THIS EXISTS ── */}
      <section className="pm-section" style={{ background: '#FFFFFF', paddingTop: 0 }}>
        <div className="pm-container">
          <SectionLabel>Why this exists</SectionLabel>
          <h2 className="pm-h2" style={{ fontFamily: 'Georgia, serif', fontWeight: 400, color: '#0A1628', letterSpacing: '-0.3px', margin: '12px 0 24px' }}>
            Built by someone who lives this every day.
          </h2>
          <div style={{ background: '#F4F6F8', border: '1px solid #CBD5E0', borderRadius: 12, padding: 20 }}>
            <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 14 }}>
              <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#1B5E7A', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Georgia, serif', fontSize: 17, fontWeight: 400, flexShrink: 0 }}>
                GF
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 500, color: '#0A1628', marginBottom: 2 }}>Giosef Ferraro</div>
                <div style={{ fontSize: 12, color: '#4A5568', marginBottom: 6 }}>Assistant Manager · Software Development Student · Founder</div>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: '#E0F2F4', color: '#0C4A5C', borderRadius: 100, padding: '3px 9px', fontSize: 11, fontWeight: 500 }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  London
                </span>
              </div>
            </div>
            <blockquote style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 15, color: '#0A1628', lineHeight: 1.6, borderLeft: '2px solid #1B9BA8', paddingLeft: 14, margin: '0 0 16px' }}>
              &ldquo;I have G6PD deficiency — a rare allergy to legumes that most London restaurants have never heard of.&rdquo;
            </blockquote>
            <p style={{ fontSize: 13, color: '#2C3E50', lineHeight: 1.65, margin: '0 0 14px' }}>
              As an assistant manager in hospitality, I&apos;ve watched people with multiple allergies spend their evenings negotiating with the kitchen instead of enjoying their meal. I&apos;m building this app to give everyone the same freedom: choose a restaurant based on what you feel like eating, not based on what you can manage.
            </p>
            <Link href="/story" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 500, color: '#1B5E7A', textDecoration: 'none' }}>
              Read my full story
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14" />
                <path d="M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ── MODIFIABLE DISHES ── */}
      <section className="pm-section" style={{ background: '#F4F6F8' }}>
        <div className="pm-container">
          <SectionLabel>Modifiable dishes</SectionLabel>
          <h2 className="pm-h2" style={{ fontFamily: 'Georgia, serif', fontWeight: 400, color: '#0A1628', letterSpacing: '-0.3px', margin: '12px 0 10px' }}>
            Dishes you thought were off the table.
          </h2>
          <p style={{ fontSize: 14, color: '#2C3E50', lineHeight: 1.65, margin: '0 0 28px', maxWidth: 560 }}>
            Some dishes can be adapted for your needs. We show you which ones, how, and whether there&apos;s an extra cost — as declared by the restaurant.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16, marginBottom: 20 }}>
            <ModDishCard
              name="Pasta al Ragù"
              price="£14.00"
              from="#7C5A38"
              to="#150E05"
              badge="Can be made gluten-free"
              desc="Replace pasta with certified GF pasta on request. Sauce and all other ingredients unchanged."
              meta="+£1.50 · Declared by the restaurant"
            />
            <ModDishCard
              name="Risotto ai Funghi"
              price="£16.50"
              from="#2A5040"
              to="#060F09"
              badge="Can be made dairy-free"
              desc="Prepared without butter on request. Same dish, same flavour profile."
              meta="No extra charge · Declared by the restaurant"
            />
          </div>
          <InfoBox icon="info">
            Modifiable dishes are declared directly by the restaurant. Always confirm the modification with staff before ordering.
          </InfoBox>
        </div>
      </section>

      {/* ── GROUP MATCH ── */}
      <section className="pm-section" style={{ background: '#FFFFFF' }}>
        <div className="pm-container">
          <SectionLabel>Group Match</SectionLabel>
          <h2 className="pm-h2" style={{ fontFamily: 'Georgia, serif', fontWeight: 400, color: '#0A1628', letterSpacing: '-0.3px', margin: '12px 0 10px' }}>
            Every person at the table. Every person with something to eat.
          </h2>
          <p style={{ fontSize: 14, color: '#2C3E50', lineHeight: 1.65, margin: '0 0 24px', maxWidth: 520 }}>
            One evening where the only thing that matters is the company.
          </p>
          <div style={{ background: '#F4F6F8', border: '1px solid #CBD5E0', borderRadius: 12, padding: 16 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 14 }}>
              {GROUP_PEOPLE.map((p) => (
                <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 34, height: 34, borderRadius: '50%', background: p.color, color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600, flexShrink: 0 }}>
                    {p.initial}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 500, color: '#0A1628' }}>{p.name}</div>
                    <div style={{ fontSize: 12, color: '#4A5568' }}>{p.needs}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ background: '#0A1628', borderRadius: 9, padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', marginBottom: 4 }}>Restaurants in Shoreditch where everyone has compatible dishes</div>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: 18, color: '#FFFFFF', fontWeight: 400 }}>12 restaurants found</div>
              </div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1B9BA8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0 }}>
                <path d="M5 12h14" />
                <path d="M12 5l7 7-7 7" />
              </svg>
            </div>
          </div>
          <div style={{ marginTop: 16 }}>
            <InfoBox icon="users">
              Each person sets their own needs independently. Group Match finds where everyone has options — not just the least bad compromise.
            </InfoBox>
          </div>
        </div>
      </section>

      {/* ── FOR RESTAURANTS ── */}
      <section id="for-restaurants" className="pm-section" style={{ background: '#0A1628' }}>
        <div className="pm-container">
          <SectionLabel dark>For restaurants</SectionLabel>
          <h2 className="pm-h2" style={{ fontFamily: 'Georgia, serif', fontWeight: 400, color: '#FFFFFF', letterSpacing: '-0.3px', margin: '12px 0 12px' }}>
            Your customers with dietary needs are looking for you.
          </h2>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.70)', lineHeight: 1.65, margin: '0 0 28px', maxWidth: 560 }}>
            2.4 million people in the UK have food allergies. Most avoid eating out because they can&apos;t find clear information. They&apos;re already searching — they just can&apos;t find you yet.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 22 }}>
            {RESTAURANT_POINTS.map((text, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ width: 24, height: 24, borderRadius: 7, background: 'rgba(27,155,168,0.15)', color: '#1B9BA8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {i === 0 && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
                  )}
                  {i === 1 && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="9 12 11 14 15 10" /></svg>
                  )}
                  {i === 2 && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>
                  )}
                </div>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.78)', lineHeight: 1.6, margin: 0 }}>{text}</p>
              </div>
            ))}
          </div>
          <div style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 9, padding: '14px 16px', fontSize: 13, color: 'rgba(255,255,255,0.78)', lineHeight: 1.6, marginBottom: 20 }}>
            We help you upload and verify your menu — dish by dish, allergen by allergen. You get reminders when it&apos;s time to update. You stay in full control.
          </div>
          <Link href="/waitlist?type=restaurant" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', background: '#1B9BA8', color: '#FFFFFF', padding: '13px 18px', borderRadius: 8, fontSize: 14, fontWeight: 500, textDecoration: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 9l1.5-5h15L21 9" />
              <path d="M4 9h16v11H4z" />
              <path d="M9 20v-6h6v6" />
            </svg>
            Register your restaurant
          </Link>
          <div style={{ textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.40)', marginTop: 12 }}>
            First 30 restaurants: £29/month, locked forever
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: '#071020', padding: '28px 24px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14 }}>
          <span style={{ fontFamily: 'Georgia, serif', fontSize: 14, color: 'rgba(255,255,255,0.35)', letterSpacing: '-0.2px' }}>{APP_NAME}</span>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            {[
              { label: 'Terms', href: '/terms' },
              { label: 'Privacy', href: '/privacy' },
              { label: 'Cookies', href: '/cookies' },
            ].map((l) => (
              <Link key={l.href} href={l.href} style={{ fontSize: 11, color: 'rgba(255,255,255,0.28)', textDecoration: 'none' }}>
                {l.label}
              </Link>
            ))}
          </div>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.20)', width: '100%' }}>
            © 2026 {APP_NAME} · London, UK
          </span>
        </div>
      </footer>
    </div>
  );
}

/* ──────────── sub-components ──────────── */

function SectionLabel({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <span style={{ fontSize: 11, fontWeight: 600, color: '#1B9BA8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{children}</span>
      <div style={{ flex: 1, height: 1, background: dark ? 'rgba(255,255,255,0.1)' : '#CBD5E0' }} />
    </div>
  );
}

function InfoBox({ children, icon }: { children: React.ReactNode; icon: 'info' | 'users' }) {
  return (
    <div style={{ background: '#E0F2F4', border: '1px solid rgba(27,155,168,0.25)', borderRadius: 9, padding: '12px 14px', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
      <div style={{ color: '#0C4A5C', flexShrink: 0, marginTop: 1 }}>
        {icon === 'info' ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        )}
      </div>
      <p style={{ fontSize: 12.5, color: '#0C4A5C', lineHeight: 1.55, margin: 0 }}>{children}</p>
    </div>
  );
}

function ModDishCard({ name, price, from, to, badge, desc, meta }: { name: string; price: string; from: string; to: string; badge: string; desc: string; meta: string }) {
  return (
    <div style={{ background: '#FFFFFF', border: '1px solid #CBD5E0', borderRadius: 12, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div style={{ height: 84, background: `linear-gradient(135deg, ${from}, ${to})`, position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 20%, rgba(0,0,0,0.55) 100%)' }} />
        <div style={{ position: 'absolute', bottom: 10, left: 12, right: 12, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 8 }}>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: 15, color: '#FFFFFF', fontWeight: 400 }}>{name}</div>
          <div style={{ background: 'rgba(0,0,0,0.55)', color: '#FFFFFF', fontSize: 11, fontWeight: 500, borderRadius: 7, padding: '3px 8px' }}>{price}</div>
        </div>
      </div>
      <div style={{ padding: 14 }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: '#DBEAFE', color: '#1E40AF', borderRadius: 100, padding: '3px 9px', fontSize: 11, fontWeight: 500, marginBottom: 8 }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="23 4 23 10 17 10" />
            <polyline points="1 20 1 14 7 14" />
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10" />
            <path d="M20.49 15a9 9 0 0 1-14.85 3.36L1 14" />
          </svg>
          {badge}
        </span>
        <p style={{ fontSize: 13, color: '#2C3E50', lineHeight: 1.55, margin: '0 0 8px' }}>{desc}</p>
        <div style={{ fontSize: 11.5, color: '#4A5568', fontStyle: 'italic' }}>{meta}</div>
      </div>
    </div>
  );
}

function ProductPreview() {
  return (
    <div style={{ background: '#FFFFFF', border: '1px solid #CBD5E0', borderRadius: 12, overflow: 'hidden', boxShadow: '0 20px 50px rgba(10,22,40,0.08)' }}>
      {/* Browser chrome */}
      <div style={{ background: '#F4F6F8', borderBottom: '1px solid #CBD5E0', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ display: 'flex', gap: 5 }}>
          {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => (
            <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
          ))}
        </div>
        <div style={{ flex: 1, textAlign: 'center', fontSize: 11, color: '#4A5568' }}>
          Your filters: <span style={{ color: '#0A1628', fontWeight: 500 }}>Gluten-free · Dairy-free</span>
        </div>
      </div>

      {/* Body */}
      <div style={{ background: '#F4F6F8', padding: 14 }}>
        {/* Filter chips */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 14, flexWrap: 'wrap' }}>
          {['Gluten-free', 'Dairy-free'].map((f) => (
            <span key={f} style={{ background: '#0A1628', color: '#FFFFFF', borderRadius: 100, padding: '4px 10px', fontSize: 11, fontWeight: 500 }}>{f}</span>
          ))}
        </div>

        {/* Restaurant card */}
        <div style={{ background: '#FFFFFF', border: '1px solid #CBD5E0', borderRadius: 10, overflow: 'hidden' }}>
          <div style={{ minHeight: 70, background: 'linear-gradient(135deg, #0A1628, #1B5E7A)', position: 'relative', padding: '10px 12px', display: 'flex', alignItems: 'flex-end' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.55) 100%)' }} />
            <div style={{ position: 'relative', width: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
              <div style={{ fontFamily: 'Georgia, serif', fontSize: 13, color: '#FFFFFF', fontWeight: 400, minWidth: 0, flex: '1 1 auto' }}>
                L&apos;Artigiano del Gusto <span style={{ color: 'rgba(255,255,255,0.7)' }}>· Shoreditch</span>
              </div>
              <span style={{ background: '#1B9BA8', color: '#FFFFFF', borderRadius: 100, padding: '3px 9px', fontSize: 10, fontWeight: 500, whiteSpace: 'nowrap', flexShrink: 0 }}>9 compatible</span>
            </div>
          </div>
          <div style={{ padding: '4px 12px 10px' }}>
            {PREVIEW_DISHES.map((d, i) => (
              <div key={d.name} style={{ padding: '10px 0', borderTop: i === 0 ? 'none' : '1px solid #F4F6F8' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                  <div style={{ flex: 1, fontSize: 12, color: '#0A1628', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.name}</div>
                  <span style={{ flexShrink: 0, fontFamily: 'Georgia, serif', fontSize: 12, color: '#0A1628' }}>{d.price}</span>
                </div>
                <span style={{ display: 'block', marginTop: 2, background: d.tone === 'green' ? '#EAF3DE' : '#DBEAFE', color: d.tone === 'green' ? '#276228' : '#1E40AF', borderRadius: 100, padding: '2px 7px', fontSize: 10, fontWeight: 500, width: 'fit-content' }}>{d.badge}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
