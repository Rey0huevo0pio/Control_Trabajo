import { SetMetadata } from '@nestjs/common';
import { RolUsuario } from '../Models/Usuarios/usuario.schema';

export const ROLES_KEY = 'roles';
export const PERMISSIONS_KEY = 'permissions';

export const Roles = (...roles: RolUsuario[]) => SetMetadata(ROLES_KEY, roles);

export const Permissions = (...permissions: string[]) => SetMetadata(PERMISSIONS_KEY, permissions);
