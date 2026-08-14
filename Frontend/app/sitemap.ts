import { MetadataRoute } from "next";
import { createBrowserClient } from "@supabase/ssr";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.vofatoki.work";

  const routes: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1.0,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/resume`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/journals`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (supabaseUrl && supabaseKey) {
    const supabase = createBrowserClient(supabaseUrl, supabaseKey);

    // Fetch published blogs from Supabase
    const { data: blogs, error: blogsError } = await supabase
      .from("Blog")
      .select("slug, published_at")
      .eq("status", "published");

    if (!blogsError && blogs) {
      blogs.forEach((blog) => {
        routes.push({
          url: `${siteUrl}/journals/${blog.slug}`,
          lastModified: blog.published_at ? new Date(blog.published_at) : new Date(),
          changeFrequency: "weekly",
          priority: 0.7,
        });
      });
    }

    // Fetch projects from Supabase
    const { data: projects, error: projectsError } = await supabase
      .from("Project")
      .select("slug, delivery_date");

    if (!projectsError && projects) {
      projects.forEach((project) => {
        routes.push({
          url: `${siteUrl}/project/${project.slug}`,
          lastModified: project.delivery_date ? new Date(project.delivery_date) : new Date(),
          changeFrequency: "monthly",
          priority: 0.8,
        });
      });
    }
  }

  return routes;
}
