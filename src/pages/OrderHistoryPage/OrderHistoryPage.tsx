import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../../components/layout/PageContainer/PageContainer';
import BouncingDotsLoader from '../../components/common/BouncingDotsLoader/BouncingDotsLoader';
import { ViewSwitcher } from '../../components/common/ViewSwitcher/ViewSwitcher';
import OrderProductCard from './OrderProductCard/OrderProductCard';
import AddReviewDialog from './AddReviewDialog';
import { useAuth } from '../../context/AuthContext';
import { useCartStore } from '../../store/useCartStore';
import { useToast } from '../../components/common/Toast/ToastContext';
import { useHandlePagination } from '../../hooks/useHandlePagination';
import { mockFetchOrdersHistory } from '../../mock-data/useMockProductsApi';
import { SHOP_PAGE_SIZE } from '../../constants/display.constants';
import { faBoxOpen } from '@fortawesome/free-solid-svg-icons';
import { NoDataFound } from '../../components/common/NoDataFound.tsx';
import type { CartItem } from '../../types/product.types.ts';

const OrderHistoryPage: React.FC = () => {
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const { addToCart } = useCartStore();

  const [reviewDialog, setReviewDialog] = useState<{
    open: boolean;
    cartItem: CartItem;
    orderId: string;
  } | null>(null);

  useEffect(() => {
    if (!isLoggedIn || !user) {
      navigate('/');
    }
  }, [isLoggedIn, user, navigate]);

  const fetchOrderProducts = useCallback(
    async (page: number) => {
      if (!isLoggedIn || !user) {
        return { items: [], page: 1, totalPages: 1, totalItems: 0 };
      }
      return await mockFetchOrdersHistory(user.email, page, SHOP_PAGE_SIZE);
    },
    [isLoggedIn, user]
  );

  const { items, page, totalSize, loading, handlePaginationChange } = useHandlePagination(
    fetchOrderProducts,
    SHOP_PAGE_SIZE,
    false,
    'default'
  );

  const handleBuyAgain = async (product: any) => {
    addToCart(product);
    toast.success('Added to cart!');
  };

  return (
    <PageContainer header="Order History">
      {loading && page === 1 ? (
        <BouncingDotsLoader />
      ) : items.length === 0 ? (
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
          pageSize={SHOP_PAGE_SIZE}
          totalSize={totalSize}
          onPaginationChange={handlePaginationChange}
          staticView="flex"
          isLoading={loading}
        />
      )}

      <AddReviewDialog
        open={!!reviewDialog}
        onClose={() => setReviewDialog(null)}
        product={reviewDialog?.cartItem}
        orderId={reviewDialog?.orderId}
      />
    </PageContainer>
  );
};

export default OrderHistoryPage;
