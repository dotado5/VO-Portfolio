import axios from "axios";

const api = axios.create({
  // Call the Next.js route handlers under /api directly on the same origin,
  // rather than through an external base URL.
  baseURL: "",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
