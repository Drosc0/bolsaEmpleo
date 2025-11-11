import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { User } from '../../user/user.entity';

// Define el tipo de datos esperado en el payload del token
export interface JwtPayload {
  email: string;
  sub: number; // User ID
  role: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {
    super({
      // Extrae el token del header Bearer (ej: Authorization: Bearer <token>)
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, // NestJS verifica la expiración automáticamente
      // Usar la misma clave secreta definida en el .env y JwtModule
      secretOrKey:
        configService.get<string>('JWT_SECRET') || 'FALLBACK_SECRET_KEY',
    });
  }

  /**
   * Método de validación: se ejecuta después de que el token es decodificado y verificado.
   * La validación exitosa devuelve el objeto User, el cual es adjuntado a req.user.
   */
  async validate(payload: JwtPayload): Promise<User> {
    // Llamamos al método que busca al usuario usando solo el ID (payload.sub),
    // ya que la contraseña no se pasa en la estrategia JWT.
    const user = await this.authService.getUserByIdForJwt(payload.sub);

    if (!user) {
      // Lanza un error si el usuario no existe (ej: fue eliminado) o si hay algún problema.
      throw new UnauthorizedException(
        'Token inválido o usuario no encontrado.',
      );
    }

    // Devuelve el objeto User. Passport lo adjuntará a req.user
    return user;
  }
}
