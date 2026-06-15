import api from "../api/api";
import { AuthDto, AuthResponse } from "../types/auth.type";
import { useAuthStore } from "../store/authStore";

export const AuthService = {
  async signUp(dto: AuthDto): Promise<AuthResponse> {
    const { data } = await api.post("/api/auth/signup", dto);
    useAuthStore.getState().setAuth(data);

    return data;
  },

  async signIn(dto: AuthDto): Promise<AuthResponse> {
    const { data } = await api.post("/api/auth/signin", {
      email: dto.email,
      password: dto.password,
    });

    useAuthStore.getState().setAuth(data);
    return data;
  },

  async signOut() {
    try {
      await api.post("/api/auth/signout");
    } finally {
      useAuthStore.getState().clearAuth();
    }
  },

  getAuthHeader() {
    const token = useAuthStore.getState().token;
    return token ? { Authorization: `Bearer ${token}` } : {};
  },

  getToken() {
    return useAuthStore.getState().token;
  },
};
