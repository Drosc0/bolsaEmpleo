import { Module } from '@nestjs/common';

// Importar todos los sub-módulos de reclutamiento
import { AspirantsModule } from './aspirants/aspirants.module'; // Perfiles y CV del aspirante
import { CompaniesModule } from './companies/companies.module'; // Perfiles y Ofertas de la empresa
import { ApplicationsModule } from './applications/applications.module'; // Postulaciones

@Module({
  imports: [AspirantsModule, CompaniesModule, ApplicationsModule],
  controllers: [],
  providers: [],
  exports: [AspirantsModule, CompaniesModule, ApplicationsModule],
})
export class RecruitmentModule {}
