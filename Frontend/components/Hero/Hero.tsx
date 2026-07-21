"use client";

import Image from "next/image";
import "./Hero.css";
import heroImage from "@public/assets/hero-image.png";
import exportIcon from "@public/assets/export-icon.png";
import { motion } from "motion/react";
import { fadeInUp, staggerContainer } from "@/utils/motion";

const Hero = () => {
  const socials = [
    { name: "LINKEDIN", href: "#" },
    { name: "TWITTER", href: "#" },
    { name: "CONTRA", href: "#" },
  ];

  return (
    <motion.section
      className="hero"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      {/* Profile Image with tilted frame */}
      <motion.div
        className="profile-wrapper"
        initial={{ opacity: 0, scale: 0.94, rotate: -6 }}
        animate={{ opacity: 1, scale: 1, rotate: -3 }}
        transition={{ duration: 0.65, ease: [0.21, 0.47, 0.32, 0.98] }}
      >
        <Image
          src={heroImage}
          alt="Fatoki Victor Oluwabusayo"
          className="profile-image"
          priority
        />
      </motion.div>

      {/* Main Heading */}
      <motion.div className="hero-text" variants={staggerContainer}>
        <motion.h1 className="hero-title" variants={fadeInUp}>
          Hi, I'm Fatoki Victor Oluwabusayo.
          <span className="text-[#303030]">Product Designer</span>
        </motion.h1>

        {/* Description */}
        <motion.p className="hero-description" variants={fadeInUp}>
          I specialize in predicting what your users want before they do and
          designing it beautifully. So your product doesn&apos;t just look good,
          it sells better.
        </motion.p>

        {/* Role Details */}
        <motion.p className="hero-details" variants={fadeInUp}>
          <span className="font-semibold text-[#303030]">
            Product Designer &amp; Business Strategist
          </span>{" "}
          by day,{" "}
          <span className="font-semibold text-[#303030]">
            Gamer &amp; Arsenal fan
          </span>{" "}
          by Night
        </motion.p>

        {/* Social Links */}
        <motion.div className="social-links" variants={fadeInUp}>
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
        </motion.div>
      </motion.div>
    </motion.section>
  );
};

export default Hero;
