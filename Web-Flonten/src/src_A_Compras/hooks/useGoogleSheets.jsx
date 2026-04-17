import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { googleSheetsApi } from '../lib/googleSheets.api';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.metadata.readonly';

const GoogleSheetsContext = createContext(null);

export const GoogleSheetsProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [spreadsheets, setSpreadsheets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadSpreadsheets = useCallback(async (token) => {
    if (!token) return;
    setLoading(true);
    console.log('Iniciando carga de spreadsheets...');
    
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout de red')), 15000)
    );
    
    try {
      const files = await Promise.race([
        googleSheetsApi.listSpreadsheets(token),
        timeoutPromise
      ]);
      console.log('Archivos obtenidos:', files);
      setSpreadsheets(files || []);
    } catch (err) {
      console.error('Error cargando spreadsheets:', err.message || err);
      if (err.response?.status === 401) {
        setIsSignedIn(false);
        setAccessToken(null);
        setError('Sesión expirada. Inicia sesión nuevamente.');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }, []);

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
      setError('Google OAuth no disponible. Recarga la página.');
      return;
    }

    console.log('Iniciando OAuth...');
    setLoading(true);
    setError(null);

    const client = window.google.accounts.oauth2.initTokenClient({
      client_id: GOOGLE_CLIENT_ID,
      scope: SCOPES,
      callback: (response) => {
        console.log('OAuth response:', response);
        if (response.access_token) {
          console.log('Token recibido, iniciando carga...');
          setAccessToken(response.access_token);
          setIsSignedIn(true);
          setLoading(false);
          loadSpreadsheets(response.access_token);
        } else if (response.error) {
          console.error('OAuth error:', response.error);
          setError(response.error);
          setLoading(false);
        }
      },
    });

    client.requestAccessToken({ prompt: 'consent' });
  }, [loadSpreadsheets]);

  const signOut = useCallback(() => {
    if (accessToken && window.google?.accounts?.oauth2) {
      window.google.accounts.oauth2.revoke(accessToken, () => {});
    }
    setAccessToken(null);
    setIsSignedIn(false);
    setSpreadsheets([]);
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

  useEffect(() => { initGis(); }, [initGis]);

  return (
    <GoogleSheetsContext.Provider value={{
      accessToken,
      isSignedIn,
      spreadsheets,
      loading,
      error,
      signIn,
      signOut,
      loadSpreadsheets: () => loadSpreadsheets(accessToken),
      createSpreadsheet,
      deleteSpreadsheet,
      shareSpreadsheet,
      downloadSpreadsheet,
    }}>
      {children}
    </GoogleSheetsContext.Provider>
  );
};

export const useGoogleSheets = () => {
  const context = useContext(GoogleSheetsContext);
  if (!context) throw new Error('useGoogleSheets debe usarse dentro de GoogleSheetsProvider');
  return context;
};