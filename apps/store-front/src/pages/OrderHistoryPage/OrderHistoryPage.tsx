import React, { useEffect, useState, useMemo } from 'react';
import moment from 'moment';
import { useIsFetching } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  ViewSwitcher,
  NoDataFound,
  ConfirmDialog,
  Calendar,
  Flex,
  Button,
} from '@baby-toys/ui-kit';
import { useAuth } from '../../context/AuthContext';
import { useAddToCart } from '../../api/cartApi';
import { useCartStore } from '../../store/useCartStore';
import { Package } from 'lucide-react';
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
  const [month, setMonth] = useState<string>(''); // format YYYY-MM
  const { data, isLoading } = useMyOrdersNormalized({
    page,
    size: PAGE_SIZE,
    sortBy: 'createdAt',
    sortDirection: 'DESC',
    month: month || undefined,
  });
  const cancelMutation = useCancelMyOrder();
  const [cancelingId, setCancelingId] = useState<string | null>(null);
  const [confirmOrderId, setConfirmOrderId] = useState<string | null>(null);
  const [awaitingRefetchForId, setAwaitingRefetchForId] = useState<string | null>(null);
  const isOrdersRefetching = useIsFetching({ queryKey: ['customer-orders-normalized'] }) > 0;

  // When refetch completes after a cancel, clear loading state
  useEffect(() => {
    if (!isOrdersRefetching && awaitingRefetchForId && cancelingId === awaitingRefetchForId) {
      setCancelingId(null);
      setAwaitingRefetchForId(null);
    }
  }, [isOrdersRefetching, awaitingRefetchForId, cancelingId]);

  const items = useMemo(() => data?.content ?? [], [data]);
  const totalSize = data?.totalElements ?? 0;

  const handleBuyAgain = async (product: any) => {
    await addToCartMutation.mutateAsync({
      productId: Number(product?.id || product?.productId || 0),
      quantity: 1,
    });
    openShippingCartDrawer();
  };

  const selectedMoment = useMemo(() => (month ? moment(month, 'YYYY-MM') : moment()), [month]);

  return (
    <PageContainer header={t('orders.header')}>
      <Flex className="bts-marginBxl" spacing="s" align="center">
        <label className="bts-marginRe">
          {t('orders.filterByMonth', { defaultValue: 'Filter by month' })}
        </label>
        <div style={{ maxWidth: 280, display: 'inline-block' }}>
          <Calendar
            typeView="month"
            value={selectedMoment}
            disableFutureDates
            fullWidth
            getLabel={() => (month ? selectedMoment.format('MMM YYYY') : '')}
            onChange={(val) => {
              const v = Array.isArray(val) ? val[0] : val;
              if (v && v.isValid && v.isValid()) {
                setMonth(v.format('YYYY-MM'));
                setPage(1);
              }
            }}
          />
        </div>
        {month && (
          <Button
            color="secondary-light"
            onClick={() => {
              setMonth('');
              setPage(1);
            }}
          >
            {t('filters.reset', { defaultValue: 'Reset' })}
          </Button>
        )}
      </Flex>
      {!isLoading && items.length === 0 ? (
        <NoDataFound
          icon={Package}
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
                  ? () => {
                      if (cancelingId) return; // prevent concurrent
                      setConfirmOrderId(order.id);
                    }
                  : undefined
              }
              isCancelling={cancelingId === order.id}
            />
          ))}
          page={page}
          pageSize={PAGE_SIZE}
          totalSize={totalSize}
          onPaginationChange={(newPage) => setPage(newPage)}
          isStaticView
          initialView="list"
          isLoading={isLoading}
        />
      )}

      <AddReviewDialog
        open={!!reviewDialog}
        onClose={() => setReviewDialog(null)}
        item={reviewDialog?.item}
      />

      {/* Confirmation modal for cancel */}
      <ConfirmDialog
        visible={!!confirmOrderId}
        header={t('orders.confirmHeader', { defaultValue: 'Confirmation' })}
        message={t('orders.confirmCancel', {
          defaultValue: 'Are you sure you want to cancel this order?',
        })}
        confirmLabel={t('orders.confirmYes', { defaultValue: 'Yes' })}
        cancelLabel={t('orders.confirmNo', { defaultValue: 'No' })}
        onCancel={() => setConfirmOrderId(null)}
        onConfirm={async () => {
          const id = confirmOrderId;
          if (!id) return;
          setConfirmOrderId(null);
          // Defensive: ensure we only cancel pending
          const target = items.find((o) => o.id === id);
          if (!target || target.status !== 'pending') return;
          setCancelingId(id);
          try {
            await cancelMutation.mutateAsync(Number(id));
          } finally {
            // Keep button loading until the orders refetch completes
            setAwaitingRefetchForId(id);
          }
        }}
      />
    </PageContainer>
  );
};

export default OrderHistoryPage;
