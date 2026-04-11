/**
 * ============================================================================
 * CREAR ARCHIVERO SCREEN - Formulario para crear archivero (Web)
 * ============================================================================
 * Adaptado de: C_Ticket_Apk_STV/src_Archivero_STV/screens/CrearArchiveroScreen.tsx
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const E = {
  'arrow-back': '←', 'lock-closed': '🔒', 'earth': '🌍',
  'folder-open': '📂', 'information-circle': 'ℹ️',
};

export const CrearArchiveroScreen = () => {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [visibilidad, setVisibilidad] = useState('privado');

  const handleCrear = () => {
    if (!nombre.trim()) return;
    console.log('Creando archivero:', { nombre, descripcion, visibilidad });
    navigate('/archivero');
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
              <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: 'white' }}>Crear Archivero</h2>
              <p style={{ margin: '4px 0 0 0', fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>Nuevo espacio de trabajo</p>
            </div>
          </div>
        </div>

        {/* Formulario */}
        <div style={{
          backgroundColor: 'white', padding: 24, borderRadius: 16, marginBottom: 20,
          border: '1px solid #D1D1D6',
        }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: 17, fontWeight: 700 }}>Información Básica</h3>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 8, color: '#000' }}>
              Nombre del Archivero *
            </label>
            <input
              type="text"
              placeholder="Ej: Documentos Proyecto Alpha"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              style={{
                width: '100%', padding: '12px 16px', borderRadius: 12,
                border: '1px solid #D1D1D6', fontSize: 15, outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 8, color: '#000' }}>
              Descripción
            </label>
            <textarea
              placeholder="Describe el propósito de este archivero"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              rows={3}
              style={{
                width: '100%', padding: '12px 16px', borderRadius: 12,
                border: '1px solid #D1D1D6', fontSize: 15, outline: 'none',
                resize: 'vertical', minHeight: 80, boxSizing: 'border-box',
                fontFamily: 'inherit',
              }}
            />
          </div>
        </div>

        {/* Visibilidad */}
        <div style={{
          backgroundColor: 'white', padding: 24, borderRadius: 16, marginBottom: 20,
          border: '1px solid #D1D1D6',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <span style={{ fontSize: 20 }}>{E['lock-closed']}</span>
            <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>Visibilidad</h3>
          </div>

          <div style={{ display: 'flex', gap: 16 }}>
            {/* Público */}
            <div
              onClick={() => setVisibilidad('publico')}
              style={{
                flex: 1, padding: 20, borderRadius: 16, cursor: 'pointer',
                backgroundColor: visibilidad === 'publico' ? '#E8F5E9' : 'white',
                border: visibilidad === 'publico' ? '2px solid #34C759' : '1px solid #D1D1D6',
                textAlign: 'center',
              }}
            >
              <span style={{ fontSize: 32 }}>{E['earth']}</span>
              <div style={{ fontSize: 15, fontWeight: 700, marginTop: 8 }}>Público</div>
              <div style={{ fontSize: 12, color: '#8E8E93', marginTop: 4 }}>
                Cualquier usuario puede ver y descargar archivos
              </div>
            </div>

            {/* Privado */}
            <div
              onClick={() => setVisibilidad('privado')}
              style={{
                flex: 1, padding: 20, borderRadius: 16, cursor: 'pointer',
                backgroundColor: visibilidad === 'privado' ? '#FFEBEE' : 'white',
                border: visibilidad === 'privado' ? '2px solid #FF3B30' : '1px solid #D1D1D6',
                textAlign: 'center',
              }}
            >
              <span style={{ fontSize: 32 }}>{E['lock-closed']}</span>
              <div style={{ fontSize: 15, fontWeight: 700, marginTop: 8 }}>Privado</div>
              <div style={{ fontSize: 12, color: '#8E8E93', marginTop: 4 }}>
                Solo miembros agregados pueden acceder
              </div>
            </div>
          </div>
        </div>

        {/* Info adicional */}
        <div style={{
          backgroundColor: '#F9F9F9', padding: 20, borderRadius: 16, marginBottom: 24,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <span style={{ fontSize: 20, color: '#007AFF' }}>{E['information-circle']}</span>
            <span style={{ fontSize: 15, fontWeight: 600 }}>¿Qué significa cada opción?</span>
          </div>
          <div style={{ fontSize: 13, color: '#3C3C43', lineHeight: 1.6 }}>
            <div style={{ marginBottom: 4 }}><strong>Público:</strong> Todos los empleados pueden ver el archivero y sus contenidos</div>
            <div style={{ marginBottom: 4 }}><strong>Privado:</strong> Solo tú y los miembros que agregues tendrán acceso</div>
            <div>Puedes cambiar la visibilidad en cualquier momento</div>
          </div>
        </div>

        {/* Botones */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <button
            onClick={handleCrear}
            disabled={!nombre.trim()}
            style={{
              width: '100%', padding: '16px 24px', borderRadius: 14, border: 'none',
              backgroundColor: nombre.trim() ? '#007AFF' : '#C7C7CC',
              color: 'white', fontSize: 17, fontWeight: 700, cursor: nombre.trim() ? 'pointer' : 'not-allowed',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}
          >
            {E['folder-open']} Crear Archivero
          </button>
          <button
            onClick={() => navigate(-1)}
            style={{
              width: '100%', padding: '16px 24px', borderRadius: 14,
              border: '1px solid #D1D1D6', backgroundColor: 'white',
              color: '#000', fontSize: 17, fontWeight: 600, cursor: 'pointer',
            }}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};
