import React from 'react';
import { Image } from 'lucide-react';
import styles from './image-placeholder.module.scss';

interface ImagePlaceholderProps {
  width?: number;
  height?: number;
  className?: string;
}

const ImagePlaceholder: React.FC<ImagePlaceholderProps> = ({
  width = 16,
  height = 16,
  className,
}) => {
  return (
    <div className={`${styles.imagePlaceholder} ${className || ''}`}>
      <Image width={width} height={height} />
    </div>
  );
};

export default ImagePlaceholder;
