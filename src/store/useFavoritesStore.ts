import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FavoritesState {
  favoriteIds: string[];
  toggleFavorite: (id: string) => void;
  setFavorites: (ids: string[]) => void;
  isFavorite: (id: string) => boolean;
  clearFavorite: () => void;
  addFavorite: (id: string) => void;
  removeFavorite: (id: string) => void;
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

      addFavorite: (id) => {
        const { favoriteIds } = get();
        if (!favoriteIds.includes(id)) {
          set({ favoriteIds: [...favoriteIds, id] });
        }
      },

      removeFavorite: (id) => {
        const { favoriteIds } = get();
        set({ favoriteIds: favoriteIds.filter((favId) => favId !== id) });
      },

      isFavorite: (id) => get().favoriteIds.includes(id),

      setFavorites: (ids) => {
        const uniqueIds = Array.from(new Set(ids));
        set({ favoriteIds: uniqueIds });
      },

      clearFavorite: () => set({ favoriteIds: [] }),
    }),
    {
      name: 'favorites-storage',
      partialize: (state) => ({ favoriteIds: state.favoriteIds }),
    }
  )
);
