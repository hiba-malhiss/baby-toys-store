import type { BoardColorDefinition } from '../board.types';

type BoardPaletteEditorProps = {
  colors: BoardColorDefinition[];
  selectedColorId: string | null;
  onSelectColor: (colorId: string) => void;
  onUpdateColor: (colorId: string, field: 'hex' | 'equation', value: string) => void;
  onAddColor: () => void;
  onRemoveColor: (colorId: string) => void;
};

const BoardPaletteEditor = ({
  colors,
  selectedColorId,
  onSelectColor,
  onUpdateColor,
  onAddColor,
  onRemoveColor,
}: BoardPaletteEditorProps) => {
  return (
    <div className="board-panel">
      <div className="board-panel__header">
        <h3>Palette</h3>
        <button type="button" className="board-button board-button--secondary" onClick={onAddColor}>
          Add Color
        </button>
      </div>
      <div className="board-palette-editor">
        {colors.map((color) => (
          <div
            key={color.id}
            className={`board-palette-editor__row ${selectedColorId === color.id ? 'is-selected' : ''}`}
          >
            <button
              type="button"
              className="board-color-swatch"
              style={{ backgroundColor: color.hex }}
              onClick={() => onSelectColor(color.id)}
              aria-label={`Select ${color.equation || color.id}`}
            />
            <input
              className="board-input board-input--color"
              type="color"
              value={color.hex}
              onChange={(event) => onUpdateColor(color.id, 'hex', event.target.value)}
            />
            <input
              className="board-input"
              type="text"
              value={color.equation}
              placeholder="Equation"
              onChange={(event) => onUpdateColor(color.id, 'equation', event.target.value)}
            />
            <button
              type="button"
              className="board-button board-button--ghost"
              onClick={() => onRemoveColor(color.id)}
              disabled={colors.length === 1}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BoardPaletteEditor;
