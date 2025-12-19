'use client';

import { useState, useEffect } from 'react';

const STORAGE_KEY = 'finance-visibility-state';
const STORAGE_EVENT = 'finance-visibility-change';

export function useVisibilityState() {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) {
      setIsVisible(stored === 'true');
    }
    setIsLoaded(true);

    const handleStorageChange = (e: CustomEvent) => {
      setIsVisible(e.detail.isVisible);
    };

    window.addEventListener(STORAGE_EVENT as any, handleStorageChange as any);

    return () => {
      window.removeEventListener(STORAGE_EVENT as any, handleStorageChange as any);
    };
  }, []);

  const toggleVisibility = () => {
    setIsVisible((prev) => {
      const newValue = !prev;
      localStorage.setItem(STORAGE_KEY, String(newValue));
      
      const event = new CustomEvent(STORAGE_EVENT, {
        detail: { isVisible: newValue }
      });
      window.dispatchEvent(event);
      
      return newValue;
    });
  };

  return { isVisible, toggleVisibility, isLoaded };
}
