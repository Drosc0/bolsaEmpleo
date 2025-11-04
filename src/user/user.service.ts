import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'; // Ajusta según tu ORM (TypeORM, Mongoose, Prisma, etc.)
import { Repository } from 'typeorm'; // Ajusta según tu ORM
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    // Inyecta el repositorio de la entidad User
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  // Usado por la AuthLocalStrategy y el Login
  async findOneByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  //USADO POR JwtStrategy (necesita solo el ID para validar el token)
  async findOneById(id: number): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  // Puedes añadir métodos CRUD aquí (create, update, findAll, delete)
  // async create(userData: Partial<User>): Promise<User> { ... }
}
