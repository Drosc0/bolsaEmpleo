import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileController } from './aspirants/profile/profile.controller';
import { ProfileService } from './aspirants/profile/profile.service';
import { AspirantProfile } from './aspirants/entities/aspirant-profile.entity';
import { ExperienceItem } from './aspirants/entities/experience-item.entity';
import { SkillItem } from './aspirants/entities/skill-item.entity';

@Module({
  imports: [
    // Registra todas las entidades de este módulo
    TypeOrmModule.forFeature([AspirantProfile, ExperienceItem, SkillItem]),
  ],
  controllers: [ProfileController],
  providers: [ProfileService],
  // Exportamos los servicios si otros módulos necesitan interactuar con el perfil
  exports: [TypeOrmModule],
})
export class RecruitmentModule {}
