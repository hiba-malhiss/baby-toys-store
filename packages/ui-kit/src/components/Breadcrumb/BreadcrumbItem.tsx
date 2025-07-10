import React from 'react';
import type { ComponentType } from 'react';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import clsx from 'clsx';

import styles from './breadcrumb-item.module.scss';
import Flex from '../Flex/Flex.tsx';
import Icon from '../Icon/Icon.tsx';

export type BreadcrumbItemData = {
  label?: string;
  path?: string;
  icon?: IconDefinition;
};

interface BreadcrumbItemProps {
  isFirst?: boolean;
  isLast?: boolean;
  item: BreadcrumbItemData;
  linkComponent?: ComponentType<any>;
}

const BreadcrumbItem: React.FC<BreadcrumbItemProps> = ({
  isFirst = false,
  isLast = false,
  item,
  linkComponent: LinkComponent,
}) => {
  if (!item) return null;

  const content = (
    <Flex className={styles.breadcrumbItemContent} align="center" spacing="xs">
      {item?.icon && <Icon icon={item.icon} color="dark" />}
      {item?.label && <span>{item.label}</span>}
    </Flex>
  );

  return (
    <Flex
      align="center"
      spacing="s"
      className={clsx(styles.breadcrumbItem, isLast && styles.isLast)}
    >
      {!isFirst && <div className={styles.breadcrumbItemSeparator}>/</div>}
      {LinkComponent && item.path ? (
        <LinkComponent to={item.path}>{content}</LinkComponent>
      ) : (
        <a href={item.path}>{content}</a>
      )}
    </Flex>
  );
};

export default BreadcrumbItem;
