'use client';

import { useEffect, useState } from 'react';

export function useWakeLock() {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let wakeLock: any = null;

    async function requestWakeLock() {
      try {
        if ('wakeLock' in navigator && document.visibilityState === 'visible') {
          wakeLock = await (navigator as any).wakeLock.request('screen');
          setIsActive(true);

          wakeLock.addEventListener('release', () => {
            setIsActive(false);
          });
        }
      } catch (err) {
        console.warn('Wake Lock error:', err);
        setIsActive(false);
      }
    }

    requestWakeLock();

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        requestWakeLock();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (wakeLock) {
        wakeLock.release().catch(() => {});
      }
    };
  }, []);

  return { isActive };
}