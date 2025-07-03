import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../../components/layout/PageContainer/PageContainer';
import Heading from '../../components/common/Heading/Heading';
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
    'show-more'
  );

  const handleBuyAgain = async (product: any) => {
    addToCart(product);
    toast.success('Added to cart!');
  };

  return (
    <PageContainer>
      <Heading level="h1" className="bts-marginBxl bts-marginTxxxxl">
        Order History
      </Heading>
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
          items={items.map((product, idx) => (
            <OrderProductCard
              key={`${product.orderId}-${product.productId}-${idx}`}
              order={product}
              onBuyAgain={handleBuyAgain}
              onAddReview={(p) => setReviewDialog({ open: true, cartItem: p })}
            />
          ))}
          page={page}
          pageSize={SHOP_PAGE_SIZE}
          totalSize={totalSize}
          onPaginationChange={() => handlePaginationChange(page + 1)}
          staticView="flex"
          isLoading={loading}
          paginationMode="show-more"
        />
      )}

      <AddReviewDialog
        open={!!reviewDialog}
        onClose={() => setReviewDialog(null)}
        product={reviewDialog?.cartItem}
      />
    </PageContainer>
  );
};

export default OrderHistoryPage;
