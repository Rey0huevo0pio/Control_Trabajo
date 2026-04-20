import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Text, Card, Stack, HStack, ScreenLayout, IconButton } from '../../components/design-system';
import { GoogleSheetsProvider } from '../hooks/GoogleSheetsProvider';
import { useModuleScreen } from '../hooks/useModuleScreen.js';
import { GoogleSheetsManager } from '../components/GoogleSheetsManager.jsx';
import {
  BarChartCard, ChartBuilderPanel, DonutChartCard,
  ExcelEditorPanel, KpiCards, LineChartCard, SpreadsheetPreviewPanel,
} from '../components/ComprasDashboard.jsx';
import { parseMoney } from '../hooks/useComprasAnalytics.js';
import { comprasModulesConfig } from '../lib/comprasModules.config.js';

const cfg = comprasModulesConfig.ordenes;

// ─── Ordenes Activas ──────────────────────────────────────────────────────────
const TabOrdenesActivas = ({ rows, headers }) => {
  const estatusCol = headers.find((h) => /estatus|estado|status/i.test(h));
  const activas = estatusCol
    ? rows.filter((r) => /abierto|activo|pendiente|en proceso/i.test(String(r[estatusCol] || '')))
    : rows;

  if (!activas.length) return <EmptyTab text="No se detectaron órdenes activas en el archivo." />;

  return (
    <Stack gap="12px">
      <Text variant="bodySmall" color="#64748B">{activas.length} orden(es) activa(s).</Text>
      <div style={{ overflowX: 'auto', borderRadius: 12, border: '1px solid #E2E8F0' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#FFF' }}>
          <thead><tr style={{ backgroundColor: '#F5F3FF' }}>{headers.slice(0, 7).map((h) => <th key={h} style={{ ...thStyle, color: '#5B21B6' }}>{h}</th>)}</tr></thead>
          <tbody>{activas.map((row, i) => (
            <tr key={i} style={{ backgroundColor: i % 2 === 0 ? '#FFF' : '#FAFAFA' }}>
              {headers.slice(0, 7).map((h) => <td key={h} style={tdStyle}>{String(row[h] || '-')}</td>)}
            </tr>
          ))}</tbody>
        </table>
      </div>
    </Stack>
  );
};

// ─── Autorizaciones ───────────────────────────────────────────────────────────
const TabAutorizaciones = ({ rows, headers }) => {
  const estatusCol = headers.find((h) => /estatus|estado|status|autorizacion/i.test(h));
  const montoCol = headers.find((h) => /monto|importe|total/i.test(h));
  const pendAuth = estatusCol
    ? rows.filter((r) => /por autorizar|pendiente|revision|espera/i.test(String(r[estatusCol] || '')))
    : rows.slice(0, 20);

  const total = pendAuth.reduce((s, r) => s + parseMoney(montoCol ? r[montoCol] : 0), 0);
  const fmt = (v) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(v);

  return (
    <Stack gap="16px">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
        <KpiMini label="Por autorizar" value={pendAuth.length} color="#7C3AED" bg="#F5F3FF" />
        {montoCol && <KpiMini label="Monto pendiente" value={fmt(total)} color="#EA580C" bg="#FFF7ED" />}
      </div>
      {pendAuth.length ? (
        <div style={{ overflowX: 'auto', borderRadius: 12, border: '1px solid #DDD6FE' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#FFF' }}>
            <thead><tr style={{ backgroundColor: '#F5F3FF' }}>{headers.slice(0, 6).map((h) => <th key={h} style={{ ...thStyle, color: '#5B21B6' }}>{h}</th>)}</tr></thead>
            <tbody>{pendAuth.map((row, i) => (
              <tr key={i} style={{ backgroundColor: i % 2 === 0 ? '#FFF' : '#FAFAFA' }}>
                {headers.slice(0, 6).map((h) => <td key={h} style={tdStyle}>{String(row[h] || '-')}</td>)}
              </tr>
            ))}</tbody>
          </table>
        </div>
      ) : <EmptyTab text="No hay órdenes pendientes de autorización." />}
    </Stack>
  );
};

// ─── Recepcion ────────────────────────────────────────────────────────────────
const TabRecepcion = ({ rows, headers }) => {
  const estatusCol = headers.find((h) => /estatus|estado|status|recepcion/i.test(h));
  const recibidas = estatusCol
    ? rows.filter((r) => /recibido|surtido|entregado|completado/i.test(String(r[estatusCol] || '')))
    : [];
  const pendientes = estatusCol
    ? rows.filter((r) => /pendiente|en camino|transito|espera/i.test(String(r[estatusCol] || '')))
    : rows;

  return (
    <Stack gap="16px">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
        <KpiMini label="Recibidas" value={recibidas.length} color="#059669" bg="#F0FDF4" />
        <KpiMini label="Pendientes de recibir" value={pendientes.length} color="#F59E0B" bg="#FFFBEB" />
        <KpiMini label="Total órdenes" value={rows.length} color="#7C3AED" bg="#F5F3FF" />
      </div>
      {pendientes.length > 0 && (
        <Card variant="outlined" style={{ border: '1px solid #FDE68A', backgroundColor: '#FFFBEB' }}>
          <Stack gap="8px">
            <Text variant="h6" color="#92400E">Pendientes de recepción ({pendientes.length})</Text>
            {pendientes.slice(0, 6).map((row, i) => (
              <Text key={i} variant="bodySmall" color="#475569">• {String(row[headers[0]] || '-')}</Text>
            ))}
            {pendientes.length > 6 && <Text variant="caption" color="#94A3B8">+{pendientes.length - 6} más...</Text>}
          </Stack>
        </Card>
      )}
      <DonutChartCard title="Estado de recepciones" subtitle="Distribución por estatus detectado." data={[
        { label: 'Recibidas', value: recibidas.length, color: '#059669' },
        { label: 'Pendientes', value: pendientes.length, color: '#F59E0B' },
        { label: 'Otros', value: Math.max(0, rows.length - recibidas.length - pendientes.length), color: '#94A3B8' },
      ].filter((d) => d.value > 0)} />
    </Stack>
  );
};

// ─── Incidencias ──────────────────────────────────────────────────────────────
const TabIncidencias = ({ rows, headers }) => {
  const estatusCol = headers.find((h) => /estatus|estado|status/i.test(h));
  const incidencias = estatusCol
    ? rows.filter((r) => /cancelado|retraso|diferencia|incidencia|problema|rechazado/i.test(String(r[estatusCol] || '')))
    : [];

  if (!incidencias.length) return (
    <Card variant="outlined" style={{ backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0' }}>
      <Stack align="center" style={{ padding: 32 }}>
        <span style={{ fontSize: 40 }}>✅</span>
        <Text variant="h5" color="#166534">Sin incidencias detectadas</Text>
        <Text variant="bodySmall" color="#15803D">No se encontraron cancelaciones, retrasos ni diferencias.</Text>
      </Stack>
    </Card>
  );

  return (
    <Stack gap="12px">
      <Text variant="bodySmall" color="#DC2626">{incidencias.length} incidencia(s) detectada(s).</Text>
      {incidencias.map((row, i) => (
        <Card key={i} variant="outlined" style={{ border: '1px solid #FECACA', backgroundColor: '#FEF2F2' }}>
          <HStack gap="10px" align="flex-start">
            <span style={{ fontSize: 20 }}>⚠️</span>
            <Stack gap="4px">
              {headers.slice(0, 4).map((h) => (
                <Text key={h} variant="bodySmall" color="#475569"><strong>{h}:</strong> {String(row[h] || '-')}</Text>
              ))}
            </Stack>
          </HStack>
        </Card>
      ))}
    </Stack>
  );
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
const thStyle = { textAlign: 'left', padding: '10px 14px', fontSize: 12, color: '#475569', borderBottom: '1px solid #E2E8F0' };
const tdStyle = { padding: '10px 14px', fontSize: 13, color: '#0F172A', borderBottom: '1px solid #F1F5F9' };
const KpiMini = ({ label, value, color, bg }) => (
  <Card variant="outlined" style={{ backgroundColor: bg, border: `1px solid ${color}33` }}>
    <Stack gap="4px"><Text variant="caption" color="#64748B">{label}</Text><Text variant="h4" color={color}>{value}</Text></Stack>
  </Card>
);
const EmptyTab = ({ text }) => (
  <Card variant="outlined"><div style={{ minHeight: 180, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Text variant="bodySmall" color="#64748B">{text}</Text></div></Card>
);

const TABS = cfg.options.map((o) => ({ id: o.title, icon: o.icon, label: o.title }));

// ─── Screen ───────────────────────────────────────────────────────────────────
const OrdenesContent = () => {
  const navigate = useNavigate();
  const {
    moduleSheets, loading, loadSpreadsheets,
    showSheetsManager, setShowSheetsManager,
    selectedSpreadsheet, setSelectedSpreadsheet,
    previewData, previewLoading, previewError,
    editorSaveData, setEditorSaveData,
    activeTab, setActiveTab,
    analytics,
  } = useModuleScreen('ordenes');

  const rows = analytics.previewSummary.table.rows;
  const headers = analytics.previewSummary.table.headers;

  const kpiItems = [
    { label: `Archivos de ${cfg.name}`, value: moduleSheets.length, helper: cfg.hero.helper, icon: cfg.iconShort, color: cfg.color, background: cfg.softColor, borderColor: `${cfg.color}55` },
    { label: 'Google Sheets', value: moduleSheets.filter((s) => s.mimeType?.includes('google-apps.spreadsheet')).length, helper: 'Listos para vista previa.', icon: 'GS', color: '#15803D', background: '#F0FDF4', borderColor: '#BBF7D0' },
    { label: 'Excel', value: moduleSheets.filter((s) => !s.mimeType?.includes('google-apps.spreadsheet')).length, helper: 'Disponibles para descarga.', icon: 'XL', color: '#B45309', background: '#FFFBEB', borderColor: '#FDE68A' },
    { label: 'Registros', value: analytics.previewSummary.rowCount, helper: 'Filas en el archivo seleccionado.', icon: 'RG', color: '#7C3AED', background: '#F5F3FF', borderColor: '#DDD6FE' },
  ];

  return (
    <ScreenLayout padding="0" backgroundColor="#F8FAFC">
      <div style={{ background: `linear-gradient(135deg, ${cfg.color} 0%, ${cfg.darkColor} 100%)`, padding: '28px 32px 34px', color: '#FFF' }}>
        <HStack justify="space-between" align="flex-start" style={{ flexWrap: 'wrap', gap: 18 }}>
          <HStack gap="12px" align="center">
            <div style={{ width: 52, height: 52, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.16)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>{cfg.icon}</div>
            <Stack gap="4px">
              <Text variant="h3" color="#FFF">{cfg.name}</Text>
              <Text variant="bodySmall" color="rgba(255,255,255,0.8)">{cfg.subtitle}</Text>
            </Stack>
          </HStack>
          <HStack gap="8px">
            <IconButton icon={<span style={{ fontSize: 18, fontWeight: 700 }}>CM</span>} onClick={() => navigate('/compras')} style={{ backgroundColor: 'rgba(255,255,255,0.14)', color: '#FFF', borderRadius: 14 }} title="Volver a compras" />
            <IconButton icon={<span style={{ fontSize: 18, fontWeight: 700 }}>GO</span>} onClick={() => setShowSheetsManager(true)} style={{ backgroundColor: 'rgba(255,255,255,0.14)', color: '#FFF', borderRadius: 14 }} title="Gestionar archivos" />
          </HStack>
        </HStack>
      </div>

      <div style={{ padding: 32 }}>
        <Stack gap="24px">
          <KpiCards items={kpiItems} />

          <Card variant="outlined" style={{ border: `1px solid ${cfg.color}33` }}>
            <Stack gap="16px">
              <HStack gap="8px" style={{ flexWrap: 'wrap' }}>
                {TABS.map((tab) => (
                  <button key={tab.id} onClick={() => setActiveTab(activeTab === tab.id ? null : tab.id)}
                    style={{ padding: '10px 18px', borderRadius: 999, border: `1px solid ${activeTab === tab.id ? cfg.color : '#E2E8F0'}`, backgroundColor: activeTab === tab.id ? cfg.softColor : '#F8FAFC', color: activeTab === tab.id ? cfg.darkColor : '#475569', fontWeight: activeTab === tab.id ? 700 : 400, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span>{tab.icon}</span> {tab.label}
                  </button>
                ))}
                {activeTab && <button onClick={() => setActiveTab(null)} style={{ padding: '10px 14px', borderRadius: 999, border: '1px solid #E2E8F0', backgroundColor: '#FFF', color: '#94A3B8', fontSize: 13, cursor: 'pointer' }}>✕ Cerrar</button>}
              </HStack>

              {activeTab === 'Ordenes activas' && <TabOrdenesActivas rows={rows} headers={headers} />}
              {activeTab === 'Autorizaciones' && <TabAutorizaciones rows={rows} headers={headers} />}
              {activeTab === 'Recepcion' && <TabRecepcion rows={rows} headers={headers} />}
              {activeTab === 'Incidencias' && <TabIncidencias rows={rows} headers={headers} />}
            </Stack>
          </Card>

          <SpreadsheetPreviewPanel
            spreadsheets={moduleSheets} selectedSpreadsheetId={selectedSpreadsheet?.id}
            onSelectSpreadsheet={setSelectedSpreadsheet} previewSummary={analytics.previewSummary}
            previewLoading={previewLoading} previewError={previewError}
            onRefresh={() => loadSpreadsheets(true)} onOpenManager={() => setShowSheetsManager(true)}
          />

          <ExcelEditorPanel previewSummary={analytics.previewSummary} onSave={setEditorSaveData} />
          <ChartBuilderPanel previewSummary={analytics.previewSummary} chartCols={editorSaveData?.chartCols || []} title={cfg.charts.barTitle} subtitle={cfg.charts.barSubtitle} />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 18 }}>
            <DonutChartCard title={cfg.charts.pieTitle} subtitle={cfg.charts.pieSubtitle} data={analytics.previewSummary.categoryDistribution} />
            <BarChartCard title={cfg.charts.barTitle} subtitle={cfg.charts.barSubtitle} data={analytics.previewSummary.totalsByColumn} />
            <LineChartCard title={cfg.charts.lineTitle} subtitle={cfg.charts.lineSubtitle} data={analytics.previewSummary.timelineData.length ? analytics.previewSummary.timelineData : analytics.monthlyActivity} />
          </div>
        </Stack>
      </div>

      {showSheetsManager && <GoogleSheetsManager onClose={() => setShowSheetsManager(false)} />}
    </ScreenLayout>
  );
};

export const OrdenesScreen = () => (
  <GoogleSheetsProvider><OrdenesContent /></GoogleSheetsProvider>
);

export default OrdenesScreen;
