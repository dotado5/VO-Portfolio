import api from "../api/axios-instance";

export const aboutService = {
  async getAboutMe(): Promise<any> {
    const response = await api.get("/api/about");
    return response.data;
  },
};
