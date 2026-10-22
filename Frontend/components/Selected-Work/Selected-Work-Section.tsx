"use client";
import SelectedWorkBox from "../Selected-Work-Box/Selected-Work-Box";
import folder from "@public/assets/folder.png";
import Image from "next/image";
import "./Selected-Work-Section.css";
import { useEffect } from "react";
import { useProjectStore } from "@/store/useProjectStore";
import { projectService } from "@/services/project.service";

import { motion } from "motion/react";
import { fadeInUp, defaultViewport } from "@/utils/motion";

import { Project } from "@/types/project.type";

interface SelectedWorkSectionProps {
  initialProjects?: Project[];
}

const SelectedWorkSection = ({ initialProjects }: SelectedWorkSectionProps) => {
  const { projects, isLoading, error, setProjects } = useProjectStore();

  useEffect(() => {
    if (initialProjects && initialProjects.length > 0) {
      setProjects(initialProjects);
    } else {
      fetchProjects();
    }
  }, [initialProjects, setProjects]);

  const fetchProjects = async () => {
    try {
      const fetched = await projectService.getAllProjects();
      setProjects(fetched);
      return fetched;
    } catch (error: any) {
      console.log(error.message || "Failed to fetch projects");
    }
  };

  const displayProjects =
    projects.length > 0 ? projects : initialProjects || [];

  return (
    <section className="selected-work-section">
      <motion.div
        className="selected-work-header"
        initial="hidden"
        whileInView="visible"
        viewport={defaultViewport}
        variants={fadeInUp}
      >
        <Image
          src={folder}
          alt=""
          aria-hidden="true"
          className="selected-work-folder"
        />
        <h2 className="selected-work-section-title">Selected Works</h2>
      </motion.div>

      {isLoading && displayProjects.length === 0 && <p>Loading projects...</p>}
      {error && displayProjects.length === 0 && <p>Error: {error}</p>}

      <div className="selected-work-list">
        {displayProjects.map((project, index) => (
          <SelectedWorkBox
            key={project.id}
            project={project}
            reverse={index % 2 !== 0}
          />
        ))}
      </div>
    </section>
  );
};

export default SelectedWorkSection;
