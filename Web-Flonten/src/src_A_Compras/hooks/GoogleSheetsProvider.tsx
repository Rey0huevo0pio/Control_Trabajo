import { useState, useEffect, useCallback, createContext, useRef } from 'react';
import { googleSheetsApi } from '../lib/googleSheets.api';
import { compraApi } from '../lib/compra.api';
import { spreadsheetsDB } from '../lib/spreadsheetsDB';

const GOOGLE_CLIENT_ID = import.meta.env?.VITE_GOOGLE_CLIENT_ID;
const SCOPES = 'openid email profile https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.metadata.readonly https://www.googleapis.com/auth/drive.readonly';
const TOKEN_KEY = 'google_sheets_token';
const USER_EMAIL_KEY = 'google_sheets_email';
const USER_NAME_KEY = 'google_sheets_name';
const CACHE_DURATION = 1000 * 60 * 15;

const GoogleSheetsContext = createContext(null);

export const GoogleSheetsProvider = ({ children }: { children?: any }) => {
  const hasInitializedRef = useRef(false);
  const [accessToken, setAccessToken] = useState<any>(() => localStorage.getItem(TOKEN_KEY));
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [spreadsheets, setSpreadsheets] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [userEmail, setUserEmail] = useState<any>(null);
  const [areasAsignadas, setAreasAsignadas] = useState(['solicitudes', 'ordenes', 'presupuesto']);
  const [nombre, setNombre] = useState<any>(null);

  const syncConnectionToBackend = useCallback(async (token, fallbackAreas = areasAsignadas) => {
    if (!token) return false;

    try {
      let email = localStorage.getItem(USER_EMAIL_KEY);
      let userName = localStorage.getItem(USER_NAME_KEY);

      if (!email) {
        const userInfo = await googleSheetsApi.getUserInfo(token);
        email = userInfo.email;
        userName = userInfo.name || userInfo.email.split('@')[0];
      }

      if (!email) {
        console.log('No se pudo sincronizar con backend: falta email de Google.');
        return false;
      }

      setUserEmail(email);
      setNombre(userName);
      localStorage.setItem(USER_EMAIL_KEY, email);
      localStorage.setItem(USER_NAME_KEY, userName || email.split('@')[0]);

      await compraApi.saveGoogleConnection({
        email,
        accessToken: token,
        refreshToken: null,
        tokenExpiry: null,
        nombre: userName,
        scope: SCOPES,
        areasAsignadas: fallbackAreas,
      });

      console.log('Conexion sincronizada con backend para:', email);
      return true;
    } catch (err) {
      if (err.response?.status === 401) {
        console.log('El token actual no permite leer userinfo. Se mantiene la sesion local hasta volver a iniciar sesion con Google.');
        return false;
      }
      console.error('Error sincronizando conexion con backend:', err);
      return false;
    }
  }, [areasAsignadas]);

  const loadSpreadsheets = useCallback(async (token, forceRefresh = false) => {
    if (!token) return;
    setLoading(true);
    console.log('Iniciando carga de spreadsheets...');

    if (!forceRefresh) {
      try {
        const cached = await (spreadsheetsDB.getSpreadsheets() as Promise<any[]>);
        const cacheTime = await spreadsheetsDB.getCacheTimestamp();

        if (cached.length > 0 && cacheTime) {
          const cacheAge = Date.now() - new Date(cacheTime).getTime();
          if (cacheAge < CACHE_DURATION) {
            console.log('Cargando desde cache IndexedDB:', cached.length, 'archivos');
            setSpreadsheets(cached);
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.log('Error leyendo cache, solicitando a API:', err.message);
      }
    }

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Timeout de red')), 15000),
    );

    try {
      const files = await (Promise.race([
        googleSheetsApi.listSpreadsheets(token),
        timeoutPromise,
      ]) as Promise<any>);
      console.log('Archivos obtenidos de API:', files);
      setSpreadsheets(files || []);

      if (files && files.length > 0) {
        await spreadsheetsDB.saveSpreadsheets(files);
        console.log('Datos guardados en IndexedDB');
      }
    } catch (err) {
      console.error('Error cargando spreadsheets:', err.message || err);

      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem(TOKEN_KEY);
        setIsSignedIn(false);
        setAccessToken(null);
        setError('Sesion expirada. Inicia sesion nuevamente.');
      } else {
        const cached = await (spreadsheetsDB.getSpreadsheets() as Promise<any[]>) .catch(() => []);
        if (cached.length > 0) {
          console.log('Usando cache despues de error:', cached.length, 'archivos');
          setSpreadsheets(cached);
          setError('Sin conexion. Usando datos en cache.');
        } else {
          setError(err.message);
        }
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const loadCurrentSpreadsheets = useCallback((forceRefresh = false) => {
    return loadSpreadsheets(accessToken, forceRefresh);
  }, [accessToken, loadSpreadsheets]);

  const initGis = useCallback(() => {
    if (!GOOGLE_CLIENT_ID) {
      setError('Google Client ID no configurado');
      return;
    }
    if (window.google?.accounts?.oauth2) return;

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => console.log('GIS loaded');
    script.onerror = () => setError('No se pudo cargar Google Identity Services');
    document.head.appendChild(script);
  }, []);

  const signIn = useCallback(() => {
    if (!window.google?.accounts?.oauth2) {
      console.error('Google OAuth no disponible');
      setError('Google OAuth no disponible. Recarga la pagina.');
      return;
    }

    console.log('Iniciando OAuth...');
    setLoading(true);
    setError(null);

    const client = window.google.accounts.oauth2.initTokenClient({
      client_id: GOOGLE_CLIENT_ID,
      scope: SCOPES,
      callback: async (response) => {
        console.log('OAuth response:', response);
        if (response.access_token) {
          console.log('Token recibido, iniciando carga...');
          localStorage.setItem(TOKEN_KEY, response.access_token);
          setAccessToken(response.access_token);
          setIsSignedIn(true);
          setLoading(false);

          try {
            await syncConnectionToBackend(response.access_token, areasAsignadas);
          } catch (err) {
            console.error('Error guardando conexion:', err);
          }

          loadSpreadsheets(response.access_token);
        } else if (response.error) {
          console.error('OAuth error:', response.error);
          setError(response.error);
          setLoading(false);
        }
      },
    });

    client.requestAccessToken({ prompt: 'consent' });
  }, [areasAsignadas, loadSpreadsheets, syncConnectionToBackend]);

  const signOut = useCallback(async () => {
    if (accessToken && window.google?.accounts?.oauth2) {
      window.google.accounts.oauth2.revoke(accessToken, () => {});
    }

    localStorage.removeItem(TOKEN_KEY);
    await spreadsheetsDB.clearSpreadsheets();

    try {
      await compraApi.disconnectGoogle();
      console.log('Conexion eliminada del backend');
    } catch (err) {
      console.error('Error desconectando del backend:', err);
    }

    setAccessToken(null);
    setIsSignedIn(false);
    setSpreadsheets([]);
    setUserEmail(null);
    setNombre(null);
    localStorage.removeItem(USER_EMAIL_KEY);
    localStorage.removeItem(USER_NAME_KEY);
  }, [accessToken]);

  const createSpreadsheet = useCallback(async (title) => {
    if (!accessToken) throw new Error('No autenticado');
    setLoading(true);
    try {
      const spreadsheet = await googleSheetsApi.createSpreadsheet(accessToken, title);
      await loadSpreadsheets(accessToken);
      return spreadsheet;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [accessToken, loadSpreadsheets]);

  const deleteSpreadsheet = useCallback(async (spreadsheetId) => {
    if (!accessToken) throw new Error('No autenticado');
    setLoading(true);
    try {
      await googleSheetsApi.deleteSpreadsheet(accessToken, spreadsheetId);
      await loadSpreadsheets(accessToken);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [accessToken, loadSpreadsheets]);

  const shareSpreadsheet = useCallback(async (spreadsheetId, email) => {
    if (!accessToken) throw new Error('No autenticado');
    try {
      return await googleSheetsApi.shareSpreadsheet(accessToken, spreadsheetId, email);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [accessToken]);

  const downloadSpreadsheet = useCallback(async (spreadsheetId, title, mimeType) => {
    if (!accessToken) throw new Error('No autenticado');
    setLoading(true);
    try {
      await googleSheetsApi.downloadSpreadsheet(accessToken, spreadsheetId, title, mimeType);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  const getSpreadsheetDetails = useCallback(async (spreadsheetId) => {
    if (!accessToken) throw new Error('No autenticado');
    return googleSheetsApi.getSpreadsheet(accessToken, spreadsheetId);
  }, [accessToken]);

  const getSpreadsheetValues = useCallback(async (spreadsheetId, range) => {
    if (!accessToken) throw new Error('No autenticado');
    return googleSheetsApi.getValues(accessToken, spreadsheetId, range);
  }, [accessToken]);

  const getSpreadsheetPreview = useCallback(async (spreadsheet, selectedSheetName?: string) => {
    if (!spreadsheet?.id) {
      throw new Error('Archivo no valido');
    }

    const webViewLink = spreadsheet.webViewLink || '';
    const isGoogleSheetLink = webViewLink.includes('docs.google.com/spreadsheets');
    const isDriveFileLink = webViewLink.includes('drive.google.com/file');
    
    const isGoogleSheet = spreadsheet.mimeType?.includes('google-apps.spreadsheet') || isGoogleSheetLink;
    const isExcel = spreadsheet.mimeType?.includes('officedocument.spreadsheet') || 
                 spreadsheet.mimeType?.includes('vnd.ms-excel') ||
                 spreadsheet.mimeType?.includes('openxmlformats') ||
                 spreadsheet.name?.match(/\.(xlsx|xls|xlsm|xlsb)$/i) ||
                 (isDriveFileLink && !isGoogleSheetLink);

    if (isGoogleSheet) {
      const details = await googleSheetsApi.getSpreadsheet(accessToken, spreadsheet.id);
      const allSheets = details?.sheets || [];
      const sheetNames = allSheets.map((s) => s.properties.title);

      const targetSheet = (selectedSheetName && sheetNames.includes(selectedSheetName))
        ? selectedSheetName
        : sheetNames[0];

      if (!targetSheet) {
        return {
          spreadsheet: details,
          range: null,
          values: [],
          table: { headers: [], rows: [] },
          rowCount: 0,
          columnCount: 0,
          categoryDistribution: [],
          sheetNames,
          activeSheetName: null,
          isExcel: false,
        };
      }

      const range = `'${targetSheet}'!A1:Z1000`;
      const valuesResponse = await googleSheetsApi.getValues(accessToken, spreadsheet.id, range);
      const rawValues = valuesResponse?.values || [];
      const headers = rawValues[0] || [];
      const dataRows = rawValues.slice(1);

      const tableRows = dataRows.map(row => {
        const obj: any = {};
        headers.forEach((h, i) => {
          obj[h] = row[i] ?? '';
        });
        return obj;
      });

      const categoryCol = headers.find(h => /categoria|area|tipo|grupo|estatus|estado/i.test(h));
      const categoryDistribution = categoryCol
        ? tableRows.reduce((acc, row) => {
            const cat = String(row[categoryCol] || 'Sin categoría');
            acc[cat] = (acc[cat] || 0) + 1;
            return acc;
          }, {} as Record<string, number>)
        : {};

      return {
        spreadsheet: details,
        range,
        values: rawValues,
        table: { headers, rows: tableRows },
        rowCount: dataRows.length,
        columnCount: headers.length,
        categoryDistribution: Object.entries(categoryDistribution).map(([label, value]) => ({ label, value })),
        sheetNames,
        activeSheetName: targetSheet,
        isExcel: false,
      };
    }

    if (isExcel) {
      try {
        const excelData = await googleSheetsApi.getExcelContent(accessToken, spreadsheet.id, selectedSheetName);
        return {
          spreadsheet: { properties: { title: spreadsheet.name } },
          range: null,
          values: [],
          table: {
            headers: excelData.headers,
            rows: excelData.rows,
          },
          rowCount: excelData.rows.length,
          columnCount: excelData.headers.length,
          categoryDistribution: [],
          sheetNames: excelData.sheetNames,
          activeSheetName: selectedSheetName || excelData.sheetNames[0] || null,
          isExcel: true,
        };
      } catch (err: any) {
        if (err.response?.status === 403) {
          throw new Error('No tienes permisos para ver este archivo. Solicita acceso al propietario o conviertelo a Google Sheets.');
        }
        if (err.response?.status === 404) {
          throw new Error('Archivo no encontrado. Puede que haya sido eliminado o movido.');
        }
        throw new Error(`Error leyendo Excel: ${err.message || 'Formato no compatible'}`);
      }
    }

    throw new Error('Tipo de archivo no soportado para vista previa.');
  }, [accessToken]);

  const updateAreasAsignadas = useCallback(async (nuevasAreas) => {
    setAreasAsignadas(nuevasAreas);
    try {
      await compraApi.updateAreas(nuevasAreas);
      console.log('Areas actualizadas en backend:', nuevasAreas);
    } catch (err) {
      console.error('Error actualizando areas:', err);
    }
  }, []);

  useEffect(() => {
    if (hasInitializedRef.current) return;
    hasInitializedRef.current = true;

    const loadSavedConnection = async () => {
      const savedToken = localStorage.getItem(TOKEN_KEY);
      if (savedToken) {
        setAccessToken(savedToken);
        setIsSignedIn(true);

        try {
          const status = await compraApi.getConnectionStatus();
          if (status.connected) {
            const backendEmail = status.email || null;
            const backendNombre = status.nombre || null;
            setUserEmail(backendEmail);
            setNombre(backendNombre);
            if (backendEmail) {
              localStorage.setItem(USER_EMAIL_KEY, backendEmail);
            }
            if (backendNombre) {
              localStorage.setItem(USER_NAME_KEY, backendNombre);
            }
            if (status.areasAsignadas?.length) {
              setAreasAsignadas(status.areasAsignadas);
            }
          } else {
            await syncConnectionToBackend(savedToken);
          }
        } catch (err) {
          console.log('No se pudo validar/sincronizar la conexion en backend:', err.message);
          await syncConnectionToBackend(savedToken);
        }

        const cached = await (spreadsheetsDB.getSpreadsheets() as Promise<any[]>) .catch(() => []);
        if (cached.length > 0) {
          console.log('Cargando desde IndexedDB al inicio:', cached.length, 'archivos');
          setSpreadsheets(cached);
          loadSpreadsheets(savedToken, true);
        } else {
          loadSpreadsheets(savedToken);
        }
        return;
      }

      try {
        const status = await compraApi.getConnectionStatus();
        if (status.connected && status.accessToken) {
          localStorage.setItem(TOKEN_KEY, status.accessToken);
          setAccessToken(status.accessToken);
          setIsSignedIn(true);
          setUserEmail(status.email);
          setNombre(status.nombre);
          if (status.email) {
            localStorage.setItem(USER_EMAIL_KEY, status.email);
          }
          if (status.nombre) {
            localStorage.setItem(USER_NAME_KEY, status.nombre);
          }
          if (status.areasAsignadas) {
            setAreasAsignadas(status.areasAsignadas);
          }
          loadSpreadsheets(status.accessToken);
        }
      } catch (err) {
        console.log('No hay conexion guardada o error:', err.message);
      }
    };

    loadSavedConnection();
  }, [loadSpreadsheets, syncConnectionToBackend]);

  useEffect(() => {
    initGis();
  }, [initGis]);

  return (
    <GoogleSheetsContext.Provider
      value={{
        accessToken,
        isSignedIn,
        spreadsheets,
        loading,
        error,
        signIn,
        signOut,
        loadSpreadsheets: loadCurrentSpreadsheets,
        createSpreadsheet,
        deleteSpreadsheet,
        shareSpreadsheet,
        downloadSpreadsheet,
        getSpreadsheetDetails,
        getSpreadsheetValues,
        getSpreadsheetPreview,
        userEmail,
        nombre,
        areasAsignadas,
        updateAreasAsignadas,
      }}
    >
      {children}
    </GoogleSheetsContext.Provider>
  );
};

export { GoogleSheetsContext };
