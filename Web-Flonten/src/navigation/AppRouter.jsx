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

// Importar módulos (named exports para pantallas)
import { ArchiveroHomeScreen } from '../src_Archivero_STV';
import { ChatHomeScreen } from '../src_Chat_STV';
import { InstalacionesHomeScreen } from '../src_Instalaciones_STV';
import { TicketHomeScreen } from '../src_P_Ticket_IT';

// Importar pantallas de Archivero
import { ArchiveroDetalleScreen } from '../src_Archivero_STV/screens/ArchiveroDetalleScreen';
import { CrearArchiveroScreen } from '../src_Archivero_STV/screens/CrearArchiveroScreen';
import { CarpetaDetalleScreen } from '../src_Archivero_STV/screens/CarpetaDetalleScreen';
import { GestionarMiembrosScreen } from '../src_Archivero_STV/screens/GestionarMiembrosScreen';
import { EscanearDocumentoScreen } from '../src_Archivero_STV/screens/EscanearDocumentoScreen';

// Importar pantallas de Tickets
import { CrearTicketScreen } from '../src_P_Ticket_IT/screens/CrearTicketScreen';
import { MisTicketsScreen } from '../src_P_Ticket_IT/screens/MisTicketsScreen';
import { TodosTicketsScreen } from '../src_P_Ticket_IT/screens/TodosTicketsScreen';
import { ReportesTicketsScreen } from '../src_P_Ticket_IT/screens/ReportesTicketsScreen';
import { DetalleTicketScreen } from '../src_P_Ticket_IT/screens/DetalleTicketScreen';

// Importar pantallas de Chat
import { PrivateChatsScreen } from '../src_Chat_STV/screens/PrivateChatsScreen';
import { GroupChatsScreen } from '../src_Chat_STV/screens/GroupChatsScreen';
import { EmailMainScreen } from '../src_Chat_STV/screens/EmailMainScreen';
import { ChatSearchScreen } from '../src_Chat_STV/screens/ChatSearchScreen';
import { EmployeeDirectoryScreen } from '../src_Chat_STV/screens/EmployeeDirectoryScreen';
import { NewsBoardScreen } from '../src_Chat_STV/screens/NewsBoardScreen';

// Importar pantallas de Instalaciones
import { RegistroInstalacionScreen } from '../src_Instalaciones_STV/screens/RegistroInstalacionScreen';
import { DetalleInstalacionScreen } from '../src_Instalaciones_STV/screens/DetalleInstalacionScreen';
import { RegistroAreaScreen } from '../src_Instalaciones_STV/screens/RegistroAreaScreen';

// Importar pantallas de Usuarios
import { UserManagementScreen } from '../screens/Components_Usuarios';

// Importar módulo de Compras
import { ComprasHomeScreen } from '../src_A_Compras';

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
        
        {/* Módulos - Archivero */}
        <Route
          path="/archivero"
          element={
            <ProtectedRoute>
              <ArchiveroHomeScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/archivero/crear"
          element={
            <ProtectedRoute>
              <CrearArchiveroScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/archivero/:archiveroId"
          element={
            <ProtectedRoute>
              <ArchiveroDetalleScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/archivero/:archiveroId/carpeta/nueva"
          element={
            <ProtectedRoute>
              <CarpetaDetalleScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/archivero/:archiveroId/carpeta/:carpetaId"
          element={
            <ProtectedRoute>
              <CarpetaDetalleScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/archivero/:archiveroId/miembros"
          element={
            <ProtectedRoute>
              <GestionarMiembrosScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/archivero/:archiveroId/subir"
          element={
            <ProtectedRoute>
              <ArchiveroHomeScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/archivero/:archiveroId/escanear"
          element={
            <ProtectedRoute>
              <EscanearDocumentoScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/archivero/archivo/:archivoId"
          element={
            <ProtectedRoute>
              <ArchiveroHomeScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/archivero/:archiveroId/config"
          element={
            <ProtectedRoute>
              <ArchiveroHomeScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/archivero/carpeta/:carpetaId/config"
          element={
            <ProtectedRoute>
              <ArchiveroHomeScreen />
            </ProtectedRoute>
          }
        />

        {/* Módulos - Tickets */}
        <Route
          path="/tickets"
          element={
            <ProtectedRoute>
              <TicketHomeScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tickets/crear"
          element={
            <ProtectedRoute>
              <CrearTicketScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tickets/mis-tickets"
          element={
            <ProtectedRoute>
              <MisTicketsScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tickets/todos"
          element={
            <ProtectedRoute>
              <TodosTicketsScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tickets/reportes"
          element={
            <ProtectedRoute>
              <ReportesTicketsScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tickets/:ticketId"
          element={
            <ProtectedRoute>
              <DetalleTicketScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tickets/:ticketId/editar"
          element={
            <ProtectedRoute>
              <CrearTicketScreen />
            </ProtectedRoute>
          }
        />

        {/* Módulos - Chat */}
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <ChatHomeScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat/private"
          element={
            <ProtectedRoute>
              <PrivateChatsScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat/grupos"
          element={
            <ProtectedRoute>
              <GroupChatsScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat/email"
          element={
            <ProtectedRoute>
              <EmailMainScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat/conversacion/:chatId"
          element={
            <ProtectedRoute>
              <ChatHomeScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat/buscar"
          element={
            <ProtectedRoute>
              <ChatSearchScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat/directorio"
          element={
            <ProtectedRoute>
              <EmployeeDirectoryScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat/noticias"
          element={
            <ProtectedRoute>
              <NewsBoardScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat/noticias/:noticiaId"
          element={
            <ProtectedRoute>
              <NewsBoardScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat/grupos/nuevo"
          element={
            <ProtectedRoute>
              <GroupChatsScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat/grupos/:groupId/info"
          element={
            <ProtectedRoute>
              <GroupChatsScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat/usuario/:userId"
          element={
            <ProtectedRoute>
              <EmployeeDirectoryScreen />
            </ProtectedRoute>
          }
        />

        {/* Módulos - Instalaciones */}
        <Route
          path="/instalaciones"
          element={
            <ProtectedRoute>
              <InstalacionesHomeScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/instalaciones/nueva"
          element={
            <ProtectedRoute>
              <RegistroInstalacionScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/instalaciones/:instalacionId"
          element={
            <ProtectedRoute>
              <DetalleInstalacionScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/instalaciones/:instalacionId/area/nueva"
          element={
            <ProtectedRoute>
              <RegistroAreaScreen />
            </ProtectedRoute>
          }
        />

        {/* Módulos - Usuarios */}
        <Route
          path="/usuarios"
          element={
            <ProtectedRoute>
              <UserManagementScreen />
            </ProtectedRoute>
          }
        />

        {/* Módulos - Compras */}
        <Route
          path="/compras"
          element={
            <ProtectedRoute>
              <ComprasHomeScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/compras/solicitudes"
          element={
            <ProtectedRoute>
              <PlaceholderScreen moduleName="Solicitudes de Compra" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/compras/ordenes"
          element={
            <ProtectedRoute>
              <PlaceholderScreen moduleName="Órdenes de Compra" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/compras/proveedores"
          element={
            <ProtectedRoute>
              <PlaceholderScreen moduleName="Proveedores" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/compras/presupuesto"
          element={
            <ProtectedRoute>
              <PlaceholderScreen moduleName="Presupuesto" />
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
