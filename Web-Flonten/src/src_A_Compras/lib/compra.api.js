/**
 * API Service para Compras (Web)
 * Conecta con el backend para guardar conexión de Google Sheets
 */
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://192.168.68.117:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const compraApi = {
  /**
   * Guardar conexión de Google Sheets
   */
  saveGoogleConnection: async (data) => {
    const response = await api.post('/google-sheets/connect', data);
    return response.data;
  },

  /**
   * Obtener estado de conexión
   */
  getConnectionStatus: async () => {
    const response = await api.get('/google-sheets/status');
    return response.data;
  },

  /**
   * Actualizar token de acceso
   */
  updateGoogleToken: async (data) => {
    const response = await api.post('/google-sheets/token', data);
    return response.data;
  },

  /**
   * Eliminar conexión de Google
   */
  disconnectGoogle: async () => {
    const response = await api.delete('/google-sheets/disconnect');
    return response.data;
  },
};

export default compraApi;