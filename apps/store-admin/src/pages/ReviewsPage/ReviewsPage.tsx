import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout/AdminLayout';
import { Heading, Table, Button } from '@baby-toys/ui-kit/components';
import { useMockAdminApi } from '@mock-data/useMockApi';
import { Review } from '@baby-toys/types/src';

const ReviewsPage: React.FC = () => {
  const { getReviews, deleteReview } = useMockAdminApi();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

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

  const handleDelete = (reviewId: string) => {
    deleteReview(reviewId).then(() => fetchReviews());
  };

  const columns = [
    { field: 'product.name', header: 'Product' },
    { field: 'user.name', header: 'User' },
    { field: 'rating', header: 'Rating' },
    { field: 'comment', header: 'Comment' },
    {
      field: 'actions',
      header: 'Actions',
      body: (row: Review) => (
        <Button appearance="danger" onClick={() => handleDelete(row.id)}>
          Delete
        </Button>
      ),
    },
  ];

  return (
    <AdminLayout>
      <Heading className="bts-marginBxxl">Reviews</Heading>
      <Table value={reviews} columns={columns} isLoading={loading} />
    </AdminLayout>
  );
};

export default ReviewsPage;
