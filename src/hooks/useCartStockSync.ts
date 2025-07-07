import { useCallback, useEffect } from 'react';
import { useCartStore } from '../store/useCartStore';
import { mockFetchProductAvailability } from '../mock-data/useMockProductsApi';
import { useToast } from '../components/common/Toast/ToastContext.tsx';

// 📌 useCartStockSync is a hook for validating cart item quantities against actual product stock.
// ❗ It should only be used in shopping-related flows (e.g., Cart, Checkout, Drawer),
//    and NOT globally (like in App.tsx), to avoid silent or confusing cart mutations during regular browsing.
export function useCartStockSync() {
  const { cartItems, updateQuantity, removeFromCart } = useCartStore();
  const toast = useToast();

  const syncCartStock = useCallback(async () => {
    for (const item of cartItems) {
      try {
        const { availableStock } = await mockFetchProductAvailability(item.productId);
        if (availableStock <= 0) {
          removeFromCart(item.productId);
          toast.info(`${item.product.name} is out of stock and has been removed from your cart`);
        } else if (item.quantity > availableStock) {
          updateQuantity(item.productId, availableStock);
          toast.info(`Quantity of ${item.product.name} adjusted to available stock`);
        }
      } catch (error) {
        console.error(`Failed to sync stock for ${item.productId}`, error);
      }
    }
  }, [cartItems, updateQuantity, removeFromCart]);

  useEffect(() => {
    syncCartStock();
  }, [cartItems]);
}
