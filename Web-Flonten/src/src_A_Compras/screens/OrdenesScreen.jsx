import React from 'react';
import { ComprasModuleScreen } from '../components/ComprasModuleScreen.jsx';
import { comprasModulesConfig } from '../lib/comprasModules.config.js';

export const OrdenesScreen = () => (
  <ComprasModuleScreen moduleConfig={comprasModulesConfig.ordenes} />
);

export default OrdenesScreen;
