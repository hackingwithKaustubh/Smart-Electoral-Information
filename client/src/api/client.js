import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://smart-electoral-information-zdp3.onrender.com/api',
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('civora_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || 'Request failed';
    const errorCode = error.response?.data?.errorCode;
    const status = error.response?.status;
    return Promise.reject({ message, errorCode, status, raw: error });
  }
);

export default api;
