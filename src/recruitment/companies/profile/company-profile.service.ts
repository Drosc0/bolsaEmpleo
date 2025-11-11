import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CompanyProfile } from '../entities/company-profile.entity';
import { User, UserRole } from '../../../user/user.entity';
import {
  CreateCompanyProfileDto,
  UpdateCompanyProfileDto,
} from '../dto/company-profile.dto';

@Injectable()
export class CompanyProfileService {
  constructor(
    @InjectRepository(CompanyProfile)
    private companyProfileRepository: Repository<CompanyProfile>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // LÓGICA DE CREACIÓN Y GESTIÓN

  /**
   * Crea un perfil de empresa vacío usando solo el objeto User.
   * Esto satisface la restricción OneToOne inmediatamente después del registro.
   */
  async createDefault(user: User): Promise<CompanyProfile> {
    try {
      // Creamos la entrada de perfil solo con la FK y datos por defecto
      const newProfile = this.companyProfileRepository.create({
        userId: user.id, // Aquí puedes añadir cualquier campo NO NULO de CompanyProfile con un valor por defecto.
        // Si 'name' o 'description' es NOT NULL, debes asignarles un string vacío ('') o un valor placeholder.
        // Ejemplo si 'name' fuera obligatorio: name: 'Nueva Empresa',
      });

      return await this.companyProfileRepository.save(newProfile);
    } catch (error) {
      console.error('Error al crear el perfil de empresa por defecto:', error);
      throw new InternalServerErrorException(
        'Fallo al inicializar el perfil de la empresa.',
      );
    }
  }

  /**
   * Crea el perfil de la empresa.
   * Solo permite la creación si el usuario tiene el rol 'EMPRESA' y no tiene perfil.
   */
  async create(
    userId: number,
    createProfileDto: CreateCompanyProfileDto,
  ): Promise<CompanyProfile> {
    // 1. Verificar si el perfil ya existe para este usuario
    const existingProfile = await this.companyProfileRepository.findOneBy({
      userId,
    });
    if (existingProfile) {
      throw new BadRequestException(
        'El usuario ya tiene un perfil de empresa creado.',
      );
    }

    // 2. Opcional: Verificar el rol del usuario (aunque el RolesGuard ya lo hace, esto da mejor feedback)
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user || user.role !== UserRole.EMPRESA) {
      throw new ForbiddenException(
        'Solo los usuarios con rol de empresa pueden crear un perfil de empresa.',
      );
    }

    try {
      // 3. Crear y guardar el nuevo perfil
      const newProfile = this.companyProfileRepository.create({
        ...createProfileDto,
        userId: userId, // Vinculación con el usuario autenticado
      });

      const profile = await this.companyProfileRepository.save(newProfile);

      // 4. Actualizar la relación OneToOne inversa en la entidad User (opcional, TypeORM maneja la mayoría de las veces)
      // user.companyProfile = profile;
      // await this.userRepository.save(user);

      return profile;
    } catch (error) {
      console.error('Error al crear perfil de empresa:', error);
      throw new InternalServerErrorException(
        'Error interno al crear el perfil de empresa.',
      );
    }
  }

  /**
   * Obtiene el perfil de la empresa por su ID.
   */
  async findOne(profileId: number): Promise<CompanyProfile> {
    const profile = await this.companyProfileRepository.findOne({
      where: { id: profileId },
      relations: ['offers'], // Cargar las ofertas asociadas
    });

    if (!profile) {
      throw new NotFoundException(
        `Perfil de empresa con ID ${profileId} no encontrado.`,
      );
    }

    return profile;
  }

  /**
   * Obtiene el perfil de la empresa asociado al usuario autenticado.
   */
  async findMyProfile(userId: number): Promise<CompanyProfile> {
    const profile = await this.companyProfileRepository.findOne({
      where: { userId: userId },
      relations: ['offers'],
    });

    if (!profile) {
      throw new NotFoundException(
        'Perfil de empresa no encontrado para este usuario.',
      );
    }

    return profile;
  }

  /**
   * Actualiza el perfil de la empresa.
   * Solo permite la actualización al dueño del perfil.
   */
  async update(
    userId: number,
    updateProfileDto: UpdateCompanyProfileDto,
  ): Promise<CompanyProfile> {
    // 1. Buscar el perfil asociado al usuario autenticado
    const profile = await this.companyProfileRepository.findOneBy({ userId });

    if (!profile) {
      throw new NotFoundException(
        'Perfil de empresa no encontrado para este usuario.',
      );
    }

    // 2. Aplicar los cambios y guardar
    this.companyProfileRepository.merge(profile, updateProfileDto);

    try {
      return await this.companyProfileRepository.save(profile);
    } catch (error) {
      console.error('Error DB al actualizar perfil:', error);
      throw new InternalServerErrorException('Error al actualizar el perfil.');
    }
  }
}
