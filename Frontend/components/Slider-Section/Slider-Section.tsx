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
import { usePathname } from "next/navigation";

interface SliderSectionProps {
  images?: string[];
}

const SliderSection = ({ images: projectSliderImages }: SliderSectionProps) => {
  const { images: globalImages, isLoading, fetchImages } = useSliderStore();
  const pathName = usePathname();
  const isProjectPage = pathName.includes("/project");

  useEffect(() => {
    if (!isProjectPage) {
      fetchImages();
    }
  }, [fetchImages, isProjectPage]);

  const imagesToDisplay = isProjectPage
    ? projectSliderImages
    : globalImages.map((img) => img.image_url);

  return (
    <div className={`slider-section ${globalImages.length > 0 ? "" : "mt-5"}`}>
      <motion.h1
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="exploration"
      >
        {isProjectPage ? (
          ""
        ) : (
          <Image src={magicPen} alt="magicPen" className="w-5 h-5" />
        )}
        {isProjectPage ? "" : "RECENT EXPLORATIONS"}
      </motion.h1>

      {imagesToDisplay && imagesToDisplay.length > 0 && (
        <InfiniteSlider duration={15}>
          {isLoading && globalImages.length === 0 ? (
            <div className="flex justify-center items-center w-full h-[233px]">
              <Loader2 className="animate-spin text-gray-400" />
            </div>
          ) : (
            imagesToDisplay.map((url, index) => (
              <SliderBox key={`img-${index}`} imageUrl={url} />
            ))
          )}
        </InfiniteSlider>
      )}
    </div>
  );
};

export default SliderSection;
