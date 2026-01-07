import React, { useRef, useState, useEffect, useMemo } from 'react';
import styles from './image-magnifier-popover.module.scss';
import Popover from '../Popover/Popover';
import { resolveImageBaseUrl } from '../Image';

type Props = {
  src: string;
  alt: string;
  lensSize?: number;
  popoverSize?: number;
  disableBaseUrl?: boolean;
};

const ImageMagnifierPopover: React.FC<Props> = ({
  src,
  alt,
  lensSize = 100,
  popoverSize = 400,
  disableBaseUrl = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState({ width: 1, height: 1 }); // container size
  const [natural, setNatural] = useState({ width: 1, height: 1 }); // image intrinsic size
  const [imageReady, setImageReady] = useState(false);

  // Resolve src similarly to Image component
  const resolvedSrc = useMemo(() => {
    if (!src) return '';
    if (
      disableBaseUrl ||
      src.startsWith('http') ||
      src.startsWith('data:') ||
      src.startsWith('file:') ||
      src.startsWith('blob:')
    ) {
      return src;
    }
    const baseUrl = resolveImageBaseUrl();

    return `${baseUrl}${src.startsWith('/') ? '' : '/'}${src}`;
  }, [src, disableBaseUrl]);

  useEffect(() => {
    if (containerRef.current) {
      const { clientWidth, clientHeight } = containerRef.current;
      setDimensions({ width: clientWidth, height: clientHeight });
    }
  }, []);

  // Listen to window resize to recompute container
  useEffect(() => {
    const onResize = () => {
      if (!containerRef.current) return;
      const { clientWidth, clientHeight } = containerRef.current;
      setDimensions({ width: clientWidth, height: clientHeight });
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Load natural image dimensions
  useEffect(() => {
    if (!resolvedSrc) return;
    const img = new window.Image();
    img.onload = () => {
      setNatural({ width: img.naturalWidth || 1, height: img.naturalHeight || 1 });
      setImageReady(true);
    };
    img.onerror = () => {
      // stop magnifier if image can't load
      setIsHovering(false);
      setImageReady(false);
    };
    img.src = resolvedSrc;
  }, [resolvedSrc]);

  // Compute the rendered image box within the container for object-fit: contain
  const imageBox = useMemo(() => {
    const cw = dimensions.width;
    const ch = dimensions.height;
    const iw = natural.width;
    const ih = natural.height;
    if (!cw || !ch || !iw || !ih) return { x: 0, y: 0, w: cw, h: ch };
    const containerAR = cw / ch;
    const imageAR = iw / ih;
    if (containerAR > imageAR) {
      // image fills height
      const h = ch;
      const w = h * imageAR;
      const x = (cw - w) / 2;
      return { x, y: 0, w, h };
    } else {
      // image fills width
      const w = cw;
      const h = w / imageAR;
      const y = (ch - h) / 2;
      return { x: 0, y, w, h };
    }
  }, [dimensions, natural]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    // mouse position relative to container
    const rawX = e.clientX - rect.left;
    const rawY = e.clientY - rect.top;

    // Clamp lens center within the rendered image box
    const minX = imageBox.x + lensSize / 2;
    const maxX = imageBox.x + imageBox.w - lensSize / 2;
    const minY = imageBox.y + lensSize / 2;
    const maxY = imageBox.y + imageBox.h - lensSize / 2;
    const clampedX = Math.max(minX, Math.min(rawX, maxX));
    const clampedY = Math.max(minY, Math.min(rawY, maxY));

    setMousePos({ x: clampedX, y: clampedY });
  };

  const lensStyle = {
    width: lensSize,
    height: lensSize,
    left: mousePos.x - lensSize / 2,
    top: mousePos.y - lensSize / 2,
  };

  const scale = popoverSize / lensSize;

  // Mouse position within the rendered image box
  const imgX = mousePos.x - imageBox.x;
  const imgY = mousePos.y - imageBox.y;

  // Magnified image scales from the rendered image size (object-fit: contain)
  const imageStyle = {
    width: imageBox.w * scale,
    height: imageBox.h * scale,
    transform: `translate(-${imgX * scale - popoverSize / 2}px, -${imgY * scale - popoverSize / 2}px)`,
  } as React.CSSProperties;

  return (
    <div className={styles.imageMagnifier}>
      <div
        className={styles.imageMagnifierContainer}
        ref={containerRef}
        onMouseEnter={() => {
          setIsHovering(true);
          const { clientWidth, clientHeight } = containerRef.current!;
          setDimensions({ width: clientWidth, height: clientHeight });
          // Initialize lens to image center to avoid blank popover before first move
          const centerX = imageBox.x + Math.max(imageBox.w, 0) / 2;
          const centerY = imageBox.y + Math.max(imageBox.h, 0) / 2;
          const minX = imageBox.x + lensSize / 2;
          const maxX = imageBox.x + imageBox.w - lensSize / 2;
          const minY = imageBox.y + lensSize / 2;
          const maxY = imageBox.y + imageBox.h - lensSize / 2;
          const initX = Math.max(minX, Math.min(centerX, maxX));
          const initY = Math.max(minY, Math.min(centerY, maxY));
          setMousePos({ x: initX, y: initY });
        }}
        onMouseLeave={() => setIsHovering(false)}
        onMouseMove={handleMouseMove}
      >
        <img
          src={resolvedSrc}
          alt={alt}
          className={styles.imageMagnifierImage}
          style={{ objectFit: 'contain', width: '100%', height: '100%', display: 'block' }}
          draggable={false}
        />
        {isHovering && <div className={styles.imageMagnifierLens} style={lensStyle} />}
      </div>

      {isHovering && imageReady && imageBox.w > 0 && imageBox.h > 0 && (
        <Popover open targetRef={containerRef} position="right" width="auto">
          <div
            className={styles.imageMagnifierPopover}
            style={{ width: popoverSize, height: popoverSize, overflow: 'hidden' }}
          >
            <img
              src={resolvedSrc}
              alt={alt}
              style={{ ...imageStyle, display: 'block', userSelect: 'none', pointerEvents: 'none' }}
              draggable={false}
            />
          </div>
        </Popover>
      )}
    </div>
  );
};

export default ImageMagnifierPopover;
