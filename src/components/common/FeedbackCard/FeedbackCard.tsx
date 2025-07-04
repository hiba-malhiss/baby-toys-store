import React from 'react';
import Flex from '../../common/Flex/Flex.tsx';
import Rating from '../Rating/Rating.tsx';
import Avatar from '../Avatar/Avatar.tsx';
import styles from './feedback-card.module.scss';
import type { Feedback } from '../../../types/product.types.ts';
import clsx from 'clsx';
import { formatDate } from '../../../util/format.utils.ts';

type FeedbackCardProps = {
  feedback: Feedback;
  fullHeight?: boolean;
  appearance?: 'main' | 'detailed';
  withoutPadding?: boolean;
};

const FeedbackCard: React.FC<FeedbackCardProps> = ({
  feedback,
  appearance,
  fullHeight,
  withoutPadding,
}) => {
  const { rating, name, avatarUrl, comment, date } = feedback;

  return (
    <Flex
      direction="vertical"
      className={clsx(
        styles.feedbackCard,
        fullHeight && styles.feedbackCardFullHeight,
        withoutPadding && styles.withoutPadding,
        appearance === 'detailed' && styles.feedbackCardDetailed
      )}
    >
      <Flex align="center" spacing="s" className={styles.feedbackCardAvatarBlock}>
        <Avatar src={avatarUrl} size="small" />
        <div className={styles.feedbackCardName}>{name}</div>
        {appearance === 'detailed' && (
          <div className={styles.feedbackCardDate}>{formatDate(date)}</div>
        )}
      </Flex>
      <Rating value={rating} className={styles.feedbackCardRating} />
      {comment && <p className={styles.feedbackCardComment}>{comment}</p>}
    </Flex>
  );
};

export default FeedbackCard;
