import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Map } from 'lucide-react';
import { listMazeConfigs } from '../../maze/shared/mazeTypes';
import s from '../PlayerHub.module.css';
import { Paginator } from '@baby-toys/ui-kit';

const PAGE_SIZE = 8;

export default function MazeSection() {
  const nav = useNavigate();
  const [page, setPage] = useState(1);

  const allMazes = listMazeConfigs();
  const totalItems = allMazes.length;
  const paginated = allMazes.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (totalItems === 0) return null;

  return (
    <section className={s.section}>
      <h2 className={s.sectionTitle}>🗺️ Math Maze</h2>
      <div className={s.grid}>
        {paginated.map((maze) => (
          <div key={maze.deckId} className={s.gameCard}>
            <div className={`${s.cardImage} ${s.cardImageMaze}`}>
              <Map size={48} color="var(--brand)" strokeWidth={1.5} />
              <span className={s.cardBadge}>Maze</span>
              <span className={s.mazeSizeTag}>
                {maze.width}×{maze.height}
              </span>
            </div>
            <div className={s.cardBody}>
              <h3 className={s.cardTitle}>{maze.deckName} Maze</h3>
              <p className={s.cardMeta}>Walk on = {maze.targetAnswer}</p>
            </div>
            <button className={s.cardPlay} onClick={() => nav(`/play/maze/${maze.deckId}`)}>
              <Play size={13} /> Play
            </button>
          </div>
        ))}
      </div>
      <Paginator
        totalItems={totalItems}
        pageSize={PAGE_SIZE}
        initialPage={page}
        isLoading={false}
        mode="default"
        onPageChange={(p) => setPage(p)}
      />
    </section>
  );
}
