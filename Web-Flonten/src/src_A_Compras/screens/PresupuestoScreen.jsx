import React from 'react';
import { ComprasModuleScreen } from '../components/ComprasModuleScreen.jsx';
import { comprasModulesConfig } from '../lib/comprasModules.config.js';

export const PresupuestoScreen = () => (
  <ComprasModuleScreen moduleConfig={comprasModulesConfig.presupuesto} />
);

export default PresupuestoScreen;
