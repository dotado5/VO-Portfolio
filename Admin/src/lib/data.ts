import { Project } from "../types/project.type";

export const dummyProjects: Project[] = [
  {
    id: 1001,
    title: "Venture Studio Portfolio",
    background_story:
      "A high-end portfolio for a venture studio to showcase their iconic ventures.",
    role: "Lead Developer",
    skills: ["React", "TypeScript", "GSAP", "CSS Modules"],
    problem:
      "Need a premium way to present multiple standalone products as a cohesive venture studio ecosystem.",
    strategy:
      "Implemented a stacking card animation and smooth transitions to create a luxurious feel.",
    takeaway:
      "Micro-interactions significantly enhance the premium feel of a site.",
    images: ["/projects/venture-studio-1.jpg"],
    delivery_date: "2024-02-15T12:00:00Z",
  },
  {
    id: 1002,
    title: "EcoTrack Analytics",
    background_story:
      "Sustainability monitoring platform for enterprise-level carbon footprint tracking.",
    role: "Frontend Architect",
    skills: ["Next.js", "D3.js", "Tailwind CSS", "React Query"],
    problem:
      "Large datasets were difficult to visualize and didn't provide actionable insights for decision-makers.",
    strategy:
      "Developed custom interactive dashboards and automated reporting tools.",
    takeaway: "User-centric data visualization is key for complex analytics.",
    images: ["/projects/ecotrack-1.jpg"],
    delivery_date: "2023-11-20T09:00:00Z",
  },
  {
    id: 1003,
    title: "Aura Home Automation",
    background_story:
      "A unified IoT control center for modern smart homes, focusing on intuitive UX.",
    role: "Product Designer & Developer",
    skills: ["React Native", "WebSockets", "Framer Motion", "Node.js"],
    problem:
      "Smart home apps often feel cluttered and technical, making them inaccessible to non-tech savvy users.",
    strategy:
      "Simplified the interface with a focus on 'Scenes' and minimalist control panels.",
    takeaway: "Simplification is often the hardest part of design.",
    images: ["/projects/aura-1.jpg"],
    delivery_date: "2024-01-10T15:30:00Z",
  },
];
