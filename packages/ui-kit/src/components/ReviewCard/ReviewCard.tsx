import React from 'react';
import Flex from '../Flex/Flex.tsx';
import Rating from '../Rating/Rating.tsx';
import Avatar from '../Avatar/Avatar.tsx';
import styles from './review-card.module.scss';
import type { Review } from '../../../types/product.types.ts';
import clsx from 'clsx';
import { formatDate } from '../../utils';

type ReviewCardProps = {
  review: Review;
  fullHeight?: boolean;
  appearance?: 'main' | 'detailed';
  withoutPadding?: boolean;
};

const ReviewCard: React.FC<ReviewCardProps> = ({
  review,
  appearance,
  fullHeight,
  withoutPadding,
}) => {
  const { rating, name, avatarUrl, comment, date } = review;

  return (
    <Flex
      direction="vertical"
      className={clsx(
        styles.reviewCard,
        fullHeight && styles.reviewCardFullHeight,
        withoutPadding && styles.withoutPadding,
        appearance === 'detailed' && styles.reviewCardDetailed
      )}
    >
      <Flex align="center" spacing="s" className={styles.reviewCardAvatarBlock}>
        <Avatar src={avatarUrl} size="small" />
        <div className={styles.reviewCardName}>{name}</div>
        {appearance === 'detailed' && (
          <div className={styles.reviewCardDate}>{formatDate(date)}</div>
        )}
      </Flex>
      <Rating value={rating} className={styles.reviewCardRating} />
      {comment && <p className={styles.reviewCardComment}>{comment}</p>}
    </Flex>
  );
};

export default ReviewCard;
