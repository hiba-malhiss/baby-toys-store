import React, { useEffect, useState, type ReactNode, useMemo } from 'react';
import Flex from '../Flex/Flex.tsx';
import { Button } from '../Button/Button.tsx';
import { faTh, faBars } from '@fortawesome/free-solid-svg-icons';
import Heading from '../Heading/Heading.tsx';
import clsx from 'clsx';
import styles from './view-switcher.module.scss';
import { Paginator } from '../Paginator/Paginator.tsx';

type ResponsiveOption = {
  breakpoint: number;
  gridColumns: number;
};

export type ViewMode = 'grid' | 'list';

type ViewSwitcherProps = {
  children: ReactNode[] | ReactNode;
  page?: number;
  gap?: 'small' | 'none';
  pageSize: number;
  minColWidth?: number;
  totalSize?: number;
  className?: string;
  onPaginationChange?: (page: number, pageSize: number) => void;
  responsiveOptions?: ResponsiveOption[];
  onViewChange?: (view: ViewMode) => void;
  initialView?: ViewMode;
  staticView?: ViewMode;
  header?: ReactNode;
  topBar?: ReactNode;
};

export function ViewSwitcher({
  children,
  page,
  pageSize,
  onPaginationChange,
  responsiveOptions = [],
  onViewChange,
  minColWidth,
  initialView = 'grid',
  staticView,
  totalSize,
  header,
  topBar,
  gap,
  className,
}: ViewSwitcherProps) {
  const allItems = React.Children.toArray(children);
  const totalItems = totalSize ?? allItems.length;

  const [viewMode, setViewMode] = useState<ViewMode>(staticView ?? initialView);
  const [columns, setColumns] = useState<number | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(page || 1);
  const [currentPageSize, setCurrentPageSize] = useState(pageSize);

  useEffect(() => {
    if (!staticView) {
      onViewChange?.(initialView);
    }
  }, [initialView, staticView]);

  useEffect(() => {
    if (responsiveOptions.length === 0) {
      setColumns(undefined);
      return;
    }

    const sortedOptions = [...responsiveOptions].sort((a, b) => a.breakpoint - b.breakpoint);

    const updateColumns = () => {
      const width = window.innerWidth;
      let matched = pageSize;
      for (const opt of sortedOptions) {
        if (width >= opt.breakpoint) {
          matched = opt.gridColumns;
        }
      }
      setColumns(matched);
    };

    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, [responsiveOptions, pageSize]);

  useEffect(() => {
    setCurrentPage(page || 1);
  }, [page]);

  useEffect(() => {
    setCurrentPageSize(pageSize);
  }, [pageSize]);

  const handlePageChange = (newPage: number, newPageSize: number) => {
    setCurrentPage(newPage);
    setCurrentPageSize(newPageSize);
    onPaginationChange?.(newPage, newPageSize);
  };

  const totalPages = Math.ceil(totalItems / currentPageSize);
  const safePage = Math.min(Math.max(currentPage, 1), totalPages);
  const startIdx = (safePage - 1) * currentPageSize;
  const endIdx = Math.min(startIdx + currentPageSize, totalItems);

  const paginatedItems = useMemo(
    () => allItems.slice(startIdx, endIdx),
    [allItems, startIdx, endIdx]
  );

  const changeView = (view: ViewMode) => {
    if (staticView) return;
    setViewMode(view);
    onViewChange?.(view);
  };

  return (
    <div className={clsx(className, styles.container, styles[`container--${gap}Gap`])}>
      {header && <Heading level="h1">{header}</Heading>}

      {!staticView && (
        <Flex
          key="header-buttons"
          justify="between"
          align="center"
          className={clsx('bts-marginVxxxl')}
        >
          <Flex>
            <Button
              onClick={() => changeView('grid')}
              isSelected={viewMode === 'grid'}
              appearance="link"
              size="xlarge"
              withoutPadding
              leftIcon={faTh}
            />
            <Button
              onClick={() => changeView('list')}
              isSelected={viewMode === 'list'}
              appearance="link"
              size="xlarge"
              withoutPadding
              leftIcon={faBars}
            />
          </Flex>

          <div className={styles.containerTopBar}>{topBar}</div>

          <span className={styles.containerResultsInfo}>
            Showing {totalItems === 0 ? 0 : startIdx + 1}–{endIdx} of {totalItems} results
          </span>
        </Flex>
      )}

      <div
        className={clsx(styles.containerContent, {
          [styles.containerGrid]: viewMode === 'grid',
          [styles.containerList]: viewMode === 'list',
        })}
        style={
          viewMode === 'grid'
            ? {
                gridTemplateColumns: `repeat(${columns || 'auto-fill'}, minmax(${minColWidth || 200}px, 1fr))`,
              }
            : undefined
        }
      >
        {paginatedItems.map((child, i) => (
          <React.Fragment key={i}>{child}</React.Fragment>
        ))}
      </div>

      <Paginator
        className={styles.containerPaginator}
        totalItems={totalItems}
        initialPage={currentPage}
        pageSize={currentPageSize}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
