import { useNavigate } from 'react-router-dom';
import { Wrench, Gamepad2 } from 'lucide-react';
import s from './RoleSwitcher.module.css';

export default function RoleSwitcher() {
  const nav = useNavigate();

  return (
    <div className={s.page}>
      <div className={s.card}>
        <div className={s.logo}>🎮</div>
        <h1 className={s.title}>Games App</h1>
        <p className={s.subtitle}>Who are you today?</p>
        <div className={s.roles}>
          <button className={s.roleBtn} onClick={() => nav('/admin')}>
            <span className={s.roleEmoji}>
              <Wrench size={32} strokeWidth={2.5} />
            </span>
            <span className={s.roleLabel}>Admin</span>
            <span className={s.roleDesc}>Create &amp; manage games</span>
          </button>
          <button className={s.roleBtn} onClick={() => nav('/play')}>
            <span className={s.roleEmoji}>
              <Gamepad2 size={32} strokeWidth={2.5} />
            </span>
            <span className={s.roleLabel}>Player</span>
            <span className={s.roleDesc}>Pick a game and play</span>
          </button>
        </div>
      </div>
    </div>
  );
}
