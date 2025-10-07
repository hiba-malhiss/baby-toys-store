import { create } from 'zustand';

type WishlistIdsState = {
  ids: Set<number>;
  setAll: (ids: number[]) => void;
  add: (id: number) => void;
  remove: (id: number) => void;
  has: (id: number | undefined | null) => boolean;
  clear: () => void;
};

export const useWishlistIdsStore = create<WishlistIdsState>((set, get) => ({
  ids: new Set<number>(),
  setAll: (ids) => set(() => ({ ids: new Set(ids) })),
  add: (id) => set((s) => ({ ids: new Set([...s.ids, id]) })),
  remove: (id) => set((s) => { const n = new Set(s.ids); n.delete(id); return { ids: n }; }),
  has: (id) => (id == null ? false : get().ids.has(Number(id))),
  clear: () => set(() => ({ ids: new Set<number>() })),
}));


