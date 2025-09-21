import React from 'react';
import {
  Card,
  Flex,
  Heading,
  Button,
  ProductQuantityInput,
  ConfirmDialog,
} from '@baby-toys/ui-kit/components';
import { faPen, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import styles from './order-details-page.module.scss';

interface OrderItemsProps {
  order: any;
  isEdit?: boolean;
  currency: any;
  navigate: any;
  localQuantities: Record<number, number>;
  handleLocalQuantityChange: (id: number, qty: number, byControls: boolean) => void;
  handleQuantityUpdate: (id: number) => void;
  confirmDeleteItemId: number | null;
  setConfirmDeleteItemId: (id: number | null) => void;
  handleDeleteItem: (id: number) => void;
  setConfirmVisible: (visible: boolean) => void;
}

export const OrderItems: React.FC<OrderItemsProps> = ({
  order,
  isEdit,
  currency,
  navigate,
  localQuantities,
  handleLocalQuantityChange,
  handleQuantityUpdate,
  confirmDeleteItemId,
  setConfirmDeleteItemId,
  handleDeleteItem,
  setConfirmVisible,
}) => {
  return (
    <Card
      header={
        <Flex justify="between" fullWidth align="center">
          <Heading level="h3">Order Items</Heading>
          {!isEdit && (
            <Flex spacing="s">
              <Button
                leftIcon={faPen}
                appearance="outline"
                onClick={() => navigate(`/order-edit/${order?.id}`)}
              />
              <Button
                appearance="outline"
                leftIcon={faTrashAlt}
                onClick={() => setConfirmVisible(true)}
              />
            </Flex>
          )}
        </Flex>
      }
      className={styles.orderDetailsItems}
    >
      {order?.items.map((item: any) => (
        <Flex
          key={item.id}
          align="center"
          justify="between"
          className={styles.orderDetailsCartItemCard}
        >
          <Flex align="center" spacing="m">
            {item.mainImage && (
              <img
                src={item.mainImage}
                alt={item.productName}
                className={styles.orderDetailsCartItemImage}
              />
            )}
            <Flex direction="vertical">
              <span className={styles.orderDetailsCartItemCardName}>{item.productName}</span>
              <span className={styles.orderDetailsUnitPrice}>
                Unit: {item.pricePerUnit} {currency?.symbol}
              </span>
            </Flex>
          </Flex>

          <Flex align="center" spacing="m">
            {isEdit ? (
              <ProductQuantityInput
                quantity={localQuantities[item.id] ?? item.quantity}
                onChange={(value, byControls) =>
                  handleLocalQuantityChange(item.id, parseInt(value, 10), byControls)
                }
                onBlur={() => handleQuantityUpdate(item.id)}
              />
            ) : (
              <div className={styles.orderDetailsQuantityLabel}>{item.quantity}</div>
            )}

            {isEdit && (
              <Button
                appearance="outline"
                color="error"
                leftIcon={faTrashAlt}
                onClick={() => setConfirmDeleteItemId(item.id)}
              />
            )}
          </Flex>

          <span className={styles.orderDetailsCartItemCardPrice}>
            {item.totalPrice} {currency?.symbol}
          </span>
        </Flex>
      ))}

      <Flex justify="between" className={styles.orderDetailsTotalRow}>
        <span>Total</span>
        <span>
          {order?.total} {currency?.symbol}
        </span>
      </Flex>

      {/* Delete Item Confirmation */}
      <ConfirmDialog
        visible={confirmDeleteItemId !== null}
        header="Delete Item"
        message={
          confirmDeleteItemId
            ? `Are you sure you want to delete "${
                order?.items.find((i: any) => i.id === confirmDeleteItemId)?.productName
              }" from the order?`
            : ''
        }
        onConfirm={() => {
          if (confirmDeleteItemId) handleDeleteItem(confirmDeleteItemId);
          setConfirmDeleteItemId(null);
        }}
        onCancel={() => setConfirmDeleteItemId(null)}
      />
    </Card>
  );
};
