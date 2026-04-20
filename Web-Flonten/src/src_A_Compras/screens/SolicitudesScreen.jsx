import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Text, Card, Stack, HStack, ScreenLayout, IconButton, Button } from '../../components/design-system';
import { GoogleSheetsProvider } from '../hooks/GoogleSheetsProvider';
import { useModuleScreen } from '../hooks/useModuleScreen.js';
import { GoogleSheetsManager } from '../components/GoogleSheetsManager.jsx';
import {
  BarChartCard, ChartBuilderPanel, DonutChartCard,
  ExcelEditorPanel, KpiCards, LineChartCard, SpreadsheetPreviewPanel,
} from '../components/ComprasDashboard.jsx';
import { parseMoney } from '../hooks/useComprasAnalytics.js';
import { comprasModulesConfig } from '../lib/comprasModules.config.js';

const cfg = comprasModulesConfig.solicitudes;

// ─── Nueva Solicitud ──────────────────────────────────────────────────────────
const TabNuevaSolicitud = ({ rows, headers }) => {
  const [form, setForm] = React.useState({ descripcion: '', cantidad: '', monto: '', prioridad: 'Normal', area: '' });
  const [saved, setSaved] = React.useState(false);

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2500); };

  return (
    <Stack gap="16px">
      <Card variant="outlined" style={{ border: '1px solid #BFDBFE', backgroundColor: '#EFF6FF' }}>
        <Stack gap="14px">
          <Text variant="h5">Nueva solicitud de compra</Text>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
            {[
              { label: 'Descripción / Artículo', key: 'descripcion', placeholder: 'Ej. Papel bond tamaño carta' },
              { label: 'Cantidad', key: 'cantidad', placeholder: 'Ej. 10' },
              { label: 'Monto estimado', key: 'monto', placeholder: 'Ej. 1500.00' },
              { label: 'Área solicitante', key: 'area', placeholder: 'Ej. Administración' },
            ].map(({ label, key, placeholder }) => (
              <Stack key={key} gap="4px">
                <Text variant="caption" color="#475569">{label}</Text>
                <input value={form[key]} onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))} placeholder={placeholder}
                  style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #BFDBFE', fontSize: 13, color: '#0F172A', backgroundColor: '#FFF', outline: 'none' }} />
              </Stack>
            ))}
            <Stack gap="4px">
              <Text variant="caption" color="#475569">Prioridad</Text>
              <select value={form.prioridad} onChange={(e) => setForm((p) => ({ ...p, prioridad: e.target.value }))}
                style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #BFDBFE', fontSize: 13, color: '#0F172A', backgroundColor: '#FFF' }}>
                {['Baja', 'Normal', 'Alta', 'Urgente'].map((p) => <option key={p}>{p}</option>)}
              </select>
            </Stack>
          </div>
          <HStack justify="flex-end">
            <Button onClick={handleSave} style={{ width: 'auto' }}>{saved ? '✓ Registrada' : 'Registrar solicitud'}</Button>
          </HStack>
        </Stack>
      </Card>
      {rows.length > 0 && (
        <Card variant="outlined">
          <Text variant="h6" style={{ marginBottom: 10 }}>Últimas solicitudes en el archivo ({rows.length})</Text>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr style={{ backgroundColor: '#F8FAFC' }}>{headers.slice(0, 6).map((h) => <th key={h} style={thStyle}>{h}</th>)}</tr></thead>
              <tbody>{rows.slice(0, 8).map((row, i) => <tr key={i}>{headers.slice(0, 6).map((h) => <td key={h} style={tdStyle}>{String(row[h] || '-')}</td>)}</tr>)}</tbody>
            </table>
          </div>
        </Card>
      )}
    </Stack>
  );
};

// ─── Pendientes ───────────────────────────────────────────────────────────────
const TabPendientes = ({ rows, headers }) => {
  const estatusCol = headers.find((h) => /estatus|estado|status/i.test(h));
  const pendientes = estatusCol
    ? rows.filter((r) => /pendiente|abierto|en proceso|por aprobar/i.test(String(r[estatusCol] || '')))
    : rows;

  if (!pendientes.length) return <EmptyTab text="No se detectaron solicitudes pendientes en el archivo." />;

  return (
    <Stack gap="12px">
      <Text variant="bodySmall" color="#64748B">{pendientes.length} solicitud(es) pendiente(s).</Text>
      <div style={{ overflowX: 'auto', borderRadius: 12, border: '1px solid #E2E8F0' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#FFF' }}>
          <thead><tr style={{ backgroundColor: '#EFF6FF' }}>{headers.slice(0, 6).map((h) => <th key={h} style={{ ...thStyle, color: '#1D4ED8' }}>{h}</th>)}</tr></thead>
          <tbody>{pendientes.map((row, i) => (
            <tr key={i} style={{ backgroundColor: i % 2 === 0 ? '#FFF' : '#F8FAFC' }}>
              {headers.slice(0, 6).map((h) => <td key={h} style={tdStyle}>{String(row[h] || '-')}</td>)}
            </tr>
          ))}</tbody>
        </table>
      </div>
    </Stack>
  );
};

// ─── Prioridades ──────────────────────────────────────────────────────────────
const TabPrioridades = ({ rows, headers }) => {
  const prioCol = headers.find((h) => /prioridad|urgencia|priority/i.test(h));
  const montoCol = headers.find((h) => /monto|importe|total/i.test(h));

  const grupos = prioCol
    ? ['Urgente', 'Alta', 'Normal', 'Baja'].map((nivel) => ({
        nivel,
        items: rows.filter((r) => String(r[prioCol] || '').toLowerCase().includes(nivel.toLowerCase())),
        color: nivel === 'Urgente' ? '#DC2626' : nivel === 'Alta' ? '#F59E0B' : nivel === 'Normal' ? '#2563EB' : '#64748B',
        bg: nivel === 'Urgente' ? '#FEF2F2' : nivel === 'Alta' ? '#FFFBEB' : nivel === 'Normal' ? '#EFF6FF' : '#F8FAFC',
      })).filter((g) => g.items.length)
    : [];

  if (!grupos.length) return (
    <Stack gap="12px">
      <EmptyTab text="No se detectó columna de prioridad. Mostrando todos los registros." />
      <BarChartCard title="Distribución de solicitudes" subtitle="Por columna detectada en el archivo." data={rows.slice(0, 8).map((r, i) => ({ label: String(r[headers[0]] || `Fila ${i + 1}`).slice(0, 20), value: parseMoney(montoCol ? r[montoCol] : 1) || 1 }))} />
    </Stack>
  );

  return (
    <Stack gap="12px">
      {grupos.map((g) => (
        <Card key={g.nivel} variant="outlined" style={{ border: `1px solid ${g.color}33`, backgroundColor: g.bg }}>
          <Stack gap="8px">
            <HStack justify="space-between">
              <Text variant="h6" color={g.color}>{g.nivel} ({g.items.length})</Text>
              {montoCol && <Text variant="caption" color="#64748B">Total: {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(g.items.reduce((s, r) => s + parseMoney(r[montoCol]), 0))}</Text>}
            </HStack>
            {g.items.slice(0, 3).map((row, i) => (
              <Text key={i} variant="bodySmall" color="#475569">• {String(row[headers[0]] || '-')}</Text>
            ))}
            {g.items.length > 3 && <Text variant="caption" color="#94A3B8">+{g.items.length - 3} más...</Text>}
          </Stack>
        </Card>
      ))}
    </Stack>
  );
};

// ─── Historial ────────────────────────────────────────────────────────────────
const TabHistorial = ({ rows, headers, analytics }) => {
  const estatusCol = headers.find((h) => /estatus|estado|status/i.test(h));
  const cerradas = estatusCol
    ? rows.filter((r) => /cerrado|concluido|completado|surtido|cancelado/i.test(String(r[estatusCol] || '')))
    : rows;

  return (
    <Stack gap="16px">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
        <KpiMini label="Total registros" value={rows.length} color="#2563EB" bg="#EFF6FF" />
        <KpiMini label="Concluidas" value={cerradas.length} color="#059669" bg="#F0FDF4" />
        <KpiMini label="Columnas" value={headers.length} color="#7C3AED" bg="#F5F3FF" />
      </div>
      <DonutChartCard title="Distribución por estatus" subtitle="Categorías detectadas en el archivo." data={analytics.previewSummary.categoryDistribution} />
      <LineChartCard title="Actividad histórica" subtitle="Solicitudes por fecha o periodo." data={analytics.previewSummary.timelineData.length ? analytics.previewSummary.timelineData : analytics.monthlyActivity} />
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
const SolicitudesContent = () => {
  const navigate = useNavigate();
  const {
    moduleSheets, loadSpreadsheets,
    showSheetsManager, setShowSheetsManager,
    selectedSpreadsheet, setSelectedSpreadsheet,
    previewLoading, previewError,
    editorSaveData, setEditorSaveData,
    activeTab, setActiveTab,
    analytics,
  } = useModuleScreen('solicitudes');

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

              {activeTab === 'Nueva solicitud' && <TabNuevaSolicitud rows={rows} headers={headers} />}
              {activeTab === 'Pendientes' && <TabPendientes rows={rows} headers={headers} />}
              {activeTab === 'Prioridades' && <TabPrioridades rows={rows} headers={headers} />}
              {activeTab === 'Historial' && <TabHistorial rows={rows} headers={headers} analytics={analytics} />}
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

export const SolicitudesScreen = () => (
  <GoogleSheetsProvider><SolicitudesContent /></GoogleSheetsProvider>
);

export default SolicitudesScreen;
