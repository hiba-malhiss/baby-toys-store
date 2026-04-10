import { evaluateEquation } from '@/shared/boardUtils';
import type { BoardColorDefinition } from '@/shared/types';
import s from './ColorPalette.module.css';

type Props = {
  colors: BoardColorDefinition[];
  selectedColorId: string | null;
  onSelect: (id: string) => void;
};

export default function ColorPalette({ colors, selectedColorId, onSelect }: Props) {
  return (
    <div className="card">
      <div className="card-header">
        <h3>🎨 Palette</h3>
      </div>
      <div className={s.palette}>
        {colors.map((color) => {
          const result = color.equation.trim() ? evaluateEquation(color.equation) : '';
          const showResult = result !== '' && result !== color.equation;
          return (
            <button
              key={color.id}
              type="button"
              className={`${s.item} ${selectedColorId === color.id ? s.selected : ''}`}
              onClick={() => onSelect(color.id)}
            >
              <span className={s.swatch} style={{ backgroundColor: color.hex }} />
              <span className={s.equation}>{color.equation}</span>
              {showResult && <span className={s.result}>= {result}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
