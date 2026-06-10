import axios from "axios"
import { getToken } from "@/utils/tokenUtils"

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api/v1",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
})

let interceptorsAttached = false

export function setAuthInterceptors(refreshTokenFn, logoutFn) {
  if (interceptorsAttached) return
  interceptorsAttached = true

  // Inject access token from localStorage on every request
  axiosClient.interceptors.request.use((config) => {
    const token = getToken()
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  })

  // On 401 → try refresh → retry original request → else logout
  // Auth endpoints are excluded: a failed login/refresh must not trigger another refresh.
  axiosClient.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config
      const isAuthCall = originalRequest?.url?.includes("/auth/")
      if (error.response?.status === 401 && !originalRequest._retry && !isAuthCall) {
        originalRequest._retry = true
        try {
          const newToken = await refreshTokenFn()
          originalRequest.headers.Authorization = `Bearer ${newToken}`
          return axiosClient(originalRequest)
        } catch {
          logoutFn()
          return Promise.reject(error)
        }
      }
      return Promise.reject(error)
    }
  )
}

export default axiosClient