import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ViewSwitcher, NoDataFound } from '@baby-toys/ui-kit';
import { useAuth } from '../../context/AuthContext';
import { useAddToCart } from '../../api/cartApi';
import { useCartStore } from '../../store/useCartStore';
import { faBoxOpen } from '@fortawesome/free-solid-svg-icons';
import { PageContainer } from '../../components/Layout/PageContainer/PageContainer.tsx';
import AddReviewDialog from './AddReviewDialog.tsx';
import OrderProductCard from './OrderProductCard/OrderProductCard.tsx';
import { useMyOrdersNormalized, useCancelMyOrder, type OrderItem } from '../../api/ordersApi';
import { useTranslation } from 'react-i18next';

const PAGE_SIZE = 5;
const OrderHistoryPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const addToCartMutation = useAddToCart();
  const { openShippingCartDrawer } = useCartStore();
  const { t } = useTranslation('common');

  const [reviewDialog, setReviewDialog] = useState<{ open: boolean; item: OrderItem } | null>(null);

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
    await addToCartMutation.mutateAsync({
      productId: Number(product?.id || product?.productId || 0),
      quantity: 1,
    });
    openShippingCartDrawer();
  };

  return (
    <PageContainer header={t('orders.header')}>
      {!isLoading && items.length === 0 ? (
        <NoDataFound
          icon={faBoxOpen}
          message={t('orders.emptyTitle')}
          subtext={t('orders.emptySubtitle')}
          withoutPadding
        />
      ) : (
        <ViewSwitcher
          items={items.map((order, idx) => (
            <OrderProductCard
              key={`order-${order.id}-${idx}`}
              order={order}
              onBuyAgain={handleBuyAgain}
              onAddReview={(item) => setReviewDialog({ open: true, item })}
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
        item={reviewDialog?.item}
      />
    </PageContainer>
  );
};

export default OrderHistoryPage;
