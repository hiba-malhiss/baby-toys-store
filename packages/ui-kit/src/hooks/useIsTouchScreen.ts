import { useState, useEffect } from 'react';

/**
 * Custom hook to detect if the device is a touch screen
 * @returns {boolean} True if the device is a touch screen, false otherwise
 */
export const useIsTouchScreen = (): boolean => {
  const [isTouchScreen, setIsTouchScreen] = useState(false);

  useEffect(() => {
    // Check if window is defined (for SSR)
    if (typeof window === 'undefined') return;

    // Check if the browser supports touch events or the maxTouchPoints property
    const checkTouchScreen = () => {
      const hasTouchEvents = 'ontouchstart' in window;
      const hasMaxTouchPoints = navigator.maxTouchPoints > 0;
      const hasPointerCoarse = window.matchMedia('(pointer: coarse)').matches;
      
      setIsTouchScreen(hasTouchEvents || hasMaxTouchPoints || hasPointerCoarse);
    };

    // Initial check
    checkTouchScreen();

    // Add event listeners for changes in touch support (e.g., when device is rotated)
    window.addEventListener('resize', checkTouchScreen);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', checkTouchScreen);
    };
  }, []);

  return isTouchScreen;
};

export default useIsTouchScreen;
