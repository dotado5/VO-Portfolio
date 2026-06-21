import { create } from "zustand";

interface ExperienceState {
  experiences: any[];
  isLoading: boolean;
  error: string | null;
  setExperiences: (data: any[]) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useExperienceStore = create<ExperienceState>((set) => ({
  experiences: [],
  isLoading: false,
  error: null,
  setExperiences: (data) => set({ experiences: data }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
