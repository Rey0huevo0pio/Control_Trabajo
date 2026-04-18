import React from 'react';
import { ComprasModuleScreen } from '../components/ComprasModuleScreen.jsx';
import { comprasModulesConfig } from '../lib/comprasModules.config.js';

export const InventarioScreen = () => (
  <ComprasModuleScreen moduleConfig={comprasModulesConfig.inventario} />
);

export default InventarioScreen;
