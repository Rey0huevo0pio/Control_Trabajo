import { useContext } from 'react';
import { GoogleSheetsContext } from './GoogleSheetsProvider';

export const useGoogleSheets = () => {
  const context = useContext(GoogleSheetsContext);
  if (!context) throw new Error('useGoogleSheets debe usarse dentro de GoogleSheetsProvider');
  return context;
};

export default useGoogleSheets;