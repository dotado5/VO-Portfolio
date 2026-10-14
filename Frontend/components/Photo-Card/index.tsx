"use client";

import "./index.css";
import { motion } from "motion/react";
import { fadeInUp } from "@/utils/motion";

const PhotoCard = ({ imageUrl }: { imageUrl?: string }) => {
  return (
    <motion.div
      variants={fadeInUp}
      className="photo-card"
      style={{ overflow: "hidden", position: "relative" }}
    >
      {imageUrl && (
        <img 
          src={imageUrl} 
          alt="Gallery image" 
          style={{ width: "100%", height: "100%", objectFit: "cover" }} 
        />
      )}
    </motion.div>
  );
};

export default PhotoCard;
