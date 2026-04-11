/**
 * ============================================================================
 * 🎫 TICKET HOME SCREEN - Hub de Tickets IT (Web)
 * ============================================================================
 *
 * ADAPTADO DE: C_Ticket_Apk_STV/src_P_Ticket_IT/screens/TicketHomeScreen.tsx
 *
 * QUÉ HACE:
 * - Hub principal del módulo Tickets IT
 * - Acciones rápidas (Crear, Mis Tickets, Todos, Reportes)
 * - Resumen de métricas (pendientes, en progreso, completados, total)
 * - Lista de tickets recientes
 *
 * CONEXIONES:
 * - Mobile: C_Ticket_Apk_STV/src_P_Ticket_IT/screens/TicketHomeScreen.tsx
 * - Navigation: Navega a CrearTicket, MisTickets, TodosTickets, Reportes, Detalle
 *
 * ============================================================================
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export const TicketHomeScreen = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  // Mock data (luego vendrá de la API)
  const ticketsRecientes = [
    {
      id: '1', codigo: 'TK-001', titulo: 'Error en servidor principal',
      estado: 'pendiente', prioridad: 'alta',
      creador: 'Juan Perez', fecha: 'Hace 2 horas',
    },
    {
      id: '2', codigo: 'TK-002', titulo: 'Cambio de toner impresora',
      estado: 'en_progreso', prioridad: 'media',
      creador: 'Maria Garcia', fecha: 'Hace 1 día',
    },
    {
      id: '3', codigo: 'TK-003', titulo: 'Instalación de software',
      estado: 'completado', prioridad: 'baja',
      creador: 'Carlos Lopez', fecha: 'Hace 3 días',
    },
    {
      id: '4', codigo: 'TK-004', titulo: 'Falla en aire acondicionado',
      estado: 'pendiente', prioridad: 'urgente',
      creador: 'Ana Martinez', fecha: 'Hace 30 min',
    },
  ];

  const metricas = {
    pendientes: 8,
    enProgreso: 5,
    completados: 23,
    total: 36,
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pendiente': return '#FF9500';
      case 'en_progreso': return '#5856D6';
      case 'completado': return '#34C759';
      case 'cerrado': return '#8E8E93';
      default: return '#8E8E93';
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

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pendiente': return 'Pendiente';
      case 'en_progreso': return 'En Progreso';
      case 'completado': return 'Completado';
      case 'cerrado': return 'Cerrado';
      default: return status;
    }
  };

  const accionesPrincipales = [
    { icon: '➕', label: 'Crear Ticket', color: '#FF9500', route: '/tickets/crear' },
    { icon: '🎫', label: 'Mis Tickets', color: '#5856D6', route: '/tickets/mis-tickets' },
    { icon: '📋', label: 'Todos los Tickets', color: '#007AFF', route: '/tickets/todos' },
    { icon: '📊', label: 'Reportes', color: '#34C759', route: '/tickets/reportes' },
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F2F2F7' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 32px' }}>
        {/* Header Premium */}
        <div
          style={{
            background: 'linear-gradient(135deg, #FF9500 0%, #FF6B00 100%)',
            padding: '32px',
            borderRadius: 20,
            marginBottom: 20,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ position: 'absolute', right: -30, top: -40, opacity: 0.1 }}>
            <span style={{ fontSize: 200 }}>🎫</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <h2 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: 'white' }}>
                  Tickets IT
                </h2>
                <span style={{
                  backgroundColor: 'rgba(255,255,255,0.3)',
                  padding: '4px 12px',
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: 700,
                  color: 'white',
                }}>
                  SOPORTE
                </span>
              </div>
              <p style={{ margin: 0, fontSize: 15, color: 'rgba(255,255,255,0.85)' }}>
                Sistema de tickets de soporte técnico
              </p>
            </div>

            <button
              onClick={() => navigate('/')}
              style={{
                width: 44, height: 44, borderRadius: 22,
                border: '2px solid rgba(255,255,255,0.3)',
                backgroundColor: 'rgba(255,255,255,0.2)',
                cursor: 'pointer', fontSize: 20, color: 'white',
              }}
            >
              ←
            </button>
          </div>
        </div>

        {/* Acciones principales */}
        <div style={{
          backgroundColor: 'white',
          padding: 24,
          borderRadius: 20,
          marginBottom: 20,
          border: '1px solid #D1D1D6',
        }}>
          <h3 style={{ margin: '0 0 20px', fontSize: 17, fontWeight: 700 }}>
            Acciones Rápidas
          </h3>
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            {accionesPrincipales.map((action) => (
              <div key={action.label} style={{ textAlign: 'center' }}>
                <div
                  onClick={() => navigate(action.route)}
                  style={{
                    width: 64, height: 64, borderRadius: 16,
                    backgroundColor: action.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 28, cursor: 'pointer', marginBottom: 8,
                    transition: 'transform 0.2s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  {action.icon}
                </div>
                <span style={{ fontSize: 13, color: '#3C3C43', fontWeight: 600 }}>
                  {action.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Métricas */}
        <div style={{
          backgroundColor: 'white',
          padding: 24,
          borderRadius: 20,
          marginBottom: 20,
          border: '1px solid #D1D1D6',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#FF9500' }}>
                {metricas.pendientes}
              </div>
              <div style={{ fontSize: 13, color: '#3C3C43' }}>Pendientes</div>
            </div>
            <div style={{ width: 1, backgroundColor: '#D1D1D6' }} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#5856D6' }}>
                {metricas.enProgreso}
              </div>
              <div style={{ fontSize: 13, color: '#3C3C43' }}>En Progreso</div>
            </div>
            <div style={{ width: 1, backgroundColor: '#D1D1D6' }} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#34C759' }}>
                {metricas.completados}
              </div>
              <div style={{ fontSize: 13, color: '#3C3C43' }}>Completados</div>
            </div>
            <div style={{ width: 1, backgroundColor: '#D1D1D6' }} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#007AFF' }}>
                {metricas.total}
              </div>
              <div style={{ fontSize: 13, color: '#3C3C43' }}>Total</div>
            </div>
          </div>
        </div>

        {/* Tickets Recientes */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>
              Tickets Recientes
            </h3>
            <button
              onClick={() => navigate('/tickets/todos')}
              style={{
                border: 'none', backgroundColor: 'transparent',
                cursor: 'pointer', fontSize: 14, color: '#007AFF', fontWeight: 600,
              }}
            >
              Ver todos →
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {ticketsRecientes.map((ticket) => (
              <div
                key={ticket.id}
                onClick={() => navigate(`/tickets/${ticket.id}`)}
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
                      <span style={{ fontSize: 12, color: '#8E8E93', fontWeight: 600 }}>
                        {ticket.codigo}
                      </span>
                      <span style={{
                        backgroundColor: getStatusColor(ticket.estado),
                        padding: '2px 10px', borderRadius: 10,
                        fontSize: 11, fontWeight: 600, color: 'white',
                      }}>
                        {getStatusLabel(ticket.estado)}
                      </span>
                      <span style={{
                        backgroundColor: `${getPrioridadColor(ticket.prioridad)}20`,
                        padding: '2px 10px', borderRadius: 10,
                        fontSize: 11, fontWeight: 600,
                        color: getPrioridadColor(ticket.prioridad),
                      }}>
                        {ticket.prioridad.charAt(0).toUpperCase() + ticket.prioridad.slice(1)}
                      </span>
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>
                      {ticket.titulo}
                    </div>
                    <div style={{ fontSize: 13, color: '#8E8E93' }}>
                      Por: {ticket.creador} · {ticket.fecha}
                    </div>
                  </div>
                  <span style={{ fontSize: 20, color: '#FF9500', marginLeft: 16 }}>▶</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', padding: '24px 0' }}>
          <div style={{ fontSize: 13, color: '#C7C7CC' }}>
            Tickets IT v1.0 - Sistema de Soporte Técnico
          </div>
        </div>
      </div>
    </div>
  );
};
