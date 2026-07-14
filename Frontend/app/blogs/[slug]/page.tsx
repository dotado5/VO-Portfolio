import "./page.css";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { Blog } from "@/types/blog.type";
import ViewTracker from "./ViewTracker";

export const revalidate = 0;

interface BlogPageProps {
  params: Promise<{ slug: string }>;
}

async function getBlog(slug: string): Promise<Blog | null> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from("Blog")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error) {
    if (error.code !== "PGRST116") {
      console.error("Failed to load blog:", error.message);
    }
    return null;
  }
  return data as Blog;
}

const formatDate = (value?: string | null) =>
  value
    ? new Date(value).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

export async function generateMetadata({ params }: BlogPageProps) {
  const { slug } = await params;
  const blog = await getBlog(slug);

  if (!blog) {
    return { title: "Post not found - VO Fatoki" };
  }

  return {
    title: `${blog.title} - VO Fatoki`,
    description: blog.excerpt || undefined,
    openGraph: {
      title: blog.title,
      description: blog.excerpt || undefined,
      images: blog.cover_image ? [{ url: blog.cover_image }] : undefined,
      type: "article",
    },
  };
}

export default async function BlogPost({ params }: BlogPageProps) {
  const { slug } = await params;
  const blog = await getBlog(slug);

  if (!blog) {
    notFound();
  }

  return (
    <article className="blog-post">
      <ViewTracker slug={blog.slug} />
      <Link href="/blogs" className="blog-post-back">
        <ArrowLeft size={18} />
        <span>All posts</span>
      </Link>

      <header className="blog-post-header">
        {blog.tags?.length > 0 && (
          <div className="blog-post-tags">
            {blog.tags.map((tag) => (
              <span key={tag} className="blog-tag">
                {tag}
              </span>
            ))}
          </div>
        )}

        <h1 className="blog-post-title">{blog.title}</h1>

        <div className="blog-post-meta">
          <span>{formatDate(blog.published_at)}</span>
          <span className="blog-card-dot">·</span>
          <span>{blog.read_time} min read</span>
        </div>
      </header>

      {blog.cover_image && (
        <div className="blog-post-cover">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={blog.cover_image} alt={blog.title} />
        </div>
      )}

      <div
        className="blog-content"
        dangerouslySetInnerHTML={{ __html: blog.content || "" }}
      />
    </article>
  );
}
