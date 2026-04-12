import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play } from 'lucide-react';
import { useBoardsQuery } from '@/api/boardApi';
import { useBoardThumbnail } from '../../hooks/useBoardThumbnail';
import { Paginator } from '@baby-toys/ui-kit';
import s from '../PlayerHub.module.css';

const PAGE_SIZE = 8;

function BoardCard({
  board,
  onPlay,
}: {
  board: { id: number; name: string; width: number; height: number };
  onPlay: () => void;
}) {
  const canvasRef = useBoardThumbnail(board.id, 120);
  return (
    <div className={s.gameCard}>
      <div className={s.cardImage}>
        <canvas ref={canvasRef} width={120} height={120} className={s.thumbnail} />
        <span className={s.cardBadge}>Board</span>
      </div>
      <div className={s.cardBody}>
        <h3 className={s.cardTitle}>{board.name}</h3>
        <p className={s.cardMeta}>
          {board.width}×{board.height} grid
        </p>
      </div>
      <button className={s.cardPlay} onClick={onPlay}>
        <Play size={13} /> Play
      </button>
    </div>
  );
}

export default function PaintByEquationSection() {
  const nav = useNavigate();
  const [page, setPage] = useState(1);

  // API is 0-indexed
  const { data, isLoading, isFetching } = useBoardsQuery({ page: page - 1, size: PAGE_SIZE });

  const boards = data?.content ?? [];
  const totalItems = data?.totalElements ?? 0;

  return (
    <section className={s.section}>
      <h2 className={s.sectionTitle}>🎨 Paint by Equation</h2>

      {isLoading && (
        <div className={s.grid}>
          {[1, 2, 3].map((i) => (
            <div key={i} className={s.skeleton} />
          ))}
        </div>
      )}

      {!isLoading && boards.length === 0 && (
        <p className="empty-text">No boards available yet. Ask an admin to create one.</p>
      )}

      {!isLoading && boards.length > 0 && (
        <div className={s.grid}>
          {boards.map((b) => (
            <BoardCard key={b.id} board={b} onPlay={() => nav(`/play/board/${b.id}`)} />
          ))}
          {isFetching &&
            !isLoading &&
            [1, 2].map((i) => <div key={`bsk-${i}`} className={s.skeleton} />)}
        </div>
      )}

      <Paginator
        totalItems={totalItems}
        pageSize={PAGE_SIZE}
        initialPage={page}
        isLoading={isFetching && !isLoading}
        mode="default"
        onPageChange={(p) => setPage(p)}
      />
    </section>
  );
}
