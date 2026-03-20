import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save, Loader2 } from "lucide-react";
import { Project, CreateProjectDto } from "../types/project.type";

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
    background_story: "",
    role: "",
    skills: [],
    problem: "",
    strategy: "",
    takeaway: "",
    images: [],
    delivery_date: new Date().toISOString().split("T")[0],
  });

  const [skillsInput, setSkillsInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title,
        background_story: project.background_story,
        role: project.role,
        skills: project.skills,
        problem: project.problem,
        strategy: project.strategy,
        takeaway: project.takeaway,
        images: project.images,
        delivery_date: new Date(project.delivery_date)
          .toISOString()
          .split("T")[0],
      });
      setSkillsInput(project.skills.join(", "));
    } else {
      setFormData({
        title: "",
        background_story: "",
        role: "",
        skills: [],
        problem: "",
        strategy: "",
        takeaway: "",
        images: [],
        delivery_date: new Date().toISOString().split("T")[0],
      });
      setSkillsInput("");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await onSave(
        project ? ({ ...formData, id: project.id } as Project) : formData,
      );
      onClose();
    } catch (error) {
      console.error("Failed to save project:", error);
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
                  disabled={isSubmitting}
                  style={{ width: "auto" }}
                >
                  {isSubmitting ? (
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
