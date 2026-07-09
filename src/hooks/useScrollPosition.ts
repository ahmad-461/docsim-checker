import { useState, useEffect } from 'react';

/**
 * A hook that returns the current scroll Y position and a boolean indicating
 * if the scroll position is beyond a specified threshold.
 */
export const useScrollPosition = (threshold: number = 0) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    // Only run on client
    if (typeof window === 'undefined') return;

    let lastIsScrolled = false;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const currentIsScrolled = currentScrollY > threshold;

      setScrollY(currentScrollY);

      if (currentIsScrolled !== lastIsScrolled) {
        setIsScrolled(currentIsScrolled);
        lastIsScrolled = currentIsScrolled;
      }
    };

    // Set initial state
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  return { scrollY, isScrolled };
};
