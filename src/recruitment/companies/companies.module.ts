import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyProfile } from './entities/company-profile.entity';
import { JobOffer } from './job-offers/job-offer.entity';
import { JobOffersController } from './job-offers/job-offers.controller';
import { JobOffersService } from './job-offers/job-offers.service';

@Module({
  imports: [TypeOrmModule.forFeature([CompanyProfile, JobOffer])],
  controllers: [JobOffersController],
  providers: [JobOffersService],
  exports: [TypeOrmModule, JobOffersService],
})
export class CompaniesModule {}
