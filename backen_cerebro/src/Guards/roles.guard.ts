/**
 * ============================================================================
 * 👥 ROLES GUARD - Verificación de Roles (RBAC)
 * ============================================================================
 *
 * QUÉ HACE ESTE ARCHIVO:
 * - Verifica que el usuario tenga UNO de los roles requeridos
 * - Se ejecuta DESPUÉS de JwtAuthGuard (necesita req.user)
 * - Si el usuario no tiene rol permitido → 403 Forbidden
 *
 * CÓMO FUNCIONA:
 * 1. Obtiene roles requeridos del decorator @Roles()
 *    Ejemplo: @Roles(RolUsuario.ADMIN, RolUsuario.IT)
 * 2. Obtiene rol del usuario de req.user.rol
 * 3. Compara: si rol del usuario está en requiredRoles → ✅
 * 4. Si no coincide → lanza ForbiddenException
 *
 * CONEXIONES:
 * - Decorador: @Roles() en decorators.ts
 * - Modelo: RolUsuario (../Models/Usuarios/usuario.schema.ts)
 * - Usado en: Controllers que requieren roles específicos
 *
 * USO EN CONTROLLER:
 * ```typescript
 * @UseGuards(JwtAuthGuard, RolesGuard)
 * @Roles(RolUsuario.ADMIN, RolUsuario.IT)
 * @Delete('users/:id')
 * deleteUser(@Param('id') id: string) {
 *   // Solo ADMIN o IT pueden acceder
 * }
 * ```
 *
 * ROLES DISPONIBLES:
 * - RolUsuario.VIGILANTE
 * - RolUsuario.SUPERVISOR
 * - RolUsuario.RH
 * - RolUsuario.IT
 * - RolUsuario.ADMIN
 *
 * ============================================================================
 */
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolUsuario } from '../Models/Usuarios/usuario.schema';

export const ROLES_KEY = 'roles';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<RolUsuario[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user) {
      throw new ForbiddenException('No autenticado');
    }

    const hasRole = requiredRoles.includes(user.rol as RolUsuario);

    if (!hasRole) {
      throw new ForbiddenException(
        `No tiene el rol requerido. Roles permitidos: ${requiredRoles.join(', ')}`,
      );
    }

    return true;
  }
}
