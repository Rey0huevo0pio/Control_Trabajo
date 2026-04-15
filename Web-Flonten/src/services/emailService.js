/**
 * ============================================================================
 * 📧 EMAIL SERVICE - Servicio de configuración de correo (Web)
 * ============================================================================
 */
import api, { getAuthToken } from './api';

const EMAIL_CONFIG_ENDPOINT = '/email/config';

export const emailService = {
  async getEmailConfig() {
    try {
      const token = getAuthToken();
      if (!token) return null;

      const response = await api.get(EMAIL_CONFIG_ENDPOINT, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data.data || response.data;
    } catch (error) {
      return null;
    }
  },

  async saveEmailConfig(data) {
    const token = getAuthToken();
    if (!token) throw new Error('Sin sesión');

    const response = await api.post(EMAIL_CONFIG_ENDPOINT, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  async getEmailConfigByUserId(userId) {
    try {
      const token = getAuthToken();
      if (!token) return null;

      const response = await api.get(`/email/config/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data.data || response.data;
    } catch (error) {
      return null;
    }
  },

  async saveConfigForUser(userId, data) {
    const token = getAuthToken();
    if (!token) throw new Error('Sin sesión');

    const response = await api.post(`/email/config/user/${userId}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  async testConnection(data) {
    const token = getAuthToken();
    if (!token) throw new Error('Sin sesión');

    const response = await api.post('/email/config/test', data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  async activateEmailConfig() {
    const token = getAuthToken();
    if (!token) throw new Error('Sin sesión');

    const response = await api.post('/email/config/activate', {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  async deleteEmailConfig() {
    const token = getAuthToken();
    if (!token) throw new Error('Sin sesión');

    const response = await api.delete(EMAIL_CONFIG_ENDPOINT, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
};

export default emailService;