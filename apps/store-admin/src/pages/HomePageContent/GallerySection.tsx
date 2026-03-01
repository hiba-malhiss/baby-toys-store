import React from 'react';
import { ImageUploader } from '@baby-toys/ui-kit';

interface GallerySectionProps {
  galleryUploaderProps: any;
}

const GallerySection: React.FC<GallerySectionProps> = ({ galleryUploaderProps }) => {
  return (
    <ImageUploader
      {...galleryUploaderProps}
      maxFileSizeMB={10}
      maxImages={4}
      accept="image/jpeg,image/png,image/webp"
      showPreview
    />
  );
};

export default GallerySection;
