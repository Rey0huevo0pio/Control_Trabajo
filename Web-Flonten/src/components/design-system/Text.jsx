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

// Configuración de variantes tipográficas
const textVariants = {
  // Títulos principales
  h1: { fontSize: '3rem', fontWeight: 'bold', lineHeight: '1.2', letterSpacing: '-0.4px' },
  h2: { fontSize: '2rem', fontWeight: '600', lineHeight: '1.2', letterSpacing: '-0.4px' },
  h3: { fontSize: '1.25rem', fontWeight: '600', lineHeight: '1.2' },
  h4: { fontSize: '1.125rem', fontWeight: '600', lineHeight: '1.3' },
  h5: { fontSize: '1rem', fontWeight: '600', lineHeight: '1.4' },
  h6: { fontSize: '0.875rem', fontWeight: '600', lineHeight: '1.4' },

  // Títulos iOS style
  title1: { fontSize: '2rem', fontWeight: '600', lineHeight: '1.2' },
  title2: { fontSize: '1.25rem', fontWeight: '600', lineHeight: '1.25' },
  title3: { fontSize: '1.125rem', fontWeight: '400', lineHeight: '1.3' },

  // Cuerpo de texto
  body: { fontSize: '1rem', fontWeight: '400', lineHeight: '1.47' },
  bodySmall: { fontSize: '0.875rem', fontWeight: '400', lineHeight: '1.5' },
  caption: { fontSize: '0.75rem', fontWeight: '400', lineHeight: '1.5' },

  // Labels
  label: { fontSize: '1rem', fontWeight: '600', lineHeight: '1.4' },
  labelSmall: { fontSize: '0.875rem', fontWeight: '600', lineHeight: '1.4' },
};

/**
 * Componente Text del Design System
 * @param {Object} props - Props del componente
 * @param {string} props.variant - Variante tipográfica (h1-h6, body, caption, label, etc.)
 * @param {string} props.color - Color del texto
 * @param {React.ReactNode} props.children - Contenido
 */
export const Text = ({ variant = 'body', color, children, style, ...props }) => {
  const variantStyle = textVariants[variant] || textVariants.body;
  const textColor = color || 'inherit';

  return (
    <span
      style={{ 
        ...variantStyle, 
        color: textColor,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        margin: 0,
        ...style 
      }}
      {...props}
    >
      {children}
    </span>
  );
};

export default Text;
