import "./Work-Experience-Box.css";

export interface WorkExperienceBoxProps {
  type: string;
  date: string;
  role: string;
  company: string;
  description: string;
}

const WorkExperienceBox = ({
  type,
  date,
  role,
  company,
  description,
}: WorkExperienceBoxProps) => {
  return (
    <div className="work-experience-box">
      <div className="work-experience-left">
        <span className="work-experience-type">{type}</span>
        <span className="work-experience-date">{date}</span>
      </div>
      <div className="work-experience-right">
        <h3 className="work-experience-title">
          {role} at {company}
        </h3>
        <p className="work-experience-description">{description}</p>
      </div>
    </div>
  );
};

export default WorkExperienceBox;
