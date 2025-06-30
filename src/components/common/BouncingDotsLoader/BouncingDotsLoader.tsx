import styles from './bouncing-dots-loader.module.scss';

const BouncingDotsLoader = ({ className }: { className: string }) => {
  const radius = 12;
  const dotsCount = 4;
  const width = 180;
  const height = 60;
  const cy = height / 2;

  // Calculate cx positions evenly spaced inside width with padding = radius
  const padding = radius * 3;
  const step = (width - padding * 2) / (dotsCount - 1);
  const positions = Array.from({ length: dotsCount }, (_, i) => padding + step * i);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transformOrigin: 'center',
        width: '100%',
      }}
      className={className}
    >
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Loading..."
      >
        {positions.map((cx, i) => (
          <circle key={i} className={styles.dot} cx={cx} cy={cy} r={radius} />
        ))}
      </svg>
    </div>
  );
};

export default BouncingDotsLoader;
