import { useEffect, useState, useCallback } from 'react';
import {
  mockAddToWishlist,
  mockRemoveFromWishlist,
  mockLoadFavoritesFromCloud,
} from '../mock-data/useMockProductsApi';
import { useAuth } from '../context/AuthContext';
import { useLoginDialogStore } from '../store/useLoginDialogStore';

export function useFavorite(productId: string, onChange?: () => void) {
  const { isLoggedIn } = useAuth();
  const { open: openLoginDialog } = useLoginDialogStore();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch favorite status on mount or login change
  useEffect(() => {
    if (!isLoggedIn) {
      setIsFavorite(false);
      return;
    }
    let mounted = true;
    mockLoadFavoritesFromCloud().then((favs) => {
      if (mounted) setIsFavorite(favs.includes(productId));
    });
    return () => {
      mounted = false;
    };
  }, [isLoggedIn, productId]);

  // Toggle favorite status
  const toggleFavorite = useCallback(async () => {
    if (isLoading) return;
    if (!isLoggedIn) {
      openLoginDialog();
      return;
    }
    setIsLoading(true);
    try {
      if (isFavorite) {
        await mockRemoveFromWishlist(productId);
        setIsFavorite(false);
      } else {
        await mockAddToWishlist(productId);
        setIsFavorite(true);
      }
      if (onChange) onChange();
    } finally {
      setIsLoading(false);
    }
  }, [isLoggedIn, productId, isLoading, onChange, openLoginDialog]);

  return { isFavorite, isLoading, toggleFavorite };
}
