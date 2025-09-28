import { create } from 'zustand';

interface CartState {
  isShippingCartDrawerOpen: boolean;
  openShippingCartDrawer: () => void;
  closeShippingCartDrawer: () => void;
}

export const useCartStore = create<CartState>()((set) => ({
  isShippingCartDrawerOpen: false,
  openShippingCartDrawer: () => set({ isShippingCartDrawerOpen: true }),
  closeShippingCartDrawer: () => set({ isShippingCartDrawerOpen: false }),
}));
