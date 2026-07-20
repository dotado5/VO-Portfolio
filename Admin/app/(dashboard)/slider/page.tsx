"use client";

import React, { useEffect, useState, useRef } from "react";
import { Plus, Trash, Loader2, ImagePlus, Shuffle } from "lucide-react";
import { SliderImage } from "@/types/slider.type";
import { SliderService } from "@/services/slider.service";
import { showToast } from "@/utils/toast";

export default function SliderPage() {
  const [images, setImages] = useState<SliderImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      setIsLoading(true);
      const data = await SliderService.findAll();
      setImages(data);
    } catch (error) {
      console.error("Failed to load slider images:", error);
      showToast.error("Failed to load slider images.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      setIsUploading(true);

      try {
        const startPos = images.length;
        for (let i = 0; i < files.length; i++) {
          const newImage = await SliderService.upload(files[i], startPos + i);
          setImages((prev) => [...prev, newImage]);
        }
        showToast.success("Images uploaded successfully!");
      } catch (error) {
        console.error("Failed to upload images:", error);
        showToast.error("Failed to upload one or more images.");
      } finally {
        setIsUploading(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    }
  };

  const handleDelete = async (id: number, url: string) => {
    if (!window.confirm("Are you sure you want to delete this image?")) {
      return;
    }

    try {
      await SliderService.remove(id, url);
      setImages((prev) => prev.filter((img) => img.id !== id));
      showToast.success("Image deleted successfully.");
    } catch (error) {
      console.error("Failed to delete image:", error);
      showToast.error("Failed to delete image.");
    }
  };

  const handleShuffle = async () => {
    if (images.length < 2 || isShuffling) return;

    // Fisher–Yates shuffle on a copy.
    const shuffled = [...images];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    const renumbered = shuffled.map((img, index) => ({
      ...img,
      position: index,
    }));

    const previous = images;
    setImages(renumbered); // optimistic

    try {
      setIsShuffling(true);
      await SliderService.updateOrder(renumbered.map((img) => img.id));
      showToast.success("Slider order shuffled!");
    } catch (error) {
      console.error("Failed to shuffle slider order:", error);
      setImages(previous); // revert to previous order
      showToast.error("Failed to save the shuffled order.");
    } finally {
      setIsShuffling(false);
    }
  };

  if (isLoading) {
    return (
      <div
        className="flex items-center justify-center w-full h-full min-h-[500px]"
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          minHeight: "500px",
        }}
      >
        <Loader2 className="animate-spin text-muted" size={48} />
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "2rem",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
        }}
      >
        <h1 style={{ fontSize: "2rem", fontWeight: "bold", margin: 0 }}>
          Global Slider
        </h1>

        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <button
            className="btn btn-secondary"
            onClick={handleShuffle}
            disabled={isShuffling || isUploading || images.length < 2}
            title={
              images.length < 2
                ? "Add at least 2 images to shuffle"
                : "Shuffle the order images appear in the slider"
            }
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              width: "auto",
            }}
          >
            {isShuffling ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <Shuffle size={20} />
            )}
            {isShuffling ? "Shuffling..." : "Shuffle Order"}
          </button>

          <input
            type="file"
            accept="image/*"
            multiple
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <button
            className="btn btn-primary"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
          >
            {isUploading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <Plus size={20} />
            )}
            {isUploading ? "Uploading..." : "Upload Images"}
          </button>
        </div>
      </div>

      {images.length === 0 ? (
        <div
          className="glass"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "4rem 2rem",
            textAlign: "center",
            borderRadius: "var(--radius-lg)",
            border: "1px dashed var(--glass-border)",
          }}
        >
          <ImagePlus
            size={48}
            style={{ color: "var(--text-muted)", marginBottom: "1rem" }}
          />
          <h3 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>
            No slider images yet
          </h3>
          <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
            Upload images to be displayed in the global slider on the frontend
            homepage.
          </p>
          <button
            className="btn btn-primary"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            Upload First Image
          </button>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {images.map((img) => (
            <div
              key={img.id}
              className="glass"
              style={{
                position: "relative",
                borderRadius: "var(--radius-md)",
                overflow: "hidden",
                aspectRatio: "4/3",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <img
                src={img.image_url}
                alt={`Slider ${img.id}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
              <button
                onClick={() => handleDelete(img.id, img.image_url)}
                className="btn"
                style={{
                  position: "absolute",
                  top: "0.5rem",
                  right: "0.5rem",
                  padding: "0.5rem",
                  backgroundColor: "rgba(0, 0, 0, 0.6)",
                  color: "var(--error)",
                  border: "none",
                  borderRadius: "50%",
                  backdropFilter: "blur(4px)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.8)")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.6)")
                }
              >
                <Trash size={18} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
