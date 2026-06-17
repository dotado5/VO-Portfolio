import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save, Loader2, ImagePlus, Trash } from "lucide-react";
import { Project, CreateProjectDto } from "../types/project.type";
import { createClient } from "@/utils/supabase/client";
import { showToast } from "../utils/toast";

const supabase = createClient();

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: CreateProjectDto | Project) => Promise<void>;
  project?: Project | null;
  title: string;
}

const ProjectModal: React.FC<ProjectModalProps> = ({
  isOpen,
  onClose,
  onSave,
  project,
  title,
}) => {
  const [formData, setFormData] = useState<CreateProjectDto>({
    title: "",
    slug: "",
    background_story: "",
    role: "",
    skills: [],
    problem: "",
    strategy: "",
    takeaway: "",
    images: [],
    slider_images: [],
    delivery_date: new Date().toISOString().split("T")[0],
  });

  const [skillsInput, setSkillsInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [selectedSliderFiles, setSelectedSliderFiles] = useState<File[]>([]);
  const [sliderPreviewUrls, setSliderPreviewUrls] = useState<string[]>([]);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title,
        slug: project.slug,
        background_story: project.background_story,
        role: project.role,
        skills: project.skills,
        problem: project.problem,
        strategy: project.strategy,
        takeaway: project.takeaway,
        images: project.images,
        slider_images: project.slider_images || [],
        delivery_date: new Date(project.delivery_date)
          .toISOString()
          .split("T")[0],
      });
      setSkillsInput(project.skills.join(", "));
      setSelectedFiles([]);
      setPreviewUrls([]);
      setSelectedSliderFiles([]);
      setSliderPreviewUrls([]);
    } else {
      setFormData({
        title: "",
        slug: "",
        background_story: "",
        role: "",
        skills: [],
        problem: "",
        strategy: "",
        takeaway: "",
        images: [],
        slider_images: [],
        delivery_date: new Date().toISOString().split("T")[0],
      });
      setSkillsInput("");
      setSelectedFiles([]);
      setPreviewUrls([]);
      setSelectedSliderFiles([]);
      setSliderPreviewUrls([]);
    }
  }, [project, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSkillsInput(e.target.value);
    const skillsArray = e.target.value
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s !== "");
    setFormData((prev) => ({ ...prev, skills: skillsArray }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...files]);
      const urls = files.map((file) => URL.createObjectURL(file));
      setPreviewUrls((prev) => [...prev, ...urls]);
    }
  };

  const handleSliderFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedSliderFiles((prev) => [...prev, ...files]);
      const urls = files.map((file) => URL.createObjectURL(file));
      setSliderPreviewUrls((prev) => [...prev, ...urls]);
    }
  };

  const removeImage = (index: number, isExisting: boolean) => {
    if (isExisting) {
      setFormData((prev) => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index),
      }));
    } else {
      setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
      setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const removeSliderImage = (index: number, isExisting: boolean) => {
    if (isExisting) {
      setFormData((prev) => ({
        ...prev,
        slider_images: (prev.slider_images || []).filter((_, i) => i !== index),
      }));
    } else {
      setSelectedSliderFiles((prev) => prev.filter((_, i) => i !== index));
      setSliderPreviewUrls((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    try {
      setIsUploadingImage(true);
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error } = await supabase.storage
        .from("Project_images")
        .upload(filePath, file);

      if (error) {
        showToast.error(error.message);
        throw error;
      }

      const { data: publicUrlData } = supabase.storage
        .from("Project_images")
        .getPublicUrl(filePath);

      return publicUrlData.publicUrl;
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);

      let finalFormData = { ...formData };
      
      // Auto-generate slug if not provided or updating title
      if (!finalFormData.slug || finalFormData.slug === "") {
        finalFormData.slug = finalFormData.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "");
      }

      if (selectedFiles.length > 0) {
        const imageUrls = await Promise.all(
          selectedFiles.map((file) => uploadImage(file))
        );
        finalFormData.images = [...finalFormData.images, ...imageUrls];
      }

      if (selectedSliderFiles.length > 0) {
        const sliderImageUrls = await Promise.all(
          selectedSliderFiles.map((file) => uploadImage(file))
        );
        finalFormData.slider_images = [...(finalFormData.slider_images || []), ...sliderImageUrls];
      }

      await onSave(
        project
          ? ({ ...finalFormData, id: project.id } as Project)
          : finalFormData,
      );
      onClose();
    } catch (error) {
      console.error("Failed to save project:", error);
      showToast.error("Failed to upload image or save project.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
                  <label className="input-label">Project Title</label>
                  <input
                    type="text"
                    name="title"
                    className="input-field"
                    placeholder="e.g. EcoTrack Analytics"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Your Role</label>
                  <input
                    type="text"
                    name="role"
                    className="input-field"
                    placeholder="e.g. Lead Developer"
                    value={formData.role}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="input-group form-full">
                  <label className="input-label">
                    Skills (comma separated)
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="React, TypeScript, GSAP..."
                    value={skillsInput}
                    onChange={handleSkillsChange}
                  />
                </div>

                <div className="input-group form-full">
                  <label className="input-label">Background Story</label>
                  <textarea
                    name="background_story"
                    className="input-field"
                    placeholder="What's the story behind this project?"
                    value={formData.background_story}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="input-group form-full">
                  <label className="input-label">The Problem</label>
                  <textarea
                    name="problem"
                    className="input-field"
                    placeholder="What problem were you solving?"
                    value={formData.problem}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="input-group form-full">
                  <label className="input-label">Design Strategy</label>
                  <textarea
                    name="strategy"
                    className="input-field"
                    placeholder="How did you approach the solution?"
                    value={formData.strategy}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="input-group form-full">
                  <label className="input-label">Key Takeaway</label>
                  <textarea
                    name="takeaway"
                    className="input-field"
                    placeholder="What did you learn from this project?"
                    value={formData.takeaway}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Delivery Date</label>
                  <input
                    type="date"
                    name="delivery_date"
                    className="input-field"
                    value={formData.delivery_date}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="input-group form-full">
                  <label className="input-label">Project Snapshots (Max 4, mockups/snapshots for details page)</label>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "1rem",
                    }}
                  >
                    {formData.images.map((img, index) => (
                      <div
                        key={`existing-snap-${index}`}
                        style={{ position: "relative", width: "fit-content" }}
                      >
                        <img
                          src={img}
                          alt={`Project Snapshot ${index + 1}`}
                          style={{
                            width: "150px",
                            height: "150px",
                            objectFit: "cover",
                            borderRadius: "var(--radius-md)",
                            border: "1px solid var(--glass-border)",
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index, true)}
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
                    ))}
                    {previewUrls.map((url, index) => (
                      <div
                        key={`preview-snap-${index}`}
                        style={{ position: "relative", width: "fit-content" }}
                      >
                        <img
                          src={url}
                          alt={`New Snapshot Preview ${index + 1}`}
                          style={{
                            width: "150px",
                            height: "150px",
                            objectFit: "cover",
                            borderRadius: "var(--radius-md)",
                            border: "1px solid var(--glass-border)",
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index, false)}
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
                    ))}
                    {formData.images.length + previewUrls.length < 4 && (
                      <label
                        className="upload-area glass"
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          width: "150px",
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
                            textAlign: "center",
                            padding: "0 0.5rem",
                          }}
                        >
                          Add Snapshot
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          style={{ display: "none" }}
                          onChange={handleFileChange}
                        />
                      </label>
                    )}
                  </div>
                </div>

                <div className="input-group form-full">
                  <label className="input-label">Project Slider Images (Used in the interactive slider)</label>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "1rem",
                    }}
                  >
                    {(formData.slider_images || []).map((img, index) => (
                      <div
                        key={`existing-slider-${index}`}
                        style={{ position: "relative", width: "fit-content" }}
                      >
                        <img
                          src={img}
                          alt={`Slider Image ${index + 1}`}
                          style={{
                            width: "150px",
                            height: "150px",
                            objectFit: "cover",
                            borderRadius: "var(--radius-md)",
                            border: "1px solid var(--glass-border)",
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => removeSliderImage(index, true)}
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
                    ))}
                    {sliderPreviewUrls.map((url, index) => (
                      <div
                        key={`preview-slider-${index}`}
                        style={{ position: "relative", width: "fit-content" }}
                      >
                        <img
                          src={url}
                          alt={`New Slider Preview ${index + 1}`}
                          style={{
                            width: "150px",
                            height: "150px",
                            objectFit: "cover",
                            borderRadius: "var(--radius-md)",
                            border: "1px solid var(--glass-border)",
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => removeSliderImage(index, false)}
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
                    ))}
                    <label
                      className="upload-area glass"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "150px",
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
                          textAlign: "center",
                          padding: "0 0.5rem",
                        }}
                      >
                        Add Slider Image
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        style={{ display: "none" }}
                        onChange={handleSliderFileChange}
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: "2rem", display: "flex", gap: "1rem" }}>
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
                  disabled={isSubmitting || isUploadingImage}
                  style={{ width: "auto" }}
                >
                  {isSubmitting || isUploadingImage ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Save size={18} />
                  )}
                  {project ? "Update Project" : "Create Project"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ProjectModal;
