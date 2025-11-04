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
    // 1. Configuración Global (Lee el .env)
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // 2. Conexión a la Base de Datos (Usando DATABASE_URL)
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        // 🛑 VERIFICACIÓN: Imprimir la URL antes de usarla
        const dbUrl = configService.get<string>('DATABASE_URL');
        console.log('🔗 [DB Config] URL de la Base de Datos leída:', dbUrl);
        // 🛑 FIN DE VERIFICACIÓN

        return {
          type: 'postgres',
          url: dbUrl, // Usamos la variable de la URL completa

          // Carga automática de todas las entidades
          autoLoadEntities: true,

          synchronize: configService.get<string>('NODE_ENV') !== 'production',

          // Configuración de SSL/TLS para conexiones externas (como Supabase)
          ssl:
            configService.get<string>('NODE_ENV') === 'production'
              ? { rejectUnauthorized: false }
              : false,
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
