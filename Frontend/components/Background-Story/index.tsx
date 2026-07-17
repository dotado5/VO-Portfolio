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
          <div
            key={index}
            className={`content-prose ${item.isBold ? "content-prose--lead" : ""}`}
            dangerouslySetInnerHTML={{ __html: item.text || "" }}
          />
        ))}
      </div>
    </section>
  );
};

export default ProjectSection;
