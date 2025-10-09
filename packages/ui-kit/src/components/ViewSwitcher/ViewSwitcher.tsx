import React, { useEffect, useState, type ReactNode, useRef } from 'react';
import clsx from 'clsx';
import Flex from '../Flex/Flex.tsx';
import Button from '../Button/Button.tsx';
import { faTh, faBars } from '@fortawesome/free-solid-svg-icons';
import Heading from '../Heading/Heading.tsx';
import styles from './view-switcher.module.scss';
import Paginator, { type PaginationMode } from '../Paginator/Paginator.tsx';
import SkeletonProductCard from '../Skeleton/SkeletonProductCard.tsx';
import NoDataFound from '../NoDataFound';
import { faBoxOpen } from '@fortawesome/free-solid-svg-icons';

type ResponsiveOption = {
  breakpoint: number | string;
  gridColumns: number;
};

type ResponsiveMinWidth = {
  breakpoint: number | string;
  minWidth: number; // px
};

export type ViewMode = 'grid' | 'list' | 'flex';

type ViewSwitcherProps = {
  items: ReactNode[];
  page: number;
  pageSize: number;
  totalSize: number;
  isLoading?: boolean;
  minColWidth?: number;
  className?: string;
  onPaginationChange: (page: number, pageSize: number) => void;
  responsiveOptions?: ResponsiveOption[];
  responsiveMinWidth?: ResponsiveMinWidth[];
  onViewChange?: (view: ViewMode) => void;
  initialView?: ViewMode;
  staticView?: ViewMode;
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

function ViewSwitcher({
  items,
  page,
  pageSize,
  totalSize,
  onPaginationChange,
  responsiveOptions = [],
  responsiveMinWidth = [],
  onViewChange,
  minColWidth,
  initialView = 'grid',
  staticView,
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
}: ViewSwitcherProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = useState<ViewMode>(staticView ?? initialView);
  const [columns, setColumns] = useState<number | undefined>(undefined);
  const [effectiveMinWidth, setEffectiveMinWidth] = useState<number | undefined>(undefined);

  // Track if this is the initial render
  const isInitialMount = useRef(true);

  // Notify initial view on mount if not static
  useEffect(() => {
    if (!staticView && isInitialMount.current) {
      isInitialMount.current = false;
      onViewChange?.(initialView);
    }
  }, [initialView, staticView, onViewChange]);

  // Normalize breakpoint to numeric value (supports '768px' and numbers)
  const toBpNumber = (bp: number | string): number =>
    typeof bp === 'number' ? bp : parseInt(String(bp), 10);

  // Memoize sorted options to prevent unnecessary resorting
  const sortedOptions = React.useMemo(() => {
    return [...(responsiveOptions || [])].sort(
      (a, b) => toBpNumber(a.breakpoint) - toBpNumber(b.breakpoint)
    );
  }, [responsiveOptions]);

  const sortedMinWidth = React.useMemo(() => {
    return [...(responsiveMinWidth || [])].sort(
      (a, b) => toBpNumber(a.breakpoint) - toBpNumber(b.breakpoint)
    );
  }, [responsiveMinWidth]);

  // Handle responsive columns for grid view and/or responsive minWidth
  useEffect(() => {
    if (responsiveOptions.length === 0 && responsiveMinWidth.length === 0) {
      setColumns(undefined);
      setEffectiveMinWidth(undefined);
      return;
    }

    let timeoutId: NodeJS.Timeout;

    const updateResponsive = () => {
      const width = window.innerWidth;

      if (sortedOptions.length > 0) {
        // Carousel behavior: pick the first rule where width <= breakpoint;
        // if none (width > largest), fallback to the largest rule
        const match = sortedOptions.find((opt) => width <= toBpNumber(opt.breakpoint));
        const matchedCols = match
          ? match.gridColumns
          : sortedOptions[sortedOptions.length - 1].gridColumns;
        setColumns((prev) => (prev !== matchedCols ? matchedCols : prev));
      }

      if (sortedMinWidth.length > 0) {
        // Same behavior for minWidth: first rule where width <= breakpoint;
        // if none (width > largest), fallback to largest rule's minWidth
        const matchMin = sortedMinWidth.find((opt) => width <= toBpNumber(opt.breakpoint));
        const matchedMin = matchMin
          ? matchMin.minWidth
          : sortedMinWidth[sortedMinWidth.length - 1].minWidth;
        setEffectiveMinWidth((prev) => (prev !== matchedMin ? matchedMin : prev));
      }
    };

    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateResponsive, 100);
    };

    updateResponsive();
    window.addEventListener('resize', handleResize, { passive: true });
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
    };
  }, [
    sortedOptions,
    sortedMinWidth,
    pageSize,
    minColWidth,
    responsiveOptions.length,
    responsiveMinWidth.length,
  ]);

  const changeView = React.useCallback(
    (view: ViewMode) => {
      if (staticView || view === viewMode) return;
      setViewMode(view);
      onViewChange?.(view);
    },
    [staticView, viewMode, onViewChange]
  );

  const startIdx = (page - 1) * pageSize + 1;
  const endIdx = Math.min(page * pageSize, totalSize);

  // Memoize the page change handler
  const handlePageChange = React.useCallback(
    (newPage: number) => {
      if (newPage !== page) {
        onPaginationChange?.(newPage, pageSize);

        // Scroll to top of container on page change (only for 'default' mode)
        if (paginationMode === 'default' && containerRef.current) {
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
        <Heading level="h1" className={clsx('bts-marginBxxxl')}>
          {header}
        </Heading>
      )}

      {!staticView && (
        <Flex
          key="header-buttons"
          justify="between"
          align="center"
          wrap
          className={clsx('bts-marginBxxxl')}
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
            Showing {totalSize === 0 ? 0 : startIdx}–{endIdx} of {totalSize} results
            {/*{t('shop.resultsSummary', { from, to, total: totalSize })}*/}
          </span>
        </Flex>
      )}

      <div
        className={clsx(styles.containerContent, {
          [styles.containerGrid]: viewMode === 'grid',
          [styles.containerList]: viewMode === 'list',
          [styles.containerFlex]: viewMode === 'flex',
          [styles.hasNoData]: items.length === 0 && !isLoading,
        })}
        style={
          viewMode === 'grid'
            ? {
                gridTemplateColumns: `repeat(${columns || 'auto-fill'}, minmax(${effectiveMinWidth ?? minColWidth ?? 200}px, 1fr))`,
              }
            : undefined
        }
      >
        {isLoading && paginationMode === 'default' ? (
          // Show a page of skeleton cards for a better loading experience
          Array.from({ length: pageSize }).map((_, i) => (
            <React.Fragment key={`skeleton-${i}`}>
              <SkeletonProductCard
                direction={viewMode === 'list' ? 'horizontal' : 'vertical'}
                fullWidth={viewMode !== 'flex'}
              />
            </React.Fragment>
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
            <SkeletonProductCard direction={viewMode === 'list' ? 'horizontal' : 'vertical'} />
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
