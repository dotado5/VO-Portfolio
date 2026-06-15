import { createClient } from "../utils/supabase/client";

const supabase = createClient();
import {
  Project,
  CreateProjectDto,
  UpdateProjectDto,
} from "../types/project.type";
import { useProjectStore } from "../store/projectStore";

export const ProjectService = {
  async findAll(): Promise<Project[]> {
    const { data, error } = await supabase.from("Project").select("*");
    if (error) throw error;
    useProjectStore.getState().setProjects(data as Project[]);
    return data as Project[];
  },

  async findOne(id: number): Promise<Project> {
    const { data, error } = await supabase
      .from("Project")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    return data as Project;
  },

  async create(dto: CreateProjectDto): Promise<Project> {
    const { data, error } = await supabase
      .from("Project")
      .insert([dto])
      .select()
      .single();
    if (error) throw error;
    useProjectStore.getState().addProject(data as Project);
    return data as Project;
  },

  async update(id: number, dto: UpdateProjectDto): Promise<Project> {
    const { data, error } = await supabase
      .from("Project")
      .update(dto)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    useProjectStore.getState().updateProject(data as Project);
    return data as Project;
  },

  async remove(id: number): Promise<void> {
    // Fetch project to get image URLs
    const project = await this.findOne(id);
    
    if (project && project.images && project.images.length > 0) {
      const fileNames = project.images.map((url) => {
        const parts = url.split("/");
        return parts[parts.length - 1];
      });

      const { error: storageError } = await supabase.storage
        .from("Project_images")
        .remove(fileNames);

      if (storageError) {
        console.error("Failed to delete images from storage:", storageError);
      }
    }

    const { error } = await supabase.from("Project").delete().eq("id", id);
    if (error) throw error;
    useProjectStore.getState().deleteProject(id);
  },
};
