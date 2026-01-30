import { create } from "zustand";

interface useSelectedLinkProps {
  selectedItem: number | "board" | null;
  setSelectedItem: (item: number | "board" | null) => void;
}

export const useSelectedLink = create<useSelectedLinkProps>((set) => ({
  selectedItem: null,
  setSelectedItem: (item) => set({ selectedItem: item }),
}));
