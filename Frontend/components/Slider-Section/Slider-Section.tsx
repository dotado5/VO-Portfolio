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

interface SliderSectionProps {
  images?: string[];
}

const SliderSection = ({ images: projectSliderImages }: SliderSectionProps) => {
  const { images: globalImages, isLoading, fetchImages } = useSliderStore();

  const hasProjectImages = projectSliderImages && projectSliderImages.length > 0;

  useEffect(() => {
    if (!hasProjectImages) {
      fetchImages();
    }
  }, [fetchImages, hasProjectImages]);

  const imagesToDisplay = hasProjectImages 
    ? projectSliderImages 
    : globalImages.map((img) => img.image_url);

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
        {hasProjectImages ? "PROJECT GALLERY" : "RECENT EXPLORATIONS"}
      </motion.h1>

      <InfiniteSlider duration={15}>
        {!hasProjectImages && isLoading && globalImages.length === 0 ? (
          <div className="flex justify-center items-center w-full h-[233px]">
            <Loader2 className="animate-spin text-gray-400" />
          </div>
        ) : (
          imagesToDisplay.map((url, index) => (
            <SliderBox key={`img-${index}`} imageUrl={url} />
          ))
        )}
      </InfiniteSlider>
    </div>
  );
};

export default SliderSection;
