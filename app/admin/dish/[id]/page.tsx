'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getDishTags } from '@/lib/scoring';
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
  allergens: AllergenRow[];
  modifications?: DishModification[];
};

const DISHES_MAP: Record<string, AdminDishData> = {
  '1': { name: 'Bruschetta al Pomodoro', description: 'Vine tomatoes, basil, garlic and olive oil on toasted sourdough', price: '£7.50', category: 'starter', allergens: INITIAL_ALLERGENS.map((a) => a.key === 'gluten' ? { ...a, status: 'contains' as const, inChart: true } : a.key === 'sesame' ? { ...a, status: 'traces' as const, inChart: true } : a) },
  '2': { name: 'Risotto ai Funghi Selvatici', description: 'Wild mushroom risotto with truffle oil', price: '£16.50', category: 'main', allergens: INITIAL_ALLERGENS.map((a) => a.key === 'celery' ? { ...a, status: 'traces' as const, inChart: true } : a) },
  '3': { name: 'Melanzane alla Parmigiana', description: 'Aubergine, tomato sugo, mozzarella, basil', price: '£15.00', category: 'main', allergens: INITIAL_ALLERGENS.map((a) => a.key === 'milk' ? { ...a, status: 'contains' as const, inChart: true } : a.key === 'eggs' ? { ...a, status: 'contains' as const, inChart: true } : a) },
  '4': { name: 'Branzino in Crosta di Erbe', description: 'Sea bass with herb crust and roasted vegetables', price: '£22.00', category: 'main', allergens: INITIAL_ALLERGENS.map((a) => a.key === 'fish' ? { ...a, status: 'contains' as const, inChart: true } : a.key === 'gluten' ? { ...a, status: 'contains' as const, inChart: true } : a) },
  '5': { name: 'Tagliatelle al Ragu Bolognese', description: 'Fresh tagliatelle with slow-cooked beef ragu', price: '£17.50', category: 'main', allergens: INITIAL_ALLERGENS.map((a) => a.key === 'gluten' ? { ...a, status: 'contains' as const, inChart: true } : a.key === 'milk' ? { ...a, status: 'contains' as const, inChart: true } : a.key === 'eggs' ? { ...a, status: 'contains' as const, inChart: true } : a), modifications: [{ name: 'With GF pasta', removes: ['gluten'], adds: [], priceExtra: 1.50 }] },
  '6': { name: 'Cotoletta alla Milanese', description: 'Breaded veal cutlet with rocket and lemon', price: '£24.00', category: 'main', allergens: INITIAL_ALLERGENS.map((a) => a.key === 'gluten' ? { ...a, status: 'contains' as const, inChart: true } : a.key === 'eggs' ? { ...a, status: 'contains' as const, inChart: true } : a) },
  '7': { name: 'Gnocchi al Pomodoro', description: 'Potato gnocchi with fresh tomato sauce and basil', price: '£14.50', category: 'main', allergens: INITIAL_ALLERGENS.map((a) => a.key === 'gluten' ? { ...a, status: 'contains' as const, inChart: true } : a), modifications: [{ name: 'With GF gnocchi', removes: ['gluten'], adds: [], priceExtra: 2.00 }] },
  '8': { name: 'Zuppa di Lenticchie', description: 'Red lentil soup with cumin and lemon', price: '£9.00', category: 'starter', allergens: INITIAL_ALLERGENS.map((a) => a.key === 'celery' ? { ...a, status: 'contains' as const, inChart: true } : a) },
  '9': { name: 'Tiramisu della Casa', description: 'Classic tiramisu with mascarpone and espresso', price: '£8.50', category: 'dessert', allergens: INITIAL_ALLERGENS.map((a) => a.key === 'gluten' ? { ...a, status: 'contains' as const, inChart: true } : a.key === 'milk' ? { ...a, status: 'contains' as const, inChart: true } : a.key === 'eggs' ? { ...a, status: 'contains' as const, inChart: true } : a) },
  '10': { name: 'Panna Cotta al Caramello', description: 'Vanilla panna cotta with caramel sauce', price: '£7.50', category: 'dessert', allergens: INITIAL_ALLERGENS.map((a) => a.key === 'milk' ? { ...a, status: 'contains' as const, inChart: true } : a) },
};

function rowsToAllergens(allergens: AllergenRow[]): DishAllergens {
  return allergens.reduce(
    (acc, allergen) => ({ ...acc, [allergen.key]: allergen.status }),
    {} as DishAllergens
  );
}

function buildPreviewDish(dishData: AdminDishData, id: number, allergens: AllergenRow[], isVegan: boolean, isVegetarian: boolean, name: string, description: string, price: string, category: Dish['category']): Dish {
  return {
    id,
    restaurantId: 1,
    name: name || dishData.name,
    description: description || dishData.description,
    price: price || dishData.price,
    category,
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

function ToggleSwitch({ checked, onChange, disabled }: { checked: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      style={{
        width: 40,
        height: 22,
        borderRadius: 100,
        background: checked ? '#1A1614' : '#C4B9A8',
        border: 'none',
        position: 'relative',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'background 0.2s',
        padding: 0,
        flexShrink: 0,
        opacity: disabled ? 0.6 : 1,
      }}
    >
      <span
        style={{
          position: 'absolute',
          top: 2,
          left: checked ? 20 : 2,
          width: 18,
          height: 18,
          borderRadius: '50%',
          background: '#FFFFFF',
          transition: 'left 0.2s',
          boxShadow: '0 1px 2px rgba(0,0,0,0.15)',
        }}
      />
    </button>
  );
}

const INPUT_STYLE: React.CSSProperties = {
  background: '#FDFBF7',
  border: '0.5px solid #C4B9A8',
  borderRadius: 8,
  padding: '8px 10px',
  fontFamily: 'inherit',
  color: '#1A1614',
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
};

type ModificationMake = 'gf' | 'dairy-free' | 'nut-free' | 'egg-free' | 'vegan' | 'vegetarian';

const MODIFICATION_MAKE_OPTIONS: { key: ModificationMake; label: string }[] = [
  { key: 'gf', label: 'Gluten-free' },
  { key: 'dairy-free', label: 'Dairy-free' },
  { key: 'nut-free', label: 'Nut-free' },
  { key: 'egg-free', label: 'Egg-free' },
  { key: 'vegan', label: 'Vegan' },
  { key: 'vegetarian', label: 'Vegetarian' },
];

const MAKE_TO_REMOVES: Record<ModificationMake, string[]> = {
  'gf': ['gluten'],
  'dairy-free': ['milk'],
  'nut-free': ['peanuts', 'treeNuts'],
  'egg-free': ['eggs'],
  'vegan': ['milk', 'eggs', 'fish', 'crustaceans', 'molluscs'],
  'vegetarian': ['fish', 'crustaceans', 'molluscs'],
};

function makesFromRemoves(removes: string[]): string[] {
  const set = new Set(removes);
  const badges: string[] = [];
  if (set.has('gluten')) badges.push('GF');
  const veganRemoved = ['milk', 'eggs', 'fish', 'crustaceans', 'molluscs'].every((k) => set.has(k));
  const vegetarianRemoved = ['fish', 'crustaceans', 'molluscs'].every((k) => set.has(k));
  if (veganRemoved) {
    badges.push('Vegan');
  } else {
    if (set.has('milk')) badges.push('Dairy-free');
    if (set.has('eggs')) badges.push('Egg-free');
    if (vegetarianRemoved) badges.push('Vegetarian');
  }
  if (set.has('peanuts') && set.has('treeNuts')) badges.push('Nut-free');
  return badges;
}

export default function AdminDishPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dishData = DISHES_MAP[params.id] || DISHES_MAP['1'];
  const allIds = Object.keys(DISHES_MAP);
  const from = searchParams.get('from');
  const reviewIdsParam = searchParams.get('reviewIds');
  const reviewIds = reviewIdsParam ? reviewIdsParam.split(',').filter((id) => DISHES_MAP[id]) : [];
  const sequenceIds = reviewIds.length > 0 ? reviewIds : allIds;
  const currentIndex = sequenceIds.indexOf(params.id);
  const nextId = currentIndex === -1 && reviewIds.length > 0
    ? reviewIds[0]
    : currentIndex >= 0 && currentIndex < sequenceIds.length - 1
      ? sequenceIds[currentIndex + 1]
      : null;
  const nextDishHref = nextId ? `/admin/dish/${nextId}?from=${from || 'admin'}${reviewIds.length > 0 ? `&reviewIds=${reviewIds.join(',')}` : ''}` : '';
  const returnPath = from === 'dashboard'
    ? '/admin'
    : from === 'review'
      ? '/admin/menu/import?step=review'
      : from === 'menu'
        ? '/admin/menu'
        : '/admin';
  const returnLabel = from === 'dashboard'
    ? 'Back to dashboard'
    : from === 'review'
      ? 'Back to review list'
      : from === 'menu'
        ? 'Back to menu'
        : 'Back';

  const [allergens, setAllergens] = useState<AllergenRow[]>(dishData.allergens);
  const [isVegan, setIsVegan] = useState(true);
  const [isVegetarian, setIsVegetarian] = useState(true);
  const [modifications, setModifications] = useState<DishModification[]>(dishData.modifications || []);
  const [showModificationForm, setShowModificationForm] = useState(false);
  const [modificationName, setModificationName] = useState('');
  const [modificationDescription, setModificationDescription] = useState('');
  const [modificationMakes, setModificationMakes] = useState<ModificationMake[]>([]);
  const [modificationPriceExtra, setModificationPriceExtra] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [description, setDescription] = useState(dishData?.description || '');
  const [price, setPrice] = useState(dishData?.price || '');
  const [name, setName] = useState(dishData?.name || '');
  const [category, setCategory] = useState<Dish['category']>(dishData?.category || 'main');
  const [showAllAllergens, setShowAllAllergens] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setAllergens(dishData.allergens);
    setIsVegan(true);
    setIsVegetarian(true);
    setModifications(dishData.modifications || []);
    setShowModificationForm(false);
    setModificationName('');
    setModificationDescription('');
    setModificationMakes([]);
    setModificationPriceExtra('');
    setPhotoPreview(null);
    setSaved(false);
    setDescription(dishData.description);
    setPrice(dishData.price);
    setName(dishData.name);
    setCategory(dishData.category);
    setShowAllAllergens(false);
  }, [dishData, params.id]);

  function updateStatus(key: string, status: AllergenStatus) {
    setAllergens((prev) => prev.map((a) => (a.key === key ? { ...a, status } : a)));
  }

  function toggleModificationMake(key: ModificationMake) {
    setModificationMakes((prev) => (
      prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key]
    ));
  }

  function addModification() {
    if (!modificationName.trim() || modificationMakes.length === 0) return;
    const removesSet = new Set<string>();
    for (const make of modificationMakes) {
      for (const allergenKey of MAKE_TO_REMOVES[make]) removesSet.add(allergenKey);
    }
    setModifications((prev) => [
      ...prev,
      {
        name: modificationName.trim(),
        description: modificationDescription.trim(),
        removes: Array.from(removesSet),
        adds: [],
        priceExtra: Number(modificationPriceExtra || 0),
      },
    ]);
    setModificationName('');
    setModificationDescription('');
    setModificationMakes([]);
    setModificationPriceExtra('');
    setShowModificationForm(false);
  }

  function handlePhotoSelect(file?: File) {
    if (!file) return;
    setPhotoPreview(URL.createObjectURL(file));
  }

  const previewDish = buildPreviewDish(dishData, Number(params.id) || 1, allergens, isVegan, isVegetarian, name, description, price, category);
  const previewTags = getDishTags(previewDish);
  const veganConflictAllergens = [
    previewDish.allergens.milk === 'contains' ? 'milk' : null,
    previewDish.allergens.eggs === 'contains' ? 'eggs' : null,
  ].filter(Boolean);

  const detectedAllergens = allergens.filter((a) => a.status !== 'no');
  const visibleAllergens = showAllAllergens ? allergens : detectedAllergens;
  const modificationBadges = Array.from(
    new Set(modifications.flatMap((mod) => makesFromRemoves(mod.removes)))
  );

  if (saved) {
    return (
      <div style={{ fontFamily: 'Inter, -apple-system, sans-serif', padding: '40px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#EDF4EE', border: '0.5px solid rgba(126,168,132,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, marginBottom: 16, color: '#7EA884' }}>✓</div>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 20, fontWeight: 400, color: '#1A1614', marginBottom: 8 }}>Changes saved</h1>
        <p style={{ fontSize: 13, color: '#8B7E71', marginBottom: 24, lineHeight: 1.65, maxWidth: 280 }}>
          Your edits to <em>{name || dishData.name}</em> have been saved and will appear for diners immediately.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 320 }}>
          {nextId ? (
            <button onClick={() => router.push(nextDishHref)} style={{ width: '100%', background: '#1A1614', color: '#FDFBF7', border: 'none', borderRadius: 10, padding: '12px', fontSize: 12, cursor: 'pointer' }}>
              Next dish →
            </button>
          ) : (
            <>
              <div style={{ fontSize: 13, color: '#456B4B', background: '#EDF4EE', border: '0.5px solid rgba(126,168,132,0.3)', borderRadius: 10, padding: '12px' }}>
                All review dishes confirmed ✓
              </div>
              <button onClick={() => router.push('/admin/menu/import?step=review')} style={{ width: '100%', background: '#1A1614', color: '#FDFBF7', border: 'none', borderRadius: 10, padding: '12px', fontSize: 12, cursor: 'pointer' }}>
                Publish
              </button>
            </>
          )}
          <button onClick={() => router.push(returnPath)} style={{ width: '100%', background: 'transparent', border: '0.5px solid #C4B9A8', borderRadius: 10, padding: '12px', fontSize: 12, cursor: 'pointer', color: '#1A1614' }}>
            {returnLabel}
          </button>
          <button onClick={() => router.push('/admin')} style={{ background: 'none', border: 'none', padding: '8px', color: '#8B7E71', fontSize: 12, cursor: 'pointer' }}>
            Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: 'Inter, -apple-system, sans-serif', background: '#FDFBF7', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ padding: '14px 16px', borderBottom: '0.5px solid #C4B9A8', position: 'sticky', top: 0, background: '#FDFBF7', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={() => router.push(returnPath)}
            style={{ width: 32, height: 32, borderRadius: '50%', background: '#F5F0E8', border: '0.5px solid #C4B9A8', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 15, flexShrink: 0, color: '#1A1614' }}
            aria-label={returnLabel}
          >
            ←
          </button>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: 9, color: '#8B7E71', letterSpacing: '0.04em', marginBottom: 2 }}>Dashboard › Menu</div>
            <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 15, fontWeight: 400, color: '#1A1614', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name || dishData.name}</h1>
          </div>
          <span style={{ padding: '4px 10px', borderRadius: 100, background: '#EDF4EE', color: '#456B4B', fontSize: 10, fontWeight: 500, flexShrink: 0 }}>
            Published
          </span>
        </div>
      </div>

      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 16, paddingBottom: 32 }}>
        {/* Photo */}
        <div>
          <div
            onClick={() => photoInputRef.current?.click()}
            style={{
              width: '100%',
              height: 140,
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
          <div style={{ fontSize: 10, color: '#C4B9A8' }}>
            Natural light · top-down angle · clean plate
          </div>
        </div>

        {/* Dish details */}
        <div>
          <div style={{ fontSize: 10, color: '#8B7E71', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
            Dish details
          </div>
          <div style={{ background: '#F5F0E8', borderRadius: 10, padding: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Dish name"
              style={{ ...INPUT_STYLE, fontFamily: 'Georgia, serif', fontSize: 14 }}
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              style={{ ...INPUT_STYLE, fontSize: 12, minHeight: 50, lineHeight: 1.5, resize: 'vertical' }}
            />
            <div style={{ display: 'flex', gap: 10 }}>
              <input
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="£0.00"
                style={{ ...INPUT_STYLE, fontFamily: 'Georgia, serif', fontSize: 14, flex: 1 }}
              />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Dish['category'])}
                style={{ ...INPUT_STYLE, fontSize: 12, flex: 1, cursor: 'pointer' }}
              >
                <option value="starter">Starter</option>
                <option value="main">Main</option>
                <option value="dessert">Dessert</option>
                <option value="side">Side</option>
              </select>
            </div>
          </div>
        </div>

        {/* Allergens */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <div style={{ fontSize: 10, color: '#8B7E71', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Allergens
            </div>
            <div style={{ fontSize: 10, color: '#8B7E71' }}>
              {detectedAllergens.length} of 14 detected
            </div>
          </div>

          {visibleAllergens.length === 0 ? (
            <div style={{ background: '#FFFFFF', border: '0.5px solid #C4B9A8', borderRadius: 12, padding: 14, fontSize: 12, color: '#8B7E71', textAlign: 'center' }}>
              No allergens detected.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {visibleAllergens.map((allergen) => (
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
          )}

          <button
            onClick={() => setShowAllAllergens((prev) => !prev)}
            style={{ background: 'none', border: 'none', color: '#1A1614', fontSize: 12, marginTop: 10, cursor: 'pointer', padding: '6px 0', textDecoration: 'underline', textUnderlineOffset: 3, fontFamily: 'inherit' }}
          >
            {showAllAllergens ? 'Show only detected allergens' : 'Show all 14 allergens'}
          </button>
        </div>

        {/* Dietary suitability */}
        <div>
          <div style={{ fontSize: 10, color: '#8B7E71', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
            Dietary
          </div>
          <div style={{ background: '#FFFFFF', border: '0.5px solid #C4B9A8', borderRadius: 12, padding: '14px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
              <span style={{ fontSize: 13, color: '#1A1614' }}>Suitable for vegans</span>
              <ToggleSwitch
                checked={isVegan}
                onChange={(v) => {
                  setIsVegan(v);
                  if (v) setIsVegetarian(true);
                }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
              <span style={{ fontSize: 13, color: '#1A1614' }}>Suitable for vegetarians</span>
              <ToggleSwitch
                checked={isVegetarian || isVegan}
                onChange={(v) => setIsVegetarian(v)}
                disabled={isVegan}
              />
            </div>
          </div>
          {isVegan && veganConflictAllergens.length > 0 && (
            <div style={{ background: '#F8F2E6', border: '0.5px solid rgba(194,164,110,0.45)', borderRadius: 12, padding: '12px 14px', color: '#7A6432', fontSize: 12, lineHeight: 1.5, marginTop: 10 }}>
              This dish contains {veganConflictAllergens.join('/')} — please confirm it&apos;s suitable for vegans
            </div>
          )}
        </div>

        {/* Modifications */}
        <div>
          <div style={{ fontSize: 10, color: '#8B7E71', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
            Modifications
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {modifications.map((modification) => {
              const badges = makesFromRemoves(modification.removes);
              return (
                <div key={modification.name} style={{ background: '#F7F9FC', border: '0.5px solid #7A9ABB', borderRadius: 10, padding: 12, position: 'relative' }}>
                  <button
                    onClick={() => setModifications((prev) => prev.filter((item) => item.name !== modification.name))}
                    style={{ position: 'absolute', top: 10, right: 12, background: 'none', border: 'none', color: '#C67A5C', cursor: 'pointer', fontSize: 11, padding: 0, fontFamily: 'inherit' }}
                  >
                    Remove
                  </button>
                  <div style={{ fontSize: 12, color: '#1A1614', fontWeight: 500, paddingRight: 56 }}>{modification.name}</div>
                  {modification.description && (
                    <div style={{ fontSize: 10, color: '#8B7E71', marginTop: 4, lineHeight: 1.45 }}>
                      {modification.description}
                    </div>
                  )}
                  {(badges.length > 0 || modification.priceExtra > 0) && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
                      {badges.map((label) => (
                        <span
                          key={label}
                          style={{ background: '#EBF0F7', color: '#4A6A8A', borderRadius: 100, padding: '2px 8px', fontSize: 9, fontWeight: 500 }}
                        >
                          Makes {label}
                        </span>
                      ))}
                      {modification.priceExtra > 0 && (
                        <span style={{ fontSize: 11, color: '#C8553A', fontWeight: 500 }}>
                          +£{modification.priceExtra.toFixed(2)}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {showModificationForm ? (
              <div style={{ background: '#F5F0E8', borderRadius: 12, padding: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <div style={{ fontSize: 11, color: '#1A1614', fontWeight: 500, marginBottom: 6 }}>What changes?</div>
                  <input
                    value={modificationName}
                    onChange={(e) => setModificationName(e.target.value)}
                    placeholder="e.g. With gluten-free bread"
                    style={{ ...INPUT_STYLE, fontSize: 12 }}
                  />
                </div>
                <div>
                  <div style={{ fontSize: 11, color: '#1A1614', fontWeight: 500, marginBottom: 6 }}>How is the dish served differently?</div>
                  <textarea
                    value={modificationDescription}
                    onChange={(e) => setModificationDescription(e.target.value)}
                    placeholder="e.g. Sourdough replaced with certified GF bread"
                    rows={2}
                    style={{ ...INPUT_STYLE, fontSize: 12, lineHeight: 1.5, resize: 'vertical' }}
                  />
                </div>
                <div>
                  <div style={{ fontSize: 11, color: '#1A1614', fontWeight: 500, marginBottom: 6 }}>This modification makes the dish:</div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {MODIFICATION_MAKE_OPTIONS.map((opt) => {
                      const active = modificationMakes.includes(opt.key);
                      return (
                        <button
                          key={opt.key}
                          type="button"
                          onClick={() => toggleModificationMake(opt.key)}
                          style={{
                            background: active ? '#1A1614' : 'transparent',
                            color: active ? '#FDFBF7' : '#8B7E71',
                            border: active ? '0.5px solid #1A1614' : '0.5px solid #C4B9A8',
                            borderRadius: 100,
                            padding: '5px 10px',
                            fontSize: 11,
                            cursor: 'pointer',
                            fontFamily: 'inherit',
                          }}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: '#1A1614', fontWeight: 500, marginBottom: 6 }}>Extra cost</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 13, color: '#8B7E71' }}>£</span>
                    <input
                      type="number"
                      min="0"
                      step="0.5"
                      value={modificationPriceExtra}
                      onChange={(e) => setModificationPriceExtra(e.target.value)}
                      placeholder="0.00"
                      style={{ ...INPUT_STYLE, fontSize: 12, width: 80 }}
                    />
                    <span style={{ fontSize: 10, color: '#8B7E71' }}>Leave empty for no extra charge</span>
                  </div>
                </div>
                <button
                  onClick={addModification}
                  style={{ background: '#1A1614', color: '#FDFBF7', border: 'none', borderRadius: 8, padding: '10px', fontSize: 12, cursor: 'pointer', fontWeight: 500 }}
                >
                  Save modification
                </button>
                <button
                  onClick={() => {
                    setShowModificationForm(false);
                    setModificationName('');
                    setModificationDescription('');
                    setModificationMakes([]);
                    setModificationPriceExtra('');
                  }}
                  style={{ background: 'none', border: 'none', color: '#8B7E71', cursor: 'pointer', fontSize: 12, padding: '2px', fontFamily: 'inherit' }}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button onClick={() => setShowModificationForm(true)} style={{ background: 'transparent', border: '0.5px dashed #C4B9A8', borderRadius: 10, padding: '10px 12px', width: '100%', color: '#8B7E71', fontSize: 12, cursor: 'pointer' }}>
                + Add modification
              </button>
            )}
          </div>
        </div>

        {/* Preview */}
        <div style={{ background: '#F5F0E8', borderRadius: 12, padding: '14px' }}>
          <div style={{ fontSize: 11, color: '#8B7E71', marginBottom: 10 }}>Customers will see this dish as:</div>
          {previewTags.length > 0 || modificationBadges.length > 0 ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {previewTags.map((tag) => (
                <span
                  key={tag}
                  style={{ background: '#EDF4EE', color: '#456B4B', borderRadius: 100, padding: '4px 10px', fontSize: 11, fontWeight: 500 }}
                >
                  {tag}
                </span>
              ))}
              {modificationBadges.map((label) => (
                <span
                  key={`mod-${label}`}
                  style={{ background: '#F7F9FC', color: '#4A6A8A', border: '0.5px solid #7A9ABB', borderRadius: 100, padding: '4px 10px', fontSize: 11, fontWeight: 500 }}
                >
                  Can be made {label}
                </span>
              ))}
            </div>
          ) : (
            <span style={{ fontSize: 12, color: '#8B7E71' }}>No dietary tags — dish contains major allergens</span>
          )}
        </div>

        {/* Legal */}
        <div style={{ background: '#FEF3C7', border: '0.5px solid #F59E0B', borderRadius: 10, padding: '10px 12px', color: '#92400E', fontSize: 10, lineHeight: 1.5 }}>
          You are legally responsible for the accuracy of this allergen information.
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 4 }}>
          <button
            onClick={() => setSaved(true)}
            style={{ width: '100%', background: '#1A1614', color: '#FDFBF7', border: 'none', borderRadius: 10, padding: '13px', fontSize: 13, cursor: 'pointer', fontWeight: 500 }}
          >
            Save changes
          </button>
          <button
            onClick={() => router.push(`/restaurant/1?dishId=${params.id}`)}
            style={{ width: '100%', background: 'transparent', border: '0.5px solid #C4B9A8', borderRadius: 10, padding: '13px', fontSize: 13, cursor: 'pointer', color: '#1A1614' }}
          >
            View as customer
          </button>
          <button
            onClick={() => {
              if (confirm('Delete this dish? This cannot be undone.')) {
                router.push(returnPath);
              }
            }}
            style={{ background: 'none', border: 'none', padding: '10px', color: '#C67A5C', fontSize: 12, cursor: 'pointer', textAlign: 'center', fontFamily: 'inherit' }}
          >
            Delete this dish
          </button>
        </div>
      </div>
    </div>
  );
}
