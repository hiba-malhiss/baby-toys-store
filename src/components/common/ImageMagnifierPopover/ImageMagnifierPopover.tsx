import React, { useRef, useState, useEffect } from 'react';
import styles from './image-magnifier-popover.module.scss';
import { Popover } from '../Popover/Popover';

type Props = {
  src: string;
  alt: string;
  zoom?: number;
  lensSize?: number;
  popoverSize?: number;
};

const ImageMagnifierPopover: React.FC<Props> = ({
  src,
  alt,
  zoom = 2,
  lensSize = 200,
  popoverSize = 400,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

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

  const popoverContentStyle = {
    width: popoverSize,
    height: popoverSize,
    backgroundImage: `url(${src})`,
    backgroundSize: `${dimensions.width * zoom}px ${dimensions.height * zoom}px`,
    backgroundPosition: `-${mousePos.x * zoom - popoverSize / 2}px -${mousePos.y * zoom - popoverSize / 2}px`,
    borderRadius: 4,
  };

  return (
    <div className={styles.imageMagnifierPopover}>
      <div
        className={styles.imageMagnifierPopoverContainer}
        ref={containerRef}
        onMouseEnter={() => {
          setIsHovering(true);
          const { clientWidth, clientHeight } = containerRef.current!;
          setDimensions({ width: clientWidth, height: clientHeight });
        }}
        onMouseLeave={() => setIsHovering(false)}
        onMouseMove={handleMouseMove}
      >
        <img src={src} alt={alt} className={styles.imageMagnifierPopoverImage} />
        {isHovering && <div className={styles.imageMagnifierPopoverLens} style={lensStyle} />}
      </div>

      <Popover targetRef={containerRef} open={isHovering} position="right" autoWidth>
        <div style={popoverContentStyle} />
      </Popover>
    </div>
  );
};

export default ImageMagnifierPopover;
