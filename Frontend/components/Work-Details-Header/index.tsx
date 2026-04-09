"use client";

import Image from "next/image";
import "./index.css";
import smallPic from "@public/assets/small-pic.png";
import { useProjectStore } from "@/store/useProjectStore";
import { useEffect, useState } from "react";

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
    <header className="work-details-header">
      <div className="header-left">
        <div className="client-image-wrapper">
          <Image
            src={(mounted && selectedProject?.images?.[0]) || smallPic}
            alt="Client"
            className="client-image"
            fill={!!(mounted && selectedProject?.images?.[0])}
          />
        </div>
        <h1 className="project-title">{title}</h1>
        <div className="project-date">{date}</div>
      </div>

      <div className="header-right">
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
      </div>
    </header>
  );
};

export default Header;
