import React from 'react';
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
};

const Rating: React.FC<RatingProps> = ({ size, className, value, max = 5, onChange }) => {
  const handleStarClick = (starIndex: number) => {
    if (onChange) {
      onChange(starIndex + 1);
    }
  };

  return (
    <Flex direction="horizontal" spacing="xs" className={className}>
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
    </Flex>
  );
};

export default Rating;
