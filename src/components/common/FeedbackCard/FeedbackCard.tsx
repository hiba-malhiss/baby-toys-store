import React from 'react';
import Flex from '../../common/Flex/Flex.tsx';
import Rating from '../Rating/Rating.tsx';
import Avatar from '../Avatar/Avatar.tsx';
import styles from './feedback-card.module.scss';
import type { Feedback } from '../../../types/product.types.ts';
import clsx from 'clsx';

type FeedbackCardProps = {
  feedback: Feedback;
  fullHeight?: boolean;
  appearance?: 'main' | 'detailed';
};

const FeedbackCard: React.FC<FeedbackCardProps> = ({ feedback, appearance, fullHeight }) => {
  const { rating, name, avatarUrl, comment } = feedback;
  return (
    <Flex
      direction="vertical"
      className={clsx(
        styles.feedbackCard,
        fullHeight && styles.feedbackCardFullHeight,
        appearance === 'detailed' && styles.feedbackCardDetailed
      )}
    >
      <Flex align="center" spacing="s" className={styles.feedbackCardAvatarBlock}>
        <Avatar src={avatarUrl} size="small" />
        <div className={styles.feedbackCardName}>{name}</div>
      </Flex>
      <Rating value={rating} className={styles.feedbackCardRating} />
      {comment && <p className={styles.feedbackCardComment}>{comment}</p>}
    </Flex>
  );
};

export default FeedbackCard;
