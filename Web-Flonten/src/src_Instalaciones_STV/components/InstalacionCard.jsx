/**
 * ============================================================================
 * INSTALACION CARD - Tarjeta de instalación (Web)
 * ============================================================================
 * Adaptado de: C_Ticket_Apk_STV/src_Instalaciones_STV/components/InstalacionCard.tsx
 */
import React, { useState } from 'react';

const IconoEdificio = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#8E8E93" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
    <path d="M9 22v-4h6v4" />
    <line x1="8" y1="6" x2="8" y2="6" />
    <line x1="16" y1="6" x2="16" y2="6" />
    <line x1="8" y1="10" x2="8" y2="10" />
    <line x1="16" y1="10" x2="16" y2="10" />
    <line x1="8" y1="14" x2="8" y2="14" />
    <line x1="16" y1="14" x2="16" y2="14" />
  </svg>
);

const IconoUbicacion = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#007AFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const IconoUsuario = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#007AFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const IconoUsuarioPeque = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8E8E93" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const IconoMas = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#007AFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const IconoActivo = () => (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="white">
    <circle cx="5" cy="5" r="5" />
  </svg>
);

export function InstalacionCard({ instalacion, onPress, onCreateArea, showCreateArea = false }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  const cardStyle = {
    background: 'linear-gradient(145deg, #FFFFFF 0%, #F8F9FA 100%)',
    borderRadius: 24,
    overflow: 'hidden',
    border: '1px solid #E8EAED',
    cursor: onPress ? 'pointer' : 'default',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    transform: isHovered && onPress ? 'translateY(-6px)' : 'translateY(0)',
    boxShadow: isHovered && onPress 
      ? '0 20px 40px rgba(0, 0, 0, 0.15), 0 8px 16px rgba(0, 0, 0, 0.1)' 
      : '0 4px 12px rgba(0, 0, 0, 0.06)',
  };

  return (
    <div
      onClick={onPress}
      style={cardStyle}
      onMouseEnter={() => {
        if (onPress) setIsHovered(true);
      }}
      onMouseLeave={() => {
        if (onPress) setIsHovered(false);
      }}
    >
      {/* Foto de la instalación */}
      <div style={{ position: 'relative', height: 160, overflow: 'hidden' }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          background: instalacion.foto 
            ? 'none' 
            : 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
          zIndex: 0,
        }} />
        {instalacion.foto ? (
          <>
            <img
              src={instalacion.foto}
              alt={instalacion.nombre_instalacion}
              style={{
                width: '100%', height: '100%', objectFit: 'cover',
                transition: 'transform 0.5s ease',
                transform: isHovered && onPress ? 'scale(1.08)' : 'scale(1)',
              }}
            />
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: 80,
              background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 100%)',
            }} />
          </>
        ) : (
          <div style={{
            width: '100%', height: '100%', display: 'flex',
            justifyContent: 'center', alignItems: 'center',
          }}>
            <div style={{
              width: 80, height: 80, borderRadius: 24, 
              background: 'rgba(255,255,255,0.2)',
              backdropFilter: 'blur(10px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '2px solid rgba(255,255,255,0.3)',
            }}>
              <IconoEdificio />
            </div>
          </div>
        )}
        
        {/* Badge de activo/inactivo */}
        <div style={{
          position: 'absolute', top: 16, right: 16,
          background: instalacion.activa 
            ? 'linear-gradient(135deg, #34C759 0%, #30B350 100%)' 
            : 'linear-gradient(135deg, #8E8E93 0%, #636366 100%)',
          backdropFilter: 'blur(12px)',
          padding: '8px 16px', borderRadius: 20,
          display: 'flex', alignItems: 'center', gap: 8,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
          border: '1px solid rgba(255,255,255,0.2)',
        }}>
          <div style={{
            width: 8, height: 8, borderRadius: '50%',
            background: 'white',
            boxShadow: '0 0 8px rgba(255,255,255,0.8)',
          }} />
          <span style={{ color: 'white', fontSize: 12, fontWeight: 700, letterSpacing: 0.5 }}>
            {instalacion.activa ? 'Activa' : 'Inactiva'}
          </span>
        </div>
      </div>

      {/* Contenido de la tarjeta */}
      <div style={{ padding: 24 }}>
        <div style={{
          fontSize: 20, fontWeight: 800, marginBottom: 20, color: '#1C1C1E',
          lineHeight: 1.3,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          letterSpacing: '-0.3',
        }}>
          {instalacion.nombre_instalacion}
        </div>

        {/* Información de ubicación y responsable */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginBottom: 20 }}>
          {/* Ubicación */}
          <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12, 
              background: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              boxShadow: '0 2px 8px rgba(33, 150, 243, 0.2)',
            }}>
              <IconoUbicacion />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 11, color: '#78909C', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>
                Ubicación
              </div>
              <div style={{ fontSize: 14, color: '#37474F', lineHeight: 1.4, wordBreak: 'break-word', fontWeight: 500 }}>
                {instalacion.ubicacion?.direccion || 'Sin ubicación'}
              </div>
            </div>
          </div>

          {/* Responsable */}
          <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12, 
              background: 'linear-gradient(135deg, #FFF3E0 0%, #FFCC80 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              boxShadow: '0 2px 8px rgba(255, 152, 0, 0.2)',
            }}>
              <IconoUsuario />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 11, color: '#78909C', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>
                Responsable
              </div>
              <div style={{ fontSize: 14, color: '#37474F', fontWeight: 600 }}>
                {instalacion.responsable || 'Sin responsable'}
              </div>
            </div>
          </div>
        </div>

        {/* Descripción */}
        {instalacion.descripcion && (
          <div style={{
            background: 'linear-gradient(135deg, #F5F5F5 0%, #EEEEEE 100%)',
            padding: 16, borderRadius: 14, marginBottom: 20,
            border: '1px solid #E0E0E0',
          }}>
            <div style={{ fontSize: 13, color: '#616161', lineHeight: 1.6, fontWeight: 500 }}>
              {instalacion.descripcion}
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{
          display: 'flex', gap: 10, alignItems: 'center',
          paddingTop: 18, borderTop: '1px solid #EEEEEE',
        }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            background: 'linear-gradient(135deg, #E8E8E8 0%, #D0D0D0 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <IconoUsuarioPeque />
          </div>
          <span style={{ fontSize: 13, color: '#9E9E9E', fontWeight: 600 }}>
            {instalacion.nombre_registrador}
          </span>
        </div>
      </div>

      {/* Botón de crear área */}
      {showCreateArea && (
        <div style={{ padding: '0 24 24' }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCreateArea && onCreateArea();
            }}
            onMouseEnter={() => setIsButtonHovered(true)}
            onMouseLeave={() => setIsButtonHovered(false)}
            style={{
              width: '100%', padding: '16px 24px', borderRadius: 16,
              border: 'none', 
              background: isButtonHovered 
                ? 'linear-gradient(135deg, #0066D4 0%, #0052A3 100%)' 
                : 'linear-gradient(135deg, #007AFF 0%, #0056B3 100%)',
              cursor: 'pointer', display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: 12,
              transition: 'all 0.3s ease',
              boxShadow: isButtonHovered 
                ? '0 8px 20px rgba(0, 122, 255, 0.45)' 
                : '0 4px 12px rgba(0, 122, 255, 0.25)',
            }}
          >
            <IconoMas />
            <span style={{ color: 'white', fontSize: 15, fontWeight: 700, letterSpacing: 0.3 }}>
              Crear Área
            </span>
          </button>
        </div>
      )}
    </div>
  );
}

export default InstalacionCard;
