import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import styles from './popover.module.scss';
import clsx from 'clsx';

type Position = 'top' | 'bottom' | 'left' | 'right';

type PopoverProps = {
  targetRef: React.RefObject<HTMLElement>;
  open: boolean;
  onClose?: () => void;
  position?: Position;
  dismissible?: boolean;
  appendTo?: HTMLElement | null;
  width?: string;
  children: React.ReactNode;
  gap: number;
};

export function Popover({
  targetRef,
  open,
  onClose,
  position = 'bottom',
  dismissible = true,
  appendTo = typeof document !== 'undefined' ? document.body : null,
  width,
  children,
  gap = 12,
}: PopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({});
  const selfClick = useRef(false);

  useEffect(() => {
    if (!open || !targetRef.current || !popoverRef.current) return;

    const updatePosition = () => {
      if (!popoverRef.current || !targetRef.current) return;

      const targetRect = targetRef.current.getBoundingClientRect();

      // Force popover width for stable measurement
      const targetWidth = targetRect.width;
      popoverRef.current.style.width = width || `${targetWidth}px`;

      const popoverRect = popoverRef.current.getBoundingClientRect();

      let top = 0;
      let left = 0;

      switch (position) {
        case 'top':
          top = targetRect.top - popoverRect.height - gap;
          left = targetRect.left + targetWidth / 2 - popoverRect.width / 2;
          if (top < 0) top = targetRect.bottom + gap;
          break;
        case 'bottom':
          top = targetRect.bottom + gap;
          left = targetRect.left + targetWidth / 2 - popoverRect.width / 2;
          if (top + popoverRect.height > window.innerHeight)
            top = targetRect.top - popoverRect.height - gap;
          break;
        case 'left':
          top = targetRect.top + targetRect.height / 2 - popoverRect.height / 2;
          left = targetRect.left - popoverRect.width - gap;
          if (left < 0) left = targetRect.right + gap;
          break;
        case 'right':
          top = targetRect.top + targetRect.height / 2 - popoverRect.height / 2;
          left = targetRect.right + gap;
          if (left + popoverRect.width > window.innerWidth)
            left = targetRect.left - popoverRect.width - gap;
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
        width: width || `${targetWidth}px`,
      });
    };

    requestAnimationFrame(updatePosition);

    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [open, position, targetRef, width, gap]);

  // Close popover when click outside
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

  if (!open || !appendTo) return null;

  return ReactDOM.createPortal(
    <div
      ref={popoverRef}
      role="dialog"
      aria-modal="true"
      aria-label="popover"
      aria-labelledby="popover"
      style={style}
      className={clsx(styles.popover)}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </div>,
    appendTo
  );
}
