import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios'
import { API_URL, API_TIMEOUT } from '../constants'
import { useAuthStore } from '../store'

// Crear instancia de axios
const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para agregar token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().token
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expirado o no autorizado
      useAuthStore.getState().logout()
      console.error('No autorizado - token expirado')
    }
    return Promise.reject(error)
  }
)

export default api
