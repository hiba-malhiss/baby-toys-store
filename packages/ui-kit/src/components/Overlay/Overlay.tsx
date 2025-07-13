import React from 'react';
import styles from './overlay.module.scss';
import { BouncingDotsLoader } from '../index';

type OverlayProps = {
  visible: boolean;
  children?: React.ReactNode;
};

const Overlay: React.FC<OverlayProps> = ({ visible, children }) => {
  if (!visible) return null;

  return <div className={styles.overlay}>{children || <BouncingDotsLoader size="medium" />}</div>;
};

export default Overlay;
