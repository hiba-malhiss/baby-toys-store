import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ViewSwitcher, useToast, NoDataFound } from '@baby-toys/ui-kit';
import { useAuth } from '../../context/AuthContext';
import { useCartStore } from '../../store/useCartStore';
import { faBoxOpen } from '@fortawesome/free-solid-svg-icons';
import type { CartItem } from '../../types/product.types.ts';
import { PageContainer } from '../../components/layout/PageContainer/PageContainer.tsx';
import AddReviewDialog from './AddReviewDialog.tsx';
import OrderProductCard from './OrderProductCard/OrderProductCard.tsx';
import { useMyOrdersNormalized, useCancelMyOrder } from '../../api/ordersApi';

const PAGE_SIZE = 5;
const OrderHistoryPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const { addToCart } = useCartStore();

  const [reviewDialog, setReviewDialog] = useState<{
    open: boolean;
    cartItem: CartItem;
    orderId: string;
  } | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/');
    }
  }, [isAuthenticated, user, navigate]);

  const [page, setPage] = useState(1);
  const { data, isLoading } = useMyOrdersNormalized({
    page,
    size: PAGE_SIZE,
    sortBy: 'createdAt',
    sortDirection: 'DESC',
  });
  const cancelMutation = useCancelMyOrder();

  const items = useMemo(() => data?.content ?? [], [data]);
  const totalSize = data?.totalElements ?? 0;

  const handleBuyAgain = async (product: any) => {
    addToCart(product);
    toast.success('Added to cart!');
  };

  return (
    <PageContainer header="Order History">
      {!isLoading && items.length === 0 ? (
        <NoDataFound
          icon={faBoxOpen}
          message="No orders found."
          subtext="You haven't placed any orders yet."
          withoutPadding
        />
      ) : (
        <ViewSwitcher
          items={items.map((order, idx) => (
            <OrderProductCard
              key={`order-${order.id}-${idx}`}
              order={order}
              onBuyAgain={handleBuyAgain}
              onAddReview={(p) =>
                setReviewDialog({ open: true, cartItem: p, orderId: String(order.id) })
              }
              onCancel={
                order.status === 'pending'
                  ? () => cancelMutation.mutate(Number(order.id))
                  : undefined
              }
            />
          ))}
          page={page}
          pageSize={PAGE_SIZE}
          totalSize={totalSize}
          onPaginationChange={(newPage) => setPage(newPage)}
          staticView="flex"
          isLoading={isLoading}
        />
      )}

      <AddReviewDialog
        open={!!reviewDialog}
        onClose={() => setReviewDialog(null)}
        cartItem={reviewDialog?.cartItem}
        orderId={reviewDialog?.orderId}
      />
    </PageContainer>
  );
};

export default OrderHistoryPage;
