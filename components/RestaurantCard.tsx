'use client';

import { useRouter } from 'next/navigation';
import { Restaurant } from '@/lib/types';

interface RestaurantCardProps {
  restaurant: Restaurant;
  filters: string[];
  position: number;
}

export default function RestaurantCard({ restaurant, filters, position }: RestaurantCardProps) {
  const router = useRouter();

  function handleClick() {
    router.push(`/app/restaurant/${restaurant.slug}?filters=${filters.join(',')}`);
  }

  return (
    <button
      onClick={handleClick}
      style={{
        background: '#FFFFFF',
        border: '0.5px solid #C4B9A8',
        borderRadius: 14,
        overflow: 'hidden',
        width: '100%',
        textAlign: 'left',
        cursor: 'pointer',
        display: 'block',
        padding: '12px',
      }}
    >
      <div style={{ fontFamily: 'Georgia, serif', fontSize: 14, color: '#1A1614', marginBottom: 4 }}>{restaurant.name}</div>
      <div style={{ fontSize: 11, color: '#8B7E71' }}>{restaurant.cuisine} · {restaurant.distance}</div>
    </button>
  );
}
