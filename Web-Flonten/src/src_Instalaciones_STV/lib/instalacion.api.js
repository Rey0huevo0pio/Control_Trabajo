/**
 * API Service para Instalaciones (Web)
 * Adaptado de: C_Ticket_Apk_STV/src_Instalaciones_STV/lib/instalacion.api.ts
 */
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://192.168.68.117:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token de auth
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const instalacionApi = {
  /**
   * Obtener todas las instalaciones activas
   */
  getActivas: async () => {
    const response = await api.get('/instalaciones?activa=true');
    return response.data;
  },

  /**
   * Obtener todas las instalaciones
   */
  getAll: async () => {
    const response = await api.get('/instalaciones');
    return response.data;
  },

  /**
   * Obtener una instalación por ID
   */
  getById: async (id) => {
    const response = await api.get(`/instalaciones/${id}`);
    return response.data;
  },

  /**
   * Crear una nueva instalación
   */
  create: async (data) => {
    const response = await api.post('/instalaciones', data);
    return response.data;
  },

  /**
   * Actualizar una instalación
   */
  update: async (id, data) => {
    const response = await api.put(`/instalaciones/${id}`, data);
    return response.data;
  },

  /**
   * Obtener áreas de una instalación
   */
   getAreasByInstalacion: async (instalacionId) => {
     const response = await api.get(`/instalaciones/instalacion/${instalacionId}/areas`);
     return response.data;
   },

  /**
   * Crear un área en una instalación
   */
  createArea: async (instalacionId, data) => {
    const response = await api.post(`/instalaciones/${instalacionId}/areas`, data);
    return response.data;
  },

  /**
   * Obtener un área por ID
   */
  getAreaById: async (areaId) => {
    const response = await api.get(`/areas/${areaId}`);
    return response.data;
  },

  /**
   * Actualizar un área
   */
  updateArea: async (areaId, data) => {
    const response = await api.put(`/areas/${areaId}`, data);
    return response.data;
  },

  /**
   * Eliminar un área
   */
  deleteArea: async (areaId) => {
    const response = await api.delete(`/areas/${areaId}`);
    return response.data;
  },

  /**
   * Eliminar una instalación
   */
  delete: async (id) => {
    const response = await api.delete(`/instalaciones/${id}`);
    return response.data;
  },
};

export default instalacionApi;
