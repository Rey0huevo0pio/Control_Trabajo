import api from '../../services/api'
import type {
  Instalacion,
  AreaInstalacion,
  CreateInstalacionDto,
  CreateAreaInstalacionDto,
} from '../../types'

/**
 * Servicio para manejar las operaciones de instalaciones
 */
export const instalacionApi = {
  /**
   * Obtener todas las instalaciones
   */
  async getAll(): Promise<Instalacion[]> {
    const response = await api.get<Instalacion[]>('/instalaciones')
    return response.data
  },

  /**
   * Obtener instalaciones activas
   */
  async getActivas(): Promise<Instalacion[]> {
    const response = await api.get<Instalacion[]>('/instalaciones/activas')
    return response.data
  },

  /**
   * Obtener una instalación por ID
   */
  async getById(id: string): Promise<Instalacion> {
    const response = await api.get<Instalacion>(`/instalaciones/${id}`)
    return response.data
  },

  /**
   * Crear una nueva instalación
   */
  async create(data: CreateInstalacionDto): Promise<Instalacion> {
    const response = await api.post<Instalacion>('/instalaciones', data)
    return response.data
  },

  /**
   * Actualizar una instalación
   */
  async update(id: string, data: Partial<CreateInstalacionDto>): Promise<Instalacion> {
    const response = await api.put<Instalacion>(`/instalaciones/${id}`, data)
    return response.data
  },

  /**
   * Eliminar una instalación
   */
  async delete(id: string): Promise<void> {
    await api.delete(`/instalaciones/${id}`)
  },

  /**
   * Obtener áreas de una instalación
   */
  async getAreasByInstalacion(instalacionId: string): Promise<AreaInstalacion[]> {
    const response = await api.get<AreaInstalacion[]>(
      `/instalaciones/instalacion/${instalacionId}/areas`
    )
    return response.data
  },

  /**
   * Obtener todas las áreas
   */
  async getAllAreas(): Promise<AreaInstalacion[]> {
    const response = await api.get<AreaInstalacion[]>('/instalaciones/areas')
    return response.data
  },

  /**
   * Crear un área para una instalación
   */
  async createArea(data: CreateAreaInstalacionDto): Promise<AreaInstalacion> {
    const response = await api.post<AreaInstalacion>('/instalaciones/areas', data)
    return response.data
  },

  /**
   * Actualizar un área
   */
  async updateArea(id: string, data: Partial<CreateAreaInstalacionDto>): Promise<AreaInstalacion> {
    const response = await api.put<AreaInstalacion>(`/instalaciones/areas/${id}`, data)
    return response.data
  },

  /**
   * Eliminar un área
   */
  async deleteArea(id: string): Promise<void> {
    await api.delete(`/instalaciones/areas/${id}`)
  },
}
