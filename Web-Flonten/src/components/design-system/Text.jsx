/**
 * ============================================================================
 * 🔤 TEXT COMPONENT - Tipografía del Design System (Web)
 * ============================================================================
 * 
 * QUÉ HACE:
 * - Componente de texto con variantes tipográficas
 * - Mismas variantes que el móvil para consistencia
 * - Usa tokens de Tamagui
 * 
 * CONEXIONES:
 * - Mobile: C_Ticket_Apk_STV/src/components/design-system/Text.tsx
 * - Tamagui: Usa tokens de tamagui.config.ts
 * 
 * VARIANTES:
 * - h1, h2, h3, h4, h5, h6 → Títulos
 * - title1, title2, title3 → Títulos iOS style
 * - body → Texto cuerpo (default)
 * - bodySmall → Texto secundario
 * - caption → Texto pequeño
 * - label → Labels de form (semibold)
 * - labelSmall → Labels pequeños
 * 
 * ============================================================================
 */
import React from 'react';
import { styled } from 'tamagui';

// Configuración de variantes tipográficas
const textVariants = {
  // Títulos principales
  h1: { fontSize: '$5xl', fontWeight: 'bold', lineHeight: 1.2, letterSpacing: -0.4 },
  h2: { fontSize: '$3xl', fontWeight: 'semibold', lineHeight: 1.2, letterSpacing: -0.4 },
  h3: { fontSize: 'xl', fontWeight: 'semibold', lineHeight: 1.2 },
  h4: { fontSize: 'lg', fontWeight: 'semibold', lineHeight: 1.3 },
  h5: { fontSize: 'md', fontWeight: 'semibold', lineHeight: 1.4 },
  h6: { fontSize: 'sm', fontWeight: 'semibold', lineHeight: 1.4 },
  
  // Títulos iOS style
  title1: { fontSize: '$3xl', fontWeight: 'semibold', lineHeight: 1.2 },
  title2: { fontSize: 'xl', fontWeight: 'semibold', lineHeight: 1.25 },
  title3: { fontSize: 'lg', fontWeight: 'normal', lineHeight: 1.3 },
  
  // Cuerpo de texto
  body: { fontSize: 'md', fontWeight: 'normal', lineHeight: 1.47 },
  bodySmall: { fontSize: 'sm', fontWeight: 'normal', lineHeight: 1.5 },
  caption: { fontSize: 'xs', fontWeight: 'normal', lineHeight: 1.5 },
  
  // Labels
  label: { fontSize: 'md', fontWeight: 'semibold', lineHeight: 1.4 },
  labelSmall: { fontSize: 'sm', fontWeight: 'semibold', lineHeight: 1.4 },
};

// Componente base estilizado
const BaseText = styled('span', {
  color: '$color',
  fontFamily: '$body',
  variants: {
    variant: textVariants,
  },
  defaultVariants: {
    variant: 'body',
  },
});

/**
 * Componente Text del Design System
 * @param {Object} props - Props del componente
 * @param {string} props.variant - Variante tipográfica (h1-h6, body, caption, label, etc.)
 * @param {string} props.color - Color del texto (usa tokens Tamagui: $color, $primary, etc.)
 * @param {React.ReactNode} props.children - Contenido
 */
export const Text = ({ variant = 'body', color, children, style, ...props }) => {
  const textColor = color || '$color';
  
  return (
    <BaseText
      variant={variant}
      style={{ ...style, color: textColor }}
      {...props}
    >
      {children}
    </BaseText>
  );
};

export default Text;
