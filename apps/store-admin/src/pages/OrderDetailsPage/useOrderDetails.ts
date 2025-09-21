import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  useAdminOrder,
  useApplyOrderCoupon,
  useRemoveOrderCoupon,
  useRemoveOrderItem,
  useUpdateOrderItemQuantity,
  useUpdateOrderStatus,
  useDeleteOrder,
} from '../../api/ordersApi';
import type { OrderStatus } from '../../api/types/order';

export function useOrderDetails() {
  const { id } = useParams<{ id: string }>();
  const orderId = id ? Number(id) : undefined;
  const navigate = useNavigate();

  const { data: order, isLoading } = useAdminOrder(orderId);
  const updateStatus = useUpdateOrderStatus(orderId!);
  const updateQty = useUpdateOrderItemQuantity(orderId!);
  const removeItem = useRemoveOrderItem(orderId!);
  const applyCoupon = useApplyOrderCoupon(orderId!);
  const removeCoupon = useRemoveOrderCoupon(orderId!);
  const deleteOrder = useDeleteOrder();

  const [confirmVisible, setConfirmVisible] = useState(false);
  const [confirmDeleteItemId, setConfirmDeleteItemId] = useState<number | null>(null);
  const [couponInput, setCouponInput] = useState('');
  const [localQuantities, setLocalQuantities] = useState<Record<number, number>>({});

  const handleStatusChange = (newStatus: OrderStatus) => {
    if (orderId) updateStatus.mutate(newStatus);
  };

  const handleLocalQuantityChange = (itemId: number, quantity: number, byControls: boolean) => {
    setLocalQuantities((prev) => ({ ...prev, [itemId]: quantity }));
    if (byControls) {
      handleQuantityUpdate(itemId);
    }
  };

  const handleQuantityUpdate = (itemId: number) => {
    if (!orderId || !order) return;
    const originalQuantity = order.items.find((i) => i.id === itemId)?.quantity;
    const newQuantity = localQuantities[itemId] ?? originalQuantity;

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
        }
      );
    }
  };

  const handleDeleteItem = (itemId: number) => removeItem.mutate(itemId);

  const handleApplyCoupon = () => {
    if (orderId && couponInput) applyCoupon.mutate(couponInput);
  };

  const handleRemoveCoupon = () => {
    if (orderId) removeCoupon.mutate();
  };

  const isMaskLoading = useMemo(
    () =>
      updateStatus.isPending ||
      updateQty.isPending ||
      removeItem.isPending ||
      applyCoupon.isPending ||
      removeCoupon.isPending ||
      deleteOrder.isPending,
    [
      updateStatus.isPending,
      updateQty.isPending,
      removeItem.isPending,
      applyCoupon.isPending,
      removeCoupon.isPending,
      deleteOrder.isPending,
    ]
  );

  return {
    order,
    isLoading,
    navigate,
    confirmVisible,
    setConfirmVisible,
    confirmDeleteItemId,
    setConfirmDeleteItemId,
    couponInput,
    setCouponInput,
    localQuantities,
    handleStatusChange,
    handleLocalQuantityChange,
    handleQuantityUpdate,
    handleDeleteItem,
    handleApplyCoupon,
    handleRemoveCoupon,
    isMaskLoading,
    deleteOrder,
  };
}
