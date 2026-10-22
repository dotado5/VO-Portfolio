"use client";

import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import "./Selected-Work-Box.css";
import { motion } from "motion/react";
import { useProjectStore } from "@/store/useProjectStore";
import { Project } from "@/types/project.type";
import { stripHtml, formatDateMonthYearUTC } from "@/utils/text";

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

  const imageSrc = project.images?.[0] || "";
  const dateStr = formatDateMonthYearUTC(project.delivery_date);
  const title = project.title;
  const plainStory = stripHtml(project.background_story);
  const description =
    plainStory ||
    stripHtml(project.background_story_sub) ||
    stripHtml(project.problem);

  return (
    <motion.article
      className={`selected-work-box ${reverse ? "reverse" : ""}`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {/* Image container */}
      <div className="selected-work-image-container">
        {imageSrc && (
          <Link
            href={`/project/${project.slug}`}
            onClick={() => setSelectedProject(project)}
            aria-label={`View case study: ${title}`}
            className="block w-full h-full relative"
          >
            <Image
              src={imageSrc}
              alt={title}
              fill
              className="selected-work-image"
            />
          </Link>
        )}
      </div>

      {/* Content */}
      <div className={`selected-work-content ${reverse ? "reverse" : ""}`}>
        <div className="selected-work-date-badge">{dateStr}</div>
        <h3 className="selected-work-title">
          <Link
            href={`/project/${project.slug}`}
            onClick={() => setSelectedProject(project)}
            className="hover:underline text-inherit"
          >
            {title}
          </Link>
        </h3>
        <p className="selected-work-description">{description}</p>
        <Link
          href={`/project/${project.slug}`}
          onClick={() => setSelectedProject(project)}
          className="selected-work-link group"
        >
          Read Case Study
          <div className="selected-work-link-icon transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
            <ArrowUpRight size={10} strokeWidth={3} />
          </div>
        </Link>
      </div>
    </motion.article>
  );
};

export default SelectedWorkBox;
