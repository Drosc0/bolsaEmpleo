import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entidades y Servicios del Perfil Base
import { AspirantProfile } from './entities/aspirant-profile.entity';
import { ProfileController } from './profile/profile.controller';
import { ProfileService } from './profile/profile.service';

// Entidades y Servicios del CV
import { ExperienceItem } from './entities/experience-item.entity';
import { ExperienceItemService } from './profile/experience-item.service';
import { ExperienceItemController } from './profile/experience-item.controller';

import { SkillItem } from './entities/skill-item.entity';
import { SkillItemService } from './profile/skill-item.service';
import { SkillItemController } from './profile/skill-item.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([AspirantProfile, ExperienceItem, SkillItem]),
  ],
  controllers: [
    ProfileController,
    ExperienceItemController,
    SkillItemController,
  ],
  providers: [ProfileService, ExperienceItemService, SkillItemService],
  exports: [
    // Exportamos los servicios principales que la aplicación podría necesitar fuera (ej. en ApplicationsService)
    ProfileService,
    TypeOrmModule,
  ],
})
export class AspirantsModule {}
