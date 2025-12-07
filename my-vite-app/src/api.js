import axios from "axios";
import { loaderOff,loaderOn } from "./loderControl";


const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api",
});

// SHOW LOADER BEFORE REQUEST
API.interceptors.request.use((config) => {
  loaderOn();
  return config;
});

// HIDE LOADER AFTER RESPONSE
API.interceptors.response.use(
  (response) => {
    loaderOff();
    return response;
  },
  (error) => {
    loaderOff();
    return Promise.reject(error);
  }
);

export function setAuthToken(token) {
  if (token) {
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete API.defaults.headers.common["Authorization"];
  }
}

export default API;
