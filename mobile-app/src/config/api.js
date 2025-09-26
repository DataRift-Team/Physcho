import axios from "axios"
import AsyncStorage from "@react-native-async-storage/async-storage"

// Dynamically set API base URL for emulator, simulator, or device

// For Expo Go or mobile data, use your ngrok URL:
let API_BASE_URL = "https://441a845fb3c9.ngrok-free.app/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem("token")
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    } catch (error) {
      console.error("Error getting token:", error)
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.message === "Network Error") {
      console.error("Network error: Check your API_BASE_URL and backend server.");
    }
    if (error.response?.status === 401) {
      // Token expired or invalid
      await AsyncStorage.removeItem("token")
      await AsyncStorage.removeItem("user")
      // Navigate to login screen
    }
    return Promise.reject(error)
  },
)

export default api
