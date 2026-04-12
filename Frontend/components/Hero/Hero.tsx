"use client";

import Image from "next/image";
import "./Hero.css";
import heroImage from "@public/assets/hero-image.png";
import exportIcon from "@public/assets/export-icon.png";

const Hero = () => {
  const socials = [
    { name: "LINKEDIN", href: "#" },
    { name: "TWITTER", href: "#" },
    { name: "CONTRA", href: "#" },
  ];

  return (
    <section className="hero">
      {/* Profile Image with tilted frame */}
      <div className="profile-wrapper">
        <Image
          src={heroImage}
          alt="Fatoki Victor Oluwabusayo"
          className="profile-image"
          priority
        />
      </div>

      {/* Main Heading */}
      <div className="hero-text">
        <h1 className="hero-title">
          Hi, I'm Fatoki Victor Oluwabusayo.
          <span className="text-[#303030]">Product Designer</span>
        </h1>

        {/* Description */}
        <p className="hero-description">
          I specialize in predicting what your users want before they do and
          designing it beautifully. So your product doesn&apos;t just look good,
          it sells better.
        </p>

        {/* Role Details */}
        <p className="hero-details">
          <span className="font-semibold text-[#303030]">
            Product Designer &amp; Business Strategist
          </span>{" "}
          by day,{" "}
          <span className="font-semibold text-[#303030]">
            Gamer &amp; Arsenal fan
          </span>{" "}
          by Night
        </p>

        {/* Social Links */}
        <div className="social-links">
          {socials.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="social-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              {link.name} <Image src={exportIcon} alt="Export Icon" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
