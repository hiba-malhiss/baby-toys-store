import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import clsx from 'clsx';
import styles from './drawer.module.scss';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { Button } from '../Button/Button';

export type DrawerPosition = 'left' | 'right' | 'top' | 'bottom' | 'full';

interface DrawerProps {
  visible: boolean;
  onClose: () => void;
  position?: DrawerPosition;
  children?: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  closable?: boolean;
  closeOnEscape?: boolean;
  dismissible?: boolean;
  blockScroll?: boolean;
  appendTo?: HTMLElement;
}

const Drawer: React.FC<DrawerProps> = ({
  visible,
  onClose,
  position = 'left',
  children,
  header,
  footer,
  className,
  closable = true,
  closeOnEscape = true,
  dismissible = true,
  blockScroll = false,
  appendTo = document.body,
}) => {
  const drawerRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && closeOnEscape && visible) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [closeOnEscape, visible]);

  useEffect(() => {
    if (blockScroll && visible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [blockScroll, visible]);

  const drawer = (
    <>
      {visible && (
        <div
          className={styles.drawerOverlay}
          ref={maskRef}
          onClick={dismissible ? onClose : undefined}
        />
      )}

      <div
        className={clsx(
          styles.drawer,
          styles[`drawer--${position}`],
          { [styles.drawerVisible]: visible },
          className
        )}
        ref={drawerRef}
        role="complementary"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.drawerHeader}>
          {header && <div className={styles.drawerTitle}>{header}</div>}
          {closable && (
            <Button
              appearance="link"
              color="secondary"
              onClick={onClose}
              leftIcon={faTimes}
              className={styles.drawerCloseBtn}
            />
          )}
        </div>
        <div className={styles.drawerContent}>{children}</div>
        {footer && <div className={styles.drawerFooter}>{footer}</div>}
      </div>
    </>
  );

  return ReactDOM.createPortal(drawer, appendTo);
};

export default Drawer;
