'use client';

import { useState } from 'react';
import Link from 'next/link';

const DISHES_LIVE = [
  { id: 105, name: 'Risotto ai Funghi Selvatici', price: '£16.50', allergens: ['Vegan', 'GF', 'Traces: Celery'], verified: true },
  { id: 101, name: 'Bruschetta al Pomodoro', price: '£7.50', allergens: ['Vegan', 'Contains: Gluten', 'Traces: Sesame'], verified: true },
  { id: 106, name: 'Melanzane alla Parmigiana', price: '£15.00', allergens: ['Contains: Milk', 'Contains: Eggs'], verified: true },
  { id: 109, name: 'Salmone alla Griglia', price: '£19.00', allergens: ['Contains: Fish', 'Contains: Milk'], verified: true },
  { id: 107, name: 'Pollo Arrosto con Rosmarino', price: '£18.00', allergens: [], verified: true },
  { id: 108, name: 'Pasta al Ragù di Manzo', price: '£14.50', allergens: ['Contains: Gluten', 'Contains: Milk', 'Contains: Eggs', 'Traces: Celery'], verified: false },
];

export default function AdminDashboard() {
  const [showMagicLink, setShowMagicLink] = useState(false);
  const [email, setEmail] = useState('');
  const [sentLink, setSentLink] = useState(false);

  if (!sentLink && showMagicLink === false) {
    return (
      <AdminLoginScreen onLogin={() => setSentLink(true)} onShowForm={() => setShowMagicLink(true)} showForm={showMagicLink} email={email} setEmail={setEmail} setSentLink={setSentLink} />
    );
  }

  if (showMagicLink && !sentLink) {
    return (
      <AdminLoginScreen onLogin={() => setSentLink(true)} onShowForm={() => setShowMagicLink(true)} showForm={showMagicLink} email={email} setEmail={setEmail} setSentLink={setSentLink} />
    );
  }

  return <AdminDashboardContent />;
}

function AdminLoginScreen({ onShowForm, showForm, email, setEmail, setSentLink }: {
  onLogin: () => void;
  onShowForm: () => void;
  showForm: boolean;
  email: string;
  setEmail: (e: string) => void;
  setSentLink: (v: boolean) => void;
}) {
  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 24px' }}>
      <div style={{ fontFamily: 'Georgia, serif', fontSize: 18, color: '#1A1614', marginBottom: 4, letterSpacing: '-0.3px' }}>PlateMatch</div>
      <div style={{ fontSize: 11, color: '#8B7E71', marginBottom: 32 }}>Restaurant dashboard</div>

      <div style={{ width: '100%', maxWidth: 320 }}>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 22, fontWeight: 400, color: '#1A1614', marginBottom: 8, letterSpacing: '-0.3px' }}>Sign in</h1>
        <p style={{ fontSize: 13, color: '#8B7E71', marginBottom: 24 }}>We&apos;ll send you a one-tap magic link. No password needed.</p>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="restaurant@example.com"
          style={{ width: '100%', background: '#F5F0E8', border: '0.5px solid #C4B9A8', borderRadius: 10, padding: '12px 14px', fontSize: 13, color: '#1A1614', outline: 'none', fontFamily: 'inherit', marginBottom: 12, boxSizing: 'border-box' }}
        />
        <button
          onClick={() => setSentLink(true)}
          style={{ width: '100%', background: '#1A1614', color: '#FDFBF7', border: 'none', borderRadius: 10, padding: '13px', fontSize: 13, cursor: 'pointer', marginBottom: 16 }}
        >
          Send magic link
        </button>

        <div style={{ textAlign: 'center', fontSize: 11, color: '#8B7E71' }}>
          <span>Demo mode: </span>
          <button onClick={() => setSentLink(true)} style={{ background: 'none', border: 'none', color: '#C8553A', cursor: 'pointer', fontSize: 11 }}>
            Enter dashboard →
          </button>
        </div>
      </div>
    </div>
  );
}

function AdminDashboardContent() {
  return (
    <div>
      {/* Top bar */}
      <div style={{ padding: '16px 16px 0', borderBottom: '0.5px solid #C4B9A8', background: '#FDFBF7' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 11, color: '#8B7E71', marginBottom: 2 }}>PlateMatch for Restaurants</div>
            <div style={{ fontFamily: 'Georgia, serif', fontSize: 18, color: '#1A1614', letterSpacing: '-0.3px' }}>{"L'Artigiano del Gusto"}</div>
          </div>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#1A1614', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 500, color: '#FDFBF7' }}>AG</div>
        </div>
      </div>

      <div style={{ padding: '16px' }}>
        {/* Demo Mode Banner — remove when Supabase is connected */}
        <div style={{
          margin: '0 0 12px',
          padding: '10px 14px',
          background: '#FEF3C7',
          border: '0.5px solid #F59E0B',
          borderRadius: 10,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}>
          <span style={{ fontSize: 14 }}>&#9888;&#65039;</span>
          <span style={{ fontSize: 12, color: '#92400E', lineHeight: 1.5 }}>
            You&apos;re viewing demo data. Real restaurant menus will appear here once onboarded.
          </span>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 16 }}>
          {[
            { value: '28', label: 'Dishes live' },
            { value: '1,240', label: 'Views this week' },
            { value: '12', label: 'Bookings' },
          ].map((stat) => (
            <div key={stat.label} style={{ background: '#F5F0E8', borderRadius: 12, padding: '14px 12px', border: '0.5px solid #C4B9A8', textAlign: 'center' }}>
              <div style={{ fontFamily: 'Georgia, serif', fontSize: 20, color: '#1A1614', marginBottom: 2 }}>{stat.value}</div>
              <div style={{ fontSize: 10, color: '#8B7E71' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
          <Link href="/admin/menu/import" style={{ flex: 1, background: '#1A1614', color: '#FDFBF7', borderRadius: 10, padding: '12px', fontSize: 12, textDecoration: 'none', textAlign: 'center', display: 'block' }}>
            Update menu
          </Link>
          <Link href="/app/restaurant/lartigiano-del-gusto" style={{ flex: 1, background: 'transparent', color: '#1A1614', border: '0.5px solid #C4B9A8', borderRadius: 10, padding: '12px', fontSize: 12, textDecoration: 'none', textAlign: 'center', display: 'block' }}>
            View as diner
          </Link>
        </div>

        {/* Verification status */}
        <div style={{ background: '#EDF4EE', border: '0.5px solid rgba(126,168,132,0.3)', borderRadius: 10, padding: '10px 14px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: '#7EA884' }}>✓</span>
          <span style={{ fontSize: 12, color: '#456B4B' }}>All 28 dishes verified · Last updated 12 Apr 2026</span>
        </div>

        {/* Dishes */}
        <div style={{ marginBottom: 8 }}>
          <div className="label-upper" style={{ color: '#8B7E71', marginBottom: 10 }}>Your menu</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {DISHES_LIVE.map((dish) => (
              <Link
                key={dish.id}
                href={`/admin/dish/${dish.id}`}
                style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#FFFFFF', border: '0.5px solid #C4B9A8', borderRadius: 12, padding: '12px', textDecoration: 'none', borderLeft: dish.verified ? undefined : '2px solid #C2A46E' }}
              >
                <div style={{ width: 40, height: 40, borderRadius: 10, background: '#F5F0E8', flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: 'Georgia, serif', fontSize: 13, color: '#1A1614', marginBottom: 3 }}>{dish.name}</div>
                  <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                    {dish.allergens.map((a) => {
                      const isContains = a.startsWith('Contains:');
                      const isTraces = a.startsWith('Traces:');
                      return (
                        <span key={a} style={{ background: isContains ? '#F9EFEA' : isTraces ? '#F8F2E6' : '#EDF4EE', color: isContains ? '#8A4A32' : isTraces ? '#7A6432' : '#456B4B', borderRadius: 100, padding: '2px 7px', fontSize: 9.5 }}>
                          {a}
                        </span>
                      );
                    })}
                  </div>
                </div>
                <span style={{ fontFamily: 'Georgia, serif', fontSize: 13, color: '#1A1614', flexShrink: 0 }}>{dish.price}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
