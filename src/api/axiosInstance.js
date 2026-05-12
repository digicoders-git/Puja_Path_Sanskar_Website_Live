import axios from "axios"

const baseURL = import.meta.env.PROD
  ? "/api"
  : import.meta.env.VITE_API_BASE_URL

const api = axios.create({
  baseURL,
  timeout: 120000, // Increased to 2 mins for large video uploads
  withCredentials: true,
})

// Request interceptor to handle token if needed
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
