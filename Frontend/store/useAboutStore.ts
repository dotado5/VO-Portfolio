import { create } from "zustand";

interface AboutState {
  aboutMe: any;
  isLoading: boolean;
  error: string | null;
  setAboutMe: (data: any) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useAboutStore = create<AboutState>((set) => ({
  aboutMe: null,
  isLoading: false,
  error: null,
  setAboutMe: (data) => set({ aboutMe: data }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
