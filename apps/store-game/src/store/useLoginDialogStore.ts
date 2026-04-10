import { create } from 'zustand';

interface LoginDialogStore {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

export const useLoginDialogStore = create<LoginDialogStore>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));
