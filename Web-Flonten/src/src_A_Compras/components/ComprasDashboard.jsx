import React, { useState, useMemo } from 'react';
import { Text, Card, Button, Stack, HStack } from '../../components/design-system';

const CHART_COLORS = ['#2563EB', '#7C3AED', '#059669', '#EA580C', '#0F766E', '#DC2626', '#64748B'];

const formatCompactNumber = (value) =>
  new Intl.NumberFormat('es-MX', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value || 0);

const ChartShell = ({ title, subtitle, children, action }) => (
  <Card
    variant="outlined"
    style={{
      background: 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)',
      minHeight: 320,
    }}
  >
    <Stack gap="16px" style={{ height: '100%' }}>
      <HStack justify="space-between" align="flex-start" style={{ flexWrap: 'wrap' }}>
        <Stack gap="4px" style={{ flex: 1, minWidth: 180 }}>
          <Text variant="h5">{title}</Text>
          {subtitle ? (
            <Text variant="bodySmall" color="#64748B">
              {subtitle}
            </Text>
          ) : null}
        </Stack>
        {action}
      </HStack>
      <div style={{ flex: 1 }}>{children}</div>
    </Stack>
  </Card>
);

export const KpiCards = ({ items }) => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
      gap: 16,
    }}
  >
    {items.map((item) => (
      <Card
        key={item.label}
        variant="outlined"
        style={{
          background: item.background || '#FFFFFF',
          border: `1px solid ${item.borderColor || '#E2E8F0'}`,
        }}
      >
        <Stack gap="10px">
          <HStack justify="space-between">
            <Text variant="bodySmall" color="#475569">
              {item.label}
            </Text>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                backgroundColor: item.color,
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              {item.icon}
            </div>
          </HStack>
          <Text variant="h2">{item.value}</Text>
          <Text variant="caption" color="#64748B">
            {item.helper}
          </Text>
        </Stack>
      </Card>
    ))}
  </div>
);

export const AreaSummaryGrid = ({ items = [] }) => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: 16,
    }}
  >
    {items.map((item) => (
      <Card key={item.id} variant="outlined" style={{ border: `1px solid ${item.color}33` }}>
        <Stack gap="14px">
          <HStack justify="space-between" align="flex-start">
            <Stack gap="6px">
              <Text variant="h5">{item.label}</Text>
              <Text variant="bodySmall" color="#64748B">
                Archivos vinculados a esta area
              </Text>
            </Stack>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                backgroundColor: item.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                fontWeight: 700,
              }}
            >
              {item.icon}
            </div>
          </HStack>
          <Text variant="h3">{item.count}</Text>
          <div
            style={{
              height: 8,
              borderRadius: 999,
              backgroundColor: '#E2E8F0',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${Math.min(100, item.count * 12)}%`,
                height: '100%',
                borderRadius: 999,
                backgroundColor: item.color,
              }}
            />
          </div>
        </Stack>
      </Card>
    ))}
  </div>
);

export const DonutChartCard = ({ title, subtitle, data = [] }) => {
  const segments = data.reduce((acc, item, index) => {
    const total = data.reduce((sum, i) => sum + i.value, 0);
    const percentage = total ? item.value / total : 0;
    const prevTotal = acc.reduce((sum, i) => sum + i.percentage, 0);
    const dash = percentage * 282.74;
    const offset = -prevTotal * 282.74;

    return [...acc, {
      ...item,
      color: item.color || CHART_COLORS[index % CHART_COLORS.length],
      dash,
      offset,
      percentage,
    }];
  }, []);

  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <ChartShell title={title} subtitle={subtitle}>
      {segments.length ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(180px, 240px) 1fr',
            gap: 20,
            alignItems: 'center',
            height: '100%',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <svg width="220" height="220" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="45" fill="none" stroke="#E2E8F0" strokeWidth="14" />
              {segments.map((segment) => (
                <circle
                  key={segment.label}
                  cx="60"
                  cy="60"
                  r="45"
                  fill="none"
                  stroke={segment.color}
                  strokeWidth="14"
                  strokeLinecap="round"
                  strokeDasharray={`${segment.dash} 282.74`}
                  strokeDashoffset={segment.offset}
                  transform="rotate(-90 60 60)"
                />
              ))}
              <text x="60" y="54" textAnchor="middle" fontSize="10" fill="#64748B">
                Total
              </text>
              <text x="60" y="68" textAnchor="middle" fontSize="16" fontWeight="700" fill="#0F172A">
                {total}
              </text>
            </svg>
          </div>

          <Stack gap="10px" style={{ justifyContent: 'center' }}>
            {segments.map((segment) => (
              <HStack key={segment.label} justify="space-between">
                <HStack gap="10px">
                  <span
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: 999,
                      backgroundColor: segment.color,
                      display: 'inline-block',
                      marginTop: 4,
                    }}
                  />
                  <Text variant="bodySmall">{segment.label}</Text>
                </HStack>
                <Text variant="labelSmall" color="#0F172A">
                  {segment.value}
                </Text>
              </HStack>
            ))}
          </Stack>
        </div>
      ) : (
        <EmptyState text="Aun no hay datos suficientes para la grafica de pastel." />
      )}
    </ChartShell>
  );
};

export const BarChartCard = ({ title, subtitle, data = [] }) => {
  const maxValue = Math.max(...data.map((item) => item.value), 0);

  return (
    <ChartShell title={title} subtitle={subtitle}>
      {data.length ? (
        <Stack gap="14px" style={{ justifyContent: 'center', height: '100%' }}>
          {data.map((item, index) => (
            <Stack key={item.label} gap="6px">
              <HStack justify="space-between">
                <Text variant="bodySmall">{item.label}</Text>
                <Text variant="labelSmall">{formatCompactNumber(item.value)}</Text>
              </HStack>
              <div
                style={{
                  width: '100%',
                  height: 12,
                  borderRadius: 999,
                  backgroundColor: '#E2E8F0',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${maxValue ? (item.value / maxValue) * 100 : 0}%`,
                    height: '100%',
                    borderRadius: 999,
                    background: `linear-gradient(90deg, ${CHART_COLORS[index % CHART_COLORS.length]} 0%, #38BDF8 100%)`,
                  }}
                />
              </div>
            </Stack>
          ))}
        </Stack>
      ) : (
        <EmptyState text="No se encontraron columnas numericas para la grafica de barras." />
      )}
    </ChartShell>
  );
};

export const LineChartCard = ({ title, subtitle, data = [] }) => {
  if (!data.length) {
    return (
      <ChartShell title={title} subtitle={subtitle}>
        <EmptyState text="Aun no hay actividad suficiente para la grafica de tendencia." />
      </ChartShell>
    );
  }

  const width = 420;
  const height = 180;
  const padding = 24;
  const maxValue = Math.max(...data.map((item) => item.value), 1);
  const stepX = data.length > 1 ? (width - padding * 2) / (data.length - 1) : 0;

  const points = data.map((item, index) => {
    const x = padding + index * stepX;
    const y = height - padding - ((item.value || 0) / maxValue) * (height - padding * 2);
    return `${x},${y}`;
  });

  return (
    <ChartShell title={title} subtitle={subtitle}>
      <Stack gap="12px" style={{ height: '100%', justifyContent: 'center' }}>
        <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 220 }}>
          <defs>
            <linearGradient id="lineFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563EB" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#2563EB" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#CBD5E1" />
          <polyline
            fill="none"
            stroke="#2563EB"
            strokeWidth="4"
            strokeLinejoin="round"
            strokeLinecap="round"
            points={points.join(' ')}
          />
          <polygon
            fill="url(#lineFill)"
            points={`${padding},${height - padding} ${points.join(' ')} ${width - padding},${height - padding}`}
          />
          {data.map((item, index) => {
            const x = padding + index * stepX;
            const y = height - padding - ((item.value || 0) / maxValue) * (height - padding * 2);

            return (
              <g key={item.label}>
                <circle cx={x} cy={y} r="5" fill="#FFFFFF" stroke="#2563EB" strokeWidth="3" />
                <text x={x} y={height - 6} textAnchor="middle" fontSize="10" fill="#64748B">
                  {item.label}
                </text>
              </g>
            );
          })}
        </svg>
        <HStack gap="12px" style={{ flexWrap: 'wrap' }}>
          {data.map((item) => (
            <Text key={item.label} variant="caption" color="#64748B">
              {item.label}: {item.value}
            </Text>
          ))}
        </HStack>
      </Stack>
    </ChartShell>
  );
};

// ─── Excel Editor Panel ────────────────────────────────────────────────────
export const ExcelEditorPanel = ({ previewSummary, onSave }) => {
  const [hiddenCols, setHiddenCols] = useState([]);
  const [chartCols, setChartCols] = useState([]);
  const [editData, setEditData] = useState(null);
  const [saved, setSaved] = useState(false);

  const headers = previewSummary?.table?.headers || [];
  const rows = useMemo(() => {
    if (editData) return editData;
    return (previewSummary?.table?.rows || []).map((r) => ({ ...r }));
  }, [previewSummary, editData]);

  const visibleHeaders = headers.filter((h) => !hiddenCols.includes(h));

  const toggleHide = (col) =>
    setHiddenCols((prev) =>
      prev.includes(col) ? prev.filter((c) => c !== col) : [...prev, col]
    );

  const toggleChart = (col) =>
    setChartCols((prev) =>
      prev.includes(col) ? prev.filter((c) => c !== col) : [...prev, col]
    );

  const handleCell = (rowIdx, col, value) => {
    setSaved(false);
    setEditData((prev) => {
      const next = prev ? prev.map((r) => ({ ...r })) : rows.map((r) => ({ ...r }));
      next[rowIdx][col] = value;
      return next;
    });
  };

  const handleSave = () => {
    setSaved(true);
    onSave?.({ rows, hiddenCols, chartCols });
  };

  if (!headers.length)
    return (
      <Card variant="outlined">
        <EmptyState text="Selecciona un Google Sheet para habilitar el editor." />
      </Card>
    );

  return (
    <Card variant="outlined" style={{ background: '#FFFFFF' }}>
      <Stack gap="16px">
        <HStack justify="space-between" align="flex-start" style={{ flexWrap: 'wrap', gap: 10 }}>
          <Stack gap="4px">
            <Text variant="h4">Editor de datos</Text>
            <Text variant="bodySmall" color="#64748B">
              Edita celdas, oculta columnas y elige cuáles usar en las gráficas.
            </Text>
          </Stack>
          <Button onClick={handleSave} style={{ width: 'auto' }}>
            {saved ? '✓ Guardado' : 'Guardar cambios'}
          </Button>
        </HStack>

        {/* Column controls */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {headers.map((col) => (
            <div key={col} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <span
                style={{
                  padding: '4px 10px',
                  borderRadius: 999,
                  fontSize: 12,
                  fontWeight: 600,
                  backgroundColor: hiddenCols.includes(col) ? '#F1F5F9' : '#EFF6FF',
                  color: hiddenCols.includes(col) ? '#94A3B8' : '#1D4ED8',
                  border: `1px solid ${hiddenCols.includes(col) ? '#CBD5E1' : '#BFDBFE'}`,
                  textDecoration: hiddenCols.includes(col) ? 'line-through' : 'none',
                  cursor: 'pointer',
                  userSelect: 'none',
                }}
                onClick={() => toggleHide(col)}
                title="Click para ocultar/mostrar"
              >
                {col}
              </span>
              <span
                style={{
                  padding: '2px 8px',
                  borderRadius: 999,
                  fontSize: 11,
                  cursor: 'pointer',
                  userSelect: 'none',
                  backgroundColor: chartCols.includes(col) ? '#DCFCE7' : '#F8FAFC',
                  color: chartCols.includes(col) ? '#166534' : '#94A3B8',
                  border: `1px solid ${chartCols.includes(col) ? '#86EFAC' : '#E2E8F0'}`,
                }}
                onClick={() => toggleChart(col)}
                title="Click para usar en gráfica"
              >
                {chartCols.includes(col) ? '📊 gráfica' : '+ gráfica'}
              </span>
            </div>
          ))}
        </div>

        {hiddenCols.length > 0 && (
          <Text variant="caption" color="#94A3B8">
            Columnas ocultas: {hiddenCols.join(', ')}
          </Text>
        )}

        {/* Editable table */}
        <div style={{ overflowX: 'auto', borderRadius: 12, border: '1px solid #E2E8F0' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#FFFFFF' }}>
            <thead>
              <tr style={{ backgroundColor: '#F8FAFC' }}>
                <th style={{ padding: '10px 12px', fontSize: 12, color: '#94A3B8', borderBottom: '1px solid #E2E8F0', width: 40 }}>#</th>
                {visibleHeaders.map((h) => (
                  <th
                    key={h}
                    style={{
                      textAlign: 'left',
                      padding: '10px 12px',
                      fontSize: 12,
                      color: chartCols.includes(h) ? '#166534' : '#475569',
                      borderBottom: '1px solid #E2E8F0',
                      backgroundColor: chartCols.includes(h) ? '#F0FDF4' : undefined,
                    }}
                  >
                    {h} {chartCols.includes(h) ? '📊' : ''}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, ri) => (
                <tr key={ri} style={{ backgroundColor: ri % 2 === 0 ? '#FFFFFF' : '#F8FAFC' }}>
                  <td style={{ padding: '8px 12px', fontSize: 12, color: '#94A3B8', borderBottom: '1px solid #F1F5F9' }}>{ri + 1}</td>
                  {visibleHeaders.map((h) => (
                    <td key={h} style={{ padding: '4px 6px', borderBottom: '1px solid #F1F5F9' }}>
                      <input
                        value={row[h] ?? ''}
                        onChange={(e) => handleCell(ri, h, e.target.value)}
                        style={{
                          width: '100%',
                          border: 'none',
                          background: 'transparent',
                          fontSize: 13,
                          color: '#0F172A',
                          padding: '4px 6px',
                          borderRadius: 6,
                          outline: 'none',
                          minWidth: 80,
                        }}
                        onFocus={(e) => (e.target.style.background = '#EFF6FF')}
                        onBlur={(e) => (e.target.style.background = 'transparent')}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Stack>
    </Card>
  );
};

// ─── Chart Builder Panel ─────────────────────────────────────────────────────
const CHART_TYPES = [
  { id: 'bar', label: 'Barras', icon: '📊' },
  { id: 'line', label: 'Línea', icon: '📈' },
  { id: 'donut', label: 'Pastel', icon: '🥧' },
  { id: 'area', label: 'Área', icon: '🏔️' },
  { id: 'horizontal', label: 'Barras H.', icon: '📉' },
];

export const ChartBuilderPanel = ({ previewSummary, chartCols = [], title, subtitle }) => {
  const [chartType, setChartType] = useState('bar');
  const [labelCol, setLabelCol] = useState('');
  const [valueCol, setValueCol] = useState('');

  const headers = previewSummary?.table?.headers || [];
  const rows = previewSummary?.table?.rows || [];

  // Auto-select first chartCols if not set
  const effectiveLabelCol = labelCol || chartCols[0] || headers[0] || '';
  const effectiveValueCol = valueCol || chartCols[1] || chartCols[0] || headers[1] || headers[0] || '';

  const chartData = useMemo(() => {
    if (!effectiveLabelCol || !rows.length) return [];
    const grouped = {};
    rows.forEach((row) => {
      const lbl = String(row[effectiveLabelCol] || 'Sin dato');
      const val = parseFloat(row[effectiveValueCol]) || 0;
      grouped[lbl] = (grouped[lbl] || 0) + val;
    });
    return Object.entries(grouped)
      .map(([label, value]) => ({ label, value }))
      .slice(0, 12);
  }, [rows, effectiveLabelCol, effectiveValueCol]);

  const hasData = chartData.length > 0;

  return (
    <Card variant="outlined" style={{ background: '#FFFFFF' }}>
      <Stack gap="16px">
        <HStack justify="space-between" align="flex-start" style={{ flexWrap: 'wrap', gap: 10 }}>
          <Stack gap="4px">
            <Text variant="h4">Constructor de gráficas</Text>
            <Text variant="bodySmall" color="#64748B">
              Elige el tipo de gráfica y las columnas para visualizar los datos.
            </Text>
          </Stack>
        </HStack>

        {/* Chart type selector */}
        <HStack gap="8px" style={{ flexWrap: 'wrap' }}>
          {CHART_TYPES.map((ct) => (
            <button
              key={ct.id}
              onClick={() => setChartType(ct.id)}
              style={{
                padding: '8px 16px',
                borderRadius: 999,
                border: `1px solid ${chartType === ct.id ? '#2563EB' : '#E2E8F0'}`,
                backgroundColor: chartType === ct.id ? '#EFF6FF' : '#F8FAFC',
                color: chartType === ct.id ? '#1D4ED8' : '#475569',
                fontWeight: chartType === ct.id ? 700 : 400,
                fontSize: 13,
                cursor: 'pointer',
              }}
            >
              {ct.icon} {ct.label}
            </button>
          ))}
        </HStack>

        {/* Column selectors */}
        {headers.length > 0 && (
          <HStack gap="16px" style={{ flexWrap: 'wrap' }}>
            <Stack gap="4px">
              <Text variant="caption" color="#64748B">Columna etiqueta (eje X)</Text>
              <select
                value={effectiveLabelCol}
                onChange={(e) => setLabelCol(e.target.value)}
                style={{
                  padding: '8px 12px',
                  borderRadius: 8,
                  border: '1px solid #E2E8F0',
                  fontSize: 13,
                  color: '#0F172A',
                  backgroundColor: '#FFFFFF',
                }}
              >
                {headers.map((h) => <option key={h} value={h}>{h}</option>)}
              </select>
            </Stack>
            <Stack gap="4px">
              <Text variant="caption" color="#64748B">Columna valor (eje Y)</Text>
              <select
                value={effectiveValueCol}
                onChange={(e) => setValueCol(e.target.value)}
                style={{
                  padding: '8px 12px',
                  borderRadius: 8,
                  border: '1px solid #E2E8F0',
                  fontSize: 13,
                  color: '#0F172A',
                  backgroundColor: '#FFFFFF',
                }}
              >
                {headers.map((h) => <option key={h} value={h}>{h}</option>)}
              </select>
            </Stack>
          </HStack>
        )}

        {/* Chart render */}
        <div style={{ minHeight: 280 }}>
          {!hasData ? (
            <EmptyState text="Selecciona un archivo y columnas para construir la gráfica." />
          ) : chartType === 'donut' ? (
            <DonutChartCard title={title || 'Distribución'} subtitle={subtitle} data={chartData} />
          ) : chartType === 'line' ? (
            <LineChartCard title={title || 'Tendencia'} subtitle={subtitle} data={chartData} />
          ) : chartType === 'area' ? (
            <AreaChartCard title={title || 'Área'} subtitle={subtitle} data={chartData} />
          ) : chartType === 'horizontal' ? (
            <HorizontalBarCard title={title || 'Barras horizontales'} subtitle={subtitle} data={chartData} />
          ) : (
            <BarChartCard title={title || 'Barras'} subtitle={subtitle} data={chartData} />
          )}
        </div>
      </Stack>
    </Card>
  );
};

// ─── Area Chart ──────────────────────────────────────────────────────────────
const AreaChartCard = ({ title, subtitle, data = [] }) => {
  if (!data.length) return <ChartShell title={title} subtitle={subtitle}><EmptyState text="Sin datos." /></ChartShell>;
  const width = 420, height = 180, padding = 24;
  const maxValue = Math.max(...data.map((d) => d.value), 1);
  const stepX = data.length > 1 ? (width - padding * 2) / (data.length - 1) : 0;
  const points = data.map((d, i) => {
    const x = padding + i * stepX;
    const y = height - padding - (d.value / maxValue) * (height - padding * 2);
    return `${x},${y}`;
  });
  return (
    <ChartShell title={title} subtitle={subtitle}>
      <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 220 }}>
        <defs>
          <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#059669" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#059669" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#CBD5E1" />
        <polygon fill="url(#areaFill)" points={`${padding},${height - padding} ${points.join(' ')} ${width - padding},${height - padding}`} />
        <polyline fill="none" stroke="#059669" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" points={points.join(' ')} />
        {data.map((d, i) => {
          const x = padding + i * stepX;
          const y = height - padding - (d.value / maxValue) * (height - padding * 2);
          return (
            <g key={d.label}>
              <circle cx={x} cy={y} r="4" fill="#FFFFFF" stroke="#059669" strokeWidth="2.5" />
              <text x={x} y={height - 6} textAnchor="middle" fontSize="9" fill="#64748B">{d.label}</text>
            </g>
          );
        })}
      </svg>
    </ChartShell>
  );
};

// ─── Horizontal Bar Chart ────────────────────────────────────────────────────
const HorizontalBarCard = ({ title, subtitle, data = [] }) => {
  const maxValue = Math.max(...data.map((d) => d.value), 1);
  return (
    <ChartShell title={title} subtitle={subtitle}>
      {data.length ? (
        <Stack gap="10px" style={{ justifyContent: 'center', height: '100%' }}>
          {data.map((item, index) => (
            <HStack key={item.label} gap="10px" align="center">
              <Text variant="bodySmall" style={{ minWidth: 90, textAlign: 'right' }}>{item.label}</Text>
              <div style={{ flex: 1, height: 20, borderRadius: 999, backgroundColor: '#E2E8F0', overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${(item.value / maxValue) * 100}%`,
                    height: '100%',
                    borderRadius: 999,
                    background: `linear-gradient(90deg, ${CHART_COLORS[index % CHART_COLORS.length]} 0%, #38BDF8 100%)`,
                  }}
                />
              </div>
              <Text variant="labelSmall" style={{ minWidth: 50 }}>{formatCompactNumber(item.value)}</Text>
            </HStack>
          ))}
        </Stack>
      ) : (
        <EmptyState text="Sin datos para barras horizontales." />
      )}
    </ChartShell>
  );
};

// ─── Spreadsheet Preview Panel ───────────────────────────────────────────────
export const SpreadsheetPreviewPanel = ({
  spreadsheets = [],
  selectedSpreadsheetId,
  onSelectSpreadsheet,
  previewSummary,
  previewLoading,
  previewError,
  onRefresh,
  onOpenManager,
}) => (
  <Card
    variant="outlined"
    style={{
      background: 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)',
    }}
  >
    <Stack gap="18px">
      <HStack justify="space-between" align="flex-start" style={{ flexWrap: 'wrap' }}>
        <Stack gap="6px" style={{ flex: 1, minWidth: 220 }}>
          <Text variant="h4">Centro de Excel y Google Sheets</Text>
          <Text variant="bodySmall" color="#64748B">
            Selecciona un archivo para ver su contenido, contar registros y preparar graficas para compras.
          </Text>
        </Stack>
        <HStack gap="8px" style={{ flexWrap: 'wrap' }}>
          <Button variant="secondary" onClick={onRefresh} style={{ width: 'auto' }}>
            Actualizar
          </Button>
          <Button onClick={onOpenManager} style={{ width: 'auto' }}>
            Gestionar archivos
          </Button>
        </HStack>
      </HStack>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(260px, 320px) 1fr',
          gap: 18,
        }}
      >
        <Stack gap="10px">
          <Text variant="label">Archivos disponibles</Text>
          <div
            style={{
              display: 'grid',
              gap: 10,
              maxHeight: 420,
              overflowY: 'auto',
              paddingRight: 4,
            }}
          >
            {spreadsheets.map((sheet) => {
              const isActive = sheet.id === selectedSpreadsheetId;
              const isGoogleSheet = sheet.mimeType?.includes('google-apps.spreadsheet');

              return (
                <Card
                  key={sheet.id}
                  variant="outlined"
                  onClick={() => onSelectSpreadsheet(sheet)}
                  style={{
                    border: isActive ? '1px solid #2563EB' : '1px solid #E2E8F0',
                    backgroundColor: isActive ? '#EFF6FF' : '#FFFFFF',
                  }}
                >
                  <Stack gap="6px">
                    <HStack justify="space-between" align="flex-start">
                      <Text variant="h6" style={{ flex: 1 }}>
                        {sheet.name}
                      </Text>
                      <span
                        style={{
                          padding: '4px 8px',
                          borderRadius: 999,
                          backgroundColor: isGoogleSheet ? '#DCFCE7' : '#FEF3C7',
                          color: isGoogleSheet ? '#166534' : '#92400E',
                          fontSize: 11,
                          fontWeight: 700,
                        }}
                      >
                        {isGoogleSheet ? 'Sheets' : 'Excel'}
                      </span>
                    </HStack>
                    <Text variant="caption" color="#64748B">
                      Modificado: {new Date(sheet.modifiedTime || sheet.createdTime || new Date().toISOString()).toLocaleDateString('es-MX')}
                    </Text>
                  </Stack>
                </Card>
              );
            })}

            {!spreadsheets.length ? <EmptyState text="No hay archivos conectados todavia." compact /> : null}
          </div>
        </Stack>

        <Card variant="filled" style={{ minHeight: 420, border: '1px solid #E2E8F0' }}>
          {previewLoading ? (
            <EmptyState text="Cargando vista previa del archivo..." />
          ) : previewError ? (
            <EmptyState text={previewError} />
          ) : previewSummary?.table?.headers?.length ? (
            <Stack gap="16px">
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                  gap: 12,
                }}
              >
                <SummaryBadge label="Filas" value={previewSummary.rowCount} />
                <SummaryBadge label="Columnas" value={previewSummary.columnCount} />
                <SummaryBadge
                  label="Categorias"
                  value={previewSummary.categoryDistribution.length}
                />
              </div>

              <div style={{ overflowX: 'auto', borderRadius: 14, border: '1px solid #E2E8F0' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#FFFFFF' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#F8FAFC' }}>
                      {previewSummary.table.headers.map((header) => (
                        <th
                          key={header}
                          style={{
                            textAlign: 'left',
                            padding: '12px 14px',
                            fontSize: 12,
                            color: '#475569',
                            borderBottom: '1px solid #E2E8F0',
                          }}
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewSummary.table.rows.map((row, rowIndex) => (
                      <tr key={`row-${rowIndex}`}>
                        {previewSummary.table.headers.map((header) => (
                          <td
                            key={`${rowIndex}-${header}`}
                            style={{
                              padding: '12px 14px',
                              fontSize: 13,
                              color: '#0F172A',
                              borderBottom: '1px solid #F1F5F9',
                            }}
                          >
                            {String(row[header] || '-')}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Stack>
          ) : (
            <EmptyState text="Selecciona un Google Sheet para ver una vista previa de su contenido." />
          )}
        </Card>
      </div>
    </Stack>
  </Card>
);

const SummaryBadge = ({ label, value }) => (
  <Card variant="outlined" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', padding: '14px' }}>
    <Stack gap="4px">
      <Text variant="caption" color="#64748B">
        {label}
      </Text>
      <Text variant="h4">{value}</Text>
    </Stack>
  </Card>
);

const EmptyState = ({ text, compact = false }) => (
  <div
    style={{
      minHeight: compact ? 120 : 240,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      color: '#64748B',
      padding: 24,
    }}
  >
    <Text variant="bodySmall" color="#64748B">
      {text}
    </Text>
  </div>
);

export default {
  AreaSummaryGrid,
  BarChartCard,
  ChartBuilderPanel,
  DonutChartCard,
  ExcelEditorPanel,
  KpiCards,
  LineChartCard,
  SpreadsheetPreviewPanel,
};
