import { useEffect, useState, useMemo } from 'react';
import { useNavigate, useParams, NavigateFunction } from 'react-router-dom';
import {
  useAdminOrder,
  useApplyOrderCoupon,
  useRemoveOrderCoupon,
  useRemoveOrderItem,
  useUpdateOrderItemQuantity,
  useUpdateOrderStatus,
} from '../../api/ordersApi';
import type { OrderStatus } from '../../api/types/order';
import { getAllowedStatusOptions, canAdminEdit } from '../OrdersPage/orders-page.utils';
import { useTranslation } from 'react-i18next';

export function useOrderDetails() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const orderId = id && !isNaN(Number(id)) ? Number(id) : undefined;
  const navigate: NavigateFunction = useNavigate();

  const { data: order, isLoading } = useAdminOrder(orderId);
  const updateStatus = useUpdateOrderStatus(orderId!);
  const updateQty = useUpdateOrderItemQuantity(orderId!);
  const removeItem = useRemoveOrderItem(orderId!);
  const applyCoupon = useApplyOrderCoupon(orderId!);
  const removeCoupon = useRemoveOrderCoupon(orderId!);

  const [itemIdToDelete, setItemIdToDelete] = useState<number | null>(null);
  const [couponInput, setCouponInput] = useState('');
  const [localQuantities, setLocalQuantities] = useState<Record<number, number>>({});

  const [statusConfirmVisible, setStatusConfirmVisible] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<OrderStatus | null>(null);
  const [selectValue, setSelectValue] = useState<OrderStatus | undefined>();

  const allowedOptions = order?.status
    ? getAllowedStatusOptions(order.status as OrderStatus, t)
    : [];
  const canEditOrder = order?.status ? canAdminEdit(order.status as OrderStatus) : false;

  // keep select value in sync with actual order status
  useEffect(() => {
    if (order?.status) {
      setSelectValue(order.status as OrderStatus);
    }
  }, [order?.status]);

  const handleStatusChange = (newStatus: OrderStatus) => {
    if (orderId) updateStatus.mutate(newStatus);
  };

  const handleStatusSelectChange = (val: OrderStatus | string) => {
    const next = val as OrderStatus;
    if (next === order?.status) {
      setSelectValue(order?.status as OrderStatus);
      return;
    }
    setSelectValue(next);
    setPendingStatus(next);
    setStatusConfirmVisible(true);
  };

  const confirmStatusChange = () => {
    if (pendingStatus) handleStatusChange(pendingStatus);
    setStatusConfirmVisible(false);
    setPendingStatus(null);
  };

  const cancelStatusChange = () => {
    setStatusConfirmVisible(false);
    setPendingStatus(null);
    if (order?.status) setSelectValue(order.status as OrderStatus);
  };

  const handleLocalQuantityChange = (itemId: number, quantity: number, byControls: boolean) => {
    setLocalQuantities((prev) => ({ ...prev, [itemId]: quantity }));
    if (byControls) handleQuantityUpdate(itemId, quantity);
  };

  const handleQuantityUpdate = (itemId: number, quantity?: number) => {
    if (!orderId || !order) return;
    const originalQuantity = order.items.find((i) => i.id === itemId)?.quantity;
    const newQuantity = quantity ?? localQuantities[itemId] ?? originalQuantity;
    if (newQuantity != null && newQuantity !== originalQuantity) {
      updateQty.mutate(
        { orderItemId: itemId, quantity: newQuantity },
        {
          onSuccess: () =>
            setLocalQuantities((prev) => {
              const copy = { ...prev };
              delete copy[itemId];
              return copy;
            }),
          onError: () =>
            setLocalQuantities((prev) => ({
              ...prev,
              // Revert to previous server value
              [itemId]: originalQuantity as number,
            })),
        }
      );
    }
  };

  const handleDeleteItem = (itemId: number) => removeItem.mutate(itemId);
  const handleApplyCoupon = () => {
    if (orderId && couponInput.trim()) applyCoupon.mutate(couponInput.trim());
  };
  const handleRemoveCoupon = () => {
    if (orderId) removeCoupon.mutate();
  };

  const isMutating = useMemo(
    () =>
      updateStatus.isPending ||
      updateQty.isPending ||
      removeItem.isPending ||
      applyCoupon.isPending ||
      removeCoupon.isPending,
    [
      updateStatus.isPending,
      updateQty.isPending,
      removeItem.isPending,
      applyCoupon.isPending,
      removeCoupon.isPending,
    ]
  );

  return {
    order,
    isLoading,
    navigate,
    itemIdToDelete,
    setItemIdToDelete,
    couponInput,
    setCouponInput,
    localQuantities,
    handleStatusSelectChange,
    confirmStatusChange,
    cancelStatusChange,
    selectValue,
    allowedOptions,
    canEditOrder,
    handleLocalQuantityChange,
    handleQuantityUpdate,
    handleDeleteItem,
    handleApplyCoupon,
    handleRemoveCoupon,
    isMutating,
    statusConfirmVisible,
    pendingStatus,
  };
}
