import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play } from 'lucide-react';
import { loadDecks, type Deck } from '../../math-snake/utils/storage';
import s from '../PlayerHub.module.css';

export default function SnakeSection() {
  const nav = useNavigate();
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDecksData = async () => {
    try {
      const decksData = await loadDecks();
      setDecks(decksData);
    } catch (error) {
      console.error('Failed to load decks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDecksData();
  }, []);

  return (
    <section className={s.section}>
      <h2 className={s.sectionTitle}>Math Snake</h2>
      <div className={s.grid}>
        {loading && [1, 2, 3].map((i) => <div key={i} className={s.skeleton} />)}

        {!loading && (
          <>
            {/* Default snake game */}
            <div className={s.gameCard}>
              <div className={s.cardImage}>
                <span className={s.cardEmoji}>Snake</span>
                <span className={s.cardBadge}>Math</span>
              </div>
              <div className={s.cardBody}>
                <h3 className={s.cardTitle}>Math Snake</h3>
                <p className={s.cardMeta}>Classic snake game with math equations</p>
              </div>
              <button className={s.cardPlay} onClick={() => nav('/play/snake')}>
                <Play size={13} /> Play
              </button>
            </div>

            {/* Custom decks */}
            {decks.map((deck) => (
              <div key={deck.id} className={s.gameCard}>
                <div className={s.cardImage}>
                  <span className={s.cardEmoji}>Snake</span>
                  <span className={s.cardBadge}>Math</span>
                </div>
                <div className={s.cardBody}>
                  <h3 className={s.cardTitle}>{deck.name}</h3>
                  <p className={s.cardMeta}>{deck.equations.length} equations</p>
                </div>
                <button className={s.cardPlay} onClick={() => nav(`/play/snake?deck=${deck.id}`)}>
                  <Play size={13} /> Play
                </button>
              </div>
            ))}
          </>
        )}
      </div>
    </section>
  );
}
