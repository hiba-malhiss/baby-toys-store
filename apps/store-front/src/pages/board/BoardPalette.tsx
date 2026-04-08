import type { BoardColorDefinition } from '../board.types';

type BoardPaletteProps = {
  colors: BoardColorDefinition[];
  selectedColorId: string | null;
  onSelectColor: (colorId: string) => void;
};

const BoardPalette = ({ colors, selectedColorId, onSelectColor }: BoardPaletteProps) => {
  return (
    <aside className="board-panel">
      <div className="board-panel__header">
        <h3>Palette</h3>
      </div>
      <div className="board-player-palette">
        {colors.map((color) => (
          <button
            key={color.id}
            type="button"
            className={`board-player-palette__item ${selectedColorId === color.id ? 'is-selected' : ''}`}
            onClick={() => onSelectColor(color.id)}
          >
            <span className="board-color-swatch" style={{ backgroundColor: color.hex }} />
            <span className="board-player-palette__equation">{color.equation}</span>
          </button>
        ))}
      </div>
    </aside>
  );
};

export default BoardPalette;
