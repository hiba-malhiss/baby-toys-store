import React, { useEffect, useState, useCallback, useRef } from 'react';
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
  const [currentPage, setCurrentPage] = useState(initialPage);
  const prevPageRef = useRef(initialPage);
  const observerRef = useRef<HTMLDivElement | null>(null);

  // === DEFAULT MODE LOGIC ONLY ===
  const totalPages = mode === 'default' ? Math.ceil(totalItems / pageSize) : 0;

  // Sync with parent page changes
  useEffect(() => {
    if (mode === 'default' && initialPage !== prevPageRef.current) {
      setCurrentPage(initialPage);
      prevPageRef.current = initialPage;
    }
  }, [initialPage, mode]);

  // Notify parent in default mode
  useEffect(() => {
    if (mode !== 'default') return;

    if (currentPage !== prevPageRef.current) {
      onPageChange?.(currentPage, pageSize);
      prevPageRef.current = currentPage;
    }
  }, [currentPage, pageSize, onPageChange, mode]);

  const gotoPage = useCallback(
    (page: number) => {
      if (mode !== 'default') return;
      if (page < 1 || page > totalPages || page === currentPage) return;
      setCurrentPage(page);
    },
    [currentPage, totalPages, mode]
  );

  // Reset page if total pages shrink
  useEffect(() => {
    if (mode !== 'default') return;
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage, mode]);

  // ============================
  // === INFINITE SCROLL MODE ===
  // ============================
  useEffect(() => {
    if (mode !== 'infinite-scroll') return;
    if (!observerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;

        if (entry.isIntersecting && !isLoading && hasMore) {
          onPageChange?.(currentPage + 1, pageSize);
        }
      },
      {
        root: null,
        rootMargin: '150px',
        threshold: 0.1,
      }
    );

    const node = observerRef.current;
    observer.observe(node);

    return () => {
      if (node) observer.unobserve(node);
    };
  }, [mode, currentPage, pageSize, onPageChange, isLoading, hasMore]);

  // ============================
  // === RENDERING MODES ===
  // ============================

  // Infinite Scroll
  if (mode === 'infinite-scroll') {
    if (!hasMore) return null;

    return (
      <div className={clsx(className, styles.pagination)} ref={observerRef}>
        {isLoading && <BouncingDotsLoader size="medium" />}
      </div>
    );
  }

  // Show More
  if (mode === 'show-more') {
    if (!hasMore) return null;

    return (
      <div className={clsx(className, styles.pagination)}>
        <Button
          appearance="filled"
          color="secondary"
          className={styles.paginationButton}
          onClick={() => onPageChange?.(currentPage + 1, pageSize)}
          isLoading={isLoading}
          isDisabled={isLoading}
        >
          Show More
        </Button>
      </div>
    );
  }

  // Default Pagination
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
            className={styles.paginationButton}
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
