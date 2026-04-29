'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function GroupDetailRedirectPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/app/group');
  }, [router]);
  return null;
}
