'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getDishTags, UK_ALLERGENS } from '@/lib/scoring';
import { getDishById, getDishesByRestaurant } from '@/lib/data/restaurants';
import type { Dish, DishAllergens, DishModification } from '@/lib/types';

type AllergenStatus = 'no' | 'traces' | 'contains';

interface AllergenRow {
  key: keyof DishAllergens;
  name: string;
  inChart: boolean;
  status: AllergenStatus;
}

const INITIAL_ALLERGENS: AllergenRow[] = [
  { key: 'gluten', name: 'Gluten', inChart: false, status: 'no' },
  { key: 'milk', name: 'Milk', inChart: false, status: 'no' },
  { key: 'eggs', name: 'Eggs', inChart: false, status: 'no' },
  { key: 'peanuts', name: 'Peanuts', inChart: false, status: 'no' },
  { key: 'treeNuts', name: 'Tree nuts', inChart: false, status: 'no' },
  { key: 'fish', name: 'Fish', inChart: false, status: 'no' },
  { key: 'crustaceans', name: 'Crustaceans', inChart: false, status: 'no' },
  { key: 'soya', name: 'Soya', inChart: false, status: 'no' },
  { key: 'celery', name: 'Celery', inChart: false, status: 'no' },
  { key: 'mustard', name: 'Mustard', inChart: false, status: 'no' },
  { key: 'sesame', name: 'Sesame', inChart: false, status: 'no' },
  { key: 'sulphites', name: 'Sulphites', inChart: false, status: 'no' },
  { key: 'lupin', name: 'Lupin', inChart: false, status: 'no' },
  { key: 'molluscs', name: 'Molluscs', inChart: false, status: 'no' },
];

type AdminDishData = {
  name: string;
  description: string;
  price: string;
  category: Dish['category'];
  isVegan: boolean;
  isVegetarian: boolean;
  allergens: AllergenRow[];
  modifications?: DishModification[];
};

function dishToAdminData(dish: Dish): AdminDishData {
  return {
    name: dish.name,
    description: dish.description,
    price: dish.price,
    category: dish.category,
    isVegan: dish.isVegan,
    isVegetarian: dish.isVegetarian,
    allergens: INITIAL_ALLERGENS.map((row) => {
      const status = dish.allergens[row.key];
      return { ...row, status, inChart: status !== 'no' };
    }),
    modifications: dish.modifications,
  };
}

function rowsToAllergens(allergens: AllergenRow[]): DishAllergens {
  return allergens.reduce(
    (acc, allergen) => ({ ...acc, [allergen.key]: allergen.status }),
    {} as DishAllergens
  );
}

function buildPreviewDish(dishData: AdminDishData, id: number, allergens: AllergenRow[], isVegan: boolean, isVegetarian: boolean): Dish {
  return {
    id,
    restaurantId: 1,
    name: dishData.name,
    description: dishData.description,
    price: dishData.price,
    category: dishData.category,
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
  const searchParams = useSearchParams();
  const lartigianoDishes = getDishesByRestaurant(1);
  const realDish = getDishById(Number(params.id)) ?? lartigianoDishes[0];
  const dishData = dishToAdminData(realDish);
  const allIds = lartigianoDishes.map((d) => String(d.id));
  const currentIndex = allIds.indexOf(params.id);
  const nextId = currentIndex >= 0 && currentIndex < allIds.length - 1 ? allIds[currentIndex + 1] : null;
  const from = searchParams.get('from');
  const returnPath = from === 'dashboard'
    ? '/admin'
    : from === 'menu'
      ? '/admin/menu'
      : '/admin/menu/import?step=review';

  const [allergens, setAllergens] = useState<AllergenRow[]>(dishData.allergens);
  const [isVegan, setIsVegan] = useState(dishData?.isVegan ?? false);
  const [isVegetarian, setIsVegetarian] = useState(dishData?.isVegetarian ?? false);
  const [modifications, setModifications] = useState<DishModification[]>(dishData.modifications || []);
  const [showModificationForm, setShowModificationForm] = useState(false);
  const [modificationName, setModificationName] = useState('');
  const [modificationDescription, setModificationDescription] = useState('');
  const [modificationRemoves, setModificationRemoves] = useState<string[]>([]);
  const [modificationPriceExtra, setModificationPriceExtra] = useState('');
  const [saved, setSaved] = useState(false);
  const [description, setDescription] = useState(dishData.description);
  const [price, setPrice] = useState(dishData.price);
  const [showAllAllergens, setShowAllAllergens] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setAllergens(dishData.allergens);
    setIsVegan(dishData.isVegan);
    setIsVegetarian(dishData.isVegetarian);
    setModifications(dishData.modifications || []);
    setShowModificationForm(false);
    setModificationName('');
    setModificationDescription('');
    setModificationRemoves([]);
    setModificationPriceExtra('');
    setSaved(false);
    setDescription(dishData.description);
    setPrice(dishData.price);
    setShowAllAllergens(false);
    setPhotoPreview(null);
  }, [dishData, params.id]);

  function handlePhotoSelect(file?: File) {
    if (!file) return;
    setPhotoPreview(URL.createObjectURL(file));
  }

  function updateStatus(key: string, status: AllergenStatus) {
    setAllergens((prev) => prev.map((a) => (a.key === key ? { ...a, status } : a)));
  }

  function toggleModificationAllergen(key: string) {
    setModificationRemoves((prev) => (
      prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key]
    ));
  }

  function addModification() {
    if (!modificationName.trim() || modificationRemoves.length === 0) return;
    setModifications((prev) => [
      ...prev,
      {
        name: modificationName.trim(),
        description: modificationDescription.trim() || undefined,
        removes: modificationRemoves,
        adds: [],
        priceExtra: Number(modificationPriceExtra || 0),
      },
    ]);
    setModificationName('');
    setModificationDescription('');
    setModificationRemoves([]);
    setModificationPriceExtra('');
    setShowModificationForm(false);
  }

  const previewDish = buildPreviewDish(dishData, Number(params.id) || 1, allergens, isVegan, isVegetarian);
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
          Allergen data for <em>{dishData.name}</em> has been saved and will appear for diners immediately.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 320 }}>
          {nextId ? (
            <button onClick={() => router.push(`/admin/dish/${nextId}${from ? `?from=${from}` : ''}`)} style={{ width: '100%', background: '#1A1614', color: '#FDFBF7', border: 'none', borderRadius: 10, padding: '12px', fontSize: 12, cursor: 'pointer' }}>
              Next dish →
            </button>
          ) : (
            <div style={{ fontSize: 13, color: '#456B4B', background: '#EDF4EE', border: '0.5px solid rgba(126,168,132,0.3)', borderRadius: 10, padding: '12px' }}>
              All dishes reviewed ✓
            </div>
          )}
          <button onClick={() => router.push(returnPath)} style={{ width: '100%', background: 'transparent', border: '0.5px solid #C4B9A8', borderRadius: 10, padding: '12px', fontSize: 12, cursor: 'pointer', color: '#1A1614' }}>
            Back
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
            onClick={() => router.push(returnPath)}
            style={{ width: 34, height: 34, borderRadius: '50%', background: '#F5F0E8', border: '0.5px solid #C4B9A8', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 16, flexShrink: 0 }}
          >
            ←
          </button>
          <div style={{ minWidth: 0 }}>
            <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 17, fontWeight: 400, color: '#1A1614', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{dishData.name}</h1>
            <p style={{ fontSize: 11, color: '#8B7E71', margin: '2px 0 0' }}>Edit allergen data</p>
          </div>
          <span style={{ fontFamily: 'Georgia, serif', fontSize: 14, color: '#1A1614', marginLeft: 'auto', flexShrink: 0 }}>{dishData.price}</span>
        </div>
      </div>

      <div style={{ padding: '16px' }}>
        {/* Dish photo */}
        <div
          onClick={() => photoInputRef.current?.click()}
          style={{
            width: '100%',
            height: 120,
            borderRadius: 12,
            background: photoPreview
              ? `url(${photoPreview}) center/cover`
              : 'linear-gradient(135deg, #C8B898, #A09080)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            marginBottom: 6,
            overflow: 'hidden',
          }}
        >
          <input
            ref={photoInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={(e) => handlePhotoSelect(e.target.files?.[0])}
          />
          {!photoPreview && (
            <div style={{ color: '#FDFBF7', textAlign: 'center' }}>
              <div style={{ fontSize: 24, marginBottom: 4 }}>📷</div>
              <div style={{ fontSize: 12 }}>Tap to add photo</div>
            </div>
          )}
        </div>
        <div style={{ fontSize: 10, color: '#C4B9A8', marginBottom: 16 }}>
          Natural light · top-down angle · clean plate
        </div>

        {/* Editable description and price */}
        <div style={{ background: '#FFFFFF', border: '0.5px solid #C4B9A8', borderRadius: 12, padding: '14px', marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: '#8B7E71', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Dish details</div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', fontSize: 12, color: '#8B7E71', marginBottom: 5 }}>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              style={{
                width: '100%',
                background: '#F5F0E8',
                border: '0.5px solid #C4B9A8',
                borderRadius: 8,
                padding: '9px 12px',
                fontSize: 12,
                color: '#1A1614',
                lineHeight: 1.55,
                outline: 'none',
                fontFamily: 'inherit',
                resize: 'vertical',
                boxSizing: 'border-box',
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, color: '#8B7E71', marginBottom: 5 }}>Price</label>
            <input
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              style={{
                width: '100%',
                background: '#F5F0E8',
                border: '0.5px solid #C4B9A8',
                borderRadius: 8,
                padding: '9px 12px',
                fontSize: 12,
                color: '#1A1614',
                outline: 'none',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
              }}
            />
          </div>
        </div>

        {/* Info box */}
        <div style={{ background: '#F5F0E8', border: '0.5px solid #C4B9A8', borderRadius: 10, padding: '10px 14px', marginBottom: 20, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <span style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }}>ℹ</span>
          <p style={{ fontSize: 12, color: '#8B7E71', margin: 0, lineHeight: 1.55 }}>
            Allergens extracted from your chart. Set each to the correct status. You are legally responsible for the accuracy of this information.
          </p>
        </div>

        {/* Allergen rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 12 }}>
          {(showAllAllergens ? allergens : allergens.filter((a) => a.status !== 'no')).map((allergen) => (
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
          {!showAllAllergens && allergens.every((a) => a.status === 'no') && (
            <div style={{ background: '#FFFFFF', border: '0.5px solid #C4B9A8', borderRadius: 12, padding: 14, fontSize: 12, color: '#8B7E71', textAlign: 'center' }}>
              No allergens detected.
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={() => setShowAllAllergens(!showAllAllergens)}
          style={{ background: 'none', border: 'none', color: '#1A1614', fontSize: 12, marginBottom: 20, cursor: 'pointer', padding: '6px 0', textDecoration: 'underline', textUnderlineOffset: 3, fontFamily: 'inherit' }}
        >
          {showAllAllergens ? 'Show less ▴' : 'Show all 14 allergens ▾'}
        </button>

        {/* Dietary suitability */}
        <div style={{ background: '#FFFFFF', border: '0.5px solid #C4B9A8', borderRadius: 12, padding: '14px', marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: '#8B7E71', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Available modifications</div>
          {modifications.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
              {modifications.map((modification) => (
                <div key={modification.name} style={{ background: '#F7F9FC', border: '0.5px solid #7A9ABB', borderRadius: 10, padding: '10px 12px', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, color: '#1A1614', fontWeight: 500 }}>{modification.name}</div>
                    <div style={{ fontSize: 10.5, color: '#4A6A8A', marginTop: 2 }}>
                      Removes {modification.removes.join(', ')} · +£{modification.priceExtra.toFixed(2)}
                    </div>
                  </div>
                  <button onClick={() => setModifications((prev) => prev.filter((item) => item.name !== modification.name))} style={{ background: 'none', border: 'none', color: '#8B7E71', cursor: 'pointer', fontSize: 12 }}>
                    Remove
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ fontSize: 12, color: '#8B7E71', marginBottom: 12 }}>No modifications added yet.</div>
          )}

          {showModificationForm ? (
            <div style={{ background: '#F5F0E8', border: '0.5px solid #C4B9A8', borderRadius: 10, padding: '12px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <input
                value={modificationName}
                onChange={(e) => setModificationName(e.target.value)}
                placeholder="Modification name"
                style={{ background: '#FFFFFF', border: '0.5px solid #C4B9A8', borderRadius: 8, padding: '9px 12px', fontSize: 12, color: '#1A1614', fontFamily: 'inherit', outline: 'none' }}
              />
              <textarea
                value={modificationDescription}
                onChange={(e) => setModificationDescription(e.target.value)}
                placeholder="Description (e.g. Sourdough replaced with certified GF bread)"
                rows={2}
                style={{ background: '#FFFFFF', border: '0.5px solid #C4B9A8', borderRadius: 8, padding: '9px 12px', fontSize: 12, color: '#1A1614', fontFamily: 'inherit', outline: 'none', lineHeight: 1.5, resize: 'vertical' }}
              />
              <div>
                <div style={{ fontSize: 10.5, color: '#8B7E71', marginBottom: 6 }}>Removes allergens</div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {UK_ALLERGENS.map((allergen) => {
                    const active = modificationRemoves.includes(allergen.key);
                    return (
                      <button
                        key={allergen.key}
                        onClick={() => toggleModificationAllergen(allergen.key)}
                        style={{ background: active ? '#1A1614' : '#FFFFFF', color: active ? '#FDFBF7' : '#8B7E71', border: `0.5px solid ${active ? '#1A1614' : '#C4B9A8'}`, borderRadius: 100, padding: '4px 8px', fontSize: 10.5, cursor: 'pointer' }}
                      >
                        {allergen.name}
                      </button>
                    );
                  })}
                </div>
              </div>
              <input
                type="number"
                min="0"
                step="0.5"
                value={modificationPriceExtra}
                onChange={(e) => setModificationPriceExtra(e.target.value)}
                placeholder="Price extra"
                style={{ background: '#FFFFFF', border: '0.5px solid #C4B9A8', borderRadius: 8, padding: '9px 12px', fontSize: 12, color: '#1A1614', fontFamily: 'inherit', outline: 'none' }}
              />
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={addModification} style={{ flex: 1, background: '#1A1614', color: '#FDFBF7', border: 'none', borderRadius: 8, padding: '9px', fontSize: 12, cursor: 'pointer' }}>
                  Save modification
                </button>
                <button
                  onClick={() => {
                    setShowModificationForm(false);
                    setModificationName('');
                    setModificationDescription('');
                    setModificationRemoves([]);
                    setModificationPriceExtra('');
                  }}
                  style={{ flex: 1, background: 'transparent', color: '#8B7E71', border: '0.5px solid #C4B9A8', borderRadius: 8, padding: '9px', fontSize: 12, cursor: 'pointer' }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button onClick={() => setShowModificationForm(true)} style={{ background: 'transparent', border: '0.5px dashed #C4B9A8', borderRadius: 10, padding: '10px 12px', width: '100%', color: '#8B7E71', fontSize: 12, cursor: 'pointer' }}>
              + Add modification
            </button>
          )}
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
          onClick={() => router.push(returnPath)}
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
