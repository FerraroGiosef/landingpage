'use client';

import { usePathname, useRouter } from 'next/navigation';

const NAV = [
  { icon: '⊞', label: 'Dashboard', href: '/admin' },
  { icon: '🍽', label: 'Menu', href: '/admin/menu' },
  { icon: '📊', label: 'Insights', href: '/admin/insights' },
  { icon: '⚙', label: 'Settings', href: '/admin/settings' },
];

function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  function isActive(href: string) {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: 430,
        background: '#FDFBF7',
        borderTop: '0.5px solid #C4B9A8',
        display: 'flex',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        zIndex: 100,
      }}
    >
      {NAV.map((item) => {
        const active = isActive(item.href);
        return (
          <button
            key={item.href}
            onClick={() => router.push(item.href)}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '10px 4px 8px', background: 'none', border: 'none', cursor: 'pointer', position: 'relative' }}
          >
            {active && <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 20, height: 2, background: '#1A1614', borderRadius: '0 0 4px 4px' }} />}
            <span style={{ fontSize: 18, color: active ? '#1A1614' : '#C4B9A8' }}>{item.icon}</span>
            <span style={{ fontSize: 10, color: active ? '#1A1614' : '#8B7E71', fontWeight: active ? 500 : 400 }}>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ maxWidth: 430, margin: '0 auto', minHeight: '100dvh', background: '#FDFBF7', paddingBottom: 68, fontFamily: 'Inter, -apple-system, sans-serif' }}>
      {children}
      <AdminNav />
    </div>
  );
}
