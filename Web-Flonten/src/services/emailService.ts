/**
 * ============================================================================
 * 📧 EMAIL SERVICE - Servicio de configuración de correo (Web)
 * ============================================================================
 */
import api, { getAuthToken } from './api';

interface EmailConfig {
  id?: string;
  email: string;
  password?: string;
  host: string;
  port: number;
  secure: boolean;
}

export const emailService = {
  async getEmailConfig(): Promise<EmailConfig | null> {
    try {
      const token = getAuthToken();
      if (!token) return null;

      const response = await api.get(EMAIL_CONFIG_ENDPOINT, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data.data || response.data;
    } catch {
      return null;
    }
  },

  async saveEmailConfig(data: EmailConfig): Promise<any> {
    const token = getAuthToken();
    if (!token) throw new Error('Sin sesión');

    const response = await api.post(EMAIL_CONFIG_ENDPOINT, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  async getEmailConfigByUserId(userId: string): Promise<EmailConfig | null> {
    try {
      const token = getAuthToken();
      if (!token) return null;

      const response = await api.get(`/email/config/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data.data || response.data;
    } catch {
      return null;
    }
  },

  async saveConfigForUser(userId: string, data: EmailConfig): Promise<any> {
    const token = getAuthToken();
    if (!token) throw new Error('Sin sesión');

    const response = await api.post(`/email/config/user/${userId}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  async testConnection(data: EmailConfig): Promise<any> {
    const token = getAuthToken();
    if (!token) throw new Error('Sin sesión');

    const response = await api.post('/email/config/test', data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  async activateEmailConfig(): Promise<any> {
    const token = getAuthToken();
    if (!token) throw new Error('Sin sesión');

    const response = await api.post('/email/config/activate', {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  async deleteEmailConfig(): Promise<any> {
    const token = getAuthToken();
    if (!token) throw new Error('Sin sesión');

    const response = await api.delete(EMAIL_CONFIG_ENDPOINT, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
};

const EMAIL_CONFIG_ENDPOINT = '/email/config';

export default emailService;