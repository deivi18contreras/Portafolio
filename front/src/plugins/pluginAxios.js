import axios from 'axios';
import { useAuthStore } from '../store/Auth.js'; // Asegúrate de que este es el nombre de tu store

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000/api',
  //baseURL: 'https://backend-production-4304.up.railway.app/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para añadir el header x-token en cada petición
axiosInstance.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore();
    const token = authStore.token;

    if (token) {
      // Configuramos el header personalizado solicitado
      config.headers['x-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;