import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout/AdminLayout';
import { Heading, Table, Button, ConfirmDialog } from '@baby-toys/ui-kit';
import { useMockAdminApi } from '@mock-data/useMockApi';
import { Review } from '@baby-toys/types/src';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';

const ReviewsPage: React.FC = () => {
  const { getReviews, deleteReview } = useMockAdminApi();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);

  const fetchReviews = () => {
    getReviews()
      .then((data) => {
        setReviews(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchReviews();
  }, [getReviews]);

  const handleDeleteClick = (review: Review) => {
    setSelectedReviewId(review.id);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!selectedReviewId) return;
    setLoading(true);
    setShowDeleteDialog(false);
    try {
      const response = await deleteReview(selectedReviewId);
      if (response.success) {
        fetchReviews();
      }
    } catch (error) {
      console.error('Failed to delete review:', error);
    } finally {
      setSelectedReviewId(null);
      setLoading(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteDialog(false);
    setSelectedReviewId(null);
  };

  const columns = [
    { field: 'product.name', header: 'Product' },
    { field: 'name', header: 'User' },
    { field: 'rating', header: 'Rating' },
    { field: 'comment', header: 'Comment' },
    {
      field: 'actions',
      header: 'Actions',
      body: (row: Review) => (
        <Button
          appearance="outline"
          leftIcon={faTrashAlt}
          onClick={() => handleDeleteClick(row)}
          isDisabled={loading}
        >
          {loading &&
          selectedReviewId === (row.id || `${row.name}-${row.comment?.substring(0, 20)}`)
            ? 'Deleting...'
            : 'Delete'}
        </Button>
      ),
    },
  ];

  return (
    <AdminLayout>
      <Heading className="bts-marginBm">Reviews</Heading>
      <Table value={reviews} columns={columns} isLoading={loading} />

      <ConfirmDialog
        visible={showDeleteDialog}
        header="Delete Review"
        message="Are you sure you want to delete this review? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </AdminLayout>
  );
};

export default ReviewsPage;
