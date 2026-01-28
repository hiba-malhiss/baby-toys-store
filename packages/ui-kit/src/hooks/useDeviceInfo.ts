import { useState, useEffect, useMemo } from 'react';

export type DeviceInfo = {
  isTouchScreen: boolean;
  isMobileLike: boolean;
};

/**
 * Device info hook: detects touch capability and basic mobile-like UA.
 */
export const useDeviceInfo = (): DeviceInfo => {
  const [isTouchScreen, setIsTouchScreen] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkTouchScreen = () => {
      const hasTouchEvents = 'ontouchstart' in window;
      const hasMaxTouchPoints = navigator.maxTouchPoints > 0;
      const hasPointerCoarse = window.matchMedia('(pointer: coarse)').matches;
      setIsTouchScreen(hasTouchEvents || hasMaxTouchPoints || hasPointerCoarse);
    };

    checkTouchScreen();
    window.addEventListener('resize', checkTouchScreen);
    return () => window.removeEventListener('resize', checkTouchScreen);
  }, []);

  const isMobileLike = useMemo(() => {
    if (typeof navigator === 'undefined') return false;
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  }, []);

  return { isTouchScreen, isMobileLike };
};

export default useDeviceInfo;
