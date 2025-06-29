import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Product } from '../types/product.types.ts';
import {
  getTotalCartItems,
  addOrUpdateCartItem,
  removeCartItem,
  updateCartItemQuantity,
} from '../util/order.utils.ts';

interface CartState {
  cartItems: CartItem[];
  isShippingCartDrawerOpen: boolean;
  openShippingCartDrawer: () => void;
  closeShippingCartDrawer: () => void;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  getTotalItemsInCart: () => number;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cartItems: [],
      isShippingCartDrawerOpen: false,

      addToCart: (product, quantity = 1) => {
        const { cartItems } = get();
        const updatedItems = addOrUpdateCartItem(cartItems, product, quantity);

        set({
          cartItems: updatedItems,
          isShippingCartDrawerOpen: true,
        });
      },

      removeFromCart: (productId) => {
        const { cartItems } = get();
        const updatedItems = removeCartItem(cartItems, productId);
        set({ cartItems: updatedItems });
      },

      updateQuantity: (productId, quantity) => {
        const { cartItems } = get();

        if (quantity <= 0) {
          // Remove item if quantity is 0 or negative
          const updatedItems = removeCartItem(cartItems, productId);
          set({ cartItems: updatedItems });
        } else {
          // Update quantity
          const updatedItems = updateCartItemQuantity(cartItems, productId, quantity);
          set({ cartItems: updatedItems });
        }
      },

      openShippingCartDrawer: () => set({ isShippingCartDrawerOpen: true }),
      closeShippingCartDrawer: () => set({ isShippingCartDrawerOpen: false }),

      getTotalItemsInCart: () => {
        const { cartItems } = get();
        return getTotalCartItems(cartItems);
      },

      clearCart: () => set({ cartItems: [] }),
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ cartItems: state.cartItems }),
    }
  )
);
