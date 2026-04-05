import api, { API_CONFIG } from './api'
import { LoginRequest, LoginResponse, ApiResponse } from '../types'

export const authApi = {
  login: async (data: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    const response = await api.post<ApiResponse<LoginResponse>>(
      API_CONFIG.endpoints.LOGIN,
      data
    )
    return response.data
  },

  register: async (data: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    const response = await api.post<ApiResponse<LoginResponse>>(
      API_CONFIG.endpoints.REGISTER,
      data
    )
    return response.data
  },

  logout: async (): Promise<ApiResponse<void>> => {
    const response = await api.post<ApiResponse<void>>('/api/auth/logout')
    return response.data
  },

  me: async (): Promise<ApiResponse<{ user: any }>> => {
    const response = await api.get<ApiResponse<{ user: any }>>('/api/auth/me')
    return response.data
  },
}

export default api
