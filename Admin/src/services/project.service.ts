import api from "../api/api";
import {
  Project,
  CreateProjectDto,
  UpdateProjectDto,
} from "../types/project.type";
import { useProjectStore } from "../store/projectStore";

export const ProjectService = {
  async findAll(): Promise<Project[]> {
    const { data } = await api.get("/projects");
    useProjectStore.getState().setProjects(data);
    return data;
  },

  async findOne(id: number): Promise<Project> {
    const { data } = await api.get(`/projects/${id}`);
    return data;
  },

  async create(dto: CreateProjectDto): Promise<Project> {
    const { data } = await api.post("/projects", dto);
    useProjectStore.getState().addProject(data);
    return data;
  },

  async update(id: number, dto: UpdateProjectDto): Promise<Project> {
    const { data } = await api.patch(`/projects/${id}`, dto);
    useProjectStore.getState().updateProject(data);
    return data;
  },

  async remove(id: number): Promise<void> {
    await api.delete(`/projects/${id}`);
    useProjectStore.getState().deleteProject(id);
  },
};
