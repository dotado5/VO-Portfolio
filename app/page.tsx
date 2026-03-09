import Hero from "@/components/Hero/Hero";
import SliderSection from "@/components/Slider-Section/Slider-Section";
import SelectedWorkSection from "@/components/Selected-Work/Selected-Work-Section";
import WorkExperienceSection from "@/components/Work-Experience-Section";
import FormSection from "@/components/Form-Section";

export default function Home() {
  return (
    <>
      <Hero />
      <SliderSection />
      <SelectedWorkSection />
      <WorkExperienceSection />
      <FormSection />
    </>
  );
}
