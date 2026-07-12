"use client";

import Image from "next/image";
import briefcase from "@public/assets/briefcase.png";
import WorkExperienceBox from "../Work-Experience-Box/Work-Experience-Box";
import "./index.css";
import { useEffect } from "react";
import { useExperienceStore } from "@/store/useExperienceStore";
import { experienceService } from "@/services/experience.service";

const WorkExperienceSection = ({ homepage }: { homepage: boolean }) => {
  const { experiences, setExperiences } = useExperienceStore();

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const data = await experienceService.getAllExperiences();
      setExperiences(data || []);
    } catch (error) {
      console.error("Failed to fetch experiences", error);
    }
  };

  return (
    <div className={`work-experience-section`}>
      <h1
        className={`${homepage ? "" : "items-center justify-center sm:justify-start"}`}
      >
        <Image src={briefcase} alt="Briefcase" className="w-5 h-5" />
        WORK EXPERIENCE
      </h1>

      <div className="work-experience-list">
        {experiences.map((exp, index) => (
          <WorkExperienceBox
            key={index}
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
