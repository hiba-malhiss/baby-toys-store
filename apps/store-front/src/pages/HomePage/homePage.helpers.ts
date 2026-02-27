import type { BannerTextAlignment, BannerTextPosition } from '../../api/types/homepage.ts';

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
  position: BannerTextPosition | undefined,
  isRtl: boolean
): 'start' | 'center' | 'end' => {
  if (position?.includes('RIGHT')) return isRtl ? 'start' : 'end';
  if (position?.includes('LEFT')) return isRtl ? 'end' : 'start';

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
