import "./page.css";

export const metadata = {
  title: "Resume - VO Fatoki",
  description: "View my professional resume.",
  alternates: {
    canonical: "/resume",
  },
};

import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";

export default function ResumePage() {
  return (
    <ScrollReveal className="resume-page">
      <h1>COMING SOON</h1>
      <p>Kindly check back soon, I'm still writing</p>
    </ScrollReveal>
  );
}
