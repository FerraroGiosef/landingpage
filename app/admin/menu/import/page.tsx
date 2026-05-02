'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

type Step = 'upload' | 'processing' | 'review' | 'published';

interface ImportedDish {
  id: number;
  name: string;
  price: string;
  status: 'matched' | 'review';
  confidence: number;
}

const MOCK_DISHES: ImportedDish[] = [
  { id: 1, name: 'Bruschetta al Pomodoro', price: '£7.50', status: 'matched', confidence: 98 },
  { id: 2, name: 'Risotto ai Funghi Selvatici', price: '£16.50', status: 'matched', confidence: 94 },
  { id: 3, name: 'Melanzane alla Parmigiana', price: '£15.00', status: 'matched', confidence: 91 },
  { id: 4, name: 'Branzino in Crosta di Erbe', price: '£22.00', status: 'review', confidence: 72 },
  { id: 5, name: 'Tagliatelle al Ragù Bolognese', price: '£17.50', status: 'matched', confidence: 96 },
  { id: 6, name: 'Cotoletta alla Milanese', price: '£24.00', status: 'review', confidence: 68 },
  { id: 7, name: 'Gnocchi al Pomodoro', price: '£14.50', status: 'matched', confidence: 90 },
  { id: 8, name: 'Zuppa di Lenticchie', price: '£9.00', status: 'matched', confidence: 95 },
  { id: 9, name: 'Tiramisù della Casa', price: '£8.50', status: 'matched', confidence: 99 },
  { id: 10, name: 'Panna Cotta al Caramello', price: '£7.50', status: 'review', confidence: 65 },
];

const PROCESSING_STEPS = [
  { msg: '32 dishes found', done: true },
  { msg: 'Allergen chart loaded', done: true },
  { msg: 'Cross-referencing data…', done: false },
];

export default function MenuImportPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('upload');
  const [menuFile, setMenuFile] = useState<File | null>(null);
  const [allergenFile, setAllergenFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const menuInputRef = useRef<HTMLInputElement>(null);
  const allergenInputRef = useRef<HTMLInputElement>(null);

  function handleExtract() {
    setStep('processing');
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setStep('review');
          return 100;
        }
        return p + 4;
      });
    }, 80);
  }

  if (step === 'upload') {
    return (
      <div style={{ fontFamily: 'Inter, -apple-system, sans-serif' }}>
        <div style={{ padding: '16px 16px 0', borderBottom: '0.5px solid #C4B9A8' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <button onClick={() => router.back()} style={{ width: 34, height: 34, borderRadius: '50%', background: '#F5F0E8', border: '0.5px solid #C4B9A8', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 16 }}>←</button>
            <div>
              <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 20, fontWeight: 400, color: '#1A1614', margin: 0 }}>Import menu</h1>
              <p style={{ fontSize: 11, color: '#8B7E71', margin: '2px 0 0' }}>Step 1 of 3 — Upload documents</p>
            </div>
          </div>
        </div>
        <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Menu upload */}
          <UploadZone
            title="Upload your menu"
            subtitle="PDF, image, or paste a URL"
            file={menuFile}
            onFileSelect={(f) => setMenuFile(f)}
            inputRef={menuInputRef}
            accept=".pdf,.png,.jpg,.jpeg"
          />
          {/* Allergen sheet upload */}
          <UploadZone
            title="Upload your allergen sheet"
            subtitle="The matrix or chart your kitchen uses"
            file={allergenFile}
            onFileSelect={(f) => setAllergenFile(f)}
            inputRef={allergenInputRef}
            accept=".pdf,.png,.jpg,.jpeg,.xlsx,.csv"
          />

          <button
            onClick={handleExtract}
            disabled={!menuFile || !allergenFile}
            style={{
              background: menuFile && allergenFile ? '#1A1614' : '#C4B9A8',
              color: '#FDFBF7',
              border: 'none',
              borderRadius: 12,
              padding: '15px',
              fontSize: 13,
              cursor: menuFile && allergenFile ? 'pointer' : 'not-allowed',
              marginTop: 4,
            }}
          >
            Extract and match →
          </button>

          <div style={{ textAlign: 'center' }}>
            <button
              onClick={() => { setMenuFile(new File([], 'demo-menu.pdf')); setAllergenFile(new File([], 'demo-allergens.xlsx')); }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#C8553A', fontSize: 12 }}
            >
              Use demo files to preview →
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'processing') {
    return (
      <div style={{ fontFamily: 'Inter, -apple-system, sans-serif', padding: '40px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ fontFamily: 'Georgia, serif', fontSize: 18, color: '#1A1614', marginBottom: 8 }}>Extracting and matching…</div>
        <p style={{ fontSize: 13, color: '#8B7E71', textAlign: 'center', marginBottom: 28 }}>This usually takes 30–60 seconds</p>
        {/* Progress bar */}
        <div style={{ width: '100%', maxWidth: 320, background: '#F5F0E8', borderRadius: 100, height: 6, marginBottom: 24, overflow: 'hidden' }}>
          <div style={{ height: '100%', background: '#1A1614', borderRadius: 100, width: `${progress}%`, transition: 'width 0.1s linear' }} />
        </div>
        {/* Status messages */}
        <div style={{ width: '100%', maxWidth: 320, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {PROCESSING_STEPS.map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 20, height: 20, borderRadius: '50%', background: s.done && progress > 30 ? '#EDF4EE' : '#F5F0E8', border: `0.5px solid ${s.done && progress > 30 ? '#7EA884' : '#C4B9A8'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 10, color: '#7EA884' }}>
                {s.done && progress > 30 ? '✓' : progress < 90 && i === 2 ? '…' : ''}
              </div>
              <span style={{ fontSize: 12, color: s.done && progress > 30 ? '#1A1614' : '#8B7E71' }}>{s.msg}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (step === 'review') {
    const matched = MOCK_DISHES.filter((d) => d.status === 'matched').length;
    const needsReview = MOCK_DISHES.filter((d) => d.status === 'review').length;
    return (
      <div style={{ fontFamily: 'Inter, -apple-system, sans-serif' }}>
        <div style={{ padding: '16px 16px 0', borderBottom: '0.5px solid #C4B9A8', position: 'sticky', top: 0, background: '#FDFBF7', zIndex: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <button onClick={() => setStep('upload')} style={{ width: 34, height: 34, borderRadius: '50%', background: '#F5F0E8', border: '0.5px solid #C4B9A8', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 16 }}>←</button>
            <div>
              <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 18, fontWeight: 400, color: '#1A1614', margin: 0 }}>Review extracted dishes</h1>
              <p style={{ fontSize: 11, color: '#8B7E71', margin: '2px 0 0' }}>Step 2 of 3 — Confirm allergen data</p>
            </div>
          </div>
          {/* Stats */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
            <div style={{ flex: 1, background: '#EDF4EE', border: '0.5px solid rgba(126,168,132,0.3)', borderRadius: 8, padding: '8px 10px', textAlign: 'center' }}>
              <div style={{ fontSize: 16, fontWeight: 500, color: '#456B4B' }}>{matched}</div>
              <div style={{ fontSize: 9.5, color: '#7EA884' }}>Matched</div>
            </div>
            <div style={{ flex: 1, background: '#F8F2E6', border: '0.5px solid rgba(194,164,110,0.3)', borderRadius: 8, padding: '8px 10px', textAlign: 'center' }}>
              <div style={{ fontSize: 16, fontWeight: 500, color: '#7A6432' }}>{needsReview}</div>
              <div style={{ fontSize: 9.5, color: '#C2A46E' }}>Review needed</div>
            </div>
          </div>
        </div>

        <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {MOCK_DISHES.map((dish) => (
            <div
              key={dish.id}
              style={{ background: '#FFFFFF', border: '0.5px solid #C4B9A8', borderRadius: 12, padding: '12px', borderLeft: dish.status === 'review' ? '2px solid #C2A46E' : undefined }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: 13, color: '#1A1614' }}>{dish.name}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontFamily: 'Georgia, serif', fontSize: 12, color: '#8B7E71' }}>{dish.price}</span>
                  <span style={{ background: dish.status === 'matched' ? '#EDF4EE' : '#F8F2E6', color: dish.status === 'matched' ? '#456B4B' : '#7A6432', borderRadius: 100, padding: '2px 8px', fontSize: 10 }}>
                    {dish.status === 'matched' ? 'matched' : 'review'}
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontSize: 11, color: '#8B7E71' }}>{dish.confidence}% confidence</div>
                {dish.status === 'review' && (
                  <button style={{ background: 'none', border: '0.5px solid #C4B9A8', borderRadius: 6, padding: '4px 10px', fontSize: 11, color: '#1A1614', cursor: 'pointer' }}>Edit allergens</button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div style={{ padding: '12px 16px 24px', display: 'flex', gap: 10 }}>
          <button style={{ flex: 1, background: 'transparent', border: '0.5px solid #C4B9A8', borderRadius: 10, padding: '12px', fontSize: 12, cursor: 'pointer', color: '#8B7E71' }}>
            Review next ({needsReview})
          </button>
          <button onClick={() => setStep('published')} style={{ flex: 2, background: '#1A1614', color: '#FDFBF7', border: 'none', borderRadius: 10, padding: '12px', fontSize: 12, cursor: 'pointer' }}>
            Confirm matched & publish →
          </button>
        </div>
      </div>
    );
  }

  // Published
  return (
    <div style={{ fontFamily: 'Inter, -apple-system, sans-serif', padding: '40px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
      <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#EDF4EE', border: '0.5px solid rgba(126,168,132,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, marginBottom: 16 }}>✓</div>
      <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 22, fontWeight: 400, color: '#1A1614', marginBottom: 8, letterSpacing: '-0.3px' }}>Menu is live</h1>
      <p style={{ fontSize: 13, color: '#8B7E71', marginBottom: 24, lineHeight: 1.65, maxWidth: 280 }}>
        Your menu is now visible to diners. 28 dishes published, 25 auto-matched, 3 manually added.
      </p>

      <div style={{ background: '#F5F0E8', borderRadius: 10, padding: '12px 16px', marginBottom: 24, width: '100%', maxWidth: 320, textAlign: 'left' }}>
        <div style={{ fontSize: 11, color: '#8B7E71', marginBottom: 4 }}>Verified by</div>
        <div style={{ fontSize: 13, color: '#1A1614', marginBottom: 2 }}>{"L'Artigiano del Gusto"} · 12 Apr 2026</div>
        <div style={{ fontSize: 11, color: '#8B7E71' }}>Next review due: 12 May 2026</div>
      </div>

      <div style={{ display: 'flex', gap: 10, width: '100%', maxWidth: 320 }}>
        <button style={{ flex: 1, background: 'transparent', border: '0.5px solid #C4B9A8', borderRadius: 10, padding: '12px', fontSize: 12, cursor: 'pointer', color: '#1A1614' }}>
          View live page →
        </button>
        <button onClick={() => router.push('/admin')} style={{ flex: 1, background: '#1A1614', color: '#FDFBF7', border: 'none', borderRadius: 10, padding: '12px', fontSize: 12, cursor: 'pointer' }}>
          Dashboard
        </button>
      </div>
    </div>
  );
}

function UploadZone({ title, subtitle, file, onFileSelect, inputRef, accept }: {
  title: string;
  subtitle: string;
  file: File | null;
  onFileSelect: (f: File) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  accept: string;
}) {
  return (
    <div
      onClick={() => inputRef.current?.click()}
      style={{ border: `0.5px dashed ${file ? '#7EA884' : '#C4B9A8'}`, borderRadius: 14, padding: '24px 20px', cursor: 'pointer', background: file ? '#EDF4EE' : '#FFFFFF', textAlign: 'center', transition: 'background 0.2s' }}
    >
      <input ref={inputRef} type="file" accept={accept} style={{ display: 'none' }} onChange={(e) => { if (e.target.files?.[0]) onFileSelect(e.target.files[0]); }} />
      <div style={{ fontSize: 28, marginBottom: 8 }}>{file ? '✓' : '⬆'}</div>
      <div style={{ fontFamily: 'Georgia, serif', fontSize: 14, color: '#1A1614', marginBottom: 4 }}>{file ? file.name : title}</div>
      <div style={{ fontSize: 12, color: '#8B7E71' }}>{file ? 'File attached · click to replace' : subtitle}</div>
    </div>
  );
}
