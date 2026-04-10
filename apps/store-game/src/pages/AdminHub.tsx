import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import s from './AdminHub.module.css';

export default function AdminHub() {
  const nav = useNavigate();

  return (
    <div className={s.page}>
      <div className={s.inner}>
        <p className={s.eyebrow}>Admin Panel</p>
        <h1 className={s.title}>🛠️ Manage Games</h1>
        <p className={s.subtitle}>Create and publish games for players</p>

        <div className={s.grid}>
          <button className={s.gameCard} onClick={() => nav('/admin/board')}>
            <span className={s.gameEmoji}>🧩</span>
            <h2 className={s.gameName}>Board Games</h2>
            <p className={s.gameDesc}>
              Create and manage paint-by-equation boards. Design grids, assign colors and equations,
              and publish for players.
            </p>
            <span className={s.gameArrow}>
              <ArrowRight size={18} />
            </span>
          </button>

          <button className={s.gameCard} onClick={() => nav('/admin/memory')}>
            <span className={s.gameEmoji}>🃏</span>
            <h2 className={s.gameName}>Memory Decks</h2>
            <p className={s.gameDesc}>
              Build equation–answer card decks for the memory match game. Stored locally in the
              browser.
            </p>
            <span className={s.gameArrow}>
              <ArrowRight size={18} />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
