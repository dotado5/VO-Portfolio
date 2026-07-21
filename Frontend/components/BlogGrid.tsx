"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { fadeInUp, staggerContainer } from "@/utils/motion";
import { Blog } from "@/types/blog.type";

type BlogCard = Pick<
  Blog,
  "id" | "slug" | "title" | "excerpt" | "cover_image" | "tags" | "read_time" | "published_at"
>;

interface BlogGridProps {
  blogs: BlogCard[];
  formatDate: (value?: string | null) => string;
}

export default function BlogGrid({ blogs, formatDate }: BlogGridProps) {
  return (
    <motion.div
      className="blogs-grid"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      {blogs.map((blog) => (
        <motion.div key={blog.id} variants={fadeInUp}>
          <Link href={`/blogs/${blog.slug}`} className="blog-card">
            <div className="blog-card-thumb">
              {blog.cover_image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={blog.cover_image} alt={blog.title} />
              ) : (
                <div className="blog-card-thumb-placeholder" />
              )}
            </div>

            <div className="blog-card-body">
              {blog.tags?.length > 0 && (
                <div className="blog-card-tags">
                  {blog.tags.slice(0, 2).map((tag) => (
                    <span key={tag} className="blog-tag">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <h2 className="blog-card-title">{blog.title}</h2>

              {blog.excerpt && (
                <p className="blog-card-excerpt">{blog.excerpt}</p>
              )}

              <div className="blog-card-meta">
                <span>{formatDate(blog.published_at)}</span>
                <span className="blog-card-dot">·</span>
                <span>{blog.read_time} min read</span>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
}
