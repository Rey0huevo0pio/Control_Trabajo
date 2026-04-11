/**
 * ============================================================================
 * 📁 ARCHIVERO HOME SCREEN - Gestión Documental (Web)
 * ============================================================================
 * 
 * ADAPTADO DE: C_Ticket_Apk_STV/src_Archivero_STV/screens/ArchiveroHomeScreen.tsx
 * 
 * QUÉ HACE:
 * - Lista de archiveros con búsqueda
 * - Acciones rápidas (Crear, Subir, Escanear)
 * - Estadísticas (archiveros, carpetas, archivos)
 * - Chips de características
 * 
 * CONEXIONES:
 * - Mobile: C_Ticket_Apk_STV/src_Archivero_STV/screens/ArchiveroHomeScreen.tsx
 * - Navigation: Navega a ArchiveroDetalle, CrearArchivero, etc.
 * 
 * ============================================================================
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const iconMap = {
  'add-circle': '➕',
  'cloud-upload': '☁️',
  'scan': '📷',
  'search': '🔍',
  'close-circle': '❌',
  'filter': '🔽',
  'folder': '📁',
  'eye': '👁️',
  'eye-off': '🙈',
  'lock-closed': '🔒',
  'people': '👥',
  'cloud-download': '⬇️',
  'shield-checkmark': '🛡️',
  'time': '⏰',
  'star': '⭐',
  'chevron-forward': '▶️',
  'ellipsis-vertical': '⋮',
  'document': '📄',
  'image': '🖼️',
  'videocam': '🎥',
};

export const ArchiveroHomeScreen = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data (luego vendrá de la API)
  const archiveros = [
    {
      id: '1',
      nombre: 'Documentos Proyecto Alpha',
      descripcion: 'Archivos del proyecto principal',
      creador: 'Juan Perez',
      visibilidad: 'publico',
      archivos: 24,
      carpetas: 5,
      espacioUsado: '1.2 GB',
      fecha: 'Hace 2 días',
    },
    {
      id: '2',
      nombre: 'Recursos Humanos 2026',
      descripcion: 'Documentos confidenciales de RRHH',
      creador: 'Maria Garcia',
      visibilidad: 'privado',
      archivos: 45,
      carpetas: 12,
      espacioUsado: '3.5 GB',
      fecha: 'Hace 1 semana',
    },
    {
      id: '3',
      nombre: 'Manuales y Procedimientos',
      descripcion: 'Documentación general de la empresa',
      creador: 'Carlos Lopez',
      visibilidad: 'publico',
      archivos: 18,
      carpetas: 4,
      espacioUsado: '850 MB',
      fecha: 'Hace 3 días',
    },
  ];

  const mainActions = [
    { icon: 'add-circle', label: 'Crear Archivero', color: '#007AFF', action: () => navigate('/archivero/crear') },
    { icon: 'cloud-upload', label: 'Subir Archivo', color: '#34C759', action: () => console.log('Subir archivo') },
    { icon: 'scan', label: 'Escanear', color: '#FF9500', action: () => console.log('Escanear') },
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F2F2F7' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 32px' }}>
        {/* Header Premium */}
        <div
          style={{
            backgroundColor: '#5856D6',
            padding: '32px',
            borderRadius: 20,
            marginBottom: 20,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ position: 'absolute', right: -30, top: -40, opacity: 0.1 }}>
            <span style={{ fontSize: 200 }}>{iconMap['folder']}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <h2 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: 'white' }}>
                  Archivero STV
                </h2>
                <span style={{
                  backgroundColor: 'rgba(255,255,255,0.3)',
                  padding: '4px 12px',
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: 700,
                  color: 'white',
                }}>
                  DRIVE
                </span>
              </div>
              <p style={{ margin: 0, fontSize: 15, color: 'rgba(255,255,255,0.8)' }}>
                Gestión documental empresarial
              </p>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                border: 'none',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                fontSize: 24,
              }}>
                {iconMap['search']}
              </button>
              <button style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                border: 'none',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                fontSize: 24,
              }}>
                {iconMap['ellipsis-vertical']}
              </button>
            </div>
          </div>
        </div>

        {/* Buscador */}
        <div style={{
          backgroundColor: 'white',
          padding: '16px',
          borderRadius: 16,
          marginBottom: 20,
          border: '1px solid #D1D1D6',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 20, color: '#8E8E93' }}>{iconMap['search']}</span>
            <input
              type="text"
              placeholder="Buscar archiveros, carpetas, archivos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                fontSize: 15,
                padding: 0,
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  border: 'none',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  fontSize: 20,
                }}
              >
                {iconMap['close-circle']}
              </button>
            )}
          </div>
        </div>

        {/* Acciones principales */}
        <div style={{
          backgroundColor: '#F9F9F9',
          padding: 20,
          borderRadius: 16,
          marginBottom: 20,
        }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: 17, fontWeight: 700 }}>
            Acciones Rápidas
          </h3>
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            {mainActions.map((action) => (
              <div key={action.label} style={{ textAlign: 'center' }}>
                <div
                  onClick={action.action}
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 16,
                    backgroundColor: action.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 28,
                    cursor: 'pointer',
                    marginBottom: 8,
                  }}
                >
                  {iconMap[action.icon]}
                </div>
                <span style={{ fontSize: 13, color: '#3C3C43', fontWeight: 600 }}>
                  {action.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Estadísticas */}
        <div style={{
          backgroundColor: 'white',
          padding: 20,
          borderRadius: 16,
          marginBottom: 20,
          border: '1px solid #D1D1D6',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#007AFF' }}>
                {archiveros.length}
              </div>
              <div style={{ fontSize: 13, color: '#3C3C43' }}>Archiveros</div>
            </div>
            <div style={{ width: 1, backgroundColor: '#D1D1D6' }} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#34C759' }}>87</div>
              <div style={{ fontSize: 13, color: '#3C3C43' }}>Carpetas</div>
            </div>
            <div style={{ width: 1, backgroundColor: '#D1D1D6' }} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#FF9500' }}>342</div>
              <div style={{ fontSize: 13, color: '#3C3C43' }}>Archivos</div>
            </div>
          </div>
        </div>

        {/* Lista de archiveros */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>
              Mis Archiveros
            </h3>
            <button style={{
              border: 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              fontSize: 20,
            }}>
              {iconMap['filter']}
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {archiveros.map((archivero) => (
              <div
                key={archivero.id}
                onClick={() => navigate(`/archivero/${archivero.id}`)}
                style={{
                  backgroundColor: 'white',
                  padding: 20,
                  borderRadius: 16,
                  border: '1px solid #D1D1D6',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '0.95';
                  e.currentTarget.style.transform = 'scale(0.98)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '1';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                  <div style={{
                    width: 64,
                    height: 64,
                    borderRadius: 16,
                    backgroundColor: '#5856D6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 32,
                    position: 'relative',
                  }}>
                    {iconMap['folder']}
                    <div style={{
                      position: 'absolute',
                      top: -6,
                      right: -6,
                      backgroundColor: archivero.visibilidad === 'publico' ? '#34C759' : '#FF3B30',
                      padding: '2px 8px',
                      borderRadius: 20,
                    }}>
                      <span style={{ fontSize: 12 }}>{iconMap[archivero.visibilidad === 'publico' ? 'eye' : 'eye-off']}</span>
                    </div>
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 4 }}>
                      {archivero.nombre}
                    </div>
                    <div style={{ fontSize: 15, color: '#3C3C43', marginBottom: 8 }}>
                      {archivero.descripcion}
                    </div>
                    <div style={{ display: 'flex', gap: 16, fontSize: 13, color: '#8E8E93' }}>
                      <span>{archivero.archivos} archivos</span>
                      <span>{archivero.carpetas} carpetas</span>
                      <span>{archivero.espacioUsado}</span>
                    </div>
                  </div>

                  <span style={{ fontSize: 24, color: '#5856D6' }}>
                    {iconMap['chevron-forward']}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Características */}
        <div style={{ marginBottom: 20 }}>
          <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>
            Características
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            {[
              { icon: 'lock-closed', label: 'Cifrado', color: '#34C759' },
              { icon: 'people', label: 'Colaborativo', color: '#007AFF' },
              { icon: 'cloud-download', label: 'Descargas', color: '#5856D6' },
              { icon: 'scan', label: 'Escaneo', color: '#FF9500' },
              { icon: 'shield-checkmark', label: 'Seguro', color: '#34C759' },
              { icon: 'time', label: 'Versiones', color: '#007AFF' },
            ].map((feature) => (
              <div
                key={feature.label}
                style={{
                  backgroundColor: '#F2F2F7',
                  border: '1px solid #D1D1D6',
                  padding: '8px 16px',
                  borderRadius: 20,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <span style={{ fontSize: 14, color: feature.color }}>
                  {iconMap[feature.icon]}
                </span>
                <span style={{ fontSize: 13, color: '#3C3C43', fontWeight: 600 }}>
                  {feature.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', padding: '24px 0' }}>
          <div style={{ fontSize: 13, color: '#C7C7CC' }}>
            Archivero STV v1.0 - Gestión Documental
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginTop: 8 }}>
            {[1, 2, 3, 4, 5].map((i) => (
              <span key={i} style={{ fontSize: 12, color: '#FF9500' }}>
                {iconMap['star']}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
