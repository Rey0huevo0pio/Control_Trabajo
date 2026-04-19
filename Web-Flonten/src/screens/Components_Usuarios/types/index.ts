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
} as const;

export type UserRoleValue = typeof UserRole[keyof typeof UserRole];

export interface RoleDefinition {
  id: string;
  name: string;
  description: string;
  permissions: Record<string, boolean>;
  color: string;
  icon: string;
}

export interface Employee {
  id: string;
  Control_Usuario: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  departamento: string;
  puesto: string;
  rol: UserRoleValue;
  activo: boolean;
  fechaIngreso: string;
  permisos: string[];
}

export default {
  UserRole,
  RoleDefinition,
  Employee,
};