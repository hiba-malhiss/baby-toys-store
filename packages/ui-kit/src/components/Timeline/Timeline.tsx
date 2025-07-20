import React from 'react';
import styles from './timeline.module.scss';

type TimelineProps = {
  value?: any[];
  align?: 'left' | 'right';
  layout?: 'vertical' | 'horizontal';
  className?: string;
  content?: (event: any) => React.ReactNode;
  opposite?: (event: any) => React.ReactNode;
  marker?: (event: any) => React.ReactNode;
};

const Timeline = ({
  value = [],
  align = 'left',
  layout = 'vertical',
  className = '',
  content,
  opposite,
  marker,
}: TimelineProps) => {
  return (
    <div
      className={`${styles.timeline} ${styles[`timeline-${layout}`]} ${styles[`timeline-${align}`]} ${className}`}
      data-pc-section="root"
      data-pc-name="timeline"
    >
      {value.map((event, index) => {
        const isLast = index === value.length - 1;

        return (
          <div className={styles.event} key={index} data-pc-section="event">
            <div className={styles.opposite} data-pc-section="opposite">
              {opposite ? opposite(event) : null}
            </div>

            <div className={styles.separator} data-pc-section="separator">
              {marker ? marker(event) : <div className={styles.marker} data-pc-section="marker" />}
              {!isLast && <div className={styles.connector} />}
            </div>

            <div className={styles.content} data-pc-section="content">
              {content ? content(event) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Timeline;
