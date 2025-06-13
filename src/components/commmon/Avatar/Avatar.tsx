import React from 'react';
import styles from './avatar.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

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
        <FontAwesomeIcon icon={faUser} className={styles.avatarIcon} />
      )}
    </div>
  );
};

export default Avatar;
