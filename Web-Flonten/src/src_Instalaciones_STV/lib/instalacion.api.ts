/**
 * API Service para Instalaciones (Web)
 * Adaptado de: C_Ticket_Apk_STV/src_Instalaciones_STV/lib/instalacion.api.ts
 */
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '';

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

export interface Instalacion {
  id: string;
  nombre: string;
  direccion: string;
  ciudad?: string;
  estado?: string;
  pais?: string;
  coordenadas?: {
    lat: number;
    lng: number;
  };
  activo: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Area {
  id: string;
  nombre: string;
  descripcion?: string;
  piso?: string;
  instalacionId: string;
  coordenadas?: {
    x: number;
    y: number;
  };
}

export const instalacionApi = {
  async getActivas(): Promise<any> {
    const response = await api.get('/instalaciones?activa=true');
    return response.data;
  },

  async getAll(): Promise<any> {
    const response = await api.get('/instalaciones');
    return response.data;
  },

  async getById(id: string): Promise<any> {
    const response = await api.get(`/instalaciones/${id}`);
    return response.data;
  },

  async create(data: Partial<Instalacion>): Promise<any> {
    const response = await api.post('/instalaciones', data);
    return response.data;
  },

  async update(id: string, data: Partial<Instalacion>): Promise<any> {
    const response = await api.put(`/instalaciones/${id}`, data);
    return response.data;
  },

  async getAreasByInstalacion(instalacionId: string): Promise<any> {
    const response = await api.get(`/instalaciones/instalacion/${instalacionId}/areas`);
    return response.data;
  },

  async createArea(data: Partial<Area>): Promise<any> {
    const response = await api.post('/instalaciones/areas', data);
    return response.data;
  },

  async getAreaById(areaId: string): Promise<any> {
    const response = await api.get(`/areas/${areaId}`);
    return response.data;
  },

  async updateArea(areaId: string, data: Partial<Area>): Promise<any> {
    const response = await api.put(`/areas/${areaId}`, data);
    return response.data;
  },

  async deleteArea(areaId: string): Promise<any> {
    const response = await api.delete(`/areas/${areaId}`);
    return response.data;
  },

  async delete(id: string): Promise<any> {
    const response = await api.delete(`/instalaciones/${id}`);
    return response.data;
  },
};

export default instalacionApi;