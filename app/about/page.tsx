import Image from "next/image";
import "./page.css";
import PhotoSection from "@/components/Photo-Section";
import WorkExperienceSection from "@/components/Work-Experience-Section";
import FormSection from "@/components/Form-Section";

const page = () => {
  return (
    <div className="about-me-page">
      <div className="about-images-container">
        <div className="left-image">
          <Image
            src="/assets/left-side.png"
            alt="Left side portrait"
            width={250}
            height={250}
            className="about-image"
            priority
          />
        </div>
        <div className="right-image">
          <Image
            src="/assets/right-side.png"
            alt="Right side portrait"
            width={250}
            height={250}
            className="about-image"
            priority
          />
        </div>
      </div>

      <section className="about-me">
        <p>
          Green Potentia is a Nigerian renewable energy company with a bold
          mission: to end power instability in Nigeria through affordable,
          accessible solar energy solutions. They are not just a product-based
          business; they are building a movement around energy education,
          practical technology, and community empowerment.
        </p>

        <span>
          Planning an event in Nigeria is a headache. Most celebrations —
          birthdays, link-ups, housewarmings, engagements — are supposed to be
          joyful, but they often felt like logistical nightmares. Existing tools
          never really fit the way we do things. They felt stiff, generic, far
          removed from how Nigerians actually plan and celebrate, or just
          incomplete. As a culture, we love to party. But the people organizing
          these moments, from brides and planners to friends hosting something
          small for their guys, were dealing with stress that quietly stole from
          the joy they were trying to create. We wanted to change that. Not just
          by removing friction for people who already plan, but by lowering the
          barrier to entry so anyone could decide to host something without
          fear. Our goal was to simplify the entire process — planning,
          collaboration, payments, tracking, vendor sourcing — while keeping all
          the energy, color and magic that makes Nigerian celebrations what they
          are. We wanted a planning experience that felt vibrant, shareable and
          fun, without losing clarity or control. Planning an event in Nigeria
          is a headache. Most celebrations — birthdays, link-ups, housewarmings,
          engagements — are supposed to be joyful, but they often felt like
          logistical nightmares. Existing tools never really fit the way we do
          things. They felt stiff, generic, far removed from how Nigerians
          actually plan and celebrate, or just incomplete. As a culture, we love
          to party. But the people organizing these moments, from brides and
          planners to friends hosting something small for their guys, were
          dealing with stress that quietly stole from the joy they were trying
          to create. We wanted to change that. Not just by removing friction for
          people who already plan, but by lowering the barrier to entry so
          anyone could decide to host something without fear. Our goal was to
          simplify the entire process — planning, collaboration, payments,
          tracking, vendor sourcing — while keeping all the energy, color and
          magic that makes Nigerian celebrations what they are. We wanted a
          planning experience that felt vibrant, shareable and fun, without
          losing clarity or control.
        </span>
      </section>

      <PhotoSection />
      <WorkExperienceSection />
      <FormSection />
    </div>
  );
};

export default page;
