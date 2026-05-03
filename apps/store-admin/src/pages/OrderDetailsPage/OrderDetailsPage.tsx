import React from 'react';
import AdminLayout from '../../components/layout/AdminLayout/AdminLayout';
import { Chip, Select, Option, Button, ConfirmDialog } from '@baby-toys/ui-kit';
import styles from './order-details-page.module.scss';
import { statusColorMap, getOrderStatusOptions } from '../OrdersPage/orders-page.utils';
import { formatDate } from '@baby-toys/ui-kit/utils';
import { OrderStatus } from '../../api/types/order';
import { useOrderDetails } from './useOrderDetails';
import { OrderItems } from './OrderItems';
import { CouponAndSummary } from './CouponAndSummary';
import { ProfitCard } from './Profitcard';
import { ShippingAddressCard } from './ShippingAddressCard';
import { ShippingNoteCard } from './ShippingNoteCard';
import { useStoreSettings } from '../../api/settingsApi';
import { useTranslation } from 'react-i18next';

interface OrderDetailsPageProps {
  isEdit?: boolean;
}

const OrderDetailsPage: React.FC<OrderDetailsPageProps> = ({ isEdit = false }) => {
  const { t } = useTranslation();

  const {
    order,
    isLoading,
    navigate,
    couponInput,
    setCouponInput,
    localQuantities,
    handleLocalQuantityChange,
    handleQuantityUpdate,
    handleStatusSelectChange,
    handleApplyCoupon,
    handleRemoveCoupon,
    handleDeleteItem,
    itemIdToDelete,
    isMutating,
    setItemIdToDelete,
    selectValue,
    allowedOptions,
    canEditOrder,
    statusConfirmVisible,
    pendingStatus,
    confirmStatusChange,
    cancelStatusChange,
  } = useOrderDetails();

  const { data: settings } = useStoreSettings();
  const currency = { symbol: settings?.general?.currencySymbol ?? '' } as const;

  const statusOptions = getOrderStatusOptions(t);

  const orderIdentifier = order?.orderNumber || order?.id || '';
  const pageTitle = isEdit
    ? `${t('orderDetails.editOrder')} #${orderIdentifier}`
    : `${t('orders.orderNumber')} #${orderIdentifier}`;

  const placedOnLabel = t('orderDetails.placedOn', {
    date: formatDate(order?.createdAt),
  });

  const resolvedStatusLabel =
    statusOptions.find((o) => o.value === order?.status)?.label || String(order?.status || '');

  const isEditRoute = Boolean(isEdit);
  const showEditMode = Boolean(isEdit && canEditOrder);

  return (
    <AdminLayout isLoading={!order || isLoading} isMaskLoading={isMutating}>
      {/* ── Header ─────────────────────────────────────────────── */}
      <div className={styles.orderDetailsHeaderRow}>
        <div className={styles.orderDetailsHeaderLeft}>
          <div className={styles.orderDetailsTitle}>
            {pageTitle}
            {!showEditMode && order?.status && (
              <Chip
                label={t(`orderStatus.${String(order.status).toLowerCase()}`, {
                  defaultValue: String(order.status),
                })}
                appearance={statusColorMap[order.status]}
              />
            )}
          </div>
          <span className={styles.orderDetailsOrderDate}>{placedOnLabel}</span>
        </div>

        <div className={styles.orderDetailsHeaderRight}>
          {isEditRoute ? (
            <Select
              className={styles.orderDetailsStatus}
              value={selectValue}
              isDisabled={allowedOptions.length === 0 || !canEditOrder}
              onChange={(val) => handleStatusSelectChange(val as OrderStatus)}
            >
              {order?.status && (
                <Option key={`current-${order.status}`} value={order.status}>
                  {t('orderDetails.currentStatus', { status: resolvedStatusLabel })}
                </Option>
              )}
              {allowedOptions.map(({ label, value }) => (
                <Option key={value} value={value}>
                  {label}
                </Option>
              ))}
            </Select>
          ) : (
            <Button onClick={() => navigate(`/order-edit/${order?.id}`)} appearance="outline">
              {t('orderDetails.editOrder')}
            </Button>
          )}
        </div>
      </div>

      {/* ── Content grid ───────────────────────────────────────── */}
      <div className={styles.orderDetailsPageContent}>
        <OrderItems
          order={order as any}
          isEdit={showEditMode}
          showHeaderActions={!isEditRoute}
          currency={currency}
          navigate={navigate}
          localQuantities={localQuantities}
          handleLocalQuantityChange={handleLocalQuantityChange}
          handleQuantityUpdate={handleQuantityUpdate}
          itemIdToDelete={itemIdToDelete}
          handleDeleteItem={handleDeleteItem}
          setItemIdToDelete={setItemIdToDelete}
        />

        {/* ── Right column: note → summary → address ───────────── */}
        <div className={styles.orderDetailsRightCol}>
          {/* Note first — critical context, seen immediately */}
          <ShippingNoteCard note={order?.note} />

          <CouponAndSummary
            isEdit={showEditMode}
            couponInput={couponInput}
            setCouponInput={setCouponInput}
            order={order as any}
            currency={currency}
            handleApplyCoupon={handleApplyCoupon}
            handleRemoveCoupon={handleRemoveCoupon}
            canEditOrder={canEditOrder}
          />
          <ProfitCard order={order} currency={currency} />
          <ShippingAddressCard order={order as any} />
        </div>
      </div>

      {/* ── Status change confirm ───────────────────────────────── */}
      <ConfirmDialog
        visible={statusConfirmVisible}
        header={t('orderDetails.changeStatusTitle')}
        message={
          pendingStatus ? t('orderDetails.changeStatusConfirm', { status: pendingStatus }) : ''
        }
        onConfirm={confirmStatusChange}
        onCancel={cancelStatusChange}
      />
    </AdminLayout>
  );
};

export default OrderDetailsPage;
