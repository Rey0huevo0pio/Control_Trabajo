/**
 * API Service para Google Sheets (Web)
 * Documentación: https://developers.google.com/workspace/sheets/api/reference/rest
 */
import axios from 'axios';

const GOOGLE_SHEETS_API = 'https://sheets.googleapis.com/v4/spreadsheets';

const api = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});

export const googleSheetsApi = {
  /**
   * Listar hojas de cálculo del usuario
   */
  listSpreadsheets: async (accessToken) => {
    const response = await api.get(
      'https://www.googleapis.com/drive/v3/files',
      {
        params: {
          q: "mimeType='application/vnd.google-apps.spreadsheet'",
          fields: 'files(id, name, createdTime, modifiedTime)',
          orderBy: 'modifiedTime desc',
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data.files;
  },

  /**
   * Crear una nueva hoja de cálculo
   */
  createSpreadsheet: async (accessToken, title, sheets = ['Sheet1']) => {
    const response = await api.post(
      GOOGLE_SHEETS_API,
      {
        properties: { title },
        sheets: sheets.map(name => ({
          properties: { title: name }
        })),
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  },

  /**
   * Obtener detalles de una hoja de cálculo
   */
  getSpreadsheet: async (accessToken, spreadsheetId) => {
    const response = await api.get(
      `${GOOGLE_SHEETS_API}/${spreadsheetId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  },

  /**
   * Obtener valores de una hoja
   */
  getValues: async (accessToken, spreadsheetId, range) => {
    const response = await api.get(
      `${GOOGLE_SHEETS_API}/${spreadsheetId}/values/${range}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  },

  /**
   * Actualizar valores en una hoja
   */
  updateValues: async (accessToken, spreadsheetId, range, values) => {
    const response = await api.put(
      `${GOOGLE_SHEETS_API}/${spreadsheetId}/values/${range}`,
      {
        values,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  },

  /**
   * Agregar una nueva hoja a un spreadsheet
   */
  addSheet: async (accessToken, spreadsheetId, sheetTitle) => {
    const response = await api.post(
      `${GOOGLE_SHEETS_API}/${spreadsheetId}:batchUpdate`,
      {
        requests: [{
          addSheet: {
            properties: { title: sheetTitle }
          }
        }],
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  },

  /**
   * Eliminar una hoja de cálculo
   */
  deleteSpreadsheet: async (accessToken, spreadsheetId) => {
    const response = await api.delete(
      `https://www.googleapis.com/drive/v3/files/${spreadsheetId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  },

  /**
   * Eliminar una hoja específica de un spreadsheet
   */
  deleteSheet: async (accessToken, spreadsheetId, sheetId) => {
    const response = await api.post(
      `${GOOGLE_SHEETS_API}/${spreadsheetId}:batchUpdate`,
      {
        requests: [{
          deleteSheet: { sheetId }
        }],
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  },

  /**
   * Compartir spreadsheet
   */
  shareSpreadsheet: async (accessToken, spreadsheetId, email, role = 'writer') => {
    const response = await api.post(
      `https://www.googleapis.com/drive/v3/files/${spreadsheetId}/permissions`,
      {
        type: 'user',
        role,
        emailAddress: email,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  },
};

export default googleSheetsApi;