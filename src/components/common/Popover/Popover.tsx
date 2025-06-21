import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import styles from './popover.module.scss';
import clsx from 'clsx';

type Position = 'top' | 'bottom' | 'left' | 'right';

const GAP = 12;

type PopoverProps = {
  targetRef: React.RefObject<HTMLElement>;
  open: boolean;
  onClose?: () => void;
  position?: Position;
  dismissible?: boolean;
  appendTo?: HTMLElement | null;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  autoWidth?: boolean;
  children: React.ReactNode;
};

export function Popover({
  targetRef,
  open,
  onClose,
  position = 'bottom',
  dismissible = true,
  appendTo = typeof document !== 'undefined' ? document.body : null,
  ariaLabel,
  ariaLabelledBy,
  autoWidth,
  children,
}: PopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({
    opacity: 0,
  });
  const selfClick = useRef(false);

  useEffect(() => {
    if (!open || !targetRef.current || !popoverRef.current) return;

    const updatePosition = () => {
      const targetRect = targetRef.current!.getBoundingClientRect();
      const popoverRect = popoverRef.current!.getBoundingClientRect();

      let top = 0;
      let left = 0;

      switch (position) {
        case 'top':
          top = targetRect.top - popoverRect.height - GAP;
          left = targetRect.left + targetRect.width / 2 - popoverRect.width / 2;
          if (top < 0) {
            top = targetRect.bottom + GAP;
          }
          break;
        case 'bottom':
          top = targetRect.bottom + GAP;
          left = targetRect.left + targetRect.width / 2 - popoverRect.width / 2;
          if (top + popoverRect.height > window.innerHeight) {
            top = targetRect.top - popoverRect.height - GAP;
          }
          break;
        case 'left':
          top = targetRect.top + targetRect.height / 2 - popoverRect.height / 2;
          left = targetRect.left - popoverRect.width - GAP;
          if (left < 0) {
            left = targetRect.right + GAP;
          }
          break;
        case 'right':
          top = targetRect.top + targetRect.height / 2 - popoverRect.height / 2;
          left = targetRect.right + GAP;
          if (left + popoverRect.width > window.innerWidth) {
            left = targetRect.left - popoverRect.width - GAP;
          }
          break;
      }

      top = Math.max(0, Math.min(top, window.innerHeight - popoverRect.height));
      left = Math.max(0, Math.min(left, window.innerWidth - popoverRect.width));

      setStyle({
        position: 'absolute',
        top: top + window.scrollY,
        left: left + window.scrollX,
        opacity: 1,
        transform: 'scale(1)',
        transition: 'opacity 150ms ease, transform 150ms ease',
        zIndex: 9999,
      });
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [open, position, targetRef]);

  useEffect(() => {
    if (!open || !dismissible) return;

    const onDocumentClick = (event: MouseEvent) => {
      if (
        !popoverRef.current ||
        !targetRef.current ||
        popoverRef.current.contains(event.target as Node) ||
        targetRef.current.contains(event.target as Node) ||
        selfClick.current
      ) {
        selfClick.current = false;
        return;
      }

      onClose?.();
    };

    const onPopoverClick = () => {
      selfClick.current = true;
    };

    document.addEventListener('mousedown', onDocumentClick);
    popoverRef.current?.addEventListener('mousedown', onPopoverClick);

    return () => {
      document.removeEventListener('mousedown', onDocumentClick);
      popoverRef.current?.removeEventListener('mousedown', onPopoverClick);
    };
  }, [open, dismissible, onClose, targetRef]);

  useEffect(() => {
    if (!open) return;
    const onScroll = () => onClose?.();
    window.addEventListener('scroll', onScroll, true);
    return () => window.removeEventListener('scroll', onScroll, true);
  }, [open, onClose]);

  if (!open || !appendTo) return null;

  return ReactDOM.createPortal(
    <div
      ref={popoverRef}
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      style={style}
      className={clsx(autoWidth && styles.autoWidth, styles.popover)}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </div>,
    appendTo
  );
}
