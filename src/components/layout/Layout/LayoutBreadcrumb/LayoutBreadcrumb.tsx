import React from 'react';
import { matchPath, useLocation } from 'react-router-dom';
import { useBreadcrumb } from '../../../../context/BreadcrumbContext.tsx';
import { baseBreadcrumbs } from './breadcrumb.config.ts';
import { Breadcrumb } from '../../../common/Breadcrumb/Breadcrumb.tsx';
import { BreadcrumbItem } from '../../../common/Breadcrumb/BreadcrumbItem.tsx';

type LayoutBreadcrumbProps = {
  className: string;
};

const findBasePath = (pathname: string) => {
  // Sort keys descending by length so longer (more specific) paths match first
  const sortedPaths = Object.keys(baseBreadcrumbs).sort((a, b) => b.length - a.length);

  return sortedPaths.find((pattern) => matchPath({ path: pattern, end: false }, pathname));
};

const LayoutBreadcrumb: React.FC<LayoutBreadcrumbProps> = ({ className }) => {
  const location = useLocation();
  const { extraCrumbs } = useBreadcrumb();

  const basePath = findBasePath(location.pathname);
  const baseCrumbs = basePath ? baseBreadcrumbs[basePath] : [];

  const finalCrumbs = [...baseCrumbs];
  if (extraCrumbs) {
    finalCrumbs.push(...extraCrumbs);
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
