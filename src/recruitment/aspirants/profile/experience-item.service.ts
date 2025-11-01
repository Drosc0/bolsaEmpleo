import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ExperienceItem } from '../entities/experience-item.entity';
import { ProfileService } from './profile.service';
import {
  CreateExperienceItemDto,
  UpdateExperienceItemDto,
} from '../dto/experience-item.dto'; // Asumimos estos DTOs

@Injectable()
export class ExperienceItemService {
  constructor(
    @InjectRepository(ExperienceItem)
    private experienceRepository: Repository<ExperienceItem>,
    private profileService: ProfileService,
  ) {}

  /**
   * Crea un ítem de experiencia laboral para el perfil del usuario.
   */
  async create(
    userId: number,
    dto: CreateExperienceItemDto,
  ): Promise<ExperienceItem> {
    const profile = await this.profileService.findByUserId(userId);
    if (!profile) {
      throw new NotFoundException('Perfil de aspirante no encontrado.');
    }

    try {
      const newExperience = this.experienceRepository.create({
        ...dto,
        profileId: profile.id,
      });

      return this.experienceRepository.save(newExperience);
    } catch (error) {
      throw new InternalServerErrorException(
        'Error al guardar la experiencia laboral.',
      );
    }
  }

  /**
   * Actualiza un ítem de experiencia laboral específico.
   */
  async update(
    userId: number,
    experienceId: number,
    dto: UpdateExperienceItemDto,
  ): Promise<ExperienceItem> {
    const experience = await this.experienceRepository.findOne({
      where: { id: experienceId },
      relations: ['profile'],
    });

    if (!experience) {
      throw new NotFoundException('Experiencia laboral no encontrada.');
    }

    // Asegura que la experiencia pertenece al usuario autenticado
    if (experience.profile.userId !== userId) {
      throw new ForbiddenException(
        'No tienes permiso para modificar esta experiencia.',
      );
    }

    this.experienceRepository.merge(experience, dto);

    try {
      return this.experienceRepository.save(experience);
    } catch (error) {
      throw new InternalServerErrorException(
        'Error al actualizar la experiencia laboral.',
      );
    }
  }

  /**
   * Elimina un ítem de experiencia laboral.
   */
  async remove(userId: number, experienceId: number): Promise<void> {
    const experience = await this.experienceRepository.findOne({
      where: { id: experienceId },
      relations: ['profile'],
    });

    if (!experience) {
      throw new NotFoundException('Experiencia laboral no encontrada.');
    }

    if (experience.profile.userId !== userId) {
      throw new ForbiddenException(
        'No tienes permiso para eliminar esta experiencia.',
      );
    }

    await this.experienceRepository.delete(experienceId);
  }
}
