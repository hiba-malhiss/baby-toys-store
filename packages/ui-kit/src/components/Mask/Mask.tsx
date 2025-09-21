import React, { useEffect } from 'react';
import styles from './mask.module.scss';
import { BouncingDotsLoader } from '../index';

interface MaskProps {
  visible: boolean;
  onClick?: () => void;
  opacity?: number;
  zIndex?: number;
}

const Mask: React.FC<MaskProps> = ({ visible, onClick, opacity = 0.5, zIndex = 50 }) => {
  useEffect(() => {
    if (visible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div className={styles.mask} style={{ opacity, zIndex }} onClick={onClick}>
      <BouncingDotsLoader />
    </div>
  );
};

export default Mask;
