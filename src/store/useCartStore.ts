import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Product } from '../types/product.types.ts';
import { getProductItem } from '../util/order.utils.ts';

interface CartState {
  cartItems: CartItem[];
  isShippingCartDrawerOpen: boolean;
  openShippingCartDrawer: () => void;
  closeShippingCartDrawer: () => void;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  getTotalItemsInCart: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cartItems: [],
      isShippingCartDrawerOpen: false,
      addToCart: (product, quantity = 1) => {
        // overwrite it if it's already added
        const { cartItems } = get();
        const filteredItems = cartItems.filter((item) => item.productId !== product.id);

        set({
          cartItems: [...filteredItems, getProductItem(product, quantity)],
          isShippingCartDrawerOpen: true,
        });
      },
      removeFromCart: (productId) =>
        set({ cartItems: get().cartItems.filter((item) => item.productId !== productId) }),
      updateQuantity: (productId, quantity) =>
        set({
          cartItems:
            quantity <= 0
              ? get().cartItems.filter((item) => item.productId !== productId)
              : get().cartItems.map((item) =>
                  item.productId === productId ? { ...item, quantity } : item
                ),
        }),
      openShippingCartDrawer: () => set({ isShippingCartDrawerOpen: true }),
      closeShippingCartDrawer: () => set({ isShippingCartDrawerOpen: false }),
      getTotalItemsInCart: () => get().cartItems.reduce((sum, item) => sum + item.quantity, 0),
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ cartItems: state.cartItems }),
    }
  )
);
