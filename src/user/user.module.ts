import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';

@Module({
  imports: [
    // Define el repositorio de User dentro de este módulo
    TypeOrmModule.forFeature([User]),
  ],
  // inyecten el UserRepository (@InjectRepository(User))
  exports: [TypeOrmModule.forFeature([User])],
})
export class UserModule {}
