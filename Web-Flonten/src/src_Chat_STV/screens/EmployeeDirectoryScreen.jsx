/**
 * ============================================================================
 * 📋 EMPLOYEE DIRECTORY SCREEN - Directorio de empleados (Web)
 * ============================================================================
 *
 * QUÉ HACE:
 * - Directorio de todos los empleados de la organización
 * - Búsqueda por nombre, departamento, cargo
 * - Estado online/offline
 *
 * ============================================================================
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const EmployeeDirectoryScreen = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDept, setFilterDept] = useState('todos');

  const employees = [
    { id: '1', name: 'Juan Perez', role: 'Vigilante', dept: 'Seguridad', online: true, phone: '555-0101', email: 'juan.perez@stv.com', avatar: '👤' },
    { id: '2', name: 'Maria Garcia', role: 'Supervisora', dept: 'Seguridad', online: true, phone: '555-0102', email: 'maria.garcia@stv.com', avatar: '👩' },
    { id: '3', name: 'Carlos Lopez', role: 'Técnico IT', dept: 'IT', online: false, phone: '555-0103', email: 'carlos.lopez@stv.com', avatar: '👨‍💻' },
    { id: '4', name: 'Ana Martinez', role: 'Coordinadora RH', dept: 'RH', online: true, phone: '555-0104', email: 'ana.martinez@stv.com', avatar: '👩‍💼' },
    { id: '5', name: 'Pedro Sanchez', role: 'Administrador', dept: 'Admin', online: false, phone: '555-0105', email: 'pedro.sanchez@stv.com', avatar: '👨‍💼' },
    { id: '6', name: 'Laura Diaz', role: 'Técnico IT', dept: 'IT', online: true, phone: '555-0106', email: 'laura.diaz@stv.com', avatar: '👩‍🔧' },
  ];

  const departments = ['todos', 'Seguridad', 'IT', 'RH', 'Admin'];

  const filtered = employees.filter(emp => {
    const matchName = emp.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchDept = filterDept === 'todos' || emp.dept === filterDept;
    return matchName && matchDept;
  });

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F2F2F7' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 32px' }}>
        {/* Header */}
        <div style={{
          backgroundColor: '#FF9500', padding: '24px 32px',
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
                Directorio de Empleados
              </h2>
              <p style={{ margin: '4px 0 0', fontSize: 14, color: 'rgba(255,255,255,0.8)' }}>
                {employees.length} empleados registrados
              </p>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div style={{
          backgroundColor: 'white', padding: 16, borderRadius: 16, marginBottom: 16,
          border: '1px solid #D1D1D6',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <span style={{ color: '#8E8E93' }}>🔍</span>
            <input
              type="text" placeholder="Buscar por nombre..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ flex: 1, border: 'none', outline: 'none', fontSize: 15, background: 'transparent' }}
            />
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setFilterDept(dept)}
                style={{
                  padding: '6px 14px', borderRadius: 16, border: 'none',
                  backgroundColor: filterDept === dept ? '#FF9500' : '#F2F2F7',
                  color: filterDept === dept ? 'white' : '#3C3C43',
                  fontSize: 13, fontWeight: 600, cursor: 'pointer',
                }}
              >
                {dept === 'todos' ? 'Todos' : dept}
              </button>
            ))}
          </div>
        </div>

        {/* Lista de empleados */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
          {filtered.map((emp) => (
            <div
              key={emp.id}
              style={{
                backgroundColor: 'white', padding: 20, borderRadius: 16,
                border: '1px solid #D1D1D6', textAlign: 'center',
              }}
            >
              <div style={{ position: 'relative', display: 'inline-block', marginBottom: 12 }}>
                <div style={{
                  width: 64, height: 64, borderRadius: 32, backgroundColor: '#F2F2F7',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32,
                  margin: '0 auto',
                }}>{emp.avatar}</div>
                {emp.online && (
                  <div style={{
                    position: 'absolute', bottom: 2, right: 2,
                    width: 16, height: 16, borderRadius: 8, backgroundColor: '#34C759',
                    border: '3px solid white',
                  }} />
                )}
              </div>
              <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 4 }}>{emp.name}</div>
              <div style={{ fontSize: 14, color: '#8E8E93', marginBottom: 4 }}>{emp.role}</div>
              <div style={{
                display: 'inline-block', backgroundColor: '#F2F2F7', padding: '4px 12px',
                borderRadius: 12, fontSize: 12, fontWeight: 600, color: '#3C3C43', marginBottom: 12,
              }}>{emp.dept}</div>
              <div style={{ fontSize: 13, color: '#8E8E93' }}>
                <div>📞 {emp.phone}</div>
                <div>📧 {emp.email}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
