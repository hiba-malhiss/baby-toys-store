import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import Button from '../Button/Button.tsx';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';
import styles from './paginator.module.scss';
import BouncingDotsLoader from '../BouncingDotsLoader/BouncingDotsLoader.tsx';

export type PaginationMode = 'default' | 'show-more' | 'infinite-scroll';

type PaginatorProps = {
  totalItems: number;
  initialPage?: number;
  pageSize: number;
  isLoading: boolean;
  className?: string;
  onPageChange?: (page: number, pageSize: number) => void;
  mode?: PaginationMode;
  hasMore?: boolean;
};

function Paginator({
  totalItems,
  initialPage = 1,
  pageSize,
  onPageChange,
  isLoading,
  className,
  mode = 'default',
  hasMore,
}: PaginatorProps) {
  const totalPages = Math.ceil(totalItems / pageSize);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const prevPageRef = useRef(initialPage);
  const showMoreRef = useRef<HTMLDivElement | null>(null); // Use div for loader

  // Update internal state when initialPage prop changes
  useEffect(() => {
    if (initialPage !== prevPageRef.current) {
      setCurrentPage(initialPage);
      prevPageRef.current = initialPage;
    }
  }, [initialPage]);

  // Memoize pagination state
  const paginationState = useMemo(
    () => ({
      currentPage,
      pageSize,
      hasChanged: currentPage !== prevPageRef.current,
    }),
    [currentPage, pageSize]
  );

  // Call onPageChange when currentPage changes
  useEffect(() => {
    if (paginationState.hasChanged) {
      onPageChange?.(paginationState.currentPage, paginationState.pageSize);
      prevPageRef.current = paginationState.currentPage;
    }
  }, [paginationState, onPageChange]);

  const gotoPage = useCallback(
    (page: number) => {
      if (page < 1 || page > totalPages || page === currentPage) return;
      setCurrentPage(page);
    },
    [currentPage, totalPages]
  );

  // Reset to first page if currentPage exceeds totalPages
  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const handleShowMore = useCallback(() => {
    setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));
  }, [totalPages]);

  // Infinite Scroll IntersectionObserver
  useEffect(() => {
    if (mode !== 'infinite-scroll' || !showMoreRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !isLoading && hasMore) {
          handleShowMore();
        }
      },
      {
        root: null,
        rootMargin: '150px', // preload before hitting loader
        threshold: 0.1, // 10% visible triggers it
      }
    );

    const node = showMoreRef.current;
    observer.observe(node);

    return () => {
      if (node) observer.unobserve(node);
    };
  }, [mode, handleShowMore, isLoading, hasMore]);

  // === Infinite Scroll Mode ===
  if (mode === 'infinite-scroll') {
    if (!hasMore) return null;

    return (
      <div className={clsx(className, styles.pagination)}>
        <BouncingDotsLoader size="medium" ref={showMoreRef} />
      </div>
    );
  }

  // === Show More Mode ===
  if (mode === 'show-more') {
    if (!hasMore) return null;

    return (
      <div className={clsx(className, styles.pagination)}>
        <Button
          appearance="filled"
          color="secondary"
          className={styles.paginationButton}
          onClick={handleShowMore}
          isLoading={isLoading}
          isDisabled={isLoading}
        >
          Show More
        </Button>
      </div>
    );
  }

  // === Default Pagination Mode ===
  if (totalPages <= 1) return null;

  return (
    <div className={clsx(className, styles.pagination)}>
      <Button
        onClick={() => gotoPage(currentPage - 1)}
        isDisabled={currentPage <= 1}
        leftIconComp={ChevronLeft}
        appearance="outline"
        isRounded
        className={clsx(styles.paginationButton, styles.paginationPrev)}
      />
      {Array.from({ length: totalPages }, (_, i) => {
        const pageNum = i + 1;
        return (
          <Button
            key={pageNum}
            appearance="outline"
            color="highlighted"
            isRounded
            onClick={() => gotoPage(pageNum)}
            className={clsx(styles.paginationButton)}
            isSelected={currentPage === pageNum}
          >
            {pageNum}
          </Button>
        );
      })}
      <Button
        onClick={() => gotoPage(currentPage + 1)}
        isDisabled={currentPage >= totalPages}
        leftIconComp={ChevronRight}
        appearance="outline"
        isRounded
        className={clsx(styles.paginationButton, styles.paginationNext)}
      />
    </div>
  );
}

export default Paginator;
