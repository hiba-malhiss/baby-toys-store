import React from 'react';
import styles from './toy-card.module.scss';
import Chip from '../Chip/Chip';
import Rating from '../Rating/Rating';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faCartShopping } from '@fortawesome/free-solid-svg-icons';
import Flex from '../../common/Flex/Flex.tsx';
import clsx from 'clsx';
import type { Toy } from '../../../types/toy.types.ts';
import Card from '../Card/Card.tsx';

type ToyCardProps = {
  toy: Toy;
  onToggleFavorite?: () => void;
};

const ToyCard: React.FC<ToyCardProps> = ({ toy, onToggleFavorite }) => {
  return (
    <Flex direction="vertical" className={styles.toyCard}>
      <Card size="small" className={styles.toyCardBox}>
        {toy.label && <Chip label={toy.label} className={styles.toyCardChip} />}
        <div className={styles.toyCardIcons}>
          <FontAwesomeIcon
            icon={faHeart}
            className={clsx(styles.toyCardIcon, toy.isFavorite && styles.toyCardIconActive)}
            onClick={onToggleFavorite}
          />
          <FontAwesomeIcon icon={faCartShopping} className={styles.toyCardIcon} />
        </div>
        <div className={styles.toyCardImageWrapper}>
          <img src={toy.imageSrc} alt={toy.name} />
        </div>
      </Card>
      <div className={styles.toyCardInfo}>
        <div className={styles.toyCardInfoName}>{toy.name}</div>
        <div className={clsx(styles.toyCardInfoPrice, toy.oldPrice && styles.toyCardWithDiscount)}>
          <span className={styles.toyCardInfoPriceNew}>{toy.price}</span>
          {toy.oldPrice && <span className={styles.toyCardInfoPriceOld}>{toy.oldPrice}</span>}
        </div>
        <Rating value={toy.rating} />
      </div>
    </Flex>
  );
};
export default ToyCard;
