import SelectedWorkBox from "../Selected-Work-Box/Selected-Work-Box";
import folder from "@public/assets/folder.png";
import Image from "next/image";
import "./Selected-Work-Section.css";

const projects = [
  {
    title: "App Store Landing Page Redesign",
    description:
      "Redesigned the App Store landing page to enhance user engagement, focusing on aesthetic appeal and discoverability.",
    date: "January '25",
    link: "#",
    imageSrc: "",
  },
  {
    title: "App Store Landing Page Redesign",
    description:
      "Redesigned the App Store landing page to enhance user engagement, focusing on aesthetic appeal and discoverability.",
    date: "January '25",
    link: "#",
    reverse: true,
    imageSrc: "",
  },
  {
    title: "App Store Landing Page Redesign",
    description:
      "Redesigned the App Store landing page to enhance user engagement, focusing on aesthetic appeal and discoverability.",
    date: "January '25",
    link: "#",
    imageSrc: "",
  },
  {
    title: "App Store Landing Page Redesign",
    description:
      "Redesigned the App Store landing page to enhance user engagement, focusing on aesthetic appeal and discoverability.",
    date: "January '25",
    link: "#",
    reverse: true,
    imageSrc: "",
  },
];

const SelectedWorkSection = () => {
  return (
    <section className="selected-work-section">
      <div className="selected-work-header">
        <Image src={folder} alt="folder" className="selected-work-folder" />
        <h2 className="selected-work-section-title">Selected Works</h2>
      </div>

      <div className="selected-work-list">
        {projects.map((project, index) => (
          <SelectedWorkBox key={index} {...project} />
        ))}
      </div>
    </section>
  );
};

export default SelectedWorkSection;
