"use client";

import "./index.css";
import { motion } from "motion/react";
import { fadeInUp, staggerContainer, defaultViewport } from "@/utils/motion";

interface ContentItem {
  text: string;
  isBold?: boolean;
}

interface ProjectSectionProps {
  title: string;
  content: ContentItem[];
}

const ProjectSection = ({ title, content }: ProjectSectionProps) => {
  return (
    <motion.section
      className="project-section"
      initial="hidden"
      whileInView="visible"
      viewport={defaultViewport}
      variants={staggerContainer}
    >
      <motion.div className="section-title-wrapper" variants={fadeInUp}>
        <h2 className="section-title">{title}</h2>
      </motion.div>
      <motion.div className="section-content" variants={fadeInUp}>
        {content.map((item, index) => (
          <div
            key={index}
            className={`content-prose ${item.isBold ? "content-prose--lead" : ""}`}
            dangerouslySetInnerHTML={{ __html: item.text || "" }}
          />
        ))}
      </motion.div>
    </motion.section>
  );
};

export default ProjectSection;
