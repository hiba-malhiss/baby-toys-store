import React from 'react';
import styles from './toy-card.module.scss';
import Chip from '../Chip/Chip';
import Rating from '../Rating/Rating';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faCartShopping } from '@fortawesome/free-solid-svg-icons';
import clsx from 'clsx';
import type { Toy } from '../../../types/toy.types.ts';
import Card from '../Card/Card.tsx';
import { Button } from '../Button/Button.tsx';
import Flex from '../Flex/Flex.tsx';

type ToyCardProps = {
  direction?: 'horizontal' | 'vertical';
  toy: Toy;
  onToggleFavorite?: () => void;
};

const ToyCard: React.FC<ToyCardProps> = ({ toy, onToggleFavorite, direction = 'vertical' }) => {
  const isHorizontal = direction === 'horizontal';

  const renderButtons = () => (
    <Flex
      className={styles.toyCardButtons}
      spacing={direction === 'vertical' ? 's' : 'xl'}
      align="center"
      direction={direction}
    >
      {direction === 'vertical' && (
        <FontAwesomeIcon icon={faCartShopping} className={styles.toyCardIcon} />
      )}
      {direction === 'horizontal' && (
        <Button leftIcon={faCartShopping} appearance="primary" size="large">
          Add to cart
        </Button>
      )}
      <FontAwesomeIcon
        icon={faHeart}
        className={clsx(styles.toyCardIcon, toy.isFavorite && styles.toyCardIconActive)}
        onClick={onToggleFavorite}
      />
    </Flex>
  );

  return (
    <div className={clsx(styles.toyCard, isHorizontal && styles.toyCardHorizontal)}>
      <Card size="small" className={styles.toyCardBox}>
        {toy.label && <Chip label={toy.label} className={styles.toyCardChip} />}

        {!isHorizontal && renderButtons()}
        <div className={styles.toyCardImageWrapper}>
          <img src={toy.imageSrc} alt={toy.name} />
        </div>
      </Card>
      <div className={styles.toyCardInfo}>
        <div className={styles.toyCardInfoName}>{toy.name}</div>

        {isHorizontal && toy.description && (
          <div className={styles.toyCardInfoDescription}>{toy.description}</div>
        )}
        <div className={clsx(styles.toyCardInfoPrice, toy.oldPrice && styles.toyCardWithDiscount)}>
          <span className={styles.toyCardInfoPriceNew}>{toy.price}</span>
          {toy.oldPrice && <span className={styles.toyCardInfoPriceOld}>{toy.oldPrice}</span>}
        </div>
        <Rating value={toy.rating} />
        {isHorizontal && renderButtons()}
      </div>
    </div>
  );
};

export default ToyCard;
