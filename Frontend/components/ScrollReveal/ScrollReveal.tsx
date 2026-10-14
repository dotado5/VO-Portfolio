"use client";

import React from "react";
import { motion, useReducedMotion } from "motion/react";
import { smoothEase } from "@/utils/motion";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  yOffset?: number;
  direction?: "up" | "down" | "none";
  viewportMargin?: string;
  viewportOnce?: boolean;
}

export default function ScrollReveal({
  children,
  className = "",
  delay = 0,
  duration = 0.55,
  yOffset = 20,
  direction = "up",
  viewportMargin = "-40px",
  viewportOnce = true,
}: ScrollRevealProps) {
  const shouldReduceMotion = useReducedMotion();

  const getInitialY = () => {
    if (shouldReduceMotion || direction === "none") return 0;
    if (direction === "down") return -yOffset;
    return yOffset;
  };

  return (
    <motion.div
      className={className}
      initial={{
        opacity: 0,
        y: getInitialY(),
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: viewportOnce,
        margin: viewportMargin,
      }}
      transition={{
        duration: shouldReduceMotion ? 0.2 : duration,
        delay,
        ease: smoothEase,
      }}
    >
      {children}
    </motion.div>
  );
}
