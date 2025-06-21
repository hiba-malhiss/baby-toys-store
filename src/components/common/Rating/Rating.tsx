import React from 'react';
import { faStar as solidStar, faStarHalfAlt } from '@fortawesome/free-solid-svg-icons';
import { faStar as regularStar } from '@fortawesome/free-regular-svg-icons';
import Flex from '../../common/Flex/Flex.tsx';
import { Icon } from '../Icon/Icon.tsx';

type RatingProps = {
  value: number;
  max?: number;
  className?: string;
};

const Rating: React.FC<RatingProps> = ({ className, value, max = 5 }) => {
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

        return <Icon key={i} icon={icon} color="warning" />;
      })}
    </Flex>
  );
};

export default Rating;
