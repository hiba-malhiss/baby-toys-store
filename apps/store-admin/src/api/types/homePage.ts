export enum BannerTextAlignment {
  LEFT = 'LEFT',
  CENTER = 'CENTER',
  RIGHT = 'RIGHT',
}

export enum VerticalAlignment {
  TOP = 'TOP',
  CENTER = 'CENTER',
  BOTTOM = 'BOTTOM',
}

export interface BannerDto {
  id?: number;
  text: string;
  locale: string;
  imageUrl?: string;
  alignment?: BannerTextAlignment;
  verticalAlignment?: VerticalAlignment;
}

export interface MainBannerDto {
  imagesUrl?: string[];
  title?: string;
  subtitle?: string;
  ctaText?: string;
  alignment?: BannerTextAlignment;
  verticalAlignment?: VerticalAlignment;
  locale?: string;
}

export interface InfoCardDto {
  id?: number;
  title: string;
  subtitle: string;
  icon: string;
  appearance?: 'info' | 'warning' | 'success' | 'primary';
  locale: string;
}

export interface GalleryImageDto {
  id?: number;
  imageUrl: string;
  caption?: string;
}

export interface HomePageContentDto {
  infoCards: InfoCardDto[];
  galleryImages: GalleryImageDto[];
  banners?: BannerDto[];
  mainBanners?: MainBannerDto[];
  footerImageUrl?: string;
}

export interface UpdateHomePageContentRequest {
  infoCards?: InfoCardDto[];
  galleryImages?: { imageUrl: string }[];
  banners?: BannerDto[];
  mainBanners?: MainBannerDto[];
  footerImageUrl?: string;
}
