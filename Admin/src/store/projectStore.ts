import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Project } from "../types/project.type";

interface ProjectState {
  projects: Project[];
  setProjects: (projects: Project[]) => void;
  addProject: (project: Project) => void;
  updateProject: (project: Project) => void;
  deleteProject: (id: number) => void;
  clearProjects: () => void;
}

export const useProjectStore = create<ProjectState>()(
  persist(
    (set) => ({
      projects: [],

      setProjects: (projects) => set({ projects }),

      addProject: (project) => {
        set((state) => ({ projects: [...state.projects, project] }));
      },

      updateProject: (project) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === project.id ? project : p,
          ),
        }));
      },

      deleteProject: (id) => {
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
        }));
      },

      clearProjects: () => {
        set({ projects: [] });
      },
    }),
    {
      name: "project-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
