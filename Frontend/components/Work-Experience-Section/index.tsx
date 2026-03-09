import Image from "next/image";
import briefcase from "@public/assets/briefcase.png";
import WorkExperienceBox from "../Work-Experience-Box/Work-Experience-Box";
import "./index.css";
import { workExperience } from "@/constants/default";

const WorkExperienceSection = () => {
  return (
    <div className="work-experience-section">
      <h1>
        <Image src={briefcase} alt="Briefcase" />
        WORK EXPERIENCE
      </h1>

      <div className="work-experience-list">
        {workExperience.map((workExperience, index) => (
          <WorkExperienceBox
            key={index}
            type={workExperience.type}
            date={workExperience.date}
            role={workExperience.role}
            company={workExperience.company}
            description={workExperience.description}
          />
        ))}
      </div>
    </div>
  );
};

export default WorkExperienceSection;
