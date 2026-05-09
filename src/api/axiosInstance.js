import axios from "axios"

const baseURL = import.meta.env.PROD
  ? "/api"
  : import.meta.env.VITE_API_BASE_URL

const api = axios.create({
  baseURL,
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
})

export default api
