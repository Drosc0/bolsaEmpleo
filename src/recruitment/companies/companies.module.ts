import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Perfil de la Empresa
import { CompanyProfile } from './entities/company-profile.entity';
import { CompanyProfileService } from './profile/company-profile.service';
import { CompanyProfileController } from './profile/company-profile.controller';

// Ofertas de Trabajo
import { JobOffer } from './job-offers/job-offer.entity';
import { JobOffersService } from './job-offers/job-offers.service';
import { JobOffersController } from './job-offers/job-offers.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CompanyProfile,
      JobOffer, // Incluir la entidad de ofertas aquí
    ]),
  ],
  controllers: [
    CompanyProfileController,
    JobOffersController, // Rutas para /job-offers
  ],
  providers: [CompanyProfileService, JobOffersService],
  exports: [
    CompanyProfileService,
    JobOffersService,
    TypeOrmModule, // Importante para que ApplicationsModule pueda inyectar JobOffer
  ],
})
export class CompaniesModule {}
