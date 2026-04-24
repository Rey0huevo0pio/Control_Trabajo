import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Text, Card, Stack, HStack, ScreenLayout, IconButton, Button } from '../../components/design-system';
import { GoogleSheetsProvider } from '../hooks/GoogleSheetsProvider';
import { useGoogleSheets } from '../hooks/useGoogleSheets';
import { useComprasAnalytics, detectArea } from '../hooks/useComprasAnalytics';
import { GoogleSheetsManager } from './GoogleSheetsManager';
import {
  BarChartCard,
  ChartBuilderPanel,
  DonutChartCard,
  ExcelEditorPanel,
  KpiCards,
  LineChartCard,
  SpreadsheetPreviewPanel,
} from './ComprasDashboard';

const filterModuleSheets = (spreadsheets, moduleId) =>
  spreadsheets.filter((sheet) => detectArea(sheet) === moduleId);

const getDefaultSheets = (spreadsheets, moduleId) => {
  const filtered = filterModuleSheets(spreadsheets, moduleId);
  if (filtered.length) return filtered;
  return spreadsheets;
};

const ModuleContent = ({ moduleConfig }) => {
  const navigate = useNavigate();
  const {
    spreadsheets,
    loading,
    isSignedIn,
    loadSpreadsheets,
    getSpreadsheetPreview,
  } = useGoogleSheets();

  const [showSheetsManager, setShowSheetsManager] = React.useState(false);
  const [selectedSpreadsheet, setSelectedSpreadsheet] = React.useState(null);
  const [selectedSheetName, setSelectedSheetName] = React.useState(null);
  const [previewData, setPreviewData] = React.useState(null);
  const [previewLoading, setPreviewLoading] = React.useState(false);
  const [previewError, setPreviewError] = React.useState(null);
  const [editorSaveData, setEditorSaveData] = React.useState(null);

  const moduleSheets = React.useMemo(
    () => getDefaultSheets(spreadsheets, moduleConfig.id),
    [moduleConfig.id, spreadsheets],
  );

  const analytics = useComprasAnalytics({
    spreadsheets: moduleSheets,
    areasAsignadas: [moduleConfig.id],
    previewData,
  });

  React.useEffect(() => {
    if (!moduleSheets.length) {
      setSelectedSpreadsheet(null);
      setPreviewData(null);
      return;
    }

    setSelectedSpreadsheet((current) => {
      if (current && moduleSheets.some((sheet) => sheet.id === current.id)) {
        return current;
      }

      const isExcel = (sheet) => {
        const webViewLink = sheet.webViewLink || '';
        const isGoogleSheetLink = webViewLink.includes('docs.google.com/spreadsheets');
        const isDriveFileLink = webViewLink.includes('drive.google.com/file');
        
        return sheet.mimeType?.includes('officedocument.spreadsheet') ||
               sheet.mimeType?.includes('vnd.ms-excel') ||
               sheet.name?.match(/\.(xlsx|xls|xlsm|xlsb)$/i) ||
               (isDriveFileLink && !isGoogleSheetLink);
      };

      const excelSheet = moduleSheets.find(
        (sheet) => sheet.mimeType?.includes('google-apps.spreadsheet') || isExcel(sheet)
      );

      return excelSheet || moduleSheets[0];
    });
    setSelectedSheetName(null);
  }, [moduleSheets]);

  React.useEffect(() => {
    if (!selectedSpreadsheet || !isSignedIn) return;

    let cancelled = false;

    const run = async () => {
      setPreviewLoading(true);
      setPreviewError(null);

      try {
        const result = await getSpreadsheetPreview(selectedSpreadsheet, selectedSheetName);
        if (!cancelled) {
          setPreviewData(result);
        }
      } catch (error) {
        if (!cancelled) {
          setPreviewData(null);
          setPreviewError(error.message || 'No se pudo cargar la vista previa.');
        }
      } finally {
        if (!cancelled) {
          setPreviewLoading(false);
        }
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [getSpreadsheetPreview, isSignedIn, selectedSpreadsheet, selectedSheetName]);

  const kpiItems = [
    {
      label: `Archivos de ${moduleConfig.name}`,
      value: moduleSheets.length,
      helper: moduleConfig.hero.helper,
      icon: moduleConfig.iconShort,
      color: moduleConfig.color,
      background: moduleConfig.softColor,
      borderColor: `${moduleConfig.color}55`,
    },
    {
      label: 'Google Sheets',
      value: moduleSheets.filter((sheet) => sheet.mimeType?.includes('google-apps.spreadsheet')).length,
      helper: 'Listos para vista previa y graficas.',
      icon: 'GS',
      color: '#15803D',
      background: '#F0FDF4',
      borderColor: '#BBF7D0',
    },
    {
      label: 'Excel',
      value: moduleSheets.filter((sheet) => !sheet.mimeType?.includes('google-apps.spreadsheet')).length,
      helper: 'Disponibles para descarga y control.',
      icon: 'XL',
      color: '#B45309',
      background: '#FFFBEB',
      borderColor: '#FDE68A',
    },
    {
      label: 'Registros visibles',
      value: analytics.previewSummary.rowCount,
      helper: 'Filas detectadas en la hoja seleccionada.',
      icon: 'RG',
      color: '#7C3AED',
      background: '#F5F3FF',
      borderColor: '#DDD6FE',
    },
  ];

  return (
    <ScreenLayout padding="0" backgroundColor="#F8FAFC">
      <div
        style={{
          background: `linear-gradient(135deg, ${moduleConfig.color} 0%, ${moduleConfig.darkColor} 100%)`,
          padding: '28px 32px 34px',
          color: '#FFFFFF',
        }}
      >
        <HStack justify="space-between" align="flex-start" style={{ flexWrap: 'wrap', gap: 18 }}>
          <Stack gap="10px" style={{ maxWidth: 760 }}>
            <HStack gap="12px" align="center">
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 16,
                  backgroundColor: 'rgba(255,255,255,0.16)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 24,
                }}
              >
                {moduleConfig.icon}
              </div>
              <Stack gap="4px">
                <Text variant="h3" color="#FFFFFF">
                  {moduleConfig.name}
                </Text>
                <Text variant="bodySmall" color="rgba(255,255,255,0.8)">
                  {moduleConfig.subtitle}
                </Text>
              </Stack>
            </HStack>
            <Text variant="bodySmall" color="rgba(255,255,255,0.78)">
              {moduleConfig.description}
            </Text>
          </Stack>

          <HStack gap="8px">
            <IconButton
              icon={<span style={{ fontSize: 18, fontWeight: 700 }}>CM</span>}
              onClick={() => navigate('/compras')}
              style={{ backgroundColor: 'rgba(255,255,255,0.14)', color: '#FFFFFF', borderRadius: 14 }}
              title="Volver a compras"
            />
            <IconButton
              icon={<span style={{ fontSize: 18, fontWeight: 700 }}>GO</span>}
              onClick={() => setShowSheetsManager(true)}
              style={{ backgroundColor: 'rgba(255,255,255,0.14)', color: '#FFFFFF', borderRadius: 14 }}
              title="Gestionar archivos"
            />
          </HStack>
        </HStack>
      </div>

      <div style={{ padding: 32 }}>
        <Stack gap="24px">
          <KpiCards items={kpiItems} />

          <Card
            variant="outlined"
            style={{
              border: `1px solid ${moduleConfig.color}33`,
              background: `linear-gradient(90deg, #FFFFFF 0%, ${moduleConfig.softColor} 100%)`,
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
                <Text variant="h4">Funciones del area</Text>
                <Text variant="bodySmall" color="#475569">
                  {moduleConfig.hero.text}
                </Text>
              </Stack>
              <HStack gap="10px" justify="flex-end" style={{ flexWrap: 'wrap' }}>
                <Button
                  variant="secondary"
                  onClick={() => loadSpreadsheets(true)}
                  loading={loading}
                  style={{ width: 'auto' }}
                >
                  Actualizar datos
                </Button>
                <Button onClick={() => setShowSheetsManager(true)} style={{ width: 'auto' }}>
                  Abrir archivos
                </Button>
              </HStack>
            </div>
          </Card>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 16,
            }}
          >
            {moduleConfig.options.map((option) => (
              <Card
                key={option.title}
                variant="outlined"
                style={{
                  border: `1px solid ${moduleConfig.color}26`,
                  backgroundColor: '#FFFFFF',
                }}
              >
                <Stack gap="10px">
                  <HStack justify="space-between" align="center">
                    <Text variant="h6">{option.title}</Text>
                    <span style={{ fontSize: 20 }}>{option.icon}</span>
                  </HStack>
                  <Text variant="bodySmall" color="#64748B">
                    {option.description}
                  </Text>
                </Stack>
              </Card>
            ))}
          </div>

          <SpreadsheetPreviewPanel
            spreadsheets={moduleSheets}
            selectedSpreadsheetId={selectedSpreadsheet?.id}
            onSelectSpreadsheet={(sheet) => { setSelectedSpreadsheet(sheet); setSelectedSheetName(null); }}
            previewSummary={analytics.previewSummary}
            previewLoading={previewLoading}
            previewError={previewError}
            onRefresh={() => loadSpreadsheets(true)}
            onOpenManager={() => setShowSheetsManager(true)}
            sheetNames={previewData?.sheetNames || []}
            activeSheetName={previewData?.activeSheetName || selectedSheetName}
            onSelectSheet={setSelectedSheetName}
          />

          <ExcelEditorPanel
            previewSummary={analytics.previewSummary}
            onSave={setEditorSaveData}
          />

          <ChartBuilderPanel
            previewSummary={analytics.previewSummary}
            chartCols={editorSaveData?.chartCols || []}
            title={moduleConfig.charts.barTitle}
            subtitle={moduleConfig.charts.barSubtitle}
          />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: 18,
            }}
          >
            <DonutChartCard
              title={moduleConfig.charts.pieTitle}
              subtitle={moduleConfig.charts.pieSubtitle}
              data={analytics.previewSummary.categoryDistribution}
            />
            <BarChartCard
              title={moduleConfig.charts.barTitle}
              subtitle={moduleConfig.charts.barSubtitle}
              data={analytics.previewSummary.totalsByColumn}
            />
            <LineChartCard
              title={moduleConfig.charts.lineTitle}
              subtitle={moduleConfig.charts.lineSubtitle}
              data={analytics.previewSummary.timelineData.length ? analytics.previewSummary.timelineData : analytics.monthlyActivity}
            />
          </div>
        </Stack>
      </div>

      {showSheetsManager ? <GoogleSheetsManager onClose={() => setShowSheetsManager(false)} /> : null}
    </ScreenLayout>
  );
};

export const ComprasModuleScreen = ({ moduleConfig }) => (
  <GoogleSheetsProvider>
    <ModuleContent moduleConfig={moduleConfig} />
  </GoogleSheetsProvider>
);

export default ComprasModuleScreen;
