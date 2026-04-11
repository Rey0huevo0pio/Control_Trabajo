/**
 * ============================================================================
 * 🃏 CARD & LAYOUT COMPONENTS - Contenedores del Design System (Web)
 * ============================================================================
 * 
 * QUÉ HACE:
 * - Card con 5 variantes (default, elevated, outlined, filled, grouped)
 * - Stack (vertical), HStack (horizontal)
 * - ScreenLayout (layout de pantalla completo)
 * - ScreenSection (sección de pantalla)
 * 
 * CONEXIONES:
 * - Mobile: C_Ticket_Apk_STV/src/components/design-system/Card.tsx, Layout.tsx
 * - Tamagui: Usa tokens de tamagui.config.ts
 * 
 * ============================================================================
 */

// ============================================================================
// CARD COMPONENT
// ============================================================================

const cardVariants = {
  default: { backgroundColor: '$backgroundSecondary', border: 'none', boxShadow: 'none' },
  elevated: { backgroundColor: '$backgroundSecondary', border: 'none', boxShadow: '0 4px 8px rgba(0,0,0,0.08)' },
  outlined: { backgroundColor: '$backgroundSecondary', border: '1px solid $border', boxShadow: 'none' },
  filled: { backgroundColor: '$backgroundTertiary', border: 'none', boxShadow: 'none' },
  grouped: { backgroundColor: '$backgroundTertiary', border: '1px solid $borderSubtle', boxShadow: 'none' },
};

/**
 * Componente Card del Design System
 * @param {Object} props
 * @param {string} props.variant - Variante (default, elevated, outlined, filled, grouped)
 * @param {string} props.padding - Padding (tokens Tamagui o valores CSS)
 * @param {string} props.borderRadius - Border radius
 * @param {string} props.backgroundColor - Override de background
 * @param {function} props.onClick - Click handler (hace la card presionable)
 * @param {React.ReactNode} props.children - Contenido
 */
export const Card = ({
  variant = 'default',
  padding = '16px',
  borderRadius = '16px',
  backgroundColor,
  onClick,
  children,
  style,
  ...props
}) => {
  const variantStyle = cardVariants[variant];

  return (
    <div
      onClick={onClick}
      style={{
        padding,
        borderRadius,
        backgroundColor: backgroundColor || variantStyle.backgroundColor,
        border: variantStyle.border,
        boxShadow: variantStyle.boxShadow,
        cursor: onClick ? 'pointer' : 'default',
        transition: onClick ? 'all 0.2s ease' : 'none',
        ...style,
      }}
      onMouseEnter={onClick ? (e) => {
        e.currentTarget.style.opacity = '0.95';
        e.currentTarget.style.transform = 'scale(0.98)';
      } : undefined}
      onMouseLeave={onClick ? (e) => {
        e.currentTarget.style.opacity = '1';
        e.currentTarget.style.transform = 'scale(1)';
      } : undefined}
      {...props}
    >
      {children}
    </div>
  );
};

// ============================================================================
// STACK COMPONENTS
// ============================================================================

/**
 * Stack - Contenedor vertical (YStack)
 */
export const Stack = ({ gap = '16px', padding, children, style, ...props }) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap,
      padding,
      ...style,
    }}
    {...props}
  >
    {children}
  </div>
);

/**
 * HStack - Contenedor horizontal (XStack)
 */
export const HStack = ({ gap = '16px', align = 'center', justify = 'flex-start', padding, children, style, ...props }) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'row',
      gap,
      alignItems: align,
      justifyContent: justify,
      padding,
      ...style,
    }}
    {...props}
  >
    {children}
  </div>
);

// ============================================================================
// LAYOUT COMPONENTS
// ============================================================================

/**
 * ScreenLayout - Layout de pantalla completo
 */
export const ScreenLayout = ({ children, padding = '24px 32px', backgroundColor, style, ...props }) => (
  <div
    style={{
      minHeight: '100vh',
      backgroundColor: backgroundColor || '$background',
      padding,
      ...style,
    }}
    {...props}
  >
    {children}
  </div>
);

/**
 * ScreenSection - Sección de pantalla
 */
export const ScreenSection = ({ padding = '16px 0', children, style, ...props }) => (
  <div
    style={{
      padding,
      ...style,
    }}
    {...props}
  >
    {children}
  </div>
);

export default { Card, Stack, HStack, ScreenLayout, ScreenSection };
