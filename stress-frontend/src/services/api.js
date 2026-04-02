import axios from "axios";

const API = axios.create({
  baseURL: "http://192.168.1.19:8000",
});

// Add token automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;