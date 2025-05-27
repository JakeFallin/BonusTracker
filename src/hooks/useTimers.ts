import { useState, useEffect } from 'react';

interface Timer {
  casinoId: string;
  endTime: number;
}

export function useTimers() {
  const [activeTimers, setActiveTimers] = useState<Timer[]>([]);

  useEffect(() => {
    // Load all active timers from localStorage
    const timers: Timer[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('timer_')) {
        const casinoId = key.replace('timer_', '');
        const endTime = parseInt(localStorage.getItem(key) || '0');
        if (endTime > Date.now()) {
          timers.push({ casinoId, endTime });
        } else {
          localStorage.removeItem(key);
        }
      }
    }
    setActiveTimers(timers);
  }, []);

  const addTimer = (casinoId: string, hours: number) => {
    const endTime = Date.now() + hours * 60 * 60 * 1000;
    localStorage.setItem(`timer_${casinoId}`, endTime.toString());
    setActiveTimers(prev => [...prev, { casinoId, endTime }]);
  };

  const removeTimer = (casinoId: string) => {
    localStorage.removeItem(`timer_${casinoId}`);
    setActiveTimers(prev => prev.filter(timer => timer.casinoId !== casinoId));
  };

  return {
    activeTimers,
    addTimer,
    removeTimer,
    activeTimerCount: activeTimers.length
  };
} 