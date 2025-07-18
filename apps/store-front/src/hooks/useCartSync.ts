import { useEffect, useMemo, useRef } from 'react';
import { useCartStore } from '../store/useCartStore';
import { useAuth } from '../context/AuthContext';
import { mockSaveCartToCloud, mockLoadCartFromCloud } from '@mock-data/useMockApi';

// 📌 useCartSync handles syncing cart data with the cloud (save/load/merge) based on login state.
// ✅ Use this hook **once globally** (e.g., in App.tsx) to ensure cart state is preserved across sessions.
// 🚫 Do NOT use it inside individual pages/components like Cart or Checkout to avoid repeated syncs or overwrites.
export function useCartSync() {
  const { cartItems, clearCart, setCartItems, setIsSyncing } = useCartStore();
  const { isLoggedIn } = useAuth();
  const prevLoggedIn = useRef(isLoggedIn);

  // Map local items by productId
  const localCartMap = useMemo(() => {
    const map = new Map();
    cartItems.forEach((item) => {
      map.set(item.productId, item);
    });
    return map;
  }, [cartItems]);

  // Sync to cloud when cart changes
  useEffect(() => {
    if (isLoggedIn) {
      (async () => {
        try {
          setIsSyncing(true);
          await mockSaveCartToCloud(
            cartItems.map((item) => ({ productId: item.productId, quantity: item.quantity }))
          );
        } catch (e) {
          console.error('Failed saving cart to cloud', e);
        } finally {
          setIsSyncing(false);
        }
      })();
    }
  }, [cartItems, isLoggedIn]);

  // Merge on login: use local item if it exists
  useEffect(() => {
    if (!prevLoggedIn.current && isLoggedIn) {
      (async () => {
        try {
          setIsSyncing(true);
          const cloudCart = await mockLoadCartFromCloud();

          const mergedMap = new Map();

          // Add cloud items first
          for (const cloudItem of cloudCart) {
            mergedMap.set(cloudItem.productId, cloudItem);
          }

          // Override with local items (keep local quantity + full local object)
          for (const [productId, localItem] of localCartMap.entries()) {
            mergedMap.set(productId, localItem);
          }

          const mergedCart = Array.from(mergedMap.values());

          setCartItems(mergedCart);
          await mockSaveCartToCloud(mergedCart);
        } catch (e) {
          console.error('Failed merging cart on login', e);
        } finally {
          setIsSyncing(false);
        }
      })();
    }

    prevLoggedIn.current = isLoggedIn;
  }, [isLoggedIn, localCartMap, setCartItems]);

  // Clear cart on logout
  useEffect(() => {
    if (prevLoggedIn.current && !isLoggedIn) {
      clearCart();
    }

    prevLoggedIn.current = isLoggedIn;
  }, [isLoggedIn]);
}
