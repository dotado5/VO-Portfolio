"use client";

import { use, useEffect } from "react";
import "../page.css";
import snapshot from "@public/assets/snapshot.png";
import Header from "@/components/Work-Details-Header";
import ProjectSection from "@/components/Background-Story";
import SliderBox from "@/components/Slider-Box/Slider-Box";
import FormSection from "@/components/Form-Section";
import { useProjectStore } from "@/store/useProjectStore";
import SliderSection from "@/components/Slider-Section/Slider-Section";

interface ProjectPageProps {
  params: Promise<{
    slug: string;
  }>;
}

const colorSwatches = ["bg-[#FFFFFF]", "bg-[#6B1616]", "bg-[#000000]"];

const ProjectPage = ({ params }: ProjectPageProps) => {
  const { slug } = use(params);
  const { selectedProject, isLoading, error, fetchProjectBySlug } =
    useProjectStore();

  useEffect(() => {
    if (!slug) {
      return;
    }

    if (selectedProject?.slug !== slug) {
      void fetchProjectBySlug(slug);
    }
  }, [fetchProjectBySlug, slug, selectedProject?.slug]);

  if (!slug) {
    return <div className="project-status">Invalid project link.</div>;
  }

  if (error && selectedProject?.slug !== slug) {
    return (
      <div className="project-status">Failed to load project: {error}</div>
    );
  }

  if (isLoading || selectedProject?.slug !== slug) {
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
      <div className="snapshot-container">
        <img
          src={selectedProject.images?.[0] || snapshot.src}
          alt={`${selectedProject.title} view 1`}
          className="snapshot-half"
        />
      </div>
      <ProjectSection
        title="BACKGROUND STORY"
        content={backgroundStoryContent}
      />
      <ProjectSection title="THE PROBLEM" content={problemContent} />

      <div className="slider">
        <SliderSection images={selectedProject.slider_images} />
      </div>

      <ProjectSection title="DESIGN STRATEGY" content={strategyContent} />
      <ProjectSection title="KEY TAKEAWAY" content={takeawayContent} />

      <div className="snapshot-container">
        <img
          src={selectedProject.images?.[1] || snapshot.src}
          alt={`${selectedProject.title} view 3`}
          className="snapshot-half"
        />
      </div>
      <FormSection />
    </div>
  );
};

export default ProjectPage;
