"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { fadeInUp, staggerContainer } from "@/utils/motion";
import { Blog } from "@/types/blog.type";

import { formatDateUTC } from "@/utils/text";

type BlogCard = Pick<
  Blog,
  "id" | "slug" | "title" | "excerpt" | "cover_image" | "tags" | "read_time" | "published_at"
>;

interface BlogGridProps {
  blogs: BlogCard[];
}

export default function BlogGrid({ blogs }: BlogGridProps) {
  return (
    <motion.div
      className="blogs-grid"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      {blogs.map((blog) => (
        <motion.div key={blog.id} variants={fadeInUp}>
          <Link href={`/journals/${blog.slug}`} className="blog-card">
            <div className="blog-card-thumb">
              {blog.cover_image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={blog.cover_image} alt={blog.title} />
              ) : (
                <div className="blog-card-thumb-placeholder" />
              )}
            </div>

            <div className="blog-card-body">
              <h2 className="blog-card-title">{blog.title}</h2>

              {blog.excerpt && (
                <p className="blog-card-excerpt">{blog.excerpt}</p>
              )}

              <div className="blog-card-meta">
                <span>{formatDateUTC(blog.published_at)}</span>
                <span className="blog-card-dot">●</span>
                <span>
                  {blog.read_time} {blog.read_time === 1 ? "Min" : "Mins"} Read
                </span>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
}
