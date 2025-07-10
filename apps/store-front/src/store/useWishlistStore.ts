import { create } from 'zustand';
import type { Product } from '../types/product.types.ts';

interface WishlistState {
  wishlist: Product[];
  isLoading: boolean;
  isLoaded: boolean;
  setWishlist: (wishlist: Product[]) => void;
  addProductToWishlist: (product: Product) => void;
  removeProductFromWishlist: (product: Product) => void;
  setLoading: (isLoading: boolean) => void;
  setLoaded: (isLoaded: boolean) => void;
}

export const useWishlistStore = create<WishlistState>((set) => ({
  wishlist: [],
  isLoading: false,
  isLoaded: false,

  setWishlist: (wishlist) => set({ wishlist, isLoaded: true, isLoading: false }),

  addProductToWishlist: (product) =>
    set((state) => {
      const exists = state.wishlist.some((p) => p.id === product.id);
      if (exists) return state;
      return { wishlist: [...state.wishlist, product] };
    }),

  removeProductFromWishlist: (product) =>
    set((state) => ({
      wishlist: state.wishlist.filter((p) => p.id !== product.id),
    })),

  setLoading: (isLoading) => set({ isLoading }),

  setLoaded: (isLoaded) => set({ isLoaded }),
}));
