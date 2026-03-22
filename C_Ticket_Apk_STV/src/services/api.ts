import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios'
import { API_URL, API_TIMEOUT } from '../constants'

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
    // Aquí se podría obtener el token del store si es necesario
    // const token = useAuthStore.getState().token
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
      // Aquí se podría llamar a logout
      console.error('No autorizado - token expirado')
    }
    return Promise.reject(error)
  }
)

export default api
