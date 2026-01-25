import React, { useMemo } from 'react';
import {
  Flex,
  Heading,
  Button,
  ConfirmDialog,
  StringInput,
  PriceDisplay,
  Table,
} from '@baby-toys/ui-kit';
import { faPen, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import styles from './order-details-page.module.scss';
import { NavigateFunction } from 'react-router-dom';
import { Order } from '../../api/types/order';
import { useTranslation } from 'react-i18next';

type Currency = { symbol: string };

type OrderItem = NonNullable<Order['items']>[number];

interface OrderItemsProps {
  order: Order;
  isEdit?: boolean;
  showHeaderActions?: boolean;
  currency: Currency;
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
  isEdit = false,
  showHeaderActions = false,
  currency,
  navigate,
  localQuantities,
  handleLocalQuantityChange,
  handleQuantityUpdate,
  itemIdToDelete,
  setItemIdToDelete,
  handleDeleteItem,
}) => {
  const { t } = useTranslation();

  const items = order?.items ?? [];

  const title = useMemo(
    () => (
      <Flex justify="between" fullWidth align="center">
        <Heading level="h3">{t('orderItems.title')}</Heading>

        {showHeaderActions && (
          <Button
            leftIcon={faPen}
            appearance="outline"
            onClick={() => navigate(`/order-edit/${order.id}`)}
          />
        )}
      </Flex>
    ),
    [navigate, order.id, showHeaderActions, t]
  );

  const columns = useMemo(
    () => [
      {
        header: t('orderItems.product', { defaultValue: 'Product' }),
        field: 'productName',
        body: (item: OrderItem) => (
          <Flex align="center" spacing="m">
            {item.mainImage && (
              <img
                src={item.mainImage}
                alt={item.productName ?? t('orderItems.productImageAlt')}
                className={styles.orderDetailsCartItemImage}
              />
            )}

            <Button
              withoutPadding
              appearance="link"
              onClick={() => navigate('/edit-product/' + item.productId)}
            >
              <span className={styles.orderDetailsCartItemCardName}>{item.productName}</span>
            </Button>
          </Flex>
        ),
      },
      {
        header: t('orderItems.unit', { defaultValue: 'Unit' }),
        field: 'pricePerUnit',
        style: { minWidth: 140 },
        body: (item: OrderItem) => (
          <PriceDisplay price={item?.pricePerUnit} oldPrice={item?.originalPrice}/>
        ),
      },
      {
        header: t('orderItems.qty', { defaultValue: 'Qty' }),
        field: 'quantity',
        style: { width: 160 },
        body: (item: OrderItem) => {
          if(!isEdit) {
            return <div className={styles.orderDetailsQuantityLabel}>{item.quantity}</div>;
          }

          const value = localQuantities[item.id] ?? item.quantity;

          return (
            <StringInput
              type="number"
              withControls
              value={value}
              onChange={(next, byControls) => {
                const parsed = Number.parseInt(String(next), 10);
                // Keep the last valid value; if empty/invalid, treat as 0 (or you can keep previous).
                const qty = Number.isFinite(parsed) ? parsed : 0;
                handleLocalQuantityChange(item.id, qty, Boolean(byControls));
              }}
              onBlur={() => handleQuantityUpdate(item.id)}
              size="medium"
            />
          );
        },
      },
      {
        header: t('orderItems.total', { defaultValue: 'Total' }),
        field: 'totalPrice',
        style: { minWidth: 140 },
        body: (item: OrderItem) => (
          <span className={styles.orderDetailsCartItemCardPrice}>
            {item.totalPrice} {currency?.symbol}
          </span>
        ),
        footer: (
          <span className={styles.orderDetailsCartItemCardPrice}>
            {order.total} {currency?.symbol}
          </span>
        ),
      },
      {
        header: t('orderItems.actions', { defaultValue: 'Actions' }),
        field: 'actions',
        style: { width: 100, textAlign: 'right' as const },
        body: (item: OrderItem) =>
          isEdit ? (
            <Button
              appearance="outline"
              color="error"
              leftIcon={faTrashAlt}
              onClick={() => setItemIdToDelete(item.id)}
            />
          ) : null,
      },
    ],
    [
      currency?.symbol,
      handleLocalQuantityChange,
      handleQuantityUpdate,
      isEdit,
      localQuantities,
      navigate,
      order.total,
      setItemIdToDelete,
      t,
    ]
  );

  const itemNameToDelete = useMemo(() => {
    if(itemIdToDelete == null) return '';
    return items.find((i) => i.id === itemIdToDelete)?.productName ?? '';
  }, [itemIdToDelete, items]);

  return (
    <Flex>
      <Table
        stripedRows
        title={title}
        className={styles.orderDetailsItems}
        value={items}
        columns={columns}
      />

      <ConfirmDialog
        visible={itemIdToDelete !== null}
        header={t('orderItems.deleteItemTitle')}
        message={
          itemIdToDelete !== null
            ? t('orderItems.deleteItemConfirm', { name: itemNameToDelete })
            : ''
        }
        onConfirm={() => {
          if(itemIdToDelete !== null) handleDeleteItem(itemIdToDelete);
          setItemIdToDelete(null);
        }}
        onCancel={() => setItemIdToDelete(null)}
      />
    </Flex>
  );
};
