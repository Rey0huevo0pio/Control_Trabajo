import api, { API_CONFIG, getAuthToken } from './api';

// ==========================================
// INTERFACES
// ==========================================
export interface EmailConfig {
  id: string;
  email: string;
  displayName: string;
  imapHost: string;
  imapPort: number;
  imapSecure: boolean;
  smtpHost: string;
  smtpPort: number;
  smtpSecure: boolean;
  status: 'active' | 'inactive' | 'error' | 'syncing';
  lastSync: string | null;
  verified: boolean;
}

// ==========================================
// SERVICIO DE CORREO
// ==========================================
class EmailService {
  // Obtener configuración de correo del usuario actual
  async getEmailConfig(): Promise<EmailConfig | null> {
    try {
      const token = getAuthToken();
      if (!token) return null;

      const response = await api.get(API_CONFIG.endpoints.EMAIL_CONFIG, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data.data;
    } catch (error) {
      // Si no hay configuración, retornar null
      return null;
    }
  }

  // Obtener configuración de correo por ID de usuario
  async getEmailConfigByUserId(userId: string): Promise<EmailConfig | null> {
    try {
      const token = getAuthToken();
      if (!token) return null;

      const response = await api.get(API_CONFIG.endpoints.EMAIL_CONFIG_BY_USER(userId), {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data.data;
    } catch (error) {
      return null;
    }
  }

  // Eliminar configuración de correo
  async deleteEmailConfig(userId: string): Promise<void> {
    const token = getAuthToken();
    if (!token) return;

    await api.delete(API_CONFIG.endpoints.EMAIL_CONFIG_BY_USER(userId), {
      headers: { Authorization: `Bearer ${token}` },
    });
  }
}

export const emailService = new EmailService();
