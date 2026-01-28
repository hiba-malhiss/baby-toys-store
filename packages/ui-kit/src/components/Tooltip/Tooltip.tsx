import React, { useState, useRef, useEffect } from 'react';
import Popover from '../Popover/Popover';
import useDeviceInfo from "../../hooks/useDeviceInfo.ts";

type TooltipMode = 'hover' | 'manual';

type TooltipProps = {
  children: React.ReactElement;
  content: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  showDelay?: number;
  hideDelay?: number;
  dismissible?: boolean;
  open?: boolean; // only needed in manual mode
  mode?: TooltipMode;
};

const Tooltip = ({
  children,
  content,
  position = 'top',
  showDelay = 100,
  hideDelay = 180,
  dismissible = false,
  mode = 'hover',
  open: openProp,
}: TooltipProps) => {
  const { isTouchScreen: isTouch } = useDeviceInfo();
  const targetRef = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const showTimeout = useRef<number>();
  const hideTimeout = useRef<number>();

  const clearTimers = () => {
    window.clearTimeout(showTimeout.current);
    window.clearTimeout(hideTimeout.current);
  };

  const handleShow = () => {
    if (isTouch) return;
    if (mode === 'manual') return;
    clearTimers();
    showTimeout.current = window.setTimeout(() => setOpen(!!content), showDelay);
  };

  const handleHide = () => {
    if (isTouch) return;
    if (mode === 'manual') return;
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

    // Only attach hover/focus handlers if NOT touch
    ...(isTouch
      ? {}
      : {
        onMouseEnter: handleShow,
        onMouseLeave: handleHide,
        onFocus: handleShow,
        onBlur: handleHide,
      }),
  });

  useEffect(() => clearTimers, []);

  // Force closed on touch
  const resolvedOpen = isTouch ? false : mode === 'manual' ? !!openProp : open;

  return (
    <>
      {child}
      <Popover
        targetRef={targetRef}
        open={resolvedOpen}
        position={position}
        dismissible={dismissible}
        onClose={() => setOpen(false)}
        gap={6}
        withArrow
        size="medium"
        appearance="dark"
        width="auto"
      >
        <div style={{ maxWidth: 200, whiteSpace: 'normal', wordBreak: 'break-word' }}>
          {content}
        </div>
      </Popover>
    </>
  );
};

export default Tooltip;
