import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';

// Módulos de la Aplicación
import { AuthModule } from './auth/auth.module';
import { RecruitmentModule } from './recruitment/recruitment.module';

// Guardias Globales
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';

@Module({
  imports: [
    // 1. Configuración Global
    ConfigModule.forRoot({
      isGlobal: true, // Hace que las variables de entorno estén disponibles en toda la app
    }),

    // 2. Conexión a la Base de Datos
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres', // Cambia a 'mysql', 'sqlite', etc., según tu base de datos
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),

        // Carga automática de todas las entidades
        autoLoadEntities: true,
        // ¡Usar 'synchronize: true' solo en desarrollo!
        synchronize: configService.get<string>('NODE_ENV') !== 'production',
      }),
    }),

    // 3. Módulos de Funcionalidad
    AuthModule,
    RecruitmentModule, // Este módulo debe importar todos los sub-módulos (Companies, Aspirants, Applications)
  ],
  controllers: [],
  providers: [
    // 4. Guardias JWT Globales
    // Establecer JwtAuthGuard como un guard global, protegiendo todas las rutas por defecto.
    // Solo las rutas marcadas con @Public() serán accesibles.
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    // Registrar RolesGuard globalmente (se ejecuta después de JwtAuthGuard)
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
