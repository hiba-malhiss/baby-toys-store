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
import { NavigateFunction } from 'react-router-dom';
import { Order } from '../../api/types/order';

interface OrderItemsProps {
  order: Order;
  isEdit?: boolean;
  showHeaderActions?: boolean;
  currency: { symbol: string };
  navigate: NavigateFunction;
  localQuantities: Record<number, number>;
  handleLocalQuantityChange: (id: number, qty: number, byControls: boolean) => void;
  handleQuantityUpdate: (id: number) => void;
  itemIdToDelete: number | null;
  setItemIdToDelete: (id: number | null) => void;
  handleDeleteItem: (id: number) => void;
}

export const OrderItems: React.FC<OrderItemsProps> = ({
  order,
  isEdit,
  showHeaderActions,
  currency,
  navigate,
  localQuantities,
  handleLocalQuantityChange,
  handleQuantityUpdate,
  itemIdToDelete,
  setItemIdToDelete,
  handleDeleteItem,
}) => (
  <Card
    header={
      <Flex justify="between" fullWidth align="center">
        <Heading level="h3">Order Items</Heading>
        {showHeaderActions && (
          <Button
            leftIcon={faPen}
            appearance="outline"
            onClick={() => navigate(`/order-edit/${order.id}`)}
          />
        )}
      </Flex>
    }
    className={styles.orderDetailsItems}
  >
    {order.items.map((item) => (
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
              alt={item.productName ?? 'Product image'}
              className={styles.orderDetailsCartItemImage}
            />
          )}
          <Flex direction="vertical">
            <span className={styles.orderDetailsCartItemCardName}>{item.productName}</span>
            <span className={styles.orderDetailsUnitPrice}>
              Unit: {item?.pricePerUnit} {currency?.symbol}
            </span>
          </Flex>
        </Flex>

        <Flex align="center" spacing="s">
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
              onClick={() => setItemIdToDelete(item.id)}
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
        {order.total} {currency?.symbol}
      </span>
    </Flex>

    <ConfirmDialog
      visible={itemIdToDelete !== null}
      header="Delete Item"
      message={
        itemIdToDelete
          ? `Are you sure you want to delete "${
              order.items.find((i) => i.id === itemIdToDelete)?.productName
            }" from the order?`
          : ''
      }
      onConfirm={() => {
        if (itemIdToDelete) handleDeleteItem(itemIdToDelete);
        setItemIdToDelete(null);
      }}
      onCancel={() => setItemIdToDelete(null)}
    />
  </Card>
);
