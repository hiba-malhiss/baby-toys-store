import React from 'react';
import clsx from 'clsx';
import { Tooltip } from '@baby-toys/ui-kit';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import styles from './dashboard-stat-card.module.scss';

type Tone = 'pink' | 'yellow' | 'green' | 'purple';

type Props = {
  tone?: Tone;
  title: string;
  tooltip?: string;
  value: React.ReactNode;
  subValue?: React.ReactNode;
  className?: string;
};

export default function DashboardStatCard({
                                            tone = 'green',
                                            title,
                                            tooltip,
                                            value,
                                            subValue,
                                            className,
                                          }: Props){
  return (
    <div className={clsx(styles.card, styles[tone], className)}>
      <div className={styles.titleRow}>
        <div className={styles.title}>
          {title}
          {tooltip ? (
            <Tooltip content={<div className={styles.tip}>{tooltip}</div>} position="top">
              <span className={styles.infoIcon} aria-label="info">
                <FontAwesomeIcon icon={faCircleInfo}/>
              </span>
            </Tooltip>
          ) : null}
        </div>
      </div>

      <div className={styles.value}>{value}</div>
      {subValue ? <div className={styles.subValue}>{subValue}</div> : null}
    </div>
  );
}
