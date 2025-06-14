import axios from "axios";

const VITE_BASE_URL =
  import.meta.env.VITE_API_HOST + ":" + import.meta.env.VITE_API_PORT;

const httpRequest = axios.create({
  baseURL: VITE_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

httpRequest.interceptors.request.use(
  (config) => {
    // const token = localStorage.getItem("token");

    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => Promise.reject(error)
);

export default httpRequest;
