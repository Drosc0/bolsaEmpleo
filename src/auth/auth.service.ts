import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from '../user/user.entity';
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
    // Se asume que el 'companyName' (si aplica) se maneja en el DTO o en lógica posterior
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
      // Puedes incluir companyName aquí si está en la entidad User y es necesario en el front
      // companyName: user.companyName,
    };

    return {
      token: this.jwtService.sign(payload),
    };
  }

  // Utilizado por JwtStrategy: busca un usuario basándose únicamente en el ID (sub)
  async getUserByIdForJwt(id: number): Promise<User | null> {
    const user = await this.usersRepository.findOneBy({ id });

    if (!user) {
      return null; // Usuario no encontrado
    }

    // Devolver el usuario excluyendo la contraseña
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;
    return result as User;
  }

  async validateLocalUser(
    email: string,
    password: string,
  ): Promise<User | null> {
    const user = await this.usersRepository.findOne({ where: { email } });

    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return null;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...result } = user;
    return result as User;
  }
}
