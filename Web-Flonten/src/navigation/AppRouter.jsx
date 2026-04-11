/**
 * ============================================================================
 * 🧭 APP ROUTER - Navegación con React Router (Web)
 * ============================================================================
 * 
 * QUÉ HACE:
 * - Configura rutas de la aplicación web
 * - Protección de rutas (requiere auth)
 * - Mismas rutas que el móvil
 * 
 * CONEXIONES:
 * - Mobile: C_Ticket_Apk_STV/src/navigation/AppNavigator.tsx
 * - Store: useAuthStore (verifica autenticación)
 * - Screens: Importa todas las pantallas
 * 
 * RUTAS:
 * - /login → LoginScreen
 * - / → HomeScreen (requiere auth)
 * - /instalaciones → Módulo Instalaciones
 * - /tickets → Módulo Tickets
 * - /chat → Módulo Chat
 * - /archivero → Módulo Archivero
 * - /usuarios → Gestión de Usuarios
 * 
 * ============================================================================
 */
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

// Importar pantallas principales
import { LoginScreen } from '../screens/P_Auth/LoginScreen';
import { HomeScreen } from '../screens/P_Principal/HomeScreen';

// Importar módulos
import ArchiveroModule from '../src_Archivero_STV';
import ChatModule from '../src_Chat_STV';
import InstalacionesModule from '../src_Instalaciones_STV';
import TicketsModule from '../src_P_Ticket_IT';

/**
 * PlaceholderScreen - Para rutas sin implementar
 */
const PlaceholderScreen = ({ moduleName }) => (
  <div style={{ padding: 40, textAlign: 'center' }}>
    <h1>Módulo {moduleName}</h1>
    <p>En desarrollo - Adaptando del móvil a web</p>
  </div>
);

/**
 * ProtectedRoute - Wrapper para rutas protegidas
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

/**
 * AppRouter - Configuración de rutas
 */
export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={<LoginScreen />} />
        
        {/* Rutas protegidas */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomeScreen />
            </ProtectedRoute>
          }
        />
        
        {/* Módulos */}
        <Route
          path="/instalaciones"
          element={
            <ProtectedRoute>
              <InstalacionesModule.InstalacionesHomeScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tickets"
          element={
            <ProtectedRoute>
              <TicketsModule.TicketHomeScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <ChatModule.ChatHomeScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/archivero"
          element={
            <ProtectedRoute>
              <ArchiveroModule.ArchiveroHomeScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/usuarios"
          element={
            <ProtectedRoute>
              <PlaceholderScreen moduleName="Usuarios" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reportes"
          element={
            <ProtectedRoute>
              <PlaceholderScreen moduleName="Reportes" />
            </ProtectedRoute>
          }
        />
        
        {/* Ruta no encontrada */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
