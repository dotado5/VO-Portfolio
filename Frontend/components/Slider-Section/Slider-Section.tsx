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

import { fadeInUp, defaultViewport, smoothEase } from "@/utils/motion";

interface SliderSectionProps {
  images?: string[];
  initialImages?: string[];
}

const SliderSection = ({
  images: projectSliderImages,
  initialImages,
}: SliderSectionProps) => {
  const { images: globalImages, isLoading, fetchImages } = useSliderStore();
  const pathName = usePathname();
  const isProjectPage = pathName.includes("/project");

  useEffect(() => {
    if (!isProjectPage && (!initialImages || initialImages.length === 0)) {
      fetchImages();
    }
  }, [fetchImages, isProjectPage, initialImages]);

  const globalUrls = globalImages.map((img) => img.image_url);
  const imagesToDisplay = isProjectPage
    ? projectSliderImages
    : globalUrls.length > 0
    ? globalUrls
    : initialImages;

  return (
    <div className="slider-section">
      <motion.h2
        initial="hidden"
        whileInView="visible"
        viewport={defaultViewport}
        variants={fadeInUp}
        className="exploration"
      >
        {isProjectPage ? (
          ""
        ) : (
          <Image
            src={magicPen}
            alt=""
            aria-hidden="true"
            className="w-5 h-5"
          />
        )}
        {isProjectPage ? "" : "RECENT EXPLORATIONS"}
      </motion.h2>

      {imagesToDisplay && imagesToDisplay.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={defaultViewport}
          transition={{ duration: 0.6, ease: smoothEase, delay: 0.1 }}
        >
          <InfiniteSlider duration={50}>
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
        </motion.div>
      )}
    </div>
  );
};

export default SliderSection;
