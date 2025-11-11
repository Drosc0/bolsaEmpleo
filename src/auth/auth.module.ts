import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';

import { User } from '../user/user.entity';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AspirantsModule } from '../recruitment/aspirants/aspirants.module';
import { CompaniesModule } from '../recruitment/companies/companies.module';

@Module({
  imports: [
    // 1. Módulos de persistencia y autenticación base
    TypeOrmModule.forFeature([User]), // Registrar la entidad User
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '60m' },
      }),
    }),

    //IMPORTAR los módulos que contienen y exportan los servicios de perfil
    AspirantsModule, // Provee ProfileService
    CompaniesModule, // Provee CompanyProfileService
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy], // Registrar JwtStrategy
  exports: [AuthService, JwtModule], // Exportar para usar en otros módulos
})
export class AuthModule {}
