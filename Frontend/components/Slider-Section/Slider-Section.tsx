"use client";

import { useEffect } from "react";
import magicPen from "@public/assets/magicpen.svg";
import Image from "next/image";
import "./Slider-Section.css";
import SliderBox from "../Slider-Box/Slider-Box";
import InfiniteSlider from "../Infinite-Slider/Infinite-Slider";
import { motion } from "motion/react";
import { useSliderStore } from "@/store/useSliderStore";
import { Loader2 } from "lucide-react";

const SliderSection = () => {
  const { images, isLoading, fetchImages } = useSliderStore();

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  return (
    <div className="slider-section">
      <motion.h1
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="exploration"
      >
        <Image src={magicPen} alt="magicPen" className="w-5 h-5" />
        RECENT EXPLORATIONS
      </motion.h1>

      <InfiniteSlider duration={15}>
        {isLoading && images.length === 0 ? (
          <div className="flex justify-center items-center w-full h-[233px]">
            <Loader2 className="animate-spin text-gray-400" />
          </div>
        ) : (
          images.map((img) => (
            <SliderBox key={`img-${img.id}`} imageUrl={img.image_url} />
          ))
        )}
      </InfiniteSlider>
    </div>
  );
};

export default SliderSection;
