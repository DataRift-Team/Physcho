
import { createContext, useContext, useState, useEffect } from "react"
import api from "../config/api"

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

  useEffect(() => {
    const token = localStorage.getItem("adminToken")
    if (token) {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`
  checkAuth()
    } else {
      setLoading(false)
    }
  }, [])

  const checkAuth = async () => {
    try {
    const response = await api.get("/auth/me")
    setUser(response.data.user)
    } catch (error) {
      localStorage.removeItem("adminToken")
      delete axios.defaults.headers.common["Authorization"]
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
    const response = await api.post("/auth/login", { email, password })
    const { token, user: userData } = response.data

    // Allow both admin and student roles
    localStorage.setItem("adminToken", token)
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`
    setUser(userData)

    return { success: true }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || error.message || "Login failed",
      }
    }
  }

  const logout = () => {
    localStorage.removeItem("adminToken")
  delete api.defaults.headers.common["Authorization"]
    setUser(null)
  }

  const value = {
    user,
    loading,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
