"use client";

import magicPen from "@public/assets/magicpen.svg";
import Image from "next/image";
import "./Slider-Section.css";
import SliderBox from "../Slider-Box/Slider-Box";
import InfiniteSlider from "../Infinite-Slider/Infinite-Slider";
import { motion } from "motion/react";

const SliderSection = () => {
  const color = ["bg-[#FFFFFF]", "bg-[#6B1616]", "bg-[#000000]"];

  return (
    <div className="slider-section">
      <motion.h1
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="exploration"
      >
        <Image src={magicPen} alt="magicPen" className="w-6 h-6" />
        RECENT EXPLORATIONS
      </motion.h1>

      <InfiniteSlider duration={15}>
        {color.map((color) => (
          <SliderBox key={color} color={color} />
        ))}
        {color.map((color) => (
          <SliderBox key={color} color={color} />
        ))}
      </InfiniteSlider>
    </div>
  );
};

export default SliderSection;
