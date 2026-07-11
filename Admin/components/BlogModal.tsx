import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save, Loader2, ImagePlus, Trash, Eye } from "lucide-react";
import { Blog, CreateBlogDto } from "../types/blog.type";
import { BlogService } from "../services/blog.service";
import { showToast } from "../utils/toast";
import RichTextEditor from "./RichTextEditor";

interface BlogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (blog: CreateBlogDto | Blog) => Promise<void>;
  blog?: Blog | null;
  title: string;
}

const emptyForm: CreateBlogDto = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  cover_image: "",
  tags: [],
  status: "draft",
  read_time: 1,
  published_at: null,
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

const estimateReadTime = (html: string) => {
  const text = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  const words = text ? text.split(" ").length : 0;
  return Math.max(1, Math.round(words / 200));
};

const PREVIEW_KEY = "blog-preview";

const fileToDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const BlogModal: React.FC<BlogModalProps> = ({
  isOpen,
  onClose,
  onSave,
  blog,
  title,
}) => {
  const [formData, setFormData] = useState<CreateBlogDto>(emptyForm);
  const [tagsInput, setTagsInput] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (blog) {
      setFormData({
        title: blog.title,
        slug: blog.slug,
        excerpt: blog.excerpt || "",
        content: blog.content || "",
        cover_image: blog.cover_image || "",
        tags: blog.tags || [],
        status: blog.status,
        read_time: blog.read_time || 1,
        published_at: blog.published_at ?? null,
      });
      setTagsInput((blog.tags || []).join(", "));
      setSlugTouched(true);
    } else {
      setFormData(emptyForm);
      setTagsInput("");
      setSlugTouched(false);
    }
    setCoverFile(null);
    setCoverPreview("");
  }, [blog, isOpen]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title: value,
      slug: slugTouched ? prev.slug : slugify(value),
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlugTouched(true);
    setFormData((prev) => ({ ...prev, slug: e.target.value }));
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagsInput(e.target.value);
    const tags = e.target.value
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t !== "");
    setFormData((prev) => ({ ...prev, tags }));
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const removeCover = () => {
    setCoverFile(null);
    setCoverPreview("");
    setFormData((prev) => ({ ...prev, cover_image: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);

      const finalData: CreateBlogDto = { ...formData };

      if (!finalData.slug) finalData.slug = slugify(finalData.title);
      finalData.read_time = estimateReadTime(finalData.content);

      // Set published_at the first time a post goes live
      if (finalData.status === "published" && !finalData.published_at) {
        finalData.published_at = new Date().toISOString();
      }
      if (finalData.status === "draft") {
        finalData.published_at = null;
      }

      if (coverFile) {
        finalData.cover_image = await BlogService.uploadImage(coverFile);
      }

      await onSave(
        blog ? ({ ...finalData, id: blog.id } as Blog) : finalData,
      );
      onClose();
    } catch (error) {
      console.error("Failed to save blog:", error);
      showToast.error("Failed to save the blog post.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePreview = async () => {
    // A freshly selected cover isn't uploaded yet; inline it as a data URL so
    // it renders in the preview tab. Existing covers are already public URLs.
    let cover = formData.cover_image;
    if (coverFile) {
      cover = await fileToDataUrl(coverFile).catch(() => "");
    }

    const payload = {
      title: formData.title,
      excerpt: formData.excerpt,
      tags: formData.tags,
      read_time: estimateReadTime(formData.content),
      content: formData.content,
      cover,
      published_at: formData.published_at ?? null,
    };

    try {
      localStorage.setItem(PREVIEW_KEY, JSON.stringify(payload));
    } catch {
      // Most likely the inlined cover blew the storage quota — drop it.
      try {
        localStorage.setItem(
          PREVIEW_KEY,
          JSON.stringify({ ...payload, cover: "" }),
        );
        showToast.info("Cover image too large to preview; showing without it.");
      } catch {
        showToast.error("Could not open preview.");
        return;
      }
    }

    window.open("/blog-preview", "_blank", "noopener");
  };

  const displayedCover = coverPreview || formData.cover_image;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="modal-overlay" onClick={onClose}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="modal-content glass"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2 style={{ fontSize: "1.75rem" }}>{title}</h2>
              <button className="modal-close" onClick={onClose}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="input-group">
                  <label className="input-label">Title</label>
                  <input
                    type="text"
                    name="title"
                    className="input-field"
                    placeholder="e.g. Designing for Delight"
                    value={formData.title}
                    onChange={handleTitleChange}
                    required
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Slug (URL)</label>
                  <input
                    type="text"
                    name="slug"
                    className="input-field"
                    placeholder="designing-for-delight"
                    value={formData.slug}
                    onChange={handleSlugChange}
                    required
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Status</label>
                  <select
                    name="status"
                    className="input-field"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="draft">Draft (hidden)</option>
                    <option value="published">Published (live)</option>
                  </select>
                </div>

                <div className="input-group">
                  <label className="input-label">Tags (comma separated)</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Design, UX, Process"
                    value={tagsInput}
                    onChange={handleTagsChange}
                  />
                </div>

                <div className="input-group form-full">
                  <label className="input-label">
                    Excerpt
                    <span
                      style={{
                        fontWeight: 400,
                        opacity: 0.6,
                        marginLeft: "0.5rem",
                        fontSize: "0.8rem",
                      }}
                    >
                      (short summary shown in the blog list & previews)
                    </span>
                  </label>
                  <textarea
                    name="excerpt"
                    className="input-field"
                    placeholder="A one or two sentence teaser for this post…"
                    value={formData.excerpt}
                    onChange={handleChange}
                    rows={2}
                  />
                </div>

                <div className="input-group form-full">
                  <label className="input-label">Cover Image</label>
                  <div
                    style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}
                  >
                    {displayedCover ? (
                      <div
                        style={{ position: "relative", width: "fit-content" }}
                      >
                        <img
                          src={displayedCover}
                          alt="Cover preview"
                          style={{
                            width: "260px",
                            height: "150px",
                            objectFit: "cover",
                            borderRadius: "var(--radius-md)",
                            border: "1px solid var(--glass-border)",
                          }}
                        />
                        <button
                          type="button"
                          onClick={removeCover}
                          className="btn btn-secondary"
                          style={{
                            position: "absolute",
                            top: "0.5rem",
                            right: "0.5rem",
                            padding: "0.5rem",
                            color: "var(--error)",
                            background: "rgba(0,0,0,0.7)",
                            border: "none",
                            backdropFilter: "blur(4px)",
                          }}
                        >
                          <Trash size={16} />
                        </button>
                      </div>
                    ) : (
                      <label
                        className="upload-area glass"
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          width: "260px",
                          height: "150px",
                          border: "2px dashed var(--glass-border)",
                          borderRadius: "var(--radius-md)",
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                        }}
                      >
                        <ImagePlus
                          size={32}
                          style={{
                            color: "var(--text-muted)",
                            marginBottom: "0.5rem",
                          }}
                        />
                        <span
                          style={{
                            color: "var(--text-secondary)",
                            fontSize: "0.8rem",
                          }}
                        >
                          Add Cover Image
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: "none" }}
                          onChange={handleCoverChange}
                        />
                      </label>
                    )}
                  </div>
                </div>

                <div className="input-group form-full">
                  <label className="input-label">Content</label>
                  <RichTextEditor
                    value={formData.content}
                    onChange={(html) =>
                      setFormData((prev) => ({ ...prev, content: html }))
                    }
                    onImageUpload={(file) => BlogService.uploadImage(file)}
                    placeholder="Start writing your post…"
                  />
                </div>
              </div>

              <div
                style={{
                  marginTop: "2rem",
                  display: "flex",
                  gap: "1rem",
                  alignItems: "center",
                }}
              >
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handlePreview}
                  style={{ width: "auto", marginRight: "auto" }}
                  title="Open a live preview in a new tab"
                >
                  <Eye size={18} />
                  Preview
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={onClose}
                  style={{ width: "auto" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                  style={{ width: "auto" }}
                >
                  {isSubmitting ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Save size={18} />
                  )}
                  {blog ? "Update Post" : "Create Post"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default BlogModal;
