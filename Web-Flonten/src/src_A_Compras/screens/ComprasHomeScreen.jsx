import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Text, Card, Stack, HStack, ScreenLayout, IconButton } from '../../components/design-system';
import { GoogleSheetsProvider } from '../hooks/GoogleSheetsProvider.jsx';
import { useGoogleSheets } from '../hooks/useGoogleSheets.js';
import { GoogleSheetsManager } from '../components/GoogleSheetsManager';

const modules = [
  {
    id: 'solicitudes',
    name: 'Solicitudes',
    icon: '📝',
    color: '#007AFF',
    route: '/compras/solicitudes',
    description: 'Crear y gestionar solicitudes de compra',
  },
  {
    id: 'ordenes',
    name: 'Órdenes de Compra',
    icon: '📋',
    color: '#5856D6',
    route: '/compras/ordenes',
    description: 'Ver órdenes de compra realizadas',
  },
  {
    id: 'proveedores',
    name: 'Proveedores',
    icon: '🏪',
    color: '#34C759',
    route: '/compras/proveedores',
    description: 'Gestión de proveedores',
  },
  {
    id: 'presupuesto',
    name: 'Presupuesto',
    icon: '💰',
    color: '#FF9500',
    route: '/compras/presupuesto',
    description: 'Control de presupuesto',
  },
  {
    id: 'excel',
    name: 'Excel / Sheets',
    icon: '📊',
    color: '#1D6F42',
    route: '/compras/excel',
    description: 'Gestionar archivos de Excel y Google Sheets',
  },
];

const ResumenContent = ({ spreadsheets, areasAsignadas }) => {
  const [pendingRequests, setPendingRequests] = React.useState(0);
  const [activeOrders, setActiveOrders] = React.useState(0);

  React.useEffect(() => {
    if (areasAsignadas.includes('solicitudes')) {
      setPendingRequests(Math.floor(Math.random() * 10));
    }
    if (areasAsignadas.includes('ordenes')) {
      setActiveOrders(Math.floor(Math.random() * 5));
    }
  }, [areasAsignadas]);

  return (
    <HStack gap="16px">
      {areasAsignadas.includes('solicitudes') && (
        <Card variant="outlined" style={{ flex: 1, textAlign: 'center' }}>
          <Stack gap="8px" align="center">
            <span style={{ fontSize: 32 }}>📝</span>
            <Text variant="h2">{pendingRequests}</Text>
            <Text variant="caption" color="#8E8E93">
              Solicitudes Pendientes
            </Text>
          </Stack>
        </Card>
      )}
      {areasAsignadas.includes('ordenes') && (
        <Card variant="outlined" style={{ flex: 1, textAlign: 'center' }}>
          <Stack gap="8px" align="center">
            <span style={{ fontSize: 32 }}>📋</span>
            <Text variant="h2">{activeOrders}</Text>
            <Text variant="caption" color="#8E8E93">
              Órdenes Activas
            </Text>
          </Stack>
        </Card>
      )}
      <Card variant="outlined" style={{ flex: 1, textAlign: 'center' }}>
        <Stack gap="8px" align="center">
          <span style={{ fontSize: 32 }}>📊</span>
          <Text variant="h2">{spreadsheets.length}</Text>
          <Text variant="caption" color="#8E8E93">
            Archivos Excel
          </Text>
        </Stack>
      </Card>
    </HStack>
  );
};

export const ComprasHomeScreen = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [showSheetsManager, setShowSheetsManager] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleModuleClick = (module) => {
    if (module.id === 'excel') {
      setShowSheetsManager(true);
    } else {
      navigate(module.route);
    }
  };

  return (
    <GoogleSheetsProvider>
      <ScreenLayout padding="0">
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
                Módulo de Compras
              </Text>
              <Text variant="bodySmall" color="rgba(255,255,255,0.8)">
                Bienvenido, {user?.nombre} | {user?.departamento || 'Sin departamento'}
              </Text>
            </Stack>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <IconButton
                icon={<span style={{ fontSize: 24 }}>🏠</span>}
                onClick={() => navigate('/')}
              />
              <IconButton
                icon={<span style={{ fontSize: 24 }}>🚪</span>}
                onClick={handleLogout}
              />
            </div>
          </HStack>
        </div>

        <div style={{ padding: '32px' }}>
          <Stack gap="24px" style={{ marginBottom: 40 }}>
            <Text variant="h4">Resumen</Text>
            <ResumenContentWithSheets />
          </Stack>

          <Stack gap="24px">
            <Text variant="h4">Secciones</Text>
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
                  onClick={() => handleModuleClick(module)}
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

        {showSheetsManager && (
          <GoogleSheetsManager onClose={() => setShowSheetsManager(false)} />
        )}
      </ScreenLayout>
    </GoogleSheetsProvider>
  );
};

const ResumenContentWithSheets = () => {
  const { spreadsheets, areasAsignadas } = useGoogleSheets();
  return <ResumenContent spreadsheets={spreadsheets} areasAsignadas={areasAsignadas} />;
};

export default ComprasHomeScreen;