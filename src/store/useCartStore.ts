import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Product } from '../types/product.types.ts';
import { getProductItem } from '../util/order.utils.ts';

interface CartState {
  items: CartItem[];
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
      items: [],
      isShippingCartDrawerOpen: false,
      addToCart: (product, quantity = 1) => {
        // overwrite it if it's already added
        const { items } = get();
        const filteredItems = items.filter((item) => item.productId !== product.id);

        set({
          items: [...filteredItems, getProductItem(product, quantity)],
          isShippingCartDrawerOpen: true,
        });
      },
      removeFromCart: (productId) =>
        set({ items: get().items.filter((item) => item.productId !== productId) }),
      updateQuantity: (productId, quantity) =>
        set({
          items:
            quantity <= 0
              ? get().items.filter((item) => item.productId !== productId)
              : get().items.map((item) =>
                  item.productId === productId ? { ...item, quantity } : item
                ),
        }),
      openShippingCartDrawer: () => set({ isShippingCartDrawerOpen: true }),
      closeShippingCartDrawer: () => set({ isShippingCartDrawerOpen: false }),
      getTotalItemsInCart: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ items: state.items }),
    }
  )
);
