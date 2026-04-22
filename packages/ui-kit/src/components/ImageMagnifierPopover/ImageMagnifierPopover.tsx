import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styles from './image-magnifier-popover.module.scss';
import Popover from '../Popover/Popover';
import Image, { resolveImageBaseUrl } from '../Image';
import useDeviceInfo from '../../hooks/useDeviceInfo.ts';

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

  const { isTouchScreen: isTouch } = useDeviceInfo();
  const canHover = !isTouch;

  const [isHovering, setIsHovering] = useState(false);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [naturalSize, setNaturalSize] = useState({ width: 0, height: 0 });
  const [imageReady, setImageReady] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

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
    const updateSize = () => {
      if (!containerRef.current) return;
      setContainerSize({
        width: containerRef.current.clientWidth,
        height: containerRef.current.clientHeight,
      });
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Load natural image dimensions
  useEffect(() => {
    if (!resolvedSrc) return;

    setImageReady(false);
    const img = new window.Image();

    img.onload = () => {
      setNaturalSize({
        width: img.naturalWidth || 1,
        height: img.naturalHeight || 1,
      });
      setImageReady(true);
    };

    img.onerror = () => {
      setIsHovering(false);
      setImageReady(false);
    };

    img.src = resolvedSrc;
  }, [resolvedSrc]);

  // Rendered image box inside container (object-fit: contain)
  const imageBox = useMemo(() => {
    const cw = containerSize.width;
    const ch = containerSize.height;
    const iw = naturalSize.width;
    const ih = naturalSize.height;

    if (!cw || !ch) return { x: 0, y: 0, w: 0, h: 0 };
    if (!iw || !ih) return { x: 0, y: 0, w: cw, h: ch };

    const containerAR = cw / ch;
    const imageAR = iw / ih;

    if (containerAR > imageAR) {
      // image fills height
      const h = ch;
      const w = h * imageAR;
      const x = (cw - w) / 2;
      return { x, y: 0, w, h };
    }

    // image fills width
    const w = cw;
    const h = w / imageAR;
    const y = (ch - h) / 2;
    return { x: 0, y, w, h };
  }, [containerSize, naturalSize]);

  const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(value, max));

  const setLensToCenter = useCallback(() => {
    const minX = imageBox.x + lensSize / 2;
    const maxX = imageBox.x + imageBox.w - lensSize / 2;
    const minY = imageBox.y + lensSize / 2;
    const maxY = imageBox.y + imageBox.h - lensSize / 2;

    const centerX = imageBox.x + imageBox.w / 2;
    const centerY = imageBox.y + imageBox.h / 2;

    setMousePos({
      x: clamp(centerX, minX, maxX),
      y: clamp(centerY, minY, maxY),
    });
  }, [imageBox, lensSize]);

  const handleMouseEnter = useCallback(() => {
    if (!canHover) return;

    setIsHovering(true);

    // Refresh size when user hovers (helps if layout changed)
    if (containerRef.current) {
      setContainerSize({
        width: containerRef.current.clientWidth,
        height: containerRef.current.clientHeight,
      });
    }

    // Initialize lens to center so popover doesn't start "blank"
    if (imageBox.w > 0 && imageBox.h > 0) {
      setLensToCenter();
    }
  }, [canHover, imageBox.w, imageBox.h, setLensToCenter]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!canHover) return;

      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const rawX = e.clientX - rect.left;
      const rawY = e.clientY - rect.top;

      const minX = imageBox.x + lensSize / 2;
      const maxX = imageBox.x + imageBox.w - lensSize / 2;
      const minY = imageBox.y + lensSize / 2;
      const maxY = imageBox.y + imageBox.h - lensSize / 2;

      setMousePos({
        x: clamp(rawX, minX, maxX),
        y: clamp(rawY, minY, maxY),
      });
    },
    [canHover, imageBox, lensSize]
  );

  const lensStyle = useMemo(
    () => ({
      width: lensSize,
      height: lensSize,
      left: mousePos.x - lensSize / 2,
      top: mousePos.y - lensSize / 2,
    }),
    [lensSize, mousePos]
  );

  const scale = popoverSize / lensSize;

  const magnifiedImageStyle = useMemo(() => {
    // Mouse position within the rendered image box (relative to image top-left)
    const imgX = mousePos.x - imageBox.x;
    const imgY = mousePos.y - imageBox.y;

    // Offset the full scaled image so the focused area is centred in the popover.
    // We use top/left (not transform) so it cooperates with position:absolute in CSS.
    return {
      position: 'absolute' as const,
      width: imageBox.w * scale,
      height: imageBox.h * scale,
      top: -(imgY * scale - popoverSize / 2),
      left: -(imgX * scale - popoverSize / 2),
      userSelect: 'none' as const,
      pointerEvents: 'none' as const,
    } satisfies React.CSSProperties;
  }, [mousePos, imageBox, scale, popoverSize]);

  const showPopover = canHover && isHovering && imageReady && imageBox.w > 0 && imageBox.h > 0;

  return (
    <div className={styles.imageMagnifier}>
      <div
        className={styles.imageMagnifierContainer}
        ref={containerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setIsHovering(false)}
        onMouseMove={handleMouseMove}
      >
        <Image
          src={resolvedSrc}
          alt={alt}
          className={styles.imageMagnifierImage}
          objectFit="contain"
          fullWidth
          fullHeight
          isDraggable={false}
        />

        {showPopover && <div className={styles.imageMagnifierLens} style={lensStyle} />}
      </div>

      {showPopover && (
        <Popover open targetRef={containerRef} position="right" width="auto" size="small">
          <div
            className={styles.imageMagnifierPopover}
            style={{ width: popoverSize, height: popoverSize }}
          >
            <img src={resolvedSrc} alt={alt} style={magnifiedImageStyle} draggable={false} />
          </div>
        </Popover>
      )}
    </div>
  );
};

export default ImageMagnifierPopover;
