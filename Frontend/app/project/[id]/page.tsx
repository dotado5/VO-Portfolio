"use client";

import Image from "next/image";
import { use, useEffect } from "react";
import "../page.css";
import snapshot from "@public/assets/snapshot.png";
import Header from "@/components/Work-Details-Header";
import ProjectSection from "@/components/Background-Story";
import SliderBox from "@/components/Slider-Box/Slider-Box";
import FormSection from "@/components/Form-Section";
import { useProjectStore } from "@/store/useProjectStore";

interface ProjectPageProps {
  params: Promise<{
    id: string;
  }>;
}

const colorSwatches = ["bg-[#FFFFFF]", "bg-[#6B1616]", "bg-[#000000]"];

const ProjectPage = ({ params }: ProjectPageProps) => {
  const { id } = use(params);
  const projectId = Number(id);
  const { selectedProject, isLoading, error, fetchProjectById } =
    useProjectStore();

  useEffect(() => {
    if (!Number.isFinite(projectId)) {
      return;
    }

    if (selectedProject?.id !== projectId) {
      void fetchProjectById(projectId);
    }
  }, [fetchProjectById, projectId, selectedProject?.id]);

  if (!Number.isFinite(projectId)) {
    return <div className="project-status">Invalid project link.</div>;
  }

  if (error && selectedProject?.id !== projectId) {
    return <div className="project-status">Failed to load project: {error}</div>;
  }

  if (isLoading || selectedProject?.id !== projectId) {
    return <div className="project-status">Loading project...</div>;
  }

  const backgroundStoryContent = [
    {
      text: selectedProject.background_story,
      isBold: true,
    },
  ];

  const problemContent = [
    {
      text: selectedProject.problem,
    },
  ];

  const strategyContent = [
    {
      text: selectedProject.strategy,
    },
  ];

  const takeawayContent = [
    {
      text: selectedProject.takeaway,
    },
  ];

  return (
    <div>
      <Header />
      <Image src={snapshot} alt="" className="snapshot" />
      <ProjectSection
        title="BACKGROUND STORY"
        content={backgroundStoryContent}
      />
      <ProjectSection title="THE PROBLEM" content={problemContent} />

      <div className="slider">
        {colorSwatches.map((color) => (
          <SliderBox key={color} color={color} />
        ))}
      </div>

      <ProjectSection title="DESIGN STRATEGY" content={strategyContent} />
      <ProjectSection title="KEY TAKEAWAY" content={takeawayContent} />

      <Image src={snapshot} alt="" className="snapshot" />
      <FormSection />
    </div>
  );
};

export default ProjectPage;
