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
  /** Pages shown around the current page (default: 1 → shows current ± 1) */
  siblingCount?: number;
};

// ─── Helper: build the page window ──────────────────────────────────────────
// Returns an array of page numbers OR the string 'ellipsis-start' / 'ellipsis-end'.
type PageItem = number | 'ellipsis-start' | 'ellipsis-end';

const TOTAL_SLOTS = 7; // must be odd

function buildPageItems(currentPage: number, totalPages: number): PageItem[] {
  const half = Math.floor(TOTAL_SLOTS / 2);

  // If small enough, just return all
  if (totalPages <= TOTAL_SLOTS) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  let start = currentPage - half;
  let end = currentPage + half;

  // Clamp window
  if (start < 1) {
    start = 1;
    end = TOTAL_SLOTS;
  } else if (end > totalPages) {
    end = totalPages;
    start = totalPages - TOTAL_SLOTS + 1;
  }

  const pages: PageItem[] = [];

  // Left ellipsis
  if (start > 1) {
    pages.push(1);
    if (start > 2) pages.push('ellipsis-start');
  }

  // Middle pages
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  // Right ellipsis
  if (end < totalPages) {
    if (end < totalPages - 1) pages.push('ellipsis-end');
    pages.push(totalPages);
  }

  return pages;
}

function Paginator({
  totalItems,
  initialPage = 1,
  pageSize,
  onPageChange,
  isLoading,
  className,
  mode = 'default',
  hasMore,
  siblingCount = 1,
}: PaginatorProps) {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const prevPageRef = useRef(initialPage);
  const observerRef = useRef<HTMLDivElement | null>(null);

  const totalPages = mode === 'default' ? Math.ceil(totalItems / pageSize) : 0;

  // Sync with external page changes
  useEffect(() => {
    if (mode === 'default' && initialPage !== prevPageRef.current) {
      setCurrentPage(initialPage);
      prevPageRef.current = initialPage;
    }
  }, [initialPage, mode]);

  // Notify parent when page changes (default mode)
  useEffect(() => {
    if (mode !== 'default') return;
    if (currentPage !== prevPageRef.current) {
      onPageChange?.(currentPage, pageSize);
      prevPageRef.current = currentPage;
    }
  }, [currentPage, pageSize, onPageChange, mode]);

  // Reset if totalPages shrinks
  useEffect(() => {
    if (mode !== 'default') return;
    if (totalPages > 0 && currentPage > totalPages) setCurrentPage(1);
  }, [totalPages, currentPage, mode]);

  const gotoPage = useCallback(
    (page: number) => {
      if (mode !== 'default') return;
      if (page < 1 || page > totalPages || page === currentPage) return;
      setCurrentPage(page);
    },
    [currentPage, totalPages, mode]
  );

  // ─── Infinite scroll ──────────────────────────────────────────────────────
  useEffect(() => {
    if (mode !== 'infinite-scroll' || !observerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isLoading && hasMore) {
          onPageChange?.(currentPage + 1, pageSize);
        }
      },
      { root: null, rootMargin: '150px', threshold: 0.1 }
    );

    const node = observerRef.current;
    observer.observe(node);
    return () => {
      if (node) observer.unobserve(node);
    };
  }, [mode, currentPage, pageSize, onPageChange, isLoading, hasMore]);

  // ─── Render: infinite-scroll ──────────────────────────────────────────────
  if (mode === 'infinite-scroll') {
    if (!hasMore) return null;
    return (
      <div className={clsx(className, styles.pagination)} ref={observerRef}>
        {isLoading && <BouncingDotsLoader size="medium" />}
      </div>
    );
  }

  // ─── Render: show-more ────────────────────────────────────────────────────
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

  // ─── Render: default (windowed) ───────────────────────────────────────────
  if (totalPages <= 1) return null;

  const pageItems = buildPageItems(currentPage, totalPages, siblingCount);

  return (
    <div className={clsx(className, styles.pagination)}>
      {/* Prev */}
      <Button
        onClick={() => gotoPage(currentPage - 1)}
        isDisabled={currentPage <= 1}
        leftIconComp={ChevronLeft}
        appearance="outline"
        isRounded
        className={clsx(styles.paginationButton, styles.paginationPrev)}
      />

      {/* Page items */}
      {pageItems.map((item, idx) => {
        if (item === 'ellipsis-start' || item === 'ellipsis-end') {
          return (
            <span key={item} className={styles.ellipsis}>
              &hellip;
            </span>
          );
        }

        return (
          <Button
            key={item}
            appearance="outline"
            color="highlighted"
            isRounded
            onClick={() => gotoPage(item)}
            className={styles.paginationButton}
            isSelected={currentPage === item}
          >
            {item}
          </Button>
        );
      })}

      {/* Next */}
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
