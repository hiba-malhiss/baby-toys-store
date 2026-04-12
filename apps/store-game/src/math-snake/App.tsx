import { useState, useCallback } from 'react';
import { GameView } from './components/GameView';
import { AdminView } from './components/AdminView';
import { loadDecks } from './utils/storage';
import type { Deck } from './types';
import styles from './App.module.css';

type Tab = 'game' | 'admin';

export default function App() {
  const [tab, setTab] = useState<Tab>('game');
  const [decks, setDecks] = useState<Deck[]>(loadDecks);

  const refreshDecks = useCallback(() => {
    setDecks(loadDecks());
  }, []);

  return (
    <div>
      <nav className={styles.tabs}>
        <button
          className={`${styles.tab} ${tab === 'game' ? styles.tabActive : ''}`}
          onClick={() => setTab('game')}
        >
          🐍 Game
        </button>
        <button
          className={`${styles.tab} ${tab === 'admin' ? styles.tabActive : ''}`}
          onClick={() => setTab('admin')}
        >
          ⚙️ Admin
        </button>
      </nav>

      {tab === 'game' && <GameView decks={decks} />}
      {tab === 'admin' && <AdminView decks={decks} onDecksChange={refreshDecks} />}
    </div>
  );
}
