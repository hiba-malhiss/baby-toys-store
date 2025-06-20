import React from 'react';
import styles from './info-card.module.scss';
import Flex from '../../common/Flex/Flex.tsx';
import clsx from 'clsx';
import type { InfoCardType } from '../../../types/product.types.ts';
import { Icon } from '../Icon/Icon.tsx';

type InfoCardProps = {
  card: InfoCardType;
};

const appearanceClassMap: Record<string, string> = {
  info: styles.infoCardInfo,
  warning: styles.infoCardWarning,
  success: styles.infoCardSuccess,
};

const IconColor: Record<string, string> = {
  info: 'info',
  warning: 'ternary',
  success: 'success',
};

const InfoCard: React.FC<InfoCardProps> = ({ card }) => {
  const { appearance = 'info', icon, title, content } = card;

  return (
    <Flex
      direction="vertical"
      spacing="xs"
      align="center"
      justify="center"
      className={clsx(styles.infoCard, appearanceClassMap[appearance])}
    >
      <Icon icon={icon} color={IconColor[appearance]} size="xxxlarge" />
      <h4 className={styles.infoCardTitle}>{title}</h4>
      <p className={styles.infoCardContent}>{content}</p>
    </Flex>
  );
};

export default InfoCard;
