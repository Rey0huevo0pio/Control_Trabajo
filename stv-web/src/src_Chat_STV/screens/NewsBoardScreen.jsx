/**
 * ============================================================================
 * 📰 NEWS BOARD SCREEN - Tablero de noticias (Web)
 * ============================================================================
 *
 * QUÉ HACE:
 * - Tablero de noticias y comunicados de la empresa
 * - Noticias con fecha, autor, categoría
 * - Indicador de noticias no leídas
 *
 * ============================================================================
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';

export const NewsBoardScreen = () => {
  const navigate = useNavigate();

  const news = [
    { id: '1', title: 'Nuevo sistema de tickets implementado', summary: 'A partir de hoy, todas las solicitudes de soporte técnico se gestionarán a través del nuevo sistema.', author: 'Departamento IT', date: 'Hace 2 horas', category: 'Tecnología', read: false, icon: '💻' },
    { id: '2', title: 'Política de vacaciones actualizada', summary: 'Se han actualizado las políticas de vacaciones para 2026. Revisa los cambios importantes.', author: 'Recursos Humanos', date: 'Hace 1 día', category: 'RRHH', read: false, icon: '🏖️' },
    { id: '3', title: 'Mantenimiento programado del servidor', summary: 'El próximo sábado se realizará mantenimiento preventivo. Habrá interrupción de 2 a 4 horas.', author: 'IT Infrastructure', date: 'Hace 2 días', category: 'Aviso', read: true, icon: '⚙️' },
    { id: '4', title: 'Capacitación de seguridad', summary: 'Se invita a todo el personal a la capacitación obligatoria de seguridad el próximo viernes.', author: 'Seguridad', date: 'Hace 3 días', category: 'Capacitación', read: true, icon: '🛡️' },
  ];

  const categories = ['Todas', 'Tecnología', 'RRHH', 'Aviso', 'Capacitación'];
  const [selectedCategory, setSelectedCategory] = React.useState('Todas');

  const filtered = selectedCategory === 'Todas' ? news : news.filter(n => n.category === selectedCategory);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F2F2F7' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 32px' }}>
        {/* Header */}
        <div style={{
          backgroundColor: '#FF3B30', padding: '24px 32px',
          borderRadius: 20, marginBottom: 20,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={() => navigate('/chat')} style={{
              width: 40, height: 40, borderRadius: 20, border: 'none',
              backgroundColor: 'rgba(255,255,255,0.2)', cursor: 'pointer',
              fontSize: 18, color: 'white',
            }}>←</button>
            <div>
              <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: 'white' }}>
                Noticias y Carteles
              </h2>
              <p style={{ margin: '4px 0 0', fontSize: 14, color: 'rgba(255,255,255,0.8)' }}>
                Comunicados oficiales de la empresa
              </p>
            </div>
          </div>
        </div>

        {/* Filtros por categoría */}
        <div style={{
          backgroundColor: 'white', padding: 12, borderRadius: 16,
          marginBottom: 20, border: '1px solid #D1D1D6',
          display: 'flex', gap: 8, overflowX: 'auto',
        }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '6px 14px', borderRadius: 16, border: 'none',
                backgroundColor: selectedCategory === cat ? '#FF3B30' : '#F2F2F7',
                color: selectedCategory === cat ? 'white' : '#3C3C43',
                fontSize: 13, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Lista de noticias */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map((item) => (
            <div
              key={item.id}
              style={{
                backgroundColor: 'white', padding: 24, borderRadius: 16,
                border: item.read ? '1px solid #D1D1D6' : '2px solid #FF3B30',
                cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <div style={{
                  width: 56, height: 56, borderRadius: 14, backgroundColor: '#F2F2F7',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28,
                  flexShrink: 0,
                }}>{item.icon}</div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 18, fontWeight: 700, color: '#000' }}>{item.title}</span>
                    {!item.read && (
                      <span style={{
                        backgroundColor: '#FF3B30', width: 10, height: 10,
                        borderRadius: 5, display: 'inline-block',
                      }} />
                    )}
                  </div>
                  <p style={{ fontSize: 14, color: '#3C3C43', lineHeight: 1.6, margin: '0 0 8px' }}>
                    {item.summary}
                  </p>
                  <div style={{ display: 'flex', gap: 16, fontSize: 12, color: '#8E8E93' }}>
                    <span>👤 {item.author}</span>
                    <span>🕐 {item.date}</span>
                    <span style={{
                      backgroundColor: '#F2F2F7', padding: '2px 8px', borderRadius: 8,
                    }}>{item.category}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
