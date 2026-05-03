import React, { useState, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Heading,
  Table,
  Flex,
  Chip,
  Button,
  Rating,
  CopyToClipboardButton,
  Tooltip,
  PageHeader,
} from '@baby-toys/ui-kit';
import { useSearchParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/layout/AdminLayout/AdminLayout';
import ReviewsFilters from './ReviewsFilters.tsx';
import { useAdminReviews, useHideReview, useUnhideReview } from '../../api/reviewsApi';
import { ReviewDto, ReviewStatus } from '../../api/types/review';
import { EyeOff, Eye } from 'lucide-react';
import styles from './reviews-page.module.scss';

export default function ReviewsPage() {
  const { t } = useTranslation('common');
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    productId: searchParams.get('productId') || '',
    userId: searchParams.get('userId') || '',
    rating: searchParams.get('rating') || '',
    status: searchParams.get('status') || '',
  });

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<-1 | 1>(-1);

  const { productId, userId, rating, status } = filters;

  const applyFilters = useCallback(
    (next: typeof filters) => {
      setFilters(next);
      const params: Record<string, string> = {};
      Object.entries(next).forEach(([k, v]) => {
        if (v) params[k] = v;
      });
      setSearchParams(params, { replace: true });
      setPage(1);
    },
    [setSearchParams]
  );

  const { data, isLoading } = useAdminReviews({
    page,
    size: pageSize,
    sortBy: sortField,
    sortDirection: sortOrder === 1 ? 'ASC' : 'DESC',
    productId: productId ? Number(productId) : undefined,
    userId: userId ? Number(userId) : undefined,
    rating: rating ? Number(rating) : undefined,
    status: (status as ReviewStatus) || undefined,
  });

  const { mutate: hideReview, isPending: isHiding } = useHideReview();
  const { mutate: unhideReview, isPending: isUnhiding } = useUnhideReview();

  const columns = useMemo(
    () => [
      { field: 'id', header: t('app.reviews.fields.id') },
      {
        field: 'productId',
        header: t('app.reviews.fields.product'),
        body: (row: ReviewDto) => (
          <Flex spacing="xs" align="center">
            <Button
              align="start"
              appearance="link"
              color="highlighted"
              withoutPadding
              onClick={() => navigate(`/product/${row.productId}`)}
            >
              {row.productName ? (
                <span className={styles.reviewsPageTruncate} title={row.productName}>
                  {row.productName}
                </span>
              ) : (
                `#${row.productId}`
              )}
            </Button>
            <CopyToClipboardButton
              value={row.productId}
              successMessage={t('app.reviews.messages.copiedProductId')}
            />
          </Flex>
        ),
      },
      {
        field: 'productImage',
        header: t('app.reviews.fields.image'),
        type: 'image',
      },
      {
        field: 'userId',
        header: t('app.reviews.fields.user'),
        body: (row: ReviewDto) => (
          <Flex spacing="xs" align="center">
            <span>{row.userEmail ?? `#${row.userId}`}</span>
            <CopyToClipboardButton
              value={row.userId}
              successMessage={t('app.reviews.messages.copiedUserId')}
            />
          </Flex>
        ),
      },
      {
        field: 'userPhone',
        header: t('app.reviews.fields.phone'),
        body: (row: ReviewDto) => row.userPhone || '-',
      },
      {
        field: 'rating',
        header: t('app.reviews.fields.rating'),
        body: (row: ReviewDto) => (
          <Flex spacing="xs" align="center">
            <Rating value={row.rating} />
            <span>({row.rating})</span>
          </Flex>
        ),
      },
      {
        field: 'comment',
        header: t('app.reviews.fields.comment'),
        body: (row: ReviewDto) => (
          <span className={styles.reviewsPageTruncate} title={row.comment || ''}>
            {row.comment || '-'}
          </span>
        ),
      },
      {
        field: 'status',
        header: t('app.reviews.fields.status'),
        body: (row: ReviewDto) => (
          <Chip
            label={t(`app.reviews.status.${row.status.toLowerCase()}`)}
            appearance={row.status === 'HIDDEN' ? 'warning' : 'success'}
          />
        ),
      },
      {
        field: 'actions',
        header: t('app.common.actions'),
        body: (row: ReviewDto) => {
          const hidden = row.status === 'HIDDEN';
          return (
            <Tooltip
              position="top"
              content={hidden ? t('app.reviews.actions.unhide') : t('app.reviews.actions.hide')}
            >
              <Button
                size="small"
                appearance="outline"
                leftIconComp={hidden ? Eye : EyeOff}
                isLoading={isHiding || isUnhiding}
                onClick={() => (hidden ? unhideReview(row.id) : hideReview(row.id))}
              />
            </Tooltip>
          );
        },
      },
    ],
    [hideReview, unhideReview, isHiding, isUnhiding, t, navigate]
  );

  return (
    <AdminLayout>
      <PageHeader
        left={<Heading>{t('app.reviews.title')}</Heading>}
        right={<ReviewsFilters {...filters} onChange={applyFilters} />}
      />
      <Table
        stripedRows
        value={data?.content ?? []}
        columns={columns}
        paginator
        rows={pageSize}
        totalRecords={data?.totalElements ?? 0}
        sortField={sortField}
        sortOrder={sortOrder}
        onSort={({ field, order }) => {
          setSortField(field);
          setSortOrder(order);
          setPage(1);
        }}
        onPageChange={(newPage, newSize) => {
          setPage(newPage);
          setPageSize(newSize);
        }}
        isLoading={isLoading}
        emptyMessage={t('app.reviews.empty', { defaultValue: 'No reviews found.' })}
      />
    </AdminLayout>
  );
}
