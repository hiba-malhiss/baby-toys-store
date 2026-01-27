import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import styles from './dialog.module.scss';
import Button from '../Button/Button.tsx';

const Dialog = forwardRef((props: any, ref) => {
  const {
    header,
    footer,
    modal = false,
    closeOnEscape = true,
    dismissibleMask,
    closable = true,
    showHeader = true,
    blockScroll = false,
    autoZIndex = true,
    baseZIndex = 0,
    focusOnShow = true,
    maximizable = false,
    transitionOptions = '150ms cubic-bezier(0, 0, 0.2, 1)',
    visible: propsVisible,
    role = 'dialog',
    onShow,
    onHide,
    onVisibleChange,
    onMaximize,
    children,
    appendTo = document.body,
    id: propsId,
  } = props;

  const [visible, setVisible] = useState(propsVisible || false);
  const [maskVisible, setMaskVisible] = useState(false);
  const [maximized, setMaximized] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const id = useMemo(
    () => propsId || `dialog-${Math.random().toString(36).substr(2, 9)}`,
    [propsId]
  );

  useEffect(() => {
    if (propsVisible !== undefined && propsVisible !== visible) {
      setVisible(propsVisible);
      if (propsVisible && !maskVisible) {
        setMaskVisible(true);
      }
    }
  }, [propsVisible, visible, maskVisible]);

  const close = useCallback(
    (event?: React.MouseEvent | KeyboardEvent) => {
      event?.preventDefault?.();
      setVisible(false);
      onVisibleChange?.(false);
    },
    [onVisibleChange]
  );

  const maximize = useCallback(() => {
    const newMaximized = !maximized;
    setMaximized(newMaximized);

    if (!modal && !blockScroll) {
      document.body.style.overflow = newMaximized ? 'hidden' : '';
    }

    onMaximize?.({ maximized: newMaximized });
  }, [maximized, modal, blockScroll, onMaximize]);

  const focus = useCallback(() => {
    if (!focusOnShow || !containerRef.current) return;

    const focusableElements = containerRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    focusableElements[0]?.focus?.();
  }, [focusOnShow]);

  useEffect(() => {
    if (!closeOnEscape || !closable || !visible) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close(event);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [closeOnEscape, closable, visible, close]);

  useEffect(() => {
    if (!dismissibleMask || !closable || !visible || !wrapperRef.current) return;

    const handleClick = (event: MouseEvent) => {
      if (wrapperRef.current && wrapperRef.current === event.target) {
        close(event as any);
      }
    };

    wrapperRef.current.addEventListener('mousedown', handleClick);
    return () => {
      wrapperRef.current?.removeEventListener('mousedown', handleClick);
    };
  }, [dismissibleMask, closable, visible, close]);

  useEffect(() => {
    if (!visible) return;

    if (modal || blockScroll) {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [visible, modal, blockScroll]);

  useEffect(() => {
    if (!autoZIndex || !containerRef.current || !visible) return;

    const zIndex = baseZIndex + 1000;
    containerRef.current.style.zIndex = `${zIndex}`;
    if (wrapperRef.current) {
      wrapperRef.current.style.zIndex = `${zIndex - 1}`;
    }
  }, [autoZIndex, baseZIndex, visible]);

  useEffect(() => {
    if (visible) {
      focus();
      onShow?.();
    } else if (maskVisible) {
      onHide?.();
      setMaskVisible(false);
    }
  }, [visible]);

  useImperativeHandle(ref, () => ({
    close,
    maximize,
  }));

  if (!visible && !maskVisible) return null;

  return createPortal(
    <div
      ref={wrapperRef}
      className={styles.dialogMask + (visible ? ` ${styles.dialogMaskVisible}` : '')}
    >
      <div
        ref={containerRef}
        className={`${styles.dialogRoot} ${maximized ? styles.dialogRootMaximized : ''}`}
        role={role}
        aria-modal="true"
        id={id}
        style={{ transition: transitionOptions }}
      >
        {showHeader && (
          <div className={styles.dialogHeader}>
            <span className={styles.dialogTitle}>{header}</span>
            <div className={styles.dialogHeaderActions}>
              {maximizable && (
                <Button
                  onClick={maximize}
                  appearance="link"
                  leftIconComp={
                    maximized ? Minimize2 : Maximize2
                  }
                  size="medium"
                  withoutPadding
                />
              )}
              {closable && (
                <Button
                  withoutPadding
                  onClick={close}
                  leftIconComp={X}
                  appearance="link"
                  size="large"
                />
              )}
            </div>
          </div>
        )}
        <div className={styles.dialogContent}>{children}</div>
        {footer && <div className={styles.dialogFooter}>{footer}</div>}
      </div>
    </div>,
    appendTo
  );
});

export default Dialog;
