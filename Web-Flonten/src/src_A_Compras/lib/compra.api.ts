/**
 * API Service para Compras (Web)
 * Conecta con el backend para guardar conexion de Google Sheets
 */
import api from '../../services/api';

interface GoogleConnectionData {
  accessToken: string;
  refreshToken?: string | null;
  tokenExpiry?: string | null;
  email?: string;
  nombre?: string;
  scope?: string;
  areasAsignadas?: string[];
  expiresAt?: number;
}

interface GoogleTokenData {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: number;
}

interface AreasData {
  areasAsignadas: string[];
}

export const compraApi = {
  saveGoogleConnection: async (data: GoogleConnectionData): Promise<any> => {
    const response = await api.post('/google-sheets/connect', data);
    return response.data;
  },

  getConnectionStatus: async (): Promise<any> => {
    const response = await api.get('/google-sheets/status');
    return response.data;
  },

  updateGoogleToken: async (data: GoogleTokenData): Promise<any> => {
    const response = await api.post('/google-sheets/token', data);
    return response.data;
  },

  updateAreas: async (areasAsignadas: string[]): Promise<any> => {
    const response = await api.post('/google-sheets/areas', { areasAsignadas });
    return response.data;
  },

  disconnectGoogle: async (): Promise<any> => {
    const response = await api.delete('/google-sheets/disconnect');
    return response.data;
  },
};

export default compraApi;