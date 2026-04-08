import { useEffect } from 'react';

import BoardGrid from './BoardGrid';
import BoardPalette from './BoardPalette';
import BoardSavedBoards from './BoardSavedBoards';
import BoardSplitCell from './BoardSplitCell';
import BoardTimer, { useTimer } from './BoardTimer';
import useBoardPlayerPage from './useBoardPlayerPage';
import { evaluateEquation } from './board.utils';
import './styles.scss';

const BoardPlayerPage = () => {
  const {
    boards,
    activeBoard,
    selectedBoardId,
    selectedColorId,
    cellsState,
    solvedCellsCount,
    totalTargetCount,
    handleSelectBoard,
    handleCellClick,
    setSelectedColorId,
  } = useBoardPlayerPage();

  const timer = useTimer();
  const isComplete =
    activeBoard !== null && solvedCellsCount === totalTargetCount && totalTargetCount > 0;

  /* Auto-finish timer when board is solved */
  useEffect(() => {
    if (isComplete && (timer.state === 'running' || timer.state === 'paused')) {
      timer.finish();
    }
  }, [isComplete, timer.state]);

  /* Reset timer when board changes */
  useEffect(() => {
    timer.reset();
  }, [selectedBoardId]);

  if (!activeBoard) {
    return (
      <div className="board-page-container">
        <div className="board-page">
          <div className="board-page__header">
            <div>
              <p className="board-page__eyebrow">Player</p>
              <h1>No board available</h1>
              <p className="board-page__description">
                Ask an admin to save a board before you can play.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="board-page-container">
      <div className="board-page">
        {/* Header */}
        <div className="board-page__header">
          <div>
            <p className="board-page__eyebrow">Player</p>
            <h1>{activeBoard.name}</h1>
            <p className="board-page__description">
              Pick a color from the palette, then click the matching triangle to solve it.
            </p>
          </div>
          <div className="board-player-meta">
            <div className="board-status-card">
              <span>Solved</span>
              <strong>
                {solvedCellsCount} / {totalTargetCount}
              </strong>
            </div>
          </div>
        </div>

        {/* Timer */}
        <div style={{ marginBottom: 20 }}>
          <BoardTimer
            elapsed={timer.elapsed}
            state={timer.state}
            onStart={timer.start}
            onPause={timer.pause}
            onResume={timer.resume}
            onFinish={timer.finish}
            onReset={timer.reset}
          />
        </div>

        {/* Completion banner */}
        {isComplete && (
          <div className="board-complete-banner" style={{ marginBottom: 20 }}>
            <h2>🎉 Board Complete!</h2>
            <p>
              You solved all {totalTargetCount} targets in{' '}
              <strong>
                {Math.floor(timer.elapsed / 60)
                  .toString()
                  .padStart(2, '0')}
                :{(timer.elapsed % 60).toString().padStart(2, '0')}
              </strong>
              !
            </p>
            <button
              type="button"
              className="board-button board-button--success"
              onClick={() => {
                handleSelectBoard(activeBoard.id);
                timer.reset();
              }}
            >
              Play Again
            </button>
          </div>
        )}

        <div className="board-shell">
          {/* Sidebar */}
          <div className="board-sidebar">
            <BoardSavedBoards
              boards={boards}
              selectedBoardId={selectedBoardId}
              title="Choose Board"
              onSelectBoard={handleSelectBoard}
            />
            <BoardPalette
              colors={activeBoard.colors}
              selectedColorId={selectedColorId}
              onSelectColor={setSelectedColorId}
            />
          </div>

          {/* Grid */}
          <section className="board-workspace">
            <div className="board-panel">
              <div className="board-panel__header">
                <h3>Play Grid</h3>
                <p>Click a triangle half to fill it with your selected color.</p>
              </div>
              <BoardGrid
                width={activeBoard.width}
                height={activeBoard.height}
                renderCell={(index) => {
                  const cellSolution = activeBoard.solution[index];
                  const cellState = cellsState[index];
                  const topAnswerColor = activeBoard.colors.find((c) => c.id === cellSolution?.top);
                  const bottomAnswerColor = activeBoard.colors.find(
                    (c) => c.id === cellSolution?.bottom
                  );

                  return (
                    <BoardSplitCell
                      key={`${activeBoard.id}-${index}`}
                      mode="player"
                      cellIndex={index}
                      splitMode={cellSolution?.splitMode || 'none'}
                      onCellClick={handleCellClick}
                      top={{
                        colorHex:
                          cellState?.top.isSolved || cellState?.top.feedback === 'correct'
                            ? topAnswerColor?.hex
                            : '#ffffff',
                        label: topAnswerColor?.equation
                          ? evaluateEquation(topAnswerColor.equation)
                          : 'No equation',
                        feedback: cellState?.top.feedback,
                        isSolved: cellState?.top.isSolved,
                      }}
                      bottom={{
                        colorHex:
                          cellState?.bottom.isSolved || cellState?.bottom.feedback === 'correct'
                            ? bottomAnswerColor?.hex
                            : '#ffffff',
                        label: bottomAnswerColor?.equation
                          ? evaluateEquation(bottomAnswerColor.equation)
                          : 'No equation',
                        feedback: cellState?.bottom.feedback,
                        isSolved: cellState?.bottom.isSolved,
                      }}
                    />
                  );
                }}
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default BoardPlayerPage;
