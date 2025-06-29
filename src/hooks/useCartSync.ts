import { useEffect, useRef } from 'react';
import { useCartStore } from '../store/useCartStore';
import { useAuth } from '../context/AuthContext';
import { mockSaveCartToCloud, mockLoadCartFromCloud } from '../mock-data/useMockProductsApi';

export function useCartSync() {
  const { cartItems, clearCart, setCartItems } = useCartStore();
  const { isLoggedIn } = useAuth();
  const prevLoggedIn = useRef(isLoggedIn);

  // On cart or login state change, save to cloud if logged in
  useEffect(() => {
    if (isLoggedIn) {
      (async () => {
        try {
          await mockSaveCartToCloud(cartItems);
        } catch (e) {
          console.error('Failed saving cart to cloud', e);
        }
      })();
    }
  }, [cartItems, isLoggedIn]);

  // On login, load cloud cart and merge with local
  useEffect(() => {
    if (!prevLoggedIn.current && isLoggedIn) {
      (async () => {
        try {
          const cloudCart = await mockLoadCartFromCloud();
          const mergedCart = cloudCart.length ? cloudCart : cartItems;
          setCartItems(mergedCart);
          await mockSaveCartToCloud(mergedCart);
        } catch (e) {
          console.error('Failed loading or merging cart on login', e);
        }
      })();
    }
    prevLoggedIn.current = isLoggedIn;
  }, [isLoggedIn, cartItems, setCartItems]);

  // On logout, clear local cart (and no cloud sync needed)
  useEffect(() => {
    if (prevLoggedIn.current && !isLoggedIn) {
      clearCart();
    }
    prevLoggedIn.current = isLoggedIn;
  }, [isLoggedIn]);
}
