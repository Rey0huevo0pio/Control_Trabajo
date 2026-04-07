/**
 * ============================================================================
 * 🚀 APP.TSX - Componente Raíz de la Aplicación
 * ============================================================================
 * 
 * QUÉ HACE ESTE ARCHIVO:
 * - Punto de entrada principal de la app React Native
 * - Configura providers globales (Tamagui, Navigation, SafeArea)
 * - Envuelve toda la app con el sistema de diseño Tamagui
 * 
 * CONEXIONES:
 * - Navigation: src/navigation/AppNavigator.tsx (define rutas y pantallas)
 * - Tamagui: src/lib/tamagui.config.ts (configuración de tema y estilos)
 * - Store: Se inicializa implícitamente con Zustand (auto-inicializado)
 * - Backend: Indirectamente vía servicios en src/services/
 * 
 * ESTRUCTURA DE PROVIDERS:
 * TamaguiProvider (temas y estilos)
 *   └─ SafeAreaProvider (áreas seguras del dispositivo)
 *       └─ NavigationContainer (navegación)
 *           └─ AppNavigator (rutas y pantallas)
 * 
 * FLUJO DE INICIO:
 * 1. App se monta
 * 2. AppNavigator verifica estado de autenticación (useAuthStore)
 * 3. Si NO autenticado → muestra LoginScreen
 * 4. SI autenticado → muestra HomeScreen
 * 
 * PARA MODIFICAR:
 * - Agregar provider global: envolver dentro de TamaguiProvider
 * - Cambiar tema default: modificar defaultTheme en TamaguiProvider
 * - Agregar lógica de inicio: agregar useEffect antes del return
 * 
 * ============================================================================
 */
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TamaguiProvider } from 'tamagui';
import { AppNavigator } from './src/navigation';
import { tamaguiConfig } from './src/lib/tamagui.config';

export default function App() {
  return (
    <TamaguiProvider config={tamaguiConfig} defaultTheme="light">
      <SafeAreaProvider>
        <NavigationContainer>
          <AppNavigator />
          <StatusBar style="auto" />
        </NavigationContainer>
      </SafeAreaProvider>
    </TamaguiProvider>
  );
}
