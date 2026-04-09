import api from "../api/axios-instance";
import {
  Project,
  CreateProjectDto,
  UpdateProjectDto,
} from "../types/project.type";

export const projectService = {
  async getAllProjects(): Promise<Project[]> {
    const response = await api.get<Project[]>("/projects");
    return response.data;
  },

  async getProjectById(id: number): Promise<Project> {
    const response = await api.get<Project>(`/projects/${id}`);
    return response.data;
  },

  async createProject(data: CreateProjectDto): Promise<Project> {
    const response = await api.post<Project>("/projects", data);
    return response.data;
  },

  async updateProject(id: number, data: UpdateProjectDto): Promise<Project> {
    const response = await api.patch<Project>(`/projects/${id}`, data);
    return response.data;
  },

  async deleteProject(id: number): Promise<void> {
    await api.delete(`/projects/${id}`);
  },
};
