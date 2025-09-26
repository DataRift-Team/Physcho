"use client"

import { createContext, useState, useContext, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import axios from "axios"

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(null)

  // const API_BASE_URL = "https://441a845fb3c9.ngrok-free.app/api" // ngrok backend URL
  const API_BASE_URL = "https://physcho.onrender.com/api" // ngrok backend URL

  useEffect(() => {
    checkAuthState()
  }, [])

  const checkAuthState = async () => {
    try {
      const storedToken = await AsyncStorage.getItem("token")
      if (storedToken) {
        setToken(storedToken)
        axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`

        // Verify token with backend
        const response = await axios.get(`${API_BASE_URL}/auth/me`)
        setUser(response.data.user)
      }
    } catch (error) {
      console.log("Auth check failed:", error)
      await AsyncStorage.removeItem("token")
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password,
      })

      const { token: newToken, user: userData } = response.data

      await AsyncStorage.setItem("token", newToken)
      setToken(newToken)
      setUser(userData)
      axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`

      return { success: true }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      }
    }
  }

  const signup = async (name, email, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/signup`, {
        name,
        email,
        password,
      })

      const { token: newToken, user: userData } = response.data

      await AsyncStorage.setItem("token", newToken)
      setToken(newToken)
      setUser(userData)
      axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`

      return { success: true }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Signup failed",
      }
    }
  }

  const guestLogin = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/guest`)

      const { token: newToken, user: userData } = response.data

      await AsyncStorage.setItem("token", newToken)
      setToken(newToken)
      setUser(userData)
      axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`

      return { success: true }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Guest login failed",
      }
    }
  }

  const logout = async () => {
    await AsyncStorage.removeItem("token")
    setToken(null)
    setUser(null)
    delete axios.defaults.headers.common["Authorization"]
  }

  const value = {
    user,
    token,
    loading,
    login,
    signup,
    guestLogin,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
