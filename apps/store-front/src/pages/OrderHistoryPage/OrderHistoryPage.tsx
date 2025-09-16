import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ViewSwitcher, useToast, NoDataFound } from '@baby-toys/ui-kit/components';
import { useAuth } from '../../context/AuthContext';
import { useCartStore } from '../../store/useCartStore';
import { useHandlePagination } from '../../hooks/useHandlePagination';
import { mockFetchOrdersHistory } from '@mock-data/useMockApi';
import { faBoxOpen } from '@fortawesome/free-solid-svg-icons';
import type { CartItem } from '../../types/product.types.ts';
import { PageContainer } from '../../components/layout/PageContainer/PageContainer.tsx';
import AddReviewDialog from './AddReviewDialog.tsx';
import OrderProductCard from './OrderProductCard/OrderProductCard.tsx';

const PAGE_SIZE = 2;
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

  const fetchOrderProducts = useCallback(
    async (page: number) => {
      return await mockFetchOrdersHistory(user.email, page, PAGE_SIZE);
    },
    [isAuthenticated, user]
  );

  const { items, page, totalSize, loading, handlePaginationChange } = useHandlePagination(
    fetchOrderProducts,
    PAGE_SIZE,
    false,
    'default'
  );

  const handleBuyAgain = async (product: any) => {
    addToCart(product);
    toast.success('Added to cart!');
  };

  return (
    <PageContainer header="Order History">
      {!loading && items.length === 0 ? (
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
              onAddReview={(p) => setReviewDialog({ open: true, cartItem: p, orderId: order.id })}
            />
          ))}
          page={page}
          pageSize={PAGE_SIZE}
          totalSize={totalSize}
          onPaginationChange={handlePaginationChange}
          staticView="flex"
          isLoading={loading}
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
