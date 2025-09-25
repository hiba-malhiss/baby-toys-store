import React, { useMemo, useState, useCallback } from 'react';
import AdminLayout from '../../components/layout/AdminLayout/AdminLayout';
import {
  Heading,
  Table,
  Flex,
  Button,
  StringInput,
  Rating,
  Chip,
  Select,
  Option,
} from '@baby-toys/ui-kit';
import { useAdminReviews, useHideReview, useUnhideReview } from '../../api/reviewsApi';
import type { ReviewDto, ReviewStatus } from '../../api/types/review';
import { faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import styles from './reviews-page.module.scss';

const statusOptions = [
  { label: 'All', value: '' },
  { label: 'Published', value: 'PUBLISHED' },
  { label: 'Hidden', value: 'HIDDEN' },
];

const ratingOptions = [
  { label: 'All', value: '' },
  { label: '5 stars', value: '5' },
  { label: '4 stars', value: '4' },
  { label: '3 stars', value: '3' },
  { label: '2 stars', value: '2' },
  { label: '1 star', value: '1' },
];

const ReviewsPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<-1 | 1>(-1);

  // Applied filters
  const [productId, setProductId] = useState<string>('');
  const [userId, setUserId] = useState<string>('');
  const [rating, setRating] = useState<string>('');
  const [status, setStatus] = useState<string>('');

  // Input states (only applied when user clicks Search)
  const [productIdInput, setProductIdInput] = useState<string>('');
  const [userIdInput, setUserIdInput] = useState<string>('');

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

  const reviews = useMemo(() => data?.content ?? [], [data]);
  const totalRecords = data?.totalElements ?? 0;

  const { mutate: hideReview, isPending: isHiding } = useHideReview();
  const { mutate: unhideReview, isPending: isUnhiding } = useUnhideReview();

  const columns = useMemo(
    () => [
      { field: 'id', header: 'ID' },
      {
        field: 'productId',
        header: 'Product',
        body: (row: ReviewDto) => (
          <Link to={`/edit-product/${row.productId}`}>
            {row.productName ? row.productName : `#${row.productId}`}
          </Link>
        ),
      },
      {
        field: 'userId',
        header: 'User',
        body: (row: ReviewDto) => (
          <Link to={`/customers`}>{row.userEmail ? row.userEmail : `#${row.userId}`}</Link>
        ),
      },
      {
        field: 'rating',
        header: 'Rating',
        sortable: true,
        body: (row: ReviewDto) => (
          <Flex spacing="s" align="center">
            <Rating value={row.rating} />
            <span>({row.rating})</span>
          </Flex>
        ),
      },
      { field: 'comment', header: 'Comment' },
      {
        field: 'status',
        header: 'Status',
        body: (row: ReviewDto) => {
          const st = (row.status as string) || 'PUBLISHED';
          const appearance = st === 'HIDDEN' ? 'warning' : 'success';
          return <Chip label={st} appearance={appearance as any} />;
        },
      },
      {
        field: 'createdAt',
        header: 'Created At',
        sortable: true,
        body: (row: ReviewDto) => (row.createdAt ? new Date(row.createdAt).toLocaleString() : ''),
      },
      {
        field: 'actions',
        header: 'Actions',
        body: (row: ReviewDto) => {
          const isHidden = row.status === 'HIDDEN';
          return (
            <Button
              size="small"
              appearance="outline"
              leftIcon={isHidden ? faEye : faEyeSlash}
              isLoading={isHiding || isUnhiding}
              onClick={() => (isHidden ? unhideReview(row.id) : hideReview(row.id))}
            >
              {isHidden ? 'Unhide' : 'Hide'}
            </Button>
          );
        },
      },
    ],
    [hideReview, unhideReview, isHiding, isUnhiding]
  );

  const handleSort = useCallback(({ field, order }: { field: string; order: number }) => {
    setSortField(field);
    setSortOrder(order);
    setPage(1);
  }, []);

  const handlePageChange = useCallback((newPage: number, newPageSize: number) => {
    setPage(newPage);
    setPageSize(newPageSize);
  }, []);

  return (
    <AdminLayout>
      <Flex direction="vertical" spacing="m" fullWidth>
        <Heading>Reviews</Heading>

        <Flex direction="horizontal" spacing="m" wrap>
          {/* Product/User search inputs with Search button */}
          <StringInput
            placeholder="Product ID"
            value={productIdInput}
            onChange={(v) => setProductIdInput(v.replace(/[^0-9]/g, ''))}
          />
          <StringInput
            placeholder="User ID"
            value={userIdInput}
            onChange={(v) => setUserIdInput(v.replace(/[^0-9]/g, ''))}
          />
          <Button
            appearance="outline"
            onClick={() => {
              setProductId(productIdInput);
              setUserId(userIdInput);
              setPage(1);
            }}
          >
            Search
          </Button>

          {/* Rating dropdown */}
          <Select
            className={styles.reviewPageSelect}
            value={rating}
            onChange={(v) => {
              setRating(String(v ?? ''));
              setPage(1);
            }}
          >
            {ratingOptions.map((opt) => (
              <Option key={opt.value} value={opt.value}>
                {opt.label}
              </Option>
            ))}
          </Select>

          {/* Status dropdown */}
          <Select
            className={styles.reviewPageSelect}
            value={status}
            onChange={(v) => {
              setStatus(String(v ?? ''));
              setPage(1);
            }}
          >
            {statusOptions.map((opt) => (
              <Option key={opt.value} value={opt.value}>
                {opt.label}
              </Option>
            ))}
          </Select>
        </Flex>

        <Table
          value={reviews}
          columns={columns}
          paginator
          rows={pageSize}
          totalRecords={totalRecords}
          sortField={sortField}
          sortOrder={sortOrder}
          onSort={handleSort}
          isLoading={isLoading}
          onPageChange={handlePageChange}
        />
      </Flex>
    </AdminLayout>
  );
};

export default ReviewsPage;
