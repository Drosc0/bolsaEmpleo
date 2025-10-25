import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { Public } from './decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Ruta para registrar un nuevo usuario (Aspirante o Empresa).
   * El rol se define en el RegisterDto.
   * POST /auth/register
   */
  @Public() // excluye esta ruta de la protección JWT global
  @Post('register')
  async register(
    @Body() registerDto: RegisterDto,
  ): Promise<{ message: string }> {
    return this.authService.register(registerDto);
  }

  /**
   * Ruta para iniciar sesión.
   * POST /auth/login
   * Retorna un token JWT.
   */
  @Public()
  @HttpCode(HttpStatus.OK) // Asegura que la respuesta sea 200 OK en lugar de 201 Created por defecto en POST
  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<{ token: string }> {
    return this.authService.login(loginDto);
  }
}
