/**
 * ============================================================================
 * CARPETA DETALLE SCREEN - Detalle de una carpeta dentro de un archivero (Web)
 * ============================================================================
 * Adaptado de: C_Ticket_Apk_STV/src_Archivero_STV/screens/CarpetaDetalleScreen.tsx
 */
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const E = {
  'arrow-back': '←', 'eye': '👁️', 'lock-closed': '🔒', 'folder': '📁',
  'add': '➕', 'cloud-upload': '☁️', 'scan': '📷', 'settings': '⚙️',
  'document': '📄', 'chevron-forward': '▶️', 'ellipsis-vertical': '⋮',
};

export const CarpetaDetalleScreen = () => {
  const navigate = useNavigate();
  const { archiveroId, carpetaId } = useParams();

  const carpeta = {
    id: carpetaId,
    nombre: 'Documentos Legales',
    descripcion: 'Contratos y documentos legales',
    creador: 'Juan Pérez',
    visibilidad: 'privado',
    archivos: 12,
  };

  const subcarpetas = [
    { id: '1', nombre: 'Contratos 2026', archivos: 5, visibilidad: 'privado' },
    { id: '2', nombre: 'Acuerdos', archivos: 3, visibilidad: 'publico' },
  ];

  const archivos = [
    { id: '1', nombre: 'Contrato_Servicios.pdf', tipo: 'documento', tamaño: '1.2 MB', visibilidad: 'publico' },
    { id: '2', nombre: 'NDA_Cliente.pdf', tipo: 'documento', tamaño: '850 KB', visibilidad: 'privado' },
  ];

  const actionButtons = [
    { icon: 'add', label: 'Nueva Carpeta', action: () => console.log('Nueva carpeta') },
    { icon: 'cloud-upload', label: 'Subir', action: () => console.log('Subir archivo') },
    { icon: 'scan', label: 'Escanear', action: () => navigate(`/archivero/${archiveroId}/escanear`) },
    { icon: 'settings', label: 'Opciones', action: () => console.log('Opciones') },
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F2F2F7' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 32px' }}>
        {/* Header */}
        <div style={{
          backgroundColor: '#007AFF', padding: '24px', borderRadius: 20, marginBottom: 20,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <button onClick={() => navigate(-1)} style={{
              width: 44, height: 44, borderRadius: 22, border: 'none',
              backgroundColor: 'rgba(255,255,255,0.2)', cursor: 'pointer', fontSize: 24, color: 'white',
            }}>{E['arrow-back']}</button>
            <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: 'white' }}>{carpeta.nombre}</h2>
          </div>

          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <span style={{
              backgroundColor: carpeta.visibilidad === 'publico' ? '#34C759' : '#FF3B30',
              padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, color: 'white',
              display: 'inline-flex', alignItems: 'center', gap: 4,
            }}>
              {E[carpeta.visibilidad === 'publico' ? 'eye' : 'lock-closed']}
              {carpeta.visibilidad}
            </span>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>
              {carpeta.archivos} archivos
            </span>
          </div>
        </div>

        {/* Acciones */}
        <div style={{
          backgroundColor: '#F9F9F9', padding: 16, borderRadius: 16, marginBottom: 24,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            {actionButtons.map((btn) => (
              <div key={btn.label} onClick={btn.action} style={{ textAlign: 'center', cursor: 'pointer' }}>
                <div style={{
                  width: 50, height: 50, borderRadius: 12, backgroundColor: 'white',
                  border: '1px solid #D1D1D6', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: 22, marginBottom: 6,
                }}>{E[btn.icon]}</div>
                <div style={{ fontSize: 12, color: '#3C3C43', fontWeight: 600 }}>{btn.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Subcarpetas */}
        {subcarpetas.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>Carpetas ({subcarpetas.length})</h3>
              <button style={{
                width: 36, height: 36, borderRadius: 18, border: '1px solid #D1D1D6',
                backgroundColor: 'white', cursor: 'pointer', fontSize: 18,
              }}>{E['add']}</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {subcarpetas.map((subcarpeta) => (
                <div key={subcarpeta.id} onClick={() => navigate(`/archivero/${archiveroId}/carpeta/${subcarpeta.id}`)} style={{
                  backgroundColor: 'white', padding: 20, borderRadius: 16,
                  border: '1px solid #D1D1D6', cursor: 'pointer', display: 'flex', gap: 16, alignItems: 'center',
                }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 12, backgroundColor: '#FF9500',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24,
                  }}>{E['folder']}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{subcarpeta.nombre}</div>
                    <div style={{ fontSize: 13, color: '#8E8E93' }}>{subcarpeta.archivos} archivos</div>
                  </div>
                  <span style={{ fontSize: 20, color: '#007AFF' }}>{E['chevron-forward']}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Archivos */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>Archivos ({archivos.length})</h3>
            <button style={{
              width: 36, height: 36, borderRadius: 18, border: '1px solid #D1D1D6',
              backgroundColor: 'white', cursor: 'pointer', fontSize: 18,
            }}>{E['cloud-upload']}</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {archivos.map((archivo) => (
              <div key={archivo.id} style={{
                backgroundColor: 'white', padding: 16, borderRadius: 16,
                border: '1px solid #D1D1D6', cursor: 'pointer', display: 'flex', gap: 16, alignItems: 'center',
              }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 10, backgroundColor: '#007AFF',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
                }}>{E['document']}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{archivo.nombre}</div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span style={{ fontSize: 12, color: '#8E8E93' }}>{archivo.tamaño}</span>
                    <span style={{
                      backgroundColor: archivo.visibilidad === 'publico' ? '#E8F5E9' : '#FFEBEE',
                      padding: '2px 8px', borderRadius: 20, fontSize: 10, fontWeight: 600,
                      color: archivo.visibilidad === 'publico' ? '#34C759' : '#FF3B30',
                    }}>{archivo.visibilidad === 'publico' ? '🌐 Público' : '🔒 Privado'}</span>
                  </div>
                </div>
                <span style={{ fontSize: 18, color: '#8E8E93' }}>{E['ellipsis-vertical']}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
