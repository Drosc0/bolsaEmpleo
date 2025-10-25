import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { AspirantProfile } from '../entities/aspirant-profile.entity';
import { CreateProfileDto, UpdateProfileDto } from './profile.dto';
import { ExperienceItem } from '../entities/experience-item.entity';
import { SkillItem } from '../entities/skill-item.entity';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(AspirantProfile)
    private profileRepository: Repository<AspirantProfile>,
    @InjectRepository(ExperienceItem)
    private experienceRepository: Repository<ExperienceItem>,
    @InjectRepository(SkillItem)
    private skillRepository: Repository<SkillItem>,
  ) {}

  /**
   * Busca un perfil de aspirante por el ID del usuario.
   * Retorna null si no se encuentra.
   */
  async findByUserId(userId: number): Promise<AspirantProfile | null> {
    try {
      return await this.profileRepository.findOne({
        where: { userId },
        relations: ['experience', 'skills'],
      });
    } catch (error) {
      console.error('Error al buscar el perfil del aspirante:', error);
      throw new InternalServerErrorException(
        'Error al buscar el perfil del aspirante.',
      );
    }
  }

  /**
   * Crea un nuevo perfil de aspirante.
   */
  async create(
    userId: number,
    createProfileDto: CreateProfileDto,
  ): Promise<AspirantProfile> {
    const existingProfile = await this.profileRepository.findOneBy({ userId });
    if (existingProfile) {
      throw new BadRequestException(
        'Este usuario ya tiene un perfil de aspirante creado.',
      );
    }

    // 1. Separar datos base de colecciones anidadas
    const { skills, experience, ...profileBaseData } = createProfileDto;

    const newProfileData: DeepPartial<AspirantProfile> = {
      ...profileBaseData,
      userId,
    };

    // 2. Crear la entidad principal
    const newProfile = this.profileRepository.create(newProfileData);

    try {
      // 3. Crear y asignar las entidades de relación (transformando DTOs)
      if (skills) {
        newProfile.skills = skills.map((sDto) =>
          this.skillRepository.create({ ...sDto, profile: newProfile }),
        );
      }
      if (experience) {
        newProfile.experience = experience.map((eDto) =>
          this.experienceRepository.create({ ...eDto, profile: newProfile }),
        );
      }

      // 4. Guardar la entidad (TypeORM maneja la inserción en cascada)
      await this.profileRepository.save(newProfile);

      // 5. Devolver el perfil guardado con las relaciones cargadas
      return (await this.findByUserId(userId)) as AspirantProfile;
    } catch (error) {
      console.error('Error al guardar el nuevo perfil de aspirante:', error);
      throw new InternalServerErrorException(
        'Error al guardar el nuevo perfil de aspirante.',
      );
    }
  }

  /**
   * Actualiza el perfil existente de un usuario.
   */
  async updateByUserId(
    userId: number,
    updateProfileDto: UpdateProfileDto,
  ): Promise<AspirantProfile> {
    const profileToUpdate = await this.profileRepository.findOneBy({ userId });

    if (!profileToUpdate) {
      throw new NotFoundException(
        'Perfil de aspirante no encontrado para actualización.',
      );
    }

    try {
      // Aplicar el DTO a la entidad.
      this.profileRepository.merge(profileToUpdate, updateProfileDto);

      // Manejo de colecciones anidadas: Borrar las viejas y recrear si se proporcionan datos
      if (updateProfileDto.skills) {
        await this.skillRepository.delete({ profile: profileToUpdate });
        profileToUpdate.skills = updateProfileDto.skills.map((s) =>
          this.skillRepository.create({ ...s, profileId: profileToUpdate.id }),
        );
      }
      if (updateProfileDto.experience) {
        await this.experienceRepository.delete({ profile: profileToUpdate });
        profileToUpdate.experience = updateProfileDto.experience.map((e) =>
          this.experienceRepository.create({
            ...e,
            profileId: profileToUpdate.id,
          }),
        );
      }
      await this.profileRepository.save(profileToUpdate);

      // Devolver la versión actualizada y completa
      return (await this.findByUserId(userId)) as AspirantProfile;
    } catch (error) {
      console.error('Error al actualizar el perfil del aspirante:', error);
      throw new InternalServerErrorException(
        'Error al actualizar el perfil del aspirante.',
      );
    }
  }

  /**
   * Elimina el perfil de aspirante del usuario.
   */
  async deleteProfile(
    userId: number,
  ): Promise<{ success: boolean; message: string }> {
    const profileToDelete = await this.profileRepository.findOneBy({ userId });

    if (!profileToDelete) {
      return { success: false, message: 'Perfil no encontrado.' };
    }

    try {
      await this.profileRepository.delete(profileToDelete.id);

      return {
        success: true,
        message: 'Perfil de aspirante eliminado exitosamente.',
      };
    } catch (error) {
      console.error('Error al eliminar perfil:', error);
      return {
        success: false,
        message: 'Error interno al eliminar el perfil.',
      };
    }
  }
}
