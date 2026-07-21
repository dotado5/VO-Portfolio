import "./page.css";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { Blog } from "@/types/blog.type";
import BlogGrid from "@/components/BlogGrid";

export const metadata = {
  title: "Blogs - VO Fatoki",
  description: "Read my latest thoughts and articles on design, product and process.",
};

// Always fetch fresh so newly published posts appear without a rebuild.
export const revalidate = 0;

type BlogCard = Pick<
  Blog,
  "id" | "slug" | "title" | "excerpt" | "cover_image" | "tags" | "read_time" | "published_at"
>;

async function getBlogs(): Promise<BlogCard[]> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from("Blog")
    .select(
      "id, slug, title, excerpt, cover_image, tags, read_time, published_at",
    )
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error) {
    console.error("Failed to load blogs:", error.message);
    return [];
  }
  return (data as BlogCard[]) ?? [];
}

const formatDate = (value?: string | null) =>
  value
    ? new Date(value).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

export default async function BlogsPage() {
  const blogs = await getBlogs();

  if (blogs.length === 0) {
    return (
      <div className="blogs-page">
        <h1>COMING SOON</h1>
        <p>Kindly check back soon, I&apos;m still writing</p>
      </div>
    );
  }

  return (
    <div className="blogs-list">
      <header className="blogs-list-header">
        <h1>Writing</h1>
        <p>Thoughts on design, product, and the craft behind them.</p>
      </header>

      <BlogGrid blogs={blogs} formatDate={formatDate} />
    </div>
  );
}
