import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Project } from "../types/project.type";
import { projectService } from "../services/project.service";

interface ProjectState {
  projects: Project[];
  selectedProject: Project | null;
  isLoading: boolean;
  error: string | null;

  setProjects: (projects: Project[]) => void;
  setSelectedProject: (project: Project | null) => void;

  fetchProjectBySlug: (slug: string) => Promise<Project | undefined>;

  clearSelectedProject: () => void;
}

export const useProjectStore = create<ProjectState>()(
  persist(
    (set) => ({
      projects: [],
      selectedProject: null,
      isLoading: false,
      error: null,

      setProjects: (projects) => set({ projects }),
      setSelectedProject: (project) => set({ selectedProject: project }),

      fetchProjectBySlug: async (slug: string) => {
        set({ isLoading: true, error: null });
        try {
          const project = await projectService.getProjectBySlug(slug);
          set({ selectedProject: project, isLoading: false });
          return project;
        } catch (error: any) {
          set({
            error: error.message || "Failed to fetch project",
            isLoading: false,
          });
        }
      },

      clearSelectedProject: () => set({ selectedProject: null }),
    }),
    {
      name: "project-storage",
      partialize: (state) => ({
        projects: state.projects,
        selectedProject: state.selectedProject,
      }),
    },
  ),
);
