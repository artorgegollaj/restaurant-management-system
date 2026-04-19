import axios from 'axios';
import { authStore } from '../stores/AuthStore';

const http = axios.create({
  baseURL: 'http://localhost:8080/api'
});

http.interceptors.request.use((config) => {
  if (authStore.accessToken) {
    config.headers.Authorization = `Bearer ${authStore.accessToken}`;
  }
  return config;
});

let refreshing = null;

http.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response && error.response.status === 401 && !original._retry && authStore.refreshToken) {
      original._retry = true;
      try {
        refreshing = refreshing || authStore.refresh();
        await refreshing;
        refreshing = null;
        original.headers.Authorization = `Bearer ${authStore.accessToken}`;
        return http(original);
      } catch (e) {
        refreshing = null;
        authStore.logout();
        return Promise.reject(e);
      }
    }
    return Promise.reject(error);
  }
);

export default http;
