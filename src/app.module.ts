import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import * as path from 'path'; // 💡 NECESARIO para manejar rutas de migraciones

// Módulos de la Aplicación
import { AuthModule } from './auth/auth.module';
import { RecruitmentModule } from './recruitment/recruitment.module';

// Guardias Globales
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';

@Module({
  imports: [
    // 1. Configuración Global (Lee el .env)
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // 2. Conexión a la Base de Datos (TypeORM)
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const dbUrl = configService.get<string>('DATABASE_URL');
        const isProd = configService.get<string>('NODE_ENV') === 'production';

        console.log('🔗 [DB Config] URL de la Base de Datos leída:', dbUrl);

        return {
          type: 'postgres',
          url: dbUrl,

          // Carga automática de todas las entidades
          autoLoadEntities: true,

          // Sincronizar solo en desarrollo. En producción, usa migraciones.
          synchronize: !isProd,

          //CONFIGURACIÓN PARA MIGRACIONES
          migrationsRun: false, // Nunca ejecutar migraciones automáticamente al iniciar
          entities: [path.join(__dirname, '**/*.entity{.ts,.js}')], // Rutas de las entidades
          migrations: [path.join(__dirname, 'migrations/*{.ts,.js}')], // Rutas de los archivos de migración

          // Necesario para el CLI (comando 'typeorm')
          cli: {
            migrationsDir: 'src/migrations',
          },

          // Configuración de SSL/TLS para conexiones externas (como Supabase)
          ssl: isProd ? { rejectUnauthorized: false } : false,
        };
      },
    }),

    // 3. Módulos de Funcionalidad
    AuthModule,
    RecruitmentModule,
  ],
  controllers: [],
  providers: [
    // 4. Guardias JWT Globales
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
