import { type CSSProperties } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useBoardWizard, validateStep1, validateStep2 } from './useBoardAdmin';
import { usePaintInteraction } from '@/shared/usePaintInteraction';
import { evaluateEquation } from '@/shared/boardUtils';
import type { BoardConfig, BoardTriangleKey } from '@/shared/types';
import { ArrowLeft, ChevronRight, ChevronLeft, Check, Plus, Trash2 } from 'lucide-react';
import s from './BoardWizard.module.css';

// ─── Step 1 — Info & palette ──────────────────────────────────────────

function InfoStep({ w }: { w: ReturnType<typeof useBoardWizard> }) {
  const {
    board,
    selectedColorId,
    step1Errors,
    triedNext,
    handleNameChange,
    handleDimChange,
    updateColor,
    addColor,
    removeColor,
    setSelectedColorId,
  } = w;

  const dupes = (() => {
    const map: Record<string, string[]> = {};
    board.colors.forEach((c) => {
      if (!c.equation.trim()) return;
      const r = evaluateEquation(c.equation);
      (map[r] ??= []).push(c.id);
    });
    const d = new Set<string>();
    Object.values(map).forEach((ids) => {
      if (ids.length > 1) ids.forEach((id) => d.add(id));
    });
    return d;
  })();

  return (
    <div>
      {triedNext && step1Errors.length > 0 && (
        <div className="validation-errors">
          <p className="validation-errors-title">Fix these before continuing</p>
          {step1Errors.map((e, i) => (
            <p key={i} className="validation-errors-item">
              {e}
            </p>
          ))}
        </div>
      )}

      <div className="field">
        <label className="field-label">Board Name</label>
        <input
          className={`input ${triedNext && !board.name.trim() ? 'error' : ''}`}
          value={board.name}
          onChange={handleNameChange}
          placeholder="e.g. Algebra Basics"
        />
      </div>

      <div className="field-row">
        <div className="field">
          <label className="field-label">Width (cols)</label>
          <input
            className="input"
            type="number"
            min="1"
            max="20"
            value={board.width}
            onChange={(e) => handleDimChange('width', e.target.value)}
          />
        </div>
        <div className="field">
          <label className="field-label">Height (rows)</label>
          <input
            className="input"
            type="number"
            min="1"
            max="20"
            value={board.height}
            onChange={(e) => handleDimChange('height', e.target.value)}
          />
        </div>
      </div>
      <p className="helper-text">
        {board.width} × {board.height} = {board.width * board.height} cells
      </p>

      <div style={{ marginTop: 22 }}>
        <div className="card-header" style={{ marginBottom: 14 }}>
          <h3>Color Palette</h3>
          <button className="btn btn-secondary" onClick={addColor}>
            + Add Color
          </button>
        </div>
        {board.colors.map((color) => {
          const result = color.equation.trim() ? evaluateEquation(color.equation) : '';
          const isDupe = dupes.has(color.id);
          const showResult = result !== '' && result !== color.equation;
          return (
            <div
              key={color.id}
              className={[
                s.paletteRow,
                selectedColorId === color.id ? s.paletteRowSelected : '',
                isDupe ? s.paletteRowDupe : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <button
                type="button"
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: color.hex,
                  border: '2px solid rgba(15,23,42,.1)',
                  cursor: 'pointer',
                  transition: 'transform .15s',
                }}
                onClick={() => setSelectedColorId(color.id)}
                aria-label="Select"
              />
              <input
                className="input input-color"
                type="color"
                value={color.hex}
                onChange={(e) => updateColor(color.id, 'hex', e.target.value)}
              />
              <div className={s.equationWrap}>
                <input
                  className={`input ${isDupe ? 'error' : ''}`}
                  type="text"
                  value={color.equation}
                  placeholder="Equation e.g. 2+2"
                  onChange={(e) => updateColor(color.id, 'equation', e.target.value)}
                />
                {showResult && (
                  <span className={`${s.eqPreview} ${isDupe ? s.dupe : s.ok}`}>
                    = {result}
                    {isDupe ? ' ← duplicate!' : ''}
                  </span>
                )}
              </div>
              <button
                className="btn btn-danger"
                onClick={() => removeColor(color.id)}
                disabled={board.colors.length === 1}
              >
                ✕
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Step 2 — Paint grid ──────────────────────────────────────────────

type AdminCellProps = {
  board: BoardConfig;
  index: number;
  onCellClick: (i: number, k?: BoardTriangleKey) => void;
  onCellEnter: (i: number, k?: BoardTriangleKey) => void;
  onMouseEnter: (i: number) => void;
  onSetSplit: (i: number, m: 'none' | 'left' | 'right') => void;
  isRange: boolean;
  isAnchor: boolean;
};

function AdminCell({
  board,
  index,
  onCellClick,
  onCellEnter,
  onMouseEnter,
  onSetSplit,
  isRange,
  isAnchor,
}: AdminCellProps) {
  const cell = board.solution[index];
  const topColor = board.colors.find((c) => c.id === cell?.top);
  const botColor = board.colors.find((c) => c.id === cell?.bottom);
  const isSplit = cell?.splitMode !== 'none';

  const cls = [
    'board-split-cell board-split-cell--admin',
    isRange ? 'is-range-highlight' : '',
    isAnchor ? 'is-anchor' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const handleCtx = (e: React.MouseEvent) => {
    e.preventDefault();
    const next =
      cell?.splitMode === 'none' ? 'right' : cell?.splitMode === 'right' ? 'left' : 'none';
    onSetSplit(index, next as 'none' | 'left' | 'right');
  };

  if (isSplit && cell) {
    const sm = cell.splitMode;
    return (
      <div className={cls} onMouseEnter={() => onMouseEnter(index)} onContextMenu={handleCtx}>
        <button
          type="button"
          className={`board-triangle board-triangle--top board-triangle--split-${sm} board-triangle--admin`}
          style={{ backgroundColor: topColor?.hex ?? '#fff' }}
          onClick={() => onCellClick(index, 'top')}
          onMouseEnter={() => onCellEnter(index, 'top')}
        >
          <span
            className={`board-triangle__label board-triangle__label--top board-triangle__label--split-${sm}`}
          >
            {topColor ? evaluateEquation(topColor.equation) : '—'}
          </span>
        </button>
        <button
          type="button"
          className={`board-triangle board-triangle--bottom board-triangle--split-${sm} board-triangle--admin`}
          style={{ backgroundColor: botColor?.hex ?? '#fff' }}
          onClick={() => onCellClick(index, 'bottom')}
          onMouseEnter={() => onCellEnter(index, 'bottom')}
        >
          <span
            className={`board-triangle__label board-triangle__label--bottom board-triangle__label--split-${sm}`}
          >
            {botColor ? evaluateEquation(botColor.equation) : '—'}
          </span>
        </button>
        <svg
          className={`board-split-divider`}
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <line
            x1={sm === 'left' ? 0 : 100}
            y1="0"
            x2={sm === 'left' ? 100 : 0}
            y2="100"
            stroke="rgba(15,23,42,.22)"
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        {isAnchor && <span className="board-cell-anchor-dot" />}
      </div>
    );
  }

  return (
    <div className={cls} onMouseEnter={() => onMouseEnter(index)} onContextMenu={handleCtx}>
      <button
        type="button"
        className="board-cell-full board-cell-full--admin"
        style={{ backgroundColor: topColor?.hex ?? '#fff' }}
        onClick={() => onCellClick(index)}
        onMouseEnter={() => onCellEnter(index)}
      >
        <span>{topColor ? evaluateEquation(topColor.equation) : '—'}</span>
      </button>
      {isAnchor && <span className="board-cell-anchor-dot" />}
    </div>
  );
}

function PaintStep({ w }: { w: ReturnType<typeof useBoardWizard> }) {
  const {
    board,
    selectedColorId,
    setSelectedColorId,
    paintCell,
    setSplitMode,
    step2Errors,
    triedNext,
  } = w;
  const paint = usePaintInteraction(paintCell);

  const coloredCount = board.solution.filter((cell) =>
    cell.splitMode !== 'none' ? cell.top && cell.bottom : cell.top
  ).length;
  const totalCells = board.width * board.height;
  const pct = totalCells > 0 ? Math.round((coloredCount / totalCells) * 100) : 0;
  const coverageCls = pct === 100 ? s.complete : pct > 0 ? s.partial : s.empty;

  return (
    <div>
      {triedNext && step2Errors.length > 0 && (
        <div className="validation-errors">
          {step2Errors.map((e, i) => (
            <p key={i} className="validation-errors-item">
              {e}
            </p>
          ))}
        </div>
      )}

      <div className={`${s.coverageBar} ${coverageCls}`}>
        <span>{pct === 100 ? '✅' : pct > 0 ? '🖌️' : '⬜'}</span>
        <span>
          {coloredCount} / {totalCells} colored ({pct}%)
        </span>
        <div style={{ flex: 1, marginLeft: 8 }}>
          <div className="progress-bar">
            <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>

      <p className="helper-text" style={{ marginBottom: 12 }}>
        {paint.isShiftHeld
          ? paint.anchorIndex === null
            ? '⇧ Click the START cell'
            : `⇧ Anchor at ${paint.anchorIndex + 1} — click END cell to fill`
          : 'Click or drag to paint · Shift + 2 clicks to range-fill · Right-click to cycle split'}
      </p>

      <div className={s.paintLayout}>
        <div
          className={`board-grid ${paint.isShiftHeld ? 'board-grid--ranging' : 'board-grid--painting'}`}
          style={{ gridTemplateColumns: `repeat(${board.width},minmax(0,1fr))` } as CSSProperties}
          onMouseDown={paint.onMouseDown}
          onMouseUp={paint.onMouseUp}
        >
          {Array.from({ length: board.width * board.height }, (_, i) => (
            <AdminCell
              key={`${board.id}-${i}`}
              board={board}
              index={i}
              onCellClick={paint.handleCellClick}
              onCellEnter={paint.handleCellEnter}
              onMouseEnter={paint.setHoveredIndex}
              onSetSplit={setSplitMode}
              isRange={paint.isCellInRange(i)}
              isAnchor={paint.anchorIndex === i}
            />
          ))}
        </div>
        <div className={s.colorSidebar}>
          {board.colors.map((color) => (
            <button
              key={color.id}
              type="button"
              title={`${color.equation} = ${evaluateEquation(color.equation)}`}
              className={[s.colorDot, selectedColorId === color.id ? s.colorDotActive : ''].join(
                ' '
              )}
              style={{ background: color.hex }}
              onClick={() => setSelectedColorId(color.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Step 3 — Save ────────────────────────────────────────────────────

function SaveStep({ w, onManage }: { w: ReturnType<typeof useBoardWizard>; onManage: () => void }) {
  const { board, isSaving, hasSaved, save, goTo } = w;

  if (hasSaved) {
    return (
      <div className={s.saveCenter}>
        <div className={s.saveBigIcon}>✅</div>
        <h3 style={{ margin: '0 0 8px', fontSize: 20 }}>Board Saved! 🎉</h3>
        <p className="helper-text" style={{ marginBottom: 24 }}>
          "{board.name}" is ready for players.
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn btn-secondary" onClick={onManage}>
            View All Boards
          </button>
          <button className="btn btn-primary" onClick={() => goTo(0)}>
            Edit This Board
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={s.saveCenter}>
      <div className={s.saveBigIcon}>💾</div>
      <h3 style={{ margin: '0 0 8px', fontSize: 20 }}>Ready to save?</h3>
      <p className="helper-text" style={{ marginBottom: 24 }}>
        "{board.name}" — {board.width}×{board.height}, {board.colors.length} colors,{' '}
        {board.width * board.height} cells.
      </p>
      <button className="btn btn-success btn-lg" onClick={save} disabled={isSaving}>
        {isSaving ? '⏳ Saving…' : '💾 Save Board'}
      </button>
    </div>
  );
}

// ─── Wizard wrapper ───────────────────────────────────────────────────

const STEPS = ['1. Board Info', '2. Paint Grid', '3. Save'];

export default function BoardWizard() {
  const { id } = useParams<{ id?: string }>();
  const nav = useNavigate();
  const editId = id ? Number(id) : undefined;
  const w = useBoardWizard(editId);

  if (w.isLoadingEdit)
    return (
      <div className={s.page}>
        <p className="helper-text">Loading board…</p>
      </div>
    );

  return (
    <div className={s.page}>
      <div className={s.inner}>
        <div className={s.header}>
          <button className={s.backBtn} onClick={() => nav('/admin/board')}>
            ← Boards
          </button>
          <h1 className={s.pageTitle}>{editId ? '✏️ Edit Board' : '➕ New Board'}</h1>
        </div>

        {/* Stepper */}
        <div className={s.stepper}>
          {STEPS.map((label, i) => {
            const isDone = i < w.stepIndex;
            const isActive = i === w.stepIndex;
            return (
              <button
                key={i}
                className={[s.stepBtn, isActive ? s.stepBtnActive : '', isDone ? s.stepBtnDone : '']
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => isDone && w.goTo(i)}
                disabled={i > w.stepIndex}
              >
                <span
                  className={[
                    s.stepNum,
                    isActive ? s.stepNumActive : '',
                    isDone ? s.stepNumDone : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  {isDone ? '✓' : i + 1}
                </span>
                {label}
              </button>
            );
          })}
        </div>

        {/* Step body */}
        <div className={s.stepBody}>
          {w.stepIndex === 0 && <InfoStep w={w} />}
          {w.stepIndex === 1 && <PaintStep w={w} />}
          {w.stepIndex === 2 && <SaveStep w={w} onManage={() => nav('/admin/board')} />}
        </div>

        {/* Nav buttons */}
        <div className={s.navRow}>
          {w.stepIndex > 0 && w.stepIndex < 2 && (
            <button className="btn btn-secondary" onClick={() => w.goTo(w.stepIndex - 1)}>
              <ArrowLeft size={15} /> Back
            </button>
          )}
          <div className={s.navRight}>
            {w.triedNext && (w.stepIndex === 0 ? w.step1Errors : w.step2Errors).length > 0 && (
              <span className={s.navErrorHint}>⚠ Fix issues above</span>
            )}
            {w.stepIndex < 2 && (
              <button className="btn btn-primary" onClick={w.tryAdvance}>
                Next →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
