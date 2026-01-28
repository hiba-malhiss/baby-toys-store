import React from 'react';
import type { ComponentType } from 'react';
import styles from './info-card.module.scss';
import Flex from '../Flex/Flex.tsx';
import clsx from 'clsx';
import Icon from '../Icon/Icon.tsx';

export type InfoCardType = {
  appearance?: 'info' | 'warning' | 'success' | 'primary';
  icon?: ComponentType<any> | null;
  title: string;
  content: string;
};

type InfoCardProps = {
  card: InfoCardType;
  size?: 'medium';
  fullWidth?: boolean;
};

const appearanceClassMap: Record<string, string> = {
  info: styles.infoCardInfo,
  warning: styles.infoCardWarning,
  success: styles.infoCardSuccess,
  primary: styles.infoCardPrimary,
};

const IconColor: Record<string, string> = {
  info: 'info',
  warning: 'warning-brand',
  success: 'success',
  primary: 'primary',
};

const InfoCard: React.FC<InfoCardProps> = ({ card, size, fullWidth }) => {
  const { appearance = 'info', icon, title, content } = card;

  return (
    <Flex
      direction="vertical"
      spacing="xs"
      align="center"
      justify="center"
      className={clsx(
        fullWidth && styles.fullWidth,
        styles.infoCard,
        appearanceClassMap[appearance],
        styles[`infoCard--${size}`]
      )}
    >
      <Icon
        icon={icon}
        color={IconColor[appearance]}
        size={size == 'medium' ? 'xxlarge' : 'xxxlarge'}
      />
      <h4 className={styles.infoCardTitle}>{title}</h4>
      <p className={styles.infoCardContent}>{content}</p>
    </Flex>
  );
};

export default InfoCard;
