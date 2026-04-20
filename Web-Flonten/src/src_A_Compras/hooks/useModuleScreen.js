import React from 'react';
import { useGoogleSheets } from './useGoogleSheets.js';
import { useComprasAnalytics, detectArea } from './useComprasAnalytics.js';

const filterModuleSheets = (spreadsheets, moduleId) => {
  const filtered = spreadsheets.filter((s) => detectArea(s) === moduleId);
  return filtered.length ? filtered : spreadsheets;
};

export const useModuleScreen = (moduleId) => {
  const { spreadsheets, loading, isSignedIn, loadSpreadsheets, getSpreadsheetPreview } = useGoogleSheets();

  const [showSheetsManager, setShowSheetsManager] = React.useState(false);
  const [selectedSpreadsheet, setSelectedSpreadsheet] = React.useState(null);
  const [selectedSheetName, setSelectedSheetName] = React.useState(null);
  const [previewData, setPreviewData] = React.useState(null);
  const [previewLoading, setPreviewLoading] = React.useState(false);
  const [previewError, setPreviewError] = React.useState(null);
  const [editorSaveData, setEditorSaveData] = React.useState(null);
  const [activeTab, setActiveTab] = React.useState(null);

  const moduleSheets = React.useMemo(() => filterModuleSheets(spreadsheets, moduleId), [spreadsheets, moduleId]);

  const analytics = useComprasAnalytics({ spreadsheets: moduleSheets, areasAsignadas: [moduleId], previewData });

  // Cuando cambia el archivo seleccionado, resetear la hoja
  React.useEffect(() => {
    if (!moduleSheets.length) { setSelectedSpreadsheet(null); setPreviewData(null); return; }
    setSelectedSpreadsheet((current) => {
      if (current && moduleSheets.some((s) => s.id === current.id)) return current;
      return moduleSheets.find((s) => s.mimeType?.includes('google-apps.spreadsheet')) || moduleSheets[0];
    });
    setSelectedSheetName(null);
  }, [moduleSheets]);

  // Cargar preview cuando cambia archivo o hoja seleccionada
  React.useEffect(() => {
    if (!selectedSpreadsheet || !isSignedIn) return;
    let cancelled = false;
    const run = async () => {
      setPreviewLoading(true);
      setPreviewError(null);
      try {
        const result = await getSpreadsheetPreview(selectedSpreadsheet, selectedSheetName);
        if (!cancelled) setPreviewData(result);
      } catch (err) {
        if (!cancelled) { setPreviewData(null); setPreviewError(err.message || 'No se pudo cargar la vista previa.'); }
      } finally {
        if (!cancelled) setPreviewLoading(false);
      }
    };
    run();
    return () => { cancelled = true; };
  }, [getSpreadsheetPreview, isSignedIn, selectedSpreadsheet, selectedSheetName]);

  const sheetNames = previewData?.sheetNames || [];
  const activeSheetName = previewData?.activeSheetName || selectedSheetName;

  return {
    moduleSheets, loading, isSignedIn, loadSpreadsheets,
    showSheetsManager, setShowSheetsManager,
    selectedSpreadsheet, setSelectedSpreadsheet,
    selectedSheetName, setSelectedSheetName,
    sheetNames, activeSheetName,
    previewData, previewLoading, previewError,
    editorSaveData, setEditorSaveData,
    activeTab, setActiveTab,
    analytics,
  };
};

export default useModuleScreen;
