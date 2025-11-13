import React from 'react';
import styles from './rating.module.scss';
import { faStar as solidStar, faStarHalfAlt } from '@fortawesome/free-solid-svg-icons';
import { faStar as regularStar } from '@fortawesome/free-regular-svg-icons';
import Flex from '../Flex/Flex.tsx';
import Icon from '../Icon/Icon.tsx';
import type { IconSize } from '../Icon/icon.constant.ts';
import { IconColor } from '../Icon/icon.constant.ts';

type RatingProps = {
  value: number;
  size?: IconSize;
  max?: number;
  className?: string;
  onChange?: (value: number) => void;
  reviewsCount?: number;
};

const Rating: React.FC<RatingProps> = ({ size, className, value, max = 5, onChange, reviewsCount }) => {
  const handleStarClick = (starIndex: number) => {
    if (onChange) {
      onChange(starIndex + 1);
    }
  };

  return (
    <Flex direction="horizontal" spacing="xs" className={className} align="center">
      {Array.from({ length: max }).map((_, i) => {
        const diff = value - i;

        let icon;
        if (diff >= 1) {
          icon = solidStar; // full star
        } else if (diff >= 0.5) {
          icon = faStarHalfAlt; // half star
        } else {
          icon = regularStar; // empty star
        }

        return (
          <span
            key={i}
            onClick={() => handleStarClick(i)}
            style={{ cursor: onChange ? 'pointer' : 'default' }}
            aria-label={`Rate ${i + 1} star${i > 0 ? 's' : ''}`}
            tabIndex={onChange ? 0 : -1}
            onKeyDown={(e) => {
              if (onChange && (e.key === 'Enter' || e.key === ' ')) {
                handleStarClick(i);
              }
            }}
          >
            <Icon key={i} icon={icon} color={IconColor.warning} size={size} />
          </span>
        );
      })}
      {typeof reviewsCount === 'number' && (
        <span aria-label={`Reviews count: ${reviewsCount}`} className={styles.ratingCount}>
          ({reviewsCount})
        </span>
      )}
    </Flex>
  );
};

export default Rating;
