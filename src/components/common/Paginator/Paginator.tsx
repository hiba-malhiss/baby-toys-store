import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { Button } from '../Button/Button.tsx';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import clsx from 'clsx';
import styles from './paginator.module.scss';
import BouncingDotsLoader from '../BouncingDotsLoader/BouncingDotsLoader.tsx';
import { useDebounce } from '../../../hooks/useDebounce.ts';

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

export function Paginator({
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
  const showMoreRef = useRef<HTMLButtonElement | null>(null);
  const [shouldPaginate, setShouldPaginate] = useState(false);
  const debouncedShouldPaginate = useDebounce(shouldPaginate, 300);

  // Update internal state when initialPage prop changes
  useEffect(() => {
    if (initialPage !== prevPageRef.current) {
      setCurrentPage(initialPage);
      prevPageRef.current = initialPage;
    }
  }, [initialPage]);

  // Memoize the pagination state to prevent unnecessary effect triggers
  const paginationState = useMemo(
    () => ({
      currentPage,
      pageSize,
      hasChanged: currentPage !== prevPageRef.current,
    }),
    [currentPage, pageSize]
  );

  // Call onPageChange when currentPage or pageSize changes
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

  // Reset to first page if totalItems changes and current page is no longer valid
  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const handleShowMore = useCallback(() => {
    setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));
  }, [totalPages]);

  useEffect(() => {
    if (mode !== 'infinite-scroll' || !showMoreRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setShouldPaginate(entry.isIntersecting);
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 1.0,
      }
    );

    const node = showMoreRef.current;
    observer.observe(node);

    return () => {
      if (node) observer.unobserve(node);
    };
  }, [mode]);

  // Debounced pagination trigger
  useEffect(() => {
    if (debouncedShouldPaginate && !isLoading && hasMore) {
      handleShowMore();
    }
  }, [debouncedShouldPaginate, isLoading, hasMore, handleShowMore]);

  // === Infinite Scroll Mode ===
  if (mode === 'infinite-scroll') {
    if (!hasMore) return null;

    return (
      <div className={clsx(className, styles.pagination)}>
        <BouncingDotsLoader size="medium" ref={showMoreRef} />
      </div>
    );
  }
  // === Show More / Infinite Scroll Mode ===
  if (mode === 'show-more') {
    if (!hasMore) return null;

    return (
      <div className={clsx(className, styles.pagination)}>
        <Button
          ref={showMoreRef}
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
        leftIcon={faChevronLeft}
        appearance="outline"
        isRounded
        className={styles.paginationButton}
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
        leftIcon={faChevronRight}
        appearance="outline"
        isRounded
        className={styles.paginationButton}
      />
    </div>
  );
}
