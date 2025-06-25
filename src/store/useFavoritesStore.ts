import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FavoritesState {
  favoriteIds: string[];
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favoriteIds: [],
      toggleFavorite: (id) =>
        set({
          favoriteIds: get().favoriteIds.includes(id)
            ? get().favoriteIds.filter((favId) => favId !== id)
            : [...get().favoriteIds, id],
        }),
      isFavorite: (id) => get().favoriteIds.includes(id),
    }),
    {
      name: 'favorites-storage',
    }
  )
);
