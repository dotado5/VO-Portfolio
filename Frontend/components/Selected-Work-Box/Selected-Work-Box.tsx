"use client";

import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import "./Selected-Work-Box.css";
import { useWorkStore } from "@/store/useWorkStore";
import { useRouter } from "next/navigation";

interface SelectedWorkBoxProps {
  title: string;
  description: string;
  date: string;
  link: string;
  imageSrc?: string;
  reverse?: boolean;
}

const SelectedWorkBox = ({
  title,
  description,
  date,
  link,
  imageSrc,
  reverse = false,
}: SelectedWorkBoxProps) => {
  const setSelectedWork = useWorkStore((state) => state.setSelectedWork);
  const router = useRouter();

  const handleClick = () => {
    setSelectedWork({ title, description, date, link, imageSrc });
    router.push("/project");
  };

  return (
    <div className={`selected-work-box ${reverse ? "reverse" : ""}`}>
      {/* Image container */}
      <div className="selected-work-image-container">
        {imageSrc && (
          <Image
            src={imageSrc}
            alt={title}
            fill
            className="selected-work-image"
          />
        )}
      </div>

      {/* Content */}
      <div className={`selected-work-content ${reverse ? "reverse" : ""}`}>
        <div className="selected-work-date-badge">{date}</div>
        <h3 className="selected-work-title">{title}</h3>
        <p className="selected-work-description">{description}</p>
        <button className="selected-work-link" onClick={handleClick}>
          Read Case Study
          <div className="selected-work-link-icon">
            <ArrowUpRight size={14} strokeWidth={3} />
          </div>
        </button>
      </div>
    </div>
  );
};

export default SelectedWorkBox;
