import { createClient } from "../utils/supabase/client";
import { GalleryImage } from "../types/gallery.type";

const supabase = createClient();

export const GalleryService = {
  async findAll(): Promise<GalleryImage[]> {
    const { data, error } = await supabase
      .from("PhotoGallery")
      .select("*")
      .order("created_at", { ascending: false });
      
    if (error) throw error;
    return data as GalleryImage[];
  },

  async upload(file: File): Promise<GalleryImage> {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random()}.${fileExt}`;
    
    const { error: storageError } = await supabase.storage
      .from("Gallery_images")
      .upload(fileName, file);

    if (storageError) throw storageError;

    const { data: publicUrlData } = supabase.storage
      .from("Gallery_images")
      .getPublicUrl(fileName);

    const imageUrl = publicUrlData.publicUrl;

    const { data, error } = await supabase
      .from("PhotoGallery")
      .insert([{ image_url: imageUrl }])
      .select()
      .single();

    if (error) throw error;
    return data as GalleryImage;
  },

  async remove(id: number, url: string): Promise<void> {
    const parts = url.split("/");
    const fileName = parts[parts.length - 1];

    if (fileName) {
      const { error: storageError } = await supabase.storage
        .from("Gallery_images")
        .remove([fileName]);
      if (storageError) {
        console.error("Failed to delete image from storage:", storageError);
      }
    }

    const { error } = await supabase.from("PhotoGallery").delete().eq("id", id);
    if (error) throw error;
  },
};
