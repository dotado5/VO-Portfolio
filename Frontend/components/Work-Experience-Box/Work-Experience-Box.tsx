"use client";

import { motion } from "motion/react";
import "./Work-Experience-Box.css";

export interface WorkExperienceBoxProps {
  type: string;
  date: string;
  role: string;
  company: string;
  description: string;
}

const WorkExperienceBox = ({
  type,
  date,
  role,
  company,
  description,
}: WorkExperienceBoxProps) => {
  return (
    <motion.div
      className="work-experience-box"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      <div className="work-experience-left">
        <span className="work-experience-type">{type}</span>
        <span className="work-experience-date">{date}</span>
      </div>
      <div className="work-experience-right">
        <h3 className="work-experience-title">
          {role} at {company}
        </h3>
        <p className="work-experience-description">{description}</p>
      </div>
    </motion.div>
  );
};

export default WorkExperienceBox;
