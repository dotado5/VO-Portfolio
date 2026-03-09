"use client";

import Image from "next/image";
import "./page.css";
import snapshot from "@public/assets/snapshot.png";
import Header from "@/components/Work-Details-Header";
import ProjectSection from "@/components/Background-Story";
import SliderBox from "@/components/Slider-Box/Slider-Box";
import FormSection from "@/components/Form-Section";
import { useWorkStore } from "@/store/useWorkStore";

const page = () => {
  const { selectedWork } = useWorkStore();
  console.log(selectedWork);

  const backgroundStoryContent = [
    {
      text: "Green Potentia is a Nigerian renewable energy company with a bold mission: to end power instability in Nigeria through affordable, accessible solar energy solutions. They are not just a product-based business; they are building a movement around energy education, practical technology, and community empowerment.",
      isBold: true,
    },
    {
      text: "This project focused on creating a robust digital presence to communicate their mission, showcase their offerings, and engage their target audience effectively.",
    },
  ];

  const problemContent = [
    {
      text: "Planning an event in Nigeria is a headache. Most celebrations — birthdays, link-ups, housewarmings, engagements — are supposed to be joyful, but they often felt like logistical nightmares. Existing tools never really fit the way we do things. They felt stiff, generic, far removed from how Nigerians actually plan and celebrate, or just incomplete.",
    },
    {
      text: "As a culture, we love to party. But the people organizing these moments, from brides and planners to friends hosting something small for their guys, were dealing with stress that quietly stole from the joy they were trying to create. We wanted to change that. Not just by removing friction for people who already plan, but by lowering the barrier to entry so anyone could decide to host something without fear.",
    },
    {
      text: "Our goal was to simplify the entire process — planning, collaboration, payments, tracking, vendor sourcing — while keeping all the energy, color and magic that makes Nigerian celebrations what they are. We wanted a planning experience that felt vibrant, shareable and fun, without losing clarity or control.",
    },
  ];

  const color = ["bg-[#FFFFFF]", "bg-[#6B1616]", "bg-[#000000]"];

  return (
    <div>
      <Header />
      <Image src={snapshot} alt={""} className="snapshot" />
      <ProjectSection
        title="BACKGROUND STORY"
        content={backgroundStoryContent}
      />

      <ProjectSection title="THE PROBLEM" content={problemContent} />

      <div className="slider">
        {color.map((color) => (
          <SliderBox key={color} color={color} />
        ))}
      </div>

      <ProjectSection title="DESIGN STRATEGY" content={problemContent} />
      <ProjectSection title="KEY TAKEAWAY" content={problemContent} />

      <Image src={snapshot} alt={""} className="snapshot" />

      <FormSection />
    </div>
  );
};

export default page;
