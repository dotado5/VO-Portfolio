"use client";

import "./index.css";
import PhotoCard from "../Photo-Card";
import folder from "@public/assets/folder.png";
import Image from "next/image";
import { useEffect } from "react";
import { useGalleryStore } from "@/store/useGalleryStore";
import { galleryService } from "@/services/gallery.service";

const PhotoSection = () => {
  const { images, setImages } = useGalleryStore();

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const data = await galleryService.getAllImages();
      setImages(data || []);
    } catch (error) {
      console.error("Failed to load gallery images", error);
    }
  };

  // If no images are uploaded yet, we show some empty placeholders to preserve the layout aesthetics
  const displayItems = images.length > 0 
    ? images 
    : Array.from({ length: 12 }).map((_, i) => ({ id: i, image_url: "" }));

  return (
    <div className="photo-section">
      <h1 className="my-photo">
        <Image src={folder} alt="folder" className="w-5 h-5 object-contain" />
        MY PHOTO WALL
      </h1>

      <div className="photos">
        {displayItems.map((item, index) => (
          <PhotoCard key={item.id || index} imageUrl={item.image_url} />
        ))}
      </div>
    </div>
  );
};

export default PhotoSection;
