import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
// Extiende la estrategia local, usando 'email' como usernameField por defecto
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email', // Le dice a Passport que use el campo 'email' como nombre de usuario
    });
  }

  // Este método es llamado por Passport para verificar las credenciales
  async validate(email: string, password: string): Promise<any> {
    // La lógica de validación real (comparar hash) está en el AuthService
    // Retorna el usuario si las credenciales son válidas
    const user = await this.authService.validateUser(email, password);

    if (!user) {
      throw new UnauthorizedException('Credenciales incorrectas.');
    }

    // Passport adjunta este objeto a req.user
    return user;
  }
}
