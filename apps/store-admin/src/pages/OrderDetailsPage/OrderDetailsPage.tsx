import React from 'react';
import AdminLayout from '../../components/layout/AdminLayout/AdminLayout';
import { Chip, Select, Option, Button, Flex, Heading, ConfirmDialog } from '@baby-toys/ui-kit';
import styles from './order-details-page.module.scss';
import { statusColorMap, getOrderStatusOptions } from '../OrdersPage/orders-page.utils';
import { formatDate } from '@baby-toys/ui-kit/utils';
import { OrderStatus } from '../../api/types/order';
import { useOrderDetails } from './useOrderDetails';
import { OrderItems } from './OrderItems';
import { CouponAndSummary } from './CouponAndSummary.tsx';
import { ShippingAddressCard } from './ShippingAddressCard.tsx';
import { ShippingNoteCard } from './ShippingNoteCard.tsx';
import { useStoreSettings } from '../../api/settingsApi';
import { useTranslation } from 'react-i18next';

interface OrderDetailsPageProps {
  isEdit?: boolean;
}

const OrderDetailsPage: React.FC<OrderDetailsPageProps> = ({ isEdit }) => {
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
  const currency = { symbol: settings?.general?.currencySymbol } as const;
  const statusOptions = getOrderStatusOptions(t);

  return (
    <AdminLayout isLoading={!order || isLoading} isMaskLoading={isMutating}>
      {/* Header */}
      <Flex justify="between" align="center" className={styles.orderDetailsHeaderRow}>
        <Flex direction="vertical" spacing="xs">
          <Heading>
            {isEdit
              ? `${t('orderDetails.editOrder')} #${order?.orderNumber || order?.id}`
              : `${t('orders.orderNumber')} #${order?.orderNumber || order?.id}`}
          </Heading>
          <span className={styles.orderDetailsOrderDate}>
            {t('orderDetails.placedOn', { date: formatDate(order?.createdAt) })}
          </span>
        </Flex>

        {isEdit ? (
          <Flex direction="vertical" spacing="xs" align="end">
            <Select
              className={styles.orderDetailsStatus}
              value={selectValue}
              isDisabled={allowedOptions.length === 0}
              onChange={(val) => handleStatusSelectChange(val as OrderStatus)}
            >
              {order?.status && (
                <Option key={`current-${order.status}`} value={order.status}>
                  {t('orderDetails.currentStatus', {
                    status:
                      statusOptions.find((o) => o.value === order.status)?.label || order.status,
                  })}
                </Option>
              )}
              {allowedOptions.map(({ label, value }) => (
                <Option key={value} value={value}>
                  {label}
                </Option>
              ))}
            </Select>
          </Flex>
        ) : (
          <Flex align="center" spacing="m">
            <Chip
              label={t(`orderStatus.${String(order?.status || '').toLowerCase()}`, order?.status as any)}
              appearance={statusColorMap[order?.status]}
            />
            <Button onClick={() => navigate(`/order-edit/${order?.id}`)} appearance="outline">
              {t('orderDetails.editOrder')}
            </Button>
          </Flex>
        )}
      </Flex>

      {/* Content */}
      <Flex spacing="xxl" align="start" className={styles.orderDetailsPageContent} fullHeight>
        <OrderItems
          order={order}
          isEdit={Boolean(isEdit && canEditOrder)}
          showHeaderActions={false}
          currency={currency}
          navigate={navigate}
          localQuantities={localQuantities}
          handleLocalQuantityChange={handleLocalQuantityChange}
          handleQuantityUpdate={handleQuantityUpdate}
          itemIdToDelete={itemIdToDelete}
          handleDeleteItem={handleDeleteItem}
          setItemIdToDelete={setItemIdToDelete}
        />
        <Flex direction="vertical" spacing="xxl" align="start" className={styles.orderDetailsPageContent} fullHeight>
          <CouponAndSummary
            isEdit={Boolean(isEdit && canEditOrder)}
            couponInput={couponInput}
            setCouponInput={setCouponInput}
            order={order}
            currency={currency}
            handleApplyCoupon={handleApplyCoupon}
            handleRemoveCoupon={handleRemoveCoupon}
            canEditOrder={canEditOrder}
          />
          <ShippingAddressCard order={order}/>
          <ShippingNoteCard note={order?.note}/>
        </Flex>
      </Flex>

      <ConfirmDialog
        visible={statusConfirmVisible}
        header={t('orderDetails.changeStatusTitle')}
        message={
          pendingStatus
            ? t('orderDetails.changeStatusConfirm', { status: pendingStatus })
            : ''
        }
        onConfirm={confirmStatusChange}
        onCancel={cancelStatusChange}
      />
    </AdminLayout>
  );
};

export default OrderDetailsPage;
