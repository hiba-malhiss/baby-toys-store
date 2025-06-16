import React from 'react';
import styles from './rating.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as solidStar, faStarHalfAlt } from '@fortawesome/free-solid-svg-icons';
import { faStar as regularStar } from '@fortawesome/free-regular-svg-icons';
import Flex from '../../common/Flex/Flex.tsx';

type RatingProps = {
  value: number;
  max?: number;
};

const Rating: React.FC<RatingProps> = ({ value, max = 5 }) => {
  return (
    <Flex direction="horizontal" spacing="xs">
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

        return <FontAwesomeIcon key={i} icon={icon} className={styles.ratingFilled} />;
      })}
    </Flex>
  );
};

export default Rating;
