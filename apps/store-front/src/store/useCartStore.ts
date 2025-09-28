import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartState {
  isShippingCartDrawerOpen: boolean;
  openShippingCartDrawer: () => void;
  closeShippingCartDrawer: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      isShippingCartDrawerOpen: false,
      openShippingCartDrawer: () => set({ isShippingCartDrawerOpen: true }),
      closeShippingCartDrawer: () => set({ isShippingCartDrawerOpen: false }),
    }),
    {
      name: 'cart-ui-store',
      partialize: (state) => ({ isShippingCartDrawerOpen: state.isShippingCartDrawerOpen }),
    }
  )
);
