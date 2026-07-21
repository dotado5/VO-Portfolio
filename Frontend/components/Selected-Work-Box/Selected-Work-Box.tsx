"use client";

import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import "./Selected-Work-Box.css";
import { motion } from "motion/react";
import { useProjectStore } from "@/store/useProjectStore";
import { useRouter } from "next/navigation";
import { Project } from "@/types/project.type";
import { stripHtml } from "@/utils/text";

interface SelectedWorkBoxProps {
  project: Project;
  reverse?: boolean;
}

const SelectedWorkBox = ({
  project,
  reverse = false,
}: SelectedWorkBoxProps) => {
  const setSelectedProject = useProjectStore(
    (state) => state.setSelectedProject,
  );
  const router = useRouter();

  const handleClick = () => {
    setSelectedProject(project);
    router.push(`/project/${project.slug}`);
  };

  const imageSrc = project.images[0] || "";
  const dateStr = project.delivery_date
    ? new Date(project.delivery_date).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "";
  const title = project.title;
  const plainStory = stripHtml(project.background_story);
  const description = plainStory;

  return (
    <motion.div
      className={`selected-work-box ${reverse ? "reverse" : ""}`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {/* Image container */}
      <div className="selected-work-image-container">
        {imageSrc && (
          <Image
            src={imageSrc}
            alt={title}
            fill
            className="selected-work-image"
          />
        )}
      </div>

      {/* Content */}
      <div className={`selected-work-content ${reverse ? "reverse" : ""}`}>
        <div className="selected-work-date-badge">{dateStr}</div>
        <h3 className="selected-work-title">{title}</h3>
        <p className="selected-work-description">{description}</p>
        <motion.button
          className="selected-work-link"
          onClick={handleClick}
          whileHover="hover"
        >
          Read Case Study
          <motion.div
            className="selected-work-link-icon"
            variants={{
              hover: { x: 2, y: -2 },
            }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <ArrowUpRight size={10} strokeWidth={3} />
          </motion.div>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default SelectedWorkBox;
