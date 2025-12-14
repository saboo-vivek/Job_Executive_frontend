import axios from "axios";

const API_URL = "http://localhost:4000";

const axiosInstance = axios.create({
  baseURL: API_URL,
});

// ✅ Attach token automatically
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // already "Bearer xxx" format from backend
  }
  return config;
});

// ✅ Auto logout on 401
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/"; // redirect to login
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
