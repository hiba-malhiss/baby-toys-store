import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FavoritesState {
  favoriteIds: string[];
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  clearFavorite: () => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favoriteIds: [],
      toggleFavorite: (id) => {
        const { favoriteIds } = get();
        const updated = favoriteIds.includes(id)
          ? favoriteIds.filter((favId) => favId !== id)
          : [...favoriteIds, id];
        set({ favoriteIds: updated });
      },
      isFavorite: (id) => get().favoriteIds.includes(id),
      clearFavorite: () => set({ favoriteIds: [] }),
    }),
    {
      name: 'favorites-storage',
      partialize: (state) => ({ favoriteIds: state.favoriteIds }),
    }
  )
);
