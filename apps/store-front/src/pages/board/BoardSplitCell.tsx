import { type CSSProperties, type MouseEvent as ReactMouseEvent, useEffect, useRef, useState } from 'react';

import type { BoardCellFeedback, BoardCellSplitMode, BoardTriangleKey } from '../board.types';

type TriangleDisplay = {
  colorHex?: string;
  label: string;
  isSelected?: boolean;
  isSolved?: boolean;
  feedback?: BoardCellFeedback;
};

type BoardSplitCellProps = {
  mode: 'admin' | 'player';
  cellIndex: number;
  splitMode: BoardCellSplitMode;
  top: TriangleDisplay;
  bottom: TriangleDisplay;
  onCellClick: (cellIndex: number, triangleKey?: BoardTriangleKey) => void;
  onSetSplitMode?: (cellIndex: number, splitMode: BoardCellSplitMode) => void;
};

const BoardSplitCell = ({
                          mode,
                          cellIndex,
                          splitMode,
                          top,
                          bottom,
                          onCellClick,
                          onSetSplitMode,
                        }: BoardSplitCellProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 4, y: 4 });
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if(!isMenuOpen) {
      return undefined;
    }

    const handleDocumentClick = (event: MouseEvent) => {
      if(!menuRef.current?.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleDocumentClick);

    return () => {
      document.removeEventListener('mousedown', handleDocumentClick);
    };
  }, [isMenuOpen]);

  const buildTriangleClassName = (triangleKey: BoardTriangleKey, triangle: TriangleDisplay) =>
    [
      'board-triangle',
      `board-triangle--${triangleKey}`,
      `board-triangle--split-${splitMode}`,
      `board-triangle--${mode}`,
      triangle.isSelected ? 'is-selected' : '',
      triangle.feedback === 'correct' ? 'is-correct' : '',
      triangle.feedback === 'incorrect' ? 'is-incorrect' : '',
      triangle.isSolved ? 'is-solved' : '',
    ]
      .filter(Boolean)
      .join(' ');

  const buildTriangleLabelClassName = (triangleKey: BoardTriangleKey) =>
    [
      'board-triangle__label',
      `board-triangle__label--${triangleKey}`,
      `board-triangle__label--split-${splitMode}`,
    ].join(' ');

  const buildTriangleStyle = (triangle: TriangleDisplay): CSSProperties => ({
    backgroundColor: triangle.isSolved ? triangle.colorHex || '#ffffff' : triangle.colorHex || '#ffffff',
  });

  const isSplit = splitMode !== 'none';
  const isCellSolved = Boolean(top.isSolved && bottom.isSolved);

  const fullCellClassName = [
    'board-cell-full',
    `board-cell-full--${mode}`,
    Boolean(top.isSelected && bottom.isSelected) ? 'is-selected' : '',
    top.feedback === 'correct' && bottom.feedback === 'correct' ? 'is-correct' : '',
    top.feedback === 'incorrect' || bottom.feedback === 'incorrect' ? 'is-incorrect' : '',
    isCellSolved ? 'is-solved' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const handleContextMenu = (event: ReactMouseEvent<HTMLDivElement>) => {
    if(mode !== 'admin' || !onSetSplitMode) {
      return;
    }

    event.preventDefault();
    const bounds = event.currentTarget.getBoundingClientRect();
    setMenuPosition({
      x: Math.max(4, Math.min(event.clientX - bounds.left, bounds.width - 124)),
      y: Math.max(4, Math.min(event.clientY - bounds.top, bounds.height - 108)),
    });
    setIsMenuOpen(true);
  };

  const handleSplitModeSelect = (nextSplitMode: BoardCellSplitMode) => {
    onSetSplitMode?.(cellIndex, nextSplitMode);
    setIsMenuOpen(false);
  };

  return (
    <div ref={menuRef} className={`board-split-cell board-split-cell--${mode}`} onContextMenu={handleContextMenu}>
      {isSplit ? (
        <>
          <button
            type="button"
            className={buildTriangleClassName('top', top)}
            style={buildTriangleStyle(top)}
            onClick={() => onCellClick(cellIndex, 'top')}
            aria-label={`Select top triangle of cell ${cellIndex + 1}`}
          >
            {!top.isSolved ? <span className={buildTriangleLabelClassName('top')}>{top.label}</span> : null}
          </button>
          <button
            type="button"
            className={buildTriangleClassName('bottom', bottom)}
            style={buildTriangleStyle(bottom)}
            onClick={() => onCellClick(cellIndex, 'bottom')}
            aria-label={`Select bottom triangle of cell ${cellIndex + 1}`}
          >
            {!bottom.isSolved ? <span className={buildTriangleLabelClassName('bottom')}>{bottom.label}</span> : null}
          </button>
          <svg className={`board-split-divider board-split-divider--${splitMode}`} viewBox="0 0 100 100"
               preserveAspectRatio="none" aria-hidden="true">
            <line
              x1={splitMode === 'left' ? 0 : 100}
              y1="0"
              x2={splitMode === 'left' ? 100 : 0}
              y2="100"
            />
          </svg>
        </>
      ) : (
        <button
          type="button"
          className={fullCellClassName}
          style={{ backgroundColor: top.colorHex || bottom.colorHex || '#ffffff' }}
          onClick={() => onCellClick(cellIndex)}
          aria-label={`Select cell ${cellIndex + 1}`}
        >
          {!isCellSolved ? <span>{top.label || bottom.label}</span> : null}
        </button>
      )}
      {mode === 'admin' && isMenuOpen ? (
        <div className="board-cell-menu" style={{ left: menuPosition.x, top: menuPosition.y }}>
          <button type="button" className="board-cell-menu__item" onClick={() => handleSplitModeSelect('left')}>
            Split left
          </button>
          <button type="button" className="board-cell-menu__item" onClick={() => handleSplitModeSelect('right')}>
            Split right
          </button>
          <button type="button" className="board-cell-menu__item" onClick={() => handleSplitModeSelect('none')}>
            Not splitted
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default BoardSplitCell;
