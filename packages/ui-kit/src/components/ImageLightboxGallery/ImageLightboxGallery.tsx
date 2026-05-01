import React, { useState, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Image } from '../Image';
import styles from './image-lightbox-gallery.module.scss';

export interface ImageLightboxGalleryProps {
  /** Array of image URLs */
  images: string[];
  /** Alt text prefix — produces "Product image 1", "Product image 2" etc. */
  altPrefix?: string;
  /** Extra class applied to the thumbnail grid */
  className?: string;
}

export interface LightboxProps {
  images: string[];
  initialIndex: number;
  altPrefix: string;
  onClose: () => void;
}

export const Lightbox: React.FC<LightboxProps> = ({ images, initialIndex, altPrefix, onClose }) => {
  const [index, setIndex] = useState(initialIndex);
  const total = images.length;

  const prev = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setIndex((i) => (i - 1 + total) % total);
    },
    [total]
  );

  const next = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setIndex((i) => (i + 1) % total);
    },
    [total]
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') setIndex((i) => (i - 1 + total) % total);
      if (e.key === 'ArrowRight') setIndex((i) => (i + 1) % total);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [total, onClose]);

  return createPortal(
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true">
      {/* Counter */}
      {total > 1 && (
        <div className={styles.counter}>
          {index + 1} / {total}
        </div>
      )}

      {/* Close */}
      <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
        <X size={18} strokeWidth={2} />
      </button>

      {/* Main image — stops propagation so clicking image doesn't close */}
      <div className={styles.imageWrap} onClick={(e) => e.stopPropagation()}>
        <Image
          key={index}
          src={images[index]}
          alt={`${altPrefix} ${index + 1}`}
          naturalSize
          className={styles.lightboxImg}
          isDraggable={false}
        />
      </div>

      {/* Prev / Next */}
      {total > 1 && (
        <>
          <button
            className={`${styles.navBtn} ${styles.navPrev}`}
            onClick={prev}
            aria-label="Previous image"
          >
            <ChevronLeft size={24} strokeWidth={2} />
          </button>
          <button
            className={`${styles.navBtn} ${styles.navNext}`}
            onClick={next}
            aria-label="Next image"
          >
            <ChevronRight size={24} strokeWidth={2} />
          </button>

          {/* Dot strip */}
          <div className={styles.dots}>
            {images.map((_, i) => (
              <button
                key={i}
                aria-label={`Go to ${altPrefix} ${i + 1}`}
                aria-current={i === index}
                className={`${styles.dot} ${i === index ? styles.dotActive : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setIndex(i);
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>,
    document.body
  );
};

// ─── ImageLightboxGallery ─────────────────────────────────────────────────────

const ImageLightboxGallery: React.FC<ImageLightboxGalleryProps> = ({
  images,
  altPrefix = 'Image',
  className,
}) => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (!images || images.length === 0) return null;

  return (
    <>
      <div className={`${styles.grid} ${className ?? ''}`}>
        {images.map((src, idx) => (
          <button
            key={`${src}-${idx}`}
            type="button"
            className={styles.thumbBtn}
            onClick={() => setLightboxIndex(idx)}
            aria-label={`View ${altPrefix.toLowerCase()} ${idx + 1}`}
          >
            <Image
              src={src}
              alt={`${altPrefix} ${idx + 1}`}
              objectFit="cover"
              className={styles.thumb}
              isDraggable={false}
            />
            <span className={styles.zoomHint} aria-hidden="true" />
          </button>
        ))}
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          images={images}
          initialIndex={lightboxIndex}
          altPrefix={altPrefix}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  );
};

export default ImageLightboxGallery;
