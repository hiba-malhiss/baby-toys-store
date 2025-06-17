import { type RefObject } from 'react';

export const clamp = (num: number, min: number, max: number) => Math.min(Math.max(num, min), max);

export const roundToStep = (val: number, step: number, min: number) =>
  Math.round((val - min) / step) * step + min;

export const isRTL = (): boolean => {
  if (typeof window === 'undefined') return false;
  return (
    document.documentElement.dir === 'rtl' ||
    document.body.dir === 'rtl' ||
    getComputedStyle(document.body).direction === 'rtl'
  );
};

// Calculate how much of the slider track was clicked (in %), based on mouse position
export const getPercentFromEvent = (
  clientX: number,
  clientY: number,
  orientation: 'horizontal' | 'vertical',
  trackRef: RefObject<HTMLDivElement | null>
): number => {
  if (!trackRef.current) return 0;

  const rect = trackRef.current.getBoundingClientRect();
  let percent: number;

  if (orientation === 'horizontal') {
    const x = clientX - rect.left;
    percent = (x / rect.width) * 100;
    if (isRTL()) percent = 100 - percent;
  } else {
    const y = clientY - rect.top;
    percent = ((rect.height - y) / rect.height) * 100;
  }

  return clamp(percent, 0, 100);
};
