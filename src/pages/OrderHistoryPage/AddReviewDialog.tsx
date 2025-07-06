import { useState } from 'react';
import Dialog from '../../components/common/Dialog/Dialog';
import { Button } from '../../components/common/Button/Button';
import Rating from '../../components/common/Rating/Rating';
import { useToast } from '../../components/common/Toast/ToastContext';
import Flex from '../../components/common/Flex/Flex.tsx';
import Heading from '../../components/common/Heading/Heading.tsx';
import type { CartItem } from '../../types/product.types.ts';
import { mockAddProductReview } from '../../mock-data/useMockProductsApi.ts';
import { useAuth } from '../../context/AuthContext.tsx';
import { TextArea } from '../../components/common/TextArea/TextArea.tsx';

interface AddReviewDialogProps {
  open: boolean;
  orderId: string;
  onClose: () => void;
  cartItem?: CartItem | null;
  onSubmitSuccess?: (reviewData: { rating: number; comment: string }) => void;
}

const AddReviewDialog = ({
  open,
  onClose,
  cartItem,
  onSubmitSuccess,
  orderId,
}: AddReviewDialogProps) => {
  const { user } = useAuth();
  const [review, setReview] = useState({ rating: 0, comment: '' });
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  const isValid = review.rating > 0 && review.comment.trim().length >= 5;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || !cartItem) return;

    setSubmitting(true);
    try {
      await mockAddProductReview(user?.email, {
        rating: review.rating,
        comment: review.comment,
        name: user?.name,
        avatarUrl: user.avatarUrl || '',
        orderId,
        productId: cartItem.productId,
      });

      toast.success('Review submitted!');
      onSubmitSuccess?.(review);
      setReview({ rating: 0, comment: '' });
      onClose();
    } catch (error) {
      toast.error('Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!cartItem) return null;

  return (
    <Dialog header="Add Review" visible={open} onVisibleChange={onClose} modal closable>
      <Flex direction="vertical" spacing="xxl" fullWidth>
        <Flex>
          <img
            src={cartItem.product.mainImage}
            alt={cartItem.product.name}
            style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 12 }}
          />
          <Heading level="h4" className="bts-marginVxl">
            {cartItem?.product.name}
          </Heading>
        </Flex>

        <Rating
          value={review.rating}
          size="xlarge"
          onChange={(val) => setReview((r) => ({ ...r, rating: val }))}
        />

        <TextArea
          value={review.comment}
          onChange={(val) => {
            setReview((r) => ({ ...r, comment: val }));
          }}
          placeholder="Add a comment..."
          aria-label="Review comment"
          fullWidth
        />

        <Button
          onClick={handleSubmit}
          isLoading={submitting}
          color="primary"
          fullWidth
          isDisabled={!isValid}
        >
          Submit Review
        </Button>
      </Flex>
    </Dialog>
  );
};

export default AddReviewDialog;
