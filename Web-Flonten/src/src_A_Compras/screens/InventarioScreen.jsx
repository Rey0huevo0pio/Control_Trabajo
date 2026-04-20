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

const cfg = comprasModulesConfig.inventario;

// ─── Existencias ──────────────────────────────────────────────────────────────
const TabExistencias = ({ rows, headers }) => {
  const nombreCol = headers.find((h) => /articulo|producto|material|descripcion|nombre/i.test(h)) || headers[0];
  const stockCol = headers.find((h) => /stock|existencia|cantidad|disponible/i.test(h));
  const minimoCol = headers.find((h) => /minimo|min|punto reorden/i.test(h));
  const [filtro, setFiltro] = React.useState('todos');

  const items = rows.map((row) => ({
    nombre: String(row[nombreCol] || '-').slice(0, 35),
    stock: parseMoney(stockCol ? row[stockCol] : 0),
    minimo: parseMoney(minimoCol ? row[minimoCol] : 0),
    critico: stockCol && minimoCol ? parseMoney(row[stockCol]) <= parseMoney(row[minimoCol]) : false,
  }));

  const filtrados = filtro === 'critico' ? items.filter((i) => i.critico) : items;

  return (
    <Stack gap="16px">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
        <KpiMini label="Total artículos" value={items.length} color="#0F766E" bg="#F0FDFA" />
        <KpiMini label="Stock crítico" value={items.filter((i) => i.critico).length} color="#DC2626" bg="#FEF2F2" />
        {stockCol && <KpiMini label="Unidades totales" value={items.reduce((s, i) => s + i.stock, 0)} color="#2563EB" bg="#EFF6FF" />}
      </div>

      <HStack gap="8px">
        {['todos', 'critico'].map((f) => (
          <button key={f} onClick={() => setFiltro(f)}
            style={{ padding: '8px 16px', borderRadius: 999, border: `1px solid ${filtro === f ? cfg.color : '#E2E8F0'}`, backgroundColor: filtro === f ? cfg.softColor : '#F8FAFC', color: filtro === f ? cfg.darkColor : '#475569', fontSize: 13, cursor: 'pointer', fontWeight: filtro === f ? 700 : 400 }}>
            {f === 'todos' ? `Todos (${items.length})` : `⚠️ Críticos (${items.filter((i) => i.critico).length})`}
          </button>
        ))}
      </HStack>

      <div style={{ overflowX: 'auto', borderRadius: 12, border: '1px solid #E2E8F0' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#FFF' }}>
          <thead><tr style={{ backgroundColor: '#F0FDFA' }}>{[nombreCol, stockCol, minimoCol].filter(Boolean).map((h) => <th key={h} style={{ ...thStyle, color: '#0F766E' }}>{h}</th>)}</tr></thead>
          <tbody>{filtrados.map((item, i) => (
            <tr key={i} style={{ backgroundColor: item.critico ? '#FEF2F2' : i % 2 === 0 ? '#FFF' : '#FAFAFA' }}>
              <td style={tdStyle}>{item.critico ? '🔴 ' : ''}{item.nombre}</td>
              {stockCol && <td style={{ ...tdStyle, fontWeight: 600, color: item.critico ? '#DC2626' : '#0F172A' }}>{item.stock}</td>}
              {minimoCol && <td style={tdStyle}>{item.minimo}</td>}
            </tr>
          ))}</tbody>
        </table>
      </div>
    </Stack>
  );
};

// ─── Entradas ─────────────────────────────────────────────────────────────────
const TabEntradas = ({ rows, headers, analytics }) => {
  const tipoCol = headers.find((h) => /tipo|movimiento|operacion/i.test(h));
  const entradas = tipoCol
    ? rows.filter((r) => /entrada|recepcion|alta|ingreso/i.test(String(r[tipoCol] || '')))
    : rows;

  const cantCol = headers.find((h) => /cantidad|unidades|piezas/i.test(h));
  const totalEntradas = entradas.reduce((s, r) => s + parseMoney(cantCol ? r[cantCol] : 1), 0);

  return (
    <Stack gap="16px">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
        <KpiMini label="Entradas registradas" value={entradas.length} color="#059669" bg="#F0FDF4" />
        {cantCol && <KpiMini label="Unidades recibidas" value={totalEntradas} color="#0F766E" bg="#F0FDFA" />}
      </div>
      {entradas.length ? (
        <div style={{ overflowX: 'auto', borderRadius: 12, border: '1px solid #E2E8F0' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#FFF' }}>
            <thead><tr style={{ backgroundColor: '#F0FDF4' }}>{headers.slice(0, 6).map((h) => <th key={h} style={{ ...thStyle, color: '#166534' }}>{h}</th>)}</tr></thead>
            <tbody>{entradas.map((row, i) => (
              <tr key={i} style={{ backgroundColor: i % 2 === 0 ? '#FFF' : '#FAFAFA' }}>
                {headers.slice(0, 6).map((h) => <td key={h} style={tdStyle}>{String(row[h] || '-')}</td>)}
              </tr>
            ))}</tbody>
          </table>
        </div>
      ) : (
        <Stack gap="12px">
          <EmptyTab text="No se detectaron entradas. Mostrando todos los registros." />
          <BarChartCard title="Cantidades por artículo" subtitle="Columnas numéricas detectadas." data={analytics.previewSummary.totalsByColumn} />
        </Stack>
      )}
    </Stack>
  );
};

// ─── Salidas ──────────────────────────────────────────────────────────────────
const TabSalidas = ({ rows, headers, analytics }) => {
  const tipoCol = headers.find((h) => /tipo|movimiento|operacion/i.test(h));
  const salidas = tipoCol
    ? rows.filter((r) => /salida|consumo|surtido|despacho|baja/i.test(String(r[tipoCol] || '')))
    : rows;

  const cantCol = headers.find((h) => /cantidad|unidades|piezas/i.test(h));
  const totalSalidas = salidas.reduce((s, r) => s + parseMoney(cantCol ? r[cantCol] : 1), 0);

  return (
    <Stack gap="16px">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
        <KpiMini label="Salidas registradas" value={salidas.length} color="#EA580C" bg="#FFF7ED" />
        {cantCol && <KpiMini label="Unidades despachadas" value={totalSalidas} color="#DC2626" bg="#FEF2F2" />}
      </div>
      {salidas.length ? (
        <div style={{ overflowX: 'auto', borderRadius: 12, border: '1px solid #E2E8F0' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#FFF' }}>
            <thead><tr style={{ backgroundColor: '#FFF7ED' }}>{headers.slice(0, 6).map((h) => <th key={h} style={{ ...thStyle, color: '#C2410C' }}>{h}</th>)}</tr></thead>
            <tbody>{salidas.map((row, i) => (
              <tr key={i} style={{ backgroundColor: i % 2 === 0 ? '#FFF' : '#FAFAFA' }}>
                {headers.slice(0, 6).map((h) => <td key={h} style={tdStyle}>{String(row[h] || '-')}</td>)}
              </tr>
            ))}</tbody>
          </table>
        </div>
      ) : (
        <Stack gap="12px">
          <EmptyTab text="No se detectaron salidas. Mostrando tendencia general." />
          <LineChartCard title="Movimientos en el tiempo" subtitle="Actividad por fecha detectada." data={analytics.previewSummary.timelineData.length ? analytics.previewSummary.timelineData : analytics.monthlyActivity} />
        </Stack>
      )}
    </Stack>
  );
};

// ─── Reposicion ───────────────────────────────────────────────────────────────
const TabReposicion = ({ rows, headers }) => {
  const nombreCol = headers.find((h) => /articulo|producto|material|descripcion|nombre/i.test(h)) || headers[0];
  const stockCol = headers.find((h) => /stock|existencia|cantidad|disponible/i.test(h));
  const minimoCol = headers.find((h) => /minimo|min|punto reorden/i.test(h));

  const reposicion = rows
    .filter((row) => {
      if (!stockCol || !minimoCol) return false;
      return parseMoney(row[stockCol]) <= parseMoney(row[minimoCol]);
    })
    .map((row) => ({
      nombre: String(row[nombreCol] || '-').slice(0, 35),
      stock: parseMoney(row[stockCol]),
      minimo: parseMoney(row[minimoCol]),
      faltante: Math.max(0, parseMoney(row[minimoCol]) - parseMoney(row[stockCol])),
    }));

  if (!stockCol || !minimoCol) return <EmptyTab text="Se necesitan columnas de stock y mínimo para calcular reposición." />;

  if (!reposicion.length) return (
    <Card variant="outlined" style={{ backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0' }}>
      <Stack align="center" style={{ padding: 32 }}>
        <span style={{ fontSize: 40 }}>✅</span>
        <Text variant="h5" color="#166534">Sin necesidad de reposición</Text>
        <Text variant="bodySmall" color="#15803D">Todos los artículos están por encima del nivel mínimo.</Text>
      </Stack>
    </Card>
  );

  return (
    <Stack gap="12px">
      <Text variant="bodySmall" color="#DC2626">{reposicion.length} artículo(s) requieren reposición urgente.</Text>
      {reposicion.map((item, i) => (
        <Card key={i} variant="outlined" style={{ border: '1px solid #FECACA', backgroundColor: '#FEF2F2' }}>
          <HStack justify="space-between" align="center" style={{ flexWrap: 'wrap', gap: 8 }}>
            <Stack gap="4px">
              <HStack gap="8px"><span style={{ fontSize: 18 }}>🔁</span><Text variant="h6">{item.nombre}</Text></HStack>
              <Text variant="caption" color="#64748B">Stock: {item.stock} | Mínimo: {item.minimo} | Faltante: {item.faltante}</Text>
            </Stack>
            <span style={{ padding: '4px 12px', borderRadius: 999, fontSize: 12, fontWeight: 700, backgroundColor: '#DC2626', color: '#FFF' }}>Reponer</span>
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
const InventarioContent = () => {
  const navigate = useNavigate();
  const {
    moduleSheets, loading, loadSpreadsheets,
    showSheetsManager, setShowSheetsManager,
    selectedSpreadsheet, setSelectedSpreadsheet,
    previewData, previewLoading, previewError,
    editorSaveData, setEditorSaveData,
    activeTab, setActiveTab,
    analytics,
  } = useModuleScreen('inventario');

  const rows = analytics.previewSummary.table.rows;
  const headers = analytics.previewSummary.table.headers;

  const kpiItems = [
    { label: `Archivos de ${cfg.name}`, value: moduleSheets.length, helper: cfg.hero.helper, icon: cfg.iconShort, color: cfg.color, background: cfg.softColor, borderColor: `${cfg.color}55` },
    { label: 'Google Sheets', value: moduleSheets.filter((s) => s.mimeType?.includes('google-apps.spreadsheet')).length, helper: 'Listos para vista previa.', icon: 'GS', color: '#15803D', background: '#F0FDF4', borderColor: '#BBF7D0' },
    { label: 'Excel', value: moduleSheets.filter((s) => !s.mimeType?.includes('google-apps.spreadsheet')).length, helper: 'Disponibles para descarga.', icon: 'XL', color: '#B45309', background: '#FFFBEB', borderColor: '#FDE68A' },
    { label: 'Registros', value: analytics.previewSummary.rowCount, helper: 'Artículos en el archivo.', icon: 'RG', color: '#7C3AED', background: '#F5F3FF', borderColor: '#DDD6FE' },
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

              {activeTab === 'Existencias' && <TabExistencias rows={rows} headers={headers} />}
              {activeTab === 'Entradas' && <TabEntradas rows={rows} headers={headers} analytics={analytics} />}
              {activeTab === 'Salidas' && <TabSalidas rows={rows} headers={headers} analytics={analytics} />}
              {activeTab === 'Reposicion' && <TabReposicion rows={rows} headers={headers} />}
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

export const InventarioScreen = () => (
  <GoogleSheetsProvider><InventarioContent /></GoogleSheetsProvider>
);

export default InventarioScreen;
