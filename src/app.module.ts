import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';

// Módulos de la Aplicación
import { AuthModule } from './auth/auth.module';
import { RecruitmentModule } from './recruitment/recruitment.module';
//import { UserModule } from './user/user.module';

// Guardias Globales
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';

@Module({
  imports: [
    // 1. Configuración Global (Lee el .env)
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // 2. Conexión a la Base de Datos (Usando DATABASE_URL)
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'),

        // Carga automática de todas las entidades
        autoLoadEntities: true,

        synchronize: configService.get<string>('NODE_ENV') !== 'production',

        // Configuración de SSL/TLS para conexiones externas (como Supabase)
        ssl:
          configService.get<string>('NODE_ENV') === 'production'
            ? { rejectUnauthorized: false }
            : false,
      }),
    }),

    // 3. Módulos de Funcionalidad
    AuthModule,
    RecruitmentModule,
  ],
  controllers: [],
  providers: [
    // 4. Guardias JWT Globales
    // JwtAuthGuard: Protege todas las rutas por defecto (se debe usar @Public() para rutas públicas)
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    // RolesGuard: Se ejecuta después de JwtAuthGuard para verificar los roles de usuario
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
