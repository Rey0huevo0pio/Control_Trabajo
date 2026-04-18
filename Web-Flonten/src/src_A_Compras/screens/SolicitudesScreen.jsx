import React from 'react';
import { ComprasModuleScreen } from '../components/ComprasModuleScreen.jsx';
import { comprasModulesConfig } from '../lib/comprasModules.config.js';

export const SolicitudesScreen = () => (
  <ComprasModuleScreen moduleConfig={comprasModulesConfig.solicitudes} />
);

export default SolicitudesScreen;
