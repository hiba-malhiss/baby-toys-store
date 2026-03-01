import React from 'react';
import Carousel from '../Carousel/Carousel';
import ImageMagnifierPopover from '../ImageMagnifierPopover/ImageMagnifierPopover';
import styles from './image-gallery.module.scss';
import clsx from 'clsx';
import { Image } from '../Image';

type ImageGalleryProps = {
  images?: string[];
  productName?: string;
  selectedImage: string | undefined;
  onSelectImage: (image: string) => void;
};

const ImageGallery: React.FC<ImageGalleryProps> = ({
  images = [],
  productName,
  selectedImage,
  onSelectImage,
}) => {
  const safeImages = Array.isArray(images) ? images.filter(Boolean) : [];

  if (!selectedImage) {
    return (
      <div className={styles.imageGallery}>
        <div className={styles.imageGalleryMainImage}>
          <div className={styles.imageGalleryThumbnailWrapper}>
            <div className={styles.imageGalleryThumbnail} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.imageGallery}>
      <div className={styles.imageGalleryMainImage}>
        <ImageMagnifierPopover src={selectedImage} alt={productName || ''} />
      </div>
      <Carousel
        navigationStyle="side"
        items={safeImages}
        numVisible={3}
        orientation="horizontal"
        size="small"
        itemTemplate={(img) => (
          <div
            key={img}
            className={styles.imageGalleryThumbnailWrapper}
            onClick={() => onSelectImage(img)}
          >
            <Image
              src={img}
              alt={productName || ''}
              className={clsx(styles.imageGalleryThumbnail, {
                [styles.imageGalleryUnselected]: img !== selectedImage,
              })}
            />
          </div>
        )}
      />
    </div>
  );
};

export default ImageGallery;
