import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://dev-api.quientiene.com',
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
      const requestPrefix = 'https://dev-webs.quientiene.com/requests/';
      // Regex: alphanumeric token, 8-64 chars (adjust as needed)
      const tokenRegex = /^[a-zA-Z0-9]{8,64}$/;
      if (
        currentUrl.startsWith(requestPrefix)
      ) {
        const token = currentUrl.substring(requestPrefix.length);
        if (tokenRegex.test(token)) {
          // Valid request URL with token, do NOT redirect
          return Promise.reject(error);
        } else {
          window.location.href = '/signin';
        }
      }
      // Otherwise, redirect
      window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;