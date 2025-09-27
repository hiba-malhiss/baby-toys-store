import React, { useState, useMemo, useEffect } from 'react';
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
  objectFit = 'contain',
  disableBaseUrl = false,
  onError,
  ...rest
}) => {
  const [isLoading, setIsLoading] = useState(!!src);
  const [hasError, setHasError] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | undefined>(src);

  // Sync internal src state when prop changes
  useEffect(() => {
    setImageSrc(src);
    setIsLoading(!!src);
    setHasError(false);
  }, [src]);

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

  const {
    width,
    height,
    style: imgStyle,
    className,
    ...imgRest
  } = rest as {
    width?: number | string;
    height?: number | string;
    style?: React.CSSProperties;
    className?: string;
  } & React.ImgHTMLAttributes<HTMLImageElement>;

  const containerStyle: React.CSSProperties | undefined =
    width || height ? { width, height } : undefined;

  if (!processedSrc) {
    return (
      <div
        className={clsx(styles.imageContainer, styles.placeholder, className)}
        style={containerStyle}
      >
        <div className={styles.placeholderIcon} />
      </div>
    );
  }

  return (
    <div className={clsx(styles.imageContainer, className)} style={containerStyle}>
      {isLoading && showLoading && <div className={styles.loadingSkeleton} />}
      <img
        {...imgRest}
        src={processedSrc}
        alt={alt}
        className={clsx(styles.image, {
          [styles.isLoading]: isLoading,
          [styles[`object-${objectFit}`]]: objectFit,
        })}
        onError={handleError}
        onLoad={handleLoad}
        style={{
          ...imgStyle,
          objectFit,
          width: width ? '100%' : imgStyle?.width,
          height: height ? '100%' : imgStyle?.height,
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
