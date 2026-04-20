/**
 * ============================================================================
 * 📋 DETALLE INSTALACION SCREEN - Detalle de una instalación (Web)
 * ============================================================================
 *
 * ADAPTADO DE: C_Ticket_Apk_STV/src_Instalaciones_STV/screens/DetalleInstalacionScreen.tsx
 *
 * QUÉ HACE:
 * - Muestra detalle completo de una instalación
 * - Foto de portada, información principal, badge de estado
 * - Ubicación, responsable, descripción, registrador
 * - Lista de áreas con opción de crear nuevas
 *
 * CONEXIONES:
 * - Mobile: C_Ticket_Apk_STV/src_Instalaciones_STV/screens/DetalleInstalacionScreen.tsx
 * - Navigation: Recibe instalacionId por URL params
 * - API: src_Instalaciones_STV/lib/instalacion.api.js
 *
 * ============================================================================
 */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { instalacionApi } from '../lib/instalacion.api';

export const DetalleInstalacionScreen = () => {
  const { instalacionId } = useParams();
  const navigate = useNavigate();
  const [instalacion, setInstalacion] = useState(null);
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDetalle = async () => {
      try {
        const [instalacionData, areasData] = await Promise.all([
          instalacionApi.getById(instalacionId),
          instalacionApi.getAreasByInstalacion(instalacionId),
        ]);
        setInstalacion(instalacionData);
        setAreas(areasData);
      } catch (error) {
        console.error('Error al cargar detalle:', error);
      } finally {
        setLoading(false);
      }
    };
    loadDetalle();
  }, [instalacionId]);

  const handleCrearArea = () => {
    if (instalacion) {
      navigate(`/instalaciones/${instalacionId}/area/nueva`);
    }
  };

  const handleEditarInstalacion = () => {
    if (instalacion) {
      navigate(`/instalaciones/${instalacionId}/editar`);
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', backgroundColor: '#F2F2F7',
        display: 'flex', justifyContent: 'center', alignItems: 'center',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 80, height: 80, borderRadius: 40, backgroundColor: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px', fontSize: 32,
          }}>⏳</div>
          <p style={{ color: '#3C3C43', fontSize: 15, fontWeight: 500 }}>
            Cargando información...
          </p>
        </div>
      </div>
    );
  }

  if (!instalacion) {
    return (
      <div style={{
        minHeight: '100vh', backgroundColor: '#F2F2F7',
        display: 'flex', justifyContent: 'center', alignItems: 'center',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>⚠️</div>
          <h3 style={{ fontSize: 20, fontWeight: 700, color: '#000', marginBottom: 8 }}>
            No se encontró la instalación
          </h3>
          <button
            onClick={() => navigate('/instalaciones')}
            style={{
              backgroundColor: '#007AFF', border: 'none', borderRadius: 12,
              padding: '12px 24px', cursor: 'pointer', color: 'white',
              fontSize: 15, fontWeight: 600,
            }}
          >
            ← Volver a Instalaciones
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F2F2F7' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 32px' }}>
        {/* Botones de navegación */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
          <button
            onClick={() => navigate('/instalaciones')}
            style={{
              backgroundColor: 'white', border: '1px solid #D1D1D6', borderRadius: 12,
              padding: '8px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center',
              gap: 8, fontSize: 14, fontWeight: 600, color: '#3C3C43',
            }}
          >
            ← Instalaciones
          </button>
          <button
            onClick={handleEditarInstalacion}
            style={{
              backgroundColor: '#007AFF', border: 'none', borderRadius: 12,
              padding: '8px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center',
              gap: 8, fontSize: 14, fontWeight: 600, color: 'white',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            Editar Instalación
          </button>
        </div>

        {/* Foto de portada */}
        <div style={{ height: 200, backgroundColor: '#E5E5EA', borderRadius: 20, overflow: 'hidden', marginBottom: 24 }}>
          {instalacion.foto ? (
            <img src={instalacion.foto} alt={instalacion.nombre_instalacion}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{
              width: '100%', height: '100%', display: 'flex',
              justifyContent: 'center', alignItems: 'center', fontSize: 60, color: '#999',
            }}>🏢</div>
          )}
        </div>

        {/* Información principal */}
        <div style={{ backgroundColor: 'white', borderRadius: 20, padding: 32, border: '1px solid #D1D1D6' }}>
          {/* Título */}
          <h2 style={{ margin: '0 0 12px', fontSize: 26, fontWeight: 'bold', color: '#333' }}>
            {instalacion.nombre_instalacion}
          </h2>

          {/* Badge de estado */}
          <div style={{
            display: 'inline-block',
            backgroundColor: instalacion.activa ? '#34C759' : '#8E8E93',
            padding: '6px 16px', borderRadius: 20, marginBottom: 24,
          }}>
            <span style={{ color: 'white', fontSize: 14, fontWeight: 600 }}>
              {instalacion.activa ? '✓ Activa' : '✗ Inactiva'}
            </span>
          </div>

          {/* Secciones de información */}
          {[
            { icon: '📍', title: 'Ubicación', value: instalacion.ubicacion?.direccion || 'No especificada' },
            { icon: '🛡️', title: 'Responsable', value: instalacion.responsable || 'Sin responsable' },
            ...(instalacion.descripcion ? [{ icon: '📄', title: 'Descripción', value: instalacion.descripcion }] : []),
            { icon: '👤', title: 'Registrado por', value: instalacion.nombre_registrador },
          ].map((item) => (
            <div key={item.title} style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <span style={{ fontSize: 20 }}>{item.icon}</span>
                <span style={{ fontSize: 18, fontWeight: 600, color: '#333' }}>{item.title}</span>
              </div>
              <p style={{ fontSize: 16, color: '#666', lineHeight: 1.6, paddingLeft: 30, margin: 0 }}>
                {item.value}
              </p>
            </div>
          ))}

          {/* Áreas registradas */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 20 }}>📂</span>
                <span style={{ fontSize: 18, fontWeight: 600, color: '#333' }}>
                  Áreas ({areas.length})
                </span>
              </div>
              <button
                onClick={handleCrearArea}
                style={{
                  border: 'none', backgroundColor: 'transparent',
                  cursor: 'pointer', fontSize: 24, color: '#007AFF',
                }}
              >➕</button>
            </div>

            {areas.length === 0 ? (
              <div style={{
                backgroundColor: '#F9F9F9', padding: 24, borderRadius: 12,
                border: '1px dashed #D1D1D6', textAlign: 'center',
              }}>
                <div style={{ fontSize: 40, marginBottom: 8 }}>📂</div>
                <p style={{ fontSize: 14, color: '#8E8E93', marginBottom: 12 }}>
                  No hay áreas registradas
                </p>
                <button
                  onClick={handleCrearArea}
                  style={{
                    backgroundColor: '#E8F2FF', border: '1px dashed #007AFF',
                    borderRadius: 8, padding: '10px 20px', cursor: 'pointer',
                    color: '#007AFF', fontSize: 14, fontWeight: 600,
                  }}
                >
                  Crear Área
                </button>
              </div>
            ) : (
              <div style={{
                backgroundColor: 'white', borderRadius: 12, overflow: 'hidden',
                border: '1px solid #E5E5EA',
              }}>
                {areas.map((area, index) => (
                  <div key={area._id} style={{
                    padding: 16, display: 'flex', alignItems: 'flex-start', gap: 12,
                    borderBottom: index < areas.length - 1 ? '1px solid #F0F0F0' : 'none',
                  }}>
                    <span style={{ fontSize: 20, color: '#999', marginTop: 2 }}>▶</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 16, fontWeight: 600, color: '#333', marginBottom: 4 }}>
                        {area.nombre_area}
                      </div>
                      {area.descripcion && (
                        <p style={{ fontSize: 14, color: '#8E8E93', lineHeight: 1.5, margin: 0 }}>
                          {area.descripcion}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Botón principal de crear área */}
          <button
            onClick={handleCrearArea}
            style={{
              width: '100%', backgroundColor: '#007AFF', border: 'none',
              borderRadius: 12, padding: 16, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}
          >
            <span style={{ fontSize: 24, color: 'white' }}>➕</span>
            <span style={{ color: 'white', fontSize: 16, fontWeight: 600 }}>
              Nueva Área en {instalacion.nombre_instalacion}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
