/**
 * API Service para Google Sheets (Web)
 * Documentación: https://developers.google.com/workspace/sheets/api/reference/rest
 */
import axios from 'axios';

const GOOGLE_SHEETS_API = 'https://sheets.googleapis.com/v4/spreadsheets';
const GOOGLE_DRIVE_API = 'https://www.googleapis.com/drive/v3';
const GOOGLE_USERINFO_API = 'https://www.googleapis.com/oauth2/v2/userinfo';

const api = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});

export const googleSheetsApi = {
  /**
   * Obtener información del usuario de Google
   */
  getUserInfo: async (accessToken) => {
    const response = await api.get(GOOGLE_USERINFO_API, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  },

  /**
   * Listar hojas de cálculo del usuario (Google Sheets + Excel)
   */
  listSpreadsheets: async (accessToken) => {
    const response = await api.get(
      `${GOOGLE_DRIVE_API}/files`,
      {
        params: {
          q: "mimeType contains 'spreadsheet' or mimeType contains '/vnd.ms-excel' or mimeType contains 'officedocument.spreadsheet'",
          fields: 'files(id, name, mimeType, createdTime, modifiedTime, webViewLink)',
          orderBy: 'modifiedTime desc',
          pageSize: 100,
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
   * Descargar archivo - detecta el tipo mime
   */
  downloadSpreadsheet: async (accessToken, spreadsheetId, title, mimeType) => {
    let url, format;
    
    if (mimeType?.includes('google-apps')) {
      url = `${GOOGLE_SHEETS_API}/${spreadsheetId}/export`;
      format = 'xlsx';
    } else {
      url = `${GOOGLE_DRIVE_API}/files/${spreadsheetId}`;
    }

    const response = await api.get(url, {
      params: mimeType?.includes('google-apps') ? { format } : { alt: 'media' },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      responseType: 'blob',
    });
    
    const blob = response.data;
    const urlBlob = window.URL.createObjectURL(new Blob([blob]));
    const link = document.createElement('a');
    link.href = urlBlob;
    const extension = mimeType?.includes('google-apps') ? 'xlsx' : 'xls';
    link.setAttribute('download', `${title}.${extension}`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(urlBlob);
    
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