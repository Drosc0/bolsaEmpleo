import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../entities/user.entity';

// Clave usada por el RolesGuard para buscar los metadatos
export const ROLES_KEY = 'roles';

// Decorador para aplicar roles a un controlador o método
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
