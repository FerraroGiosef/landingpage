export default function TermsPage() {
  return (
    <main style={{ background: '#FDFBF7', minHeight: '100vh', padding: '40px 20px', fontFamily: 'Inter, -apple-system, sans-serif' }}>
      <article style={{ maxWidth: 720, margin: '0 auto', color: '#1A1614' }}>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 32, fontWeight: 400, marginBottom: 8 }}>Terms of Service</h1>
        <p style={{ color: '#8B7E71', marginBottom: 32 }}>Last updated: 28 April 2026</p>

        {[
          {
            title: '1. About PlateMatch',
            body: 'PlateMatch helps diners view restaurant-declared allergen and dietary information. The service is operated by PlateMatch Ltd, London, UK.',
          },
          {
            title: '2. Information accuracy',
            body: 'All menu and allergen information is provided by restaurants. PlateMatch presents this information to help with planning, but diners must always confirm suitability directly with restaurant staff before ordering.',
          },
          {
            title: '3. No medical advice',
            body: 'PlateMatch is not a medical service and does not provide allergy, nutrition, or health advice. If you have severe allergies or dietary requirements, seek professional guidance and speak with the restaurant before dining.',
          },
          {
            title: '4. Waitlist use',
            body: 'By joining the waitlist, you agree that we may contact you about PlateMatch launch updates. You can unsubscribe or request deletion at any time.',
          },
          {
            title: '5. Restaurant access',
            body: 'Restaurant early access requests do not guarantee availability. We may contact restaurants to verify menu information and onboarding suitability.',
          },
          {
            title: '6. Contact',
            body: 'For questions about these terms, contact privacy@platematch.app.',
          },
        ].map((section) => (
          <section key={section.title} style={{ marginBottom: 24 }}>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 20, fontWeight: 400, marginBottom: 8 }}>{section.title}</h2>
            <p style={{ color: '#8B7E71', lineHeight: 1.7, margin: 0 }}>{section.body}</p>
          </section>
        ))}
      </article>
    </main>
  );
}
