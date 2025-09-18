/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error: import('axios').AxiosError) => {
    if (error.response?.status === 401) {
      const currentUrl = window.location.href;
      const requestPrefix = `${import.meta.env.VITE_REQUEST_PREFIX}/requests/`;
      // Regex: alphanumeric token, 8-64 chars (adjust as needed)
      const tokenRegex = /^[a-zA-Z0-9]{8,64}$/;
      if ( currentUrl.startsWith(requestPrefix) ) {
        const token = currentUrl.substring(requestPrefix.length);
        if (tokenRegex.test(token)) {
          // Valid request URL with token, do NOT redirect
          return Promise.reject(error);
        } else {
          window.location.href = '/signin';
        }
      }
      const signinPrefix = `${import.meta.env.VITE_REQUEST_PREFIX}/signin`;
      if ( currentUrl.startsWith(signinPrefix) ) {
        return Promise.reject(error);
      }
      // Otherwise, redirect
      window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;