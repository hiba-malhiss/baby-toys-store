export interface HeroBannerDto {
  id?: number;
  text: string;
}

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

export interface HomePageContentDto {
  heroBanners: HeroBannerDto[];
  infoCards: InfoCardDto[];
  galleryImages: GalleryImageDto[];
}
