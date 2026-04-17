/**
 * API Service para Google Sheets (Web)
 * Documentación: https://developers.google.com/workspace/sheets/api/reference/rest
 */
import axios from 'axios';

const GOOGLE_SHEETS_API = 'https://sheets.googleapis.com/v4/spreadsheets';
const GOOGLE_DRIVE_API = 'https://www.googleapis.com/drive/v3';

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
      `${GOOGLE_DRIVE_API}/files`,
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
   * Descargar archivo de Google Drive como Excel
   */
  downloadAsExcel: async (accessToken, fileId, fileName) => {
    const response = await api.get(
      `${GOOGLE_DRIVE_API}/files/${fileId}/export`,
      {
        params: {
          mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        responseType: 'blob',
      }
    );
    
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${fileName}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    
    return true;
  },

  /**
   * Descargar directamente desde Google Sheets
   */
  downloadSpreadsheet: async (accessToken, spreadsheetId, title) => {
    const response = await api.get(
      `${GOOGLE_SHEETS_API}/${spreadsheetId}/export`,
      {
        params: {
          format: 'xlsx',
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        responseType: 'blob',
      }
    );
    
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${title}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    
    return true;
  },

  /**
   * Obtener contenido de una hoja como JSON
   */
  getSheetData: async (accessToken, spreadsheetId, range = 'Sheet1!A1:Z1000') => {
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
      `${GOOGLE_DRIVE_API}/files/${spreadsheetId}`,
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
      `${GOOGLE_DRIVE_API}/files/${spreadsheetId}/permissions`,
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