import axios from "axios";
import { useAuthStore } from "../store/authStore";
import { showToast } from "../utils/toast";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add token
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;
    // Don't intercept 401s for login/signup endpoints
    if (
      error.response?.status === 401 &&
      !originalRequest.url?.includes("/api/auth/signin") &&
      !originalRequest.url?.includes("/api/auth/signup")
    ) {
      useAuthStore.getState().clearAuth();
      showToast.warning("Your session has expired. Please log in again.");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default api;
