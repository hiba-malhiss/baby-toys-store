export interface HeroBannerDto {
  id?: number;
  text: string;
  locale: string;
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
  heroBanners: HeroBannerDto[];
  infoCards: InfoCardDto[];
  galleryImages: GalleryImageDto[];
}

export interface UpdateHomePageContentRequest {
  heroBanners?: HeroBannerDto[];
  infoCards?: InfoCardDto[];
  galleryImages?: { imageUrl: string }[];
}
