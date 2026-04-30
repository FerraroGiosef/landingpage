export default function CookiesPage() {
  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: '40px 24px', fontFamily: 'Inter, -apple-system, sans-serif', color: '#1A1614' }}>
      <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 28, fontWeight: 400, marginBottom: 8 }}>Cookie Policy</h1>
      <p style={{ fontSize: 13, color: '#8B7E71', marginBottom: 24 }}>Last updated: April 2026</p>

      <div style={{ fontSize: 14, lineHeight: 1.8, color: '#3A3530' }}>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 18, fontWeight: 400, marginTop: 24, marginBottom: 8 }}>Cookies we use</h2>
        <p>PlateMatch uses only essential cookies required for the site to function correctly. These include session cookies and preference cookies (such as your selected allergen filters stored in your browser&apos;s sessionStorage).</p>

        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 18, fontWeight: 400, marginTop: 24, marginBottom: 8 }}>What we do not use</h2>
        <p>We do not use third-party tracking cookies, advertising cookies, or analytics cookies that track individual users across websites. We do not share cookie data with any third parties.</p>

        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 18, fontWeight: 400, marginTop: 24, marginBottom: 8 }}>Managing cookies</h2>
        <p>You can control and delete cookies through your browser settings. Disabling cookies may affect the functionality of the allergen filter feature.</p>
      </div>

      <div style={{ marginTop: 32, paddingTop: 16, borderTop: '0.5px solid #C4B9A8', fontSize: 12, color: '#8B7E71' }}>
        PlateMatch Ltd · London, UK · privacy@platematch.app
      </div>
    </div>
  );
}
