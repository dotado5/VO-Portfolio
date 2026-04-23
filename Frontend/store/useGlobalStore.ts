import { create } from "zustand";

interface GlobalState {
  isPreloaderVisible: boolean;
  setIsPreloaderVisible: (value: boolean) => void;
}

export const useGlobalStore = create<GlobalState>((set) => ({
  isPreloaderVisible: true,
  setIsPreloaderVisible: (value: boolean) => set({ isPreloaderVisible: value }),
}));
