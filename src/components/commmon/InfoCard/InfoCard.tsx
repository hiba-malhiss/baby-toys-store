import React from 'react';
import styles from './info-card.module.scss';
import Flex from '../../layout/Flex/Flex.tsx';
import clsx from 'clsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { InfoCardType } from '../../../types/toy.types.ts';

type InfoCardProps = {
  card: InfoCardType;
};

const appearanceClassMap: Record<string, string> = {
  info: styles.infoCardInfo,
  warning: styles.infoCardWarning,
  success: styles.infoCardSuccess,
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
      <FontAwesomeIcon icon={icon} className={styles.infoCardIcon} />
      <h4 className={styles.infoCardTitle}>{title}</h4>
      <p className={styles.infoCardContent}>{content}</p>
    </Flex>
  );
};

export default InfoCard;
