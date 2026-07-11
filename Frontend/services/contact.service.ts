import api from "../api/axios-instance";

export interface ContactMessage {
  name: string;
  email: string;
  message: string;
}

export const contactService = {
  async sendMessage(payload: ContactMessage): Promise<void> {
    await api.post("/api/contact", payload);
  },
};
