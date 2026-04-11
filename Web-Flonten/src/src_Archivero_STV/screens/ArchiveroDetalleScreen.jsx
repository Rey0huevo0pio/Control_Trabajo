/**
 * ============================================================================
 * ARCHIVERO DETALLE SCREEN - Detalle de un Archivero (Web)
 * ============================================================================
 * Adaptado de: C_Ticket_Apk_STV/src_Archivero_STV/screens/ArchiveroDetalleScreen.tsx
 */
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const E = {
  'arrow-back': '←', 'settings': '⚙️', 'eye': '👁️', 'eye-off': '🙈',
  'folder-open': '📂', 'cloud-upload': '☁️', 'scan': '📷', 'people': '👥',
  'folder': '📁', 'document': '📄', 'image': '🖼️', 'videocam': '🎥',
  'add': '➕', 'chevron-forward': '▶️', 'lock-closed': '🔒',
  'ellipsis-vertical': '⋮',
};

export const ArchiveroDetalleScreen = () => {
  const navigate = useNavigate();
  const { archiveroId } = useParams();

  const [activeTab, setActiveTab] = useState('carpetas');

  const archivero = {
    id: archiveroId,
    nombre: 'Documentos Proyecto Alpha',
    descripcion: 'Archivos del proyecto principal',
    creador: 'Juan Pérez',
    visibilidad: 'publico',
    miembros: 8,
  };

  const acciones = [
    { icon: 'folder-open', label: 'Crear Carpeta', color: '#007AFF', action: () => console.log('Crear carpeta') },
    { icon: 'cloud-upload', label: 'Subir Archivo', color: '#34C759', action: () => console.log('Subir archivo') },
    { icon: 'scan', label: 'Escanear', color: '#FF9500', action: () => navigate(`/archivero/${archiveroId}/escanear`) },
    { icon: 'people', label: 'Miembros', color: '#5856D6', action: () => navigate(`/archivero/${archiveroId}/miembros`) },
  ];

  const carpetas = [
    { id: '1', nombre: 'Documentos Legales', archivos: 12, visibilidad: 'privado', fecha: 'Hace 2 días' },
    { id: '2', nombre: 'Planos y Diseños', archivos: 8, visibilidad: 'publico', fecha: 'Hace 1 semana' },
    { id: '3', nombre: 'Informes Mensuales', archivos: 24, visibilidad: 'publico', fecha: 'Hace 3 días' },
  ];

  const archivos = [
    { id: '1', nombre: 'Contrato_2026.pdf', tipo: 'documento', tamaño: '2.4 MB', visibilidad: 'privado' },
    { id: '2', nombre: 'Foto_instalacion.jpg', tipo: 'imagen', tamaño: '1.8 MB', visibilidad: 'publico' },
    { id: '3', nombre: 'Video_reunion.mp4', tipo: 'video', tamaño: '156 MB', visibilidad: 'privado' },
  ];

  const tabs = [
    { icon: 'folder', label: 'Carpetas', key: 'carpetas' },
    { icon: 'document', label: 'Archivos', key: 'archivos' },
    { icon: 'image', label: 'Imágenes', key: 'imagenes' },
    { icon: 'videocam', label: 'Videos', key: 'videos' },
  ];

  const getTipoColor = (tipo) => {
    if (tipo === 'imagen') return '#34C759';
    if (tipo === 'video') return '#FF9500';
    return '#007AFF';
  };

  const getTipoIcon = (tipo) => {
    if (tipo === 'imagen') return E['image'];
    if (tipo === 'video') return E['videocam'];
    return E['document'];
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F2F2F7' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 32px' }}>
        {/* Header */}
        <div style={{
          backgroundColor: '#5856D6',
          padding: '24px',
          borderRadius: 20,
          marginBottom: 20,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button onClick={() => navigate(-1)} style={{
                width: 44, height: 44, borderRadius: 22, border: 'none',
                backgroundColor: 'rgba(255,255,255,0.2)', cursor: 'pointer', fontSize: 24, color: 'white',
              }}>{E['arrow-back']}</button>
              <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: 'white' }}>{archivero.nombre}</h2>
            </div>
            <button style={{
              width: 44, height: 44, borderRadius: 22, border: 'none',
              backgroundColor: 'rgba(255,255,255,0.2)', cursor: 'pointer', fontSize: 20, color: 'white',
            }}>{E['settings']}</button>
          </div>

          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <span style={{
              backgroundColor: archivero.visibilidad === 'publico' ? '#34C759' : '#FF3B30',
              padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, color: 'white',
              display: 'inline-flex', alignItems: 'center', gap: 4,
            }}>
              {E[archivero.visibilidad === 'publico' ? 'eye' : 'eye-off']}
              {archivero.visibilidad.toUpperCase()}
            </span>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>
              Creado por {archivero.creador} • {archivero.miembros} miembros
            </span>
          </div>
        </div>

        {/* Acciones */}
        <div style={{
          backgroundColor: '#F9F9F9', padding: 20, borderRadius: 16, marginBottom: 20,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            {acciones.map((accion) => (
              <div key={accion.label} style={{ textAlign: 'center', cursor: 'pointer' }} onClick={accion.action}>
                <div style={{
                  width: 56, height: 56, borderRadius: 14, backgroundColor: accion.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 24, marginBottom: 8,
                }}>{E[accion.icon]}</div>
                <div style={{ fontSize: 13, color: '#3C3C43', fontWeight: 600 }}>{accion.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div style={{
          backgroundColor: 'white', padding: 12, borderRadius: 16, marginBottom: 20,
          border: '1px solid #D1D1D6', display: 'flex', gap: 8,
        }}>
          {tabs.map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
              flex: 1, padding: '8px 0', borderRadius: 20, border: 'none',
              backgroundColor: activeTab === tab.key ? '#007AFF' : '#F2F2F7',
              color: activeTab === tab.key ? 'white' : '#8E8E93',
              cursor: 'pointer', fontSize: 12, fontWeight: activeTab === tab.key ? '700' : '500',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            }}>
              <span style={{ fontSize: 18 }}>{E[tab.icon]}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Carpetas */}
        {activeTab === 'carpetas' && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>Carpetas ({carpetas.length})</h3>
              <button style={{
                width: 36, height: 36, borderRadius: 18, border: '1px solid #D1D1D6',
                backgroundColor: 'white', cursor: 'pointer', fontSize: 18,
              }}>{E['add']}</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {carpetas.map((carpeta) => (
                <div key={carpeta.id} onClick={() => navigate(`/archivero/${archiveroId}/carpeta/${carpeta.id}`)} style={{
                  backgroundColor: 'white', padding: 20, borderRadius: 16,
                  border: '1px solid #D1D1D6', cursor: 'pointer', display: 'flex', gap: 16, alignItems: 'center',
                }}>
                  <div style={{
                    width: 50, height: 50, borderRadius: 12, backgroundColor: '#007AFF',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, position: 'relative',
                  }}>
                    {E['folder']}
                    <span style={{
                      position: 'absolute', top: -4, right: -4, fontSize: 14,
                      color: carpeta.visibilidad === 'publico' ? '#34C759' : '#FF3B30',
                    }}>{E[carpeta.visibilidad === 'publico' ? 'eye' : 'lock-closed']}</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{carpeta.nombre}</div>
                    <div style={{ display: 'flex', gap: 12, fontSize: 13, color: '#8E8E93' }}>
                      <span>{carpeta.archivos} archivos</span>
                      <span>{carpeta.fecha}</span>
                    </div>
                  </div>
                  <span style={{ fontSize: 20, color: '#007AFF' }}>{E['chevron-forward']}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Archivos */}
        {activeTab === 'archivos' && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>Archivos Recientes</h3>
              <button style={{
                width: 36, height: 36, borderRadius: 18, border: '1px solid #D1D1D6',
                backgroundColor: 'white', cursor: 'pointer', fontSize: 18,
              }}>{E['add']}</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {archivos.map((archivo) => (
                <div key={archivo.id} style={{
                  backgroundColor: 'white', padding: 16, borderRadius: 16,
                  border: '1px solid #D1D1D6', cursor: 'pointer', display: 'flex', gap: 16, alignItems: 'center',
                }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 10, backgroundColor: getTipoColor(archivo.tipo),
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
                  }}>{getTipoIcon(archivo.tipo)}</div>
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
        )}
      </div>
    </div>
  );
};
