import { useEffect, useRef } from 'react';

const INACTIVITY_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes

export function useSessionWatcher(onTimeout: () => void) {
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      onTimeout();
    }, INACTIVITY_TIMEOUT_MS);
  };

  useEffect(() => {
    const events = ['mousemove', 'keydown', 'scroll', 'touchstart'];

    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    resetTimer();

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [onTimeout]);
}
