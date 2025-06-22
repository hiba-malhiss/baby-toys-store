import React, { useRef, useState, useEffect } from 'react';
import styles from './image-magnifier-popover.module.scss';
import { Popover } from '../Popover/Popover';

type Props = {
  src: string;
  alt: string;
  lensSize?: number;
  popoverSize?: number;
};

const ImageMagnifierPopover: React.FC<Props> = ({
  src,
  alt,
  lensSize = 100,
  popoverSize = 400,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState({ width: 1, height: 1 }); // avoid divide by zero

  useEffect(() => {
    if (containerRef.current) {
      const { clientWidth, clientHeight } = containerRef.current;
      setDimensions({ width: clientWidth, height: clientHeight });
    }
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    // get  mouse position relative to image
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // make sure mouse position is at the center of the lens
    const clampedX = Math.max(Math.min(x, dimensions.width - lensSize / 2), lensSize / 2);
    const clampedY = Math.max(Math.min(y, dimensions.height - lensSize / 2), lensSize / 2);

    setMousePos({ x: clampedX, y: clampedY });
  };

  const lensStyle = {
    width: lensSize,
    height: lensSize,
    left: mousePos.x - lensSize / 2,
    top: mousePos.y - lensSize / 2,
  };

  const scale = popoverSize / lensSize;

  const imageStyle = {
    width: dimensions.width * scale,
    height: dimensions.height * scale,
    transform: `translate(-${mousePos.x * scale - popoverSize / 2}px, -${mousePos.y * scale - popoverSize / 2}px)`,
  };

  return (
    <div className={styles.imageMagnifier}>
      <div
        className={styles.imageMagnifierContainer}
        ref={containerRef}
        onMouseEnter={() => {
          setIsHovering(true);
          const { clientWidth, clientHeight } = containerRef.current!;
          setDimensions({ width: clientWidth, height: clientHeight });
        }}
        onMouseLeave={() => setIsHovering(false)}
        onMouseMove={handleMouseMove}
      >
        <img src={src} alt={alt} className={styles.imageMagnifierImage} />
        {isHovering && <div className={styles.imageMagnifierLens} style={lensStyle} />}
      </div>

      {isHovering && (
        <Popover open targetRef={containerRef} position="right" autoWidth>
          <div
            className={styles.imageMagnifierPopover}
            style={{ width: popoverSize, height: popoverSize, overflow: 'hidden' }}
          >
            <img src={src} alt={alt} style={imageStyle} />
          </div>
        </Popover>
      )}
    </div>
  );
};

export default ImageMagnifierPopover;
