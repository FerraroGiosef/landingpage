'use client';

import Link from 'next/link';

const SECTIONS = [
  {
    title: '1. What cookies are',
    body: 'Cookies are small text files stored on your device. They help websites remember basic information and keep essential features working.',
  },
  {
    title: '2. What PlateMatch uses',
    body: 'PlateMatch uses only essential cookies and local browser storage required for site functionality, such as remembering temporary dietary filters during a browsing session.',
  },
  {
    title: '3. No tracking cookies',
    body: 'We do not use advertising cookies, behavioural tracking cookies, or third-party marketing pixels.',
  },
  {
    title: '4. Managing cookies',
    body: 'You can block or delete cookies in your browser settings. Some essential site features may stop working if browser storage is disabled.',
  },
  {
    title: '5. Contact',
    body: 'Questions about cookies or privacy can be sent to privacy@platematch.app.',
  },
];

export default function CookiesPage() {
  return (
    <main style={{ background: '#FDFBF7', minHeight: '100vh', padding: '40px 20px', fontFamily: 'Inter, -apple-system, sans-serif' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <Link href="/" style={{ color: '#8B7E71', fontSize: 13, textDecoration: 'none' }}>← Back to PlateMatch</Link>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 30, fontWeight: 400, color: '#1A1614', margin: '24px 0 8px' }}>
          Cookie Policy
        </h1>
        <p style={{ fontSize: 13, color: '#8B7E71', margin: '0 0 28px' }}>Last updated: 28 April 2026</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {SECTIONS.map((section) => (
            <section key={section.title} style={{ background: '#FFFFFF', border: '0.5px solid #C4B9A8', borderRadius: 14, padding: '18px 20px' }}>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 18, fontWeight: 400, color: '#1A1614', margin: '0 0 8px' }}>
                {section.title}
              </h2>
              <p style={{ fontSize: 13, color: '#8B7E71', lineHeight: 1.7, margin: 0 }}>{section.body}</p>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
