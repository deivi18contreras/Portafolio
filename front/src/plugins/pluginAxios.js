import axios from "axios";
import { useAuthStore } from "../store/Auth.js";

const axiosInstance = axios.create({
  baseURL: "https://backend-2-6hda.onrender.com/api/login",
  headers: {
    "Content-Type": "application/json"
  }
});

axiosInstance.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore();
    const token = authStore.token;

    if (token) {
      config.headers["x-token"] = token;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;