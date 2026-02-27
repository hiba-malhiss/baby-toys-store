export interface InfoCardDto {
  id?: number;
  title: string;
  subtitle: string;
  appearance: string;
  icon: string;
}

export interface GalleryImageDto {
  id?: number;
  imageUrl: string;
  caption?: string;
}

export type BannerTextAlignment = 'LEFT' | 'CENTER' | 'RIGHT';
export type BannerTextPosition = 'CENTER' | 'TOP_RIGHT';

export interface BannerDto {
  id?: number;
  text: string;
  locale?: string;
  imageUrl?: string;
  alignment?: BannerTextAlignment;
  position?: BannerTextPosition;
}

export interface MainBannerDto {
  imageUrl?: string;
  title?: string;
  subtitle?: string;
  ctaText?: string;
  alignment?: BannerTextAlignment;
  locale?: string;
}

export interface HomePageContentDto {
  infoCards: InfoCardDto[];
  galleryImages: GalleryImageDto[];
  banners?: BannerDto[];
  mainBanners?: MainBannerDto[];
}
