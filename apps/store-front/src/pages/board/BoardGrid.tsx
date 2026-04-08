import { CSSProperties, ReactNode } from 'react';

type BoardGridProps = {
  width: number;
  height: number;
  renderCell: (index: number) => ReactNode;
};

const BoardGrid = ({ width, height, renderCell }: BoardGridProps) => {
  const gridStyle: CSSProperties = {
    gridTemplateColumns: `repeat(${width}, minmax(0, 1fr))`,
  };

  return (
    <div className="board-grid" style={gridStyle}>
      {Array.from({ length: width * height }, (_, index) => renderCell(index))}
    </div>
  );
};

export default BoardGrid;
