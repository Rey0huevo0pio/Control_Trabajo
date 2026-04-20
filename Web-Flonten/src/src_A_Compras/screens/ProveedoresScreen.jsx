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

const cfg = comprasModulesConfig.proveedores;

// ─── Alta de Proveedor ────────────────────────────────────────────────────────
const TabAltaProveedor = ({ rows, headers }) => {
  const [form, setForm] = React.useState({ nombre: '', rfc: '', categoria: '', ciudad: '', contacto: '', email: '' });
  const [saved, setSaved] = React.useState(false);

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2500); };

  return (
    <Stack gap="16px">
      <Card variant="outlined" style={{ border: '1px solid #A7F3D0', backgroundColor: '#ECFDF5' }}>
        <Stack gap="14px">
          <Text variant="h5">Registro de nuevo proveedor</Text>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
            {[
              { label: 'Nombre / Razón social', key: 'nombre', placeholder: 'Ej. Distribuidora ABC S.A.' },
              { label: 'RFC', key: 'rfc', placeholder: 'Ej. DABC123456XYZ' },
              { label: 'Categoría / Giro', key: 'categoria', placeholder: 'Ej. Papelería, Tecnología' },
              { label: 'Ciudad / Estado', key: 'ciudad', placeholder: 'Ej. CDMX' },
              { label: 'Contacto', key: 'contacto', placeholder: 'Nombre del representante' },
              { label: 'Correo electrónico', key: 'email', placeholder: 'contacto@empresa.com' },
            ].map(({ label, key, placeholder }) => (
              <Stack key={key} gap="4px">
                <Text variant="caption" color="#475569">{label}</Text>
                <input value={form[key]} onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))} placeholder={placeholder}
                  style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #A7F3D0', fontSize: 13, color: '#0F172A', backgroundColor: '#FFF', outline: 'none' }} />
              </Stack>
            ))}
          </div>
          <HStack justify="flex-end">
            <Button onClick={handleSave} style={{ width: 'auto' }}>{saved ? '✓ Registrado' : 'Registrar proveedor'}</Button>
          </HStack>
        </Stack>
      </Card>
      {rows.length > 0 && (
        <Card variant="outlined">
          <Text variant="h6" style={{ marginBottom: 10 }}>Proveedores en el archivo ({rows.length})</Text>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr style={{ backgroundColor: '#ECFDF5' }}>{headers.slice(0, 6).map((h) => <th key={h} style={{ ...thStyle, color: '#047857' }}>{h}</th>)}</tr></thead>
              <tbody>{rows.slice(0, 8).map((row, i) => <tr key={i}>{headers.slice(0, 6).map((h) => <td key={h} style={tdStyle}>{String(row[h] || '-')}</td>)}</tr>)}</tbody>
            </table>
          </div>
        </Card>
      )}
    </Stack>
  );
};

// ─── Evaluacion ───────────────────────────────────────────────────────────────
const TabEvaluacion = ({ rows, headers }) => {
  const nombreCol = headers.find((h) => /proveedor|nombre|razon|empresa/i.test(h)) || headers[0];
  const calCol = headers.find((h) => /calificacion|evaluacion|score|rating|puntuacion/i.test(h));
  const cumplCol = headers.find((h) => /cumplimiento|entrega|tiempo/i.test(h));

  const proveedores = rows.map((row) => ({
    nombre: String(row[nombreCol] || '-').slice(0, 30),
    calificacion: parseMoney(calCol ? row[calCol] : 0),
    cumplimiento: parseMoney(cumplCol ? row[cumplCol] : 0),
  })).filter((p) => p.nombre !== '-');

  const getColor = (val) => val >= 80 ? '#059669' : val >= 60 ? '#F59E0B' : '#DC2626';

  return (
    <Stack gap="16px">
      {calCol || cumplCol ? (
        <Stack gap="10px">
          {proveedores.slice(0, 12).map((p, i) => (
            <Card key={i} variant="outlined">
              <HStack justify="space-between" align="center" style={{ flexWrap: 'wrap', gap: 8 }}>
                <Text variant="h6">{p.nombre}</Text>
                <HStack gap="12px">
                  {calCol && (
                    <Stack gap="2px" align="center">
                      <Text variant="caption" color="#64748B">Calificación</Text>
                      <span style={{ padding: '4px 12px', borderRadius: 999, fontSize: 13, fontWeight: 700, backgroundColor: `${getColor(p.calificacion)}22`, color: getColor(p.calificacion) }}>{p.calificacion}</span>
                    </Stack>
                  )}
                  {cumplCol && (
                    <Stack gap="2px" align="center">
                      <Text variant="caption" color="#64748B">Cumplimiento</Text>
                      <span style={{ padding: '4px 12px', borderRadius: 999, fontSize: 13, fontWeight: 700, backgroundColor: `${getColor(p.cumplimiento)}22`, color: getColor(p.cumplimiento) }}>{p.cumplimiento}%</span>
                    </Stack>
                  )}
                </HStack>
              </HStack>
            </Card>
          ))}
        </Stack>
      ) : (
        <Stack gap="12px">
          <EmptyTab text="No se detectaron columnas de calificación o cumplimiento. Mostrando distribución general." />
          <DonutChartCard title="Distribución de proveedores" subtitle="Por categoría o estatus detectado." data={[]} />
        </Stack>
      )}
    </Stack>
  );
};

// ─── Contratos ────────────────────────────────────────────────────────────────
const TabContratos = ({ rows, headers }) => {
  const contratoCol = headers.find((h) => /contrato|folio|numero|no\./i.test(h));
  const vigenciaCol = headers.find((h) => /vigencia|vencimiento|expiracion|fecha fin/i.test(h));
  const nombreCol = headers.find((h) => /proveedor|nombre|razon/i.test(h)) || headers[0];

  const hoy = new Date();
  const contratos = rows.map((row) => {
    const vencimiento = vigenciaCol ? new Date(String(row[vigenciaCol] || '')) : null;
    const diasRestantes = vencimiento && !isNaN(vencimiento) ? Math.ceil((vencimiento - hoy) / (1000 * 60 * 60 * 24)) : null;
    return { nombre: String(row[nombreCol] || '-'), contrato: String(row[contratoCol] || '-'), diasRestantes };
  });

  return (
    <Stack gap="12px">
      {vigenciaCol && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
          <KpiMini label="Vigentes" value={contratos.filter((c) => c.diasRestantes === null || c.diasRestantes > 30).length} color="#059669" bg="#F0FDF4" />
          <KpiMini label="Por vencer (30 días)" value={contratos.filter((c) => c.diasRestantes !== null && c.diasRestantes <= 30 && c.diasRestantes > 0).length} color="#F59E0B" bg="#FFFBEB" />
          <KpiMini label="Vencidos" value={contratos.filter((c) => c.diasRestantes !== null && c.diasRestantes <= 0).length} color="#DC2626" bg="#FEF2F2" />
        </div>
      )}
      <div style={{ overflowX: 'auto', borderRadius: 12, border: '1px solid #E2E8F0' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#FFF' }}>
          <thead><tr style={{ backgroundColor: '#ECFDF5' }}>{headers.slice(0, 6).map((h) => <th key={h} style={{ ...thStyle, color: '#047857' }}>{h}</th>)}</tr></thead>
          <tbody>{contratos.map((c, i) => (
            <tr key={i} style={{ backgroundColor: c.diasRestantes !== null && c.diasRestantes <= 0 ? '#FEF2F2' : c.diasRestantes !== null && c.diasRestantes <= 30 ? '#FFFBEB' : i % 2 === 0 ? '#FFF' : '#FAFAFA' }}>
              {headers.slice(0, 6).map((h) => <td key={h} style={tdStyle}>{String(rows[i][h] || '-')}</td>)}
            </tr>
          ))}</tbody>
        </table>
      </div>
    </Stack>
  );
};

// ─── Cobertura ────────────────────────────────────────────────────────────────
const TabCobertura = ({ rows, headers, analytics }) => {
  const ciudadCol = headers.find((h) => /ciudad|estado|region|ubicacion|pais/i.test(h));
  const categoriaCol = headers.find((h) => /categoria|giro|tipo|rubro/i.test(h));

  const porCiudad = ciudadCol
    ? Object.entries(rows.reduce((acc, r) => { const k = String(r[ciudadCol] || 'Sin dato'); acc[k] = (acc[k] || 0) + 1; return acc; }, {}))
        .map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value).slice(0, 10)
    : [];

  const porCategoria = categoriaCol
    ? Object.entries(rows.reduce((acc, r) => { const k = String(r[categoriaCol] || 'Sin dato'); acc[k] = (acc[k] || 0) + 1; return acc; }, {}))
        .map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value).slice(0, 8)
    : analytics.previewSummary.categoryDistribution;

  return (
    <Stack gap="16px">
      {porCiudad.length > 0 && <BarChartCard title="Proveedores por ciudad / región" subtitle="Distribución geográfica detectada." data={porCiudad} />}
      {porCategoria.length > 0 && <DonutChartCard title="Proveedores por categoría" subtitle="Distribución por tipo o giro." data={porCategoria} />}
      {!porCiudad.length && !porCategoria.length && <EmptyTab text="No se detectaron columnas de ciudad o categoría en el archivo." />}
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
const ProveedoresContent = () => {
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
  } = useModuleScreen('proveedores');

  const rows = analytics.previewSummary.table.rows;
  const headers = analytics.previewSummary.table.headers;

  const kpiItems = [
    { label: `Archivos de ${cfg.name}`, value: moduleSheets.length, helper: cfg.hero.helper, icon: cfg.iconShort, color: cfg.color, background: cfg.softColor, borderColor: `${cfg.color}55` },
    { label: 'Google Sheets', value: moduleSheets.filter((s) => s.mimeType?.includes('google-apps.spreadsheet')).length, helper: 'Listos para vista previa.', icon: 'GS', color: '#15803D', background: '#F0FDF4', borderColor: '#BBF7D0' },
    { label: 'Excel', value: moduleSheets.filter((s) => !s.mimeType?.includes('google-apps.spreadsheet')).length, helper: 'Disponibles para descarga.', icon: 'XL', color: '#B45309', background: '#FFFBEB', borderColor: '#FDE68A' },
    { label: 'Registros', value: analytics.previewSummary.rowCount, helper: 'Proveedores en el archivo.', icon: 'RG', color: '#7C3AED', background: '#F5F3FF', borderColor: '#DDD6FE' },
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

              {activeTab === 'Alta de proveedor' && <TabAltaProveedor rows={rows} headers={headers} />}
              {activeTab === 'Evaluacion' && <TabEvaluacion rows={rows} headers={headers} />}
              {activeTab === 'Contratos' && <TabContratos rows={rows} headers={headers} />}
              {activeTab === 'Cobertura' && <TabCobertura rows={rows} headers={headers} analytics={analytics} />}
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

export const ProveedoresScreen = () => (
  <GoogleSheetsProvider><ProveedoresContent /></GoogleSheetsProvider>
);

export default ProveedoresScreen;
