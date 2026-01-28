import React, { useState } from 'react';
import clsx from 'clsx';
import styles from './rating.module.scss';
import { Star, StarHalf } from 'lucide-react';
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

const Rating: React.FC<RatingProps> = ({
  size,
  className,
  value,
  max = 5,
  onChange,
  reviewsCount,
}) => {
  const handleStarClick = (starIndex: number) => {
    if (onChange) {
      onChange(starIndex + 1);
    }
  };

  const isInteractive = Boolean(onChange);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <Flex
      direction="horizontal"
      spacing="xs"
      className={className}
      align="center"
      onMouseLeave={
        isInteractive
          ? () => {
              setHoveredIndex(null);
            }
          : undefined
      }
    >
      {Array.from({ length: max }).map((_, i) => {
        const diff = value - i;

        let icon;
        if (diff >= 1) {
          icon = Star; // full star
        } else if (diff >= 0.5) {
          icon = StarHalf; // half star
        } else {
          icon = Star; // empty star
        }

        const isHoverChain = isInteractive && hoveredIndex !== null && hoveredIndex >= i;
        const isHighlighted = diff >= 0.5 || isHoverChain;

        const starClassName = clsx(styles.ratingStar, {
          [styles.ratingStarHighlighted]: isHighlighted,
          [styles.ratingStarEmpty]: !isHighlighted,
          [styles.ratingStarInteractive]: isInteractive,
          [styles.ratingStarHovered]: isHoverChain,
        });

        const iconColor = isHighlighted ? IconColor.warning : IconColor.gray;

        return (
          <span
            key={i}
            className={starClassName}
            onClick={() => handleStarClick(i)}
            onMouseEnter={
              isInteractive
                ? () => {
                    setHoveredIndex(i);
                  }
                : undefined
            }
            onMouseLeave={
              isInteractive
                ? () => {
                    setHoveredIndex((current) => (current === i ? null : current));
                  }
                : undefined
            }
            aria-label={`Rate ${i + 1} star${i > 0 ? 's' : ''}`}
            tabIndex={isInteractive ? 0 : -1}
            onKeyDown={(e) => {
              if (onChange && (e.key === 'Enter' || e.key === ' ')) {
                handleStarClick(i);
              }
            }}
          >
            <Icon key={i} icon={icon} color={iconColor} size={size} filled={isHighlighted} />
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
