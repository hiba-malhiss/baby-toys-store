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
  const cartItemsBE = useMemo(() => {
    return cartItems.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
    }));
  }, [cartItems]);

  // On cart or login state change, save to cloud if logged in
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

  // On login, load cloud cart and merge with local
  useEffect(() => {
    if (!prevLoggedIn.current && isLoggedIn) {
      (async () => {
        try {
          const cloudCart = await mockLoadCartFromCloud();
          const mergedCart = cloudCart.length ? cloudCart : cartItemsBE;
          setCartItems(mergedCart);
          await mockSaveCartToCloud(mergedCart);
        } catch (e) {
          console.error('Failed loading or merging cart on login', e);
        }
      })();
    }
    prevLoggedIn.current = isLoggedIn;
  }, [isLoggedIn, cartItemsBE, setCartItems]);

  // On logout, clear local cart (and no cloud sync needed)
  useEffect(() => {
    if (prevLoggedIn.current && !isLoggedIn) {
      clearCart();
    }
    prevLoggedIn.current = isLoggedIn;
  }, [isLoggedIn]);
}
