import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Cargar variables de entorno del archivo .env
dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

// Obtener la URL de la base de datos
const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  throw new Error('DATABASE_URL no está definido en el entorno.');
}

const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  url: dbUrl,

  // Rutas de TypeORM (Ajusta estas rutas si tu estructura es diferente)
  entities: [path.join(__dirname, '**/*.entity{.ts,.js}')], // Busca todas las entidades
  migrations: [path.join(__dirname, 'src/migrations/*{.ts,.js}')], // Rutas de las migraciones

  // El CLI necesita este campo para saber qué script usar para crear/ejecutar migraciones
  migrationsTableName: 'typeorm_migrations',

  // Configuración de SSL/TLS (Idéntica a tu AppModule)
  ssl: isProduction ? { rejectUnauthorized: false } : false,

  // Opciones adicionales
  synchronize: false,
  logging: true,
};

export const AppDataSource = new DataSource(dataSourceOptions);
