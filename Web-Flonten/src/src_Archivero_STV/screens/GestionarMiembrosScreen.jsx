/**
 * ============================================================================
 * GESTIONAR MIEMBROS SCREEN - Gestión de miembros del archivero (Web)
 * ============================================================================
 * Adaptado de: C_Ticket_Apk_STV/src_Archivero_STV/screens/GestionarMiembrosScreen.tsx
 */
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const E = {
  'arrow-back': '←', 'eye': '👁️', 'earth': '🌍', 'lock-closed': '🔒',
  'ellipsis-horizontal': '⋯', 'person-add': '👤➕',
};

export const GestionarMiembrosScreen = () => {
  const navigate = useNavigate();
  const { archiveroId } = useParams();
  const [visibilidadArchivero, setVisibilidadArchivero] = useState('publico');

  const miembros = [
    { id: '1', nombre: 'Juan Pérez', rol: 'dueño', avatar: 'JP', fecha: 'Hace 2 semanas' },
    { id: '2', nombre: 'María García', rol: 'editor', avatar: 'MG', fecha: 'Hace 1 semana' },
    { id: '3', nombre: 'Carlos López', rol: 'visor', avatar: 'CL', fecha: 'Hace 3 días' },
    { id: '4', nombre: 'Ana Martínez', rol: 'editor', avatar: 'AM', fecha: 'Hace 2 días' },
  ];

  const usuariosDisponibles = [
    { id: '5', nombre: 'Pedro Sánchez', rol: 'Analista', avatar: 'PS' },
    { id: '6', nombre: 'Laura Díaz', rol: 'Diseñadora', avatar: 'LD' },
  ];

  const getRolColor = (rol) => {
    switch (rol) {
      case 'dueño': return '#007AFF';
      case 'editor': return '#34C759';
      case 'visor': return '#FF9500';
      default: return '#8E8E93';
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F2F2F7' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 32px' }}>
        {/* Header */}
        <div style={{
          backgroundColor: '#007AFF', padding: '24px', borderRadius: 20, marginBottom: 24,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <button onClick={() => navigate(-1)} style={{
              width: 44, height: 44, borderRadius: 22, border: 'none',
              backgroundColor: 'rgba(255,255,255,0.2)', cursor: 'pointer', fontSize: 24, color: 'white',
            }}>{E['arrow-back']}</button>
            <div>
              <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: 'white' }}>Gestionar Miembros</h2>
              <p style={{ margin: '4px 0 0 0', fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>{miembros.length} miembros</p>
            </div>
          </div>
        </div>

        {/* Visibilidad del Archivero */}
        <div style={{
          backgroundColor: 'white', padding: 24, borderRadius: 16, marginBottom: 24,
          border: '1px solid #D1D1D6',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <span style={{ fontSize: 20 }}>{E['eye']}</span>
            <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>Visibilidad del Archivero</h3>
          </div>

          <div style={{ display: 'flex', gap: 16 }}>
            <div
              onClick={() => setVisibilidadArchivero('publico')}
              style={{
                flex: 1, padding: 16, borderRadius: 16, cursor: 'pointer', textAlign: 'center',
                backgroundColor: visibilidadArchivero === 'publico' ? '#E8F5E9' : 'white',
                border: visibilidadArchivero === 'publico' ? '2px solid #34C759' : '1px solid #D1D1D6',
              }}
            >
              <span style={{ fontSize: 28 }}>{E['earth']}</span>
              <div style={{ fontSize: 14, fontWeight: 700, marginTop: 8 }}>Público</div>
              <div style={{ fontSize: 12, color: '#8E8E93', marginTop: 4 }}>Todos pueden ver</div>
            </div>

            <div
              onClick={() => setVisibilidadArchivero('privado')}
              style={{
                flex: 1, padding: 16, borderRadius: 16, cursor: 'pointer', textAlign: 'center',
                backgroundColor: visibilidadArchivero === 'privado' ? '#FFEBEE' : 'white',
                border: visibilidadArchivero === 'privado' ? '2px solid #FF3B30' : '1px solid #D1D1D6',
              }}
            >
              <span style={{ fontSize: 28 }}>{E['lock-closed']}</span>
              <div style={{ fontSize: 14, fontWeight: 700, marginTop: 8 }}>Privado</div>
              <div style={{ fontSize: 12, color: '#8E8E93', marginTop: 4 }}>Solo miembros</div>
            </div>
          </div>
        </div>

        {/* Lista de miembros actuales */}
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Miembros Actuales</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {miembros.map((miembro) => (
              <div key={miembro.id} style={{
                backgroundColor: 'white', padding: 20, borderRadius: 16,
                border: '1px solid #D1D1D6', display: 'flex', gap: 16, alignItems: 'center',
              }}>
                <div style={{
                  width: 50, height: 50, borderRadius: 25, backgroundColor: getRolColor(miembro.rol),
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontWeight: 700, fontSize: 16, flexShrink: 0,
                }}>{miembro.avatar}</div>

                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>{miembro.nombre}</div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span style={{
                      backgroundColor: getRolColor(miembro.rol), padding: '2px 10px',
                      borderRadius: 20, fontSize: 11, fontWeight: 600, color: 'white',
                      textTransform: 'uppercase',
                    }}>{miembro.rol}</span>
                    <span style={{ fontSize: 12, color: '#8E8E93' }}>{miembro.fecha}</span>
                  </div>
                </div>

                {miembro.rol !== 'dueño' && (
                  <button style={{
                    width: 36, height: 36, borderRadius: 18, border: 'none',
                    backgroundColor: 'transparent', cursor: 'pointer', fontSize: 20,
                  }}>{E['ellipsis-horizontal']}</button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Agregar miembros */}
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Agregar Miembros</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {usuariosDisponibles.map((usuario) => (
              <div key={usuario.id} style={{
                backgroundColor: 'white', padding: 20, borderRadius: 16,
                border: '1px solid #D1D1D6', display: 'flex', gap: 16, alignItems: 'center',
              }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 22, backgroundColor: '#5856D6',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontWeight: 700, fontSize: 14, flexShrink: 0,
                }}>{usuario.avatar}</div>

                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 600 }}>{usuario.nombre}</div>
                  <div style={{ fontSize: 13, color: '#3C3C43' }}>{usuario.rol}</div>
                </div>

                <button style={{
                  padding: '8px 16px', borderRadius: 10, border: 'none',
                  backgroundColor: '#007AFF', color: 'white', fontSize: 13,
                  fontWeight: 600, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 4,
                }}>
                  {E['person-add']} Agregar
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
