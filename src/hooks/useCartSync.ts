import { useEffect, useRef } from 'react';
import { useCartStore } from '../store/useCartStore';
import { useStoreConfiguration } from '../context/StoreConfigurationContext';
import { mockSaveCartToCloud, mockLoadCartFromCloud } from '../mock-data/useMockProductsApi';

export function useCartSync() {
  const { cartItems, clearCart } = useCartStore();
  const { isLoggedIn } = useStoreConfiguration();
  const prevLoggedIn = useRef(isLoggedIn);

  // Sync cart to cloud when logged in and cart changes
  useEffect(() => {
    if (isLoggedIn) {
      mockSaveCartToCloud(cartItems);
    }
  }, [isLoggedIn, cartItems]);

  // On login, merge local and cloud cart
  useEffect(() => {
    if (!prevLoggedIn.current && isLoggedIn) {
      (async () => {
        const localCart = cartItems;
        const cloudCart = await mockLoadCartFromCloud();
        const merged = cloudCart.length ? cloudCart : localCart;
        clearCart();
        useCartStore.setState({ cartItems: merged });
        await mockSaveCartToCloud(merged);
      })();
    }
    prevLoggedIn.current = isLoggedIn;
  }, [isLoggedIn]);

  // On logout, clear local cart
  useEffect(() => {
    if (prevLoggedIn.current && !isLoggedIn) {
      clearCart();
    }
    prevLoggedIn.current = isLoggedIn;
  }, [isLoggedIn]);
}
