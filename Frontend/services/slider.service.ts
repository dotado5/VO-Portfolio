import api from "../api/axios-instance";
import { SliderImage } from "../types/slider.type";

export const sliderService = {
  async findAll(): Promise<SliderImage[]> {
    const response = await api.get<SliderImage[]>("/api/slider");
    return response.data;
  },
};
