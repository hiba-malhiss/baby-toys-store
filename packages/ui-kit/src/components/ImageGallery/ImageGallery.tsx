import React, { useState } from 'react';
import Carousel from '../Carousel/Carousel';
import ImageMagnifierPopover from '../ImageMagnifierPopover/ImageMagnifierPopover';
import styles from './image-gallery.module.scss';
import clsx from 'clsx';
import { BREAKPOINTS } from '../../constants/breakpoints';

type ImageGalleryProps = {
  images: string[];
  productName?: string;
};

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, productName }) => {
  const [selectedImage, setSelectedImage] = useState(images[0]);

  return (
    <div className={styles.imageGallery}>
      <div className={styles.imageGalleryMainImage}>
        <ImageMagnifierPopover src={selectedImage} alt={productName || ''} />
      </div>
      <Carousel
        navigationStyle="side"
        items={images}
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
            <img
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
