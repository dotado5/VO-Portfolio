import { createClient } from "../utils/supabase/client";
import { SliderImage } from "../types/slider.type";

const supabase = createClient();

export const SliderService = {
  async findAll(): Promise<SliderImage[]> {
    const { data, error } = await supabase
      .from("SliderImage")
      .select("*")
      .order("position", { ascending: true, nullsFirst: false })
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as SliderImage[];
  },

  async upload(file: File, position: number): Promise<SliderImage> {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random()}.${fileExt}`;

    // Upload to bucket
    const { error: storageError } = await supabase.storage
      .from("Slider_images")
      .upload(fileName, file);

    if (storageError) throw storageError;

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from("Slider_images")
      .getPublicUrl(fileName);

    const imageUrl = publicUrlData.publicUrl;

    // Insert into database (appended to the end of the current order)
    const { data, error } = await supabase
      .from("SliderImage")
      .insert([{ image_url: imageUrl, position }])
      .select()
      .single();

    if (error) throw error;
    return data as SliderImage;
  },

  // Persist a new ordering: each id's array index becomes its position.
  async updateOrder(orderedIds: number[]): Promise<void> {
    const results = await Promise.all(
      orderedIds.map((id, index) =>
        supabase.from("SliderImage").update({ position: index }).eq("id", id),
      ),
    );
    const failed = results.find((r) => r.error);
    if (failed?.error) throw failed.error;
  },

  async remove(id: number, url: string): Promise<void> {
    // Extract filename from URL
    const parts = url.split("/");
    const fileName = parts[parts.length - 1];

    // Remove from storage
    if (fileName) {
      const { error: storageError } = await supabase.storage
        .from("Slider_images")
        .remove([fileName]);
      if (storageError) {
        console.error("Failed to delete image from storage:", storageError);
      }
    }

    // Remove from database
    const { error } = await supabase.from("SliderImage").delete().eq("id", id);
    if (error) throw error;
  },
};
