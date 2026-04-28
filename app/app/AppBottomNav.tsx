'use client';

import { useRouter, usePathname } from 'next/navigation';
import { Compass, Search, Users, User } from 'lucide-react';

const NAV = [
  { Icon: Compass, label: 'Explore', href: '/app' },
  { Icon: Search, label: 'Search', href: '/app/search' },
  { Icon: Users, label: 'Group', href: '/app/group' },
  { Icon: User, label: 'Profile', href: '/app/profile' },
];

export default function AppBottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === '/app') return pathname === '/app';
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
        const Icon = item.Icon;
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
              position: 'relative',
            }}
          >
            {active && (
              <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 20, height: 2, background: '#1A1614', borderRadius: '0 0 4px 4px' }} />
            )}
            <Icon size={18} color={active ? '#1A1614' : '#C4B9A8'} strokeWidth={active ? 2.25 : 1.75} />
            <span style={{ fontSize: 10, color: active ? '#1A1614' : '#8B7E71', fontWeight: active ? 500 : 400 }}>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
