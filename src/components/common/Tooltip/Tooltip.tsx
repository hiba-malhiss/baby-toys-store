import React, { useState, useRef, useEffect } from 'react';
import { Popover } from '../Popover/Popover.tsx';

type TooltipProps = {
  children: React.ReactElement;
  content: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  showDelay?: number;
  hideDelay?: number;
  gap?: number;
  dismissible?: boolean;
};

export const Tooltip = ({
  children,
  content,
  position = 'top',
  showDelay = 100,
  hideDelay = 180,
  gap = 8,
  dismissible = false,
}: TooltipProps) => {
  const targetRef = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const showTimeout = useRef<number>();
  const hideTimeout = useRef<number>();

  const clearTimers = () => {
    window.clearTimeout(showTimeout.current);
    window.clearTimeout(hideTimeout.current);
  };

  const handleShow = () => {
    clearTimers();
    showTimeout.current = window.setTimeout(() => setOpen(true), showDelay);
  };

  const handleHide = () => {
    clearTimers();
    hideTimeout.current = window.setTimeout(() => setOpen(false), hideDelay);
  };

  const child = React.cloneElement(children, {
    ref: (node: HTMLElement) => {
      targetRef.current = node;
      const { ref } = children as any;
      if (typeof ref === 'function') ref(node);
      else if (ref) ref.current = node;
    },
    onMouseEnter: handleShow,
    onMouseLeave: handleHide,
    onFocus: handleShow,
    onBlur: handleHide,
  });

  useEffect(() => clearTimers, []);

  return (
    <>
      {child}
      <Popover
        targetRef={targetRef}
        open={open}
        position={position}
        dismissible={dismissible}
        onClose={() => setOpen(false)}
        gap={gap}
        withArrow
        size="medium"
        appearance="dark"
      >
        {content}
      </Popover>
    </>
  );
};
