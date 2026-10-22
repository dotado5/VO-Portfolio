"use client";

import Image from "next/image";
import briefcase from "@public/assets/briefcase.png";
import WorkExperienceBox from "../Work-Experience-Box/Work-Experience-Box";
import "./index.css";
import { useEffect } from "react";
import { useExperienceStore } from "@/store/useExperienceStore";
import { experienceService } from "@/services/experience.service";

import { motion } from "motion/react";
import { fadeInUp, defaultViewport } from "@/utils/motion";

interface WorkExperienceSectionProps {
  homepage: boolean;
  initialExperiences?: any[];
}

const WorkExperienceSection = ({
  homepage,
  initialExperiences,
}: WorkExperienceSectionProps) => {
  const { experiences, setExperiences } = useExperienceStore();

  useEffect(() => {
    if (initialExperiences && initialExperiences.length > 0) {
      setExperiences(initialExperiences);
    } else {
      fetchExperiences();
    }
  }, [initialExperiences, setExperiences]);

  const fetchExperiences = async () => {
    try {
      const data = await experienceService.getAllExperiences();
      setExperiences(data || []);
    } catch (error) {
      console.error("Failed to fetch experiences", error);
    }
  };

  const displayExperiences =
    experiences.length > 0 ? experiences : initialExperiences || [];

  return (
    <div className={`work-experience-section`}>
      <motion.h1
        initial="hidden"
        whileInView="visible"
        viewport={defaultViewport}
        variants={fadeInUp}
        className={`${homepage ? "" : "items-center justify-start"}`}
      >
        <Image src={briefcase} alt="" aria-hidden="true" className="w-5 h-5" />
        WORK EXPERIENCE
      </motion.h1>

      <div className="work-experience-list">
        {displayExperiences.map((exp, index) => (
          <WorkExperienceBox
            key={exp.id || index}
            type={exp.type}
            date={exp.date}
            role={exp.role}
            company={exp.company}
            description={exp.description}
          />
        ))}
      </div>
    </div>
  );
};

export default WorkExperienceSection;
