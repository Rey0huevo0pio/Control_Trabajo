/**
 * ============================================================================
 * 📝 INPUT COMPONENT - Inputs de Formulario (Web)
 * ============================================================================
 * 
 * QUÉ HACE:
 * - Input de texto estilizado consistente
 * - Mismo diseño que el móvil (border, radius, height)
 * - Soporte para label, error, helper text
 * 
 * CONEXIONES:
 * - Mobile: Mismo patrón que inputs del móvil
 * - Tamagui: Usa tokens de tamagui.config.js
 * 
 * ============================================================================
 */
import React from 'react';

/**
 * Componente Input del Design System
 * @param {Object} props
 * @param {string} props.label - Label del input
 * @param {string} props.error - Mensaje de error
 * @param {string} props.helperText - Texto de ayuda
 * @param {string} props.placeholder - Placeholder
 * @param {string} props.value - Valor actual
 * @param {function} props.onChange - Change handler
 * @param {boolean} props.disabled - Deshabilitado
 * @param {string} props.type - Tipo (text, password, email, etc.)
 */
export const Input = ({
  label,
  error,
  helperText,
  placeholder,
  value,
  onChange,
  disabled = false,
  type = 'text',
  style,
  ...props
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {label && (
        <span style={{ fontSize: '15px', fontWeight: '600', color: '#3C3C43' }}>
          {label}
        </span>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        style={{
          height: 50,
          padding: '0 16px',
          fontSize: '15px',
          border: error ? '2px solid #FF3B30' : '1px solid #D1D1D6',
          borderRadius: 12,
          backgroundColor: disabled ? '#F9F9F9' : 'white',
          color: disabled ? '#C7C7CC' : '#000000',
          outline: 'none',
          transition: 'border-color 0.2s',
          ...style,
        }}
        onFocus={(e) => {
          if (!error) e.target.style.borderColor = '#007AFF';
        }}
        onBlur={(e) => {
          if (!error) e.target.style.borderColor = '#D1D1D6';
        }}
        {...props}
      />
      {error && (
        <span style={{ fontSize: '13px', color: '#FF3B30' }}>{error}</span>
      )}
      {helperText && !error && (
        <span style={{ fontSize: '13px', color: '#8E8E93' }}>{helperText}</span>
      )}
    </div>
  );
};

export default Input;
