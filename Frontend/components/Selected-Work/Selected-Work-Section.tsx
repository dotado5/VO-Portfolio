"use client";
import SelectedWorkBox from "../Selected-Work-Box/Selected-Work-Box";
import folder from "@public/assets/folder.png";
import Image from "next/image";
import "./Selected-Work-Section.css";
import { useEffect } from "react";
import { useProjectStore } from "@/store/useProjectStore";
import { projectService } from "@/services/project.service";

const SelectedWorkSection = () => {
  const { projects, isLoading, error, setProjects } = useProjectStore();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const projects = await projectService.getAllProjects();
      setProjects(projects);
      return projects;
    } catch (error: any) {
      console.log(error.message || "Failed to fetch projects");
    }
  };

  return (
    <section className="selected-work-section">
      <div className="selected-work-header">
        <Image src={folder} alt="folder" className="selected-work-folder" />
        <h2 className="selected-work-section-title">Selected Works</h2>
      </div>

      {isLoading && <p>Loading projects...</p>}
      {error && <p>Error: {error}</p>}

      <div className="selected-work-list">
        {projects.map((project, index) => (
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
