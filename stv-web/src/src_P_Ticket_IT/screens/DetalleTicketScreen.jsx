/**
 * ============================================================================
 * DETALLE TICKET SCREEN - Detalle de un ticket individual (Web)
 * ============================================================================
 * Adaptado de: C_Ticket_Apk_STV/src_P_Ticket_IT/ (TODO screen)
 */
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const getStatusColor = (status) => {
  switch (status) {
    case 'pendiente': return '#FF9500';
    case 'en_progreso': return '#5856D6';
    case 'completado': return '#34C759';
    case 'cerrado': return '#8E8E93';
    default: return '#8E8E93';
  }
};

const getStatusLabel = (status) => {
  switch (status) {
    case 'pendiente': return 'Pendiente';
    case 'en_progreso': return 'En Progreso';
    case 'completado': return 'Completado';
    case 'cerrado': return 'Cerrado';
    default: return status;
  }
};

const getPrioridadColor = (prioridad) => {
  switch (prioridad) {
    case 'baja': return '#34C759';
    case 'media': return '#007AFF';
    case 'alta': return '#FF9500';
    case 'urgente': return '#FF3B30';
    default: return '#8E8E93';
  }
};

export const DetalleTicketScreen = () => {
  const navigate = useNavigate();
  const { ticketId } = useParams();
  const [nuevoComentario, setNuevoComentario] = useState('');
  const [estadoActivo, setEstadoActivo] = useState('en_progreso');

  // Mock data
  const ticket = {
    id: ticketId,
    codigo: 'TK-001',
    titulo: 'Error en servidor principal',
    descripcion: 'El servidor principal no responde desde las 10:00 AM. Se intentó reiniciar pero el problema persiste. Es urgente resolverlo porque afecta a toda la operación de la oficina central.',
    estado: 'pendiente',
    prioridad: 'alta',
    creador: 'Juan Pérez',
    asignado: 'María García',
    instalacion: 'Oficina Central',
    area: 'Sala de Servidores',
    categoria: 'Red',
    fechaCreacion: '10 Abr 2026, 10:00 AM',
    fechaActualizacion: '10 Abr 2026, 10:30 AM',
  };

  const historial = [
    { accion: 'Ticket creado', descripcion: 'Creado por Juan Pérez', usuario: 'Juan Pérez', fecha: '10:00 AM' },
    { accion: 'Prioridad cambiada', descripcion: 'De media a alta', usuario: 'Sistema', fecha: '10:15 AM' },
    { accion: 'Asignado', descripcion: 'Asignado a María García', usuario: 'Sistema', fecha: '10:30 AM' },
  ];

  const comentarios = [
    {
      id: '1', usuario: 'Juan Pérez', avatar: 'JP',
      comentario: 'El servidor lleva caído 30 minutos. Ya intenté reiniciarlo pero no responde.',
      fecha: '10:05 AM',
    },
    {
      id: '2', usuario: 'María García', avatar: 'MG',
      comentario: 'Voy a revisar la conexión de red y el estado del hardware. Te mantengo informado.',
      fecha: '10:35 AM',
    },
  ];

  const estadosDisponibles = ['pendiente', 'en_progreso', 'completado', 'cerrado'];

  const handleAgregarComentario = () => {
    if (!nuevoComentario.trim()) return;
    console.log('Nuevo comentario:', nuevoComentario);
    setNuevoComentario('');
  };

  const handleCambiarEstado = (nuevoEstado) => {
    setEstadoActivo(nuevoEstado);
    console.log('Cambiando estado a:', nuevoEstado);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F2F2F7' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 32px' }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #007AFF 0%, #5AC8FA 100%)',
          padding: '24px', borderRadius: 20, marginBottom: 24, position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', right: -30, top: -40, opacity: 0.1, fontSize: 200 }}>🎫</div>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <button onClick={() => navigate(-1)} style={{
                width: 44, height: 44, borderRadius: 22, border: '2px solid rgba(255,255,255,0.3)',
                backgroundColor: 'rgba(255,255,255,0.2)', cursor: 'pointer', fontSize: 20, color: 'white',
              }}>←</button>
              <div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
                  <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>{ticket.codigo}</span>
                  <span style={{
                    backgroundColor: 'rgba(255,255,255,0.3)', padding: '2px 10px',
                    borderRadius: 10, fontSize: 11, fontWeight: 600, color: 'white',
                  }}>{getStatusLabel(estadoActivo)}</span>
                </div>
                <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: 'white' }}>{ticket.titulo}</h2>
              </div>
            </div>
          </div>
        </div>

        {/* Info principal */}
        <div style={{
          backgroundColor: 'white', padding: 24, borderRadius: 16, marginBottom: 20,
          border: '1px solid #D1D1D6',
        }}>
          <p style={{ fontSize: 15, color: '#3C3C43', lineHeight: 1.6, margin: '0 0 20px 0' }}>
            {ticket.descripcion}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            <div>
              <div style={{ fontSize: 12, color: '#8E8E93', fontWeight: 600, marginBottom: 4 }}>Prioridad</div>
              <span style={{
                backgroundColor: `${getPrioridadColor(ticket.prioridad)}20`, padding: '4px 12px',
                borderRadius: 10, fontSize: 13, fontWeight: 600,
                color: getPrioridadColor(ticket.prioridad),
              }}>{ticket.prioridad.charAt(0).toUpperCase() + ticket.prioridad.slice(1)}</span>
            </div>
            <div>
              <div style={{ fontSize: 12, color: '#8E8E93', fontWeight: 600, marginBottom: 4 }}>Creador</div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>👤 {ticket.creador}</div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: '#8E8E93', fontWeight: 600, marginBottom: 4 }}>Asignado</div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>👤 {ticket.asignado}</div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: '#8E8E93', fontWeight: 600, marginBottom: 4 }}>Instalación</div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>📍 {ticket.instalacion}</div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: '#8E8E93', fontWeight: 600, marginBottom: 4 }}>Área</div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>🏢 {ticket.area}</div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: '#8E8E93', fontWeight: 600, marginBottom: 4 }}>Categoría</div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>🏷️ {ticket.categoria}</div>
            </div>
          </div>
        </div>

        {/* Cambiar estado */}
        <div style={{
          backgroundColor: 'white', padding: 24, borderRadius: 16, marginBottom: 20,
          border: '1px solid #D1D1D6',
        }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: 17, fontWeight: 700 }}>Cambiar Estado</h3>
          <div style={{ display: 'flex', gap: 10 }}>
            {estadosDisponibles.map((estado) => (
              <button
                key={estado}
                onClick={() => handleCambiarEstado(estado)}
                style={{
                  flex: 1, padding: '10px 16px', borderRadius: 12, border: 'none',
                  backgroundColor: estadoActivo === estado ? getStatusColor(estado) : '#F2F2F7',
                  color: estadoActivo === estado ? 'white' : '#3C3C43',
                  fontSize: 13, fontWeight: 600, cursor: 'pointer',
                }}
              >
                {getStatusLabel(estado)}
              </button>
            ))}
          </div>
        </div>

        {/* Historial */}
        <div style={{
          backgroundColor: 'white', padding: 24, borderRadius: 16, marginBottom: 20,
          border: '1px solid #D1D1D6',
        }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: 17, fontWeight: 700 }}>Historial</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {historial.map((item, index) => (
              <div key={index} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{
                  width: 8, height: 8, borderRadius: 4, backgroundColor: '#007AFF', marginTop: 6, flexShrink: 0,
                }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{item.accion}</div>
                  <div style={{ fontSize: 13, color: '#3C3C43' }}>{item.descripcion}</div>
                  <div style={{ fontSize: 12, color: '#8E8E93', marginTop: 2 }}>
                    {item.usuario} • {item.fecha}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Comentarios */}
        <div style={{
          backgroundColor: 'white', padding: 24, borderRadius: 16, marginBottom: 20,
          border: '1px solid #D1D1D6',
        }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: 17, fontWeight: 700 }}>
            Comentarios ({comentarios.length})
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 20 }}>
            {comentarios.map((comentario) => (
              <div key={comentario.id} style={{ display: 'flex', gap: 12 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 20, backgroundColor: '#5856D6',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontWeight: 700, fontSize: 14, flexShrink: 0,
                }}>{comentario.avatar}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <span style={{ fontSize: 14, fontWeight: 600 }}>{comentario.usuario}</span>
                    <span style={{ fontSize: 12, color: '#8E8E93' }}>{comentario.fecha}</span>
                  </div>
                  <div style={{
                    backgroundColor: '#F2F2F7', padding: 12, borderRadius: 12,
                    fontSize: 14, lineHeight: 1.5,
                  }}>{comentario.comentario}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Nuevo comentario */}
          <div style={{ display: 'flex', gap: 12 }}>
            <textarea
              placeholder="Escribe un comentario..."
              value={nuevoComentario}
              onChange={(e) => setNuevoComentario(e.target.value)}
              rows={2}
              style={{
                flex: 1, padding: '12px 16px', borderRadius: 12,
                border: '1px solid #D1D1D6', fontSize: 14, outline: 'none',
                resize: 'none', fontFamily: 'inherit',
              }}
            />
            <button
              onClick={handleAgregarComentario}
              disabled={!nuevoComentario.trim()}
              style={{
                padding: '12px 20px', borderRadius: 12, border: 'none',
                backgroundColor: nuevoComentario.trim() ? '#007AFF' : '#C7C7CC',
                color: 'white', fontSize: 14, fontWeight: 600,
                cursor: nuevoComentario.trim() ? 'pointer' : 'not-allowed',
                alignSelf: 'flex-end',
              }}
            >
              Enviar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
