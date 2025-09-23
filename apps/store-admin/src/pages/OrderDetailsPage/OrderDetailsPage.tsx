import React from 'react';
import AdminLayout from '../../components/layout/AdminLayout/AdminLayout';
import {
  Chip,
  Select,
  Option,
  Button,
  Flex,
  Heading,
  ConfirmDialog,
} from '@baby-toys/ui-kit';
import styles from './order-details-page.module.scss';
import { useAdminStoreConfiguration } from '../../context/StoreConfigurationContext';
import { statusColorMap, orderStatusOptions } from '../OrdersPage/orders-page.utils';
import { formatDate } from '@baby-toys/ui-kit/utils';
import { OrderStatus } from '../../api/types/order';
import { useOrderDetails } from './useOrderDetails';
import { OrderItems } from './OrderItems';
import { CouponAndSummary } from './CouponAndSummary.tsx';

interface OrderDetailsPageProps {
  isEdit?: boolean;
}

const OrderDetailsPage: React.FC<OrderDetailsPageProps> = ({ isEdit }) => {
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

  const { currency } = useAdminStoreConfiguration();

  return (
    <AdminLayout isLoading={!order || isLoading} isMaskLoading={isMutating}>
      {/* Header */}
      <Flex justify="between" align="center" className={styles.orderDetailsHeaderRow}>
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
          <Flex direction="vertical" spacing="xs" align="end">
            <Select
              className={styles.orderDetailsStatus}
              value={selectValue}
              isDisabled={allowedOptions.length === 0}
              onChange={(val) => handleStatusSelectChange(val as OrderStatus)}
            >
              {order?.status && (
                <Option key={`current-${order.status}`} value={order.status}>
                  {`Current: ${
                    orderStatusOptions.find((o) => o.value === order.status)?.label || order.status
                  }`}
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
            <Chip label={order?.status} appearance={statusColorMap[order?.status]} />
            <Button onClick={() => navigate(`/order-edit/${order?.id}`)} appearance="outline">
              Edit Order
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
      </Flex>

      <ConfirmDialog
        visible={statusConfirmVisible}
        header="Change Order Status"
        message={
          pendingStatus ? `Are you sure you want to change the status to "${pendingStatus}"?` : ''
        }
        onConfirm={confirmStatusChange}
        onCancel={cancelStatusChange}
      />
    </AdminLayout>
  );
};

export default OrderDetailsPage;
