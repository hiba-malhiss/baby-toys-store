import React from 'react';
import styles from './avatar.module.scss';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { Icon } from '../Icon/Icon.tsx';

type AvatarProps = {
  src?: string;
  alt?: string;
  size: 'small';
};

const sizeClassMap: Record<string, string> = {
  small: styles.avatarSmall,
};

const Avatar: React.FC<AvatarProps> = ({ src, alt, size }) => {
  const sizeClass = sizeClassMap[size];

  return (
    <div className={`${styles.avatar} ${sizeClass}`}>
      {src ? (
        <img src={src} alt={alt} />
      ) : (
        <Icon icon={faUser} className={styles.avatarIcon} color="gray" />
      )}
    </div>
  );
};

export default Avatar;
