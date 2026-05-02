export default function TermsPage() {
  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: '40px 24px', fontFamily: 'Inter, -apple-system, sans-serif', color: '#1A1614' }}>
      <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 28, fontWeight: 400, marginBottom: 8 }}>Terms of Service</h1>
      <p style={{ fontSize: 13, color: '#8B7E71', marginBottom: 24 }}>Last updated: April 2026</p>

      <div style={{ fontSize: 14, lineHeight: 1.8, color: '#3A3530' }}>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 18, fontWeight: 400, marginTop: 24, marginBottom: 8 }}>1. Service description</h2>
        <p>PlateMatch is a platform that helps people with dietary requirements find compatible dishes at restaurants. Allergen information is provided by restaurants and presented by PlateMatch for informational purposes.</p>

        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 18, fontWeight: 400, marginTop: 24, marginBottom: 8 }}>2. Allergen information disclaimer</h2>
        <p>PlateMatch presents allergen data as declared by each restaurant. PlateMatch does not independently test, verify, or certify the accuracy of allergen declarations. Users must always confirm allergen information directly with restaurant staff before ordering or consuming food. PlateMatch cannot be held responsible for inaccurate allergen information provided by restaurants.</p>

        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 18, fontWeight: 400, marginTop: 24, marginBottom: 8 }}>3. Cross-contamination</h2>
        <p>Even when a dish does not contain a specific allergen as an ingredient, cross-contamination may occur during preparation. Dishes marked as &quot;May contain traces&quot; indicate possible cross-contact. Users with severe allergies should always communicate directly with the restaurant.</p>

        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 18, fontWeight: 400, marginTop: 24, marginBottom: 8 }}>4. User responsibilities</h2>
        <p>Users are responsible for communicating their dietary requirements to restaurant staff. PlateMatch is a discovery and information tool, not a substitute for direct communication with the restaurant.</p>

        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 18, fontWeight: 400, marginTop: 24, marginBottom: 8 }}>5. Restaurant responsibilities</h2>
        <p>Restaurants that list on PlateMatch are responsible for the accuracy of their allergen declarations and for keeping their information up to date.</p>

        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 18, fontWeight: 400, marginTop: 24, marginBottom: 8 }}>6. Limitation of liability</h2>
        <p>PlateMatch is provided &quot;as is&quot; without warranties of any kind. To the fullest extent permitted by law, PlateMatch Ltd shall not be liable for any allergic reaction, illness, or injury resulting from the use of information presented on the platform.</p>
      </div>

      <div style={{ marginTop: 32, paddingTop: 16, borderTop: '0.5px solid #C4B9A8', fontSize: 12, color: '#8B7E71' }}>
        PlateMatch Ltd · London, UK · legal@platematch.app
      </div>
    </div>
  );
}
