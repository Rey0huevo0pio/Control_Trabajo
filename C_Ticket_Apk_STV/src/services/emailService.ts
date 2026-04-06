import api, { API_CONFIG, getAuthToken } from "./api";

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
  status: "active" | "inactive" | "error" | "syncing";
  lastSync: string | null;
  verified: boolean;
}

export interface EmailConfigData {
  email: string;
  displayName: string;
  passwordEmail: string;
  imapHost: string;
  imapPort: number;
  imapSecure: boolean;
  smtpHost: string;
  smtpPort: number;
  smtpSecure: boolean;
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
      console.log("📧 [EmailService] === INICIO getEmailConfigByUserId ===");
      console.log("📧 [EmailService] userId:", userId);
      const token = getAuthToken();
      console.log(
        "🔑 [EmailService] Token:",
        token ? "✅ PRESENTE" : "❌ NULO",
      );

      if (!token) {
        console.log("❌ [EmailService] No hay token, retornando null");
        return null;
      }

      const url = API_CONFIG.endpoints.EMAIL_CONFIG_BY_USER(userId);
      console.log("🌐 [EmailService] URL:", url);

      const response = await api.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log(
        "📩 [EmailService] response.data:",
        JSON.stringify(response.data, null, 2),
      );

      // El backend devuelve los datos directamente en response.data
      const config = response.data;
      console.log("📩 [EmailService] config extraída:", config);
      console.log("📩 [EmailService] config.email:", config?.email);
      console.log("📧 [EmailService] === FIN getEmailConfigByUserId ===");

      return config;
    } catch (error: any) {
      console.log(
        "❌ [EmailService] Error:",
        error.response?.data || error.message,
      );
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

  // Guardar configuración para OTRO usuario (Admin)
  async saveConfigForUser(
    targetUserId: string,
    configData: EmailConfigData,
  ): Promise<EmailConfig | null> {
    try {
      const token = getAuthToken();
      if (!token) return null;

      const response = await api.post(
        API_CONFIG.endpoints.EMAIL_CONFIG_FOR_USER(targetUserId),
        configData,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      return response.data.data;
    } catch (error: any) {
      console.log(
        "❌ [EmailService] Error guardando config para usuario:",
        error.response?.data,
      );
      throw error;
    }
  }

  // Obtener TODAS las configuraciones (Debug)
  async getAllConfigs(): Promise<EmailConfig[]> {
    try {
      const token = getAuthToken();
      if (!token) return [];

      const response = await api.get(API_CONFIG.endpoints.EMAIL_CONFIGS_ALL, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data || [];
    } catch (error) {
      return [];
    }
  }

  // Toggle email status (active ↔ inactive)
  async toggleEmailStatus(userId: string): Promise<EmailConfig | null> {
    try {
      const token = getAuthToken();
      if (!token) return null;

      const response = await api.patch(
        `/api/email/config/user/${userId}/toggle-status`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );

      return response.data.data;
    } catch (error: any) {
      console.log(
        "❌ [EmailService] Error toggling email status:",
        error.response?.data || error.message,
      );
      throw error;
    }
  }
}

export const emailService = new EmailService();
