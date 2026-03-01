import type { BannerTextAlignment, VerticalAlignment } from '../../api/types/homepage.ts';

export const getFlexAlignment = (alignment: BannerTextAlignment | undefined, isRtl: boolean) => {
  switch (alignment) {
    case 'LEFT':
      return isRtl ? 'end' : 'start';
    case 'RIGHT':
      return isRtl ? 'start' : 'end';
    case 'CENTER':
    default:
      return 'center';
  }
};

export const getFlexJustify = (
  alignment: BannerTextAlignment | undefined,
  isRtl: boolean
): 'start' | 'center' | 'end' => {
  switch (alignment) {
    case 'LEFT':
      return isRtl ? 'end' : 'start';
    case 'RIGHT':
      return isRtl ? 'start' : 'end';
    case 'CENTER':
    default:
      return 'center';
  }
};

export const getFlexVertical = (
  verticalAlignment: VerticalAlignment | undefined
): 'start' | 'center' | 'end' => {
  switch (verticalAlignment) {
    case 'TOP':
      return 'start';
    case 'BOTTOM':
      return 'end';
    case 'CENTER':
    default:
      return 'center';
  }
};
