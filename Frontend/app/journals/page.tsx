import "./page.css";
import Image from "next/image";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { Blog } from "@/types/blog.type";
import BlogGrid from "@/components/BlogGrid";
import journalsIcon from "@public/assets/journals-icon.png";

export const metadata = {
  title: "Journals - VO Fatoki",
  description: "Read my latest thoughts and articles on design, product and process.",
  alternates: {
    canonical: "/journals",
  },
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
        <div className="blogs-list-title">
          <span className="blogs-list-icon">
            <Image src={journalsIcon} alt="" width={56} height={56} priority />
          </span>
          <h1>Journals</h1>
        </div>
        <p>
          Thoughts, ideas, stories, and observations on things I find
          interesting. Some to learn from, some to talk about, and some just to
          get out of my head.
        </p>
      </header>

      <BlogGrid blogs={blogs} />
    </div>
  );
}
