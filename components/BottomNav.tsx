'use client';

import { useRouter, usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { icon: '🍽️', label: 'Discover', href: '/' },
  { icon: '🔍', label: 'Search', href: '/list' },
  { icon: '👥', label: 'Groups', href: '/group' },
  { icon: '🤍', label: 'Saved', href: '/saved' },
];

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === '/') return pathname === '/';
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
        background: '#1E2220',
        borderTop: '1px solid rgba(232,234,229,0.1)',
        display: 'flex',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        zIndex: 100,
      }}
    >
      {NAV_ITEMS.map((item) => {
        const active = isActive(item.href);
        return (
          <button
            key={item.href}
            onClick={() => router.push(item.href)}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3,
              padding: '10px 4px 8px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <span style={{ fontSize: 20 }}>{item.icon}</span>
            <span
              style={{
                fontSize: 10,
                fontWeight: active ? 700 : 400,
                color: active ? '#A8D8B0' : 'rgba(232,234,229,0.45)',
                letterSpacing: '0.02em',
              }}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
