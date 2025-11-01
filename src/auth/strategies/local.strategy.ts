import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { AuthService } from '../auth.service';
import { User } from 'src/auth/entities/user.entity'; // Asegúrate de que esta ruta sea correcta

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      // Usamos 'email' en lugar de 'username' por defecto para el cuerpo de la solicitud (req.body)
      usernameField: 'email',
    });
  }

  /**
   * Método llamado por Passport para verificar las credenciales.
   * * @param email El valor del campo 'email' de la solicitud.
   * @param password La contraseña proporcionada.
   * @returns El objeto User si las credenciales son válidas.
   */
  async validate(email: string, password: string): Promise<User> {
    // Llamada al servicio para validar el usuario (verifica la contraseña hasheada)
    const user = await this.authService.validateUser(email, password);

    if (!user) {
      // Lanza una excepción que NestJS intercepta y convierte en HTTP 401 Unauthorized
      throw new UnauthorizedException('Credenciales de acceso incorrectas.');
    }

    // Retorna el objeto user.
    // Passport adjuntará este objeto a req.user (ej: req.user.id, req.user.role).
    return user;
  }
}
