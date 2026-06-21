import api from "../api/axios-instance";

export const experienceService = {
  async getAllExperiences(): Promise<any[]> {
    const response = await api.get("/api/experience");
    return response.data;
  },
};
