'use client';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: '0 20px', fontFamily: 'Inter, -apple-system, sans-serif', background: '#FFFFFF', minHeight: '100vh' }}>

      {/* NAV */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '0.5px solid #CBD5E0', marginBottom: 48, position: 'sticky', top: 0, background: '#FFFFFF', zIndex: 10 }}>
        <Link href="/" style={{ fontFamily: 'Georgia, serif', fontSize: 16, color: '#0A1628', textDecoration: 'none', letterSpacing: '-0.3px' }}>
          PlateMatch
        </Link>
        <Link href="/#waitlist" style={{ fontSize: 12, fontWeight: 500, background: '#1B5E7A', color: '#FFFFFF', borderRadius: 7, padding: '8px 16px', textDecoration: 'none' }}>
          Join waitlist
        </Link>
      </nav>

      {/* HEADER */}
      <div style={{ marginBottom: 48 }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: '#1B9BA8', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 12 }}>
          The founder
        </div>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 36, color: '#0A1628', lineHeight: 1.15, letterSpacing: '-0.8px', fontWeight: 400, marginBottom: 20 }}>
          Why I built this.
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 20px', background: '#F4F6F8', borderRadius: 12, border: '0.5px solid #CBD5E0' }}>
          <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#1B5E7A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Georgia, serif', fontSize: 18, color: '#FFFFFF', flexShrink: 0 }}>GF</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 500, color: '#0A1628', marginBottom: 2 }}>Giosef Ferraro</div>
            <div style={{ fontSize: 12, color: '#4A5568' }}>Assistant Manager · Software Development Student · Founder</div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: '#E0F2F4', color: '#0C4A5C', borderRadius: 99, padding: '3px 10px', fontSize: 10, fontWeight: 500, marginTop: 6 }}>
              London
            </div>
          </div>
        </div>
      </div>

      {/* STORY */}
      <div style={{ fontSize: 16, color: '#2C3E50', lineHeight: 1.85 }}>

        <p style={{ marginBottom: 24 }}>
          I have a condition called G6PD deficiency — a rare allergy to legumes that almost nobody in the UK has heard of. Fava beans, peas, certain Asian dishes. Every time I eat somewhere new, I have to explain something most people in the kitchen have never encountered.
        </p>

        <p style={{ marginBottom: 24 }}>
          I work as an assistant manager in hospitality. I&apos;ve stood on both sides of this problem. I&apos;ve been the person at the table not knowing what I can order. And I&apos;ve been the manager watching customers with multiple allergies arrive uncertain, stressed, and spending their evening managing their condition instead of enjoying the company of the people they came with.
        </p>

        <blockquote style={{ fontFamily: 'Georgia, serif', fontSize: 20, color: '#0A1628', fontStyle: 'italic', lineHeight: 1.6, margin: '36px 0', paddingLeft: 20, borderLeft: '3px solid #1B9BA8' }}>
          &ldquo;People without allergies open a menu, choose what they feel like eating, and book. Simple. People with allergies do the same — and then call ahead, send emails, wait for answers, and still arrive uncertain.&rdquo;
        </blockquote>

        <p style={{ marginBottom: 24 }}>
          That gap felt wrong to me. Not because it&apos;s complicated to fix — but because nobody had bothered to fix it.
        </p>

        <p style={{ marginBottom: 24 }}>
          So I enrolled in a software development bootcamp. Not because I planned to become a developer, but because I had a problem I needed to solve and I wasn&apos;t willing to wait for someone else to solve it. This app is the result.
        </p>

        <p style={{ marginBottom: 36 }}>
          I&apos;m not a doctor. I&apos;m not a food scientist. I&apos;m a hospitality professional who knows from the inside how restaurants work, what information exists, and what&apos;s missing. I built this to give everyone with dietary needs the same freedom that everyone else takes for granted: choose a restaurant because you want that cuisine tonight, not because you&apos;ve verified it&apos;s manageable.
        </p>

      </div>

      {/* MISSION CARD */}
      <div style={{ background: '#0A1628', borderRadius: 14, padding: '28px 24px', marginBottom: 48 }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: '#1B9BA8', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 12 }}>The mission</div>
        <p style={{ fontFamily: 'Georgia, serif', fontSize: 20, color: '#FFFFFF', lineHeight: 1.6, fontWeight: 400, marginBottom: 0 }}>
          &ldquo;Give everyone with dietary needs the same freedom to choose a restaurant that everyone else takes for granted.&rdquo;
        </p>
      </div>

      {/* CTA */}
      <div style={{ textAlign: 'center', padding: '0 0 64px' }}>
        <div style={{ fontSize: 14, color: '#4A5568', marginBottom: 16 }}>
          Want to be among the first to try it in London?
        </div>
        <Link href="/#waitlist" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#1B5E7A', color: '#FFFFFF', borderRadius: 9, padding: '14px 28px', fontSize: 14, fontWeight: 500, textDecoration: 'none' }}>
          Join the waitlist
        </Link>
        <div style={{ fontSize: 12, color: '#A0AEC0', marginTop: 10 }}>
          Free for diners · Always
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ borderTop: '0.5px solid #CBD5E0', padding: '16px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: 'Georgia, serif', fontSize: 13, color: '#A0AEC0' }}>PlateMatch</span>
        <div style={{ display: 'flex', gap: 16 }}>
          <Link href="/terms" style={{ fontSize: 11, color: '#A0AEC0', textDecoration: 'none' }}>Terms</Link>
          <Link href="/privacy" style={{ fontSize: 11, color: '#A0AEC0', textDecoration: 'none' }}>Privacy</Link>
          <Link href="/cookies" style={{ fontSize: 11, color: '#A0AEC0', textDecoration: 'none' }}>Cookies</Link>
        </div>
      </div>

    </div>
  );
}
