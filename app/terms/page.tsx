'use client';
export default function TermsPage() {
  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: '40px 24px', fontFamily: 'Inter, -apple-system, sans-serif', color: '#1A1614' }}>
      <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 28, fontWeight: 400, marginBottom: 8 }}>Terms of Service</h1>
      <p style={{ fontSize: 13, color: '#8B7E71', marginBottom: 32 }}>Last updated: September 2026</p>
      <div style={{ fontSize: 14, lineHeight: 1.8, color: '#3A3530' }}>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 18, fontWeight: 400, marginTop: 0, marginBottom: 8 }}>1. Who we are</h2>
        <p>PlateMatch Ltd operates a platform that helps people with dietary requirements find restaurants and dishes compatible with their needs. By using this platform you agree to these Terms. If you do not agree, please do not use the platform.</p>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 18, fontWeight: 400, marginTop: 32, marginBottom: 8 }}>2. Allergen information — critical notice</h2>
        <p>PlateMatch is an <strong>information and discovery tool only</strong>. It is not a food safety guarantee and must not be treated as one. Allergen information is sourced from two types of sources:</p>
        <ul style={{ paddingLeft: 20, marginTop: 8 }}>
          <li style={{ marginBottom: 8 }}><strong>Community data:</strong> collected from publicly available sources including restaurant websites and published allergen charts. Marked with a &quot;Community data — not verified by restaurant&quot; badge. Not independently tested or confirmed by the restaurant through our platform.</li>
          <li style={{ marginBottom: 8 }}><strong>Verified data:</strong> uploaded and confirmed by the restaurant directly through our platform. Marked with a &quot;Verified ✓&quot; badge. The restaurant has declared accuracy under Food Information Regulations 2014 and accepted responsibility for keeping it current.</li>
        </ul>
        <p style={{ marginTop: 12, padding: '12px 16px', background: '#F5F0E8', borderRadius: 8, fontWeight: 600 }}>In all cases you must always confirm allergen information directly with restaurant staff before ordering. This applies regardless of badge status.</p>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 18, fontWeight: 400, marginTop: 32, marginBottom: 8 }}>3. Limitation of liability</h2>
        <p>PlateMatch does not independently test, certify, or guarantee the accuracy of allergen information. To the fullest extent permitted by law under the Consumer Rights Act 2015:</p>
        <ul style={{ paddingLeft: 20, marginTop: 8 }}>
          <li style={{ marginBottom: 6 }}>PlateMatch is not liable for any allergic reaction, illness, or harm resulting from use of information on this platform</li>
          <li style={{ marginBottom: 6 }}>PlateMatch is not liable for errors or inaccuracies in allergen information provided by restaurants</li>
          <li style={{ marginBottom: 6 }}>PlateMatch is not liable for menu or recipe changes occurring after data was collected or verified</li>
          <li style={{ marginBottom: 6 }}>PlateMatch is not liable for cross-contamination during food preparation</li>
        </ul>
        <p style={{ marginTop: 8 }}>Nothing in these Terms limits liability that cannot be excluded by law, including liability for death or personal injury caused by negligence.</p>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 18, fontWeight: 400, marginTop: 32, marginBottom: 8 }}>4. Cross-contamination</h2>
        <p>Even when a dish does not contain an allergen as an ingredient, cross-contamination may occur during preparation. Dishes marked &quot;May contain traces&quot; indicate a risk of cross-contact. If you have a severe allergy or anaphylaxis risk, you must communicate this verbally to restaurant staff before ordering.</p>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 18, fontWeight: 400, marginTop: 32, marginBottom: 8 }}>5. Your responsibilities</h2>
        <ul style={{ paddingLeft: 20 }}>
          <li style={{ marginBottom: 6 }}>You must communicate dietary requirements directly to restaurant staff before ordering</li>
          <li style={{ marginBottom: 6 }}>You must not rely solely on this platform when making food choices involving allergen risks</li>
          <li style={{ marginBottom: 6 }}>If you believe allergen data is incorrect, you must report it and contact the restaurant directly</li>
        </ul>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 18, fontWeight: 400, marginTop: 32, marginBottom: 8 }}>6. Restaurant listings</h2>
        <p>Restaurants may be listed without prior permission, consistent with established UK restaurant directory practice. Allergen information is legally required to be made available to consumers under Food Information Regulations 2014 (FIR 2014) and is therefore publicly available. Restaurants may claim their listing, update their data, or request removal by contacting us.</p>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 18, fontWeight: 400, marginTop: 32, marginBottom: 8 }}>7. Intellectual property</h2>
        <p>The platform, its design and code are owned by PlateMatch Ltd. Restaurant names, menus, and publicly available business information are used for informational purposes under UK law. We do not claim ownership of restaurant names, logos, or photographs.</p>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 18, fontWeight: 400, marginTop: 32, marginBottom: 8 }}>8. Governing law</h2>
        <p>These Terms are governed by the law of England and Wales. Any dispute shall be subject to the exclusive jurisdiction of the courts of England and Wales.</p>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 18, fontWeight: 400, marginTop: 32, marginBottom: 8 }}>9. Changes and contact</h2>
        <p>We may update these Terms from time to time. We will update the date at the top of this page. For questions or to request listing removal, contact us through the app.</p>
        <p style={{ marginTop: 8, fontSize: 12, color: '#8B7E71' }}>Legal framework: Consumer Rights Act 2015 · Food Information Regulations 2014 · Natasha&apos;s Law 2021 · Consumer Protection from Unfair Trading Regulations 2008 · UK GDPR</p>
      </div>
      <div style={{ marginTop: 32, paddingTop: 16, borderTop: '0.5px solid #C4B9A8', fontSize: 12, color: '#8B7E71' }}>
        PlateMatch Ltd · London, UK · September 2026
      </div>
    </div>
  );
}
