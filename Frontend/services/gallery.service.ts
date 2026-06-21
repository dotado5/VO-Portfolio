import api from "../api/axios-instance";
import { GalleryImage } from "../types/gallery.type";

export const galleryService = {
  async getAllImages(): Promise<GalleryImage[]> {
    const response = await api.get<GalleryImage[]>("/api/gallery");
    return response.data;
  },
};
