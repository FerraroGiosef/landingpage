export default function PrivacyPage() {
  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: '40px 24px', fontFamily: 'Inter, -apple-system, sans-serif', color: '#1A1614' }}>
      <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 28, fontWeight: 400, marginBottom: 8 }}>Privacy Policy</h1>
      <p style={{ fontSize: 13, color: '#8B7E71', marginBottom: 24 }}>Last updated: April 2026</p>

      <div style={{ fontSize: 14, lineHeight: 1.8, color: '#3A3530' }}>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 18, fontWeight: 400, marginTop: 24, marginBottom: 8 }}>1. Who we are</h2>
        <p>PlateMatch Ltd, London, UK. Registered with the Information Commissioner&apos;s Office (ICO).</p>

        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 18, fontWeight: 400, marginTop: 24, marginBottom: 8 }}>2. What we collect</h2>
        <p>When you join the waitlist: your email address. When you register a restaurant: restaurant name, contact email, cuisine type. When you use the app: your selected allergen preferences (stored locally on your device, not sent to our servers unless you create an account).</p>

        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 18, fontWeight: 400, marginTop: 24, marginBottom: 8 }}>3. Why we collect it</h2>
        <p>To notify you when PlateMatch launches. To onboard restaurants. To improve the service.</p>

        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 18, fontWeight: 400, marginTop: 24, marginBottom: 8 }}>4. Legal basis</h2>
        <p>Consent (Article 6(1)(a) UK GDPR). You give consent by submitting the waitlist or registration form.</p>

        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 18, fontWeight: 400, marginTop: 24, marginBottom: 8 }}>5. Who sees your data</h2>
        <p>Only the PlateMatch team. We never sell, share, or transfer your personal data to third parties.</p>

        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 18, fontWeight: 400, marginTop: 24, marginBottom: 8 }}>6. Where we store it</h2>
        <p>Supabase servers in the EU/EEA, encrypted at rest and in transit.</p>

        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 18, fontWeight: 400, marginTop: 24, marginBottom: 8 }}>7. How long we keep it</h2>
        <p>Until you unsubscribe or request deletion, or 12 months after collection if we have not launched.</p>

        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 18, fontWeight: 400, marginTop: 24, marginBottom: 8 }}>8. Your rights</h2>
        <p>You have the right to access, rectify, erase, and port your data, and to withdraw consent at any time. Contact: privacy@platematch.app</p>

        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 18, fontWeight: 400, marginTop: 24, marginBottom: 8 }}>9. Allergen data disclaimer</h2>
        <p>Allergen information displayed in PlateMatch is declared by the restaurant and verified by the restaurant owner or manager. PlateMatch does not independently verify allergen data and cannot guarantee its accuracy. Users should always confirm allergen information with restaurant staff before ordering.</p>

        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 18, fontWeight: 400, marginTop: 24, marginBottom: 8 }}>10. Cookies</h2>
        <p>We use only essential cookies required for site functionality (session management, preferences). We do not use tracking cookies or third-party advertising cookies.</p>
      </div>

      <div style={{ marginTop: 32, paddingTop: 16, borderTop: '0.5px solid #C4B9A8', fontSize: 12, color: '#8B7E71' }}>
        PlateMatch Ltd · London, UK · privacy@platematch.app
      </div>
    </div>
  );
}
