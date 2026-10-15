'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { analytics } from '@/lib/analytics';

const APP_NAME = 'PlateMatch';

const SOCIAL_AVATARS = [
  { initial: 'S', color: '#1B5E7A' },
  { initial: 'L', color: '#1B9BA8' },
  { initial: 'M', color: '#3D6B4F' },
  { initial: 'A', color: '#6B5E3A' },
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

const RESTAURANT_POINTS = [
  'Less allergen questions at the table — staff focuses on service',
  "Timestamped allergen records — ready for Owen's Law 2027",
  'Customers who were avoiding you start finding you',
];

/* ─────────── background image helper (graceful fallback) ─────────── */
function BgImage({ src, alt, fallback, priority = false, objectPosition = 'center' }: { src: string; alt: string; fallback: string; priority?: boolean; objectPosition?: string }) {
  const [failed, setFailed] = useState(false);
  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: fallback, backgroundSize: 'cover', backgroundPosition: 'center', overflow: 'hidden' }}>
      {!failed && (
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes="100vw"
          style={{ objectFit: 'cover', objectPosition }}
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}

export default function LandingPage() {
  const [email, setEmail] = useState('');
  const [emailCta, setEmailCta] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function submitWaitlist(value: string) {
    if (!value.trim() || !value.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      if (supabase) {
        await supabase.from('waitlist').upsert({
          email: value.trim().toLowerCase(),
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

  function handleHeroSubmit(e: React.FormEvent) {
    e.preventDefault();
    submitWaitlist(email);
  }

  function handleCtaSubmit(e: React.FormEvent) {
    e.preventDefault();
    submitWaitlist(emailCta);
  }

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <div style={{ background: '#F4F6F8', fontFamily: 'Inter, -apple-system, sans-serif', color: '#2C3E50', minHeight: '100vh', overflowX: 'hidden' }}>
      <style>{`
        html { scroll-behavior: smooth; }
        section[id] { scroll-margin-top: 72px; }
        @keyframes pm-pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.55; transform: scale(1.3); } }
        .pm-nav-text { color: #A0AEC0; transition: color 0.15s ease; white-space: nowrap; }
        .pm-nav-text:hover { color: #0A1628; }
        .pm-container { max-width: 680px; margin: 0 auto; }
        .pm-h1 { font-size: clamp(28px, 8vw, 36px); }
        .pm-h2 { font-size: clamp(20px, 5.5vw, 24px); }
        .pm-section { padding: 44px 24px; }
        .pm-section-sm { padding: 40px 24px; }
        .pm-nav-cta { padding: 10px 20px; white-space: nowrap; }
        .pm-input::placeholder { color: #A0AEC0; }
        .pm-input-dark::placeholder { color: rgba(255,255,255,0.5); }
        .pm-section-label-line::after { content: ''; display: block; flex: 1; height: 1px; background: #CBD5E0; margin-left: 12px; }
        .pm-section-label-line-dark::after { content: ''; display: block; flex: 1; height: 1px; background: rgba(255,255,255,0.12); margin-left: 12px; }
        .pm-feature-strip { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1px; background: #CBD5E0; border-radius: 14px; overflow: hidden; margin-top: 24px; }
        .pm-feature-col { background: #FFFFFF; padding: 18px 16px; }
        @media (max-width: 768px) {
          .pm-section, .pm-section-sm { padding: 36px 20px; }
          .pm-nav-wrap { padding: 14px 20px !important; }
          .pm-nav-text { display: none !important; }
          .pm-nav-cta { padding: 8px 14px !important; font-size: 12px !important; }
          .pm-nav-links { gap: 10px !important; }
          .pm-feature-col { padding: 14px 10px; }
        }
      `}</style>

      {/* ── NAV ── */}
      <nav className="pm-nav-wrap" style={{ background: '#FFFFFF', borderBottom: '1px solid #E8EDF2', padding: '14px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <span style={{ fontFamily: 'Georgia, serif', fontSize: 18, fontWeight: 400, color: '#0A1628', letterSpacing: '-0.3px' }}>{APP_NAME}</span>
        <div className="pm-nav-links" style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          <button className="pm-nav-text" onClick={() => scrollTo('how-it-works')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, padding: 0, fontFamily: 'inherit' }}>
            How it works
          </button>
          <button className="pm-nav-text" onClick={() => scrollTo('for-restaurants')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, padding: 0, fontFamily: 'inherit' }}>
            For restaurants
          </button>
          <a className="pm-nav-cta" href="#waitlist" onMouseEnter={(e) => (e.currentTarget.style.background = '#0C3A4E')} onMouseLeave={(e) => (e.currentTarget.style.background = '#1B5E7A')} style={{ background: '#1B5E7A', color: '#FFFFFF', borderRadius: 8, fontSize: 13, fontWeight: 500, textDecoration: 'none', fontFamily: 'inherit', transition: 'background 0.15s ease' }}>
            Join waitlist
          </a>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ minHeight: 590, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'flex-end' }}>
        <BgImage
          src="/images/hero.jpg"
          alt=""
          priority
          objectPosition="center 30%"
          fallback="linear-gradient(160deg, #0d2030 0%, #0a1628 50%, #071020 100%)"
        />
        {/* gradient overlay */}
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(10,22,40,0.10) 0%, rgba(10,22,40,0.55) 50%, rgba(10,22,40,0.96) 100%)' }} />

        {/* Tag top-left */}
        <div style={{ position: 'absolute', top: 18, left: 22, zIndex: 10, display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(27,155,168,0.18)', border: '0.5px solid rgba(27,155,168,0.4)', borderRadius: 99, padding: '6px 14px', fontSize: 11, color: '#7EDDE6', fontWeight: 500, whiteSpace: 'nowrap', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#1B9BA8', animation: 'pm-pulse 1.8s ease-in-out infinite' }} />
          Launching in London
        </div>

        {/* Hero content */}
        <div className="pm-container" style={{ position: 'relative', zIndex: 2, padding: '0 24px 32px', width: '100%' }}>
          <h1 className="pm-h1" style={{ fontFamily: 'Georgia, serif', color: '#FFFFFF', lineHeight: 1.1, letterSpacing: '-0.9px', fontWeight: 400, textShadow: '0 2px 16px rgba(0,0,0,0.3)', margin: '0 0 14px' }}>
            Find out what you can eat — before you even choose where to go.
          </h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.88)', lineHeight: 1.75, margin: '0 0 24px', textShadow: '0 1px 8px rgba(0,0,0,0.4)' }}>
            Filter every dish in London by your exact allergens and dietary needs. Set your preferences once. See what&apos;s compatible, restaurant by restaurant. Always confirm with staff before ordering.
          </p>

          {/* Waitlist form */}
          <div id="waitlist" style={{ background: 'rgba(255,255,255,0.14)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', border: '0.5px solid rgba(255,255,255,0.25)', borderRadius: 12, padding: 14 }}>
            {submitted ? (
              <div style={{ padding: '6px 2px' }}>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: 17, color: '#FFFFFF', marginBottom: 4 }}>You&apos;re on the list.</div>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', margin: 0 }}>We&apos;ll be in touch when {APP_NAME} opens.</p>
              </div>
            ) : (
              <form onSubmit={handleHeroSubmit}>
                <div style={{ display: 'flex', gap: 8, marginBottom: 9 }}>
                  <input
                    className="pm-input-dark"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    style={{ flex: 1, minWidth: 0, background: 'rgba(255,255,255,0.18)', border: '0.5px solid rgba(255,255,255,0.32)', borderRadius: 8, padding: '12px 14px', fontSize: 13, color: 'rgba(255,255,255,0.95)', outline: 'none', fontFamily: 'inherit' }}
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    style={{ background: loading ? '#A0AEC0' : '#1B5E7A', color: '#FFFFFF', border: 'none', borderRadius: 8, padding: '12px 16px', fontSize: 12, fontWeight: 500, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap', flexShrink: 0, transition: 'background 0.15s ease' }}
                  >
                    {loading ? 'Joining…' : 'Get early access'}
                  </button>
                </div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', textAlign: 'center', marginTop: 8 }}>Free for diners · Always</div>
                <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', lineHeight: 1.55, margin: '8px 0 0' }}>
                  By joining I agree to the{' '}
                  <Link href="/terms" style={{ color: '#7EDDE6', textDecoration: 'underline' }}>Terms</Link>
                  {' '}and have read the{' '}
                  <Link href="/privacy" style={{ color: '#7EDDE6', textDecoration: 'underline' }}>Privacy Policy</Link>.
                  {' '}My allergen preferences stay on my device.{' '}
                  <Link href="/cookies" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'underline' }}>Cookies</Link>
                </p>
                {error && <p style={{ fontSize: 11, color: '#FF8A80', margin: '8px 0 0' }}>{error}</p>}
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ── SP BAR ── */}
      <div style={{ background: '#F4F6F8', borderBottom: '1px solid #E8EDF2', padding: '13px 22px', display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', flexShrink: 0 }}>
          {SOCIAL_AVATARS.map((a, i) => (
            <div key={a.initial} style={{ width: 26, height: 26, borderRadius: '50%', background: a.color, color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, border: '2px solid #F4F6F8', marginLeft: i === 0 ? 0 : -8 }}>
              {a.initial}
            </div>
          ))}
        </div>
        <div style={{ flex: 1, fontSize: 12, color: '#2C3E50', minWidth: 180 }}>
          <strong style={{ color: '#0A1628', fontWeight: 600 }}>127 Londoners</strong> with dietary needs already waiting
        </div>
        <span style={{ background: '#1B5E7A', color: '#FFFFFF', borderRadius: 99, padding: '5px 12px', fontSize: 10, fontWeight: 500, whiteSpace: 'nowrap', flexShrink: 0 }}>127 / 200</span>
      </div>

      {/* ── HOW IT WORKS — BEFORE / AFTER ── */}
      <section id="how-it-works" className="pm-section" style={{ background: '#FFFFFF', position: 'relative', overflow: 'hidden' }}>
        <BgImage
          src="/images/problem.jpg"
          alt=""
          fallback="linear-gradient(160deg, rgba(244,246,248,0.98) 0%, rgba(235,240,245,0.95) 100%)"
        />
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.93)' }} />
        <div className="pm-container" style={{ position: 'relative', zIndex: 2 }}>
          <SectionLabel>How it works</SectionLabel>

          {/* BEFORE */}
          <div style={{ marginBottom: 24 }}>
            <span style={{ display: 'inline-block', background: '#FEF3F2', color: '#B42318', borderRadius: 6, padding: '4px 10px', fontSize: 11, fontWeight: 500, marginBottom: 12 }}>
              ✕ Before {APP_NAME}
            </span>
            <p style={{ fontSize: 15, color: '#4A5568', lineHeight: 1.75, margin: 0 }}>
              Most people choose a restaurant based on what they feel like eating tonight. For 2.4 million people in the UK with food allergies, the process is different — menus checked online, restaurants called ahead, the same familiar places chosen again and again. Not because of preference. Because the information they need isn&apos;t there until they sit down.
            </p>
          </div>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '28px 0' }}>
            <div style={{ flex: 1, height: 1, background: '#E8EDF2' }} />
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#0A1628', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 5v14" />
                <path d="M5 12l7 7 7-7" />
              </svg>
            </div>
            <div style={{ flex: 1, height: 1, background: '#E8EDF2' }} />
          </div>

          {/* AFTER */}
          <div>
            <span style={{ display: 'inline-block', background: '#E0F2F4', color: '#0C4A5C', borderRadius: 6, padding: '4px 10px', fontSize: 11, fontWeight: 500, marginBottom: 12 }}>
              ✓ With {APP_NAME}
            </span>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 22, color: '#0A1628', lineHeight: 1.25, letterSpacing: '-0.4px', fontWeight: 400, margin: '0 0 10px' }}>
              Know what&apos;s on your menu — before you book, before you arrive, before you even choose where to go.
            </h2>
            <p style={{ fontSize: 15, color: '#2C3E50', lineHeight: 1.75, margin: 0 }}>
              Filter every dish by your exact allergens. See which dishes can be adapted for you. Find restaurants where everyone in your group can eat. All before you make a single phone call.
            </p>
          </div>

          {/* FEATURE STRIP */}
          <div className="pm-feature-strip">
            <FeatureCol tag="FILTERING" n="01" title="Dish-level filtering" desc="Every dish checked against your exact allergens" badge="14 UK allergens" />
            <FeatureCol tag="ADAPTING" n="02" title="Modifiable dishes" desc="See what can be adapted for you" badge="Declared by restaurant" />
            <FeatureCol tag="MATCHING" n="03" title="Group Match" desc="One restaurant. Everyone eats." badge="Unique worldwide" />
          </div>
        </div>
      </section>

      {/* ── PRODUCT PREVIEW ── */}
      <section className="pm-section" style={{ background: '#F4F6F8' }}>
        <div className="pm-container">
          <SectionLabel>See it in action</SectionLabel>
          <h2 className="pm-h2" style={{ fontFamily: 'Georgia, serif', fontWeight: 400, color: '#0A1628', letterSpacing: '-0.3px', margin: '0 0 20px', lineHeight: 1.25 }}>
            Every dish. Filtered for you. Before you arrive.
          </h2>
          <ProductPreview />
        </div>
      </section>

      {/* ── GROUP MATCH ── */}
      <section className="pm-section" style={{ position: 'relative', overflow: 'hidden' }}>
        <BgImage
          src="/images/group.jpg"
          alt=""
          fallback="linear-gradient(160deg, #0d2030 0%, #0a1628 60%, #071020 100%)"
        />
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'rgba(10,22,40,0.84)' }} />
        <div className="pm-container" style={{ position: 'relative', zIndex: 2 }}>
          <SectionLabel dark>Group Match</SectionLabel>
          <h2 className="pm-h2" style={{ fontFamily: 'Georgia, serif', fontWeight: 400, color: '#FFFFFF', letterSpacing: '-0.3px', margin: '0 0 10px', lineHeight: 1.25 }}>
            Every person at the table. Every person with something to eat.
          </h2>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', fontStyle: 'italic', margin: '0 0 20px' }}>
            One evening where the only thing that matters is the company.
          </p>
          <div style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 14, padding: 18 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
              {GROUP_PEOPLE.map((p) => (
                <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: p.color, color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 600, flexShrink: 0 }}>
                    {p.initial}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 500, color: '#FFFFFF' }}>{p.name}</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.72)' }}>{p.needs}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ background: 'rgba(27,155,168,0.15)', border: '1px solid rgba(27,155,168,0.3)', borderRadius: 10, padding: '15px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', marginBottom: 4 }}>Restaurants near you where everyone has compatible dishes</div>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: 19, color: '#FFFFFF', fontWeight: 400 }}>12 restaurants found</div>
              </div>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1B9BA8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0 }}>
                <path d="M5 12h14" />
                <path d="M12 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOUNDER ── */}
      <section className="pm-section-sm" style={{ background: '#F4F6F8' }}>
        <div className="pm-container">
          <SectionLabel>Why this exists</SectionLabel>
          <div style={{ background: '#FFFFFF', border: '1px solid #CBD5E0', borderRadius: 14, padding: 22 }}>
            <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 16 }}>
              <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#1B5E7A', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Georgia, serif', fontSize: 17, fontWeight: 400, flexShrink: 0 }}>GF</div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 500, color: '#0A1628', marginBottom: 2 }}>Giosef Ferraro</div>
                <div style={{ fontSize: 12, color: '#4A5568' }}>Assistant Manager · Software Dev Student · Founder, London</div>
              </div>
            </div>
            <blockquote style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 15, color: '#0A1628', lineHeight: 1.7, borderLeft: '2.5px solid #1B9BA8', paddingLeft: 14, margin: '0 0 16px' }}>
              &ldquo;I have G6PD deficiency — a rare allergy that most London restaurants have never heard of. I built this because I know exactly how it feels.&rdquo;
            </blockquote>
            <Link href="/about" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 500, color: '#1B5E7A', textDecoration: 'none' }}>
              Read my full story
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14" />
                <path d="M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="pm-section" style={{ background: '#FFFFFF', borderTop: '1px solid #F0F4F8', textAlign: 'center' }}>
        <div className="pm-container">
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(22px, 6.5vw, 28px)', fontWeight: 400, color: '#0A1628', letterSpacing: '-0.6px', margin: '0 0 10px' }}>
            Eat out freely. Starting now.
          </h2>
          <p style={{ fontSize: 14, color: '#4A5568', margin: '0 0 18px' }}>
            Free for diners. Always.
          </p>

          {/* Mini social proof */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex' }}>
              {SOCIAL_AVATARS.slice(0, 3).map((a, i) => (
                <div key={a.initial} style={{ width: 22, height: 22, borderRadius: '50%', background: a.color, color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 600, border: '2px solid #FFFFFF', marginLeft: i === 0 ? 0 : -7 }}>
                  {a.initial}
                </div>
              ))}
            </div>
            <span style={{ fontSize: 12, color: '#4A5568' }}>Join <strong style={{ color: '#0A1628', fontWeight: 600 }}>127 Londoners</strong> already on the waitlist</span>
          </div>

          {submitted ? (
            <div style={{ background: '#E0F2F4', border: '1px solid rgba(27,155,168,0.3)', borderRadius: 10, padding: 18, maxWidth: 440, margin: '0 auto' }}>
              <div style={{ fontFamily: 'Georgia, serif', fontSize: 17, color: '#0A1628', marginBottom: 4 }}>You&apos;re on the list.</div>
              <p style={{ fontSize: 12, color: '#4A5568', margin: 0 }}>We&apos;ll be in touch when {APP_NAME} opens.</p>
            </div>
          ) : (
            <form onSubmit={handleCtaSubmit} style={{ maxWidth: 440, margin: '0 auto' }}>
              <div style={{ display: 'flex', gap: 8, marginBottom: 9 }}>
                <input
                  className="pm-input"
                  type="email"
                  value={emailCta}
                  onChange={(e) => setEmailCta(e.target.value)}
                  placeholder="your@email.com"
                  style={{ flex: 1, minWidth: 0, background: '#F4F6F8', border: '1px solid #CBD5E0', borderRadius: 9, padding: '14px 16px', fontSize: 13, color: '#0A1628', outline: 'none', fontFamily: 'inherit' }}
                />
                <button
                  type="submit"
                  disabled={loading}
                  style={{ background: loading ? '#A0AEC0' : '#1B5E7A', color: '#FFFFFF', border: 'none', borderRadius: 9, padding: '14px 18px', fontSize: 12, fontWeight: 500, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap', flexShrink: 0, transition: 'background 0.15s ease' }}
                >
                  {loading ? 'Joining…' : 'Get my access'}
                </button>
              </div>
              <p style={{ fontSize: 11, color: '#A0AEC0', margin: '10px 0 0' }}>
                Free for diners · Always confirm with staff before ordering
              </p>
              {error && <p style={{ fontSize: 11, color: '#C0392B', margin: '8px 0 0' }}>{error}</p>}
            </form>
          )}
        </div>
      </section>

      {/* ── FOR RESTAURANTS ── */}
      <section id="for-restaurants" className="pm-section" style={{ position: 'relative', overflow: 'hidden' }}>
        <BgImage
          src="/images/restaurant.jpg"
          alt=""
          fallback="linear-gradient(160deg, #0a1628 0%, #071020 100%)"
        />
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'rgba(10,22,40,0.88)' }} />
        <div className="pm-container" style={{ position: 'relative', zIndex: 2 }}>
          <SectionLabel dark>For restaurants</SectionLabel>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 22, color: '#FFFFFF', letterSpacing: '-0.3px', fontWeight: 400, lineHeight: 1.3, margin: '0 0 10px' }}>
            Your customers with dietary needs are looking for you.
          </h2>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.65, margin: '0 0 22px' }}>
            2.4 million people with allergies in the UK. Most avoid eating out. They&apos;re searching — they just can&apos;t find you yet.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
            {RESTAURANT_POINTS.map((text, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#1B9BA8', flexShrink: 0, marginTop: 7 }} />
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.70)', lineHeight: 1.6, margin: 0 }}>{text}</p>
              </div>
            ))}
          </div>
          <Link href="/waitlist?type=restaurant" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', background: '#1B9BA8', color: '#FFFFFF', padding: '15px 18px', borderRadius: 10, fontSize: 14, fontWeight: 500, textDecoration: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}>
            Register your restaurant
          </Link>
          <div style={{ textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.30)', marginTop: 12 }}>
            First 30 restaurants: £29/month, locked forever
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: '#071020', padding: '18px 24px' }}>
        <div style={{ maxWidth: 680, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
          <span style={{ fontFamily: 'Georgia, serif', fontSize: 14, color: 'rgba(255,255,255,0.28)', letterSpacing: '-0.2px' }}>{APP_NAME}</span>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            {[
              { label: 'Terms', href: '/terms' },
              { label: 'Privacy', href: '/privacy' },
              { label: 'Cookies', href: '/cookies' },
            ].map((l) => (
              <Link key={l.href} href={l.href} style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', textDecoration: 'none', padding: '6px 0' }}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ─────────── sub-components ─────────── */

function SectionLabel({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <div className={dark ? 'pm-section-label-line-dark' : 'pm-section-label-line'} style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
      <span style={{ fontSize: 10, fontWeight: 600, color: '#1B9BA8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{children}</span>
    </div>
  );
}

function FeatureCol({ tag, n, title, desc, badge }: { tag: string; n: string; title: string; desc: string; badge: string }) {
  return (
    <div className="pm-feature-col">
      <span style={{ display: 'block', fontSize: 10, color: '#1B9BA8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>{tag}</span>
      <span style={{ display: 'block', fontFamily: 'Georgia, serif', fontSize: 13, color: '#CBD5E0', marginBottom: 8 }}>{n}</span>
      <div style={{ fontSize: 13, fontWeight: 600, color: '#0A1628', lineHeight: 1.35, marginBottom: 7 }}>{title}</div>
      <p style={{ fontSize: 12, color: '#4A5568', lineHeight: 1.55, margin: '0 0 10px' }}>{desc}</p>
      <span style={{ display: 'inline-block', background: '#F4F6F8', border: '0.5px solid #CBD5E0', borderRadius: 99, padding: '4px 10px', fontSize: 10, color: '#4A5568', fontWeight: 500, whiteSpace: 'nowrap' }}>
        {badge}
      </span>
    </div>
  );
}

function ProductPreview() {
  return (
    <div style={{ background: '#FFFFFF', border: '1px solid #CBD5E0', borderRadius: 14, overflow: 'hidden', boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
      {/* Browser chrome */}
      <div style={{ background: '#EBEEF2', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ display: 'flex', gap: 5 }}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: '#CBD5E0' }} />
          ))}
        </div>
        <div style={{ flex: 1, textAlign: 'center', fontSize: 11, color: '#4A5568', fontWeight: 500 }}>
          Your filters: <span style={{ color: '#0A1628' }}>Gluten-free · Dairy-free</span>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: 14 }}>
        {/* Filter chips */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
          {['Gluten-free', 'Dairy-free'].map((f) => (
            <span key={f} style={{ background: '#0A1628', color: '#FFFFFF', borderRadius: 99, padding: '4px 10px', fontSize: 11, fontWeight: 500 }}>{f}</span>
          ))}
        </div>

        {/* Restaurant card */}
        <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 10, overflow: 'hidden' }}>
          <div style={{ minHeight: 56, background: 'linear-gradient(135deg, #1A3A4A, #0A1E2C)', padding: '10px 12px', display: 'flex', alignItems: 'flex-end', position: 'relative' }}>
            <div style={{ width: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
              <div style={{ fontFamily: 'Georgia, serif', fontSize: 11, color: '#FFFFFF', fontWeight: 400, minWidth: 0, flex: '1 1 auto' }}>
                L&apos;Artigiano del Gusto <span style={{ color: 'rgba(255,255,255,0.7)' }}>· Shoreditch</span>
              </div>
              <span style={{ background: '#1B9BA8', color: '#FFFFFF', borderRadius: 99, padding: '3px 9px', fontSize: 10, fontWeight: 500, whiteSpace: 'nowrap', flexShrink: 0 }}>9 compatible</span>
            </div>
          </div>
          <div style={{ padding: '4px 12px 10px' }}>
            {PREVIEW_DISHES.map((d, i) => (
              <div key={d.name} style={{ padding: '10px 0', borderTop: i === 0 ? 'none' : '1px solid #F0F3F6' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                  <div style={{ flex: 1, fontSize: 12, color: '#0A1628', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.name}</div>
                  <span style={{ flexShrink: 0, fontFamily: 'Georgia, serif', fontSize: 12, color: '#0A1628' }}>{d.price}</span>
                </div>
                <span style={{ display: 'inline-block', marginTop: 4, background: d.tone === 'green' ? '#EAF3DE' : '#DBEAFE', color: d.tone === 'green' ? '#276228' : '#1E40AF', borderRadius: 99, padding: '2px 7px', fontSize: 10, fontWeight: 500 }}>{d.badge}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
