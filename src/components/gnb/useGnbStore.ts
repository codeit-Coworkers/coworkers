import { create } from "zustand";

interface GnbState {
  isFolded: boolean;
  toggleFolded: () => void;
  setFolded: (folded: boolean) => void;
  selectedItem: number | "board" | null;
  setSelectedItem: (item: number | "board" | null) => void;
}

export const useGnbStore = create<GnbState>((set) => ({
  isFolded: false,
  toggleFolded: () => set((state) => ({ isFolded: !state.isFolded })),
  setFolded: (folded) => set({ isFolded: folded }),

  // 임시 상태 관리 훅
  selectedItem: null,
  setSelectedItem: (item) => set({ selectedItem: item }),
}));
