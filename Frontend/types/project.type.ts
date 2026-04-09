export interface Project {
  id: number;
  title: string;
  background_story: string;
  role: string;
  skills: string[];
  problem: string;
  strategy: string;
  takeaway: string;
  images: string[];
  delivery_date: string;
}

export interface CreateProjectDto extends Omit<Project, "id"> {}

export interface UpdateProjectDto extends Partial<CreateProjectDto> {}
