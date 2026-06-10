import { createContext, useState, useEffect, useCallback } from "react"
import axiosClient, { setAuthInterceptors } from "@/api/axiosClient"
import { getToken, saveToken, removeToken, decodeToken } from "@/utils/tokenUtils"
import { IS_DEMO, demoLogin, getDemoSession, clearDemoSession } from "@/lib/demo"

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  // Initialize user directly from localStorage (token or demo session) — survives page refresh
  const [user, setUser] = useState(() => {
    if (IS_DEMO) return getDemoSession()
    const token = getToken()
    return token ? decodeToken(token) : null
  })

  const logout = useCallback(() => {
    removeToken()
    if (IS_DEMO) clearDemoSession()
    setUser(null)
  }, [])

  const refreshToken = useCallback(async () => {
    const response = await axiosClient.post("/auth/refresh/")
    const { access_token } = response.data
    saveToken(access_token)
    setUser(decodeToken(access_token))
    return access_token
  }, [])

  // Attach interceptors once on mount
  useEffect(() => {
    setAuthInterceptors(refreshToken, logout)
  }, [refreshToken, logout])

  const login = async (email, password) => {
    if (IS_DEMO) {
      // Backend-less preview: simulates the real auth contract (test accounts,
      // 403 Invalid Credentials on bad input)
      const demoUser = await demoLogin(email, password)
      setUser(demoUser)
      return
    }
    const response = await axiosClient.post("/auth/login/", { email, password })
    const { access_token } = response.data
    saveToken(access_token)
    setUser(decodeToken(access_token))
  }

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}