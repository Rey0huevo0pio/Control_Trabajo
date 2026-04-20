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

const cfg = comprasModulesConfig.presupuesto;

// ─── Partidas ────────────────────────────────────────────────────────────────
const TabPartidas = ({ rows, headers }) => {
  const partidaCol = headers.find((h) => /partida|concepto|descripcion|cuenta/i.test(h));
  const montoCol = headers.find((h) => /monto|importe|presupuesto|total|asignado/i.test(h));
  const gastoCol = headers.find((h) => /gasto|real|ejecutado|ejercido/i.test(h));

  if (!rows.length) return <EmptyTab text="Carga un archivo de presupuesto para ver las partidas." />;

  const partidas = rows.map((row) => {
    const asignado = parseMoney(montoCol ? row[montoCol] : 0);
    const ejercido = parseMoney(gastoCol ? row[gastoCol] : 0);
    const disponible = asignado - ejercido;
    const pct = asignado > 0 ? Math.min(100, (ejercido / asignado) * 100) : 0;
    return { nombre: String(row[partidaCol] || row[headers[0]] || '-'), asignado, ejercido, disponible, pct };
  }).filter((p) => p.nombre !== '-' || p.asignado > 0);

  return (
    <Stack gap="16px">
      <div style={{ overflowX: 'auto', borderRadius: 12, border: '1px solid #E2E8F0' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#FFF' }}>
          <thead>
            <tr style={{ backgroundColor: '#FFF7ED' }}>
              {['Partida', 'Asignado', 'Ejercido', 'Disponible', 'Avance'].map((h) => (
                <th key={h} style={{ textAlign: 'left', padding: '10px 14px', fontSize: 12, color: '#92400E', borderBottom: '1px solid #FED7AA' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {partidas.map((p, i) => (
              <tr key={i} style={{ backgroundColor: i % 2 === 0 ? '#FFF' : '#FFFBEB' }}>
                <td style={tdStyle}>{p.nombre}</td>
                <td style={tdStyle}>{fmt(p.asignado)}</td>
                <td style={tdStyle}>{fmt(p.ejercido)}</td>
                <td style={{ ...tdStyle, color: p.disponible < 0 ? '#DC2626' : '#059669', fontWeight: 600 }}>{fmt(p.disponible)}</td>
                <td style={{ ...tdStyle, minWidth: 140 }}>
                  <HStack gap="8px" align="center">
                    <div style={{ flex: 1, height: 8, borderRadius: 999, backgroundColor: '#E2E8F0', overflow: 'hidden' }}>
                      <div style={{ width: `${p.pct}%`, height: '100%', borderRadius: 999, backgroundColor: p.pct > 90 ? '#DC2626' : p.pct > 70 ? '#F59E0B' : '#059669' }} />
                    </div>
                    <Text variant="caption" color="#475569">{p.pct.toFixed(0)}%</Text>
                  </HStack>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Stack>
  );
};

// ─── Gasto Real ──────────────────────────────────────────────────────────────
const TabGastoReal = ({ rows, headers, analytics }) => {
  const gastoCol = headers.find((h) => /gasto|real|ejecutado|ejercido/i.test(h));
  const presupCol = headers.find((h) => /presupuesto|asignado|planeado|monto/i.test(h));

  const comparativo = gastoCol && presupCol
    ? rows.slice(0, 12).map((row, i) => ({
        label: String(row[headers[0]] || `Fila ${i + 1}`).slice(0, 20),
        planeado: parseMoney(row[presupCol]),
        real: parseMoney(row[gastoCol]),
      }))
    : [];

  const totalReal = comparativo.reduce((s, r) => s + r.real, 0);
  const totalPlan = comparativo.reduce((s, r) => s + r.planeado, 0);
  const variacion = totalPlan > 0 ? ((totalReal - totalPlan) / totalPlan) * 100 : 0;

  return (
    <Stack gap="16px">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
        <KpiMini label="Gasto real total" value={fmt(totalReal)} color="#EA580C" bg="#FFF7ED" />
        <KpiMini label="Presupuesto total" value={fmt(totalPlan)} color="#2563EB" bg="#EFF6FF" />
        <KpiMini label="Variación" value={`${variacion > 0 ? '+' : ''}${variacion.toFixed(1)}%`} color={variacion > 0 ? '#DC2626' : '#059669'} bg={variacion > 0 ? '#FEF2F2' : '#F0FDF4'} />
      </div>
      {comparativo.length ? (
        <Card variant="outlined">
          <Stack gap="12px">
            <Text variant="h5">Planeado vs Real</Text>
            {comparativo.map((item, i) => (
              <Stack key={i} gap="4px">
                <HStack justify="space-between">
                  <Text variant="bodySmall">{item.label}</Text>
                  <Text variant="caption" color="#64748B">{fmt(item.real)} / {fmt(item.planeado)}</Text>
                </HStack>
                <div style={{ position: 'relative', height: 10, borderRadius: 999, backgroundColor: '#E2E8F0' }}>
                  <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', borderRadius: 999, width: `${item.planeado > 0 ? Math.min(100, (item.planeado / Math.max(item.planeado, item.real)) * 100) : 0}%`, backgroundColor: '#BFDBFE' }} />
                  <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', borderRadius: 999, width: `${item.planeado > 0 ? Math.min(100, (item.real / Math.max(item.planeado, item.real)) * 100) : 0}%`, backgroundColor: item.real > item.planeado ? '#DC2626' : '#EA580C', opacity: 0.85 }} />
                </div>
              </Stack>
            ))}
          </Stack>
        </Card>
      ) : (
        <BarChartCard title="Totales por columna" subtitle="Columnas numéricas detectadas en el archivo." data={analytics.previewSummary.totalsByColumn} />
      )}
    </Stack>
  );
};

// ─── Alertas ─────────────────────────────────────────────────────────────────
const TabAlertas = ({ rows, headers }) => {
  const montoCol = headers.find((h) => /monto|importe|presupuesto|total|asignado/i.test(h));
  const gastoCol = headers.find((h) => /gasto|real|ejecutado|ejercido/i.test(h));
  const nombreCol = headers.find((h) => /partida|concepto|descripcion|nombre/i.test(h)) || headers[0];

  const alertas = rows
    .map((row) => {
      const asignado = parseMoney(montoCol ? row[montoCol] : 0);
      const ejercido = parseMoney(gastoCol ? row[gastoCol] : 0);
      const pct = asignado > 0 ? (ejercido / asignado) * 100 : 0;
      return { nombre: String(row[nombreCol] || '-'), asignado, ejercido, pct, excedido: ejercido > asignado };
    })
    .filter((a) => a.pct >= 80 || a.excedido)
    .sort((a, b) => b.pct - a.pct);

  if (!alertas.length) {
    return (
      <Card variant="outlined" style={{ backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0' }}>
        <Stack align="center" style={{ padding: 32 }}>
          <span style={{ fontSize: 40 }}>✅</span>
          <Text variant="h5" color="#166534">Sin alertas activas</Text>
          <Text variant="bodySmall" color="#15803D">Todas las partidas están dentro del presupuesto asignado.</Text>
        </Stack>
      </Card>
    );
  }

  return (
    <Stack gap="12px">
      <Text variant="bodySmall" color="#64748B">{alertas.length} partida(s) con sobreconsumo o riesgo detectado.</Text>
      {alertas.map((a, i) => (
        <Card key={i} variant="outlined" style={{ border: `1px solid ${a.excedido ? '#FECACA' : '#FDE68A'}`, backgroundColor: a.excedido ? '#FEF2F2' : '#FFFBEB' }}>
          <HStack justify="space-between" align="center" style={{ flexWrap: 'wrap', gap: 8 }}>
            <Stack gap="4px">
              <HStack gap="8px" align="center">
                <span style={{ fontSize: 18 }}>{a.excedido ? '🚨' : '⚠️'}</span>
                <Text variant="h6">{a.nombre}</Text>
              </HStack>
              <Text variant="caption" color="#64748B">Ejercido: {fmt(a.ejercido)} / Asignado: {fmt(a.asignado)}</Text>
            </Stack>
            <span style={{ padding: '4px 12px', borderRadius: 999, fontSize: 13, fontWeight: 700, backgroundColor: a.excedido ? '#DC2626' : '#F59E0B', color: '#FFF' }}>
              {a.pct.toFixed(0)}%
            </span>
          </HStack>
        </Card>
      ))}
    </Stack>
  );
};

// ─── Periodos ─────────────────────────────────────────────────────────────────
const TabPeriodos = ({ rows, headers, analytics }) => {
  const fechaCol = headers.find((h) => /fecha|date|periodo|mes|trimestre/i.test(h));
  const montoCol = headers.find((h) => /monto|importe|gasto|total|ejercido/i.test(h));

  const periodos = fechaCol
    ? Object.entries(
        rows.reduce((acc, row) => {
          const raw = String(row[fechaCol] || '').trim();
          if (!raw) return acc;
          let label = raw;
          const d = new Date(raw);
          if (!isNaN(d.getTime())) label = d.toLocaleDateString('es-MX', { month: 'short', year: 'numeric' });
          acc[label] = (acc[label] || 0) + parseMoney(montoCol ? row[montoCol] : 1);
          return acc;
        }, {})
      ).map(([label, value]) => ({ label, value }))
    : analytics.previewSummary.timelineData;

  return (
    <Stack gap="16px">
      {periodos.length ? (
        <>
          <LineChartCard title="Gasto por periodo" subtitle="Comportamiento del presupuesto en el tiempo." data={periodos.slice(0, 12)} />
          <BarChartCard title="Montos por periodo" subtitle="Acumulado por mes o periodo detectado." data={periodos.slice(0, 10)} />
        </>
      ) : (
        <EmptyTab text="No se detectó columna de fecha o periodo en el archivo." />
      )}
    </Stack>
  );
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
const fmt = (v) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(v || 0);
const tdStyle = { padding: '10px 14px', fontSize: 13, color: '#0F172A', borderBottom: '1px solid #F1F5F9' };

const KpiMini = ({ label, value, color, bg }) => (
  <Card variant="outlined" style={{ backgroundColor: bg, border: `1px solid ${color}33` }}>
    <Stack gap="4px">
      <Text variant="caption" color="#64748B">{label}</Text>
      <Text variant="h4" color={color}>{value}</Text>
    </Stack>
  </Card>
);

const EmptyTab = ({ text }) => (
  <Card variant="outlined">
    <div style={{ minHeight: 180, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Text variant="bodySmall" color="#64748B">{text}</Text>
    </div>
  </Card>
);

const TABS = cfg.options.map((o) => ({ id: o.title, icon: o.icon, label: o.title }));

// ─── Screen ───────────────────────────────────────────────────────────────────
const PresupuestoContent = () => {
  const navigate = useNavigate();
  const {
    moduleSheets, loadSpreadsheets,
    showSheetsManager, setShowSheetsManager,
    selectedSpreadsheet, setSelectedSpreadsheet,
    setSelectedSheetName, sheetNames, activeSheetName,
    previewLoading, previewError,
    editorSaveData, setEditorSaveData,
    activeTab, setActiveTab,
    analytics,
  } = useModuleScreen('presupuesto');

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
      {/* Header */}
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

          {/* Tabs de opciones */}
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

              {activeTab === 'Partidas' && <TabPartidas rows={rows} headers={headers} />}
              {activeTab === 'Gasto real' && <TabGastoReal rows={rows} headers={headers} analytics={analytics} />}
              {activeTab === 'Alertas' && <TabAlertas rows={rows} headers={headers} />}
              {activeTab === 'Periodos' && <TabPeriodos rows={rows} headers={headers} analytics={analytics} />}
            </Stack>
          </Card>

          <SpreadsheetPreviewPanel
            spreadsheets={moduleSheets} selectedSpreadsheetId={selectedSpreadsheet?.id}
            onSelectSpreadsheet={(sheet) => { setSelectedSpreadsheet(sheet); setSelectedSheetName(null); }}
            previewSummary={analytics.previewSummary}
            previewLoading={previewLoading} previewError={previewError}
            onRefresh={() => loadSpreadsheets(true)} onOpenManager={() => setShowSheetsManager(true)}
            sheetNames={sheetNames} activeSheetName={activeSheetName} onSelectSheet={setSelectedSheetName}
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

export const PresupuestoScreen = () => (
  <GoogleSheetsProvider><PresupuestoContent /></GoogleSheetsProvider>
);

export default PresupuestoScreen;
