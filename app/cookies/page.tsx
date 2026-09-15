'use client';
export default function CookiesPage() {
  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: '40px 24px', fontFamily: 'Inter, -apple-system, sans-serif', color: '#1A1614' }}>
      <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 28, fontWeight: 400, marginBottom: 8 }}>Cookie Policy</h1>
      <p style={{ fontSize: 13, color: '#8B7E71', marginBottom: 32 }}>Last updated: September 2026</p>
      <div style={{ fontSize: 14, lineHeight: 1.8, color: '#3A3530' }}>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 18, fontWeight: 400, marginTop: 0, marginBottom: 8 }}>1. Overview</h2>
        <p>This Cookie Policy explains how PlateMatch Ltd uses cookies and similar storage technologies. It is governed by the Privacy and Electronic Communications Regulations 2003 (PECR), the Data (Use and Access) Act 2025 (in force 5 February 2026), and the UK GDPR.</p>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 18, fontWeight: 400, marginTop: 32, marginBottom: 8 }}>2. What we use and why</h2>
        <h3 style={{ fontSize: 15, fontWeight: 600, marginTop: 20, marginBottom: 6 }}>Strictly necessary — no consent required</h3>
        <p>These are essential for the app to function. Under PECR and the Data (Use and Access) Act 2025, strictly necessary technologies are exempt from consent.</p>
        <ul style={{ paddingLeft: 20, marginTop: 8 }}>
          <li style={{ marginBottom: 6 }}><strong>sessionStorage — allergen filters</strong> (pm_filters): stores your allergen preferences as you navigate. Deleted when you close the tab. Never sent to our servers.</li>
          <li style={{ marginBottom: 6 }}><strong>sessionStorage — tab and booking preferences</strong> (pm_tab_*, pm_booking_prefs): remembers your current tab and booking details within a session. Deleted when you close the tab.</li>
          <li style={{ marginBottom: 6 }}><strong>localStorage — saved restaurants</strong> (pm_favourites): stores restaurants you have saved. Stays on your device until you clear your browser data. Never sent to our servers.</li>
          <li style={{ marginBottom: 6 }}><strong>localStorage — Group Match profiles</strong> (pm_group_profiles): stores dietary profiles for group dining. Stays on your device. Never sent to our servers.</li>
        </ul>
        <p style={{ marginTop: 8, padding: '10px 14px', background: '#F5F0E8', borderRadius: 8, fontSize: 13 }}>All of the above are stored only on your device. We cannot access this data. No consent is required under PECR.</p>
        <h3 style={{ fontSize: 15, fontWeight: 600, marginTop: 24, marginBottom: 6 }}>Anonymous analytics — statistical purposes exception</h3>
        <p>We use PostHog to collect anonymous usage data. It is configured to collect no personal data, perform no cross-session tracking, and record only anonymous events such as page viewed and filter applied. Analytics data is never combined with personal data or allergen preferences. You can opt out by contacting us.</p>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 18, fontWeight: 400, marginTop: 32, marginBottom: 8 }}>3. What we do NOT use</h2>
        <ul style={{ paddingLeft: 20 }}>
          <li style={{ marginBottom: 6 }}>Advertising or marketing cookies</li>
          <li style={{ marginBottom: 6 }}>Behavioural tracking or profiling technologies</li>
          <li style={{ marginBottom: 6 }}>Third-party social media pixels</li>
          <li style={{ marginBottom: 6 }}>Cross-site tracking technologies</li>
          <li style={{ marginBottom: 6 }}>Any technology that links allergen preferences to personal identity</li>
        </ul>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 18, fontWeight: 400, marginTop: 32, marginBottom: 8 }}>4. Allergen data and PECR</h2>
        <p>Your allergen preferences are stored only in your browser sessionStorage. They are never transmitted to or processed by our servers. Because we do not process this data as a controller, no UK GDPR Article 9 obligations arise on our part. If you create an account in the future, a separate notice will be provided.</p>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 18, fontWeight: 400, marginTop: 32, marginBottom: 8 }}>5. Your controls</h2>
        <p>You can delete all browser storage at any time through your browser settings. This will remove your saved allergen filters, favourites, and Group Match profiles. To opt out of anonymous analytics, contact us.</p>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 18, fontWeight: 400, marginTop: 32, marginBottom: 8 }}>6. Changes and contact</h2>
        <p>We will update this policy when we change technologies or when law changes. For questions, contact us through the app.</p>
        <p style={{ marginTop: 8, fontSize: 12, color: '#8B7E71' }}>Legal basis: PECR 2003 · Data (Use and Access) Act 2025 · UK GDPR · ICO Guidance on Storage and Access Technologies 2025</p>
      </div>
      <div style={{ marginTop: 32, paddingTop: 16, borderTop: '0.5px solid #C4B9A8', fontSize: 12, color: '#8B7E71' }}>
        PlateMatch Ltd · London, UK · September 2026
      </div>
    </div>
  );
}
