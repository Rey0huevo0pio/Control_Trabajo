import api from './api'
import { LoginRequest, LoginResponse, ApiResponse } from '../types'

export const authApi = {
  login: async (data: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    const response = await api.post<ApiResponse<LoginResponse>>('/auth/login', data)
    return response.data
  },

  logout: async (): Promise<ApiResponse<void>> => {
    const response = await api.post<ApiResponse<void>>('/auth/logout')
    return response.data
  },

  me: async (): Promise<ApiResponse<{ user: any }>> => {
    const response = await api.get<ApiResponse<{ user: any }>>('/auth/me')
    return response.data
  },
}

export default api
