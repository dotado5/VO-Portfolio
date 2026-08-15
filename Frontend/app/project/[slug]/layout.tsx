import { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

interface ProjectLayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

async function getProject(slug: string) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from("Project")
    .select("title, background_story")
    .eq("slug", slug)
    .single();

  if (error) {
    if (error.code !== "PGRST116") {
      console.error("Failed to load project metadata:", error.message);
    }
    return null;
  }
  return data;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    return { title: "Project - VO Fatoki" };
  }

  return {
    title: `${project.title} - VO Fatoki`,
    description: project.background_story || undefined,
    alternates: {
      canonical: `/project/${slug}`,
    },
  };
}

export default function ProjectLayout({ children }: ProjectLayoutProps) {
  return <>{children}</>;
}
