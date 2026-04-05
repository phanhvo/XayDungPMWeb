import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/", // đổi nếu BE khác port
});

// gắn token (sau này dùng)
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export default API; // 🔥 bắt buộc phải có