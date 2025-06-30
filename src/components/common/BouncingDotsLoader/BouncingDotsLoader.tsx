import styles from './bouncing-dots-loader.module.scss';

const BouncingDotsLoader = ({ scale = 2 }) => {
  return (
    <div
      style={{
        display: 'inline-block',
        transform: `scale(${scale})`,
        transformOrigin: 'center',
        width: 'max-content',
      }}
    >
      <svg
        width={100}
        height={40}
        viewBox="0 0 100 40"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Loading..."
      >
        <circle className={styles.dot} cx="25" cy="25" r="6" />
        <circle className={styles.dot} cx="43" cy="25" r="6" />
        <circle className={styles.dot} cx="61" cy="25" r="6" />
        <circle className={styles.dot} cx="79" cy="25" r="6" />
      </svg>
    </div>
  );
};

export default BouncingDotsLoader;
