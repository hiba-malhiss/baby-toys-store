import React, { useState } from 'react';
import Carousel from '../Carousel/Carousel';
import ImageMagnifierPopover from '../ImageMagnifierPopover/ImageMagnifierPopover';
import styles from './image-gallery.module.scss';
import clsx from 'clsx';
import { BREAKPOINTS } from '../../constants/breakpoints';
import { Image } from '../Image';

type ImageGalleryProps = {
  images?: string[];
  productName?: string;
};

const ImageGallery: React.FC<ImageGalleryProps> = ({ images = [], productName }) => {
  const safeImages = Array.isArray(images) ? images.filter(Boolean) : [];
  const [selectedImage, setSelectedImage] = useState<string | undefined>(safeImages[0]);

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
        responsiveOptions={[
          { breakpoint: BREAKPOINTS.large, numVisible: 3 },
          { breakpoint: BREAKPOINTS.medium, numVisible: 2 },
          { breakpoint: BREAKPOINTS.small, numVisible: 1 },
        ]}
        itemTemplate={(img) => (
          <div
            key={img}
            className={styles.imageGalleryThumbnailWrapper}
            onClick={() => setSelectedImage(img)}
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
