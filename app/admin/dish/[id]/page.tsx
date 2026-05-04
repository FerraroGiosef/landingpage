'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getDishTags } from '@/lib/scoring';
import type { Dish, DishAllergens } from '@/lib/types';

type AllergenStatus = 'no' | 'traces' | 'contains';

interface AllergenRow {
  key: keyof DishAllergens;
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
  id: 1,
  restaurantId: 1,
  name: 'Risotto ai Funghi Selvatici',
  description: 'Creamy Arborio rice with wild mushrooms, white wine, and Parmesan',
  price: '£16.50',
  category: 'main' as const,
};

function rowsToAllergens(allergens: AllergenRow[]): DishAllergens {
  return allergens.reduce(
    (acc, allergen) => ({ ...acc, [allergen.key]: allergen.status }),
    {} as DishAllergens
  );
}

function buildPreviewDish(allergens: AllergenRow[], isVegan: boolean, isVegetarian: boolean): Dish {
  return {
    ...DISH,
    allergens: rowsToAllergens(allergens),
    isVegan,
    isVegetarian: isVegan || isVegetarian,
  };
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
        if (active && opt.val === 'traces') activeColor = '#7A6432';
        if (active && opt.val === 'contains') activeColor = '#8A4A32';
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

export default function AdminDishPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [allergens, setAllergens] = useState<AllergenRow[]>(INITIAL_ALLERGENS);
  const [isVegan, setIsVegan] = useState(true);
  const [isVegetarian, setIsVegetarian] = useState(true);
  const [saved, setSaved] = useState(false);

  function updateStatus(key: string, status: AllergenStatus) {
    setAllergens((prev) => prev.map((a) => (a.key === key ? { ...a, status } : a)));
  }

  const previewDish = buildPreviewDish(allergens, isVegan, isVegetarian);
  const previewTags = getDishTags(previewDish);
  const veganConflictAllergens = [
    previewDish.allergens.milk === 'contains' ? 'milk' : null,
    previewDish.allergens.eggs === 'contains' ? 'eggs' : null,
  ].filter(Boolean);

  if (saved) {
    return (
      <div style={{ fontFamily: 'Inter, -apple-system, sans-serif', padding: '40px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#EDF4EE', border: '0.5px solid rgba(126,168,132,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, marginBottom: 16, color: '#7EA884' }}>✓</div>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 20, fontWeight: 400, color: '#1A1614', marginBottom: 8 }}>Dish confirmed</h1>
        <p style={{ fontSize: 13, color: '#8B7E71', marginBottom: 24, lineHeight: 1.65, maxWidth: 280 }}>
          Allergen data for <em>{DISH.name}</em> has been saved and will appear for diners immediately.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 320 }}>
          <button onClick={() => router.push(`/admin/dish/${parseInt(params.id, 10) + 1}`)} style={{ width: '100%', background: '#1A1614', color: '#FDFBF7', border: 'none', borderRadius: 10, padding: '12px', fontSize: 12, cursor: 'pointer' }}>
            Next dish →
          </button>
          <button onClick={() => router.push('/admin/menu/import')} style={{ width: '100%', background: 'transparent', border: '0.5px solid #C4B9A8', borderRadius: 10, padding: '12px', fontSize: 12, cursor: 'pointer', color: '#1A1614' }}>
            Back to review list
          </button>
          <button onClick={() => router.push('/admin')} style={{ background: 'none', border: 'none', padding: '8px', color: '#8B7E71', fontSize: 12, cursor: 'pointer' }}>
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
            onClick={() => router.push('/admin/menu/import')}
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
                borderLeft: allergen.status === 'contains' ? '2px solid #C67A5C' : allergen.status === 'traces' ? '2px solid #C2A46E' : undefined,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <div>
                  <div style={{ fontSize: 13, color: '#1A1614', fontWeight: 500 }}>{allergen.name}</div>
                  <div style={{ fontSize: 10, color: allergen.inChart ? '#7EA884' : '#C4B9A8', marginTop: 2 }}>
                    {allergen.inChart ? 'Found in your chart' : 'Not in chart'}
                  </div>
                </div>
                {allergen.status !== 'no' && (
                  <span
                    style={{
                      background: allergen.status === 'contains' ? '#F9EFEA' : '#F8F2E6',
                      color: allergen.status === 'contains' ? '#8A4A32' : '#7A6432',
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

        {/* Dietary suitability */}
        <div style={{ background: '#FFFFFF', border: '0.5px solid #C4B9A8', borderRadius: 12, padding: '14px', marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: '#8B7E71', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Dietary suitability</div>
          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 10, cursor: 'pointer' }}>
            <span>
              <span style={{ display: 'block', fontSize: 13, color: '#1A1614', fontWeight: 500 }}>Vegan</span>
              <span style={{ display: 'block', fontSize: 10, color: '#8B7E71', marginTop: 2 }}>Suitable for vegan diners</span>
            </span>
            <input
              type="checkbox"
              checked={isVegan}
              onChange={(e) => {
                setIsVegan(e.target.checked);
                if (e.target.checked) setIsVegetarian(true);
              }}
            />
          </label>
          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, cursor: 'pointer' }}>
            <span>
              <span style={{ display: 'block', fontSize: 13, color: '#1A1614', fontWeight: 500 }}>Vegetarian</span>
              <span style={{ display: 'block', fontSize: 10, color: '#8B7E71', marginTop: 2 }}>Suitable for vegetarian diners</span>
            </span>
            <input
              type="checkbox"
              checked={isVegetarian || isVegan}
              disabled={isVegan}
              onChange={(e) => setIsVegetarian(e.target.checked)}
            />
          </label>
        </div>

        {isVegan && veganConflictAllergens.length > 0 && (
          <div style={{ background: '#F8F2E6', border: '0.5px solid rgba(194,164,110,0.45)', borderRadius: 12, padding: '12px 14px', color: '#7A6432', fontSize: 12, lineHeight: 1.5, marginBottom: 20 }}>
            This dish contains {veganConflictAllergens.join('/')} — please confirm it&apos;s suitable for vegans
          </div>
        )}

        {/* Preview tags */}
        <div style={{ background: '#F5F0E8', border: '0.5px solid #C4B9A8', borderRadius: 12, padding: '14px', marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: '#8B7E71', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>This dish will show as</div>
          {previewTags.length > 0 ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {previewTags.map((tag) => (
                <span
                  key={tag}
                  style={{ background: '#EDF4EE', color: '#456B4B', borderRadius: 100, padding: '4px 10px', fontSize: 11, fontWeight: 500 }}
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
          onClick={() => router.push('/admin/menu/import')}
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
