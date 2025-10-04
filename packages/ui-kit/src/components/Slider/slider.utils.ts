import { type RefObject } from 'react';

export const clamp = (num: number, min: number, max: number) => Math.min(Math.max(num, min), max);

export const roundToStep = (val: number, step: number, min: number) =>
  Math.round((val - min) / step) * step + min;

// Determine direction from the slider element itself (preferred),
// falling back to document direction if element is unavailable.
export const isElementRTL = (trackRef?: RefObject<HTMLElement | null>): boolean => {
  if (typeof window === 'undefined') return false;
  const el = trackRef?.current as HTMLElement | null;
  if (el) {
    return getComputedStyle(el).direction === 'rtl' || el.dir === 'rtl';
  }
  return (
    document.documentElement.dir === 'rtl' ||
    (document.body && getComputedStyle(document.body).direction === 'rtl')
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
    if (isElementRTL(trackRef)) percent = 100 - percent;
  } else {
    const y = clientY - rect.top;
    percent = ((rect.height - y) / rect.height) * 100;
  }

  return clamp(percent, 0, 100);
};
