"use client";

import Image from "next/image";
import "./page.css";
import PhotoSection from "@/components/Photo-Section";
import WorkExperienceSection from "@/components/Work-Experience-Section";
import FormSection from "@/components/Form-Section";
import { useEffect } from "react";
import { useAboutStore } from "@/store/useAboutStore";
import { aboutService } from "@/services/about.service";

const page = () => {
  const { aboutMe, setAboutMe } = useAboutStore();

  useEffect(() => {
    fetchAboutMe();
  }, []);

  const fetchAboutMe = async () => {
    try {
      const data = await aboutService.getAboutMe();
      setAboutMe(data);
    } catch (error) {
      console.error("Failed to fetch about me", error);
    }
  };

  const leadText = aboutMe?.lead_text || "Designing digital experiences...";
  const descriptionText = aboutMe?.description || "I am a product designer...";
  const paragraphs = descriptionText.split('\n').filter((p: string) => p.trim() !== '');
  return (
    <div className="about-me-page">
      <div className="about-images-container">
        <div className="left-image">
          <Image
            src="/assets/left-side.png"
            alt="Left side portrait"
            width={240}
            height={300}
            className="about-image"
            priority
          />
        </div>
        <div className="right-image">
          <Image
            src="/assets/right-side.png"
            alt="Right side portrait"
            width={240}
            height={300}
            className="about-image"
            priority
          />
        </div>
      </div>

      <section className="about-me">
        <p className="about-me-lead">
          {leadText}
        </p>

        <div className="about-me-desc">
          {paragraphs.map((p: string, index: number) => (
            <p key={index}>{p}</p>
          ))}
        </div>
      </section>

      <PhotoSection />
      <WorkExperienceSection homepage={false} />
      <FormSection />
    </div>
  );
};

export default page;
