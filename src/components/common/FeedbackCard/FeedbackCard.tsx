import React from 'react';
import Flex from '../../common/Flex/Flex.tsx';
import Rating from '../Rating/Rating.tsx';
import Avatar from '../Avatar/Avatar.tsx';
import styles from './feedback-card.module.scss';
import type { Feedback } from '../../../types/toy.types.ts';
import clsx from 'clsx';

type FeedbackCardProps = {
  feedback: Feedback;
  fullHeight?: boolean;
};

const FeedbackCard: React.FC<FeedbackCardProps> = ({ feedback, fullHeight }) => {
  const { rating, name, avatarUrl, comment } = feedback;
  return (
    <Flex
      direction="vertical"
      className={clsx(styles.feedbackCard, fullHeight && styles.feedbackCardFullHeight)}
    >
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
