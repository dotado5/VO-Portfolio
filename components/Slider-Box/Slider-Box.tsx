"use client";

import { motion } from "motion/react";
import "./Slider-Box.css";

const SliderBox = ({ color }: { color: string }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={` ${color} sliderBox`}
    ></motion.div>
  );
};

export default SliderBox;
