import AboutClient from "./AboutClient";
import { getAboutMe, getExperiences } from "@/services/server-queries";

export const revalidate = 60;

export default async function AboutPage() {
  const [aboutData, experiences] = await Promise.all([
    getAboutMe(),
    getExperiences(),
  ]);

  return (
    <AboutClient
      initialAbout={aboutData}
      initialExperiences={experiences}
    />
  );
}
