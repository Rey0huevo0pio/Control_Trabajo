/**
 * ============================================================================
 * 🔘 BUTTON COMPONENT - Botones del Design System (Web)
 * ============================================================================
 * 
 * QUÉ HACE:
 * - Botones con 7 variantes (primary, secondary, success, warning, error, outline, ghost)
 * - 5 tamaños (xs, sm, md, lg, xl)
 * - Soporte para loading state
 * - Mismo diseño que el móvil
 * 
 * CONEXIONES:
 * - Mobile: C_Ticket_Apk_STV/src/components/design-system/Button.tsx
 * - Tamagui: Usa tokens de tamagui.config.js
 * 
 * ============================================================================
 */
import React from 'react';

// Configuración de variantes
const buttonVariants = {
  primary: { bg: '$primary', color: 'white', border: 'none' },
  secondary: { bg: '$secondary', color: 'white', border: 'none' },
  success: { bg: '$success', color: 'white', border: 'none' },
  warning: { bg: '$warning', color: 'white', border: 'none' },
  error: { bg: '$error', color: 'white', border: 'none' },
  outline: { bg: 'transparent', color: '$primary', border: '2px solid $primary' },
  ghost: { bg: 'transparent', color: '$primary', border: 'none' },
};

const buttonSizes = {
  xs: { height: 44, padding: '8px 16px', fontSize: '13px' },
  sm: { height: 48, padding: '10px 20px', fontSize: '14px' },
  md: { height: 52, padding: '12px 24px', fontSize: '15px' },
  lg: { height: 56, padding: '14px 28px', fontSize: '16px' },
  xl: { height: 64, padding: '16px 32px', fontSize: '17px' },
};

/**
 * Componente Button del Design System
 * @param {Object} props
 * @param {string} props.variant - Variante de color (primary, secondary, success, warning, error, outline, ghost)
 * @param {string} props.size - Tamaño (xs, sm, md, lg, xl)
 * @param {boolean} props.loading - Estado de carga
 * @param {boolean} props.disabled - Deshabilitado
 * @param {function} props.onClick - Click handler
 * @param {React.ReactNode} props.children - Contenido
 */
export const Button = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  onClick,
  children,
  style,
  ...props
}) => {
  const variantStyle = buttonVariants[variant];
  const sizeStyle = buttonSizes[size];
  const isDisabled = disabled || loading;

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      style={{
        height: sizeStyle.height,
        padding: sizeStyle.padding,
        fontSize: sizeStyle.fontSize,
        backgroundColor: variantStyle.bg,
        color: variantStyle.color,
        border: variantStyle.border,
        borderRadius: '16px',
        fontWeight: '600',
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        opacity: isDisabled ? 0.6 : 1,
        transition: 'all 0.2s ease',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        ...style,
      }}
      {...props}
    >
      {loading ? (
        <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>⏳</span>
      ) : null}
      {children}
    </button>
  );
};

/**
 * IconButton - Botón circular para iconos
 */
export const IconButton = ({ icon, size = 44, onClick, style, ...props }) => {
  return (
    <button
      onClick={onClick}
      style={{
        width: size,
        height: size,
        minWidth: size,
        minHeight: size,
        borderRadius: '50%',
        border: 'none',
        backgroundColor: 'transparent',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'background-color 0.2s',
        ...style,
      }}
      onMouseEnter={(e) => (e.target.style.backgroundColor = 'rgba(0,0,0,0.05)')}
      onMouseLeave={(e) => (e.target.style.backgroundColor = 'transparent')}
      {...props}
    >
      {icon}
    </button>
  );
};

export default Button;
