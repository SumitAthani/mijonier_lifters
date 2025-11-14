// src/lib/apiClient.ts
import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  timeout: 15000,
  // withCredentials: true, // optional
});

// 🔹 Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    // const token = localStorage.getItem("token");
    // if (token) {
    //   config.headers["Authorization"] = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🔹 Response Interceptor
apiClient.interceptors.response.use(
  (response) => response.data, // always return only data
  (error) => {
    const status = error?.response?.status;

    if (status === 401) {
      // Token expired
      console.warn("Unauthorized — Redirecting to login");
      // logout logic here
    }

    if (status === 500) {
      console.error("Server Error");
    }

    return Promise.reject(error);
  }
);

export default apiClient;
