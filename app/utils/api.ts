// Utils/api.ts
import axios from "axios";

const API_BASE_URL = "http://3.142.142.153:5000/api";

// Instancia global de Axios con el token
const axiosInstance = axios.create({ baseURL: API_BASE_URL });

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default axiosInstance;
