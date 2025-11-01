import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ApplicationsService } from './applications.service';
import { ApplicationsController } from './applications.controller';
import { Application } from './entities/application.entity';
import { JobOffer } from '../companies/job-offers/job-offer.entity';
import { AspirantProfile } from '../aspirants/entities/aspirant-profile.entity';

@Module({
  imports: [
    // 1. Entidad principal del módulo
    TypeOrmModule.forFeature([Application]),
    // 2. Dependencias externas para la lógica de postulación
    TypeOrmModule.forFeature([JobOffer, AspirantProfile]),
  ],
  controllers: [ApplicationsController],
  providers: [ApplicationsService],
  exports: [ApplicationsService], // Exportar si otros módulos lo necesitan (ej. tests)
})
export class ApplicationsModule {}
