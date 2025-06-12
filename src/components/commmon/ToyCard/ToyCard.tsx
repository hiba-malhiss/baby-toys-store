import React from 'react';
import styles from './toy-card.module.scss';
import Chip from '../Chip/Chip';
import Rating from '../Rating/Rating';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faCartShopping } from '@fortawesome/free-solid-svg-icons';
import Flex from '../../layout/Flex/Flex.tsx';
import clsx from 'clsx';

type ToyCardProps = {
  label?: string;
  imageSrc: string;
  name: string;
  price: string;
  rating: number;
  oldPrice?: string;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
};

const ToyCard: React.FC<ToyCardProps> = ({
  isFavorite,
  onToggleFavorite,
  label,
  imageSrc,
  name,
  price,
  rating,
  oldPrice,
}) => {
  return (
    <Flex direction="vertical" className={styles.toyCard}>
      <Flex direction="vertical" align="center" className={styles.toyCardBox}>
        {label && <Chip label={label} className={styles.toyCardChip} />}
        <div className={styles.toyCardIcons}>
          <FontAwesomeIcon
            icon={faHeart}
            className={clsx(styles.toyCardIcon, isFavorite && styles.toyCardIconActive)}
            onClick={onToggleFavorite}
          />
          <FontAwesomeIcon icon={faCartShopping} className={styles.toyCardIcon} />
        </div>
        <div className={styles.toyCardImageWrapper}>
          <img src={imageSrc} alt={name} />
        </div>
      </Flex>
      <div className={styles.toyCardInfo}>
        <div className={styles.toyCardInfoName}>{name}</div>
        <div className={clsx(styles.toyCardInfoPrice, oldPrice && styles.toyCardWithDiscount)}>
          <span className={styles.toyCardInfoPriceNew}>{price}</span>
          {oldPrice && <span className={styles.toyCardInfoPriceOld}>{oldPrice}</span>}
        </div>
        <Rating value={rating} />
      </div>
    </Flex>
  );
};

export default ToyCard;
