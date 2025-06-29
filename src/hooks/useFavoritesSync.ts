import { useEffect, useRef } from 'react';
import { useFavoritesStore } from '../store/useFavoritesStore';
import { useAuth } from '../context/AuthContext';
import {
  mockSaveFavoritesToCloud,
  mockLoadFavoritesFromCloud,
} from '../mock-data/useMockProductsApi';

export function useFavoritesSync() {
  const { favoriteIds, clearFavorite, setFavorites } = useFavoritesStore();
  const { isLoggedIn } = useAuth();
  const prevLoggedIn = useRef(isLoggedIn);

  // Sync favorites to cloud when logged in and favorites change
  useEffect(() => {
    if (!isLoggedIn) return;

    (async () => {
      try {
        await mockSaveFavoritesToCloud(favoriteIds);
      } catch (error) {
        console.error('Failed to save favorites to cloud:', error);
      }
    })();
  }, [isLoggedIn, favoriteIds]);

  // On login, merge local and cloud favorites
  useEffect(() => {
    if (!prevLoggedIn.current && isLoggedIn) {
      (async () => {
        try {
          const localFavs = favoriteIds;
          const cloudFavs = await mockLoadFavoritesFromCloud();
          const merged = cloudFavs.length ? cloudFavs : localFavs;
          setFavorites(merged);
          await mockSaveFavoritesToCloud(merged);
        } catch (error) {
          console.error('Failed to merge/load favorites on login:', error);
        }
      })();
    }
    prevLoggedIn.current = isLoggedIn;
  }, [isLoggedIn, favoriteIds]);

  // On logout, clear local favorites
  useEffect(() => {
    if (prevLoggedIn.current && !isLoggedIn) {
      clearFavorite();
    }
    prevLoggedIn.current = isLoggedIn;
  }, [isLoggedIn]);
}
