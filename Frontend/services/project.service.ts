import api from "../api/axios-instance";
import {
  Project,
  CreateProjectDto,
  UpdateProjectDto,
} from "../types/project.type";

export const projectService = {
  async getAllProjects(): Promise<Project[]> {
    const response = await api.get<Project[]>("/api/projects");
    return response.data;
  },

  async getProjectBySlug(slug: string): Promise<Project> {
    const response = await api.get<Project>(`/api/projects/${slug}`);
    return response.data;
  },

  async createProject(data: CreateProjectDto): Promise<Project> {
    const response = await api.post<Project>("/api/projects", data);
    return response.data;
  },

  async updateProject(id: number, data: UpdateProjectDto): Promise<Project> {
    const response = await api.patch<Project>(`/api/projects/${id}`, data);
    return response.data;
  },

  async deleteProject(id: number): Promise<void> {
    await api.delete(`/api/projects/${id}`);
  },
};
