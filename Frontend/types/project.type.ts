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
  outcome?: string;
  takeaway: string;
  images: string[];
  slider_images: string[];
  delivery_date: string;
  live_site_url?: string;
}

export interface CreateProjectDto extends Omit<Project, "id"> {}

export interface UpdateProjectDto extends Partial<CreateProjectDto> {}
