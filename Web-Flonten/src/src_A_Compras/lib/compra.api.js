/**
 * API Service para Compras (Web)
 * Conecta con el backend para guardar conexion de Google Sheets
 */
import api from '../../services/api';

export const compraApi = {
  saveGoogleConnection: async (data) => {
    const response = await api.post('/google-sheets/connect', data);
    return response.data;
  },

  getConnectionStatus: async () => {
    const response = await api.get('/google-sheets/status');
    return response.data;
  },

  updateGoogleToken: async (data) => {
    const response = await api.post('/google-sheets/token', data);
    return response.data;
  },

  updateAreas: async (areasAsignadas) => {
    const response = await api.post('/google-sheets/areas', { areasAsignadas });
    return response.data;
  },

  disconnectGoogle: async () => {
    const response = await api.delete('/google-sheets/disconnect');
    return response.data;
  },
};

export default compraApi;
