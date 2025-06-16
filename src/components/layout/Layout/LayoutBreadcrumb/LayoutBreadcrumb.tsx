import React from 'react';
import { useLocation } from 'react-router-dom';
import { useBreadcrumb } from '../../../../context/BreadcrumbContext.tsx';
import { baseBreadcrumbs } from './breadcrumb.config.ts';
import { Breadcrumb } from '../../../common/Breadcrumb/Breadcrumb.tsx';
import { BreadcrumbItem } from '../../../common/Breadcrumb/BreadcrumbItem.tsx';

type LayoutBreadcrumbProps = {
  className: string;
};

const LayoutBreadcrumb: React.FC<LayoutBreadcrumbProps> = ({ className }) => {
  const location = useLocation();
  const { extraCrumb } = useBreadcrumb(); // append toy id from component

  const basePath = Object.keys(baseBreadcrumbs).find((path) => location.pathname.startsWith(path));
  const baseCrumbs = basePath ? baseBreadcrumbs[basePath] : [];

  const finalCrumbs = [...baseCrumbs];
  if (extraCrumb) {
    finalCrumbs.push({ label: extraCrumb.label });
  }

  if (!finalCrumbs.length) return null;

  return (
    <Breadcrumb className={className}>
      {finalCrumbs.map((item, index) => (
        <BreadcrumbItem
          key={index}
          isFirst={index === 0}
          isLast={finalCrumbs.length > 1 && index === finalCrumbs.length - 1}
          item={item}
        />
      ))}
    </Breadcrumb>
  );
};

export default LayoutBreadcrumb;
