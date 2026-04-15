/**
 * ============================================================================
 * 👤 USER LIST - Lista de usuarios (Web)
 * ============================================================================
 */
import React, { useState, useEffect } from 'react';
import { userService } from '../../../services/userService';

const roleColors = {
  admin: '#FF3B30',
  it: '#007AFF',
  rh: '#FF9500',
  supervisor: '#34C759',
  vigilante: '#5856D6',
};

const roleLabels = {
  admin: 'Administrador',
  it: 'TI',
  rh: 'RRHH',
  supervisor: 'Supervisor',
  vigilante: 'Vigilante',
};

export function UserList({ onUserSelect, onEdit, onCreate, onRefresh }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRol, setFilterRol] = useState('all');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getUsers();
      setUsers(data || []);
    } catch (err) {
      console.error('[UserList] Error:', err);
      setError('Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = !searchQuery || 
      user.nombre?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.apellido?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.Control_Usuario?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRol = filterRol === 'all' || user.rol === filterRol;
    return matchesSearch && matchesRol;
  });

  const getInitials = (user) => {
    const n = (user.nombre || '').charAt(0);
    const a = (user.apellido || '').charAt(0);
    return (n + a).toUpperCase() || '?';
  };

  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <p>Cargando usuarios...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <p style={{ color: '#FF3B30' }}>{error}</p>
        <button onClick={loadUsers} style={{ marginTop: 12, padding: '8px 16px' }}>
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <input
          type="text"
          placeholder="Buscar usuarios..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            flex: 1, padding: '10px 14px', borderRadius: 10, border: '1px solid #D1D1D6',
            fontSize: 14,
          }}
        />
        <select
          value={filterRol}
          onChange={(e) => setFilterRol(e.target.value)}
          style={{
            padding: '10px 14px', borderRadius: 10, border: '1px solid #D1D1D6',
            fontSize: 14, backgroundColor: 'white',
          }}
        >
          <option value="all">Todos los roles</option>
          <option value="admin">Administrador</option>
          <option value="it">TI</option>
          <option value="rh">RRHH</option>
          <option value="supervisor">Supervisor</option>
          <option value="vigilante">Vigilante</option>
        </select>
        <button
          onClick={onCreate}
          style={{
            backgroundColor: '#007AFF', color: 'white', border: 'none',
            borderRadius: 10, padding: '10px 20px', fontSize: 14, fontWeight: 600,
          }}
        >
          + Nuevo Usuario
        </button>
      </div>

      {filteredUsers.length === 0 ? (
        <div style={{ padding: 40, textAlign: 'center', backgroundColor: 'white', borderRadius: 14 }}>
          <p style={{ fontSize: 48, marginBottom: 12 }}>👥</p>
          <p style={{ fontWeight: 600 }}>No hay usuarios</p>
        </div>
      ) : (
        <div style={{ backgroundColor: 'white', borderRadius: 14, overflow: 'hidden' }}>
          {filteredUsers.map((user, idx) => (
            <div
              key={user._id || user.id || idx}
              onClick={() => onUserSelect(user)}
              style={{
                padding: 16, display: 'flex', alignItems: 'center', gap: 14,
                borderBottom: idx < filteredUsers.length - 1 ? '1px solid #F2F2F7' : 'none',
                cursor: 'pointer', backgroundColor: user.activo === false ? '#F2F2F7' : 'white',
              }}
            >
              <div style={{
                width: 48, height: 48, borderRadius: 24,
                backgroundColor: roleColors[user.rol] || '#8E8E93',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontSize: 16, fontWeight: 700,
              }}>
                {getInitials(user)}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontWeight: 600 }}>
                    {user.nombre} {user.apellido}
                  </span>
                  {!user.activo && (
                    <span style={{ fontSize: 12, color: '#FF3B30', backgroundColor: '#FFE5E3', padding: '2px 8px', borderRadius: 4 }}>
                      Inactivo
                    </span>
                  )}
                </div>
                <p style={{ fontSize: 13, color: '#8E8E93', margin: 0 }}>
                  {user.Control_Usuario} • {roleLabels[user.rol] || user.rol}
                </p>
              </div>

              <button
                onClick={(e) => { e.stopPropagation(); onEdit(user); }}
                style={{
                  padding: '8px 14px', borderRadius: 8, border: '1px solid #D1D1D6',
                  backgroundColor: 'white', cursor: 'pointer', fontSize: 13,
                }}
              >
                Editar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default UserList;