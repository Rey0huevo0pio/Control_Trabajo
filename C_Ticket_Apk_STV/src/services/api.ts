import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios'
import { API_URL, API_TIMEOUT } from '../constants'
import { useAuthStore } from '../store'

console.log('🔧 Configurando API con baseURL:', API_URL)

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
    console.log('📡 Request:', config.method?.toUpperCase(), config.url)
    console.log('🔑 Token:', token ? 'Presente' : 'No presente')
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: AxiosError) => {
    console.error('❌ Error en request:', error)
    return Promise.reject(error)
  }
)

// Interceptor para manejar respuestas
api.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log('✅ Response:', response.status, response.config.url)
    return response
  },
  (error: AxiosError) => {
    console.error('❌ Error en response:', error.response?.status, error.response?.data, error.config?.url)
    
    if (error.response?.status === 401) {
      // Token expirado o no autorizado
      useAuthStore.getState().logout()
      console.error('🚫 No autorizado - token expirado')
    }
    
    // Manejar errores de conexión
    if (error.code === 'ECONNREFUSED' || error.code === 'NETWORK_ERROR') {
      console.error('🔌 Error de conexión: No se puede conectar al backend')
      console.error('📍 URL:', error.config?.baseURL, error.config?.url)
    }
    
    return Promise.reject(error)
  }
)

export default api
