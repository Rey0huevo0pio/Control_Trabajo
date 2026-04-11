/**
 * ============================================================================
 * 🚀 APP.JSX - Componente Raíz de la Aplicación Web
 * ============================================================================
 * 
 * QUÉ HACE ESTE ARCHIVO:
 * - Punto de entrada principal de la app React web
 * - Configura TamaguiProvider (mismo diseño que móvil)
 * - Configura routing con React Router
 * - Envuelve toda la app con providers
 * 
 * CONEXIONES:
 * - Mobile: C_Ticket_Apk_STV/App.tsx (mismo patrón)
 * - Tamagui: src/lib/tamagui.config.ts (mismos tokens)
 * - Router: src/navigation/AppRouter.jsx (rutas)
 * - Store: Zustand (auto-inicializado, no necesita provider)
 * 
 * ESTRUCTURA DE PROVIDERS:
 * TamaguiProvider (temas y estilos)
 *   └─ AppRouter (React Router)
 *       └─ Rutas y pantallas
 * 
 * FLUJO DE INICIO:
 * 1. App se monta
 * 2. AppRouter verifica autenticación (ProtectedRoute)
 * 3. SI NO autenticado → LoginScreen
 * 4. SI autenticado → HomeScreen
 * 
 * PARA MODIFICAR:
 * - Agregar provider global: envolver dentro de TamaguiProvider
 * - Cambiar tema default: modificar defaultTheme en tamagui.config.ts
 * - Agregar lógica de inicio: agregar useEffect antes del return
 * 
 * ============================================================================
 */
import React from 'react';
import { TamaguiProvider } from 'tamagui';
import tamaguiConfig from './lib/tamagui.config';
import { AppRouter } from './navigation/AppRouter';

export default function App() {
  return (
    <TamaguiProvider config={tamaguiConfig} defaultTheme="light">
      <AppRouter />
    </TamaguiProvider>
  );
}
