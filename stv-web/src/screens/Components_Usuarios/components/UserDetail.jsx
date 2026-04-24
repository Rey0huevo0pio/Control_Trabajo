/**
 * ============================================================================
 * 👤 USER DETAIL - Detalle de usuario (Web)
 * ============================================================================
 */
import React from 'react';

const roleLabels = {
  admin: 'Administrador',
  it: 'TI',
  rh: 'RRHH',
  supervisor: 'Supervisor',
  vigilante: 'Vigilante',
};

export function UserDetail({ user, onBack, onEdit, onDelete, onToggleStatus }) {
  if (!user) {
    return <div style={{ padding: 40, textAlign: 'center' }}>Cargando...</div>;
  }

  const getInitials = () => {
    const n = (user.nombre || '').charAt(0);
    const a = (user.apellido || '').charAt(0);
    return (n + a).toUpperCase() || '?';
  };

  return (
    <div style={{ backgroundColor: 'white', borderRadius: 14, overflow: 'hidden' }}>
      <div style={{
        padding: '16px 20px', backgroundColor: '#007AFF',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <button onClick={onBack} style={{
          width: 36, height: 36, borderRadius: 18, border: 'none',
          backgroundColor: 'rgba(255,255,255,0.2)', cursor: 'pointer',
          fontSize: 16, color: 'white',
        }}>←</button>
        <span style={{ color: 'white', fontSize: 17, fontWeight: 700 }}>Detalle de Usuario</span>
      </div>

      <div style={{ padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24 }}>
          <div style={{
            width: 80, height: 80, borderRadius: 40,
            backgroundColor: '#007AFF', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontSize: 28, fontWeight: 700,
          }}>
            {getInitials()}
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>
              {user.nombre} {user.apellido}
            </h2>
            <p style={{ margin: '4px 0 0', fontSize: 15, color: '#8E8E93' }}>
              {user.Control_Usuario} • {roleLabels[user.rol] || user.rol}
            </p>
            {!user.activo && (
              <span style={{ fontSize: 13, color: '#FF3B30', backgroundColor: '#FFE5E3', padding: '2px 10px', borderRadius: 4, display: 'inline-block', marginTop: 6 }}>
                Inactivo
              </span>
            )}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{ padding: 16, backgroundColor: '#F2F2F7', borderRadius: 10 }}>
            <p style={{ margin: 0, fontSize: 12, color: '#8E8E93' }}>Teléfono</p>
            <p style={{ margin: '4px 0 0', fontSize: 15, fontWeight: 600 }}>{user.telefono || '-'}</p>
          </div>
          <div style={{ padding: 16, backgroundColor: '#F2F2F7', borderRadius: 10 }}>
            <p style={{ margin: 0, fontSize: 12, color: '#8E8E93' }}>Email</p>
            <p style={{ margin: '4px 0 0', fontSize: 15, fontWeight: 600 }}>{user.email || '-'}</p>
          </div>
          <div style={{ padding: 16, backgroundColor: '#F2F2F7', borderRadius: 10 }}>
            <p style={{ margin: 0, fontSize: 12, color: '#8E8E93' }}>Departamento</p>
            <p style={{ margin: '4px 0 0', fontSize: 15, fontWeight: 600 }}>{user.departamento || '-'}</p>
          </div>
          <div style={{ padding: 16, backgroundColor: '#F2F2F7', borderRadius: 10 }}>
            <p style={{ margin: 0, fontSize: 12, color: '#8E8E93' }}>Puesto</p>
            <p style={{ margin: '4px 0 0', fontSize: 15, fontWeight: 600 }}>{user.puesto || '-'}</p>
          </div>
          {user.fechaIngreso && (
            <div style={{ padding: 16, backgroundColor: '#F2F2F7', borderRadius: 10 }}>
              <p style={{ margin: 0, fontSize: 12, color: '#8E8E93' }}>Fecha de Ingreso</p>
              <p style={{ margin: '4px 0 0', fontSize: 15, fontWeight: 600 }}>
                {new Date(user.fechaIngreso).toLocaleDateString('es-MX')}
              </p>
            </div>
          )}
        </div>

        {user.permisos && user.permisos.length > 0 && (
          <div style={{ marginTop: 24 }}>
            <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Permisos</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {user.permisos.map((perm, idx) => (
                <span key={idx} style={{
                  padding: '4px 12px', backgroundColor: '#E5F1FF', borderRadius: 16,
                  fontSize: 13, color: '#007AFF',
                }}>
                  {perm}
                </span>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
          <button onClick={() => onEdit(user)} style={{
            flex: 1, padding: '12px 20px', borderRadius: 10, border: '1px solid #D1D1D6',
            backgroundColor: 'white', fontSize: 14, cursor: 'pointer',
          }}>
            Editar
          </button>
          <button onClick={() => onToggleStatus(user)} style={{
            flex: 1, padding: '12px 20px', borderRadius: 10, border: 'none',
            backgroundColor: user.activo !== false ? '#FF3B30' : '#34C759',
            color: 'white', fontSize: 14, fontWeight: 600,
          }}>
            {user.activo !== false ? 'Desactivar' : 'Activar'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserDetail;