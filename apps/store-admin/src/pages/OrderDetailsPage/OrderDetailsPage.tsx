import React from 'react';
import AdminLayout from '../../components/layout/AdminLayout/AdminLayout';
import {
  Card,
  Chip,
  Select,
  Option,
  Button,
  Flex,
  Heading,
  StringInput,
  ConfirmDialog,
} from '@baby-toys/ui-kit/components';
import styles from './order-details-page.module.scss';
import { useAdminStoreConfiguration } from '../../context/StoreConfigurationContext.tsx';
import { orderStatusOptions, statusColorMap } from '../OrdersPage/orders-page.utils.ts';
import { formatDate } from '@baby-toys/ui-kit/utils';
import { OrderStatus } from '../../api/types/order.ts';
import { useOrderDetails } from './useOrderDetails.ts';
import { OrderItems } from './OrderItems.tsx';

interface OrderDetailsPageProps {
  isEdit?: boolean;
}

const OrderDetailsPage: React.FC<OrderDetailsPageProps> = ({ isEdit }) => {
  const {
    order,
    isLoading,
    navigate,
    confirmVisible,
    setConfirmVisible,
    couponInput,
    setCouponInput,
    localQuantities,
    handleLocalQuantityChange,
    handleQuantityUpdate,
    handleStatusChange,
    handleApplyCoupon,
    handleRemoveCoupon,
    handleDeleteItem,
    setConfirmDeleteItemId,
    confirmDeleteItemId,
    isMaskLoading,
    deleteOrder,
  } = useOrderDetails();

  const { currency } = useAdminStoreConfiguration();

  return (
    <AdminLayout isLoading={!order || isLoading} isMaskLoading={isMaskLoading}>
      {/* Header */}
      <Flex justify="between" className={styles.orderDetailsHeaderRow}>
        <Flex direction="vertical" spacing="xs">
          <Heading>
            {isEdit
              ? `Edit Order #${order?.orderNumber || order?.id}`
              : `Order #${order?.orderNumber || order?.id}`}
          </Heading>
          <span className={styles.orderDetailsOrderDate}>
            Placed on {formatDate(order?.createdAt)}
          </span>
        </Flex>

        {isEdit ? (
          <Select
            className={styles.orderDetailsStatus}
            value={order?.status}
            isDisabled={
              order?.status === OrderStatus.CANCELLED || order?.status === OrderStatus.DELIVERED
            }
            onChange={(val) => handleStatusChange(val as OrderStatus)}
          >
            {orderStatusOptions.map(({ label, value }) => (
              <Option key={value} value={value}>
                {label}
              </Option>
            ))}
          </Select>
        ) : (
          <Chip label={order?.status} appearance={statusColorMap[order?.status]} />
        )}
      </Flex>

      {/* Content */}
      <Flex spacing="xxl" align="start" className={styles.orderDetailsPageContent} fullHeight>
        <OrderItems
          order={order}
          isEdit={isEdit}
          currency={currency}
          navigate={navigate}
          localQuantities={localQuantities}
          handleLocalQuantityChange={handleLocalQuantityChange}
          handleQuantityUpdate={handleQuantityUpdate}
          confirmDeleteItemId={confirmDeleteItemId}
          setConfirmDeleteItemId={setConfirmDeleteItemId}
          handleDeleteItem={handleDeleteItem}
          setConfirmVisible={setConfirmVisible}
        />

        {/* Coupon & Summary */}
        <Card header={<Heading level="h3">Coupon & Summary</Heading>}>
          <Flex spacing="xl" direction="vertical">
            {isEdit && (
              <Flex spacing="m" align="center" className={styles.couponRow}>
                <StringInput
                  placeholder="Coupon code"
                  value={couponInput}
                  onChange={(value) => setCouponInput(value)}
                />
                <Button onClick={handleApplyCoupon} isDisabled={!couponInput?.trim()}>
                  Apply
                </Button>
                {order?.couponCode && (
                  <Button appearance="outline" color="secondary" onClick={handleRemoveCoupon}>
                    Remove ({order?.couponCode})
                  </Button>
                )}
              </Flex>
            )}

            {order?.couponCode ? (
              <Flex spacing="s" justify="between" className={styles.orderDetailsCouponDetails}>
                <span>Coupon Applied:</span>
                <span className={styles.couponCode}>{order?.couponCode}</span>
              </Flex>
            ) : (
              <span className={styles.orderDetailsNoCoupon}>No coupon applied</span>
            )}

            <Flex spacing="s" justify="between">
              <strong>Subtotal:</strong>
              <span>
                {order?.subtotal} {currency?.symbol}
              </span>
            </Flex>
            <Flex spacing="s" justify="between">
              <strong>Discount:</strong>
              <span className={styles.orderDetailsDiscount}>
                - {order?.discountAmount} {currency?.symbol}
              </span>
            </Flex>
            <Flex spacing="s" justify="between" className={styles.orderDetailsTotalSummary}>
              <strong>Total:</strong>
              <span>
                {order?.total} {currency?.symbol}
              </span>
            </Flex>
          </Flex>
        </Card>
      </Flex>

      {/* Delete Order Confirmation */}
      <ConfirmDialog
        visible={confirmVisible}
        header="Delete Order"
        message={`Are you sure you want to delete order #${order?.orderNumber || order?.id}?`}
        onConfirm={() => {
          deleteOrder.mutate(order?.id, {
            onSuccess: () => navigate('/orders'),
          });
          setConfirmVisible(false);
        }}
        onCancel={() => setConfirmVisible(false)}
      />
    </AdminLayout>
  );
};

export default OrderDetailsPage;
