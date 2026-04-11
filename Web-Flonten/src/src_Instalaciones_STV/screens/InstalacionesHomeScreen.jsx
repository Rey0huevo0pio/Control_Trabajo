/**
 * ============================================================================
 * 🏠 INSTALACIONES HOME SCREEN - Gestión de Instalaciones (Web)
 * ============================================================================
 *
 * ADAPTADO DE: C_Ticket_Apk_STV/src_Instalaciones_STV/screens/InstalacionesHomeScreen.tsx
 *
 * QUÉ HACE:
 * - Lista de instalaciones activas
 * - Header con botón regresar y crear nueva
 * - Empty state si no hay instalaciones
 * - InstalacionCard para cada item
 *
 * CONEXIONES:
 * - Mobile: C_Ticket_Apk_STV/src_Instalaciones_STV/screens/InstalacionesHomeScreen.tsx
 * - Navigation: Navega a RegistroInstalacion, DetalleInstalacion
 * - API: src_Instalaciones_STV/lib/instalacion.api.js
 *
 * ============================================================================
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { instalacionApi } from '../lib/instalacion.api';
import { InstalacionCard } from '../components/InstalacionCard';

export const InstalacionesHomeScreen = () => {
  const navigate = useNavigate();
  const [instalaciones, setInstalaciones] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadInstalaciones = async () => {
    try {
      const data = await instalacionApi.getActivas();
      setInstalaciones(data);
    } catch (error) {
      console.error('Error al cargar instalaciones:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInstalaciones();
  }, []);

  const handleCreateInstalacion = () => {
    navigate('/instalaciones/registro');
  };

  const handleVerDetalle = (instalacionId) => {
    navigate(`/instalaciones/${instalacionId}`);
  };

  const handleCrearArea = (instalacionId) => {
    navigate(`/instalaciones/${instalacionId}/registro-area`);
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
          }}>🏗️</div>
          <p style={{ color: '#3C3C43', fontSize: 15, fontWeight: 500 }}>
            Cargando instalaciones...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F2F2F7' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 32px' }}>
        {/* Header con gradiente */}
        <div
          style={{
            backgroundColor: '#007AFF',
            padding: '32px',
            borderRadius: 20,
            marginBottom: 20,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ position: 'absolute', right: -30, top: -40, opacity: 0.1 }}>
            <span style={{ fontSize: 200 }}>🏢</span>
          </div>

          {/* Botones superiores */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, position: 'relative', zIndex: 1 }}>
            <button
              onClick={() => navigate('/')}
              style={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                border: 'none', borderRadius: 20, padding: '8px 16px',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
              }}
            >
              <span>←</span>
              <span style={{ color: 'white', fontSize: 14, fontWeight: 600 }}>Inicio</span>
            </button>

            <button
              onClick={handleCreateInstalacion}
              style={{
                backgroundColor: 'white',
                border: 'none', borderRadius: 20, padding: '8px 20px',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
              }}
            >
              <span style={{ fontSize: 20, color: '#007AFF' }}>➕</span>
              <span style={{ color: '#007AFF', fontSize: 14, fontWeight: 700 }}>Nueva</span>
            </button>
          </div>

          {/* Título y subtítulo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, position: 'relative', zIndex: 1 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 12,
              backgroundColor: 'rgba(255,255,255,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28,
            }}>🏢</div>
            <div>
              <h2 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: 'white', letterSpacing: -0.5 }}>
                Instalaciones
              </h2>
              <p style={{ margin: '4px 0 0', fontSize: 15, color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>
                {instalaciones.length} {instalaciones.length === 1 ? 'instalación' : 'instalaciones'}
              </p>
            </div>
          </div>
        </div>

        {/* Contenido principal */}
        {instalaciones.length === 0 ? (
          <div style={{
            backgroundColor: 'white', borderRadius: 20, padding: 48,
            border: '2px dashed #007AFF', textAlign: 'center',
          }}>
            <div style={{
              width: 120, height: 120, borderRadius: 60, backgroundColor: '#F2F2F7',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px', fontSize: 56,
            }}>🏢</div>
            <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8, color: '#000' }}>
              Sin instalaciones
            </h3>
            <p style={{ fontSize: 15, color: '#3C3C43', lineHeight: 1.6, maxWidth: 400, margin: '0 auto 20px' }}>
              No hay instalaciones registradas aún.
              ¡Comienza registrando tu primera instalación!
            </p>
            <button
              onClick={handleCreateInstalacion}
              style={{
                backgroundColor: '#007AFF', border: 'none', borderRadius: 12,
                padding: '14px 28px', cursor: 'pointer',
                display: 'inline-flex', alignItems: 'center', gap: 8,
              }}
            >
              <span style={{ fontSize: 22 }}>➕</span>
              <span style={{ color: 'white', fontSize: 16, fontWeight: 700 }}>
                Registrar Instalación
              </span>
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {instalaciones.map((item) => (
              <InstalacionCard
                key={item._id}
                instalacion={item}
                showCreateArea
                onPress={() => handleVerDetalle(item._id)}
                onCreateArea={() => handleCrearArea(item._id, item.nombre_instalacion)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
