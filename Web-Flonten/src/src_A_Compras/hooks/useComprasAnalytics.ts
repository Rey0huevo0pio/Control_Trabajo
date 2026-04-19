import React from 'react';

export interface AreaConfig {
  id: string;
  label: string;
  icon: string;
  color: string;
}

export const AREA_CONFIG: Record<string, AreaConfig> = {
  solicitudes: { id: 'solicitudes', label: 'Solicitudes', icon: 'SP', color: '#2563EB' },
  ordenes: { id: 'ordenes', label: 'Ordenes', icon: 'OC', color: '#7C3AED' },
  proveedores: { id: 'proveedores', label: 'Proveedores', icon: 'PR', color: '#059669' },
  presupuesto: { id: 'presupuesto', label: 'Presupuesto', icon: 'PP', color: '#EA580C' },
  inventario: { id: 'inventario', label: 'Inventario', icon: 'IN', color: '#0F766E' },
  reportes: { id: 'reportes', label: 'Reportes', icon: 'RP', color: '#475569' },
  otros: { id: 'otros', label: 'Otros', icon: 'OT', color: '#64748B' },
};

export interface KeywordEntry {
  key: string;
  keywords: string[];
}

export const KEYWORD_MAP: KeywordEntry[] = [
  { key: 'solicitudes', keywords: ['solicitud', 'requisicion', 'request', 'compra'] },
  { key: 'ordenes', keywords: ['orden', 'oc', 'purchase order'] },
  { key: 'proveedores', keywords: ['proveedor', 'supplier', 'vendor'] },
  { key: 'presupuesto', keywords: ['presupuesto', 'budget', 'gasto', 'cost'] },
  { key: 'inventario', keywords: ['inventario', 'stock', 'almacen'] },
  { key: 'reportes', keywords: ['reporte', 'dashboard', 'grafica', 'indicador'] },
];

export const normalizeText = (value: string | number | null | undefined): string =>
  String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

export const parseMoney = (value: string | number | null | undefined): number => {
  if (typeof value === 'number') return value;
  if (!value) return 0;

  const cleaned = String(value)
    .replace(/[^\d,.-]/g, '')
    .replace(/\.(?=\d{3}(\D|$))/g, '')
    .replace(',', '.');

  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : 0;
};

export interface SheetInfo {
  name?: string;
  mimeType?: string;
  modifiedTime?: string;
  createdTime?: string;
}

export const detectArea = (sheet: SheetInfo | null | undefined): string => {
  if (!sheet) return 'otros';
  const source = normalizeText(`${sheet?.name || ''} ${sheet?.mimeType || ''}`);

  for (const entry of KEYWORD_MAP) {
    if (entry.keywords.some((keyword) => source.includes(keyword))) {
      return entry.key;
    }
  }

  return 'otros';
};

export interface PreviewData {
  values?: (string | null)[][];
}

export interface ColumnTotal {
  label: string;
  value: number;
  populated: number;
}

export interface CategoryDistribution {
  label: string;
  value: number;
}

export interface TimelineEntry {
  label: string;
  value: number;
}

export interface TableData {
  headers: string[];
  rows: Record<string, string | number>[];
}

export interface PreviewSummary {
  rowCount: number;
  columnCount: number;
  totalsByColumn: ColumnTotal[];
  categoryDistribution: CategoryDistribution[];
  timelineData: TimelineEntry[];
  table: TableData;
}

const summarizePreviewRows = (previewData: PreviewData | null): PreviewSummary => {
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
      headers.reduce<Record<string, string | number>>((acc, header, index) => {
        acc[header] = row[index] ?? '';
        return acc;
      }, {}),
    );

  const numericColumns = headers
    .map((header) => {
      const total = rows.reduce<number>((sum, row) => sum + parseMoney(row[header]), 0);
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

  const categoryMap = rows.reduce<Record<string, number>>((acc, row) => {
    const label = String(row[candidateCategoryHeader] || 'Sin dato').trim() || 'Sin dato';
    acc[label] = (acc[label] || 0) + 1;
    return acc;
  }, {});

  const categoryDistribution = Object.entries(categoryMap)
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => (b.value as number) - (a.value as number))
    .slice(0, 6);

  const candidateDateHeader = headers.find((header) => /(fecha|date|periodo|mes)/i.test(header));
  const timelineData = candidateDateHeader
    ? rows.reduce<Record<string, number>>((acc, row) => {
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

export interface UseComprasAnalyticsProps {
  spreadsheets?: SheetInfo[];
  areasAsignadas?: string[];
  previewData?: PreviewData | null;
}

export interface UseComprasAnalyticsResult {
  areaCards: (AreaConfig & { count: number })[];
  areaDistribution: (AreaConfig & { value: number })[];
  monthlyActivity: TimelineEntry[];
  previewSummary: PreviewSummary;
  totalFiles: number;
  googleSheetsCount: number;
  excelCount: number;
}

export const useComprasAnalytics = ({ spreadsheets = [], areasAsignadas = [], previewData = null }: UseComprasAnalyticsProps): UseComprasAnalyticsResult => {
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
      }, {} as Record<string, AreaConfig & { value: number }>),
    );

    const monthlyActivity = spreadsheets.reduce((acc, sheet) => {
      const month = new Date(sheet.modifiedTime || sheet.createdTime || new Date().toISOString()).toLocaleDateString('es-MX', {
        month: 'short',
        year: '2-digit',
      });
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

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