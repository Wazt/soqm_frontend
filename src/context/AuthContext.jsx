import { createContext, useState, useEffect, useCallback } from "react"
import axiosClient, { setAuthInterceptors } from "@/api/axiosClient"
import { getToken, saveToken, removeToken, decodeToken } from "@/utils/tokenUtils"
import { IS_DEMO, DEMO_USER } from "@/lib/demo"

const DEMO_TOKEN = "demo-session"

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  // Initialize user directly from localStorage token — survives page refresh
  const [user, setUser] = useState(() => {
    const token = getToken()
    if (!token) return null
    if (IS_DEMO && token === DEMO_TOKEN) return DEMO_USER
    return decodeToken(token)
  })

  const logout = useCallback(() => {
    removeToken()
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
      // Backend-less preview deployment: any credentials sign in as the demo user
      saveToken(DEMO_TOKEN)
      setUser({ ...DEMO_USER, email: email || DEMO_USER.email })
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