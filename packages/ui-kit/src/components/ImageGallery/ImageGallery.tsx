import React, { useState } from 'react';
import Carousel from '../Carousel/Carousel';
import ImageMagnifierPopover from '../ImageMagnifierPopover/ImageMagnifierPopover';
import styles from './image-gallery.module.scss';
import clsx from 'clsx';

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
          { breakpoint: '900', numVisible: 3 },
          { breakpoint: '600', numVisible: 2 },
          { breakpoint: '400', numVisible: 1 },
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
