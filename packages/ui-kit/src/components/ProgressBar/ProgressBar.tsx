import React from 'react';
import styles from './progress-bar.module.scss';
import clsx from 'clsx';

interface ProgressBarProps {
  progress: number;
  className: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, className }) => {
  return (
    <div className={clsx(styles.progressBar, className)}>
      <div className={styles.progressBarFilled} style={{ width: `${progress}%` }} />
    </div>
  );
};

export default ProgressBar;
