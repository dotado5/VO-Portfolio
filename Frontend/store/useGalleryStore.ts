import { create } from "zustand";
import { GalleryImage } from "../types/gallery.type";

interface GalleryState {
  images: GalleryImage[];
  isLoading: boolean;
  error: string | null;
  setImages: (data: GalleryImage[]) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useGalleryStore = create<GalleryState>((set) => ({
  images: [],
  isLoading: false,
  error: null,
  setImages: (data) => set({ images: data }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
