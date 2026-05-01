import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { Image } from '../Image';
import { Lightbox } from '../ImageLightboxGallery/ImageLightboxGallery';
import styles from './ProductImageGallery.module.scss';

export interface ProductImageGalleryProps {
  /** Array of image URLs */
  images: string[];
  /** Product name for alt text */
  productName?: string;
  /** Currently selected image URL */
  selectedImage?: string;
  /** Callback when image is selected */
  onSelectImage?: (image: string) => void;
  /** Extra class name */
  className?: string;
  /** Show thumbnail strip (default: true) */
  showThumbnails?: boolean;
  /** Show navigation arrows (default: true) */
  showArrows?: boolean;
  /** Show dot indicators (default: true) */
  showDots?: boolean;
  /** Show zoom button (default: true) */
  showZoomButton?: boolean;
}

const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({
  images,
  productName = '',
  selectedImage,
  onSelectImage,
  className,
  showThumbnails = true,
  showArrows = true,
  showDots = true,
  showZoomButton = true,
}) => {
  // Deduplicate + filter empty
  const uniqueImages = Array.from(new Set(images.filter(Boolean)));

  const [activeIndex, setActiveIndex] = useState(() => {
    if (selectedImage) {
      const idx = uniqueImages.indexOf(selectedImage);
      return idx >= 0 ? idx : 0;
    }
    return 0;
  });

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Touch / swipe state
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const isDragging = useRef(false);

  // Sync activeIndex when selectedImage prop changes (from variant change)
  useEffect(() => {
    if (selectedImage) {
      const idx = uniqueImages.indexOf(selectedImage);
      if (idx >= 0 && idx !== activeIndex) {
        setActiveIndex(idx);
        setImageLoaded(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedImage]);

  const goTo = useCallback(
    (index: number) => {
      const clamped = (index + uniqueImages.length) % uniqueImages.length;
      setActiveIndex(clamped);
      setImageLoaded(false);
      onSelectImage?.(uniqueImages[clamped]);
    },
    [uniqueImages, onSelectImage]
  );

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  // Touch handlers for main image (swipe)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    isDragging.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const dx = Math.abs(e.touches[0].clientX - touchStartX.current);
    const dy = Math.abs(e.touches[0].clientY - touchStartY.current);
    if (dx > dy && dx > 10) isDragging.current = true;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (isDragging.current && Math.abs(dx) > 40) {
      if (dx < 0) goTo(activeIndex + 1);
      else goTo(activeIndex - 1);
    }
    touchStartX.current = null;
    touchStartY.current = null;
    isDragging.current = false;
  };

  if (!uniqueImages.length) return null;

  return (
    <>
      <div className={`${styles.gallery} ${className ?? ''}`}>
        {/* Thumbnail Strip */}
        {showThumbnails && uniqueImages.length > 1 && (
          <div className={styles.galleryThumbs}>
            {uniqueImages.map((img, idx) => (
              <button
                key={idx}
                className={`${styles.galleryThumb} ${idx === activeIndex ? styles.galleryThumbActive : ''}`}
                onClick={() => goTo(idx)}
                aria-label={`View image ${idx + 1}`}
              >
                <Image
                  src={img}
                  alt={`${productName} thumbnail ${idx + 1}`}
                  objectFit="cover"
                  className={styles.galleryThumbImg}
                  isDraggable={false}
                />
              </button>
            ))}
          </div>
        )}

        {/* Main Image */}
        <div
          className={styles.galleryMain}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className={`${styles.galleryMainInner} ${imageLoaded ? styles.galleryMainLoaded : ''}`}
          >
            <Image
              key={uniqueImages[activeIndex]}
              src={uniqueImages[activeIndex]}
              alt={productName}
              objectFit="contain"
              className={styles.galleryMainImg}
              onLoad={() => setImageLoaded(true)}
              isDraggable={false}
              fullWidth
              fullHeight
            />
          </div>

          {/* Zoom hint overlay */}
          {showZoomButton && (
            <button
              className={styles.galleryZoomBtn}
              onClick={() => openLightbox(activeIndex)}
              aria-label="Open full screen"
            >
              <ZoomIn size={18} />
            </button>
          )}

          {/* Prev / Next arrows (desktop) */}
          {showArrows && uniqueImages.length > 1 && (
            <>
              <button
                className={`${styles.galleryArrow} ${styles.galleryArrowPrev}`}
                onClick={() => goTo(activeIndex - 1)}
                aria-label="Previous image"
              >
                <ChevronLeft size={22} />
              </button>
              <button
                className={`${styles.galleryArrow} ${styles.galleryArrowNext}`}
                onClick={() => goTo(activeIndex + 1)}
                aria-label="Next image"
              >
                <ChevronRight size={22} />
              </button>
            </>
          )}

          {/* Dot indicators (mobile) */}
          {showDots && uniqueImages.length > 1 && (
            <div className={styles.galleryDots}>
              {uniqueImages.map((_, idx) => (
                <button
                  key={idx}
                  className={`${styles.galleryDot} ${idx === activeIndex ? styles.galleryDotActive : ''}`}
                  onClick={() => goTo(idx)}
                  aria-label={`Go to image ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <Lightbox
          images={uniqueImages}
          initialIndex={lightboxIndex}
          altPrefix={productName || 'Product image'}
          onClose={closeLightbox}
        />
      )}
    </>
  );
};

export default ProductImageGallery;
