import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Text, Card, Stack, HStack, ScreenLayout, IconButton, Button } from '../../components/design-system';
import { GoogleSheetsProvider } from '../hooks/GoogleSheetsProvider.jsx';
import { useGoogleSheets } from '../hooks/useGoogleSheets.js';
import { useComprasAnalytics } from '../hooks/useComprasAnalytics.js';
import { GoogleSheetsManager } from '../components/GoogleSheetsManager';
import {
  AreaSummaryGrid,
  BarChartCard,
  DonutChartCard,
  KpiCards,
  LineChartCard,
  SpreadsheetPreviewPanel,
} from '../components/ComprasDashboard.jsx';

const modules = [
  {
    id: 'solicitudes',
    name: 'Solicitudes',
    icon: 'SC',
    color: '#2563EB',
    route: '/compras/solicitudes',
    description: 'Solicitudes de compra, seguimiento y prioridades.',
  },
  {
    id: 'ordenes',
    name: 'Ordenes de Compra',
    icon: 'OC',
    color: '#7C3AED',
    route: '/compras/ordenes',
    description: 'Control de ordenes emitidas, activas y completadas.',
  },
  {
    id: 'proveedores',
    name: 'Proveedores',
    icon: 'PR',
    color: '#059669',
    route: '/compras/proveedores',
    description: 'Catalogo, estatus y relacion con proveedores.',
  },
  {
    id: 'presupuesto',
    name: 'Presupuesto',
    icon: 'PP',
    color: '#EA580C',
    route: '/compras/presupuesto',
    description: 'Analisis de gasto, partidas y presupuesto disponible.',
  },
  {
    id: 'inventario',
    name: 'Inventario',
    icon: 'IN',
    color: '#0F766E',
    route: '/compras/inventario',
    description: 'Control de stock, entradas, salidas y reposicion.',
  },
];

const DASHBOARD_GRADIENT = 'radial-gradient(circle at top left, rgba(37, 99, 235, 0.22), transparent 35%), radial-gradient(circle at top right, rgba(124, 58, 237, 0.16), transparent 30%), linear-gradient(180deg, #F8FAFC 0%, #EEF2FF 100%)';

const DashboardContent = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const {
    spreadsheets,
    loading,
    areasAsignadas,
    loadSpreadsheets,
    getSpreadsheetPreview,
    isSignedIn,
  } = useGoogleSheets();

  const [showSheetsManager, setShowSheetsManager] = React.useState(false);
  const [selectedSpreadsheet, setSelectedSpreadsheet] = React.useState(null);
  const [previewData, setPreviewData] = React.useState(null);
  const [previewLoading, setPreviewLoading] = React.useState(false);
  const [previewError, setPreviewError] = React.useState(null);

  const analytics = useComprasAnalytics({
    spreadsheets,
    areasAsignadas,
    previewData,
  });

  React.useEffect(() => {
    if (!spreadsheets.length) {
      setSelectedSpreadsheet(null);
      setPreviewData(null);
      return;
    }

    setSelectedSpreadsheet((current) => {
      if (current && spreadsheets.some((sheet) => sheet.id === current.id)) {
        return current;
      }

      return (
        spreadsheets.find((sheet) => sheet.mimeType?.includes('google-apps.spreadsheet')) ||
        spreadsheets[0]
      );
    });
  }, [spreadsheets]);

  React.useEffect(() => {
    if (!selectedSpreadsheet || !isSignedIn) return;

    let cancelled = false;

    const loadPreview = async () => {
      setPreviewLoading(true);
      setPreviewError(null);

      try {
        const response = await getSpreadsheetPreview(selectedSpreadsheet);
        if (!cancelled) {
          setPreviewData(response);
        }
      } catch (error) {
        if (!cancelled) {
          setPreviewData(null);
          setPreviewError(error.message || 'No se pudo cargar la vista previa del archivo.');
        }
      } finally {
        if (!cancelled) {
          setPreviewLoading(false);
        }
      }
    };

    loadPreview();

    return () => {
      cancelled = true;
    };
  }, [getSpreadsheetPreview, isSignedIn, selectedSpreadsheet]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const kpiItems = [
    {
      label: 'Archivos Totales',
      value: analytics.totalFiles,
      helper: 'Excel y Google Sheets vinculados al area de compras',
      icon: 'DB',
      color: '#1D4ED8',
      background: '#EFF6FF',
      borderColor: '#BFDBFE',
    },
    {
      label: 'Google Sheets',
      value: analytics.googleSheetsCount,
      helper: 'Disponibles para vista previa y graficas inmediatas',
      icon: 'GS',
      color: '#15803D',
      background: '#F0FDF4',
      borderColor: '#BBF7D0',
    },
    {
      label: 'Excel',
      value: analytics.excelCount,
      helper: 'Listos para descarga y seguimiento operativo',
      icon: 'XL',
      color: '#B45309',
      background: '#FFFBEB',
      borderColor: '#FDE68A',
    },
    {
      label: 'Areas Activas',
      value: analytics.areaCards.filter((item) => item.count > 0).length,
      helper: 'Frentes de compras con archivos detectados',
      icon: 'AR',
      color: '#7C3AED',
      background: '#F5F3FF',
      borderColor: '#DDD6FE',
    },
  ];

  return (
    <ScreenLayout padding="0" backgroundColor="#F8FAFC">
      <div
        style={{
          background: 'linear-gradient(135deg, #0F172A 0%, #1E3A8A 52%, #2563EB 100%)',
          padding: '28px 32px 32px',
          color: '#FFFFFF',
        }}
      >
        <HStack justify="space-between" align="flex-start" style={{ flexWrap: 'wrap', gap: 20 }}>
          <Stack gap="10px" style={{ maxWidth: 720 }}>
            <Text variant="h3" color="#FFFFFF">
              Centro de Compras
            </Text>
            <Text variant="bodySmall" color="rgba(255,255,255,0.82)">
              Panel operativo para solicitudes, ordenes, proveedores, presupuesto y analisis de Excel.
            </Text>
            <Text variant="caption" color="rgba(255,255,255,0.72)">
              Usuario: {user?.nombre || 'Sin nombre'} | Departamento: {user?.departamento || 'Sin departamento'}
            </Text>
          </Stack>

          <HStack gap="8px">
            <IconButton
              icon={<span style={{ fontSize: 18, fontWeight: 700 }}>IN</span>}
              onClick={() => navigate('/')}
              style={{ backgroundColor: 'rgba(255,255,255,0.14)', color: '#FFFFFF', borderRadius: 14 }}
              title="Ir al inicio"
            />
            <IconButton
              icon={<span style={{ fontSize: 18, fontWeight: 700 }}>GO</span>}
              onClick={() => setShowSheetsManager(true)}
              style={{ backgroundColor: 'rgba(255,255,255,0.14)', color: '#FFFFFF', borderRadius: 14 }}
              title="Gestionar Google Sheets"
            />
            <IconButton
              icon={<span style={{ fontSize: 18, fontWeight: 700 }}>SX</span>}
              onClick={handleLogout}
              style={{ backgroundColor: 'rgba(255,255,255,0.14)', color: '#FFFFFF', borderRadius: 14 }}
              title="Cerrar sesion"
            />
          </HStack>
        </HStack>
      </div>

      <div
        style={{
          padding: 32,
          background: DASHBOARD_GRADIENT,
        }}
      >
        <Stack gap="24px">
          <KpiCards items={kpiItems} />

          <Card
            variant="outlined"
            style={{
              background: 'linear-gradient(90deg, rgba(255,255,255,0.88) 0%, rgba(239,246,255,0.96) 100%)',
              border: '1px solid #DBEAFE',
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1.5fr 1fr',
                gap: 20,
                alignItems: 'center',
              }}
            >
              <Stack gap="10px">
                <Text variant="h4">Area de trabajo de compras</Text>
                <Text variant="bodySmall" color="#475569">
                  Aqui concentramos los archivos de solicitudes, ordenes, proveedores y presupuesto para
                  consultarlos en un solo lugar y generar graficas de pastel, barras y tendencia.
                </Text>
              </Stack>
              <HStack gap="10px" justify="flex-end" style={{ flexWrap: 'wrap' }}>
                <Button
                  variant="secondary"
                  onClick={() => loadSpreadsheets(true)}
                  loading={loading}
                  style={{ width: 'auto' }}
                >
                  Sincronizar
                </Button>
                <Button onClick={() => setShowSheetsManager(true)} style={{ width: 'auto' }}>
                  Abrir gestor
                </Button>
              </HStack>
            </div>
          </Card>

          <Stack gap="16px">
            <HStack justify="space-between" align="center" style={{ flexWrap: 'wrap' }}>
              <Stack gap="4px">
                <Text variant="h4">Areas de compras</Text>
                <Text variant="bodySmall" color="#64748B">
                  Visibilidad rapida de las areas que ya tienen archivos conectados.
                </Text>
              </Stack>
            </HStack>
            <AreaSummaryGrid items={analytics.areaCards} />
          </Stack>

          <SpreadsheetPreviewPanel
            spreadsheets={spreadsheets}
            selectedSpreadsheetId={selectedSpreadsheet?.id}
            onSelectSpreadsheet={setSelectedSpreadsheet}
            previewSummary={analytics.previewSummary}
            previewLoading={previewLoading}
            previewError={previewError}
            onRefresh={() => loadSpreadsheets(true)}
            onOpenManager={() => setShowSheetsManager(true)}
          />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: 18,
            }}
          >
            <DonutChartCard
              title="Grafica de pastel por area"
              subtitle="Distribucion de archivos detectados por categoria de compras."
              data={analytics.areaDistribution}
            />
            <BarChartCard
              title="Grafica de barras"
              subtitle="Columnas numericas mas fuertes de la hoja seleccionada."
              data={analytics.previewSummary.totalsByColumn}
            />
            <LineChartCard
              title="Tendencia de actividad"
              subtitle="Movimiento de archivos por fecha de modificacion reciente."
              data={analytics.monthlyActivity}
            />
          </div>

          <Stack gap="16px">
            <HStack justify="space-between" align="center" style={{ flexWrap: 'wrap' }}>
              <Stack gap="4px">
                <Text variant="h4">Accesos operativos</Text>
                <Text variant="bodySmall" color="#64748B">
                  Entradas directas para seguir construyendo el modulo completo de compras.
                </Text>
              </Stack>
            </HStack>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: 16,
              }}
            >
              {modules.map((module) => (
                <Card
                  key={module.id}
                  variant="outlined"
                  onClick={() => navigate(module.route)}
                  style={{
                    border: `1px solid ${module.color}33`,
                    background: 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)',
                  }}
                >
                  <Stack gap="12px">
                    <HStack justify="space-between" align="flex-start">
                      <Stack gap="6px" style={{ flex: 1 }}>
                        <Text variant="h5">{module.name}</Text>
                        <Text variant="bodySmall" color="#64748B">
                          {module.description}
                        </Text>
                      </Stack>
                      <div
                        style={{
                          width: 50,
                          height: 50,
                          borderRadius: 16,
                          backgroundColor: module.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#FFFFFF',
                          fontWeight: 700,
                        }}
                      >
                        {module.icon}
                      </div>
                    </HStack>
                    <Text variant="caption" color="#475569">
                      Entrar a {module.name.toLowerCase()}
                    </Text>
                  </Stack>
                </Card>
              ))}
            </div>
          </Stack>
        </Stack>
      </div>

      {showSheetsManager ? <GoogleSheetsManager onClose={() => setShowSheetsManager(false)} /> : null}
    </ScreenLayout>
  );
};

export const ComprasHomeScreen = () => (
  <GoogleSheetsProvider>
    <DashboardContent />
  </GoogleSheetsProvider>
);

export default ComprasHomeScreen;
