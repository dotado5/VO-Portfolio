"use client";

import Image from "next/image";
import "./page.css";
import PhotoSection from "@/components/Photo-Section";
import WorkExperienceSection from "@/components/Work-Experience-Section";
import FormSection from "@/components/Form-Section";
import { useEffect } from "react";
import { useAboutStore } from "@/store/useAboutStore";
import { aboutService } from "@/services/about.service";
import { motion } from "motion/react";
import { fadeInUp, staggerContainer } from "@/utils/motion";

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

  const leadText = aboutMe?.lead_text || "";
  const descriptionText = aboutMe?.description || "";
  const paragraphs = descriptionText.split('\n').filter((p: string) => p.trim() !== '');

  return (
    <div className="about-me-page">
      <motion.div
        className="about-images-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
      >
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
      </motion.div>

      {(leadText || paragraphs.length > 0) && (
        <motion.section
          className="about-me"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          variants={staggerContainer}
        >
          {leadText && (
            <motion.p className="about-me-lead" variants={fadeInUp}>
              {leadText}
            </motion.p>
          )}

          {paragraphs.length > 0 && (
            <motion.div className="about-me-desc" variants={staggerContainer}>
              {paragraphs.map((p: string, index: number) => (
                <motion.p key={index} variants={fadeInUp}>
                  {p}
                </motion.p>
              ))}
            </motion.div>
          )}
        </motion.section>
      )}

      <PhotoSection />
      <WorkExperienceSection homepage={false} />
      <FormSection />
    </div>
  );
};

export default page;
