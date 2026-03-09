"use client";

import Image from "next/image";
import "./index.css";
import smallPic from "@public/assets/small-pic.png";
import { useWorkStore } from "@/store/useWorkStore";
import { useEffect, useState } from "react";

const Header = () => {
  const selectedWork = useWorkStore((state) => state.selectedWork);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const title =
    (mounted && selectedWork?.title) ||
    "Internet accessibility for mobile adventurers.";
  const date = (mounted && selectedWork?.date) || "JANUARY '25";

  return (
    <header className="work-details-header">
      <div className="header-left">
        <div className="client-image-wrapper">
          <Image
            src={selectedWork?.imageSrc || smallPic}
            alt="Client"
            className="client-image"
            fill={!!selectedWork?.imageSrc}
          />
        </div>
        <h1 className="project-title">{title}</h1>
        <div className="project-date">{date}</div>
      </div>

      <div className="header-right">
        <div className="info-block">
          <h3 className="info-label">ROLE:</h3>
          <p className="info-value">Product Designer</p>
        </div>

        <div className="info-block">
          <h3 className="info-label">SKILLS APPLIED:</h3>
          <ul className="skills-list">
            <li>Research</li>
            <li>UI Design</li>
            <li>Prototyping</li>
            <li>UX writing.</li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;
