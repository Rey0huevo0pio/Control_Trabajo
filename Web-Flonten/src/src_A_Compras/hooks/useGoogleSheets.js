import { useState, useCallback, useEffect } from 'react';
import { googleSheetsApi } from '../lib/googleSheets.api';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.file';

export const useGoogleSheets = () => {
  const [accessToken, setAccessToken] = useState(null);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [spreadsheets, setSpreadsheets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const initGoogleClient = useCallback(async () => {
    if (!GOOGLE_CLIENT_ID) {
      setError('Google Client ID no configurado');
      return;
    }

    try {
      await new Promise((resolve, reject) => {
        window.gapi?.load('client:auth2', async () => {
          try {
            await window.gapi.client.init({
              apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
              clientId: GOOGLE_CLIENT_ID,
              scope: SCOPES,
              discoveryDocs: [
                'https://sheets.googleapis.com/$discovery/rest?version=v4',
                'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest',
              ],
            });
            resolve();
          } catch (err) {
            reject(err);
          }
        });
      });

      const authInstance = window.gapi?.auth2?.getAuthInstance();
      if (authInstance) {
        setIsSignedIn(authInstance.isSignedIn.get());
        if (authInstance.isSignedIn.get()) {
          const token = authInstance.currentUser.get().getAuthResponse().access_token;
          setAccessToken(token);
        }
      }
    } catch (err) {
      console.log('GAPI no disponible, usando método alternativo');
    }
  }, []);

  const signIn = useCallback(async () => {
    if (!GOOGLE_CLIENT_ID) {
      setError('Google Client ID no configurado');
      return;
    }

    setLoading(true);
    try {
      const popup = window.open(
        `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(window.location.origin + '/auth/google/callback')}&response_type=token&scope=${encodeURIComponent(SCOPES)}`,
        'Google Sign In',
        'width=500,height=600'
      );

      const checkAuth = setInterval(() => {
        try {
          if (popup.closed) {
            clearInterval(checkAuth);
            const hash = window.location.hash;
            if (hash.includes('access_token')) {
              const params = new URLSearchParams(hash.substring(1));
              const token = params.get('access_token');
              if (token) {
                setAccessToken(token);
                setIsSignedIn(true);
                window.location.hash = '';
              }
            }
            setLoading(false);
          }
        } catch (e) {
          // Cross-origin blocked
        }
      }, 500);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(() => {
    window.gapi?.auth2?.getAuthInstance()?.signOut();
    setAccessToken(null);
    setIsSignedIn(false);
    setSpreadsheets([]);
  }, []);

  const loadSpreadsheets = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    try {
      const files = await googleSheetsApi.listSpreadsheets(accessToken);
      setSpreadsheets(files);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  const createSpreadsheet = useCallback(async (title) => {
    if (!accessToken) throw new Error('No autenticado');
    setLoading(true);
    try {
      const spreadsheet = await googleSheetsApi.createSpreadsheet(accessToken, title);
      await loadSpreadsheets();
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
      await loadSpreadsheets();
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

  useEffect(() => {
    initGoogleClient();
  }, [initGoogleClient]);

  return {
    accessToken,
    isSignedIn,
    spreadsheets,
    loading,
    error,
    signIn,
    signOut,
    loadSpreadsheets,
    createSpreadsheet,
    deleteSpreadsheet,
    shareSpreadsheet,
  };
};

export default useGoogleSheets;