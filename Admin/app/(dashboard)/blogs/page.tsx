"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Calendar,
  Clock,
  Eye,
  Loader2,
  RefreshCw,
  FileText,
} from "lucide-react";
import { BlogService } from "@/services/blog.service";
import { showToast } from "@/utils/toast";
import { useBlogStore } from "@/store/blogStore";
import { Blog, CreateBlogDto } from "@/types/blog.type";
import BlogModal from "@/components/BlogModal";

const BlogsPage: React.FC = () => {
  const { blogs } = useBlogStore();
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">(
    "all",
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);

  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = async () => {
    try {
      setIsLoading(true);
      await BlogService.findAll();
    } catch (error) {
      showToast.error("Failed to fetch blog posts. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setIsLoading(true);
      await BlogService.findAll();
      showToast.success("Blog posts updated from server.");
    } catch (error) {
      showToast.error("Failed to refresh blog posts.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingBlog(null);
    setIsModalOpen(true);
  };

  const handleEdit = (blog: Blog) => {
    setEditingBlog(blog);
    setIsModalOpen(true);
  };

  const handleSave = async (data: CreateBlogDto | Blog) => {
    try {
      if ("id" in data) {
        const updated = await BlogService.update(data.id, data);
        showToast.success(`Post "${updated.title}" updated successfully.`);
      } else {
        const created = await BlogService.create(data);
        showToast.success(`Post "${created.title}" created successfully.`);
      }
    } catch (error) {
      showToast.error("Failed to save the post. Please check your data.");
      throw error;
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await BlogService.remove(id);
        showToast.success("Post deleted successfully.");
      } catch (error) {
        showToast.error("Failed to delete post.");
      }
    }
  };

  const filtered = blogs
    .filter((b) => (statusFilter === "all" ? true : b.status === statusFilter))
    .filter(
      (b) =>
        b.title.toLowerCase().includes(search.toLowerCase()) ||
        (b.tags || []).some((t) =>
          t.toLowerCase().includes(search.toLowerCase()),
        ),
    );

  const counts = {
    all: blogs.length,
    published: blogs.filter((b) => b.status === "published").length,
    draft: blogs.filter((b) => b.status === "draft").length,
  };

  return (
    <div className="container" style={{ paddingBottom: "5rem" }}>
      <nav className="dashboard-nav" style={{ padding: "0" }}>
        <div style={{ flex: 1 }}></div>
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <div className="search-bar">
            <Search size={18} style={{ color: "var(--text-muted)" }} />
            <input
              type="text"
              placeholder="Search posts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </nav>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div>
          <h1 style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>Blog</h1>
          <p style={{ color: "var(--text-secondary)" }}>
            Write, edit and publish articles for your website
          </p>
        </div>

        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <div
            className="glass"
            style={{
              display: "flex",
              borderRadius: "var(--radius-md)",
              padding: "0.25rem",
            }}
          >
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              style={{
                padding: "0.5rem",
                borderRadius: "8px",
                background: "transparent",
                color: "var(--text-muted)",
                border: "none",
                cursor: isLoading ? "not-allowed" : "pointer",
              }}
              title="Refresh Posts"
            >
              <RefreshCw size={20} className={isLoading ? "animate-spin" : ""} />
            </button>
          </div>
          <button
            className="btn btn-primary"
            style={{ width: "auto" }}
            onClick={handleAdd}
          >
            <Plus size={20} />
            New Post
          </button>
        </div>
      </div>

      {/* Status filter tabs */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "2rem" }}>
        {(["all", "published", "draft"] as const).map((key) => (
          <button
            key={key}
            onClick={() => setStatusFilter(key)}
            className="glass"
            style={{
              padding: "0.4rem 1rem",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--glass-border)",
              cursor: "pointer",
              textTransform: "capitalize",
              background:
                statusFilter === key ? "var(--accent-muted)" : "transparent",
              color:
                statusFilter === key
                  ? "var(--accent-primary)"
                  : "var(--text-secondary)",
              fontSize: "0.9rem",
            }}
          >
            {key} ({counts[key]})
          </button>
        ))}
      </div>

      {isLoading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "150px",
            gap: "1rem",
            color: "var(--text-secondary)",
          }}
        >
          <Loader2 className="animate-spin" size={40} />
          <p>Loading posts...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div
          style={{ textAlign: "center", marginTop: "3rem", padding: "3rem" }}
          className="glass"
        >
          <FileText
            size={48}
            style={{ color: "var(--text-muted)", marginBottom: "1rem" }}
          />
          <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem" }}>
            {blogs.length === 0
              ? "No posts yet. Write your first article!"
              : "No posts match your search."}
          </p>
          <button
            className="btn btn-primary"
            style={{ width: "auto", marginTop: "1rem" }}
            onClick={blogs.length === 0 ? handleAdd : () => setSearch("")}
          >
            {blogs.length === 0 ? "Create First Post" : "Clear Search"}
          </button>
        </div>
      ) : (
        <motion.div
          layout
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          <AnimatePresence>
            {filtered.map((blog) => (
              <motion.div
                layout
                key={blog.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="project-card glass"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1.25rem",
                }}
              >
                <div
                  style={{
                    width: "110px",
                    height: "72px",
                    flexShrink: 0,
                    borderRadius: "var(--radius-md)",
                    overflow: "hidden",
                    background: "var(--glass-bg)",
                    border: "1px solid var(--glass-border)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {blog.cover_image ? (
                    <img
                      src={blog.cover_image}
                      alt={blog.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <FileText size={24} style={{ color: "var(--text-muted)" }} />
                  )}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      marginBottom: "0.35rem",
                    }}
                  >
                    <h3
                      style={{
                        fontSize: "1.2rem",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {blog.title}
                    </h3>
                    <span
                      className="badge"
                      style={{
                        fontSize: "0.7rem",
                        padding: "0.15rem 0.6rem",
                        borderRadius: "999px",
                        flexShrink: 0,
                        color:
                          blog.status === "published"
                            ? "hsl(150, 70%, 45%)"
                            : "var(--text-muted)",
                        background:
                          blog.status === "published"
                            ? "hsla(150, 70%, 45%, 0.12)"
                            : "var(--glass-border)",
                      }}
                    >
                      {blog.status}
                    </span>
                  </div>

                  {blog.excerpt && (
                    <p
                      style={{
                        color: "var(--text-secondary)",
                        fontSize: "0.875rem",
                        marginBottom: "0.5rem",
                        display: "-webkit-box",
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {blog.excerpt}
                    </p>
                  )}

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                      color: "var(--text-muted)",
                      fontSize: "0.8rem",
                      flexWrap: "wrap",
                    }}
                  >
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.3rem",
                      }}
                    >
                      <Calendar size={13} />
                      {blog.published_at
                        ? new Date(blog.published_at).toLocaleDateString()
                        : blog.created_at
                          ? new Date(blog.created_at).toLocaleDateString()
                          : "—"}
                    </span>
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.3rem",
                      }}
                    >
                      <Clock size={13} />
                      {blog.read_time} min read
                    </span>
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.3rem",
                      }}
                      title={`${blog.views ?? 0} total views`}
                    >
                      <Eye size={13} />
                      {(blog.views ?? 0).toLocaleString()}{" "}
                      {blog.views === 1 ? "view" : "views"}
                    </span>
                    {(blog.tags || []).slice(0, 3).map((tag) => (
                      <span key={tag} className="badge badge-skill">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ display: "flex", gap: "0.75rem", flexShrink: 0 }}>
                  <button
                    className="btn btn-secondary"
                    style={{ padding: "0.5rem", width: "auto" }}
                    onClick={() => handleEdit(blog)}
                    title="Edit"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(blog.id)}
                    className="btn btn-secondary"
                    style={{
                      padding: "0.5rem",
                      width: "auto",
                      color: "var(--error)",
                    }}
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      <BlogModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        blog={editingBlog}
        title={editingBlog ? "Edit Post" : "New Post"}
      />
    </div>
  );
};

export default BlogsPage;
