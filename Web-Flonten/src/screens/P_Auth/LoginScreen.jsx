/**
 * ============================================================================
 * 🔐 LOGIN SCREEN - Pantalla de Inicio de Sesión (Web)
 * ============================================================================
 * 
 * QUÉ HACE:
 * - Formulario de login con Control_Usuario y password
 * - Conecta con authStore para autenticación
 * - Mismo diseño que el móvil adaptado para web
 * 
 * CONEXIONES:
 * - Mobile: C_Ticket_Apk_STV/src/screens/P_Auth/LoginScreen.tsx
 * - Backend: POST /api/auth/login
 * - Store: useAuthStore (login action)
 * - Navigation: Redirige a Home después de login exitoso
 * 
 * ============================================================================
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { login } from '../../services/auth.service';
import { Text, Button, Card, Stack, Input } from '../../components/design-system';

export const LoginScreen = () => {
  const navigate = useNavigate();
  const { login: storeLogin, setLoading } = useAuthStore();
  
  const [formData, setFormData] = useState({
    Control_Usuario: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoadingState] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoadingState(true);
    setLoading(true);

    try {
      const response = await login(formData);
      
      if (response.success && response.data) {
        storeLogin(response.data.user, response.data.token);
        navigate('/');
      } else {
        setError(response.message || 'Error al iniciar sesión');
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 
        'Error de conexión. Verifica tus credenciales.'
      );
    } finally {
      setLoadingState(false);
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F2F2F7',
        padding: '24px',
      }}
    >
      <Card
        variant="elevated"
        padding="40px"
        style={{
          width: '100%',
          maxWidth: '420px',
        }}
      >
        <Stack gap="32px">
          {/* Header */}
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: 20,
                backgroundColor: '#007AFF',
                margin: '0 auto 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 40,
              }}
            >
              🔐
            </div>
            <Text variant="h2" style={{ marginBottom: 8 }}>
              STV Global
            </Text>
            <Text variant="body" color="#8E8E93">
              Inicia sesión para continuar
            </Text>
          </div>

          {/* Error Message */}
          {error && (
            <div
              style={{
                padding: '12px 16px',
                backgroundColor: '#FFE5E3',
                borderRadius: 12,
                borderLeft: '4px solid #FF3B30',
              }}
            >
              <Text variant="bodySmall" color="#FF3B30">
                {error}
              </Text>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Input
              label="Control de Usuario"
              placeholder="Ingresa tu Control_Usuario"
              value={formData.Control_Usuario}
              onChange={(e) =>
                setFormData({ ...formData, Control_Usuario: e.target.value })
              }
              disabled={loading}
            />

            <Input
              label="Contraseña"
              type="password"
              placeholder="Ingresa tu contraseña"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              disabled={loading}
            />

            <Button
              variant="primary"
              size="lg"
              loading={loading}
              disabled={loading}
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>
          </form>

          {/* Footer */}
          <Text variant="caption" style={{ textAlign: 'center', color: '#8E8E93' }}>
            ¿Problemas para acceder? Contacta a soporte técnico
          </Text>
        </Stack>
      </Card>
    </div>
  );
};

export default LoginScreen;
