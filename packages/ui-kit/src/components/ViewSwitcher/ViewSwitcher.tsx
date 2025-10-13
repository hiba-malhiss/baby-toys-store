import React, { useEffect, useState, type ReactNode, useRef, useMemo, useCallback } from 'react';
import clsx from 'clsx';
import Flex from '../Flex/Flex.tsx';
import Button from '../Button/Button.tsx';
import { faTh, faBars, faBoxOpen } from '@fortawesome/free-solid-svg-icons';
import Heading from '../Heading/Heading.tsx';
import styles from './view-switcher.module.scss';
import Paginator, { type PaginationMode } from '../Paginator/Paginator.tsx';
import SkeletonProductCard from '../Skeleton/SkeletonProductCard.tsx';
import NoDataFound from '../NoDataFound';
import { BREAKPOINTS } from "../../constants/breakpoints.ts";

type ResponsiveOption = {
  breakpoint: number | string;
  gridColumns: number;
};

export type ViewMode = 'grid' | 'list';

type ViewSwitcherProps = {
  items: ReactNode[];
  page: number;
  pageSize: number;
  totalSize: number;
  isLoading?: boolean;
  className?: string;
  onPaginationChange: (page: number, pageSize: number) => void;
  responsiveOptions?: ResponsiveOption[];
  onViewChange?: (view: ViewMode) => void;
  initialView?: ViewMode;
  isStaticView?: boolean;
  paginationMode?: PaginationMode;
  hasMore?: boolean;
  header?: ReactNode;
  topBar?: ReactNode;
  gap?: 'small' | 'none';
  emptyIcon?: any;
  emptyMessage?: string;
  emptySubtext?: string;
  emptyAlign?: 'start' | 'center';
};

const defaultResponsiveOptions: ResponsiveOption[] = [
  { breakpoint: BREAKPOINTS.xlarge, gridColumns: 5 },
  { breakpoint: BREAKPOINTS.large, gridColumns: 4 },
  { breakpoint: BREAKPOINTS.medium, gridColumns: 3 },
  { breakpoint: BREAKPOINTS.small, gridColumns: 2 },
];

function ViewSwitcher({
  items,
  page,
  pageSize,
  totalSize,
  onPaginationChange,
  responsiveOptions = defaultResponsiveOptions,
  onViewChange,
  initialView = 'grid',
  isStaticView,
  paginationMode = 'default',
  hasMore,
  header,
  topBar,
  gap,
  className,
  isLoading = false,
  emptyIcon,
  emptyMessage,
  emptySubtext,
  emptyAlign,
}: ViewSwitcherProps){
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = useState<ViewMode>(initialView);
  const [columns, setColumns] = useState<number | undefined>(undefined);
  const isInitialMount = useRef(true);

  // Inform parent about initial view
  useEffect(() => {
    if(!isStaticView && isInitialMount.current) {
      isInitialMount.current = false;
      onViewChange?.(initialView);
    }
  }, [initialView, isStaticView, onViewChange]);

  const toBpNumber = (bp: number | string): number =>
    typeof bp === 'number' ? bp : parseInt(String(bp), 10);

  const sortedOptions = useMemo(() => {
    return [...responsiveOptions].sort((a, b) => toBpNumber(a.breakpoint) - toBpNumber(b.breakpoint));
  }, [responsiveOptions]);

  useEffect(() => {
    const element = containerRef.current;
    if(!element || responsiveOptions.length === 0) {
      setColumns(undefined);
      return;
    }

    let resizeTimeout: NodeJS.Timeout;

    const updateResponsive = (width: number) => {
      if(sortedOptions.length > 0) {
        const match = sortedOptions.find((opt) => width <= toBpNumber(opt.breakpoint));
        const matchedCols = match
          ? match.gridColumns
          : sortedOptions[sortedOptions.length - 1].gridColumns;
        setColumns((prev) => (prev !== matchedCols ? matchedCols : prev));
      }
    };

    const observer = new ResizeObserver((entries) => {
      for(const entry of entries) {
        const newWidth = entry.contentRect.width;
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => updateResponsive(newWidth), 100);
      }
    });

    observer.observe(element);
    updateResponsive(element.clientWidth);

    return () => {
      clearTimeout(resizeTimeout);
      observer.disconnect();
    };
  }, [sortedOptions, responsiveOptions.length]);

  const changeView = useCallback(
    (view: ViewMode) => {
      if(isStaticView || view === viewMode) return;
      setViewMode(view);
      onViewChange?.(view);
    },
    [isStaticView, viewMode, onViewChange]
  );

  const startIdx = (page - 1) * pageSize + 1;
  const endIdx = Math.min(page * pageSize, totalSize);

  const handlePageChange = useCallback(
    (newPage: number) => {
      if(newPage !== page) {
        onPaginationChange?.(newPage, pageSize);
        if(paginationMode === 'default' && containerRef.current) {
          const top = containerRef.current.getBoundingClientRect().top + window.pageYOffset - 100;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }
    },
    [page, pageSize, paginationMode, onPaginationChange]
  );

  return (
    <div
      className={clsx(className, styles.container, styles[`container--${gap}Gap`])}
      ref={containerRef}
    >
      {header && (
        <Heading level="h1" className="bts-marginBxxxl">
          {header}
        </Heading>
      )}

      {!isStaticView && (
        <Flex justify="between" align="center" wrap className="bts-marginBxxxl">
          <Flex align="center">
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
            Showing {totalSize === 0 ? 0 : startIdx}–{endIdx} of {totalSize} results
          </span>
        </Flex>
      )}

      <div
        className={clsx(styles.containerContent, {
          [styles.containerGrid]: viewMode === 'grid',
          [styles.containerList]: viewMode === 'list',
          [styles.hasNoData]: items.length === 0 && !isLoading,
        })}
        style={
          viewMode === 'grid'
            ? {
              gridTemplateColumns: `repeat(${columns || 'auto-fill'}, 1fr)`,
            }
            : undefined
        }
      >
        {isLoading && paginationMode === 'default' ? (
          Array.from({ length: pageSize }).map((_, i) => (
            <SkeletonProductCard
              key={`skeleton-${i}`}
              direction={viewMode === 'list' ? 'horizontal' : 'vertical'}
              fullWidth
            />
          ))
        ) : items.length === 0 ? (
          <NoDataFound
            icon={emptyIcon ?? faBoxOpen}
            message={emptyMessage ?? 'No toys found'}
            subtext={emptySubtext ?? 'Try changing your search or filters.'}
            align={emptyAlign ?? 'center'}
          />
        ) : (
          items.map((item, index) => <React.Fragment key={index}>{item}</React.Fragment>)
        )}

        {isLoading &&
          (paginationMode === 'show-more' || paginationMode === 'infinite-scroll') &&
          items.length > 0 && (
            <SkeletonProductCard
              direction={viewMode === 'list' ? 'horizontal' : 'vertical'}
            />
          )}
      </div>

      <Paginator
        mode={paginationMode}
        hasMore={hasMore}
        className={styles.containerPaginator}
        totalItems={totalSize}
        initialPage={page}
        pageSize={pageSize}
        isLoading={isLoading}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export default ViewSwitcher;
