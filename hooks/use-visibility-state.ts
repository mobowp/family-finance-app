'use client';

import { useState, useEffect } from 'react';

const STORAGE_KEY = 'finance-visibility-state';

export function useVisibilityState() {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) {
      setIsVisible(stored === 'true');
    }
    setIsLoaded(true);
  }, []);

  const toggleVisibility = () => {
    setIsVisible((prev) => {
      const newValue = !prev;
      localStorage.setItem(STORAGE_KEY, String(newValue));
      return newValue;
    });
  };

  return { isVisible, toggleVisibility, isLoaded };
}
