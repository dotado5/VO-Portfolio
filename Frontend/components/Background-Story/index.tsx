import "./index.css";

interface ContentItem {
  text: string;
  isBold?: boolean;
}

interface ProjectSectionProps {
  title: string;
  content: ContentItem[];
}

const ProjectSection = ({ title, content }: ProjectSectionProps) => {
  return (
    <section className="project-section">
      <div className="section-title-wrapper">
        <h2 className="section-title">{title}</h2>
      </div>
      <div className="section-content">
        {content.map((item, index) => (
          <p
            key={index}
            className={`content-paragraph ${item.isBold ? "font-bold" : ""}`}
          >
            {item.text}
          </p>
        ))}
      </div>
    </section>
  );
};

export default ProjectSection;
