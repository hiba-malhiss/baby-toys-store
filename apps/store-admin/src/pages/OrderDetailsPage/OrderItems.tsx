import React from 'react';
import {
  Card,
  Flex,
  Heading,
  Button,
  ConfirmDialog,
  StringInput,
  PriceDisplay,
} from '@baby-toys/ui-kit';
import { faPen, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import styles from './order-details-page.module.scss';
import { NavigateFunction } from 'react-router-dom';
import { Order } from '../../api/types/order';
import { useTranslation } from 'react-i18next';

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
}) => {
  const { t } = useTranslation();
  return (
    <Card
      header={
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
      }
      className={styles.orderDetailsItems}
    >
      {order?.items?.map((item) => (
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
                alt={item.productName ?? t('orderItems.productImageAlt')}
                className={styles.orderDetailsCartItemImage}
              />
            )}
            <Flex direction="vertical">
              <Button
                withoutPadding
                appearance="link"
                onClick={() => navigate('/edit-product/' + item.productId)}
              >
                <span className={styles.orderDetailsCartItemCardName}>{item.productName}</span>
              </Button>
              <span className={styles.orderDetailsUnitPrice}>
                {t('orderItems.unit')}:{' '}
                <PriceDisplay
                  price={item?.pricePerUnit}
                  oldPrice={item?.originalPrice}
                ></PriceDisplay>
              </span>
            </Flex>
          </Flex>

          <Flex align="center" spacing="s">
            {isEdit ? (
              <StringInput
                type="number"
                withControls
                value={localQuantities[item.id] ?? item.quantity}
                onChange={(value, byControls) =>
                  handleLocalQuantityChange(item.id, parseInt(value as any, 10), byControls)
                }
                onBlur={() => handleQuantityUpdate(item.id)}
                size="medium"
              />
            ) : (
              <div className={styles.orderDetailsQuantityLabel}>
                {t('orderItems.qty')} {item.quantity}
              </div>
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

      <Flex justify="end" spacing="m" className={styles.orderDetailsTotalRow}>
        <span>{t('orderItems.total')}:</span>
        <span>
          {order.total} {currency?.symbol}
        </span>
      </Flex>

      <ConfirmDialog
        visible={itemIdToDelete !== null}
        header={t('orderItems.deleteItemTitle')}
        message={
          itemIdToDelete
            ? t('orderItems.deleteItemConfirm', {
                name: order.items.find((i) => i.id === itemIdToDelete)?.productName,
              })
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
};
