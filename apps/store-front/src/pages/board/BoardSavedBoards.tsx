import type { BoardConfig } from '../board.types';

type BoardSavedBoardsProps = {
  boards: BoardConfig[];
  selectedBoardId: string | null;
  title: string;
  onSelectBoard: (boardId: string) => void;
};

const BoardSavedBoards = ({
  boards,
  selectedBoardId,
  title,
  onSelectBoard,
}: BoardSavedBoardsProps) => {
  return (
    <div className="board-panel">
      <div className="board-panel__header">
        <h3>{title}</h3>
      </div>
      {boards.length ? (
        <div className="board-saved-list">
          {boards.map((board) => (
            <button
              type="button"
              key={board.id}
              className={`board-saved-list__item ${selectedBoardId === board.id ? 'is-selected' : ''}`}
              onClick={() => onSelectBoard(board.id)}
            >
              <span>{board.name}</span>
              <small>
                {board.width} x {board.height}
              </small>
            </button>
          ))}
        </div>
      ) : (
        <p className="board-empty-state">No boards saved yet.</p>
      )}
    </div>
  );
};

export default BoardSavedBoards;
