import { createClient as createPublicClient } from "@/utils/supabase/client";
import { Project } from "@/types/project.type";

export interface ExperienceItem {
  id?: string;
  type: string;
  date: string;
  role: string;
  company: string;
  description: string;
  position?: number;
  created_at?: string;
}

export async function getProjects(): Promise<Project[]> {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase.from("Project").select("*");
    if (error) {
      console.error("Error fetching projects server-side:", error.message);
      return [];
    }
    return (data as Project[]) || [];
  } catch (err) {
    console.error("Server fetch projects failed:", err);
    return [];
  }
}

export async function getExperiences(): Promise<ExperienceItem[]> {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("WorkExperience")
      .select("*")
      .order("position", { ascending: true, nullsFirst: false })
      .order("created_at", { ascending: true });
    if (error) {
      console.error("Error fetching experiences server-side:", error.message);
      return [];
    }
    return (data as ExperienceItem[]) || [];
  } catch (err) {
    console.error("Server fetch experiences failed:", err);
    return [];
  }
}

export async function getAboutMe(): Promise<any | null> {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase.from("AboutMe").select("*").single();
    if (error) {
      console.error("Error fetching about me server-side:", error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.error("Server fetch about me failed:", err);
    return null;
  }
}

export async function getSliderImages(): Promise<string[]> {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("SliderImage")
      .select("image_url")
      .order("position", { ascending: true, nullsFirst: false })
      .order("created_at", { ascending: false });
    if (error) {
      console.error("Error fetching slider images server-side:", error.message);
      return [];
    }
    return (data || []).map((item: any) => item.image_url);
  } catch (err) {
    console.error("Server fetch slider images failed:", err);
    return [];
  }
}
