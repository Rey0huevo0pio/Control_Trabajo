/**
 * ============================================================================
 * 👤 ROLE PERMISSIONS - Roles y permisos (Web)
 * ============================================================================
 */
import React from 'react';

const rolesData = [
  {
    id: 'vigilante',
    name: 'Vigilante',
    description: 'Personal de seguridad en sitio',
    permissions: ['dashboard_ver', 'chat_ver', 'chat_enviar', 'tickets_ver', 'tickets_crear', 'archivero_ver'],
    color: '#5856D6',
  },
  {
    id: 'supervisor',
    name: 'Supervisor',
    description: 'Supervisa vigilantes y coordina',
    permissions: ['dashboard_ver', 'chat_ver', 'chat_enviar', 'chat_crear_grupo', 'tickets_ver', 'tickets_crear', 'tickets_asignar', 'archivero_ver', 'archivero_crear', 'archivero_subir', 'instalaciones_ver'],
    color: '#34C759',
  },
  {
    id: 'rh',
    name: 'RRHH',
    description: 'Gestión de recursos humanos',
    permissions: ['usuarios_ver', 'usuarios_crear', 'usuarios_editar', 'dashboard_ver', 'reportes_ver', 'reportes_exportar', 'chat_ver', 'chat_enviar', 'chat_crear_grupo', 'tickets_ver', 'tickets_crear', 'tickets_editar', 'tickets_asignar', 'archivero_ver', 'archivero_crear', 'archivero_subir', 'instalaciones_ver'],
    color: '#FF9500',
  },
  {
    id: 'it',
    name: 'TI',
    description: 'Soporte técnico y sistemas',
    permissions: Object.values([
      'usuarios_ver', 'usuarios_crear', 'usuarios_editar', 'usuarios_eliminar',
      'dashboard_ver', 'reportes_ver', 'reportes_exportar',
      'chat_ver', 'chat_enviar', 'chat_crear_grupo',
      'tickets_ver', 'tickets_crear', 'tickets_editar', 'tickets_asignar', 'tickets_eliminar',
      'archivero_ver', 'archivero_crear', 'archivero_subir', 'archivero_eliminar',
      'instalaciones_ver', 'instalaciones_crear', 'instalaciones_editar', 'instalaciones_eliminar',
    ]),
    color: '#007AFF',
  },
  {
    id: 'admin',
    name: 'Administrador',
    description: 'Acceso completo al sistema',
    permissions: Object.values([
      'usuarios_ver', 'usuarios_crear', 'usuarios_editar', 'usuarios_eliminar',
      'dashboard_ver', 'reportes_ver', 'reportes_exportar',
      'chat_ver', 'chat_enviar', 'chat_crear_grupo',
      'tickets_ver', 'tickets_crear', 'tickets_editar', 'tickets_asignar', 'tickets_eliminar',
      'archivero_ver', 'archivero_crear', 'archivero_subir', 'archivero_eliminar',
      'instalaciones_ver', 'instalaciones_crear', 'instalaciones_editar', 'instalaciones_eliminar',
    ]),
    color: '#FF3B30',
  },
];

export function RolePermissions() {
  return (
    <div>
      <h3 style={{ marginBottom: 16 }}>Roles del Sistema</h3>
      
      {rolesData.map((role) => (
        <div key={role.id} style={{
          backgroundColor: 'white', borderRadius: 14, marginBottom: 16, overflow: 'hidden',
        }}>
          <div style={{
            padding: 16, display: 'flex', alignItems: 'center', gap: 12,
            borderBottom: '1px solid #F2F2F7',
          }}>
            <div style={{
              width: 12, height: 12, borderRadius: 6, backgroundColor: role.color,
            }} />
            <div>
              <h4 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>{role.name}</h4>
              <p style={{ margin: 0, fontSize: 13, color: '#8E8E93' }}>{role.description}</p>
            </div>
          </div>
          <div style={{ padding: 16 }}>
            <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Permisos:</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {role.permissions.map((perm, idx) => (
                <span key={idx} style={{
                  padding: '4px 10px', backgroundColor: '#F2F2F7', borderRadius: 6,
                  fontSize: 12, color: '#3C3C43',
                }}>
                  {perm}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default RolePermissions;