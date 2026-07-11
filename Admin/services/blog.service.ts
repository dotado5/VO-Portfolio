import { createClient } from "../utils/supabase/client";
import { Blog, CreateBlogDto, UpdateBlogDto } from "../types/blog.type";
import { useBlogStore } from "../store/blogStore";

const supabase = createClient();

const BUCKET = "Blog_images";

export const BlogService = {
  async findAll(): Promise<Blog[]> {
    const { data, error } = await supabase
      .from("Blog")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    useBlogStore.getState().setBlogs(data as Blog[]);
    return data as Blog[];
  },

  async findOne(id: number): Promise<Blog> {
    const { data, error } = await supabase
      .from("Blog")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    return data as Blog;
  },

  async create(dto: CreateBlogDto): Promise<Blog> {
    const { data, error } = await supabase
      .from("Blog")
      .insert([dto])
      .select()
      .single();
    if (error) throw error;
    useBlogStore.getState().addBlog(data as Blog);
    return data as Blog;
  },

  async update(id: number, dto: UpdateBlogDto): Promise<Blog> {
    const { data, error } = await supabase
      .from("Blog")
      .update(dto)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    useBlogStore.getState().updateBlog(data as Blog);
    return data as Blog;
  },

  async remove(id: number): Promise<void> {
    const blog = await this.findOne(id);

    if (blog?.cover_image) {
      const fileName = blog.cover_image.split("/").pop();
      if (fileName) {
        const { error: storageError } = await supabase.storage
          .from(BUCKET)
          .remove([fileName]);
        if (storageError) {
          console.error("Failed to delete cover image from storage:", storageError);
        }
      }
    }

    const { error } = await supabase.from("Blog").delete().eq("id", id);
    if (error) throw error;
    useBlogStore.getState().deleteBlog(id);
  },

  async uploadImage(file: File): Promise<string> {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random()}.${fileExt}`;

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(fileName, file);
    if (error) throw error;

    const { data: publicUrlData } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(fileName);

    return publicUrlData.publicUrl;
  },
};
