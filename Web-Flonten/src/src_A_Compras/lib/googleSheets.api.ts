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

export interface GoogleUserInfo {
  id: string;
  email: string;
  name: string;
  picture?: string;
}

export interface SpreadsheetFile {
  id: string;
  name: string;
  mimeType: string;
  createdTime?: string;
  modifiedTime?: string;
  webViewLink?: string;
}

export interface SheetData {
  range?: string;
  majorDimension?: string;
  values?: (string | null)[][];
}

export interface SpreadsheetDetails {
  spreadsheetId?: string;
  properties?: {
    title: string;
    locale?: string;
    timeZone?: string;
  };
  sheets?: Array<{
    properties: {
      sheetId: number;
      title: string;
      index: number;
    };
  }>;
}

export const googleSheetsApi = {
  getUserInfo: async (accessToken: string): Promise<GoogleUserInfo> => {
    const response = await api.get<GoogleUserInfo>(GOOGLE_USERINFO_API, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  },

  listSpreadsheets: async (accessToken: string): Promise<SpreadsheetFile[]> => {
    const response = await api.get<{ files: SpreadsheetFile[] }>(
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

  downloadAsExcel: async (accessToken: string, fileId: string, fileName: string): Promise<boolean> => {
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

  getExcelContent: async (accessToken: string, fileId: string): Promise<{ headers: string[]; rows: any[] }> => {
    const response = await api.get(
      `${GOOGLE_DRIVE_API}/files/${fileId}`,
      {
        params: { alt: 'media' },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        responseType: 'blob',
      }
    );

    const blob = response.data as Blob;
    const arrayBuffer = await blob.arrayBuffer();
    const data = new Uint8Array(arrayBuffer);

    const XLSX = await import('xlsx');
    const workbook = XLSX.read(data, { type: 'array', cellDates: true });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];

    if (!jsonData.length) {
      return { headers: [], rows: [] };
    }

    const headers = jsonData[0].map((h, i) => String(h) || `Columna_${i + 1}`);
    const rows = jsonData.slice(1).map(row => {
      const obj: any = {};
      headers.forEach((h, i) => {
        obj[h] = row[i] ?? '';
      });
      return obj;
    });

    return { headers, rows };
  },

  downloadSpreadsheet: async (accessToken: string, spreadsheetId: string, title: string, mimeType?: string): Promise<boolean> => {
    let url: string;
    let format: string = 'xlsx';
    
    if (mimeType?.includes('google-apps')) {
      url = `${GOOGLE_SHEETS_API}/${spreadsheetId}/export`;
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

  getSheetData: async (accessToken: string, spreadsheetId: string, range: string = 'Sheet1!A1:Z1000'): Promise<SheetData> => {
    const response = await api.get<SheetData>(
      `${GOOGLE_SHEETS_API}/${spreadsheetId}/values/${range}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  },

  createSpreadsheet: async (accessToken: string, title: string, sheets: string[] = ['Sheet1']): Promise<SpreadsheetDetails> => {
    const response = await api.post<SpreadsheetDetails>(
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

  getSpreadsheet: async (accessToken: string, spreadsheetId: string): Promise<SpreadsheetDetails> => {
    const response = await api.get<SpreadsheetDetails>(
      `${GOOGLE_SHEETS_API}/${spreadsheetId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  },

  getValues: async (accessToken: string, spreadsheetId: string, range: string): Promise<SheetData> => {
    const response = await api.get<SheetData>(
      `${GOOGLE_SHEETS_API}/${spreadsheetId}/values/${range}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  },

  updateValues: async (accessToken: string, spreadsheetId: string, range: string, values: (string | number)[][]): Promise<any> => {
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

  addSheet: async (accessToken: string, spreadsheetId: string, sheetTitle: string): Promise<any> => {
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

  deleteSpreadsheet: async (accessToken: string, spreadsheetId: string): Promise<any> => {
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

  deleteSheet: async (accessToken: string, spreadsheetId: string, sheetId: number): Promise<any> => {
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

  shareSpreadsheet: async (accessToken: string, spreadsheetId: string, email: string, role: string = 'writer'): Promise<any> => {
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