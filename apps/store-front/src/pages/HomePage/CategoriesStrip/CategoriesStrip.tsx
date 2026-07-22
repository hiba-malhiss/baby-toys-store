import { useNavigate } from 'react-router-dom';
import { useCategories } from '../../../api/catalogApi.ts';
import styles from './categories-strip.module.scss';

const CategoriesStrip = () => {
  const { data: categories = [], isLoading } = useCategories();
  const navigate = useNavigate();

  if (isLoading || !categories.length) return null;

  const mainCategories = categories.filter((cat: any) => cat.isMain);

  return (
    <div className={styles.section}>
      <div className={styles.strip}>
        {mainCategories.map((cat: any) => (
          <button
            key={cat.id}
            className={styles.item}
            onClick={() => navigate(`/shop?categoryIds=${encodeURIComponent(cat.id)}`)}
          >
            <div className={styles.circle}>
              <img
                src={cat.imageUrl || '/assets/educational-toys.svg'}
                alt={cat.name}
                className={styles.image}
              />
            </div>
            <span className={styles.label}>{cat.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoriesStrip;
