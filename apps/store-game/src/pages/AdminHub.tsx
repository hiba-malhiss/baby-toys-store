import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import s from './AdminHub.module.css';

const GAMES = [
  {
    emoji: '🧩',
    name: 'Board Games',
    desc: 'Create paint-by-equation boards. Design grids, assign colors and equations, and publish for players.',
    path: '/admin/board',
  },
  {
    emoji: '🃏',
    name: 'Memory Decks',
    desc: 'Build equation–answer card decks for the memory match game.',
    path: '/admin/memory',
  },
  {
    emoji: '🗺️',
    name: 'Math Mazes',
    desc: 'Turn any memory deck into a maze. Players navigate by stepping on cells whose equation matches the target answer.',
    path: '/admin/maze',
  },
];

export default function AdminHub() {
  const nav = useNavigate();

  return (
    <div className={s.page}>
      <div className={s.inner}>
        <p className={s.eyebrow}>Admin Panel</p>
        <h1 className={s.title}>🛠️ Manage Games</h1>
        <p className={s.subtitle}>Create and publish games for players</p>

        <div className={s.grid}>
          {GAMES.map((g) => (
            <button key={g.path} className={s.gameCard} onClick={() => nav(g.path)}>
              <span className={s.gameEmoji}>{g.emoji}</span>
              <h2 className={s.gameName}>{g.name}</h2>
              <p className={s.gameDesc}>{g.desc}</p>
              <span className={s.gameArrow}>
                <ArrowRight size={18} />
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
