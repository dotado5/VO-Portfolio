"use client";

import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import "./Selected-Work-Box.css";
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
  const description =
    plainStory.length > 100 ? `${plainStory.substring(0, 100)}...` : plainStory;

  return (
    <div className={`selected-work-box ${reverse ? "reverse" : ""}`}>
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
        <button className="selected-work-link" onClick={handleClick}>
          Read Case Study
          <div className="selected-work-link-icon">
            <ArrowUpRight size={10} strokeWidth={3} />
          </div>
        </button>
      </div>
    </div>
  );
};

export default SelectedWorkBox;
