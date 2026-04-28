'use client';

import { useState } from 'react';

export default function SettingsPage() {
  const [name, setName] = useState("L'Artigiano del Gusto");
  const [address, setAddress] = useState('47 Redchurch Street, Shoreditch, London E2 7DJ');
  const [phone, setPhone] = useState('+44 20 7123 4567');
  const [bookingUrl, setBookingUrl] = useState('https://resy.com/cities/lon/lartigiano');
  const [reviewDays, setReviewDays] = useState('30');
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div style={{ fontFamily: 'Inter, -apple-system, sans-serif' }}>
      {/* Header */}
      <div style={{ padding: '16px 16px 0', borderBottom: '0.5px solid #C4B9A8' }}>
        <div style={{ marginBottom: 16 }}>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 20, fontWeight: 400, color: '#1A1614', margin: 0 }}>Settings</h1>
          <p style={{ fontSize: 11, color: '#8B7E71', margin: '4px 0 0' }}>Restaurant profile &amp; preferences</p>
        </div>
      </div>

      <div style={{ padding: '16px' }}>
        {/* Restaurant info */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: '#8B7E71', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Restaurant info</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Field label="Restaurant name" value={name} onChange={setName} />
            <Field label="Address" value={address} onChange={setAddress} />
            <Field label="Phone number" value={phone} onChange={setPhone} type="tel" />
            <Field label="Booking URL" value={bookingUrl} onChange={setBookingUrl} type="url" />
          </div>
        </div>

        {/* Allergen settings */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: '#8B7E71', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Allergen management</div>
          <div style={{ background: '#FFFFFF', border: '0.5px solid #C4B9A8', borderRadius: 12, overflow: 'hidden' }}>
            <div style={{ padding: '14px 14px 10px', borderBottom: '0.5px solid #F5F0E8' }}>
              <div style={{ fontSize: 12, color: '#1A1614', fontWeight: 500, marginBottom: 4 }}>Menu review reminder</div>
              <div style={{ fontSize: 11, color: '#8B7E71', marginBottom: 10 }}>How often should we remind you to review allergen data?</div>
              <div style={{ display: 'flex', background: '#F5F0E8', borderRadius: 8, padding: 2, gap: 2 }}>
                {['14', '30', '60', '90'].map((days) => (
                  <button
                    key={days}
                    onClick={() => setReviewDays(days)}
                    style={{
                      flex: 1,
                      padding: '6px 4px',
                      borderRadius: 6,
                      border: 'none',
                      background: reviewDays === days ? '#FFFFFF' : 'transparent',
                      color: reviewDays === days ? '#1A1614' : '#8B7E71',
                      fontSize: 11,
                      fontWeight: reviewDays === days ? 500 : 400,
                      cursor: 'pointer',
                      boxShadow: reviewDays === days ? '0 0.5px 2px rgba(0,0,0,0.08)' : 'none',
                    }}
                  >
                    {days}d
                  </button>
                ))}
              </div>
            </div>
            <ToggleRow label="Show 'Traces of' information" subtitle="Display trace allergens separately from full contains" defaultOn />
            <ToggleRow label="Owen's Law compliant display" subtitle="Show allergen info prominently on every dish" defaultOn />
          </div>
        </div>

        {/* Account */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: '#8B7E71', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Account</div>
          <div style={{ background: '#FFFFFF', border: '0.5px solid #C4B9A8', borderRadius: 12, overflow: 'hidden' }}>
            <div style={{ padding: '14px', borderBottom: '0.5px solid #F5F0E8' }}>
              <div style={{ fontSize: 11, color: '#8B7E71', marginBottom: 2 }}>Signed in as</div>
              <div style={{ fontSize: 13, color: '#1A1614' }}>manager@lartigiano.co.uk</div>
            </div>
            <button style={{ width: '100%', padding: '14px', background: 'transparent', border: 'none', textAlign: 'left', cursor: 'pointer', fontSize: 12, color: '#C8553A' }}>
              Sign out
            </button>
          </div>
        </div>

        {/* Legal */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 11, color: '#8B7E71', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Legal</div>
          <div style={{ background: '#F5F0E8', border: '0.5px solid #C4B9A8', borderRadius: 10, padding: '12px 14px' }}>
            <p style={{ fontSize: 11, color: '#8B7E71', margin: 0, lineHeight: 1.65 }}>
              By publishing allergen information on PlateMatch, your restaurant accepts responsibility for the accuracy of all allergen data. Diners are always advised to confirm with staff before ordering.
            </p>
          </div>
        </div>

        {/* Save */}
        <button
          onClick={handleSave}
          style={{
            width: '100%',
            background: saved ? '#EDF6E2' : '#1A1614',
            color: saved ? '#3A6B0A' : '#FDFBF7',
            border: 'none',
            borderRadius: 10,
            padding: '14px',
            fontSize: 13,
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          {saved ? 'Saved ✓' : 'Save changes'}
        </button>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = 'text' }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 11, color: '#8B7E71', marginBottom: 5 }}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: '100%',
          background: '#FFFFFF',
          border: '0.5px solid #C4B9A8',
          borderRadius: 10,
          padding: '11px 14px',
          fontSize: 13,
          color: '#1A1614',
          outline: 'none',
          fontFamily: 'inherit',
          boxSizing: 'border-box',
        }}
      />
    </div>
  );
}

function ToggleRow({ label, subtitle, defaultOn }: { label: string; subtitle: string; defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn ?? false);
  return (
    <div
      style={{ padding: '14px', borderBottom: '0.5px solid #F5F0E8', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}
      onClick={() => setOn(!on)}
    >
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 12, color: '#1A1614', fontWeight: 500, marginBottom: 2 }}>{label}</div>
        <div style={{ fontSize: 11, color: '#8B7E71' }}>{subtitle}</div>
      </div>
      <div
        style={{
          width: 42,
          height: 24,
          borderRadius: 100,
          background: on ? '#1A1614' : '#C4B9A8',
          position: 'relative',
          flexShrink: 0,
          transition: 'background 0.2s',
        }}
      >
        <div
          style={{
            width: 18,
            height: 18,
            borderRadius: '50%',
            background: '#FFFFFF',
            position: 'absolute',
            top: 3,
            left: on ? 21 : 3,
            transition: 'left 0.2s',
          }}
        />
      </div>
    </div>
  );
}
