import React, { useState, useMemo } from 'react';
import styles from './image.module.scss';
import clsx from 'clsx';

export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  alt: string;
  fallbackSrc?: string;
  showLoading?: boolean;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  disableBaseUrl?: boolean;
}

export const IMAGE_BASE_URL = 'http://localhost:8080';

export const Image: React.FC<ImageProps> = ({
  src,
  alt,
  fallbackSrc,
  showLoading = true,
  objectFit = 'cover',
  disableBaseUrl = false,
  onError,
  ...rest
}) => {
  const [isLoading, setIsLoading] = useState(!!src);
  const [hasError, setHasError] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | undefined>(src);

  // Process the image source URL
  const processedSrc = useMemo(() => {
    if (!imageSrc) return undefined;
    if (
      disableBaseUrl ||
      !imageSrc ||
      imageSrc.startsWith('http') ||
      imageSrc.startsWith('data:') ||
      imageSrc.startsWith('file:') ||
      imageSrc.startsWith('blob:')
    ) {
      return imageSrc;
    }
    return `${IMAGE_BASE_URL}${imageSrc.startsWith('/') ? '' : '/'}${imageSrc}`;
  }, [imageSrc, disableBaseUrl]);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setHasError(true);
    if (fallbackSrc && imageSrc !== fallbackSrc) {
      setImageSrc(fallbackSrc);
      setIsLoading(true);
      return;
    }
    onError?.(e);
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  if (!processedSrc) {
    return (
      <div className={clsx(styles.imageContainer, styles.placeholder)}>
        <div className={styles.placeholderIcon} />
      </div>
    );
  }

  return (
    <div className={clsx(styles.imageContainer)}>
      {isLoading && showLoading && <div className={styles.loadingSkeleton} />}
      <img
        {...rest}
        src={processedSrc}
        alt={alt}
        className={clsx(styles.image, {
          [styles.isLoading]: isLoading,
          [styles[`object-${objectFit}`]]: objectFit,
        })}
        onError={handleError}
        onLoad={handleLoad}
        style={{
          ...rest.style,
          objectFit,
        }}
      />
      {hasError && !isLoading && (
        <div className={styles.errorContainer}>
          <div className={styles.errorIcon} />
        </div>
      )}
    </div>
  );
};

export default Image;
