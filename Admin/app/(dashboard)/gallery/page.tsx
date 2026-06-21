"use client";

import React, { useEffect, useState, useRef } from "react";
import { Plus, Trash, Loader2, ImagePlus } from "lucide-react";
import { GalleryImage } from "@/types/gallery.type";
import { GalleryService } from "@/services/gallery.service";
import { showToast } from "@/utils/toast";

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      setIsLoading(true);
      const data = await GalleryService.findAll();
      setImages(data);
    } catch (error) {
      console.error("Failed to load gallery images:", error);
      showToast.error("Failed to load photo gallery.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      setIsUploading(true);

      try {
        for (const file of files) {
          const newImage = await GalleryService.upload(file);
          setImages((prev) => [newImage, ...prev]);
        }
        showToast.success("Photos uploaded successfully!");
      } catch (error) {
        console.error("Failed to upload photos:", error);
        showToast.error("Failed to upload one or more photos.");
      } finally {
        setIsUploading(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    }
  };

  const handleDelete = async (id: number, url: string) => {
    if (!window.confirm("Are you sure you want to delete this photo?")) {
      return;
    }

    try {
      await GalleryService.remove(id, url);
      setImages((prev) => prev.filter((img) => img.id !== id));
      showToast.success("Photo deleted.");
    } catch (error) {
      console.error("Failed to delete photo:", error);
      showToast.error("Failed to delete photo.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full min-h-[500px]">
        <Loader2 className="animate-spin text-muted" size={48} />
      </div>
    );
  }

  return (
    <div style={{ width: "100%", maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: "bold", margin: 0 }}>Photo Gallery</h1>
        
        <div>
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
            {isUploading ? <Loader2 size={20} className="animate-spin" /> : <Plus size={20} />}
            {isUploading ? "Uploading..." : "Upload Photos"}
          </button>
        </div>
      </div>

      {images.length === 0 ? (
        <div className="glass" style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "4rem 2rem", borderRadius: "var(--radius-lg)", border: "1px dashed var(--glass-border)", textAlign: "center" }}>
          <ImagePlus size={48} style={{ color: "var(--text-muted)", marginBottom: "1rem" }} />
          <h3 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>No photos uploaded yet</h3>
          <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
            Upload images to be displayed in the Photo Wall section on your website.
          </p>
          <button className="btn btn-primary" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
            Upload First Photo
          </button>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1.5rem" }}>
          {images.map((img) => (
            <div key={img.id} className="glass" style={{ position: "relative", borderRadius: "var(--radius-md)", overflow: "hidden", aspectRatio: "1/1", boxShadow: "var(--shadow-sm)" }}>
              <img src={img.image_url} alt="Gallery" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              <button
                onClick={() => handleDelete(img.id, img.image_url)}
                className="btn"
                style={{ position: "absolute", top: "0.5rem", right: "0.5rem", padding: "0.5rem", backgroundColor: "rgba(0, 0, 0, 0.6)", color: "var(--error)", border: "none", borderRadius: "50%", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.2s ease" }}
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
