import { useState, useEffect } from 'react';
import { Button } from '../Button/Button.tsx';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import clsx from 'clsx';
import styles from './paginator.module.scss';

type PaginatorProps = {
  totalItems: number;
  initialPage?: number;
  pageSize: number;
  className?: string;
  onPageChange?: (page: number, pageSize: number) => void;
};

export function Paginator({
  totalItems,
  initialPage = 1,
  pageSize,
  onPageChange,
  className,
}: PaginatorProps) {
  const totalPages = Math.ceil(totalItems / pageSize);
  const [currentPage, setCurrentPage] = useState(initialPage);

  useEffect(() => {
    setCurrentPage(initialPage);
  }, [initialPage]);

  useEffect(() => {
    onPageChange?.(currentPage, pageSize);
  }, [currentPage, pageSize, onPageChange]);

  const gotoPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  if (totalPages <= 1) return null;

  return (
    <div className={clsx(className, styles.pagination)}>
      <Button
        onClick={() => gotoPage(currentPage - 1)}
        isDisabled={currentPage <= 1}
        leftIcon={faChevronLeft}
        appearance="link"
        className={styles.paginationButton}
      />
      {Array.from({ length: totalPages }, (_, i) => {
        const pageNum = i + 1;
        return (
          <Button
            key={pageNum}
            onClick={() => gotoPage(pageNum)}
            className={clsx(styles.paginationButton, {
              [styles.paginationActiveButton]: currentPage === pageNum,
            })}
          >
            {pageNum}
          </Button>
        );
      })}
      <Button
        onClick={() => gotoPage(currentPage + 1)}
        isDisabled={currentPage >= totalPages}
        leftIcon={faChevronRight}
        appearance="link"
        className={styles.paginationButton}
      />
    </div>
  );
}
