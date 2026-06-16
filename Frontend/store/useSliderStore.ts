import { create } from "zustand";
import { SliderImage } from "../types/slider.type";
import { sliderService } from "../services/slider.service";

interface SliderState {
  images: SliderImage[];
  isLoading: boolean;
  error: string | null;
  fetchImages: () => Promise<void>;
}

export const useSliderStore = create<SliderState>((set) => ({
  images: [],
  isLoading: false,
  error: null,
  fetchImages: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await sliderService.findAll();
      set({ images: data, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : "Failed to fetch slider images", 
        isLoading: false 
      });
    }
  },
}));
