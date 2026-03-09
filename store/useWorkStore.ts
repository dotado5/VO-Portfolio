import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Work {
  title: string;
  description: string;
  date: string;
  link: string;
  imageSrc?: string;
}

interface WorkState {
  selectedWork: Work | null;
  setSelectedWork: (work: Work) => void;
  clearSelectedWork: () => void;
}

export const useWorkStore = create<WorkState>()(
  persist(
    (set) => ({
      selectedWork: null,
      setSelectedWork: (work) => set({ selectedWork: work }),
      clearSelectedWork: () => set({ selectedWork: null }),
    }),
    {
      name: "selected-work-storage",
    },
  ),
);
