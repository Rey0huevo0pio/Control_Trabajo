/**
 * ============================================================================
 * 🏠 HOME SCREEN - Pantalla Principal (Web)
 * ============================================================================
 * 
 * QUÉ HACE:
 * - Dashboard principal después de login
 * - Muestra módulos disponibles (Instalaciones, Tickets, Chat, Archivero)
 * - Mismo diseño que el móvil adaptado para web
 * 
 * CONEXIONES:
 * - Mobile: C_Ticket_Apk_STV/src/screens/P_Principal/HomeScreen.tsx
 * - Navigation: Navega a cada módulo
 * - Store: useAuthStore (user info, permisos)
 * 
 * ============================================================================
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Text, Card, Stack, HStack, ScreenLayout, IconButton } from '../../components/design-system';

// Módulos disponibles (mismos que el móvil)
const modules = [
  {
    id: 'instalaciones',
    name: 'Instalaciones',
    icon: '🏢',
    color: '#007AFF',
    route: '/instalaciones',
    description: 'Gestión de instalaciones y áreas',
  },
  {
    id: 'tickets',
    name: 'Tickets IT',
    icon: '🎫',
    color: '#FF9500',
    route: '/tickets',
    description: 'Sistema de tickets de soporte',
  },
  {
    id: 'chat',
    name: 'Chat',
    icon: '💬',
    color: '#5856D6',
    route: '/chat',
    description: 'Mensajería empresarial',
  },
  {
    id: 'archivero',
    name: 'Archivero',
    icon: '📁',
    color: '#34C759',
    route: '/archivero',
    description: 'Gestión documental',
  },
  {
    id: 'usuarios',
    name: 'Usuarios',
    icon: '👥',
    color: '#FF2D55',
    route: '/usuarios',
    description: 'Gestión de usuarios',
  },
  {
    id: 'reportes',
    name: 'Reportes',
    icon: '📊',
    color: '#5AC8FA',
    route: '/reportes',
    description: 'Reportes y métricas',
  },
  {
    id: 'compras',
    name: 'Compras',
    icon: '🛒',
    color: '#AF52DE',
    route: '/compras',
    description: 'Gestión de compras y solicitudes',
  },
];

export const HomeScreen = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <ScreenLayout padding="0">
      {/* Header */}
      <div
        style={{
          backgroundColor: '#007AFF',
          padding: '24px 32px',
          color: 'white',
        }}
      >
        <HStack justify="space-between">
          <Stack gap="8px">
            <Text variant="h3" color="white">
              ¡Hola, {user?.nombre}!
            </Text>
            <Text variant="bodySmall" color="rgba(255,255,255,0.8)">
              Rol: {user?.rol?.toUpperCase()} | {user?.departamento || 'Sin departamento'}
            </Text>
          </Stack>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <IconButton
              icon={<span style={{ fontSize: 24 }}>🔔</span>}
              onClick={() => console.log('Notificaciones')}
            />
            <IconButton
              icon={<span style={{ fontSize: 24 }}>🚪</span>}
              onClick={handleLogout}
            />
          </div>
        </HStack>
      </div>

      {/* Main Content */}
      <div style={{ padding: '32px' }}>
        {/* Stats Section */}
        <Stack gap="24px" style={{ marginBottom: 40 }}>
          <Text variant="h4">Resumen</Text>
          <HStack gap="16px">
            {[
              { label: 'Tickets Pendientes', value: '0', icon: '🎫' },
              { label: 'Mensajes Nuevos', value: '0', icon: '💬' },
              { label: 'Documentos', value: '0', icon: '📁' },
            ].map((stat, index) => (
              <Card key={index} variant="outlined" style={{ flex: 1, textAlign: 'center' }}>
                <Stack gap="8px" align="center">
                  <span style={{ fontSize: 32 }}>{stat.icon}</span>
                  <Text variant="h2">{stat.value}</Text>
                  <Text variant="caption" color="#8E8E93">
                    {stat.label}
                  </Text>
                </Stack>
              </Card>
            ))}
          </HStack>
        </Stack>

        {/* Modules Grid */}
        <Stack gap="24px">
          <Text variant="h4">Módulos</Text>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 20,
            }}
          >
            {modules.map((module) => (
              <Card
                key={module.id}
                variant="outlined"
                onClick={() => navigate(module.route)}
                style={{
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <Stack gap="12px">
                  <HStack gap="12px">
                    <div
                      style={{
                        width: 56,
                        height: 56,
                        borderRadius: 16,
                        backgroundColor: module.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 28,
                      }}
                    >
                      {module.icon}
                    </div>
                    <Stack gap="4px" style={{ flex: 1 }}>
                      <Text variant="h5">{module.name}</Text>
                      <Text variant="bodySmall" color="#8E8E93">
                        {module.description}
                      </Text>
                    </Stack>
                  </HStack>
                </Stack>
              </Card>
            ))}
          </div>
        </Stack>
      </div>
    </ScreenLayout>
  );
};

export default HomeScreen;
