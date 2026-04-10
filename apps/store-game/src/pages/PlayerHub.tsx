import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBoardsQuery } from '@/api/boardApi';
import { useMemoryDecksQuery } from '@/api/memoryApi';
import { Play, ChevronDown, Loader2 } from 'lucide-react';
import { useBoardThumbnail } from '../hooks/useBoardThumbnail';
import s from './PlayerHub.module.css';

const PAGE_SIZE = 8;

// ── Board card — isolated so each gets its own canvas hook instance ───
function BoardCard({ board, onPlay }: {
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
        <p className={s.cardMeta}>{board.width}×{board.height} grid</p>
      </div>
      <button className={s.cardPlay} onClick={onPlay}>
        <Play size={13} /> Play
      </button>
    </div>
  );
}

// ── Generic "View more" footer ────────────────────────────────────────
function ViewMoreFooter({ shown, total, isLoading, onViewMore }: {
  shown: number;
  total: number;
  isLoading: boolean;
  onViewMore: () => void;
}) {
  if (shown >= total) return null;
  return (
    <div className={s.viewMoreRow}>
      <span className={s.viewMoreCount}>{shown} of {total}</span>
      <button className={s.viewMoreBtn} onClick={onViewMore} disabled={isLoading}>
        {isLoading
          ? <><Loader2 size={15} className={s.spin} /> Loading…</>
          : <><ChevronDown size={15} /> View more</>
        }
      </button>
    </div>
  );
}

export default function PlayerHub() {
  const nav = useNavigate();

  // ── Board pagination state ──────────────────────────────────────────
  const [boardPage, setBoardPage] = useState(0);
  const [allBoards, setAllBoards] = useState<any[]>([]);

  const { data: boardsData, isLoading: boardsLoading, isFetching: boardsFetching } =
    useBoardsQuery({ page: boardPage, size: PAGE_SIZE });

  // Accumulate pages as they arrive
  const newBoards = boardsData?.content ?? [];
  const boardsTotal = boardsData?.totalElements ?? 0;

  // Merge new page into accumulated list (avoid duplicates on re-render)
  const mergedBoards = (() => {
    if (!newBoards.length) return allBoards;
    const ids = new Set(allBoards.map((b) => b.id));
    const fresh = newBoards.filter((b) => !ids.has(b.id));
    if (!fresh.length) return allBoards;
    return [...allBoards, ...fresh];
  })();

  // Sync merged list into state only when new items arrive
  if (mergedBoards.length !== allBoards.length) {
    setAllBoards(mergedBoards);
  }

  // ── Memory pagination state ─────────────────────────────────────────
  const [memoryPage, setMemoryPage] = useState(0);
  const [allMemory, setAllMemory] = useState<any[]>([]);

  const { data: memoryData, isLoading: memoryLoading, isFetching: memoryFetching } =
    useMemoryDecksQuery({ page: memoryPage, size: PAGE_SIZE });

  const newMemory = memoryData?.content ?? [];
  const memoryTotal = (memoryData?.totalElements ?? 0) + 1; // +1 for built-in default

  const mergedMemory = (() => {
    if (!newMemory.length) return allMemory;
    const ids = new Set(allMemory.map((d) => d.id));
    const fresh = newMemory.filter((d) => !ids.has(d.id));
    if (!fresh.length) return allMemory;
    return [...allMemory, ...fresh];
  })();

  if (mergedMemory.length !== allMemory.length) {
    setAllMemory(mergedMemory);
  }

  return (
    <div className={s.page}>
      {/* Hero */}
      <div className={s.hero}>
        <p className={s.heroEyebrow}>Our Collections</p>
        <h1 className={s.heroTitle}>Find the Perfect Game</h1>
        <p className={s.heroSub}>Top picks for your little ones</p>
      </div>

      <div className={s.inner}>

        {/* ── Memory Match ─────────────────────────────────────────── */}
        <section className={s.section}>
          <h2 className={s.sectionTitle}>🃏 Memory Match</h2>

          <div className={s.grid}>
            {memoryLoading && [1, 2, 3].map((i) => <div key={i} className={s.skeleton} />)}

            {!memoryLoading && (
              <>
                {/* Built-in default deck — always first */}
                <div className={s.gameCard}>
                  <div className={s.cardImage}>
                    <span className={s.cardEmoji}>🃏</span>
                    <span className={s.cardBadge}>Memory</span>
                  </div>
                  <div className={s.cardBody}>
                    <h3 className={s.cardTitle}>Default Deck</h3>
                    <p className={s.cardMeta}>12 equation pairs · built-in</p>
                  </div>
                  <button className={s.cardPlay} onClick={() => nav('/play/memory/default')}>
                    <Play size={13} /> Play
                  </button>
                </div>

                {mergedMemory.map((deck) => (
                  <div key={deck.id} className={s.gameCard}>
                    <div className={s.cardImage}>
                      <span className={s.cardEmoji}>🃏</span>
                      <span className={s.cardBadge}>Memory</span>
                    </div>
                    <div className={s.cardBody}>
                      <h3 className={s.cardTitle}>{deck.name}</h3>
                      <p className={s.cardMeta}>{deck.pairCount} pairs</p>
                    </div>
                    <button className={s.cardPlay} onClick={() => nav(`/play/memory/${deck.id}`)}>
                      <Play size={13} /> Play
                    </button>
                  </div>
                ))}

                {/* Skeleton rows while loading next page */}
                {memoryFetching && !memoryLoading &&
                  [1, 2].map((i) => <div key={`msk-${i}`} className={s.skeleton} />)
                }
              </>
            )}
          </div>

          <ViewMoreFooter
            shown={mergedMemory.length + 1} // +1 for default deck
            total={memoryTotal}
            isLoading={memoryFetching && !memoryLoading}
            onViewMore={() => setMemoryPage((p) => p + 1)}
          />
        </section>

        {/* ── Paint by Equation ────────────────────────────────────── */}
        <section className={s.section}>
          <h2 className={s.sectionTitle}>🎨 Paint by Equation</h2>

          {boardsLoading && (
            <div className={s.grid}>
              {[1, 2, 3].map((i) => <div key={i} className={s.skeleton} />)}
            </div>
          )}

          {!boardsLoading && allBoards.length === 0 && (
            <p className="empty-text">No boards available yet. Ask an admin to create one.</p>
          )}

          {!boardsLoading && allBoards.length > 0 && (
            <div className={s.grid}>
              {allBoards.map((b) => (
                <BoardCard key={b.id} board={b} onPlay={() => nav(`/play/board/${b.id}`)} />
              ))}

              {/* Skeleton cards while loading next page */}
              {boardsFetching && !boardsLoading &&
                [1, 2].map((i) => <div key={`bsk-${i}`} className={s.skeleton} />)
              }
            </div>
          )}

          <ViewMoreFooter
            shown={allBoards.length}
            total={boardsTotal}
            isLoading={boardsFetching && !boardsLoading}
            onViewMore={() => setBoardPage((p) => p + 1)}
          />
        </section>

      </div>
    </div>
  );
}
