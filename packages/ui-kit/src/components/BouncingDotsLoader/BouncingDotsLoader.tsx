import React, { forwardRef } from 'react';
import styles from './bouncing-dots-loader.module.scss';

type BouncingDotsLoaderProps = {
  className?: string;
  size?: 'small' | 'medium' | 'large';
};

const BouncingDotsLoader = forwardRef<HTMLDivElement, BouncingDotsLoaderProps>(
  ({ className, size = 'large' }, ref) => {
    const radius = size === 'large' ? 12 : size === 'medium' ? 8 : 5;
    const dotsCount = 4;
    const width = size === 'large' ? 180 : size === 'medium' ? 150 : 120;
    const height = size === 'large' ? 60 : size === 'medium' ? 50 : 40;
    const cy = height / 2;

    const gap = radius / 2 + 4;
    const totalGaps = (dotsCount - 1) * gap;
    const totalDotWidth = dotsCount * radius * 2;
    const padding = (width - totalDotWidth - totalGaps) / 2 + 8;
    const step = 2 * radius + gap;

    const positions = Array.from({ length: dotsCount }, (_, i) => padding + step * i);

    return (
      <div
        ref={ref}
        className={className}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transformOrigin: 'center',
          width: '100%',
        }}
      >
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Loading..."
        >
          {positions.map((cx, i) => (
            <circle
              key={i}
              className={`${styles.dot} ${styles[`dot${i + 1}`]}`}
              cx={cx}
              cy={cy}
              r={radius}
            />
          ))}
        </svg>
      </div>
    );
  }
);

export default BouncingDotsLoader;
