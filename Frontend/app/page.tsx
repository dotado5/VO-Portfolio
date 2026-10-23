import Hero from "@/components/Hero/Hero";
import SliderSection from "@/components/Slider-Section/Slider-Section";
import SelectedWorkSection from "@/components/Selected-Work/Selected-Work-Section";
import WorkExperienceSection from "@/components/Work-Experience-Section";
import FormSection from "@/components/Form-Section";
import {
  getProjects,
  getExperiences,
  getSliderImages,
} from "@/services/server-queries";

export const revalidate = 60;

export default async function Home() {
  const [projects, experiences, sliderImages] = await Promise.all([
    getProjects(),
    getExperiences(),
    getSliderImages(),
  ]);

  return (
    <>
      <Hero />
      <SliderSection initialImages={sliderImages} />
      <SelectedWorkSection initialProjects={projects} />
      <WorkExperienceSection homepage={true} initialExperiences={experiences} />
      <FormSection />
    </>
  );
}
