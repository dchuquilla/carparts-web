import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://dev-api.quientiene.com/api/v1', // Replace with your API base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => response, // Pass through successful responses
  (error: import('axios').AxiosError) => {
    if (error.response?.status === 401) {
      // Redirect to the sign-in page
      console.error('AXIOS API error:', error.response?.status, error);
      window.location.href = '/signin';
    }
    return Promise.reject(error); // Pass the error to the caller
  }
);

export default axiosInstance;