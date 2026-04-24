/**
 * ============================================================================
 * CREAR TICKET SCREEN - Formulario para crear ticket (Web)
 * ============================================================================
 * Adaptado de: C_Ticket_Apk_STV/src_P_Ticket_IT/ (TODO screen)
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const CrearTicketScreen = () => {
  const navigate = useNavigate();
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [prioridad, setPrioridad] = useState('media');
  const [instalacion, setInstalacion] = useState('');
  const [area, setArea] = useState('');
  const [categoria, setCategoria] = useState('');

  const instalaciones = [
    { id: '1', nombre: 'Oficina Central' },
    { id: '2', nombre: 'Sucursal Norte' },
    { id: '3', nombre: 'Almacén Principal' },
  ];

  const areasPorInstalacion = {
    '1': ['Recepción', 'Sala de Juntas', 'Oficina IT', 'Cocina'],
    '2': ['Recepción', 'Oficina Ventas'],
    '3': ['Zona de Carga', 'Almacenamiento A', 'Almacenamiento B'],
  };

  const categorias = ['Hardware', 'Software', 'Red', 'Electricidad', 'Plomería', 'Mobiliario', 'Otro'];

  const prioridades = [
    { value: 'baja', label: 'Baja', color: '#34C759', emoji: '🟢' },
    { value: 'media', label: 'Media', color: '#007AFF', emoji: '🔵' },
    { value: 'alta', label: 'Alta', color: '#FF9500', emoji: '🟠' },
    { value: 'urgente', label: 'Urgente', color: '#FF3B30', emoji: '🔴' },
  ];

  const handleSubmit = () => {
    if (!titulo.trim() || !descripcion.trim() || !instalacion) return;
    console.log('Creando ticket:', { titulo, descripcion, prioridad, instalacion, area, categoria });
    navigate('/tickets');
  };

  const areasDisponibles = instalacion ? (areasPorInstalacion[instalacion] || []) : [];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F2F2F7' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 32px' }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #FF9500 0%, #FF6B00 100%)',
          padding: '24px', borderRadius: 20, marginBottom: 24, position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', right: -30, top: -40, opacity: 0.1, fontSize: 200 }}>🎫</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, position: 'relative', zIndex: 1 }}>
            <button onClick={() => navigate(-1)} style={{
              width: 44, height: 44, borderRadius: 22, border: '2px solid rgba(255,255,255,0.3)',
              backgroundColor: 'rgba(255,255,255,0.2)', cursor: 'pointer', fontSize: 20, color: 'white',
            }}>←</button>
            <div>
              <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: 'white' }}>Crear Ticket</h2>
              <p style={{ margin: '4px 0 0 0', fontSize: 14, color: 'rgba(255,255,255,0.9)' }}>
                Registra un nuevo ticket de soporte
              </p>
            </div>
          </div>
        </div>

        {/* Formulario */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Información del Ticket */}
          <div style={{
            backgroundColor: 'white', padding: 24, borderRadius: 16,
            border: '1px solid #D1D1D6',
          }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: 17, fontWeight: 700 }}>
              Información del Ticket
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
                  Título *
                </label>
                <input
                  type="text"
                  placeholder="Descripción breve del problema"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  style={{
                    width: '100%', padding: '12px 16px', borderRadius: 12,
                    border: '1px solid #D1D1D6', fontSize: 15, outline: 'none', boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
                  Descripción *
                </label>
                <textarea
                  placeholder="Describe el problema con el mayor detalle posible"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  rows={4}
                  style={{
                    width: '100%', padding: '12px 16px', borderRadius: 12,
                    border: '1px solid #D1D1D6', fontSize: 15, outline: 'none',
                    resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Prioridad */}
          <div style={{
            backgroundColor: 'white', padding: 24, borderRadius: 16,
            border: '1px solid #D1D1D6',
          }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: 17, fontWeight: 700 }}>Prioridad</h3>
            <div style={{ display: 'flex', gap: 12 }}>
              {prioridades.map((p) => (
                <div
                  key={p.value}
                  onClick={() => setPrioridad(p.value)}
                  style={{
                    flex: 1, padding: 16, borderRadius: 12, cursor: 'pointer', textAlign: 'center',
                    border: prioridad === p.value ? `2px solid ${p.color}` : '1px solid #D1D1D6',
                    backgroundColor: prioridad === p.value ? `${p.color}15` : 'white',
                  }}
                >
                  <span style={{ fontSize: 24 }}>{p.emoji}</span>
                  <div style={{ fontSize: 13, fontWeight: 700, marginTop: 6, color: p.color }}>{p.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Ubicación */}
          <div style={{
            backgroundColor: 'white', padding: 24, borderRadius: 16,
            border: '1px solid #D1D1D6',
          }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: 17, fontWeight: 700 }}>Ubicación</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
                  Instalación *
                </label>
                <select
                  value={instalacion}
                  onChange={(e) => { setInstalacion(e.target.value); setArea(''); }}
                  style={{
                    width: '100%', padding: '12px 16px', borderRadius: 12,
                    border: '1px solid #D1D1D6', fontSize: 15, outline: 'none',
                    backgroundColor: 'white', boxSizing: 'border-box',
                  }}
                >
                  <option value="">Seleccionar instalación</option>
                  {instalaciones.map((inst) => (
                    <option key={inst.id} value={inst.id}>{inst.nombre}</option>
                  ))}
                </select>
              </div>

              {instalacion && areasDisponibles.length > 0 && (
                <div>
                  <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
                    Área
                  </label>
                  <select
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    style={{
                      width: '100%', padding: '12px 16px', borderRadius: 12,
                      border: '1px solid #D1D1D6', fontSize: 15, outline: 'none',
                      backgroundColor: 'white', boxSizing: 'border-box',
                    }}
                  >
                    <option value="">Seleccionar área</option>
                    {areasDisponibles.map((a) => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Categoría */}
          <div style={{
            backgroundColor: 'white', padding: 24, borderRadius: 16,
            border: '1px solid #D1D1D6',
          }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: 17, fontWeight: 700 }}>Categoría</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {categorias.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoria(categoria === cat ? '' : cat)}
                  style={{
                    padding: '8px 16px', borderRadius: 20, border: 'none',
                    backgroundColor: categoria === cat ? '#007AFF' : '#F2F2F7',
                    color: categoria === cat ? 'white' : '#3C3C43',
                    fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Botones */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <button
              onClick={handleSubmit}
              disabled={!titulo.trim() || !descripcion.trim() || !instalacion}
              style={{
                width: '100%', padding: '16px 24px', borderRadius: 14, border: 'none',
                backgroundColor: titulo.trim() && descripcion.trim() && instalacion ? '#FF9500' : '#C7C7CC',
                color: 'white', fontSize: 17, fontWeight: 700,
                cursor: titulo.trim() && descripcion.trim() && instalacion ? 'pointer' : 'not-allowed',
              }}
            >
              Crear Ticket
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
    </div>
  );
};
