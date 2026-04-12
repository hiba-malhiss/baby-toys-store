import MazeSection from './sections/MazeSection';
import MemorySection from './sections/MemorySection';
import PaintByEquationSection from './sections/PaintByEquationSection';
import SnakeSection from './sections/SnakeSection';
import s from './PlayerHub.module.css';

export default function PlayerHub() {
  return (
    <div className={s.page}>
      <div className={s.hero}>
        <p className={s.heroEyebrow}>Our Collections</p>
        <h1 className={s.heroTitle}>Find the Perfect Game</h1>
        <p className={s.heroSub}>Top picks for your little ones</p>
      </div>

      <div className={s.inner}>
        <MazeSection />
        <MemorySection />
        <PaintByEquationSection />
        <SnakeSection />
      </div>
    </div>
  );
}
