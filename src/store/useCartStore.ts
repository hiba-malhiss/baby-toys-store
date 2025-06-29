import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Product } from '../types/product.types.ts';
import {
  getTotalCartItems,
  addOrUpdateCartItem,
  updateCartItemQuantity,
} from '../util/order.utils.ts';

interface CartState {
  cartItems: CartItem[];
  isShippingCartDrawerOpen: boolean;
  addToCart: (product: Product | Product[], quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  getTotalItemsInCart: () => number;
  clearCart: () => void;
  setCartItems: (items: CartItem[]) => void;
  openShippingCartDrawer: () => void;
  closeShippingCartDrawer: () => void;
  hasProduct: (productId: string) => boolean;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cartItems: [],
      isShippingCartDrawerOpen: false,

      addToCart: (productOrProducts, quantity = 1) => {
        if (quantity <= 0) return;

        const { cartItems } = get();
        let updatedItems = cartItems;

        if (Array.isArray(productOrProducts)) {
          updatedItems = productOrProducts.reduce(
            (acc, product) => addOrUpdateCartItem(acc, product, quantity),
            cartItems
          );
        } else {
          updatedItems = addOrUpdateCartItem(cartItems, productOrProducts, quantity);
        }

        set({
          cartItems: updatedItems,
          isShippingCartDrawerOpen: true,
        });
      },

      removeFromCart: (productId) => {
        const { cartItems } = get();
        const updatedItems = cartItems.filter((item) => item.productId !== productId);
        set({ cartItems: updatedItems });
      },

      updateQuantity: (productId, quantity) => {
        const { cartItems } = get();
        let updatedItems;

        if (quantity <= 0) {
          updatedItems = cartItems.filter((item) => item.productId !== productId);
        } else {
          updatedItems = updateCartItemQuantity(cartItems, productId, quantity);
        }

        set({ cartItems: updatedItems });
      },

      setCartItems: (items) => {
        set({ cartItems: items });
      },

      clearCart: () => {
        set({ cartItems: [] });
      },

      getTotalItemsInCart: () => {
        return getTotalCartItems(get().cartItems);
      },

      openShippingCartDrawer: () => set({ isShippingCartDrawerOpen: true }),
      closeShippingCartDrawer: () => set({ isShippingCartDrawerOpen: false }),

      hasProduct: (productId) => {
        return get().cartItems.some((item) => item.productId === productId);
      },
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ cartItems: state.cartItems }),
    }
  )
);
