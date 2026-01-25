import React, { useState, useMemo, useCallback } from 'react';
import { Heading, Table, Flex, Chip, Button, Rating, CopyToClipboardButton } from '@baby-toys/ui-kit';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/layout/AdminLayout/AdminLayout';
import ReviewsFilters from './ReviewsFilters.tsx';
import { useAdminReviews, useHideReview, useUnhideReview } from '../../api/reviewsApi';
import { ReviewDto, ReviewStatus } from '../../api/types/review';
import { faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons';
import styles from './reviews-page.module.scss';

export default function ReviewsPage(){
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // filters from URL
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
    (next) => {
      setFilters(next);
      const params: Record<string, string> = {};
      Object.entries(next).forEach(([k, v]) => {
        if(v) params[k] = v;
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
      { field: 'id', header: 'ID' },
      {
        field: 'productId',
        header: 'Product',
        body: (row: ReviewDto) => (
          <Flex spacing="s" align="center">
            <Button
              align="start"
              appearance="link" color="highlighted" withoutPadding
              onClick={() => navigate(`/edit-product/${row.productId}`)}>
              {row.productName ? (
                <span className={styles.reviewsPageTruncate} title={row.productName}>
                  {row.productName}
                </span>
              ) : (
                `#${row.productId}`
              )}
            </Button>
            <CopyToClipboardButton value={row.productId} successMessage="Product ID copied"/>
          </Flex>
        ),
      },
      {
        field: 'productImage',
        header: 'Image',
        type: 'image',
      },
      {
        field: 'userId',
        header: 'User',
        body: (row: ReviewDto) => (
          <Flex spacing="s" align="center">
            <span>{row.userEmail ?? `#${row.userId}`}</span>
            <CopyToClipboardButton value={row.userId} successMessage="User ID copied"/>
          </Flex>
        ),
      },
      {
        field: 'userPhone',
        header: 'Phone',
        body: (row: ReviewDto) => row.userPhone || '-',
      },
      {
        field: 'rating',
        header: 'Rating',
        body: (row: ReviewDto) => (
          <Flex spacing="s" align="center">
            <Rating value={row.rating}/>
            <span>({row.rating})</span>
          </Flex>
        ),
      },
      {
        field: 'comment',
        header: 'Comment',
        body: (row: ReviewDto) => (
          <span className={styles.reviewsPageTruncate} title={row.comment || ''}>
            {row.comment || '-'}
          </span>
        ),
      },
      {
        field: 'status',
        header: 'Status',
        body: (row: ReviewDto) => (
          <Chip label={row.status} appearance={row.status === 'HIDDEN' ? 'warning' : 'success'}/>
        ),
      },
      {
        field: 'actions',
        header: 'Actions',
        body: (row: ReviewDto) => {
          const hidden = row.status === 'HIDDEN';
          return (
            <Button
              size="small"
              appearance="outline"
              leftIcon={hidden ? faEye : faEyeSlash}
              isLoading={isHiding || isUnhiding}
              onClick={() => (hidden ? unhideReview(row.id) : hideReview(row.id))}
            >
              {hidden ? 'Unhide' : 'Hide'}
            </Button>
          );
        },
      },
    ],
    [hideReview, unhideReview, isHiding, isUnhiding]
  );

  return (
    <AdminLayout>
      <Flex direction="vertical" spacing="m" fullWidth>
        <Flex justify="between" fullWidth>
          <Heading>Reviews</Heading>
          <ReviewsFilters {...filters} onChange={applyFilters}/>
        </Flex>
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
        />
      </Flex>
    </AdminLayout>
  );
}
