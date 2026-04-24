/**
 * ============================================================================
 * TODOS TICKETS SCREEN - Lista completa de tickets del sistema (Web)
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

export const TodosTicketsScreen = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [filtroPrioridad, setFiltroPrioridad] = useState('todas');

  const todosTickets = [
    {
      id: '1', codigo: 'TK-001', titulo: 'Error en servidor principal',
      estado: 'pendiente', prioridad: 'alta',
      asignado: 'Juan Pérez', instalacion: 'Oficina Central', fecha: 'Hace 2 horas',
    },
    {
      id: '2', codigo: 'TK-002', titulo: 'Cambio de toner impresora',
      estado: 'en_progreso', prioridad: 'media',
      asignado: 'María García', instalacion: 'Sucursal Norte', fecha: 'Hace 1 día',
    },
    {
      id: '3', codigo: 'TK-003', titulo: 'Instalación de software',
      estado: 'completado', prioridad: 'baja',
      asignado: 'Carlos López', instalacion: 'Oficina Central', fecha: 'Hace 3 días',
    },
    {
      id: '4', codigo: 'TK-004', titulo: 'Falla en aire acondicionado',
      estado: 'pendiente', prioridad: 'urgente',
      asignado: 'Sin asignar', instalacion: 'Almacén Principal', fecha: 'Hace 30 min',
    },
    {
      id: '5', codigo: 'TK-005', titulo: 'Reparación de cableado de red',
      estado: 'en_progreso', prioridad: 'alta',
      asignado: 'Ana Martínez', instalacion: 'Oficina Central', fecha: 'Hace 5 horas',
    },
    {
      id: '6', codigo: 'TK-006', titulo: 'Actualización de sistema operativo',
      estado: 'completado', prioridad: 'media',
      asignado: 'Pedro Sánchez', instalacion: 'Sucursal Norte', fecha: 'Hace 1 semana',
    },
  ];

  const estados = ['todos', 'pendiente', 'en_progreso', 'completado', 'cerrado'];
  const prioridades = ['todas', 'baja', 'media', 'alta', 'urgente'];

  const ticketsFiltrados = todosTickets.filter((t) => {
    const matchSearch = searchQuery === '' ||
      t.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.codigo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.asignado.toLowerCase().includes(searchQuery.toLowerCase());
    const matchEstado = filtroEstado === 'todos' || t.estado === filtroEstado;
    const matchPrioridad = filtroPrioridad === 'todas' || t.prioridad === filtroPrioridad;
    return matchSearch && matchEstado && matchPrioridad;
  });

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F2F2F7' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 32px' }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #FF9500 0%, #FF6B00 100%)',
          padding: '24px', borderRadius: 20, marginBottom: 24, position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', right: -30, top: -40, opacity: 0.1, fontSize: 200 }}>📋</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, position: 'relative', zIndex: 1 }}>
            <button onClick={() => navigate(-1)} style={{
              width: 44, height: 44, borderRadius: 22, border: '2px solid rgba(255,255,255,0.3)',
              backgroundColor: 'rgba(255,255,255,0.2)', cursor: 'pointer', fontSize: 20, color: 'white',
            }}>←</button>
            <div>
              <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: 'white' }}>Todos los Tickets</h2>
              <p style={{ margin: '4px 0 0 0', fontSize: 14, color: 'rgba(255,255,255,0.9)' }}>
                {ticketsFiltrados.length} de {todosTickets.length} tickets
              </p>
            </div>
          </div>
        </div>

        {/* Buscador */}
        <div style={{
          backgroundColor: 'white', padding: 16, borderRadius: 16, marginBottom: 16,
          border: '1px solid #D1D1D6', display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <span style={{ fontSize: 20 }}>🔍</span>
          <input
            type="text"
            placeholder="Buscar por título, código o asignado..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ flex: 1, border: 'none', outline: 'none', fontSize: 15 }}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} style={{
              border: 'none', backgroundColor: 'transparent', cursor: 'pointer', fontSize: 18,
            }}>✕</button>
          )}
        </div>

        {/* Filtros */}
        <div style={{
          backgroundColor: 'white', padding: 16, borderRadius: 16, marginBottom: 20,
          border: '1px solid #D1D1D6',
        }}>
          <div style={{ marginBottom: 12 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#8E8E93', marginBottom: 8, display: 'block' }}>Estado</span>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {estados.map((estado) => (
                <button
                  key={estado}
                  onClick={() => setFiltroEstado(estado)}
                  style={{
                    padding: '6px 14px', borderRadius: 16, border: 'none',
                    backgroundColor: filtroEstado === estado ? '#FF9500' : '#F2F2F7',
                    color: filtroEstado === estado ? 'white' : '#3C3C43',
                    fontSize: 12, fontWeight: 600, cursor: 'pointer',
                  }}
                >
                  {estado === 'todos' ? 'Todos' : getStatusLabel(estado)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#8E8E93', marginBottom: 8, display: 'block' }}>Prioridad</span>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {prioridades.map((p) => (
                <button
                  key={p}
                  onClick={() => setFiltroPrioridad(p)}
                  style={{
                    padding: '6px 14px', borderRadius: 16, border: 'none',
                    backgroundColor: filtroPrioridad === p ? '#5856D6' : '#F2F2F7',
                    color: filtroPrioridad === p ? 'white' : '#3C3C43',
                    fontSize: 12, fontWeight: 600, cursor: 'pointer',
                  }}
                >
                  {p === 'todas' ? 'Todas' : p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tabla de tickets */}
        <div style={{
          backgroundColor: 'white', borderRadius: 16, border: '1px solid #D1D1D6', overflow: 'hidden',
        }}>
          {/* Header de tabla */}
          <div style={{
            display: 'grid', gridTemplateColumns: '100px 1fr 120px 100px 140px 100px',
            padding: '12px 20px', backgroundColor: '#F9F9F9', borderBottom: '1px solid #D1D1D6',
            fontSize: 12, fontWeight: 700, color: '#8E8E93', textTransform: 'uppercase',
          }}>
            <span>Código</span>
            <span>Título</span>
            <span>Estado</span>
            <span>Prioridad</span>
            <span>Asignado</span>
            <span>Fecha</span>
          </div>

          {/* Filas */}
          {ticketsFiltrados.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
              <div style={{ fontSize: 17, fontWeight: 700 }}>No se encontraron tickets</div>
              <div style={{ fontSize: 14, color: '#8E8E93', marginTop: 8 }}>
                Intenta cambiar los filtros de búsqueda
              </div>
            </div>
          ) : (
            ticketsFiltrados.map((ticket) => (
              <div
                key={ticket.id}
                onClick={() => navigate(`/tickets/${ticket.id}`)}
                style={{
                  display: 'grid', gridTemplateColumns: '100px 1fr 120px 100px 140px 100px',
                  padding: '14px 20px', borderBottom: '1px solid #F2F2F7',
                  cursor: 'pointer', alignItems: 'center', fontSize: 14,
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F9F9F9'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'white'; }}
              >
                <span style={{ fontWeight: 600, color: '#8E8E93' }}>{ticket.codigo}</span>
                <span style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {ticket.titulo}
                </span>
                <span style={{
                  backgroundColor: getStatusColor(ticket.estado), padding: '3px 10px',
                  borderRadius: 10, fontSize: 11, fontWeight: 600, color: 'white',
                  textAlign: 'center', display: 'inline-block', width: 'fit-content',
                }}>{getStatusLabel(ticket.estado)}</span>
                <span style={{
                  color: getPrioridadColor(ticket.prioridad), fontWeight: 600, fontSize: 13,
                }}>{ticket.prioridad.charAt(0).toUpperCase() + ticket.prioridad.slice(1)}</span>
                <span style={{ fontSize: 13, color: '#3C3C43' }}>{ticket.asignado}</span>
                <span style={{ fontSize: 12, color: '#8E8E93' }}>{ticket.fecha}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
