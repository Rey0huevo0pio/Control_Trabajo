/**
 * ============================================================================
 * 🛡️ JWT AUTH GUARD - Protección de Rutas con JWT
 * ============================================================================
 * 
 * QUÉ HACE ESTE ARCHIVO:
 * - Verifica que el request tenga un token JWT válido
 * - Se ejecuta ANTES de que el controller method se llame
 * - Si el token es inválido o expirado → 401 Unauthorized
 * - Si es válido → agrega user al request (req.user)
 * 
 * CÓMO FUNCIONA:
 * 1. Extrae token del header: Authorization: Bearer [token]
 * 2. Verifica firma con JWT_SECRET
 * 3. Verifica expiración
 * 4. Decodifica payload: { sub, Control_Usuario, rol }
 * 5. Busca usuario en BD (vía JwtStrategy)
 * 6. Si todo OK → permite pasar, req.user = usuario
 * 
 * CONEXIONES:
 * - JwtStrategy: ../Modules/Auth/jwt.strategy.ts (valida usuario)
 * - Usado en: Todos los controllers excepto Auth
 * - Frontend: Token se envía vía Axios interceptor (api.ts)
 * 
 * USO EN CONTROLLER:
 * ```typescript
 * @UseGuards(JwtAuthGuard)
 * @Get('protected')
 * protectedEndpoint(@Req() req) {
 *   // req.user está disponible
 *   return { userId: req.user.sub };
 * }
 * ```
 * 
 * ============================================================================
 */
import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }
}
