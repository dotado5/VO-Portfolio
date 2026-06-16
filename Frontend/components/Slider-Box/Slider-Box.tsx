"use client";

import { motion } from "motion/react";
import "./Slider-Box.css";

interface SliderBoxProps {
  color?: string;
  imageUrl?: string;
}

const SliderBox = ({ color, imageUrl }: SliderBoxProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={` ${color || ""} sliderBox`}
      style={{ overflow: "hidden", padding: 0 }}
    >
      {imageUrl && (
        <img 
          src={imageUrl} 
          alt="Slider Item" 
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      )}
    </motion.div>
  );
};

export default SliderBox;
