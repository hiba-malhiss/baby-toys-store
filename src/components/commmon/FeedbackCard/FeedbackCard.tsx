import React from 'react';
import Flex from '../../layout/Flex/Flex.tsx';
import Rating from '../Rating/Rating.tsx';
import Avatar from '../Avatar/Avatar.tsx';
import styles from './feedback-card.module.scss';
import type { Feedback } from '../../../types/toy.types.ts';

type FeedbackCardProps = {
  feedback: Feedback;
};

const FeedbackCard: React.FC<FeedbackCardProps> = ({ feedback }) => {
  const { rating, name, avatarUrl, comment } = feedback;
  return (
    <Flex direction="vertical" className={styles.feedbackCard}>
      <Rating value={rating} />
      {comment && <p className={styles.feedbackCardComment}>{comment}</p>}
      <Flex align="center" spacing="s">
        <Avatar src={avatarUrl} size="small" />
        <div className={styles.feedbackCardName}>{name}</div>
      </Flex>
    </Flex>
  );
};

export default FeedbackCard;
