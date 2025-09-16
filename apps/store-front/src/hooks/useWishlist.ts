import { useEffect, useCallback } from 'react';
import { useWishlistStore } from '../store/useWishlistStore';
import { useAuth } from '../context/AuthContext';
import { useLoginDialogStore } from '../store/useLoginDialogStore';
import {
  mockAddToWishlist,
  mockRemoveFromWishlist,
  mockLoadFavoritesFromCloud,
} from '@mock-data/useMockApi';
import type { Product } from '../types/product.types.ts';

export function useWishlist(product: Product) {
  const { isAuthenticated } = useAuth();
  const { open: openLoginDialog } = useLoginDialogStore();
  const {
    wishlist,
    isLoading,
    isLoaded,
    setWishlist,
    addProductToWishlist,
    removeProductFromWishlist,
    setLoading,
  } = useWishlistStore();

  const fetchWishlist = useCallback(async () => {
    if (!isAuthenticated || isLoaded) return;
    setLoading(true);
    try {
      const cloudWishlist = await mockLoadFavoritesFromCloud();
      setWishlist(cloudWishlist);
    } catch (error) {
      console.error('Failed to fetch wishlist', error);
      setLoading(false);
    }
  }, [isAuthenticated, isLoaded, setLoading, setWishlist]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const isFavorite = wishlist.some((p) => p.id === product.id); // ✅ fix

  const toggleFavorite = async () => {
    if (!isAuthenticated) {
      openLoginDialog();
      return;
    }

    setLoading(true);
    try {
      if (isFavorite) {
        await mockRemoveFromWishlist(product.id);
        removeProductFromWishlist(product);
      } else {
        await mockAddToWishlist(product.id);
        addProductToWishlist(product);
      }
    } catch (error) {
      console.error('Failed to update wishlist', error);
    } finally {
      setLoading(false);
    }
  };

  return { isFavorite, isLoading, toggleFavorite };
}
