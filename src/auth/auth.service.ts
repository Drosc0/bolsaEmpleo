import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from './entities/user.entity';
import { RegisterDto, LoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  // --- REGISTRO ---
  async register(registerDto: RegisterDto): Promise<{ message: string }> {
    const { email, password, role } = registerDto;

    // 1. Verificar si el usuario ya existe
    const existingUser = await this.usersRepository.findOneBy({ email });
    if (existingUser) {
      throw new BadRequestException(
        'El correo electrónico ya está registrado.',
      );
    }

    // 2. Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Crear y guardar el usuario
    const newUser = this.usersRepository.create({
      email,
      password: hashedPassword,
      role,
    });
    await this.usersRepository.save(newUser);

    return { message: 'Registro exitoso. Ahora puedes iniciar sesión.' };
  }

  // --- LOGIN ---
  async login(loginDto: LoginDto): Promise<{ token: string }> {
    const { email, password } = loginDto;

    // 1. Buscar el usuario
    const user = await this.usersRepository.findOneBy({ email });
    if (!user) {
      throw new UnauthorizedException('Credenciales incorrectas.');
    }

    // 2. Comparar la contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales incorrectas.');
    }

    // 3. Generar el token JWT
    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role, // Incluir el rol en el token
    };

    return {
      token: this.jwtService.sign(payload),
    };
  }

  // Utilidad para la estrategia JWT: buscar usuario por ID
  async validateUser(email: string, password: string): Promise<User | null> {
    // 1. Buscar el usuario por email
    const user = await this.usersRepository.findOne({ where: { email } });

    if (!user) {
      return null; // Usuario no encontrado
    }

    // 2. Comparar la contraseña hasheada (usando bcrypt, etc.)
    const isPasswordValid = await bcrypt.compare(password, user.password); // Asumo bcrypt

    if (!isPasswordValid) {
      return null; // Contraseña incorrecta
    }

    // 3. Si es válido, devolver el usuario (sin el hash de la contraseña)
    // Usar una copia del objeto o seleccionar solo las propiedades necesarias
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...result } = user;
    return result as User;
  }
}
