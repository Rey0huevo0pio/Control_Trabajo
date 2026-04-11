/**
 * ============================================================================
 * 📦 DESIGN SYSTEM INDEX - Export Oficial de Componentes
 * ============================================================================
 * 
 * QUÉ HACE:
 * - Exporta todos los componentes del design system
 * - Punto de importación único para toda la app
 * 
 * USO:
 * import { Text, Button, Card, Stack, HStack, Input, ScreenLayout } 
 *   from '../components/design-system';
 * 
 * ============================================================================
 */

export { Text } from './Text';
export { Button, IconButton } from './Button';
export { Card, Stack, HStack, ScreenLayout, ScreenSection } from './Layout';
export { Input } from './Input';

// Export default con todos los componentes
export default {
  Text: require('./Text').Text,
  Button: require('./Button').Button,
  IconButton: require('./Button').IconButton,
  Card: require('./Layout').Card,
  Stack: require('./Layout').Stack,
  HStack: require('./Layout').HStack,
  ScreenLayout: require('./Layout').ScreenLayout,
  ScreenSection: require('./Layout').ScreenSection,
  Input: require('./Input').Input,
};
