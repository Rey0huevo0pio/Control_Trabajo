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
import Text from './Text';
import Button, { IconButton } from './Button';
import layoutExports from './Layout';
import Input from './Input';

const { Card, Stack, HStack, ScreenLayout, ScreenSection } = layoutExports;

export { Text, Button, IconButton, Card, Stack, HStack, ScreenLayout, ScreenSection, Input };

export default {
  Text,
  Button,
  IconButton,
  Card,
  Stack,
  HStack,
  ScreenLayout,
  ScreenSection,
  Input,
};