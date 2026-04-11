/**
 * ============================================================================
 * MIS TICKETS SCREEN - Tickets asignados al usuario (Web)
 * ============================================================================
 * Adaptado de: C_Ticket_Apk_STV/src_P_Ticket_IT/ (TODO screen)
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

export const MisTicketsScreen = () => {
  const navigate = useNavigate();
  const [filtroEstado, setFiltroEstado] = useState('todos');

  const misTickets = [
    {
      id: '1', codigo: 'TK-001', titulo: 'Error en servidor principal',
      descripcion: 'El servidor no responde desde las 10am',
      estado: 'pendiente', prioridad: 'alta',
      instalacion: 'Oficina Central', fecha: 'Hace 2 horas',
    },
    {
      id: '2', codigo: 'TK-002', titulo: 'Cambio de toner impresora',
      descripcion: 'La impresora del piso 2 necesita toner nuevo',
      estado: 'en_progreso', prioridad: 'media',
      instalacion: 'Sucursal Norte', fecha: 'Hace 1 día',
    },
    {
      id: '3', codigo: 'TK-003', titulo: 'Instalación de software',
      descripcion: 'Instalar Adobe Creative Suite en estación 5',
      estado: 'completado', prioridad: 'baja',
      instalacion: 'Oficina Central', fecha: 'Hace 3 días',
    },
    {
      id: '4', codigo: 'TK-004', titulo: 'Falla en aire acondicionado',
      descripcion: 'El AC de la sala de servidores no enfría',
      estado: 'pendiente', prioridad: 'urgente',
      instalacion: 'Almacén Principal', fecha: 'Hace 30 min',
    },
  ];

  const estados = ['todos', 'pendiente', 'en_progreso', 'completado', 'cerrado'];

  const ticketsFiltrados = filtroEstado === 'todos'
    ? misTickets
    : misTickets.filter((t) => t.estado === filtroEstado);

  const conteos = {
    todos: misTickets.length,
    pendiente: misTickets.filter((t) => t.estado === 'pendiente').length,
    en_progreso: misTickets.filter((t) => t.estado === 'en_progreso').length,
    completado: misTickets.filter((t) => t.estado === 'completado').length,
    cerrado: misTickets.filter((t) => t.estado === 'cerrado').length,
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F2F2F7' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 32px' }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #5856D6 0%, #AF52DE 100%)',
          padding: '24px', borderRadius: 20, marginBottom: 24, position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', right: -30, top: -40, opacity: 0.1, fontSize: 200 }}>🎫</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, position: 'relative', zIndex: 1 }}>
            <button onClick={() => navigate(-1)} style={{
              width: 44, height: 44, borderRadius: 22, border: '2px solid rgba(255,255,255,0.3)',
              backgroundColor: 'rgba(255,255,255,0.2)', cursor: 'pointer', fontSize: 20, color: 'white',
            }}>←</button>
            <div>
              <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: 'white' }}>Mis Tickets</h2>
              <p style={{ margin: '4px 0 0 0', fontSize: 14, color: 'rgba(255,255,255,0.9)' }}>
                Tickets asignados a ti
              </p>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div style={{
          backgroundColor: 'white', padding: 16, borderRadius: 16, marginBottom: 20,
          border: '1px solid #D1D1D6', display: 'flex', gap: 8, overflowX: 'auto',
        }}>
          {estados.map((estado) => (
            <button
              key={estado}
              onClick={() => setFiltroEstado(estado)}
              style={{
                padding: '8px 16px', borderRadius: 20, border: 'none',
                backgroundColor: filtroEstado === estado ? '#5856D6' : '#F2F2F7',
                color: filtroEstado === estado ? 'white' : '#3C3C43',
                fontSize: 13, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap',
                display: 'flex', alignItems: 'center', gap: 6,
              }}
            >
              {estado === 'todos' ? 'Todos' : getStatusLabel(estado)}
              <span style={{
                backgroundColor: filtroEstado === estado ? 'rgba(255,255,255,0.3)' : '#E5E5EA',
                padding: '2px 8px', borderRadius: 10, fontSize: 11,
              }}>{conteos[estado]}</span>
            </button>
          ))}
        </div>

        {/* Lista de tickets */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {ticketsFiltrados.length === 0 ? (
            <div style={{
              backgroundColor: 'white', padding: 40, borderRadius: 16,
              border: '1px solid #D1D1D6', textAlign: 'center',
            }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
              <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>No hay tickets</div>
              <div style={{ fontSize: 14, color: '#8E8E93' }}>
                No tienes tickets con este estado
              </div>
            </div>
          ) : (
            ticketsFiltrados.map((ticket) => (
              <div
                key={ticket.id}
                onClick={() => navigate(`/tickets/${ticket.id}`)}
                style={{
                  backgroundColor: 'white', padding: 20, borderRadius: 16,
                  border: '1px solid #D1D1D6', cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.95'; e.currentTarget.style.transform = 'scale(0.98)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'scale(1)'; }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
                      <span style={{ fontSize: 12, color: '#8E8E93', fontWeight: 600 }}>{ticket.codigo}</span>
                      <span style={{
                        backgroundColor: getStatusColor(ticket.estado), padding: '2px 10px',
                        borderRadius: 10, fontSize: 11, fontWeight: 600, color: 'white',
                      }}>{getStatusLabel(ticket.estado)}</span>
                      <span style={{
                        backgroundColor: `${getPrioridadColor(ticket.prioridad)}20`, padding: '2px 10px',
                        borderRadius: 10, fontSize: 11, fontWeight: 600,
                        color: getPrioridadColor(ticket.prioridad),
                      }}>{ticket.prioridad.charAt(0).toUpperCase() + ticket.prioridad.slice(1)}</span>
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{ticket.titulo}</div>
                    <div style={{ fontSize: 14, color: '#3C3C43', lineHeight: 1.5 }}>{ticket.descripcion}</div>
                  </div>
                  <span style={{ fontSize: 20, color: '#5856D6', marginLeft: 16 }}>▶</span>
                </div>

                <div style={{
                  display: 'flex', gap: 16, fontSize: 12, color: '#8E8E93',
                  paddingTop: 12, borderTop: '1px solid #F2F2F7',
                }}>
                  <span>📍 {ticket.instalacion}</span>
                  <span>🕐 {ticket.fecha}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
