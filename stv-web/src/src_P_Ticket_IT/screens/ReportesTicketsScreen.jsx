/**
 * ============================================================================
 * REPORTES TICKETS SCREEN - Reportes y métricas de tickets (Web)
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

export const ReportesTicketsScreen = () => {
  const navigate = useNavigate();
  const [periodo, setPeriodo] = useState('semana');

  // Mock data
  const stats = {
    total: 156,
    pendientes: 23,
    enProgreso: 18,
    completados: 98,
    cerrados: 17,
    tiempoPromedio: '4.2 horas',
    tasaResolucion: '87%',
  };

  const porCategoria = [
    { categoria: 'Hardware', cantidad: 45, porcentaje: 29, color: '#007AFF' },
    { categoria: 'Software', cantidad: 38, porcentaje: 24, color: '#5856D6' },
    { categoria: 'Red', cantidad: 32, porcentaje: 21, color: '#FF9500' },
    { categoria: 'Electricidad', cantidad: 22, porcentaje: 14, color: '#34C759' },
    { categoria: 'Otro', cantidad: 19, porcentaje: 12, color: '#8E8E93' },
  ];

  porInstalacion = [
    { instalacion: 'Oficina Central', cantidad: 67, porcentaje: 43 },
    { instalacion: 'Sucursal Norte', cantidad: 45, porcentaje: 29 },
    { instalacion: 'Almacén Principal', cantidad: 28, porcentaje: 18 },
    { instalacion: 'Sucursal Sur', cantidad: 16, porcentaje: 10 },
  ];

  const porPrioridad = [
    { prioridad: 'Urgente', cantidad: 8, color: '#FF3B30', emoji: '🔴' },
    { prioridad: 'Alta', cantidad: 32, color: '#FF9500', emoji: '🟠' },
    { prioridad: 'Media', cantidad: 78, color: '#007AFF', emoji: '🔵' },
    { prioridad: 'Baja', cantidad: 38, color: '#34C759', emoji: '🟢' },
  ];

  const topTecnico = [
    { nombre: 'María García', resueltos: 34, avatar: 'MG', tiempoPromedio: '3.2h' },
    { nombre: 'Carlos López', resueltos: 28, avatar: 'CL', tiempoPromedio: '4.1h' },
    { nombre: 'Ana Martínez', resueltos: 22, avatar: 'AM', tiempoPromedio: '3.8h' },
    { nombre: 'Pedro Sánchez', resueltos: 14, avatar: 'PS', tiempoPromedio: '5.2h' },
  ];

  const periodos = [
    { value: 'semana', label: 'Esta Semana' },
    { value: 'mes', label: 'Este Mes' },
    { value: 'trimestre', label: 'Trimestre' },
    { value: 'anio', label: 'Este Año' },
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F2F2F7' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 32px' }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #34C759 0%, #30D158 100%)',
          padding: '24px', borderRadius: 20, marginBottom: 24, position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', right: -30, top: -40, opacity: 0.1, fontSize: 200 }}>📊</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, position: 'relative', zIndex: 1 }}>
            <button onClick={() => navigate(-1)} style={{
              width: 44, height: 44, borderRadius: 22, border: '2px solid rgba(255,255,255,0.3)',
              backgroundColor: 'rgba(255,255,255,0.2)', cursor: 'pointer', fontSize: 20, color: 'white',
            }}>←</button>
            <div>
              <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: 'white' }}>Reportes y Métricas</h2>
              <p style={{ margin: '4px 0 0 0', fontSize: 14, color: 'rgba(255,255,255,0.9)' }}>
                Estadísticas y análisis de tickets
              </p>
            </div>
          </div>
        </div>

        {/* Selector de periodo */}
        <div style={{
          backgroundColor: 'white', padding: 12, borderRadius: 16, marginBottom: 20,
          border: '1px solid #D1D1D6', display: 'flex', gap: 8,
        }}>
          {periodos.map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriodo(p.value)}
              style={{
                flex: 1, padding: '10px 16px', borderRadius: 12, border: 'none',
                backgroundColor: periodo === p.value ? '#34C759' : '#F2F2F7',
                color: periodo === p.value ? 'white' : '#3C3C43',
                fontSize: 13, fontWeight: 600, cursor: 'pointer',
              }}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* KPIs principales */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: 16, marginBottom: 24,
        }}>
          {[
            { label: 'Total Tickets', value: stats.total, icon: '📋', color: '#007AFF' },
            { label: 'Pendientes', value: stats.pendientes, icon: '⏳', color: '#FF9500' },
            { label: 'En Progreso', value: stats.enProgreso, icon: '🔄', color: '#5856D6' },
            { label: 'Completados', value: stats.completados, icon: '✅', color: '#34C759' },
            { label: 'Tiempo Promedio', value: stats.tiempoPromedio, icon: '⏱️', color: '#FF3B30' },
            { label: 'Tasa Resolución', value: stats.tasaResolucion, icon: '📈', color: '#34C759' },
          ].map((kpi) => (
            <div key={kpi.label} style={{
              backgroundColor: 'white', padding: 20, borderRadius: 16,
              border: '1px solid #D1D1D6', textAlign: 'center',
            }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{kpi.icon}</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: kpi.color, marginBottom: 4 }}>{kpi.value}</div>
              <div style={{ fontSize: 12, color: '#8E8E93', fontWeight: 600 }}>{kpi.label}</div>
            </div>
          ))}
        </div>

        {/* Por Categoría */}
        <div style={{
          backgroundColor: 'white', padding: 24, borderRadius: 16, marginBottom: 20,
          border: '1px solid #D1D1D6',
        }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: 17, fontWeight: 700 }}>Por Categoría</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {porCategoria.map((item) => (
              <div key={item.categoria}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 14, fontWeight: 600 }}>{item.categoria}</span>
                  <span style={{ fontSize: 13, color: '#8E8E93' }}>{item.cantidad} ({item.porcentaje}%)</span>
                </div>
                <div style={{
                  height: 8, backgroundColor: '#F2F2F7', borderRadius: 4, overflow: 'hidden',
                }}>
                  <div style={{
                    height: '100%', width: `${item.porcentaje}%`, backgroundColor: item.color,
                    borderRadius: 4, transition: 'width 0.5s ease',
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Por Prioridad */}
        <div style={{
          backgroundColor: 'white', padding: 24, borderRadius: 16, marginBottom: 20,
          border: '1px solid #D1D1D6',
        }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: 17, fontWeight: 700 }}>Por Prioridad</h3>
          <div style={{ display: 'flex', gap: 16 }}>
            {porPrioridad.map((item) => (
              <div key={item.prioridad} style={{
                flex: 1, textAlign: 'center', padding: 16,
                backgroundColor: `${item.color}10`, borderRadius: 12,
              }}>
                <span style={{ fontSize: 24 }}>{item.emoji}</span>
                <div style={{ fontSize: 28, fontWeight: 800, color: item.color, marginTop: 8 }}>
                  {item.cantidad}
                </div>
                <div style={{ fontSize: 12, color: '#8E8E93', fontWeight: 600, marginTop: 4 }}>
                  {item.prioridad}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Por Instalación */}
        <div style={{
          backgroundColor: 'white', padding: 24, borderRadius: 16, marginBottom: 20,
          border: '1px solid #D1D1D6',
        }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: 17, fontWeight: 700 }}>Por Instalación</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {porInstalacion.map((item) => (
              <div key={item.instalacion} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '12px 16px', backgroundColor: '#F9F9F9', borderRadius: 12,
              }}>
                <span style={{ fontSize: 14, fontWeight: 600 }}>{item.instalacion}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 100, height: 6, backgroundColor: '#E5E5EA', borderRadius: 3, overflow: 'hidden',
                  }}>
                    <div style={{
                      height: '100%', width: `${item.porcentaje}%`, backgroundColor: '#007AFF', borderRadius: 3,
                    }} />
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 600, minWidth: 60, textAlign: 'right' }}>
                    {item.cantidad}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Técnicos */}
        <div style={{
          backgroundColor: 'white', padding: 24, borderRadius: 16, marginBottom: 20,
          border: '1px solid #D1D1D6',
        }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: 17, fontWeight: 700 }}>Top Técnicos</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {topTecnico.map((tecnico, index) => (
              <div key={tecnico.nombre} style={{
                display: 'flex', gap: 16, alignItems: 'center', padding: '12px 16px',
                backgroundColor: index === 0 ? '#FFF9E6' : '#F9F9F9', borderRadius: 12,
              }}>
                <span style={{
                  fontSize: 20, fontWeight: 800, color: index === 0 ? '#FF9500' : '#8E8E93',
                  minWidth: 30,
                }}>
                  #{index + 1}
                </span>
                <div style={{
                  width: 44, height: 44, borderRadius: 22, backgroundColor: '#5856D6',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontWeight: 700, fontSize: 14,
                }}>{tecnico.avatar}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 600 }}>{tecnico.nombre}</div>
                  <div style={{ fontSize: 12, color: '#8E8E93' }}>Promedio: {tecnico.tiempoPromedio}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: '#34C759' }}>{tecnico.resueltos}</div>
                  <div style={{ fontSize: 11, color: '#8E8E93' }}>resueltos</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
