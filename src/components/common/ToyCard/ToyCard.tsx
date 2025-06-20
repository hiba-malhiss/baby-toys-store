import React from 'react';
import styles from './toy-card.module.scss';
import Chip from '../Chip/Chip';
import Rating from '../Rating/Rating';
import { faHeart, faCartShopping } from '@fortawesome/free-solid-svg-icons';
import clsx from 'clsx';
import type { Toy } from '../../../types/toy.types.ts';
import Card from '../Card/Card.tsx';
import { Button } from '../Button/Button.tsx';
import Flex from '../Flex/Flex.tsx';

type ToyCardProps = {
  direction?: 'horizontal' | 'vertical';
  size?: 'small';
  toy: Toy;
  onToggleFavorite?: () => void;
};

const ToyCard: React.FC<ToyCardProps> = ({
  size,
  toy,
  onToggleFavorite,
  direction = 'vertical',
}) => {
  const isHorizontal = direction === 'horizontal';
  const isSmallSize = size === 'small';

  const renderButtons = () => (
    <Flex
      className={styles.toyCardButtons}
      spacing={direction === 'vertical' ? 'none' : 'xl'}
      align="center"
      direction={direction}
    >
      {direction === 'vertical' && (
        <Button leftIcon={faCartShopping} appearance="secondary-link" size="xlarge" />
      )}
      {direction === 'horizontal' && (
        <Button leftIcon={faCartShopping} appearance="primary" size="large">
          Add to cart
        </Button>
      )}
      <Button
        leftIcon={faHeart}
        appearance="secondary-link"
        size="xlarge"
        isSelected={toy.isFavorite}
        onClick={onToggleFavorite}
      />
    </Flex>
  );

  return (
    <div
      className={clsx(
        styles.toyCard,
        isHorizontal && styles.toyCardHorizontal,
        size === 'small' && styles.toyCardSmall
      )}
    >
      <Card size="small" className={styles.toyCardBox}>
        {toy.label && !isSmallSize && <Chip label={toy.label} className={styles.toyCardChip} />}

        {!isHorizontal && !isSmallSize && renderButtons()}
        <div className={styles.toyCardImageWrapper}>
          <img src={toy.imageSrc} alt={toy.name} />
        </div>
      </Card>
      <div className={styles.toyCardInfo}>
        <div className={styles.toyCardInfoName}>{toy.name}</div>
        {isHorizontal && toy.description && !isSmallSize && (
          <div className={styles.toyCardInfoDescription}>{toy.description}</div>
        )}
        <div className={clsx(styles.toyCardInfoPrice, toy.oldPrice && styles.toyCardWithDiscount)}>
          <span className={styles.toyCardInfoPriceNew}>{toy.price}</span>
          {toy.oldPrice && <span className={styles.toyCardInfoPriceOld}>{toy.oldPrice}</span>}
        </div>
        <Rating value={toy.rating} />
        {isHorizontal && !isSmallSize && renderButtons()}
      </div>
    </div>
  );
};

export default ToyCard;
