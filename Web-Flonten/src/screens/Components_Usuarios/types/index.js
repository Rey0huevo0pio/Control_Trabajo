/**
 * ============================================================================
 * 👤 TIPOS PARA USUARIOS (Web)
 * ============================================================================
 */
export const UserRole = {
  VIGILANTE: 'vigilante',
  SUPERVISOR: 'supervisor',
  RH: 'rh',
  IT: 'it',
  ADMIN: 'admin',
};

export const RoleDefinition = {
  id: 'id',
  name: 'name',
  description: 'description',
  permissions: {},
  color: '#000',
  icon: '',
};

export const Employee = {
  id: '',
  Control_Usuario: '',
  nombre: '',
  apellido: '',
  email: '',
  telefono: '',
  departamento: '',
  puesto: '',
  rol: 'vigilante',
  activo: true,
  fechaIngreso: '',
  permisos: [],
};

export default {
  UserRole,
  RoleDefinition,
  Employee,
};