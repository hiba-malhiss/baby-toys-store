import { useState } from 'react';

import BoardGrid from './BoardGrid';
import BoardPaletteEditor from './BoardPaletteEditor';
import BoardSplitCell from './BoardSplitCell';
import useBoardAdminPage from './useBoardAdminPage';
import { evaluateEquation } from './board.utils';
import './styles.scss';
import {
  StepList,
  StepItem,
  Step,
  StepPanels,
  StepPanel,
  StepperSeparator,
  Stepper
} from "@baby-toys/ui-kit";

type AdminView = 'create' | 'manage';

const STEPPER_STEPS = [
  { label: 'Board Info' },
  { label: 'Paint Grid' },
  { label: 'Save' },
];

const BoardAdminPage = () => {
  const [view, setView] = useState<AdminView>('create');
  const [stepIndex, setStepIndex] = useState(0);

  const {
    savedBoards,
    activeBoard,
    selectedColorId,
    statusMessage,
    hasSavedBoard,
    handleSelectBoard,
    handleCreateBoard,
    handleBoardNameChange,
    handleDimensionChange,
    handlePaintCell,
    handleSetCellSplitMode,
    handleUpdateColor,
    handleAddColor,
    handleRemoveColor,
    handleSaveBoard,
    handleDeleteBoard,
    setSelectedColorId,
  } = useBoardAdminPage();

  const goToEdit = (boardId: string) => {
    handleSelectBoard(boardId);
    setView('create');
    setStepIndex(0);
  };

  const startCreate = () => {
    handleCreateBoard();
    setView('create');
    setStepIndex(0);
  };

  const handleSaveAndAdvance = () => {
    handleSaveBoard();
    setStepIndex(2);
  };

  /* ── Manage view ───────────────────────────────────────── */
  const renderManage = () => (
    <div className="board-panel">
      <div className="board-panel__header">
        <h3>All Boards</h3>
        <button type="button" className="board-button" onClick={startCreate}>
          + New Board
        </button>
      </div>

      {savedBoards.length === 0 ? (
        <p className="board-empty-state">
          No boards saved yet. Create your first board!
        </p>
      ) : (
        <table className="board-manage-table">
          <thead>
          <tr>
            <th>Name</th>
            <th>Size</th>
            <th>Colors</th>
            <th>Updated</th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
          </thead>

          <tbody>
          {savedBoards.map((board) => (
            <tr key={board.id}>
              <td>
                <strong>{board.name}</strong>
              </td>
              <td>
                  <span className="board-badge board-badge--brand">
                    {board.width} × {board.height}
                  </span>
              </td>
              <td>{board.colors.length} colors</td>
              <td style={{ color: 'var(--text-3)', fontSize: 13 }}>
                {new Date(board.updatedAt).toLocaleDateString()}
              </td>
              <td>
                <div className="board-manage-table__actions">
                  <button
                    type="button"
                    className="board-button board-button--secondary"
                    onClick={() => goToEdit(board.id)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="board-button board-button--ghost"
                    onClick={() => handleDeleteBoard(board.id)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
          </tbody>
        </table>
      )}
    </div>
  );

  /* ── Step 1: Board Info ────────────────────────────────── */
  const stepInfo = (
    <div>
      <label className="board-field">
        <span>Board Name</span>
        <input
          className="board-input"
          type="text"
          value={activeBoard.name}
          onChange={handleBoardNameChange}
          placeholder="e.g. Algebra Basics"
        />
      </label>

      <div className="board-field-group">
        <label className="board-field">
          <span>Width (cols)</span>
          <input
            className="board-input"
            type="number"
            min="1"
            max="20"
            value={activeBoard.width}
            onChange={(e) =>
              handleDimensionChange('width', e.target.value)
            }
          />
        </label>

        <label className="board-field">
          <span>Height (rows)</span>
          <input
            className="board-input"
            type="number"
            min="1"
            max="20"
            value={activeBoard.height}
            onChange={(e) =>
              handleDimensionChange('height', e.target.value)
            }
          />
        </label>
      </div>

      <p className="board-helper-text">
        Grid: {activeBoard.width} × {activeBoard.height} ={' '}
        {activeBoard.width * activeBoard.height} cells.
      </p>
    </div>
  );

  /* ── Step 2: Paint Grid ────────────────────────────────── */
  const stepPaint = (
    <div
      style={{
        display: 'grid',
        gap: 6,
        gridTemplateColumns: '1fr max-content',
      }}
    >
      <BoardGrid
        width={activeBoard.width}
        height={activeBoard.height}
        renderCell={(index) => {
          const cell = activeBoard.solution[index];
          const topColor = activeBoard.colors.find(
            (c) => c.id === cell?.top
          );
          const bottomColor = activeBoard.colors.find(
            (c) => c.id === cell?.bottom
          );

          return (
            <BoardSplitCell
              key={`${activeBoard.id}-${index}`}
              mode="admin"
              cellIndex={index}
              splitMode={cell?.splitMode || 'none'}
              onCellClick={handlePaintCell}
              onSetSplitMode={handleSetCellSplitMode}
              top={{
                colorHex: topColor?.hex,
                label: topColor?.equation
                  ? evaluateEquation(topColor.equation)
                  : 'No eq',
                isSelected: selectedColorId === topColor?.id,
              }}
              bottom={{
                colorHex: bottomColor?.hex,
                label: bottomColor?.equation
                  ? evaluateEquation(bottomColor.equation)
                  : 'No eq',
                isSelected: selectedColorId === bottomColor?.id,
              }}
            />
          );
        }}
      />
      <BoardPaletteEditor
        colors={activeBoard.colors}
        selectedColorId={selectedColorId}
        onSelectColor={setSelectedColorId}
        onUpdateColor={handleUpdateColor}
        onAddColor={handleAddColor}
        onRemoveColor={handleRemoveColor}
      />
    </div>
  );

  /* ── Step 3: Save ──────────────────────────────────────── */
  const stepSave = (
    <div style={{ textAlign: 'center', padding: '16px 0' }}>
      {hasSavedBoard ? (
        <>
          <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
          <h3 style={{ margin: '0 0 8px', fontSize: 18 }}>
            Board saved!
          </h3>
          <p className="board-helper-text" style={{ marginBottom: 18 }}>
            "{activeBoard.name}" is ready for players.
          </p>

          <div
            style={{
              display: 'flex',
              gap: 10,
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <button
              type="button"
              className="board-button board-button--secondary"
              onClick={startCreate}
            >
              + New Board
            </button>

            <button
              type="button"
              className="board-button board-button--secondary"
              onClick={() => setView('manage')}
            >
              Manage Boards
            </button>

            <button
              type="button"
              className="board-button"
              onClick={() => setStepIndex(0)}
            >
              Edit This Board
            </button>
          </div>
        </>
      ) : (
        <>
          <div style={{ fontSize: 40, marginBottom: 12 }}>💾</div>
          <h3 style={{ margin: '0 0 8px', fontSize: 18 }}>
            Ready to save?
          </h3>
          <p className="board-helper-text" style={{ marginBottom: 18 }}>
            "{activeBoard.name}" — {activeBoard.width} ×{' '}
            {activeBoard.height}, {activeBoard.colors.length} colors.
          </p>

          <button
            type="button"
            className="board-button"
            onClick={handleSaveAndAdvance}
          >
            Save Board
          </button>
        </>
      )}
    </div>
  );

  const stepsContent = [stepInfo, stepPaint, stepSave];

  /* ── Render ────────────────────────────────────────────── */
  return (
    <div className="board-page-container">
      <div className="board-page">
        <div className="board-page__header">
          <div>
            <p className="board-page__eyebrow">Admin</p>
            <h1>Board Builder</h1>
            <p className="board-page__description">
              Design paint-by-equation boards and save them for players.
            </p>
          </div>

          {savedBoards.length > 0 && (
            <span
              className="board-badge board-badge--brand"
              style={{
                padding: '6px 14px',
                fontSize: 13,
                alignSelf: 'center',
              }}
            >
              {savedBoards.length} saved board
              {savedBoards.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* Tabs */}
        <div className="board-tabs">
          <button
            type="button"
            className={`board-tab${view === 'create' ? ' is-active' : ''}`}
            onClick={() => setView('create')}
          >
            {hasSavedBoard ? '✏️ Edit Board' : '＋ Create Board'}
          </button>

          <button
            type="button"
            className={`board-tab${view === 'manage' ? ' is-active' : ''}`}
            onClick={() => setView('manage')}
          >
            📋 Manage ({savedBoards.length})
          </button>
        </div>

        {view === 'manage' ? (
          renderManage()
        ) : (
          <div className="board-panel">
            <Stepper value={stepIndex} onValueChange={setStepIndex}>
              {/* Header */}
              <StepList>
                {STEPPER_STEPS.map((step, i) => (
                  <div
                    key={step.label}
                    style={{ display: 'flex', alignItems: 'center' }}
                  >
                    <StepItem value={i}>
                      <Step>{step.label}</Step>
                    </StepItem>

                    {i < STEPPER_STEPS.length - 1 && (
                      <StepperSeparator/>
                    )}
                  </div>
                ))}
              </StepList>

              {statusMessage && (
                <span
                  style={{
                    fontSize: 13,
                    color: 'var(--text-2)',
                  }}
                >
                      {statusMessage}
                    </span>
              )}

              {/* Panels */}
              <StepPanels>
                {stepsContent.map((content, i) => (
                  <StepPanel key={i} value={i}>
                    {content}
                  </StepPanel>
                ))}
              </StepPanels>

              {/* Actions */}
              <div className="board-stepper__actions">
                {stepIndex > 0 && (
                  <button
                    type="button"
                    className="board-button board-button--secondary"
                    onClick={() =>
                      setStepIndex((i) => i - 1)
                    }
                  >
                    ← Back
                  </button>
                )}

                {stepIndex < STEPPER_STEPS.length - 1 ? (
                  <button
                    type="button"
                    className="board-button"
                    onClick={() =>
                      setStepIndex((i) => i + 1)
                    }
                  >
                    Next →
                  </button>
                ) : (
                  (
                    <button
                      type="button"
                      className="board-button board-button--success"
                      onClick={handleSaveAndAdvance}
                    >
                      Save Board
                    </button>
                  )
                )}
              </div>
            </Stepper>
          </div>
        )}
      </div>
    </div>
  );
};

export default BoardAdminPage;