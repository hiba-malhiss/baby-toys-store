import { useCallback, useEffect, useRef } from 'react';
import { useCartStore } from '../store/useCartStore';
import { mockFetchProductAvailability } from '@mock-data/useMockProductsApi';
import { useToast } from '@baby-toys/ui-kit/components';

// 📌 useCartStockSync is a hook for validating cart item quantities against actual product stock.
// ❗ It should only be used in shopping-related flows (e.g., Cart, Checkout, Drawer),
//    and NOT globally (like in App.tsx), to avoid silent or confusing cart mutations during regular browsing.
export function useCartStockSync() {
  const { cartItems, updateQuantity, removeFromCart } = useCartStore();
  const toast = useToast();

  // To avoid duplicate toasts per sync
  const notifiedProductsRef = useRef(new Set<string>());

  const syncCartStock = useCallback(async () => {
    notifiedProductsRef.current.clear();

    for (const item of cartItems) {
      try {
        const { availableStock } = await mockFetchProductAvailability(item.productId);

        if (availableStock <= 0) {
          if (!notifiedProductsRef.current.has(item.productId)) {
            removeFromCart(item.productId);
            toast.info(`${item.product.name} is out of stock and has been removed from your cart`);
            notifiedProductsRef.current.add(item.productId);
          }
        } else if (item.quantity > availableStock) {
          if (!notifiedProductsRef.current.has(item.productId)) {
            updateQuantity(item.productId, availableStock);
            toast.info(`Quantity of ${item.product.name} adjusted to available stock`);
            notifiedProductsRef.current.add(item.productId);
          }
        }
      } catch (error) {
        console.error(`Failed to sync stock for ${item.productId}`, error);
      }
    }
  }, [cartItems, updateQuantity, removeFromCart, toast]);

  useEffect(() => {
    syncCartStock();
  }, [cartItems, syncCartStock]);
}
