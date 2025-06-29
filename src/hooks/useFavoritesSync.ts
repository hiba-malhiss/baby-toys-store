import { useEffect, useRef } from 'react';
import { useFavoritesStore } from '../store/useFavoritesStore';
import { useStoreConfiguration } from '../context/StoreConfigurationContext';
import {
  mockSaveFavoritesToCloud,
  mockLoadFavoritesFromCloud,
} from '../mock-data/useMockProductsApi';

export function useFavoritesSync() {
  const { favoriteIds, clearFavorite } = useFavoritesStore();
  const { isLoggedIn } = useStoreConfiguration();
  const prevLoggedIn = useRef(isLoggedIn);

  // Sync favorites to cloud when logged in and favorites change
  useEffect(() => {
    if (isLoggedIn) {
      mockSaveFavoritesToCloud(favoriteIds);
    }
  }, [isLoggedIn, favoriteIds]);

  // On login, merge local and cloud favorites
  useEffect(() => {
    if (!prevLoggedIn.current && isLoggedIn) {
      (async () => {
        const localFavs = favoriteIds;
        const cloudFavs = await mockLoadFavoritesFromCloud();
        const merged = cloudFavs.length ? cloudFavs : localFavs;
        useFavoritesStore.setState({ favoriteIds: merged });
        await mockSaveFavoritesToCloud(merged);
      })();
    }
    prevLoggedIn.current = isLoggedIn;
  }, [isLoggedIn]);

  // On logout, clear locally favorites
  useEffect(() => {
    if (prevLoggedIn.current && !isLoggedIn) {
      clearFavorite();
    }
    prevLoggedIn.current = isLoggedIn;
  }, [isLoggedIn]);
}
