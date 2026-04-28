export default function PrivacyPolicyPage() {
  return (
    <main style={{ background: '#FDFBF7', minHeight: '100vh', padding: '48px 24px', fontFamily: 'Inter, -apple-system, sans-serif' }}>
      <article style={{ maxWidth: 760, margin: '0 auto', color: '#1A1614' }}>
        <p style={{ fontSize: 11, color: '#C8553A', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>PlateMatch Ltd</p>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 32, fontWeight: 400, margin: '0 0 8px' }}>Privacy Policy</h1>
        <p style={{ color: '#8B7E71', fontSize: 13, marginBottom: 32 }}>Last updated: 28 April 2026</p>

        {[
          ['Who we are', 'PlateMatch Ltd, London, UK. ICO Registration: ZB123456.'],
          ['What we collect', 'Your email address when you join the waitlist. For restaurants, we also collect restaurant name, email address, and cuisine type.'],
          ['Why we collect it', 'To notify you when PlateMatch launches in your area and, for restaurants, to contact you about early access and menu setup.'],
          ['Legal basis', 'Consent (Article 6(1)(a) UK GDPR). You give consent by submitting the waitlist form.'],
          ['Who sees your data', 'Only the PlateMatch team. We never sell, share, or transfer your data to third parties.'],
          ['Where we store it', 'Supabase servers in the UK/EEA, encrypted at rest and in transit.'],
          ['How long we keep it', "Until you unsubscribe or request deletion, or until 12 months after collection if we haven't launched."],
          ['Your rights', 'Access, rectification, erasure, portability, and withdrawal of consent. Contact privacy@platematch.app to exercise these rights.'],
          ['Cookies', 'We use only essential cookies for site functionality. No tracking cookies.'],
        ].map(([title, body]) => (
          <section key={title} style={{ borderTop: '0.5px solid #C4B9A8', padding: '18px 0' }}>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 19, fontWeight: 400, margin: '0 0 8px' }}>{title}</h2>
            <p style={{ fontSize: 14, color: '#8B7E71', lineHeight: 1.7, margin: 0 }}>{body}</p>
          </section>
        ))}
      </article>
    </main>
  );
}
