import { useEffect, useMemo, useRef } from 'react';
import { useCartStore } from '../store/useCartStore';
import { useAuth } from '../context/AuthContext';
import { mockSaveCartToCloud, mockLoadCartFromCloud } from '../mock-data/useMockProductsApi';

// 📌 useCartSync handles syncing cart data with the cloud (save/load/merge) based on login state.
// ✅ Use this hook **once globally** (e.g., in App.tsx) to ensure cart state is preserved across sessions.
// 🚫 Do NOT use it inside individual pages/components like Cart or Checkout to avoid repeated syncs or overwrites.
export function useCartSync() {
  const { cartItems, clearCart, setCartItems } = useCartStore();
  const { isLoggedIn } = useAuth();
  const prevLoggedIn = useRef(isLoggedIn);

  // Normalize cart for saving
  const cartItemsBE = useMemo(() => {
    return cartItems.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
    }));
  }, [cartItems]);

  useEffect(() => {
    if (isLoggedIn) {
      (async () => {
        try {
          await mockSaveCartToCloud(cartItemsBE);
        } catch (e) {
          console.error('Failed saving cart to cloud', e);
        }
      })();
    }
  }, [cartItemsBE, isLoggedIn]);

  // Merge cloud and local carts on login
  useEffect(() => {
    if (!prevLoggedIn.current && isLoggedIn) {
      (async () => {
        try {
          const cloudCart = await mockLoadCartFromCloud();

          // Create a map for merging
          const localMap = new Map(cartItemsBE.map((item) => [item.productId, item.quantity]));
          for (const cloudItem of cloudCart) {
            if (localMap.has(cloudItem.productId)) {
              // Merge quantities
              const localQty = localMap.get(cloudItem.productId) || 0;
              localMap.set(cloudItem.productId, localQty + cloudItem.quantity);
            } else {
              localMap.set(cloudItem.productId, cloudItem.quantity);
            }
          }

          const mergedCart = Array.from(localMap.entries()).map(([productId, quantity]) => ({
            productId,
            quantity,
          }));

          setCartItems(mergedCart);
          await mockSaveCartToCloud(mergedCart);
        } catch (e) {
          console.error('Failed merging cart on login', e);
        }
      })();
    }

    prevLoggedIn.current = isLoggedIn;
  }, [isLoggedIn, cartItemsBE, setCartItems]);

  // 🔄 Clear local cart on logout
  useEffect(() => {
    if (prevLoggedIn.current && !isLoggedIn) {
      clearCart();
    }

    prevLoggedIn.current = isLoggedIn;
  }, [isLoggedIn]);
}
