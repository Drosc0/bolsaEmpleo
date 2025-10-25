import { Module } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { User } from './entities/user.entity';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    // TypeOrmModule.forFeature([User]), // Registrar la entidad User
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        // JWT_SECRET de tu archivo .env
        secret: configService.get<string>('JWT_SECRET'),
        // Opciones de configuración (ej: duración del token)
        signOptions: { expiresIn: '60m' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy], // Registrar JwtStrategy
  exports: [AuthService, JwtModule], // Exportar para usar en otros módulos
})
export class AuthModule {}
