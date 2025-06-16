import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import clsx from 'clsx';

import styles from './breadcrumb-item.module.scss';
import Flex from '../Flex/Flex.tsx';

export type BreadcrumbItemData = {
  label?: string;
  path?: string;
  icon?: IconDefinition;
};

interface BreadcrumbItemProps {
  isFirst?: boolean;
  isLast?: boolean;
  item: BreadcrumbItemData;
}

export const BreadcrumbItem: React.FC<BreadcrumbItemProps> = ({
  isFirst = false,
  isLast = false,
  item,
}) => {
  const content = (
    <Flex className={styles.breadcrumbItemContent} align="center" spacing="xs">
      {item.icon && <FontAwesomeIcon icon={item.icon} />}
      {item.label && <span>{item.label}</span>}
    </Flex>
  );

  return (
    <Flex
      align="center"
      spacing="s"
      className={clsx(styles.breadcrumbItem, isLast && styles.isLast)}
    >
      {!isFirst && <div className={styles.breadcrumbItemSeparator}>/</div>}
      {item.path ? <Link to={item.path}>{content}</Link> : content}
    </Flex>
  );
};
