/**
 * ============================================================================
 * ESCANEAR DOCUMENTO SCREEN - Escanear documentos (Web)
 * ============================================================================
 * Adaptado de: C_Ticket_Apk_STV/src_Archivero_STV/screens/EscanearDocumentoScreen.tsx
 */
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const E = {
  'arrow-back': '←', 'camera': '📷', 'images': '🖼️', 'arrow-forward': '→',
  'document-text': '📄', 'crop': '✂️', 'contrast': '🌓', 'layers': '📚',
  'checkmark': '✓',
};

export const EscanearDocumentoScreen = () => {
  const navigate = useNavigate();
  const { archiveroId } = useParams();
  const [metodoSeleccionado, setMetodoSeleccionado] = useState(null);

  const opciones = [
    {
      id: 'camara',
      icono: 'camera',
      titulo: 'Tomar Foto',
      descripcion: 'Captura una imagen con la cámara',
      color: '#007AFF',
    },
    {
      id: 'galeria',
      icono: 'images',
      titulo: 'Escanear Archivo',
      descripcion: 'Selecciona o escanea un documento existente',
      color: '#5856D6',
    },
  ];

  const handleContinuar = () => {
    if (!metodoSeleccionado) return;
    console.log('Escaneando con:', metodoSeleccionado);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F2F2F7' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 32px' }}>
        {/* Header */}
        <div style={{
          backgroundColor: '#FF9500', padding: '24px', borderRadius: 20, marginBottom: 24,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <button onClick={() => navigate(-1)} style={{
              width: 44, height: 44, borderRadius: 22, border: 'none',
              backgroundColor: 'rgba(255,255,255,0.2)', cursor: 'pointer', fontSize: 24, color: 'white',
            }}>{E['arrow-back']}</button>
            <div>
              <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: 'white' }}>Escanear Documento</h2>
              <p style={{ margin: '4px 0 0 0', fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>Selecciona el método de captura</p>
            </div>
          </div>
        </div>

        {/* Opciones de escaneo */}
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Método de Captura</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {opciones.map((opcion) => {
              const isSelected = metodoSeleccionado === opcion.id;
              return (
                <div
                  key={opcion.id}
                  onClick={() => setMetodoSeleccionado(opcion.id)}
                  style={{
                    backgroundColor: 'white',
                    padding: 24,
                    borderRadius: 16,
                    cursor: 'pointer',
                    border: isSelected ? `2px solid ${opcion.color}` : '1px solid #D1D1D6',
                    backgroundColor: isSelected ? `${opcion.color}10` : 'white',
                    display: 'flex',
                    gap: 20,
                    alignItems: 'center',
                  }}
                >
                  <div style={{
                    width: 70, height: 70, borderRadius: 18, backgroundColor: opcion.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, flexShrink: 0,
                  }}>{E[opcion.icono]}</div>

                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 4 }}>{opcion.titulo}</div>
                    <div style={{ fontSize: 14, color: '#3C3C43' }}>{opcion.descripcion}</div>
                  </div>

                  <div style={{
                    width: 28, height: 28, borderRadius: 14,
                    borderWidth: 2, borderStyle: 'solid',
                    borderColor: isSelected ? opcion.color : '#D1D1D6',
                    backgroundColor: isSelected ? opcion.color : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontSize: 16, flexShrink: 0,
                  }}>
                    {isSelected && E['checkmark']}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Características */}
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Características de Escaneo</h3>

          <div style={{
            backgroundColor: '#F9F9F9', padding: 20, borderRadius: 16,
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { icon: 'document-text', titulo: 'OCR Integrado', descripcion: 'Reconocimiento de texto automático' },
                { icon: 'crop', titulo: 'Auto-recorte', descripcion: 'Detecta bordes del documento' },
                { icon: 'contrast', titulo: 'Mejora de imagen', descripcion: 'Optimiza calidad automáticamente' },
                { icon: 'layers', titulo: 'Multi-página', descripcion: 'Escanea varios documentos' },
              ].map((feature) => (
                <div key={feature.titulo} style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 10, backgroundColor: '#007AFF',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0,
                  }}>{E[feature.icon]}</div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 2 }}>{feature.titulo}</div>
                    <div style={{ fontSize: 13, color: '#3C3C43' }}>{feature.descripcion}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Botón continuar */}
        <button
          onClick={handleContinuar}
          disabled={!metodoSeleccionado}
          style={{
            width: '100%', padding: '16px 24px', borderRadius: 14, border: 'none',
            backgroundColor: metodoSeleccionado ? '#007AFF' : '#C7C7CC',
            color: 'white', fontSize: 17, fontWeight: 700,
            cursor: metodoSeleccionado ? 'pointer' : 'not-allowed',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}
        >
          {E['arrow-forward']} Continuar
        </button>
      </div>
    </div>
  );
};
