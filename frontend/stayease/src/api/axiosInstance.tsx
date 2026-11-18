import axios from "axios";

// ─── ONE place to change your backend URL forever ───────────────────────────
const axiosInstance = axios.create({
  baseURL: "http://localhost:8080", // Your API Gateway
});

// ─── Interceptor: runs before EVERY request automatically ───────────────────
// You never manually add Authorization header anywhere else in the app
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // grab saved token

  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // attach it
  }

  return config; // let the request go through
});

export default axiosInstance;