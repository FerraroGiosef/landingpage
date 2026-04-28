'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type AllergenStatus = 'no' | 'traces' | 'contains';

interface AllergenRow {
  key: string;
  name: string;
  inChart: boolean;
  status: AllergenStatus;
}

const INITIAL_ALLERGENS: AllergenRow[] = [
  { key: 'gluten', name: 'Gluten', inChart: true, status: 'contains' },
  { key: 'milk', name: 'Milk', inChart: true, status: 'contains' },
  { key: 'eggs', name: 'Eggs', inChart: true, status: 'traces' },
  { key: 'peanuts', name: 'Peanuts', inChart: false, status: 'no' },
  { key: 'treeNuts', name: 'Tree nuts', inChart: false, status: 'no' },
  { key: 'fish', name: 'Fish', inChart: false, status: 'no' },
  { key: 'crustaceans', name: 'Crustaceans', inChart: false, status: 'no' },
  { key: 'soya', name: 'Soya', inChart: true, status: 'traces' },
  { key: 'celery', name: 'Celery', inChart: false, status: 'no' },
  { key: 'mustard', name: 'Mustard', inChart: false, status: 'no' },
  { key: 'sesame', name: 'Sesame', inChart: false, status: 'no' },
  { key: 'sulphites', name: 'Sulphites', inChart: false, status: 'no' },
  { key: 'lupin', name: 'Lupin', inChart: false, status: 'no' },
  { key: 'molluscs', name: 'Molluscs', inChart: false, status: 'no' },
];

const DISH = {
  name: 'Risotto ai Funghi Selvatici',
  description: 'Creamy Arborio rice with wild mushrooms, white wine, and Parmesan',
  price: '£16.50',
};

function getPreviewTags(allergens: AllergenRow[]): string[] {
  const tags: string[] = [];
  const containsAny = allergens.filter((a) => a.status === 'contains').map((a) => a.name);
  const tracesAny = allergens.filter((a) => a.status === 'traces').map((a) => a.name);
  const noMeat = !containsAny.includes('Fish') && !containsAny.includes('Crustaceans') && !containsAny.includes('Molluscs');
  const noAnimal = noMeat && !containsAny.includes('Milk') && !containsAny.includes('Eggs');
  if (noAnimal) tags.push('Vegan');
  else if (noMeat && !containsAny.includes('Fish')) tags.push('Vegetarian');
  if (!containsAny.includes('Milk') && !tracesAny.includes('Milk')) tags.push('Dairy-free');
  if (!containsAny.includes('Gluten') && !tracesAny.includes('Gluten')) tags.push('Gluten-free');
  if (!containsAny.includes('Peanuts') && !tracesAny.includes('Peanuts') && !containsAny.includes('Tree nuts') && !tracesAny.includes('Tree nuts')) tags.push('Nut-free');
  return tags;
}

function SegmentedControl({ value, onChange }: { value: AllergenStatus; onChange: (v: AllergenStatus) => void }) {
  const options: { val: AllergenStatus; label: string }[] = [
    { val: 'no', label: 'No' },
    { val: 'traces', label: 'Traces' },
    { val: 'contains', label: 'Contains' },
  ];
  return (
    <div style={{ display: 'flex', background: '#F5F0E8', borderRadius: 8, padding: 2, gap: 2 }}>
      {options.map((opt) => {
        const active = value === opt.val;
        let activeColor = '#1A1614';
        if (active && opt.val === 'traces') activeColor = '#854F0B';
        if (active && opt.val === 'contains') activeColor = '#A32D2D';
        return (
          <button
            key={opt.val}
            onClick={() => onChange(opt.val)}
            style={{
              flex: 1,
              padding: '5px 4px',
              borderRadius: 6,
              border: 'none',
              background: active ? '#FFFFFF' : 'transparent',
              color: active ? activeColor : '#8B7E71',
              fontSize: 11,
              fontWeight: active ? 500 : 400,
              cursor: 'pointer',
              boxShadow: active ? '0 0.5px 2px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.15s',
              whiteSpace: 'nowrap',
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export default function AdminDishPage() {
  const router = useRouter();
  const [allergens, setAllergens] = useState<AllergenRow[]>(INITIAL_ALLERGENS);
  const [saved, setSaved] = useState(false);

  function updateStatus(key: string, status: AllergenStatus) {
    setAllergens((prev) => prev.map((a) => (a.key === key ? { ...a, status } : a)));
  }

  const previewTags = getPreviewTags(allergens);

  if (saved) {
    return (
      <div style={{ fontFamily: 'Inter, -apple-system, sans-serif', padding: '40px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#EDF6E2', border: '0.5px solid rgba(99,153,34,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, marginBottom: 16, color: '#639922' }}>✓</div>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 20, fontWeight: 400, color: '#1A1614', marginBottom: 8 }}>Dish confirmed</h1>
        <p style={{ fontSize: 13, color: '#8B7E71', marginBottom: 24, lineHeight: 1.65, maxWidth: 280 }}>
          Allergen data for <em>{DISH.name}</em> has been saved and will appear for diners immediately.
        </p>
        <div style={{ display: 'flex', gap: 10, width: '100%', maxWidth: 320 }}>
          <button onClick={() => router.push('/admin/menu')} style={{ flex: 1, background: 'transparent', border: '0.5px solid #C4B9A8', borderRadius: 10, padding: '12px', fontSize: 12, cursor: 'pointer', color: '#1A1614' }}>
            Back to menu
          </button>
          <button onClick={() => router.push('/admin')} style={{ flex: 1, background: '#1A1614', color: '#FDFBF7', border: 'none', borderRadius: 10, padding: '12px', fontSize: 12, cursor: 'pointer' }}>
            Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: 'Inter, -apple-system, sans-serif' }}>
      {/* Header */}
      <div style={{ padding: '16px 16px 0', borderBottom: '0.5px solid #C4B9A8', position: 'sticky', top: 0, background: '#FDFBF7', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <button
            onClick={() => router.back()}
            style={{ width: 34, height: 34, borderRadius: '50%', background: '#F5F0E8', border: '0.5px solid #C4B9A8', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 16, flexShrink: 0 }}
          >
            ←
          </button>
          <div style={{ minWidth: 0 }}>
            <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 17, fontWeight: 400, color: '#1A1614', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{DISH.name}</h1>
            <p style={{ fontSize: 11, color: '#8B7E71', margin: '2px 0 0' }}>Edit allergen data</p>
          </div>
          <span style={{ fontFamily: 'Georgia, serif', fontSize: 14, color: '#1A1614', marginLeft: 'auto', flexShrink: 0 }}>{DISH.price}</span>
        </div>
      </div>

      <div style={{ padding: '16px' }}>
        {/* Dish description */}
        <p style={{ fontSize: 12, color: '#8B7E71', lineHeight: 1.55, marginBottom: 16, marginTop: 0 }}>{DISH.description}</p>

        {/* Info box */}
        <div style={{ background: '#F5F0E8', border: '0.5px solid #C4B9A8', borderRadius: 10, padding: '10px 14px', marginBottom: 20, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <span style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }}>ℹ</span>
          <p style={{ fontSize: 12, color: '#8B7E71', margin: 0, lineHeight: 1.55 }}>
            Allergens extracted from your chart. Set each to the correct status. You are legally responsible for the accuracy of this information.
          </p>
        </div>

        {/* Allergen rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
          {allergens.map((allergen) => (
            <div
              key={allergen.key}
              style={{
                background: '#FFFFFF',
                border: '0.5px solid #C4B9A8',
                borderRadius: 12,
                padding: '12px',
                borderLeft: allergen.status === 'contains' ? '2px solid #D94F4F' : allergen.status === 'traces' ? '2px solid #EF9F27' : undefined,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <div>
                  <div style={{ fontSize: 13, color: '#1A1614', fontWeight: 500 }}>{allergen.name}</div>
                  <div style={{ fontSize: 10, color: allergen.inChart ? '#639922' : '#C4B9A8', marginTop: 2 }}>
                    {allergen.inChart ? 'Found in your chart' : 'Not in chart'}
                  </div>
                </div>
                {allergen.status !== 'no' && (
                  <span
                    style={{
                      background: allergen.status === 'contains' ? '#FCEBEB' : '#FAEEDA',
                      color: allergen.status === 'contains' ? '#A32D2D' : '#854F0B',
                      borderRadius: 100,
                      padding: '2px 8px',
                      fontSize: 10,
                    }}
                  >
                    {allergen.status === 'contains' ? 'Contains' : 'Traces'}
                  </span>
                )}
              </div>
              <SegmentedControl value={allergen.status} onChange={(v) => updateStatus(allergen.key, v)} />
            </div>
          ))}
        </div>

        {/* Preview tags */}
        <div style={{ background: '#F5F0E8', border: '0.5px solid #C4B9A8', borderRadius: 12, padding: '14px', marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: '#8B7E71', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>This dish will show as</div>
          {previewTags.length > 0 ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {previewTags.map((tag) => (
                <span
                  key={tag}
                  style={{ background: '#EDF6E2', color: '#3A6B0A', borderRadius: 100, padding: '4px 10px', fontSize: 11, fontWeight: 500 }}
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : (
            <span style={{ fontSize: 12, color: '#8B7E71' }}>No dietary tags — dish contains major allergens</span>
          )}
        </div>

        {/* Attribution note */}
        <div style={{ fontSize: 11, color: '#C4B9A8', lineHeight: 1.6, marginBottom: 20 }}>
          Allergen information will be attributed to your restaurant. Diners will be advised to always confirm with staff before ordering.
        </div>
      </div>

      {/* Bottom actions */}
      <div style={{ padding: '0 16px 24px', display: 'flex', gap: 10, position: 'sticky', bottom: 68, background: '#FDFBF7', paddingTop: 12, borderTop: '0.5px solid #C4B9A8' }}>
        <button
          onClick={() => router.back()}
          style={{ flex: 1, background: 'transparent', border: '0.5px solid #C4B9A8', borderRadius: 10, padding: '13px', fontSize: 13, cursor: 'pointer', color: '#8B7E71' }}
        >
          Back
        </button>
        <button
          onClick={() => setSaved(true)}
          style={{ flex: 2, background: '#1A1614', color: '#FDFBF7', border: 'none', borderRadius: 10, padding: '13px', fontSize: 13, cursor: 'pointer' }}
        >
          Confirm this dish ✓
        </button>
      </div>
    </div>
  );
}
