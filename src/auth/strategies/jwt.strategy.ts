import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { User } from '../entities/user.entity';

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
      // Extrae el token del header Bearer
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // Usar la misma clave secreta definida en el .env y JwtModule
      secretOrKey:
        configService.get<string>('JWT_SECRET') || 'FALLBACK_SECRET_KEY',
    });
  }

  // Método de validación: se ejecuta después de que el token es verificado
  async validate(payload: JwtPayload): Promise<User> {
    const user = await this.authService.validateUser(payload.sub);

    if (!user) {
      throw new UnauthorizedException();
    }

    // Adjunta el objeto User a req.user
    return user;
  }
}
