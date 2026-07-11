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
