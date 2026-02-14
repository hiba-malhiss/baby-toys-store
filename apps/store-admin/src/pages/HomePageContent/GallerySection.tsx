import React from 'react';
import { ImageUploader } from '@baby-toys/ui-kit';
import { useTranslation } from 'react-i18next';

interface GallerySectionProps {
  galleryUploaderProps: any;
}

const GallerySection: React.FC<GallerySectionProps> = ({ galleryUploaderProps }) => {
  const { t } = useTranslation();
  return (
    <ImageUploader
      {...galleryUploaderProps}
      maxFileSizeMB={10}
      accept="image/jpeg,image/png,image/webp"
      showPreview
      maxFileSizeText={t('homepage.gallery.maxFileSize')}
      acceptedFormatsText={t('homepage.gallery.acceptedFormats')}
      maxFileSizeText={t('homepage.gallery.maxFileSize')}
      acceptedFormatsText={t('homepage.gallery.acceptedFormats')}
    />
  );
};

export default GallerySection;
