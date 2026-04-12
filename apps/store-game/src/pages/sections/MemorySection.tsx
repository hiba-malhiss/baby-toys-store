import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play } from 'lucide-react';
import { useMemoryDecksQuery } from '@/api/memoryApi';
import { Paginator } from '@baby-toys/ui-kit';
import s from '../PlayerHub.module.css';

const PAGE_SIZE = 8;

// The default deck counts as 1 extra item, so we offset API pages accordingly.
// Page 1 always shows the default deck + first (PAGE_SIZE - 1) API items.
// Subsequent pages show PAGE_SIZE API items shifted by that offset.

export default function MemorySection() {
  const nav = useNavigate();
  const [page, setPage] = useState(1);

  // Page 1 → api page 0 (we take PAGE_SIZE-1 items to leave room for the default card)
  // Page N → api page N-1 but with a size offset of 1 because of the default card
  const apiPage = page === 1 ? 0 : Math.floor(((page - 1) * PAGE_SIZE - 1) / PAGE_SIZE);
  const apiSize = PAGE_SIZE;

  const { data, isLoading, isFetching } = useMemoryDecksQuery({ page: apiPage, size: apiSize });

  const apiItems = data?.content ?? [];
  const apiTotal = data?.totalElements ?? 0;
  // Total includes the always-present default deck
  const totalItems = apiTotal + 1;

  // Slice out only the items that belong on the current UI page
  const startIndex = page === 1 ? 0 : (page - 1) * PAGE_SIZE - 1;
  const endIndex = startIndex + (page === 1 ? PAGE_SIZE - 1 : PAGE_SIZE);
  const visibleDecks = apiItems.slice(0, page === 1 ? PAGE_SIZE - 1 : PAGE_SIZE);

  return (
    <section className={s.section}>
      <h2 className={s.sectionTitle}>🃏 Memory Match</h2>
      <div className={s.grid}>
        {isLoading && [1, 2, 3].map((i) => <div key={i} className={s.skeleton} />)}

        {!isLoading && (
          <>
            {/* Default deck always shown on page 1 */}
            {page === 1 && (
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
            )}

            {visibleDecks.map((deck) => (
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

            {isFetching &&
              !isLoading &&
              [1, 2].map((i) => <div key={`msk-${i}`} className={s.skeleton} />)}
          </>
        )}
      </div>

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
