"use client";

import Image from "next/image";
import "./index.css";
import exportIcon from "@public/assets/export-icon.png";
import { useProjectStore } from "@/store/useProjectStore";
import { useEffect, useState } from "react";

import { motion } from "motion/react";
import { fadeInUp, staggerContainer } from "@/utils/motion";

const Header = () => {
  const selectedProject = useProjectStore((state) => state.selectedProject);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const title =
    (mounted && selectedProject?.title) ||
    "Internet accessibility for mobile adventurers.";
  const date =
    mounted && selectedProject?.delivery_date
      ? new Date(selectedProject.delivery_date)
          .toLocaleDateString("en-US", { month: "short", year: "numeric" })
          .toUpperCase()
      : "JANUARY '25";

  return (
    <motion.header
      className="work-details-header"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <motion.div className="header-left" variants={fadeInUp}>
        <div className="project-date">{date}</div>
        <h1 className="project-title">{title}</h1>
        {mounted && selectedProject?.live_site_url && (
          <a
            href={selectedProject.live_site_url}
            target="_blank"
            rel="noopener noreferrer"
            className="live-site-link"
          >
            VISIT LIVE SITE
            <Image src={exportIcon} alt="" className="live-site-icon" />
          </a>
        )}
      </motion.div>

      <motion.div className="header-right" variants={fadeInUp}>
        <div className="info-block">
          <h3 className="info-label">ROLE:</h3>
          <p className="info-value">
            {(mounted && selectedProject?.role) || "Product Designer"}
          </p>
        </div>

        <div className="info-block">
          <h3 className="info-label">SKILLS APPLIED:</h3>
          <ul className="skills-list">
            {mounted && selectedProject?.skills?.length ? (
              selectedProject.skills.map((skill, index) => (
                <li key={index}>{skill}</li>
              ))
            ) : (
              <>
                <li>Research</li>
                <li>UI Design</li>
                <li>Prototyping</li>
                <li>UX writing.</li>
              </>
            )}
          </ul>
        </div>
      </motion.div>
    </motion.header>
  );
};

export default Header;
