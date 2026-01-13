'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Gift } from '@/lib/types';

interface StatusPollerProps {
  giftId: string;
  currentStatus: Gift['status'];
}

export default function StatusPoller({ giftId, currentStatus }: StatusPollerProps) {
  const router = useRouter();

  useEffect(() => {
    // Only poll if status is pending or generating
    if (currentStatus === 'ready' || currentStatus === 'error') {
      return;
    }

    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/gifts/${giftId}`);
        if (response.ok) {
          const gift = await response.json();
          if (gift.status !== currentStatus) {
            router.refresh();
          }
        }
      } catch (error) {
        console.error('Polling error:', error);
      }
    }, 3000); // Poll every 3 seconds

    return () => clearInterval(interval);
  }, [giftId, currentStatus, router]);

  return null;
}
