import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobOffer } from './job-offer.entity';
import { CompanyProfile } from '../entities/company-profile.entity';
import { CreateJobOfferDto, UpdateJobOfferDto } from '../dto/job-offer.dto';

@Injectable()
export class JobOffersService {
  constructor(
    @InjectRepository(JobOffer)
    private jobOfferRepository: Repository<JobOffer>,
    @InjectRepository(CompanyProfile)
    private companyProfileRepository: Repository<CompanyProfile>,
  ) {}

  // =========================================================================
  // LÓGICA DE GESTIÓN DE OFERTAS
  // =========================================================================

  /**
   * Obtiene todas las ofertas de empleo (visible para aspirantes).
   */
  async findAll(): Promise<JobOffer[]> {
    // Solo lista las ofertas con estado 'Abierta' y carga los datos de la empresa.
    return this.jobOfferRepository.find({
      where: { status: 'Abierta' },
      relations: ['company'],
    });
  }

  /**
   * Obtiene una oferta por su ID (visible para aspirantes).
   */
  async findOne(id: number): Promise<JobOffer> {
    const offer = await this.jobOfferRepository.findOne({
      where: { id },
      relations: ['company'],
    });

    if (!offer) {
      throw new NotFoundException(`Oferta con ID ${id} no encontrada.`);
    }
    return offer;
  }

  // =========================================================================
  // LÓGICA EXCLUSIVA PARA EMPRESAS
  // =========================================================================

  /**
   * Crea una nueva oferta de trabajo.
   * Requiere el userId para vincularla a un CompanyProfile.
   */
  async create(
    userId: number,
    createJobOfferDto: CreateJobOfferDto,
  ): Promise<JobOffer> {
    // 1. Buscar el perfil de la empresa asociado al usuario
    const companyProfile = await this.companyProfileRepository.findOneBy({
      userId,
    });

    if (!companyProfile) {
      throw new BadRequestException(
        'El usuario no tiene un perfil de empresa configurado. Cree uno primero.',
      );
    }

    // 2. Crear la entidad de oferta, vinculándola al ID de la empresa
    const newOffer = this.jobOfferRepository.create({
      ...createJobOfferDto,
      companyId: companyProfile.id,
    });

    // 3. Guardar en la base de datos
    return this.jobOfferRepository.save(newOffer);
  }

  /**
   * Actualiza una oferta de trabajo específica, asegurando que solo la empresa creadora la modifique.
   */
  async update(
    userId: number,
    id: number,
    updateJobOfferDto: UpdateJobOfferDto,
  ): Promise<JobOffer> {
    const offer = await this.jobOfferRepository.findOne({
      where: { id },
      relations: ['company'],
    });

    if (!offer) {
      throw new NotFoundException(`Oferta con ID ${id} no encontrada.`);
    }

    // 1. Verificación de propiedad: Asegurarse de que el usuario logueado sea el dueño de la empresa
    if (offer.company.userId !== userId) {
      throw new BadRequestException(
        'No tienes permiso para modificar esta oferta.',
      );
    }

    // 2. Aplicar los cambios
    this.jobOfferRepository.merge(offer, updateJobOfferDto);

    // 3. Guardar y devolver
    return this.jobOfferRepository.save(offer);
  }

  /**
   * Elimina una oferta de trabajo, asegurando la verificación de propiedad.
   */
  async remove(
    userId: number,
    id: number,
  ): Promise<{ deleted: boolean; message: string }> {
    const offer = await this.jobOfferRepository.findOne({
      where: { id },
      relations: ['company'],
    });

    if (!offer) {
      return { deleted: false, message: 'Oferta no encontrada.' };
    }

    // Verificación de propiedad
    if (offer.company.userId !== userId) {
      throw new BadRequestException(
        'No tienes permiso para eliminar esta oferta.',
      );
    }

    await this.jobOfferRepository.delete(id);
    return { deleted: true, message: `Oferta ${id} eliminada exitosamente.` };
  }
}
