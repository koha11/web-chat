import axios from 'axios';
import Cookies from 'js-cookie';

const API_HOST = import.meta.env.VITE_API_HOST; // Dùng cho Vite
const API_PORT = import.meta.env.VITE_API_PORT; // Dùng cho Vite
const API_URL = 'http://' + API_HOST + ':' + API_PORT;

// Tạo một instance của axios để dễ cấu hình
const apiClient = axios.create({
  baseURL: API_URL, // Thay bằng API thực tế của bạn
  headers: {
    'Content-Type': 'application/json',
    credentials: 'include',
  },
});

// Hàm GET request
export const getData = async (endpoint: string, params = {}) => {
  try {
    apiClient.interceptors.request.use((config) => {
      const token = Cookies.get('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    const response = await apiClient.get(endpoint, { params });

    if (response.data.status || response.data.status == 0)
      window.location.href = 'http://' + window.location.host + '/login';

    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

// Hàm POST request
export const postData = async (endpoint: string, data: object) => {
  try {
    const response = await apiClient.post(endpoint, data);
    return response.data;
  } catch (error) {
    console.error('Error posting data:', error);
    throw error;
  }
};
