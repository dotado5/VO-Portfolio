export type BlogStatus = "draft" | "published";

export interface Blog {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string; // rich-text HTML
  cover_image: string;
  tags: string[];
  status: BlogStatus;
  read_time: number;
  created_at?: string;
  updated_at?: string;
  published_at?: string | null;
}

export type CreateBlogDto = Omit<
  Blog,
  "id" | "created_at" | "updated_at"
>;
export type UpdateBlogDto = Partial<CreateBlogDto>;
