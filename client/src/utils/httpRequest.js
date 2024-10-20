import axios from "axios";

const httpRequest = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export default httpRequest;

// Add a request interceptor
httpRequest.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    const token = localStorage.getItem("accessToken");

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
httpRequest.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data

    return response.data ? response.data : response;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    // return Promise.reject(error);
    return error.response.data ? error.response.data : error;
  }
);
