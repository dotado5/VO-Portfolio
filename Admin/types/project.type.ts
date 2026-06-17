export interface Project {
  id: number;
  slug: string;
  title: string;
  background_story: string;
  background_story_sub: string;
  role: string;
  skills: string[];
  problem: string;
  strategy: string;
  takeaway: string;
  images: string[];
  slider_images: string[];
  delivery_date: string;
}

export type CreateProjectDto = Omit<Project, "id">;
export type UpdateProjectDto = Partial<CreateProjectDto>;
