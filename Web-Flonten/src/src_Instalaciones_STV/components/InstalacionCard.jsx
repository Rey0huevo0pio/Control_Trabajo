/**
 * ============================================================================
 * INSTALACION CARD - Tarjeta de instalación (Web)
 * ============================================================================
 * Adaptado de: C_Ticket_Apk_STV/src_Instalaciones_STV/components/InstalacionCard.tsx
 */
import React from 'react';

export function InstalacionCard({ instalacion, onPress, onCreateArea, showCreateArea = false }) {
  return (
    <div
      onClick={onPress}
      style={{
        backgroundColor: 'white',
        borderRadius: 16,
        overflow: 'hidden',
        borderColor: '#D1D1D6',
        borderWidth: 1,
        cursor: onPress ? 'pointer' : 'default',
        transition: 'all 0.2s',
      }}
      onMouseEnter={(e) => {
        if (onPress) {
          e.currentTarget.style.opacity = '0.95';
          e.currentTarget.style.transform = 'scale(0.98)';
        }
      }}
      onMouseLeave={(e) => {
        if (onPress) {
          e.currentTarget.style.opacity = '1';
          e.currentTarget.style.transform = 'scale(1)';
        }
      }}
    >
      {/* Foto de la instalación */}
      <div style={{ position: 'relative', height: 140, backgroundColor: '#F2F2F7' }}>
        {instalacion.foto ? (
          <img
            src={instalacion.foto}
            alt={instalacion.nombre_instalacion}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div style={{
            width: '100%', height: '100%', display: 'flex',
            justifyContent: 'center', alignItems: 'center', backgroundColor: '#F2F2F7',
          }}>
            <div style={{
              width: 64, height: 64, borderRadius: 32, backgroundColor: '#E5E5EA',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32,
            }}>🏢</div>
          </div>
        )}
        {/* Badge de activo/inactivo */}
        <div style={{
          position: 'absolute', top: 12, right: 12,
          backgroundColor: instalacion.activa ? '#34C759' : '#8E8E93',
          padding: '4px 12px', borderRadius: 20,
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <span style={{ fontSize: 14 }}>{instalacion.activa ? '✓' : '✗'}</span>
          <span style={{ color: 'white', fontSize: 12, fontWeight: 700 }}>
            {instalacion.activa ? 'Activa' : 'Inactiva'}
          </span>
        </div>
      </div>

      {/* Contenido de la tarjeta */}
      <div style={{ padding: 20 }}>
        <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 12, color: '#000' }}>
          {instalacion.nombre_instalacion}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 12 }}>
          {/* Ubicación */}
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8, backgroundColor: '#F2F2F7',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
            }}>📍</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, color: '#3C3C43', fontWeight: 600 }}>Ubicación</div>
              <div style={{ fontSize: 14, color: '#000' }}>
                {instalacion.ubicacion?.direccion || 'Sin ubicación'}
              </div>
            </div>
          </div>

          {/* Responsable */}
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8, backgroundColor: '#F2F2F7',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
            }}>👤</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, color: '#3C3C43', fontWeight: 600 }}>Responsable</div>
              <div style={{ fontSize: 14, color: '#000' }}>
                {instalacion.responsable || 'Sin responsable'}
              </div>
            </div>
          </div>
        </div>

        {instalacion.descripcion && (
          <div style={{
            backgroundColor: '#F2F2F7', padding: 12, borderRadius: 10, marginBottom: 12,
          }}>
            <div style={{ fontSize: 14, color: '#3C3C43', lineHeight: 1.5 }}>
              {instalacion.descripcion}
            </div>
          </div>
        )}

        <div style={{
          display: 'flex', gap: 6, alignItems: 'center',
          paddingTop: 12, borderTop: '1px solid #E5E5EA',
        }}>
          <span style={{ fontSize: 16 }}>👤</span>
          <span style={{ fontSize: 12, color: '#8E8E93', fontWeight: 500 }}>
            {instalacion.nombre_registrador}
          </span>
        </div>
      </div>

      {/* Botón de crear área */}
      {showCreateArea && (
        <div style={{ padding: 20, paddingTop: 0 }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCreateArea && onCreateArea();
            }}
            style={{
              width: '100%', padding: '12px 20px', borderRadius: 10,
              border: '1px solid #007AFF', backgroundColor: '#E8F2FF',
              cursor: 'pointer', display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: 8,
            }}
          >
            <span style={{ fontSize: 20, color: '#007AFF' }}>➕</span>
            <span style={{ color: '#007AFF', fontSize: 14, fontWeight: 700 }}>
              Crear Área
            </span>
          </button>
        </div>
      )}
    </div>
  );
}

export default InstalacionCard;
