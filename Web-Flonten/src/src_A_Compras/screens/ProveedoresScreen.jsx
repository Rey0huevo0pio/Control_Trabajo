import React from 'react';
import { ComprasModuleScreen } from '../components/ComprasModuleScreen.jsx';
import { comprasModulesConfig } from '../lib/comprasModules.config.js';

export const ProveedoresScreen = () => (
  <ComprasModuleScreen moduleConfig={comprasModulesConfig.proveedores} />
);

export default ProveedoresScreen;
