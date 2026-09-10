'use client';

import { useRouter } from 'next/navigation';

const STEPS: { title: string; body: string }[] = [
  {
    title: 'Select what you avoid',
    body: 'Gluten, dairy, nuts, or any of the 14 UK allergens.',
  },
  {
    title: 'Browse restaurants',
    body: 'Showing only dishes that match your selection.',
  },
  {
    title: 'Always confirm',
    body: 'Directly with restaurant staff before ordering.',
  },
];

export default function EmptyState() {
  const router = useRouter();

  function scrollToRestaurantList() {
    if (typeof document === 'undefined') return;
    const el = document.getElementById('restaurant-list');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <section
      aria-label="Get started"
      style={{
        margin: '0 16px 24px',
        borderRadius: 14,
        overflow: 'hidden',
        border: '0.5px solid #C4B9A8',
        background: '#FDFBF7',
      }}
    >
      {/* Hero */}
      <div
        style={{
          background: '#1A1614',
          padding: '28px 22px',
        }}
      >
        <h2
          style={{
            fontFamily: 'Georgia, serif',
            fontSize: 22,
            fontWeight: 400,
            lineHeight: 1.25,
            color: '#FDFBF7',
            margin: '0 0 10px',
            letterSpacing: '-0.3px',
          }}
        >
          Find what you can eat — not just where to eat.
        </h2>
        <p
          style={{
            fontSize: 13,
            lineHeight: 1.55,
            color: '#8B7E71',
            margin: 0,
          }}
        >
          PlateMatch turns every menu into a personal one — built around your
          allergens, your diet, and your peace of mind.
        </p>
      </div>

      {/* Steps */}
      <div
        style={{
          background: '#F5F0E8',
          padding: '20px 22px',
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
        }}
      >
        {STEPS.map((step, idx) => (
          <div
            key={step.title}
            style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}
          >
            <div
              style={{
                flexShrink: 0,
                width: 26,
                height: 26,
                borderRadius: '50%',
                background: '#1A1614',
                color: '#FDFBF7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'Georgia, serif',
                fontSize: 13,
                fontWeight: 400,
                lineHeight: 1,
              }}
            >
              {idx + 1}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: '#1A1614',
                  marginBottom: 2,
                  lineHeight: 1.4,
                }}
              >
                {step.title}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: '#8B7E71',
                  lineHeight: 1.5,
                }}
              >
                {step.body}
              </div>
            </div>
          </div>
        ))}

        <p
          style={{
            fontSize: 10.5,
            color: '#C4B9A8',
            lineHeight: 1.55,
            margin: '8px 0 0',
          }}
        >
          Allergen information is declared by restaurants and collected from
          publicly available sources. Your dietary preferences are stored only
          on this device and never shared.
        </p>
      </div>

      {/* Actions */}
      <div
        style={{
          padding: '16px 22px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          background: '#FDFBF7',
        }}
      >
        <button
          type="button"
          onClick={() => router.push('/app/allergens')}
          style={{
            background: '#1A1614',
            color: '#FDFBF7',
            border: 'none',
            borderRadius: 10,
            padding: '13px 16px',
            fontSize: 13,
            fontWeight: 500,
            cursor: 'pointer',
            fontFamily: 'inherit',
            transition: 'background 0.15s',
          }}
        >
          Set my dietary needs
        </button>
        <button
          type="button"
          onClick={scrollToRestaurantList}
          style={{
            background: 'transparent',
            color: '#1A1614',
            border: '0.5px solid #C4B9A8',
            borderRadius: 10,
            padding: '12px 16px',
            fontSize: 13,
            cursor: 'pointer',
            fontFamily: 'inherit',
            transition: 'background 0.15s',
          }}
        >
          Browse all restaurants first
        </button>
      </div>
    </section>
  );
}
