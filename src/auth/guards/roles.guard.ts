import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User, UserRole } from '../entities/user.entity';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. Obtener los roles requeridos de los metadatos de la ruta (@Roles('empresa'))
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true; // Si no hay roles definidos, el acceso es permitido
    }

    // 2. Obtener el usuario autenticado (adjuntado por JwtAuthGuard)
    const { user } = context.switchToHttp().getRequest<{ user: User }>();

    if (!user) {
      return false; // Si no hay usuario, denegar acceso
    }

    // 3. Verificar si el rol del usuario está incluido en los roles requeridos
    return requiredRoles.some((role) => user.role === role);
  }
}
