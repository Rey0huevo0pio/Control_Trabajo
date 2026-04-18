import React from 'react';

const AREA_CONFIG = {
  solicitudes: { id: 'solicitudes', label: 'Solicitudes', icon: 'SP', color: '#2563EB' },
  ordenes: { id: 'ordenes', label: 'Ordenes', icon: 'OC', color: '#7C3AED' },
  proveedores: { id: 'proveedores', label: 'Proveedores', icon: 'PR', color: '#059669' },
  presupuesto: { id: 'presupuesto', label: 'Presupuesto', icon: 'PP', color: '#EA580C' },
  inventario: { id: 'inventario', label: 'Inventario', icon: 'IN', color: '#0F766E' },
  reportes: { id: 'reportes', label: 'Reportes', icon: 'RP', color: '#475569' },
  otros: { id: 'otros', label: 'Otros', icon: 'OT', color: '#64748B' },
};

const KEYWORD_MAP = [
  { key: 'solicitudes', keywords: ['solicitud', 'requisicion', 'request', 'compra'] },
  { key: 'ordenes', keywords: ['orden', 'oc', 'purchase order'] },
  { key: 'proveedores', keywords: ['proveedor', 'supplier', 'vendor'] },
  { key: 'presupuesto', keywords: ['presupuesto', 'budget', 'gasto', 'cost'] },
  { key: 'inventario', keywords: ['inventario', 'stock', 'almacen'] },
  { key: 'reportes', keywords: ['reporte', 'dashboard', 'grafica', 'indicador'] },
];

const normalizeText = (value) =>
  String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

const parseMoney = (value) => {
  if (typeof value === 'number') return value;
  if (!value) return 0;

  const cleaned = String(value)
    .replace(/[^\d,.-]/g, '')
    .replace(/\.(?=\d{3}(\D|$))/g, '')
    .replace(',', '.');

  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : 0;
};

const detectArea = (sheet) => {
  const source = normalizeText(`${sheet?.name || ''} ${sheet?.mimeType || ''}`);

  for (const entry of KEYWORD_MAP) {
    if (entry.keywords.some((keyword) => source.includes(keyword))) {
      return entry.key;
    }
  }

  return 'otros';
};

const summarizePreviewRows = (previewData) => {
  if (!previewData?.values?.length) {
    return {
      rowCount: 0,
      columnCount: 0,
      totalsByColumn: [],
      categoryDistribution: [],
      timelineData: [],
      table: { headers: [], rows: [] },
    };
  }

  const [headersRow = [], ...rawRows] = previewData.values;
  const headers = headersRow.map((header, index) => String(header || `Columna ${index + 1}`).trim());
  const rows = rawRows
    .filter((row) => row.some((cell) => String(cell || '').trim() !== ''))
    .map((row) =>
      headers.reduce((acc, header, index) => {
        acc[header] = row[index] ?? '';
        return acc;
      }, {}),
    );

  const numericColumns = headers
    .map((header) => {
      const total = rows.reduce((sum, row) => sum + parseMoney(row[header]), 0);
      const populated = rows.filter((row) => parseMoney(row[header]) !== 0).length;

      return {
        label: header,
        value: total,
        populated,
      };
    })
    .filter((entry) => entry.populated > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  const candidateCategoryHeader =
    headers.find((header) => /(estatus|estado|categoria|tipo|area|proveedor)/i.test(header)) || headers[0];

  const categoryMap = rows.reduce((acc, row) => {
    const label = String(row[candidateCategoryHeader] || 'Sin dato').trim() || 'Sin dato';
    acc[label] = (acc[label] || 0) + 1;
    return acc;
  }, {});

  const categoryDistribution = Object.entries(categoryMap)
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  const candidateDateHeader = headers.find((header) => /(fecha|date|periodo|mes)/i.test(header));
  const timelineData = candidateDateHeader
    ? rows.reduce((acc, row) => {
        const label = String(row[candidateDateHeader] || 'Sin fecha').trim() || 'Sin fecha';
        acc[label] = (acc[label] || 0) + 1;
        return acc;
      }, {})
    : {};

  return {
    rowCount: rows.length,
    columnCount: headers.length,
    totalsByColumn: numericColumns,
    categoryDistribution,
    timelineData: Object.entries(timelineData)
      .map(([label, value]) => ({ label, value }))
      .slice(0, 8),
    table: {
      headers,
      rows: rows.slice(0, 8),
    },
  };
};

export const useComprasAnalytics = ({ spreadsheets = [], areasAsignadas = [], previewData = null }) => {
  return React.useMemo(() => {
    const areaDistribution = Object.values(
      spreadsheets.reduce((acc, sheet) => {
        const areaKey = detectArea(sheet);
        const area = AREA_CONFIG[areaKey] || AREA_CONFIG.otros;

        if (!acc[area.id]) {
          acc[area.id] = {
            ...area,
            value: 0,
          };
        }

        acc[area.id].value += 1;
        return acc;
      }, {}),
    );

    const monthlyActivity = spreadsheets.reduce((acc, sheet) => {
      const month = new Date(sheet.modifiedTime || sheet.createdTime || Date.now()).toLocaleDateString('es-MX', {
        month: 'short',
        year: '2-digit',
      });
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {});

    const previewSummary = summarizePreviewRows(previewData);
    const visibleAreas = (areasAsignadas.length ? areasAsignadas : Object.keys(AREA_CONFIG))
      .map((id) => AREA_CONFIG[id])
      .filter(Boolean);

    return {
      areaCards: visibleAreas.map((area) => ({
        ...area,
        count: areaDistribution.find((entry) => entry.id === area.id)?.value || 0,
      })),
      areaDistribution,
      monthlyActivity: Object.entries(monthlyActivity).map(([label, value]) => ({ label, value })),
      previewSummary,
      totalFiles: spreadsheets.length,
      googleSheetsCount: spreadsheets.filter((sheet) => sheet.mimeType?.includes('google-apps.spreadsheet')).length,
      excelCount: spreadsheets.filter((sheet) => !sheet.mimeType?.includes('google-apps.spreadsheet')).length,
    };
  }, [areasAsignadas, previewData, spreadsheets]);
};

export default useComprasAnalytics;
