import { useCallback, useEffect, useRef, useState } from 'react';
import type { BoardTriangleKey } from './types';

type PaintFn = (cellIndex: number, triangleKey?: BoardTriangleKey) => void;

export type PaintInteraction = {
  handleCellClick: (cellIndex: number, triangleKey?: BoardTriangleKey) => void;
  handleCellEnter: (cellIndex: number, triangleKey?: BoardTriangleKey) => void;
  setHoveredIndex: (index: number) => void;
  onMouseDown: () => void;
  onMouseUp: () => void;
  isShiftHeld: boolean;
  anchorIndex: number | null;
  isCellInRange: (index: number) => boolean;
};

export function usePaintInteraction(paintCell: PaintFn): PaintInteraction {
  const [isShiftHeld, setIsShiftHeld] = useState(false);
  const [anchorIndex, setAnchorIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const isMouseDown = useRef(false);

  useEffect(() => {
    const onDown = (e: KeyboardEvent) => {
      if (e.key === 'Shift') setIsShiftHeld(true);
    };
    const onUp = (e: KeyboardEvent) => {
      if (e.key === 'Shift') {
        setIsShiftHeld(false);
        setAnchorIndex(null);
      }
    };
    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);
    return () => {
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup', onUp);
    };
  }, []);

  const handleCellClick = useCallback(
    (cellIndex: number, triangleKey?: BoardTriangleKey) => {
      if (isShiftHeld) {
        if (anchorIndex === null) {
          setAnchorIndex(cellIndex);
        } else {
          for (let i = Math.min(anchorIndex, cellIndex); i <= Math.max(anchorIndex, cellIndex); i++)
            paintCell(i, triangleKey);
          setAnchorIndex(null);
        }
      } else {
        paintCell(cellIndex, triangleKey);
        setAnchorIndex(null);
      }
    },
    [isShiftHeld, anchorIndex, paintCell]
  );

  const handleCellEnter = useCallback(
    (cellIndex: number, triangleKey?: BoardTriangleKey) => {
      if (isMouseDown.current && !isShiftHeld) {
        paintCell(cellIndex, triangleKey);
        setHoveredIndex(cellIndex);
      }
    },
    [isShiftHeld, paintCell]
  );

  const isCellInRange = useCallback(
    (index: number) => {
      if (!isShiftHeld || anchorIndex === null || hoveredIndex === null) return false;
      return (
        index >= Math.min(anchorIndex, hoveredIndex) && index <= Math.max(anchorIndex, hoveredIndex)
      );
    },
    [isShiftHeld, anchorIndex, hoveredIndex]
  );

  return {
    handleCellClick,
    handleCellEnter,
    setHoveredIndex,
    onMouseDown: () => {
      isMouseDown.current = true;
    },
    onMouseUp: () => {
      isMouseDown.current = false;
      setHoveredIndex(null);
    },
    isShiftHeld,
    anchorIndex,
    isCellInRange,
  };
}
